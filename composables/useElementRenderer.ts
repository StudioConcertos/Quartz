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
        const text = findComponent(node, "typography");

        return {
          content: text?.data.content,
          style: {
            fontSize: `${text?.data.size}px`,
            fontWeight: text?.data.weight,
            color: text?.data.colour,
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
