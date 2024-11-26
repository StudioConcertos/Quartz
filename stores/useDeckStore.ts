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
    components: [],
  };

  const tree = ref<Tree>(EMPTY_TREE);

  const selectedNode = ref<HTMLLIElement | null>();

  const components = ref<ComponentModel[]>([]);
  const changedComponents = ref<ComponentModel[]>([]);

  // Fetch nodes when the current slides change.
  watchEffect(async () => {
    if (!currentSlides.value) {
      tree.value = EMPTY_TREE;

      return;
    }

    if (changedComponents.value.length) {
      await upsertComponents();
    }

    selectedNode.value = null;
    changedComponents.value = [];

    await fetchAllNodes();
  });

  // Autosave the components.
  watchDebounced(
    changedComponents,
    async (changes) => {
      if (!changes.length) return;

      await upsertComponents();
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
        title: `Unnamed Deck (${
          (
            await fetchAllDecks()
          ).filter((deck) => deck.title === "Unnamed Deck").length + 1
        })`,
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

      // Converts the data array into a hierachical tree.
      data.forEach((node, index) => {
        lookup[node.path] = {
          ...node,
          children: [],
          components: fetchedComponents[index],
        };

        const parentPath = node.path.split(".").slice(0, -1).join(".");
        const parentNode = lookup[parentPath];

        if (parentNode) {
          parentNode.children.push(lookup[node.path]);
        }
      });

      tree.value = lookup["root"];
    }

    return data;
  }

  async function insertNewNode(slides: string, name: string, type: NodeType) {
    const { data, error } = await client
      .from("nodes")
      .insert({
        slides: slides.toString(),
        name: name,
        type: type,
        path:
          selectedNode.value?.dataset.type === "group"
            ? `${selectedNode.value.dataset.path}.${name}`
            : `root.${name}`,
      })
      .select();

    if (error) throw error;

    selectedNode.value = null;

    return data;
  }

  async function deleteSelectedNode() {
    const node = selectedNode.value;

    if (node) {
      const path = node.dataset.path;

      // Using an RPC because Supabase query sucks.
      const { error } = await client.rpc("delete_node_and_children", {
        node_path: path!,
        slides_id: currentSlides.value.id,
      });

      if (error) {
        throw error;
      } else {
        selectedNode.value = null;
      }
    }
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

    changedComponents.value.push(components.value[index]);
  }

  async function upsertComponents() {
    const { error } = await client
      .from("components")
      .upsert(changedComponents.value, {
        onConflict: "node, type",
        ignoreDuplicates: false,
      });

    if (error) throw error;

    changedComponents.value = [];
  }

  return {
    slides,
    currentSlides,
    currentSlidesIndex,
    tree,
    selectedNode,
    components,
    changedComponents,
    fetchAllDecks,
    fetchDeck,
    insertNewDeck,
    fetchAllSlides,
    insertNewSlides,
    fetchAllNodes,
    insertNewNode,
    deleteSelectedNode,
    fetchNodeComponents,
    updateNodeComponent,
  };
});
