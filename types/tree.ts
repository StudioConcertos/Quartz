export type Tree = NodeModel & {
  type: NodeType;
  children: Tree[];
  components: ComponentModel[];
};
