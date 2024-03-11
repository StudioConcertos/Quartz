export const useSlidesStore = defineStore("slides", () => {
  const selectedPage = ref<number>(0);
  const selectedNode = ref<HTMLLIElement>();

  return { selectedPage, selectedNode };
});
