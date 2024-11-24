export function useElementRenderer() {
  const handlers: Record<NodeType, ElementRenderer> = {
    text: {
      element: "p",
      render: (node: Tree) => {
        const text = node.components.find(
          (component) => component.type === "text"
        );

        return JSON.stringify(text?.data);
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
