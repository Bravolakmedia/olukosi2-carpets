import { supabase } from "../supabaseClient"
import { Database } from "../types/database"

type Payment = Database["public"]["Tables"]["payments"]["Row"]
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]

export class PaymentService {
  // Create payment record
  static async createPayment(paymentData: {
    orderId: string
    method: "bank_transfer" | "card" | "ussd" | "pos" | "cash"
    amount: number
    bankName?: string
    accountNumber?: string
    transferReference?: string
    gatewayTransactionId?: string
    gatewayReference?: string
    notes?: string
  }) {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        order_id: paymentData.orderId,
        payment_method: paymentData.method,
        amount: paymentData.amount,
        bank_name: paymentData.bankName,
        account_number: paymentData.accountNumber,
        transfer_reference: paymentData.transferReference,
        gateway_transaction_id: paymentData.gatewayTransactionId,
        gateway_reference: paymentData.gatewayReference,
        notes: paymentData.notes,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update payment status
  static async updatePaymentStatus(
    paymentId: string,
    status: "completed" | "failed" | "refunded",
    adminId?: string,
    notes?: string,
  ) {
    const updates: any = {
      status,
      payment_date: status === "completed" ? new Date().toISOString() : null,
      processed_by: adminId,
      notes,
    }

    const { data, error } = await supabase.from("payments").update(updates).eq("id", paymentId).select().single()

    if (error) throw error

    // If payment completed, update order status
    if (status === "completed") {
      await supabase.from("orders").update({ status: "confirmed" }).eq("id", data.order_id)
    }

    // Log admin activity
    if (adminId) {
      await supabase.from("admin_activity_logs").insert({
        admin_id: adminId,
        action: "update_payment_status",
        resource_type: "payment",
        resource_id: paymentId,
        details: { new_status: status, notes },
      })
    }

    return data
  }

  // Get payments for an order
  static async getOrderPayments(orderId: string) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Get all payments with filtering
  static async getPayments(filters?: {
    status?: string
    method?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase.from("payments").select(`
        *,
        orders (
          order_number,
          customer_first_name,
          customer_last_name,
          total_amount
        )
      `)

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.method) {
      query = query.eq("payment_method", filters.method)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}
