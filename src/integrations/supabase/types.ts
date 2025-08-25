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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chefs: {
        Row: {
          business_name: string
          created_at: string
          hygiene_certificate_url: string | null
          id: string
          kitchen_approved: boolean | null
          municipality_approval_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          created_at?: string
          hygiene_certificate_url?: string | null
          id?: string
          kitchen_approved?: boolean | null
          municipality_approval_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          created_at?: string
          hygiene_certificate_url?: string | null
          id?: string
          kitchen_approved?: boolean | null
          municipality_approval_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dish_templates: {
        Row: {
          allergens: string[] | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          preparation_time: number | null
          suggested_price: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          preparation_time?: number | null
          suggested_price?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          preparation_time?: number | null
          suggested_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      dishes: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          category: string | null
          chef_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          preparation_time: number | null
          price: number
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string | null
          chef_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          preparation_time?: number | null
          price: number
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string | null
          chef_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          preparation_time?: number | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dishes_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
        ]
      }
      document_submissions: {
        Row: {
          ai_analysis: string | null
          created_at: string
          document_type: string
          document_url: string
          expiry_date: string | null
          id: string
          municipality: string | null
          permit_number: string | null
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string
          document_type?: string
          document_url: string
          expiry_date?: string | null
          id?: string
          municipality?: string | null
          permit_number?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string
          document_type?: string
          document_url?: string
          expiry_date?: string | null
          id?: string
          municipality?: string | null
          permit_number?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Farhan: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          dish_id: string
          id: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          dish_id: string
          id?: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          dish_id?: string
          id?: string
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          chef_id: string
          created_at: string
          customer_id: string
          delivery_address: string
          delivery_time: string | null
          id: string
          special_instructions: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          chef_id: string
          created_at?: string
          customer_id: string
          delivery_address: string
          delivery_time?: string | null
          id?: string
          special_instructions?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          chef_id?: string
          created_at?: string
          customer_id?: string
          delivery_address?: string
          delivery_time?: string | null
          id?: string
          special_instructions?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          municipality_approved: boolean | null
          onboarding_completed: boolean | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          municipality_approved?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          municipality_approved?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          chef_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          order_id: string
          rating: number
        }
        Insert: {
          chef_id: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          order_id: string
          rating: number
        }
        Update: {
          chef_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          order_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
