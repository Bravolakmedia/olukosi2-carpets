import { supabaseAdmin } from "@/lib/supabaseAdmin"
import type { Database } from "@/lib/types/database"

type Product = Database["public"]["Tables"]["products"]["Row"]
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export class ProductService {
  static async getProducts(filters?: {
    category?: string
    featured?: boolean
    active?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabaseAdmin.from("products").select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)

    if (filters?.category) query = query.eq("categories.slug", filters.category)
    if (filters?.featured !== undefined) query = query.eq("is_featured", filters.featured)
    if (filters?.active !== undefined) query = query.eq("is_active", filters.active)
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data
  }

  static async getProduct(identifier: string, bySlug = false) {
    const column = bySlug ? "slug" : "id"
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq(column, identifier)
      .single()

    if (error) throw error
    return data
  }

  static async createProduct(product: ProductInsert) {
    const { data, error } = await supabaseAdmin.from("products").insert(product).select().single()
    if (error) throw error
    return data
  }

  static async updateProduct(id: string, updates: ProductUpdate) {
    const { data, error } = await supabaseAdmin.from("products").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data
  }

  static async deleteProduct(id: string) {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id)
    if (error) throw error
  }

  static async updateStock(id: string, quantity: number, type: "sale" | "restock" | "adjustment") {
    const { data: product } = await supabaseAdmin.from("products").select("stock_quantity").eq("id", id).single()
    if (!product) throw new Error("Product not found")

    const newQuantity = type === "sale" ? product.stock_quantity - quantity : product.stock_quantity + quantity

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ stock_quantity: newQuantity })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error

    await supabaseAdmin.from("inventory_logs").insert({
      product_id: id,
      type,
      quantity_change: type === "sale" ? -quantity : quantity,
      previous_quantity: product.stock_quantity,
      new_quantity: newQuantity,
    })

    return data
  }
}
