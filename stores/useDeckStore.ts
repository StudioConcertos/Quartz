export const useDeckStore = defineStore("deck", () => {
  const slides = ref<Slides[]>([]);

  const selectedSlides = ref<Slides>();
  const selectedSlidesIndex = ref<number>(0);
  const selectedSlidesNodes = ref<Object[]>([]);

  const selectedNode = ref<HTMLLIElement>();

  watchDebounced(
    selectedSlides,
    () => {
      // useDeck().updateDeckSlides(useRoute().params.id, slides);
    },
    { debounce: 10000 }
  );

  return { slides, selectedSlides, selectedSlidesIndex, selectedNode };
});
