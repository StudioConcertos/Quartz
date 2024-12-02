export interface RenderResult {
  content?: string;
  style?: Record<string, string>;
}

export interface ElementRenderer {
  element: string;
  render: (node: Tree) => RenderResult;
}
