// TODO: Refactor this whole mess.

export const useDeckStore = defineStore("deck", () => {
  const client = useSupabaseClient<Database>();

  const slides = ref<SlidesModel[]>([]);
  const currentSlides = computed(() => slides.value[currentSlidesIndex.value]);
  const currentSlidesIndex = ref<number>(0);

  const EMPTY_TREE: Tree = {
    id: "",
    slides: "",
    name: "",
    path: "",
    type: "group",
    reference: "",
    children: [],
  };

  const tree = ref<Tree>(EMPTY_TREE);

  const selectedNode = ref<Tree | null>(null);

  const components = ref<ComponentModel[]>([]);

  const pendingChanges = ref<{
    nodes: PendingNode[];
    components: ComponentModel[];
  }>({
    nodes: [],
    components: [],
  });

  // Fetch nodes when the current slides change.
  watch(
    currentSlides,
    async () => {
      // Upsert pending changes if any.
      if (
        pendingChanges.value.nodes.length ||
        pendingChanges.value.components.length
      ) {
        await saveChanges();
      }

      // Reset the tree.
      if (!currentSlides.value) {
        tree.value = EMPTY_TREE;

        return;
      }

      await fetchAllNodes();
    },
    { immediate: true }
  );

  watch(currentSlidesIndex, async () => {
    // Reset the selected node.
    selectedNode.value = null;
  });

  watch(
    () => pendingChanges.value.nodes,
    async (pendingNodes) => {
      if (!pendingNodes.length) return;

      await fetchAllNodes();
    },
    { deep: true }
  );

  // Autosave nodes and components.
  watchDebounced(
    pendingChanges,
    async (changes) => {
      if (!changes.nodes.length && !changes.components.length) return;

      await saveChanges();
    },
    { debounce: 5000, deep: true }
  );

  async function fetchAllDecks() {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidarist: useAuthStore().user?.id })
      .order("last_modified", { ascending: true });

    if (error) throw error;

    return data;
  }

  async function fetchDeck(id: String | String[]) {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidarist: useAuthStore().user?.id })
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async function insertNewDeck() {
    const { data, error } = await client
      .from("decks")
      .insert({
        lapidarist: `${useAuthStore().user?.id}`,
        title: "Unnamed Deck",
      })
      .select()
      .single();

    if (error) throw error;

    navigateTo(`/atelier/${data?.id}`, {
      external: true,
      open: {
        target: "_blank",
      },
    });
  }

  async function deleteDeck(id: string) {
    const { data, error } = await client.from("decks").delete().eq("id", id);

    if (error) throw error;

    return data;
  }

  async function fetchAllSlides(deck: String | String[]) {
    const { data, error } = await client
      .from("slides")
      .select("*")
      .eq("deck", deck)
      .order("index", { ascending: true });

    if (error) throw error;

    if (data) slides.value = data;

    return data;
  }

  async function insertNewSlides(deck: string) {
    const { data, error } = await client
      .from("slides")
      .insert({
        deck: deck,
        index: slides.value.length,
      })
      .select();

    if (error) throw error;

    return data;
  }

  async function fetchAllNodes() {
    const { data, error } = await client
      .from("nodes")
      .select("*")
      .eq("slides", currentSlides.value.id)
      .order("path", { ascending: true });

    if (error) throw error;

    if (data) {
      const lookup: Record<string, Tree> = {};

      const fetchedComponents = await Promise.all(
        data.map((node) => fetchNodeComponents(node.id))
      );

      components.value = fetchedComponents.flat();

      // Process database nodes.
      data.forEach((node) => {
        lookup[node.path] = {
          ...node,
          children: [],
        };
      });

      // Process pending nodes.
      pendingChanges.value.nodes.forEach((node: PendingNode) => {
        if (!node._deleted) {
          lookup[node.path] = {
            ...node,
            children: [],
          };
        } else {
          delete lookup[node.path];
        }
      });

      Object.values(lookup).forEach((node) => {
        const parentPath = node.path.split(".").slice(0, -1).join(".");
        const parentNode = lookup[parentPath];

        if (parentNode) {
          parentNode.children.push(node);
        }
      });

      tree.value = lookup["root"];
    }

    return data;
  }

  async function insertNewNode(slides: string, name: string, type: NodeType) {
    pendingChanges.value.nodes.push({
      id: "",
      slides: slides,
      name: name,
      path:
        selectedNode.value?.type === "group"
          ? `${selectedNode.value.path}.${name}`
          : `root.${name}`,
      type: type,
      reference: "",
    });

    selectedNode.value = null;
  }

  async function deleteSelectedNode() {
    if (!selectedNode.value || selectedNode.value.path === "root") return;

    pendingChanges.value.nodes.push({
      ...selectedNode.value,
      _deleted: true,
    });

    selectedNode.value = null;
  }

  // TODO: Multiple changes of the same node at once will cause a conflict.
  function updateNode(tree: Tree) {
    const { children, ...node } = tree;

    pendingChanges.value.nodes.push(node);
  }

  async function fetchNodeComponents(node: string) {
    const { data, error } = await client
      .from("components")
      .select("*")
      .eq("node", node)
      .order("type", { ascending: true });

    if (error) throw error;

    return data;
  }

  async function updateNodeComponent(component: ComponentModel) {
    const index = components.value.findIndex(
      (c) => c.node === component.node && c.type === component.type
    );

    pendingChanges.value.components.push(components.value[index]);
  }

  async function saveChanges() {
    const nodesToUpsert = pendingChanges.value.nodes.filter(
      (node) => node.id && !node._deleted
    );
    const nodesToInsert = pendingChanges.value.nodes.filter(
      (node) => !node.id && !node._deleted
    );
    const nodesToDelete = pendingChanges.value.nodes.filter(
      (node) => node._deleted
    );

    // Node update.
    if (nodesToUpsert.length) {
      const { error } = await client.from("nodes").upsert(nodesToUpsert, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) throw error;
    }

    // Node insert.
    if (nodesToInsert.length) {
      const { error } = await client
        .from("nodes")
        // Remove the id and _deleted.
        .insert(nodesToInsert.map(({ id, _deleted, ...node }) => node));

      if (error) throw error;
    }

    // Node delete.
    if (nodesToDelete.length) {
      for (const node of nodesToDelete) {
        const { error } = await client.rpc("delete_node_and_children", {
          node_path: node.path,
          slides_id: node.slides,
        });

        if (error) throw error;
      }
    }

    // Component update.
    if (pendingChanges.value.components.length) {
      const { error } = await client
        .from("components")
        .upsert(pendingChanges.value.components, {
          onConflict: "node, type",
          ignoreDuplicates: false,
        });

      if (error) throw error;
    }

    pendingChanges.value = {
      nodes: [],
      components: [],
    };
  }

  return {
    slides,
    currentSlides,
    currentSlidesIndex,
    tree,
    selectedNode,
    components,
    pendingChanges,
    fetchAllDecks,
    fetchDeck,
    insertNewDeck,
    deleteDeck,
    fetchAllSlides,
    insertNewSlides,
    fetchAllNodes,
    insertNewNode,
    deleteSelectedNode,
    fetchNodeComponents,
    updateNode,
    updateNodeComponent,
  };
});
