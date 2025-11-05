export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_text: string
          created_at: string | null
          id: string
          seeds_earned: number | null
          user_id: string
        }
        Insert: {
          achievement_text: string
          created_at?: string | null
          id?: string
          seeds_earned?: number | null
          user_id: string
        }
        Update: {
          achievement_text?: string
          created_at?: string | null
          id?: string
          seeds_earned?: number | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_counters: {
        Row: {
          id: string
          last_updated: string | null
          total_area_m2: number | null
          total_co2_kg: number | null
          total_o2_lpd: number | null
          total_seeds_issued: number | null
          total_trees: number | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          total_area_m2?: number | null
          total_co2_kg?: number | null
          total_o2_lpd?: number | null
          total_seeds_issued?: number | null
          total_trees?: number | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          total_area_m2?: number | null
          total_co2_kg?: number | null
          total_o2_lpd?: number | null
          total_seeds_issued?: number | null
          total_trees?: number | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      planted_trees: {
        Row: {
          area_m2: number | null
          created_at: string | null
          description: string | null
          growth_stage: number | null
          id: string
          image_path: string | null
          impact_co2_kg: number | null
          impact_o2_l_per_day: number | null
          is_public: boolean | null
          location: string | null
          metadata: Json | null
          planted_date: string | null
          species: string | null
          stage: number | null
          tree_name: string
          user_id: string
        }
        Insert: {
          area_m2?: number | null
          created_at?: string | null
          description?: string | null
          growth_stage?: number | null
          id?: string
          image_path?: string | null
          impact_co2_kg?: number | null
          impact_o2_l_per_day?: number | null
          is_public?: boolean | null
          location?: string | null
          metadata?: Json | null
          planted_date?: string | null
          species?: string | null
          stage?: number | null
          tree_name: string
          user_id: string
        }
        Update: {
          area_m2?: number | null
          created_at?: string | null
          description?: string | null
          growth_stage?: number | null
          id?: string
          image_path?: string | null
          impact_co2_kg?: number | null
          impact_o2_l_per_day?: number | null
          is_public?: boolean | null
          location?: string | null
          metadata?: Json | null
          planted_date?: string | null
          species?: string | null
          stage?: number | null
          tree_name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string | null
          created_at: string | null
          en: string
          hi: string
          id: string
          key: string
          te: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          en: string
          hi: string
          id?: string
          key: string
          te: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          en?: string
          hi?: string
          id?: string
          key?: string
          te?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          co2_reduced: number | null
          created_at: string | null
          energy_saved: number | null
          green_area_expanded: number | null
          id: string
          language: string | null
          oxygen_generated: number | null
          points: number | null
          seed_points: number | null
          trees_planted: number | null
          updated_at: string | null
          user_id: string
          water_saved: number | null
          wildlife_sheltered: number | null
        }
        Insert: {
          co2_reduced?: number | null
          created_at?: string | null
          energy_saved?: number | null
          green_area_expanded?: number | null
          id?: string
          language?: string | null
          oxygen_generated?: number | null
          points?: number | null
          seed_points?: number | null
          trees_planted?: number | null
          updated_at?: string | null
          user_id: string
          water_saved?: number | null
          wildlife_sheltered?: number | null
        }
        Update: {
          co2_reduced?: number | null
          created_at?: string | null
          energy_saved?: number | null
          green_area_expanded?: number | null
          id?: string
          language?: string | null
          oxygen_generated?: number | null
          points?: number | null
          seed_points?: number | null
          trees_planted?: number | null
          updated_at?: string | null
          user_id?: string
          water_saved?: number | null
          wildlife_sheltered?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
