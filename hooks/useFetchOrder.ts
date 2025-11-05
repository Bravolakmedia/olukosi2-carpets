"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

type OrderItem = {
  quantity: number
  unit_price: number
  total_price: number
  product: {
    id: string
    name: string
    description: string
    price: number
    image_url: string
  }
}



export type OrderWithItems = {
  id: string
  customer_id: string
  status: string
  order_items: OrderItem[]
}

type UseFetchOrdersParams = {
  status?: string
  search?: string
  limit?: number
  offset?: number
}

export function useFetchOrders(params?: UseFetchOrdersParams) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from("orders")
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
                name,
                description,
                price,
                image_url
              )
            )
          `, { count: "exact" })

        if (params?.status) {
          query = query.eq("status", params.status)
        }

        if (params?.search) {
          // example assuming you want to search customer_id or maybe description
          query = query.or(`customer_id.ilike.%${params.search}%,status.ilike.%${params.search}%`)
        }

        if (params?.limit !== undefined && params?.offset !== undefined) {
          const from = params.offset
          const to = params.offset + params.limit - 1
          query = query.range(from, to)
        }

        const { data, error: err, count } = await query

        if (err) {
          throw err
        }

        const cleaned: OrderWithItems[] = data.map(order => ({
  id: order.id,
  customer_id: order.customer_id,
  status: order.status,
  order_items: order.order_items.map(item => ({
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    product: item.product[0]  // take first element of the array
  }))
}))


        setOrders(cleaned)
        if (count !== null) {
          setTotalCount(count)
        }
      } catch (fetchError: any) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [params?.status, params?.search, params?.limit, params?.offset])

  return { orders, loading, error, totalCount }
}
