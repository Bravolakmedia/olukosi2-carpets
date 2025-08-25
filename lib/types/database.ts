export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: "super_admin" | "admin" | "manager" | "staff"
          is_active: boolean
          last_login: string | null
          failed_login_attempts: number
          locked_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role?: "super_admin" | "admin" | "manager" | "staff"
          is_active?: boolean
          last_login?: string | null
          failed_login_attempts?: number
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: "super_admin" | "admin" | "manager" | "staff"
          is_active?: boolean
          last_login?: string | null
          failed_login_attempts?: number
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          price: number
          sale_price: number | null
          sku: string | null
          stock_quantity: number
          low_stock_threshold: number
          weight: number | null
          dimensions: Json | null
          material: string | null
          color: string | null
          size: string | null
          images: Json | null
          features: Json | null
          is_featured: boolean
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price: number
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          low_stock_threshold?: number
          weight?: number | null
          dimensions?: Json | null
          material?: string | null
          color?: string | null
          size?: string | null
          images?: Json | null
          features?: Json | null
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price?: number
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          low_stock_threshold?: number
          weight?: number | null
          dimensions?: Json | null
          material?: string | null
          color?: string | null
          size?: string | null
          images?: Json | null
          features?: Json | null
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          customer_email: string | null
          customer_phone: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          shipping_method: string | null
          shipping_address: Json | null
          billing_address: Json | null
          notes: string | null
          special_instructions: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id?: string | null
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          customer_email?: string | null
          customer_phone?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          shipping_method?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          notes?: string | null
          special_instructions?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          customer_email?: string | null
          customer_phone?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          shipping_method?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          notes?: string | null
          special_instructions?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          payment_method: "bank_transfer" | "card" | "ussd" | "pos" | "cash"
          status: "pending" | "completed" | "failed" | "refunded"
          amount: number
          currency: string
          gateway_transaction_id: string | null
          gateway_reference: string | null
          gateway_response: Json | null
          bank_name: string | null
          account_number: string | null
          transfer_reference: string | null
          payment_date: string | null
          notes: string | null
          processed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          payment_method: "bank_transfer" | "card" | "ussd" | "pos" | "cash"
          status?: "pending" | "completed" | "failed" | "refunded"
          amount: number
          currency?: string
          gateway_transaction_id?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          bank_name?: string | null
          account_number?: string | null
          transfer_reference?: string | null
          payment_date?: string | null
          notes?: string | null
          processed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          payment_method?: "bank_transfer" | "card" | "ussd" | "pos" | "cash"
          status?: "pending" | "completed" | "failed" | "refunded"
          amount?: number
          currency?: string
          gateway_transaction_id?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          bank_name?: string | null
          account_number?: string | null
          transfer_reference?: string | null
          payment_date?: string | null
          notes?: string | null
          processed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
