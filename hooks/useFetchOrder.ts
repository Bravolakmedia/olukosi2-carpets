// hooks/useFetchOrders.ts
import { useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'
import { id } from 'date-fns/locale'

type OrderItemWithProduct = {
  quantity: number
  unit_price: number
  total_price: number
  product: {
    total_price: ReactNode
    quantity: ReactNode
    id: string
    name: string
    description: string
    price: number
    image_url: string
  }
} 
type OrderWithItems = {
  id: string
  customer_id: string
  status: string
  order_items: Array<{
    quantity: number
    unit_price: number
    total_price: number
    product: {
      id: string
      description: string
      price: number
      image_url: string
    }
  }>
}
const ordersQuery = supabase
  .from('orders')
  .select(`
    id,
    customer_id,
    status,
    order_items (
      quantity,
      unit_price,
      total_price,
      product:products (
        id,
        description,
        price,
        image_url
      )
    )
  `)

type OrdersWithItems = QueryData<typeof ordersQuery>


export function useFetchOrders(filters?: { status?: string, limit?: number, offset?: number }) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      let query = supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          status,
          order_items (
      quantity,
      unit_price,
      total_price, 
      products(
        id,
        description,
        price,
        image_url
      )
    )
          `);
        const { data, error: err } = await ordersQuery
      if (err) { setError(err.message) }
      else {
        // transform product array to single object
        const clean: OrderWithItems[] = data.map(o => ({
          id: o.id,
          customer_id: o.customer_id,
          status: o.status,
          order_items: o.order_items.map(item => ({
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            product: item.product[0]
          }))
        }))
        setOrders(clean)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [filters])

  return { orders, loading, error }
}