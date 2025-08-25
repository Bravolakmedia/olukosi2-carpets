import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"]
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"]

export class OrderService {
  // Generate unique order number
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `OLK-${timestamp}${random}`
  }

  // Create new order
  static async createOrder(orderData: {
    customerInfo: {
      email: string
      phone: string
      firstName: string
      lastName: string
    }
    items: Array<{
      productId: string
      quantity: number
      unitPrice: number
    }>
    shipping: {
      method: string
      amount: number
      address: any
    }
    billing?: {
      address: any
    }
    promoCode?: string
    specialInstructions?: string
  }) {
    const orderNumber = this.generateOrderNumber()

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of orderData.items) {
      const { data: product } = await supabase.from("products").select("*").eq("id", item.productId).single()

      if (!product) throw new Error(`Product ${item.productId} not found`)

      const itemTotal = item.unitPrice * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product_id: item.productId,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: itemTotal,
        product_snapshot: product,
      })
    }

    // Apply promo code if provided
    let discountAmount = 0
    if (orderData.promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", orderData.promoCode)
        .eq("is_active", true)
        .single()

      if (promo && new Date(promo.expires_at) > new Date()) {
        if (promo.discount_type === "percentage") {
          discountAmount = (subtotal * promo.discount_value) / 100
          if (promo.maximum_discount_amount) {
            discountAmount = Math.min(discountAmount, promo.maximum_discount_amount)
          }
        } else {
          discountAmount = promo.discount_value
        }
      }
    }

    const totalAmount = subtotal + orderData.shipping.amount - discountAmount

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        customer_first_name: orderData.customerInfo.firstName,
        customer_last_name: orderData.customerInfo.lastName,
        subtotal,
        shipping_amount: orderData.shipping.amount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        shipping_method: orderData.shipping.method,
        shipping_address: orderData.shipping.address,
        billing_address: orderData.billing?.address || orderData.shipping.address,
        special_instructions: orderData.specialInstructions,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsWithOrderId)

    if (itemsError) throw itemsError

    // Update product stock
    for (const item of orderData.items) {
      await supabase.rpc("update_product_stock", {
        product_id: item.productId,
        quantity_change: -item.quantity,
      })
    }

    return order
  }

  // Get orders with optional filtering
  static async getOrders(filters?: {
    status?: string
    customerId?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase.from("orders").select(`
        *,
        order_items (
          *,
          products (
            name,
            images
          )
        ),
        payments (
          *
        )
      `)

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.customerId) {
      query = query.eq("customer_id", filters.customerId)
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

  // Get single order
  static async getOrder(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            images,
            slug
          )
        ),
        payments (
          *
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  // Update order status
  static async updateOrderStatus(id: string, status: string, adminId?: string) {
    const updates: any = { status }

    if (status === "shipped") {
      updates.shipped_at = new Date().toISOString()
    } else if (status === "delivered") {
      updates.delivered_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()

    if (error) throw error

    // Log admin activity
    if (adminId) {
      await supabase.from("admin_activity_logs").insert({
        admin_id: adminId,
        action: "update_order_status",
        resource_type: "order",
        resource_id: id,
        details: { new_status: status },
      })
    }

    return data
  }
}
