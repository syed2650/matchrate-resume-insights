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
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
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
          p_user_id: string
          p_anonymous_id: string
          p_client_fingerprint: string
          p_ip_address: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
