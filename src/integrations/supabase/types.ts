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
      api_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          method: string
          request_body: Json | null
          response_body: Json | null
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          method: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          method?: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_user: boolean
          user_id: string | null
          website_data: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_user?: boolean
          user_id?: string | null
          website_data?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_user?: boolean
          user_id?: string | null
          website_data?: Json | null
        }
        Relationships: []
      }
      cicd_configs: {
        Row: {
          branch: string
          build_command: string
          created_at: string
          deploy_command: string
          deployment_status: string | null
          deployment_url: string | null
          id: string
          last_deployed_at: string | null
          repository: string
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch?: string
          build_command?: string
          created_at?: string
          deploy_command?: string
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository: string
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch?: string
          build_command?: string
          created_at?: string
          deploy_command?: string
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository?: string
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          element_text: string | null
          element_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string
          scroll_depth: number | null
          session_id: string
          template_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path: string
          scroll_depth?: number | null
          session_id: string
          template_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string
          scroll_depth?: number | null
          session_id?: string
          template_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      website_configs: {
        Row: {
          color_scheme: string | null
          company_name: string
          created_at: string
          deployment_status: string | null
          deployment_url: string | null
          domain_name: string
          id: string
          last_deployed_at: string | null
          logo: string
          secondary_color_scheme: string | null
          template_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color_scheme?: string | null
          company_name: string
          created_at?: string
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name: string
          id?: string
          last_deployed_at?: string | null
          logo: string
          secondary_color_scheme?: string | null
          template_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color_scheme?: string | null
          company_name?: string
          created_at?: string
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name?: string
          id?: string
          last_deployed_at?: string | null
          logo?: string
          secondary_color_scheme?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string | null
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
    Enums: {},
  },
} as const
