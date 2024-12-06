// TODO: Refactor this whole mess.

export const useDeckStore = defineStore("deck", () => {
  const client = useSupabaseClient<Database>();

  const EMPTY_TREE: Tree = {
    id: "",
    slides: "",
    name: "",
    path: "",
    type: "group",
    reference: "",
    children: [],
  };

  const slides = ref<SlidesModel[]>([]);
  const currentSlides = computed(() => slides.value[currentSlidesIndex.value]);

  const trees = ref<Tree[]>([EMPTY_TREE]);
  const currentTree = computed(() => trees.value[currentSlidesIndex.value]);

  const components = ref<ComponentModel[][]>([]);
  const currentComponents = computed(
    () => components.value[currentSlidesIndex.value]
  );

  const currentSlidesIndex = ref<number>(0);
  const selectedNode = ref<Tree | null>(null);
  const slidesInLoading = ref<Set<number>>(new Set());

  const pendingChanges = ref<{
    nodes: PendingNode[];
    components: ComponentModel[];
  }>({
    nodes: [],
    components: [],
  });

  watch(slides, (newSlides) => {
    if (trees.value.length >= newSlides.length) return;

    // Initialise data for new slides.
    trees.value.push(EMPTY_TREE);
    components.value.push([]);
  });

  watch(currentSlides, async () => {
    if (
      !pendingChanges.value.nodes.length ||
      !pendingChanges.value.components.length
    )
      return;

    // Upsert pending changes if any.
    await saveChanges();
  });

  watch(currentTree, async () => {
    if (
      currentTree.value.id ||
      slidesInLoading.value.has(currentSlidesIndex.value)
    )
      return;

    // Fetch nodes for the current slides, then load the rest in parallel.
    await fetchAllNodes(currentSlidesIndex.value);
    await parallelLoad();
  });

  watch(currentSlidesIndex, async () => {
    // Reset the selected node.
    selectedNode.value = null;
  });

  watch(
    () => pendingChanges.value.nodes,
    async (pendingNodes) => {
      if (!pendingNodes.length) return;

      trees.value[currentSlidesIndex.value] = buildTree([
        ...flattenTree(currentTree.value),
        ...pendingNodes,
      ]);
    },
    { deep: true }
  );

  // Autosave nodes and components.
  watchDebounced(
    pendingChanges,
    async (changes) => {
      if (!changes.nodes.length && !changes.components.length) return;

      if (selectedNode.value) return;

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

  async function fetchAllNodes(index: number = currentSlidesIndex.value) {
    const { data, error } = await client
      .from("nodes")
      .select("*")
      .eq("slides", slides.value[index].id)
      .order("path", { ascending: true });

    if (error) throw error;

    if (data) {
      const fetchedComponents = await Promise.all(
        data.map((node) => fetchNodeComponents(node.id))
      );

      components.value[index] = fetchedComponents.flat();

      trees.value[index] = buildTree(data);
    }

    return data;
  }

  async function insertNewNode(slides: string, name: string, type: NodeType) {
    const { data: id, error } = await client.rpc("generate_uuid");

    if (error) throw error;

    const path =
      selectedNode.value?.type === "group"
        ? `${selectedNode.value.path}.${name}`
        : `root.${name}`;

    // Add node to pending changes.
    const node: PendingNode = {
      id: id,
      slides: slides,
      name: name,
      path: path,
      type: type,
      reference: "",
    };

    // Create default components
    const defaultComponents: ComponentModel[] = [
      {
        type: "base",
        node: id,
        data: {},
      },
    ];

    if (type === "text") {
      defaultComponents.push({
        type: "typography",
        node: id,
        data: {
          content: "New Text",
          size: 16,
          weight: 300,
          colour: "#151515",
        },
      });
    }

    pendingChanges.value.nodes.push(node);
    pendingChanges.value.components.push(...defaultComponents);

    components.value[currentSlidesIndex.value].push(...defaultComponents);

    selectedNode.value = node as Tree;
  }

  async function deleteSelectedNode() {
    if (!selectedNode.value || selectedNode.value.path === "root") return;

    pendingChanges.value.nodes.push({
      ...selectedNode.value,
      _deleted: true,
    });

    selectedNode.value = null;
  }

  function updateNode(tree: Tree) {
    const { children, ...node } = tree;

    const index = pendingChanges.value.nodes.findIndex(
      (pending) => pending.id === node.id
    );

    if (index !== -1) {
      pendingChanges.value.nodes.splice(index, 1);
    }

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
    const index = pendingChanges.value.components.findIndex(
      (c) => c.node === component.node && c.type === component.type
    );

    if (index !== -1) {
      pendingChanges.value.components[index] = component;
    } else {
      pendingChanges.value.components.push(component);
    }
  }

  function buildTree(nodes: NodeModel[] | PendingNode[]) {
    const lookup: Record<string, Tree> = {};

    // Process database nodes.
    nodes.forEach((node) => {
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

    return lookup["root"];
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

    // Node insert.
    if (nodesToInsert.length) {
      const { error } = await client
        .from("nodes")
        // Remove the id and _deleted fields.
        .insert(nodesToInsert.map(({ id, _deleted, ...node }) => node))
        .select();

      if (error) throw error;
    }

    // Node update.
    if (nodesToUpsert.length) {
      const { error } = await client.from("nodes").upsert(nodesToUpsert, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) throw error;
    }

    // Node delete.
    if (nodesToDelete.length) {
      for (const node of nodesToDelete) {
        if (node._pending) return;

        const { error } = await client.rpc("delete_node_and_children", {
          node_path: node.path,
          slides_id: node.slides,
        });

        if (error) throw error;
      }
    }

    // Component upsert.
    if (pendingChanges.value.components.length) {
      const validNodes = new Set(
        flattenTree(trees.value[currentSlidesIndex.value]).map(
          (node) => node.id
        )
      );

      // Filter nodes that still exists.
      const componentsToUpsert = pendingChanges.value.components.filter(
        (component) => validNodes.has(component.node)
      );

      const { error } = await client
        .from("components")
        .upsert(componentsToUpsert, {
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

  async function parallelLoad() {
    if (slidesInLoading.value.size >= slides.value.length) return;

    const slidesToLoad = slides.value
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== currentSlidesIndex.value &&
          !trees.value[index]?.id &&
          !slidesInLoading.value.has(index)
      );

    // Load all in parallel.
    await Promise.all(
      slidesToLoad.map(async (index) => {
        slidesInLoading.value.add(index);
        try {
          await fetchAllNodes(index);
        } finally {
          slidesInLoading.value.delete(index);
        }
      })
    );
  }

  const flattenTree = (tree: Tree): NodeModel[] => [
    tree,
    ...tree.children.flatMap(flattenTree),
  ];

  return {
    slides,
    currentSlides,
    currentSlidesIndex,
    trees,
    currentTree,
    components,
    currentComponents,
    selectedNode,
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
