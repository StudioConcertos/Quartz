export const useDeckStore = defineStore("deck", () => {
  const client = useSupabaseClient<Database>();

  const slides = ref<Slides[]>([]);
  const currentSlides = computed(() => slides.value[currentSlidesIndex.value]);
  const currentSlidesIndex = ref<number>(0);

  const nodes = ref<Object[]>([]);
  const selectedNode = ref<HTMLLIElement | null>();

  async function fetchAllDecks() {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .order("last_modified", { ascending: false });

    if (error) throw error;

    return data;
  }

  async function fetchDeck(id: String | String[]) {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async function insertNewDeck() {
    const { data, error } = await client
      .from("decks")
      .insert({
        lapidary: `${useAuthStore().user?.id}`,
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
      .match({ deck: deck })
      .order("index", { ascending: false });

    if (error) throw error;

    if (data) slides.value = data;

    return data;
  }

  async function fetchAllNodes() {
    const { data, error } = await client
      .from("nodes")
      .select("*")
      .eq("slides", useRoute().params.id);

    if (error) throw error;

    return data;
  }

  async function insertNewNode(slides: string, name: string, type: NodeType) {
    const { data, error } = await client
      .from("nodes")
      .insert({
        slides: slides.toString(),
        name: name,
        type: type,
        path: "",
      })
      .select();

    if (error) throw error;

    return data;
  }

  function nextSlides() {
    currentSlidesIndex.value++;
  }

  function prevSlides() {
    currentSlidesIndex.value--;
  }

  return {
    slides,
    currentSlides,
    currentSlidesIndex,
    nodes,
    selectedNode,
    fetchAllDecks,
    fetchDeck,
    insertNewDeck,
    fetchAllNodes,
    insertNewNode,
    fetchAllSlides,
    nextSlides,
    prevSlides,
  };
});
