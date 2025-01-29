export interface Tree extends NodeModel {
  type: NodeType;
  children: Tree[];
}

export const isEmptyTree = (tree: Tree) => {
  return (
    tree.slides === EMPTY_TREE.slides &&
    tree.name === EMPTY_TREE.name &&
    tree.path === EMPTY_TREE.path &&
    tree.type === EMPTY_TREE.type &&
    tree.reference === EMPTY_TREE.reference &&
    tree.children.length === EMPTY_TREE.children.length
  );
};

export const EMPTY_TREE: Tree = {
  id: "",
  slides: "",
  name: "",
  path: "",
  type: "group",
  reference: "",
  children: [],
};

export interface PendingNode extends NodeModel {
  _pending?: true;
  _deleted?: boolean;
}

export type PendingChanges = {
  nodes: PendingNode[];
  components: ComponentModel[];
};
