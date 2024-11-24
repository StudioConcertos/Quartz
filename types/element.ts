export interface ElementRenderer {
  element: string;
  render: (node: Tree) => string;
}
