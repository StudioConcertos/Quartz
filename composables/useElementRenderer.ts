export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());

  function findComponent(node: Tree, type: string) {
    return currentComponents.value.find(
      (component) => component.type === type && component.node === node.id
    );
  }

  const renderer: Record<NodeType, ElementRenderer> = {
    text: {
      element: "p",
      render: (node: Tree) => {
        const text = findComponent(node, "text");

        return {
          content: text?.data.content,
          style: {
            fontSize: `${text?.data.size}px`,
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
