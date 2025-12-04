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
          address: string | null
          application_status: string | null
          business_name: string
          city: string | null
          contact_email: string | null
          created_at: string
          experience: string | null
          full_name: string | null
          hygiene_certificate_url: string | null
          id: string
          kitchen_approved: boolean | null
          municipality_approval_date: string | null
          phone: string | null
          postal_code: string | null
          rejection_reason: string | null
          specialties: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          application_status?: string | null
          business_name: string
          city?: string | null
          contact_email?: string | null
          created_at?: string
          experience?: string | null
          full_name?: string | null
          hygiene_certificate_url?: string | null
          id?: string
          kitchen_approved?: boolean | null
          municipality_approval_date?: string | null
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          specialties?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          application_status?: string | null
          business_name?: string
          city?: string | null
          contact_email?: string | null
          created_at?: string
          experience?: string | null
          full_name?: string | null
          hygiene_certificate_url?: string | null
          id?: string
          kitchen_approved?: boolean | null
          municipality_approval_date?: string | null
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          specialties?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string | null
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          postal_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          postal_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          postal_code?: string
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
          chef_id: string | null
          created_at: string
          document_type: string
          document_url: string
          expiry_date: string | null
          id: string
          municipality: string | null
          permit_number: string | null
          rejection_reason: string | null
          restaurant_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          chef_id?: string | null
          created_at?: string
          document_type?: string
          document_url: string
          expiry_date?: string | null
          id?: string
          municipality?: string | null
          permit_number?: string | null
          rejection_reason?: string | null
          restaurant_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          chef_id?: string | null
          created_at?: string
          document_type?: string
          document_url?: string
          expiry_date?: string | null
          id?: string
          municipality?: string | null
          permit_number?: string | null
          rejection_reason?: string | null
          restaurant_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_submissions_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_submissions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
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
      kitchen_availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          kitchen_partner_id: string
          time_slot: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          kitchen_partner_id: string
          time_slot: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          kitchen_partner_id?: string
          time_slot?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_availability_kitchen_partner_id_fkey"
            columns: ["kitchen_partner_id"]
            isOneToOne: false
            referencedRelation: "kitchen_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_partners: {
        Row: {
          address: string
          application_status: string | null
          approved: boolean | null
          business_name: string
          created_at: string
          equipment_details: string | null
          hourly_rate: number | null
          id: string
          kitchen_description: string | null
          kitchen_size: number | null
          municipality: string | null
          rejection_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          application_status?: string | null
          approved?: boolean | null
          business_name: string
          created_at?: string
          equipment_details?: string | null
          hourly_rate?: number | null
          id?: string
          kitchen_description?: string | null
          kitchen_size?: number | null
          municipality?: string | null
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          application_status?: string | null
          approved?: boolean | null
          business_name?: string
          created_at?: string
          equipment_details?: string | null
          hourly_rate?: number | null
          id?: string
          kitchen_description?: string | null
          kitchen_size?: number | null
          municipality?: string | null
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      login_logs: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          login_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          login_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          login_at?: string
          user_agent?: string | null
          user_id?: string
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
      payment_methods: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          last_four: string | null
          name: string
          stripe_payment_method_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          name: string
          stripe_payment_method_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          name?: string
          stripe_payment_method_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          chef_earnings: number
          created_at: string
          currency: string
          customer_email: string
          dish_name: string
          id: string
          payment_status: string
          platform_fee: number
          quantity: number
          receipt_url: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          chef_earnings: number
          created_at?: string
          currency?: string
          customer_email: string
          dish_name: string
          id?: string
          payment_status: string
          platform_fee: number
          quantity?: number
          receipt_url?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          chef_earnings?: number
          created_at?: string
          currency?: string
          customer_email?: string
          dish_name?: string
          id?: string
          payment_status?: string
          platform_fee?: number
          quantity?: number
          receipt_url?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points_amount: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points_amount: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points_amount?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
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
      restaurant_dishes: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          preparation_time: number | null
          price: number
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          preparation_time?: number | null
          price: number
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          preparation_time?: number | null
          price?: number
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          application_status: string | null
          approved: boolean | null
          business_name: string
          city: string | null
          contact_email: string | null
          created_at: string | null
          cuisine_types: string | null
          full_name: string | null
          id: string
          phone: string | null
          postal_code: string | null
          rejection_reason: string | null
          restaurant_description: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          application_status?: string | null
          approved?: boolean | null
          business_name: string
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          cuisine_types?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          restaurant_description?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          application_status?: string | null
          approved?: boolean | null
          business_name?: string
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          cuisine_types?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          restaurant_description?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      user_points: {
        Row: {
          created_at: string
          current_points: number | null
          id: string
          next_discount_at: number | null
          points_used: number | null
          total_points: number | null
          total_purchases: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_points?: number | null
          id?: string
          next_discount_at?: number | null
          points_used?: number | null
          total_points?: number | null
          total_purchases?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_points?: number | null
          id?: string
          next_discount_at?: number | null
          points_used?: number | null
          total_points?: number | null
          total_purchases?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string
          dietary_restrictions: string[] | null
          favorite_dishes: string[] | null
          id: string
          language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          favorite_dishes?: string[] | null
          id?: string
          language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          favorite_dishes?: string[] | null
          id?: string
          language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_loyalty_discount: {
        Args: {
          p_order_id: string
          p_original_amount: number
          p_user_id: string
        }
        Returns: Json
      }
      approve_kitchen_partner: {
        Args: { partner_id: string }
        Returns: undefined
      }
      award_points_for_purchase: {
        Args: { p_order_amount: number; p_order_id: string; p_user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reject_kitchen_partner: {
        Args: { partner_id: string; reason: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "chef" | "kitchen_partner" | "restaurant" | "customer"
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
      app_role: ["admin", "chef", "kitchen_partner", "restaurant", "customer"],
    },
  },
} as const
