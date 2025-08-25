"use client"

import { useState } from "react"

interface OrderData {
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
  paymentMethod: string
  specialInstructions?: string
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: OrderData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const result = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}
