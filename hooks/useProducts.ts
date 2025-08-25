"use client"

import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  price: number
  sale_price?: number
  images: string[]
  category: string
  stock_quantity: number
  is_featured: boolean
}

interface UseProductsOptions {
  category?: string
  featured?: boolean
  search?: string
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const params = new URLSearchParams()

        if (options.category) params.append("category", options.category)
        if (options.featured) params.append("featured", "true")
        if (options.search) params.append("search", options.search)
        if (options.limit) params.append("limit", options.limit.toString())

        const response = await fetch(`/api/products?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [options.category, options.featured, options.search, options.limit])

  return { products, loading, error }
}
