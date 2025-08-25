"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormData {
  name: string
  description: string
  price: string
  sale_price: string
  stock_quantity: string
  material: string
  color: string
  size: string
  // If `initialData` has more keys, add them here too.
}

interface ProductFormProps {
  onSubmit: (productData: any) => void
  initialData?: any
  loading?: boolean
}

export default function ProductForm({ onSubmit, initialData, loading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
  name: initialData?.name || "",
  description: initialData?.description || "",
  price: initialData?.price || "",
  sale_price: initialData?.sale_price || "",
  stock_quantity: initialData?.stock_quantity || "",
  material: initialData?.material || "",
  color: initialData?.color || "",
  size: initialData?.size || "",
  ...initialData
})


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price) : null,
      stock_quantity: Number.parseInt(formData.stock_quantity),
    })
  }

  const handleChange = (field: keyof ProductFormData, value: string) => {
  setFormData((prev: ProductFormData) => ({
    ...prev,
    [field]: value
  }))
}


  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="sale_price">Sale Price (₦)</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => handleChange("sale_price", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleChange("stock_quantity", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={formData.color} onChange={(e) => handleChange("color", e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
