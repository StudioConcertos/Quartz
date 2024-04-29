export const useSlidesStore = defineStore("slides", () => {
  const slidesPages = ref<[]>([]);

  const selectedPage = ref<[]>([]);
  const selectedPageIndex = ref<number>(0);

  const selectedNode = ref<HTMLLIElement>();

  watchDebounced(
    selectedPage.value,
    () => {
      useSlides().updateSlidesPages(useRoute().params.id, slidesPages.value);
    },
    { debounce: 10000 },
  );

  return { slidesPages, selectedPage, selectedPageIndex, selectedNode };
});
