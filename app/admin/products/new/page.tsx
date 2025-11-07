"use client"

import { useRouter } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { useState } from "react"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (productData: any) => {
    setLoading(true)
    const res = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })

    const result = await res.json()
    setLoading(false)

    if (!res.ok) {
      alert("Error adding product: " + result.error)
    } else {
      alert("Product created successfully!")
      router.push("/admin-dashboard")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
