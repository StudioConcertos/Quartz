export interface Tree extends NodeModel {
  type: NodeType;
  children: Tree[];
}

export const isEmptyTree = (tree: Tree) => {
  return !Object.values(tree).some(
    (value) => value !== "" && value !== "group" && !Array.isArray(value)
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
