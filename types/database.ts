export type Slides = Database["public"]["Tables"]["slides"]["Row"];
export type NodeType = Database["public"]["Enums"]["type"];

export type Database = {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          lapidary: string;
          last_modified: string;
          title: string;
        };
        Insert: {
          id?: string;
          lapidary: string;
          last_modified?: string;
          title?: string;
        };
        Update: {
          id?: string;
          lapidary?: string;
          last_modified?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "slides_lapidary_fkey";
            columns: ["lapidary"];
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
          path: unknown;
          slides: string | null;
          type: Database["public"]["Enums"]["type"];
        };
        Insert: {
          id?: string;
          name: string;
          path: unknown;
          slides?: string | null;
          type: Database["public"]["Enums"]["type"];
        };
        Update: {
          id?: string;
          name?: string;
          path?: unknown;
          slides?: string | null;
          type?: Database["public"]["Enums"]["type"];
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
      delete_selected_node: {
        Args: {
          slides_id: string;
          page_index: number;
          node: Object;
        };
        Returns: undefined;
      };
      insert_new_node: {
        Args: {
          slides_id: string;
          page_index: number;
          node: Object;
          parent: Object;
        };
        Returns: undefined;
      };
    };
    Enums: {
      type: "text" | "group";
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
