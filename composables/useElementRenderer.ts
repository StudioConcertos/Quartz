export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());

  function findComponent(node: Tree, type: ComponentType) {
    return currentComponents.value.find(
      (component) => component.type === type && component.node === node.id
    );
  }

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
            scale: transform.scale,
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
