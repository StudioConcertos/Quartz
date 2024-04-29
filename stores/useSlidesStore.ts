export const useSlidesStore = defineStore("slides", () => {
  const slidesPages = ref<[Object]>([{}]);

  const selectedPage = ref<[Object]>();
  const selectedPageIndex = ref<number>(0);

  const selectedNode = ref<HTMLLIElement>();

  watchDebounced(
    selectedPage,
    () => {
      useSlides().updateSlidesPages(useRoute().params.id, slidesPages.value);
    },
    { debounce: 10000 },
  );

  return { slidesPages, selectedPage, selectedPageIndex, selectedNode };
});
