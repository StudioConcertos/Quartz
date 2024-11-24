export type SlidesModel = Database["public"]["Tables"]["slides"]["Row"];
export type ComponentModel = Database["public"]["Tables"]["components"]["Row"];
export type NodeModel = Database["public"]["Tables"]["nodes"]["Row"];

export type NodeType = Database["public"]["Enums"]["nodetype"];
export type ComponentType = Database["public"]["Enums"]["componenttype"];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      components: {
        Row: {
          data: Json | null;
          node: string;
          type: Database["public"]["Enums"]["componenttype"];
        };
        Insert: {
          data?: Json | null;
          node: string;
          type: Database["public"]["Enums"]["componenttype"];
        };
        Update: {
          data?: Json | null;
          node?: string;
          type?: Database["public"]["Enums"]["componenttype"];
        };
        Relationships: [
          {
            foreignKeyName: "components_node_fkey";
            columns: ["node"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["id"];
          }
        ];
      };
      decks: {
        Row: {
          id: string;
          lapidarist: string;
          last_modified: string;
          title: string;
        };
        Insert: {
          id?: string;
          lapidarist: string;
          last_modified?: string;
          title?: string;
        };
        Update: {
          id?: string;
          lapidarist?: string;
          last_modified?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "decks_lapidarist_fkey";
            columns: ["lapidarist"];
            isOneToOne: false;
            referencedRelation: "lapidaries";
            referencedColumns: ["id"];
          }
        ];
      };
      lapidaries: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      nodes: {
        Row: {
          id: string;
          name: string;
          path: string;
          reference: string | null;
          slides: string;
          type: Database["public"]["Enums"]["nodetype"];
        };
        Insert: {
          id?: string;
          name: string;
          path: string;
          reference?: string | null;
          slides: string;
          type: Database["public"]["Enums"]["nodetype"];
        };
        Update: {
          id?: string;
          name?: string;
          path?: string;
          reference?: string | null;
          slides?: string;
          type?: Database["public"]["Enums"]["nodetype"];
        };
        Relationships: [
          {
            foreignKeyName: "nodes_slides_fkey";
            columns: ["slides"];
            isOneToOne: false;
            referencedRelation: "slides";
            referencedColumns: ["id"];
          }
        ];
      };
      slides: {
        Row: {
          deck: string;
          id: string;
          index: number;
        };
        Insert: {
          deck: string;
          id?: string;
          index: number;
        };
        Update: {
          deck?: string;
          id?: string;
          index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "slides_deck_fkey";
            columns: ["deck"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_node_and_children: {
        Args: {
          node_path: string;
          slides_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      componenttype: "animation" | "text" | "transform";
      nodetype: "text" | "group";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
