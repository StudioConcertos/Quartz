export function useElementRenderer() {
  const { components } = storeToRefs(useDeckStore());

  const handlers: Record<NodeType, ElementRenderer> = {
    text: {
      element: "p",
      render: (node: Tree) => {
        const text = components.value.find(
          (component) => component.type === "text" && component.node === node.id
        );

        return text?.data.string;
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
