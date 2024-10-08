export type TSlides = Database["public"]["Tables"]["slides"]["Row"];

export type Tree = TreeNode & {
  children?: Tree[];
};
export type TreeNode = Database["public"]["Tables"]["nodes"]["Row"];

export type NodeType = Database["public"]["Enums"]["nodetype"];
export type ComponentType = Database["public"]["Enums"]["componenttype"];

export interface ContextMenuItem {
  label: string;
  action: () => void;
}

export interface ContextMenuEvent extends CustomEvent {
  detail: {
    event: MouseEvent;
    menuItems: ContextMenuItem[];
  };
}
