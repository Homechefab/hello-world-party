export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          chef_id: string
          customer_id: string
          delivery_address: string
          delivery_time: string
          special_instructions: string
          status: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          klarna_order_id: string
          customer_email: string
          amount: number
          currency?: string
          status?: string
          order_lines: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          klarna_order_id?: string
          customer_email?: string
          amount?: number
          currency?: string
          status?: string
          order_lines?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
}