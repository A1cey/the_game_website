export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          current_player: number
          game_state: Json | null
          id: string
        }
        Insert: {
          current_player?: number
          game_state?: Json | null
          id?: string
        }
        Update: {
          current_player?: number
          game_state?: Json | null
          id?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string
          data: Json | null
          description: Database["public"]["Enums"]["log_event"]
          id: string | null
          index: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          description: Database["public"]["Enums"]["log_event"]
          id?: string | null
          index?: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          description?: Database["public"]["Enums"]["log_event"]
          id?: string | null
          index?: number
        }
        Relationships: []
      }
      players: {
        Row: {
          id: string
          joined_at: string
          name: string | null
          player_game_state: Json | null
          position_in_session: number | null
          session_name: string
        }
        Insert: {
          id?: string
          joined_at?: string
          name?: string | null
          player_game_state?: Json | null
          position_in_session?: number | null
          session_name: string
        }
        Update: {
          id?: string
          joined_at?: string
          name?: string | null
          player_game_state?: Json | null
          position_in_session?: number | null
          session_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_session_name_fkey"
            columns: ["session_name"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["name"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          game_id: string
          game_started_at: string | null
          last_update_at: string
          max_num_of_players: number
          name: string
          num_of_players: number
        }
        Insert: {
          created_at?: string
          game_id?: string
          game_started_at?: string | null
          last_update_at?: string
          max_num_of_players?: number
          name: string
          num_of_players?: number
        }
        Update: {
          created_at?: string
          game_id?: string
          game_started_at?: string | null
          last_update_at?: string
          max_num_of_players?: number
          name?: string
          num_of_players?: number
        }
        Relationships: [
          {
            foreignKeyName: "Sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_name_for_player: {
        Args: {
          session_name_input: string
        }
        Returns: string
      }
      create_session: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_next_player_position: {
        Args: {
          session_name_input: string
        }
        Returns: number
      }
      get_player_names: {
        Args: {
          session_name_input: string
        }
        Returns: {
          name: string
        }[]
      }
      insert_log: {
        Args: {
          session_name_input: string
          description_input: Database["public"]["Enums"]["log_event"]
          data_input?: Json
        }
        Returns: undefined
      }
      next_player: {
        Args: {
          session_name_input: string
        }
        Returns: undefined
      }
      start_game: {
        Args: {
          session_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      log_event:
        | "new_session_created"
        | "session_deleted"
        | "new_game_created"
        | "game_started"
        | "game_updated"
        | "game_ended"
        | "game_deleted"
        | "new_player_joined_the_session"
        | "player_updated"
        | "player_left_the_session"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
