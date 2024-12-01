export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());

  const handlers: Record<NodeType, ElementRenderer> = {
    text: {
      element: "p",
      render: (node: Tree) => {
        const text = currentComponents.value.find(
          (component) => component.type === "text" && component.node === node.id
        );

        return text?.data.content;
      },
    },
    group: {
      element: "div",
      render: () => "",
    },
  };

  return {
    handlers,
  };
}
