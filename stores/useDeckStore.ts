// TODO: Refactor this whole mess.

export const useDeckStore = defineStore("deck", () => {
  const client = useSupabaseClient<Database>();

  const slides = ref<TSlides[]>([]);
  const currentSlides = computed(() => slides.value[currentSlidesIndex.value]);
  const currentSlidesIndex = ref<number>(0);

  const nodes = ref<Tree>({
    id: "",
    name: "",
    path: "",
    reference: "",
    slides: "",
    type: "group",
  });

  const selectedNode = ref<HTMLLIElement | null>();
  const selectedNodeComponents = ref<TComponents[]>([]);

  watchEffect(async () => {
    if (!selectedNode.value?.id) {
      selectedNodeComponents.value = [];

      return;
    }

    const data = await fetchNodeComponents(selectedNode.value.id);

    selectedNodeComponents.value = data || [];
  });

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
        title: "New Deck",
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

  function nextSlides() {
    currentSlidesIndex.value++;
  }

  function prevSlides() {
    currentSlidesIndex.value--;
  }

  async function fetchAllNodes() {
    const { data, error } = await client
      .from("nodes")
      .select("*")
      .eq("slides", currentSlides.value.id)
      .order("path", { ascending: true });

    if (error) throw error;

    if (data) {
      // Converts the data array into a hierachical tree.
      const lookup: Record<string, { children: TreeNode[] } & TreeNode> = {};

      data.forEach((node) => {
        lookup[node.path] = { ...node, children: [] };

        const parentPath = node.path.split(".").slice(0, -1).join(".");
        const parentNode = lookup[parentPath];

        if (parentNode) {
          parentNode.children.push(lookup[node.path]);
        }
      });

      nodes.value = lookup["root"];
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

  return {
    slides,
    currentSlides,
    currentSlidesIndex,
    nodes,
    selectedNode,
    selectedNodeComponents,
    fetchAllDecks,
    fetchDeck,
    insertNewDeck,
    fetchAllSlides,
    nextSlides,
    prevSlides,
    fetchAllNodes,
    insertNewNode,
    deleteSelectedNode,
    fetchNodeComponents,
  };
});
