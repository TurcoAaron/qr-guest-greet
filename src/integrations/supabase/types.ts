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
      attendances: {
        Row: {
          checked_in_at: string
          checked_in_by: string | null
          event_id: string
          guest_id: string
          id: string
        }
        Insert: {
          checked_in_at?: string
          checked_in_by?: string | null
          event_id: string
          guest_id: string
          id?: string
        }
        Update: {
          checked_in_at?: string
          checked_in_by?: string | null
          event_id?: string
          guest_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      event_images: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          image_url: string
          preference: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          image_url: string
          preference?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          image_url?: string
          preference?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_images_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          dress_code: string | null
          end_date: string | null
          event_code: string
          event_type: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          organizer_id: string
          start_date: string | null
          status: string
          template_id: string | null
          updated_at: string
          validate_full_attendance: boolean | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          dress_code?: string | null
          end_date?: string | null
          event_code: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          organizer_id: string
          start_date?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          validate_full_attendance?: boolean | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          dress_code?: string | null
          end_date?: string | null
          event_code?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          organizer_id?: string
          start_date?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          validate_full_attendance?: boolean | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          adults_count: number
          children_count: number
          created_at: string
          email: string | null
          event_id: string
          id: string
          invitation_code: string
          name: string
          passes_count: number
          pets_count: number
          phone: string | null
          qr_code_data: string
        }
        Insert: {
          adults_count?: number
          children_count?: number
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          invitation_code: string
          name: string
          passes_count?: number
          pets_count?: number
          phone?: string | null
          qr_code_data: string
        }
        Update: {
          adults_count?: number
          children_count?: number
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          invitation_code?: string
          name?: string
          passes_count?: number
          pets_count?: number
          phone?: string | null
          qr_code_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rsvp_responses: {
        Row: {
          adults_count: number
          children_count: number
          created_at: string
          event_id: string
          guest_id: string
          id: string
          passes_count: number
          pets_count: number | null
          response: string
          updated_at: string
        }
        Insert: {
          adults_count?: number
          children_count?: number
          created_at?: string
          event_id: string
          guest_id: string
          id?: string
          passes_count?: number
          pets_count?: number | null
          response: string
          updated_at?: string
        }
        Update: {
          adults_count?: number
          children_count?: number
          created_at?: string
          event_id?: string
          guest_id?: string
          id?: string
          passes_count?: number
          pets_count?: number | null
          response?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
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
