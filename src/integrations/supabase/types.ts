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
      community_challenges: {
        Row: {
          created_at: string
          current_trees: number
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          location: string
          participants: string[] | null
          start_date: string
          target_trees: number
          title: string
        }
        Insert: {
          created_at?: string
          current_trees?: number
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          location: string
          participants?: string[] | null
          start_date?: string
          target_trees?: number
          title: string
        }
        Update: {
          created_at?: string
          current_trees?: number
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          location?: string
          participants?: string[] | null
          start_date?: string
          target_trees?: number
          title?: string
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
          location: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          location?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          challenge_type: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          metric: string
          seed_reward: number
          start_date: string
          target_value: number
          title: string
        }
        Insert: {
          challenge_type?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          metric?: string
          seed_reward?: number
          start_date?: string
          target_value?: number
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          metric?: string
          seed_reward?: number
          start_date?: string
          target_value?: number
          title?: string
        }
        Relationships: []
      }
      location_stats: {
        Row: {
          id: string
          last_updated: string
          location: string
          total_co2_kg: number
          total_o2_lpd: number
          total_trees: number
          total_users: number
        }
        Insert: {
          id?: string
          last_updated?: string
          location: string
          total_co2_kg?: number
          total_o2_lpd?: number
          total_trees?: number
          total_users?: number
        }
        Update: {
          id?: string
          last_updated?: string
          location?: string
          total_co2_kg?: number
          total_o2_lpd?: number
          total_trees?: number
          total_users?: number
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          achievements_enabled: boolean | null
          browser_notifications_enabled: boolean | null
          challenges_enabled: boolean | null
          community_enabled: boolean | null
          created_at: string
          email_address: string | null
          email_digest_enabled: boolean | null
          id: string
          leaderboard_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sound_enabled: boolean | null
          sound_type: string | null
          streak_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_enabled?: boolean | null
          browser_notifications_enabled?: boolean | null
          challenges_enabled?: boolean | null
          community_enabled?: boolean | null
          created_at?: string
          email_address?: string | null
          email_digest_enabled?: boolean | null
          id?: string
          leaderboard_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sound_enabled?: boolean | null
          sound_type?: string | null
          streak_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_enabled?: boolean | null
          browser_notifications_enabled?: boolean | null
          challenges_enabled?: boolean | null
          community_enabled?: boolean | null
          created_at?: string
          email_address?: string | null
          email_digest_enabled?: boolean | null
          id?: string
          leaderboard_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sound_enabled?: boolean | null
          sound_type?: string | null
          streak_enabled?: boolean | null
          updated_at?: string
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
      post_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          location: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          location?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          seed_cost: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          seed_cost?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          seed_cost?: number
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
      user_challenge_completions: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          seeds_earned: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          seeds_earned?: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          seeds_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          title?: string
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
      user_purchases: {
        Row: {
          id: string
          item_id: string
          purchased_at: string
          seeds_spent: number
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          purchased_at?: string
          seeds_spent?: number
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          purchased_at?: string
          seeds_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
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
