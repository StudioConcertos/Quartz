export const useSlidesStore = defineStore("slides", () => {
  const selectedNode = ref<HTMLLIElement | null>();

  return { selectedNode };
});
