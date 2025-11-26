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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ats_submissions: {
        Row: {
          completed_items: Json
          created_at: string
          email: string
          id: string
          missing_items: Json
          name: string
          section_scores: Json
          total_score: number
        }
        Insert: {
          completed_items: Json
          created_at?: string
          email: string
          id?: string
          missing_items: Json
          name: string
          section_scores: Json
          total_score: number
        }
        Update: {
          completed_items?: Json
          created_at?: string
          email?: string
          id?: string
          missing_items?: Json
          name?: string
          section_scores?: Json
          total_score?: number
        }
        Relationships: []
      }
      email_automation_log: {
        Row: {
          click_count: number | null
          created_at: string
          email_step: number
          email_type: string
          id: string
          open_count: number | null
          resend_id: string | null
          sent_at: string
          status: string
          subscriber_id: string
        }
        Insert: {
          click_count?: number | null
          created_at?: string
          email_step: number
          email_type: string
          id?: string
          open_count?: number | null
          resend_id?: string | null
          sent_at?: string
          status?: string
          subscriber_id: string
        }
        Update: {
          click_count?: number | null
          created_at?: string
          email_step?: number
          email_type?: string
          id?: string
          open_count?: number | null
          resend_id?: string | null
          sent_at?: string
          status?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_log_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          ats_score: number
          completed_items: Json
          created_at: string
          email: string
          email_sequence_step: number
          id: string
          is_active: boolean
          last_email_sent: string | null
          max_score: number
          missing_items: Json
          name: string
          score_interpretation: string
          section_scores: Json
          signup_date: string
        }
        Insert: {
          ats_score: number
          completed_items: Json
          created_at?: string
          email: string
          email_sequence_step?: number
          id?: string
          is_active?: boolean
          last_email_sent?: string | null
          max_score?: number
          missing_items: Json
          name: string
          score_interpretation: string
          section_scores: Json
          signup_date?: string
        }
        Update: {
          ats_score?: number
          completed_items?: Json
          created_at?: string
          email?: string
          email_sequence_step?: number
          id?: string
          is_active?: boolean
          last_email_sent?: string | null
          max_score?: number
          missing_items?: Json
          name?: string
          score_interpretation?: string
          section_scores?: Json
          signup_date?: string
        }
        Relationships: []
      }
      exit_intent_signups: {
        Row: {
          converted_to_user: boolean
          created_at: string
          email: string
          email_sequence_step: number
          id: string
          is_active: boolean
          last_email_sent: string | null
          signup_date: string
        }
        Insert: {
          converted_to_user?: boolean
          created_at?: string
          email: string
          email_sequence_step?: number
          id?: string
          is_active?: boolean
          last_email_sent?: string | null
          signup_date?: string
        }
        Update: {
          converted_to_user?: boolean
          created_at?: string
          email?: string
          email_sequence_step?: number
          id?: string
          is_active?: boolean
          last_email_sent?: string | null
          signup_date?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          ats_scores: Json | null
          created_at: string
          id: string
          missing_keywords: Json | null
          rewritten_resume: string | null
          score: number | null
          section_feedback: Json | null
          tone_suggestions: string | null
          user_id: string | null
          weak_bullets: Json | null
          would_interview: string | null
        }
        Insert: {
          ats_scores?: Json | null
          created_at?: string
          id?: string
          missing_keywords?: Json | null
          rewritten_resume?: string | null
          score?: number | null
          section_feedback?: Json | null
          tone_suggestions?: string | null
          user_id?: string | null
          weak_bullets?: Json | null
          would_interview?: string | null
        }
        Update: {
          ats_scores?: Json | null
          created_at?: string
          id?: string
          missing_keywords?: Json | null
          rewritten_resume?: string | null
          score?: number | null
          section_feedback?: Json | null
          tone_suggestions?: string | null
          user_id?: string | null
          weak_bullets?: Json | null
          would_interview?: string | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string
          feedback_given: boolean
          id: string
          submission_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_given?: boolean
          id?: string
          submission_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_given?: boolean
          id?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          analysis_count: number | null
          average_score: number | null
          biggest_improvement: number | null
          created_at: string
          email: string
          email_sequence_step: number | null
          first_analysis_date: string | null
          full_name: string | null
          id: string
          is_lifetime_premium: boolean | null
          last_email_sent: string | null
          signup_source: string | null
        }
        Insert: {
          analysis_count?: number | null
          average_score?: number | null
          biggest_improvement?: number | null
          created_at?: string
          email: string
          email_sequence_step?: number | null
          first_analysis_date?: string | null
          full_name?: string | null
          id: string
          is_lifetime_premium?: boolean | null
          last_email_sent?: string | null
          signup_source?: string | null
        }
        Update: {
          analysis_count?: number | null
          average_score?: number | null
          biggest_improvement?: number | null
          created_at?: string
          email?: string
          email_sequence_step?: number | null
          first_analysis_date?: string | null
          full_name?: string | null
          id?: string
          is_lifetime_premium?: boolean | null
          last_email_sent?: string | null
          signup_source?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          mode: string | null
          resume_text: string | null
          slug: string
          summary: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          mode?: string | null
          resume_text?: string | null
          slug: string
          summary?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          mode?: string | null
          resume_text?: string | null
          slug?: string
          summary?: string | null
        }
        Relationships: []
      }
      resume_reviews: {
        Row: {
          ats_feedback: Json | null
          ats_score: number | null
          created_at: string
          id: string
          match_feedback: Json | null
          match_score: number | null
          original_text: string
          rewritten_text: string | null
          roast_card: Json | null
          share_url: string | null
          user_id: string | null
        }
        Insert: {
          ats_feedback?: Json | null
          ats_score?: number | null
          created_at?: string
          id?: string
          match_feedback?: Json | null
          match_score?: number | null
          original_text: string
          rewritten_text?: string | null
          roast_card?: Json | null
          share_url?: string | null
          user_id?: string | null
        }
        Update: {
          ats_feedback?: Json | null
          ats_score?: number | null
          created_at?: string
          id?: string
          match_feedback?: Json | null
          match_score?: number | null
          original_text?: string
          rewritten_text?: string | null
          roast_card?: Json | null
          share_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      role_templates: {
        Row: {
          bullet_structure: Json
          created_at: string
          formatting_style: Json
          id: string
          role_name: Database["public"]["Enums"]["job_role"]
          skill_emphasis: Json
          title: string
          tone_guidance: string
          updated_at: string
        }
        Insert: {
          bullet_structure: Json
          created_at?: string
          formatting_style: Json
          id?: string
          role_name: Database["public"]["Enums"]["job_role"]
          skill_emphasis: Json
          title: string
          tone_guidance: string
          updated_at?: string
        }
        Update: {
          bullet_structure?: Json
          created_at?: string
          formatting_style?: Json
          id?: string
          role_name?: Database["public"]["Enums"]["job_role"]
          skill_emphasis?: Json
          title?: string
          tone_guidance?: string
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          feedback_comment: string | null
          feedback_results: Json
          file_name: string | null
          file_path: string | null
          file_type: string | null
          helpful: boolean | null
          id: string
          job_description: string
          job_url: string | null
          resume_text: string
          selected_role: Database["public"]["Enums"]["job_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_comment?: string | null
          feedback_results: Json
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          helpful?: boolean | null
          id?: string
          job_description: string
          job_url?: string | null
          resume_text: string
          selected_role?: Database["public"]["Enums"]["job_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_comment?: string | null
          feedback_results?: Json
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          helpful?: boolean | null
          id?: string
          job_description?: string
          job_url?: string | null
          resume_text?: string
          selected_role?: Database["public"]["Enums"]["job_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          action_type: string
          anonymous_id: string | null
          client_fingerprint: string | null
          feature_name: string
          id: string
          ip_address: string | null
          timestamp: string
          usage_date: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          anonymous_id?: string | null
          client_fingerprint?: string | null
          feature_name?: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          usage_date?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          anonymous_id?: string | null
          client_fingerprint?: string | null
          feature_name?: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          usage_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_resume_analysis_limit: {
        Args: {
          p_anonymous_id: string
          p_client_fingerprint: string
          p_ip_address: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      job_role:
        | "Product Manager"
        | "UX Designer"
        | "Data Analyst"
        | "Software Engineer"
        | "Consultant"
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
    Enums: {
      job_role: [
        "Product Manager",
        "UX Designer",
        "Data Analyst",
        "Software Engineer",
        "Consultant",
      ],
    },
  },
} as const
