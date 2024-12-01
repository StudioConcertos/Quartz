export type Tree = NodeModel & {
  type: NodeType;
  children: Tree[];
};

export interface PendingNode extends NodeModel {
  _pending?: true;
  _deleted?: boolean;
}

export type PendingChanges = {
  nodes: PendingNode[];
  components: ComponentModel[];
};
