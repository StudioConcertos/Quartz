export interface RenderResult {
  content?: string;
  style?: Record<string, string | number>;
}

export interface ElementRenderer {
  element: string;
  render: (node: Tree) => RenderResult;
}
