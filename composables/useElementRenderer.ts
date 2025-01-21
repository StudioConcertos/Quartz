// TODO: Optimise the amount of calls.

export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());

  function findComponent(node: Tree, type: ComponentType) {
    return currentComponents.value.find(
      (component) => component.type === type && component.node === node.id
    );
  }

  const renderEl = ref<HTMLDivElement>();

  // TODO: Use another method to get the element.
  onMounted(() => {
    renderEl.value = document.querySelector(".render") as HTMLDivElement;
  });

  const { width, height } = useElementSize(renderEl);

  const scale = computed(() => {
    return Math.min(width.value / 1920, height.value / 1080);
  });

  const renderer: Record<NodeType, ElementRenderer> = {
    text: {
      element: "p",
      render: (node: Tree) => {
        const text = findComponent(node, "typography")!.data;
        const transform = findComponent(node, "transform")!.data;

        const xPercent = (transform.x / 1920) * 100;
        const yPercent = (transform.y / 1080) * 100;

        return {
          content: text.content,
          style: {
            top: `${yPercent}%`,
            left: `${xPercent}%`,
            zIndex: transform.z,
            transform: `scale(${transform.scale * scale.value})`,
            fontSize: `${text.size}px`,
            fontWeight: text.weight,
            color: text.colour,
          },
        };
      },
    },
    group: {
      element: "div",
      render: () => ({}),
    },
  };

  return {
    renderer,
  };
}
