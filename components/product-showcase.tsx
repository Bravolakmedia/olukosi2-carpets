"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// Sample product data - replace with your actual products
const products = [
  {
    id: 1,
    name: "Luxury Persian Carpet",
    description: "Hand-woven premium Persian carpet with intricate designs",
    price: 120000,
    image: "/product-1.jpg",
    category: "Carpets",
    isNew: true,
    isSale: false,
  },
  {
    id: 2,
    name: "Modern Geometric Rug",
    description: "Contemporary geometric pattern rug for modern homes",
    price: 85000,
    image: "/product-2.jpg",
    category: "Carpets",
    isNew: false,
    isSale: true,
    salePrice: 65000,
  },
  {
    id: 3,
    name: "Outdoor Event Canopy",
    description: "Durable waterproof canopy perfect for outdoor events",
    price: 150000,
    image: "/product-3.jpg",
    category: "Canopies",
    isNew: true,
    isSale: false,
  },
  {
    id: 4,
    name: "Premium Door Mat",
    description: "High-quality entrance mat with non-slip backing",
    price: 15000,
    image: "/product-4.jpg",
    category: "Mats",
    isNew: false,
    isSale: false,
  },
]

export default function ProductShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  // Format price in Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <div className="relative pt-[100%]">
            <Image
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isNew && <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600">New</Badge>}
            {product.isSale && <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600">Sale</Badge>}
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                hoveredProduct === product.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-rose-500 hover:bg-rose-600">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">{product.category}</div>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg mb-1 hover:text-rose-500 transition-colors">{product.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div>
              {product.isSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-rose-500">{formatPrice(product.salePrice!)}</span>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              )}
            </div>
            <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-0">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
