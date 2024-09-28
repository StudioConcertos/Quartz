export type TSlides = Database["public"]["Tables"]["slides"]["Row"];
export type TNode = Database["public"]["Tables"]["nodes"]["Row"];
export type TType = Database["public"]["Enums"]["type"];

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
