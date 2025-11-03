// src/components/gallery-client.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@radix-ui/react-checkbox"
import type { CheckedState } from "@radix-ui/react-checkbox"

import { supabase } from "@/lib/supabaseClient"
import { ProductService } from "@/lib/services/products"

// Define your product type (adjust fields based on your DB)
type Product = {
  id: number | string
  name: string
  description: string
  price: number
  sale_price: number | null
  image_url: string
  category: string
  subcategory: string
  size: string
  material: string
  color: string
  isNew: boolean
  isSale: boolean
  inStock: boolean
  rating: number
  reviews: number
}

const categories = ["All", "Carpets", "Canopies", "Mats"]
const subcategories = ["All", "Persian", "Modern", "Turkish", "Oriental", "Event", "Garden", "Door", "Kitchen"]
const materials = ["All", "Wool", "Synthetic", "Polyester", "Rubber", "Canvas", "Foam"]
const colors = ["All", "Red", "Blue", "White", "Brown", "Beige", "Green", "Gray", "Multi"]
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
]

export default function GalleryClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [selectedMaterial, setSelectedMaterial] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)

  const handleChecked =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (checked: CheckedState) => {
      setter(checked === true)
    }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error: err } = await supabase
        .from<"products", Product>("products")
        .select(`
          id,
          name,
          description,
          price,
          sale_price,
          image_url,
          category,
          subcategory,
          size,
          material,
          color,
          isNew,
          isSale,
          inStock,
          rating,
          reviews
        `)
        .order("id", { ascending: true })

      if (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } else if (data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSubcategory = selectedSubcategory === "All" || product.subcategory === selectedSubcategory
      const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial
      const matchesColor = selectedColor === "All" || product.color === selectedColor
      const currentPrice = product.sale_price ?? product.price
      const matchesPrice = currentPrice >= priceRange[0] && currentPrice <= priceRange[1]
      const matchesStock = !showOnlyInStock || product.inStock
      const matchesSale = !showOnlySale || product.isSale

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesMaterial &&
        matchesColor &&
        matchesPrice &&
        matchesStock &&
        matchesSale
      )
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.sale_price ?? a.price) - (b.sale_price ?? b.price)
        case "price-high":
          return (b.sale_price ?? b.price) - (a.sale_price ?? a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedMaterial,
    selectedColor,
    priceRange,
    sortBy,
    showOnlyInStock,
    showOnlySale,
  ])

  if (loading) {
    return <p className="text-center py-20">Loading products…</p>
  }
  if (error) {
    return <p className="text-red-600 text-center py-20">Error: {error}</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-700">Our Gallery</h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Discover our extensive collection of premium carpets, canopies, and mats. Each piece is carefully selected
            for quality and style.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-600">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedSubcategory("All")
                    setSelectedMaterial("All")
                    setSelectedColor("All")
                    setPriceRange([0, 200000])
                    setShowOnlyInStock(false)
                    setShowOnlySale(false)
                    setSearchTerm("")
                  }}
                >
                  Clear All
                </Button>
              </div>

              {/* … All filter controls … */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Material */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Material</label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange as any}
                  max={200000}
                  min={0}
                  step={5000}
                  className="mt-2"
                />
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={showOnlyInStock}
                    onCheckedChange={handleChecked(setShowOnlyInStock)}
                  />
                  <label className="text-sm">In Stock Only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={showOnlySale}
                    onCheckedChange={handleChecked(setShowOnlySale)}
                  />
                  <label className="text-sm">On Sale Only</label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <span className="text-sm text-gray-600">{filteredAndSortedProducts.length} products found</span>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48">
            <Image
              src={product.image_url || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isNew && <Badge className="absolute top-2 left-2 bg-emerald-500">New</Badge>}
            {product.isSale && <Badge className="absolute top-2 left-2 bg-rose-500">Sale</Badge>}
            {!product.inStock && <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>}
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>Category: {product.category}</span>
                  <span>Size: {product.size}</span>
                  <span>Material: {product.material}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                {product.sale_price ? (
                  <div>
                    <span className="text-2xl font-bold text-rose-500">{formatPrice(product.sale_price)}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                )}
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%]">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isNew && <Badge className="absolute top-3 left-3 bg-emerald-500">New</Badge>}
        {product.isSale && <Badge className="absolute top-3 left-3 bg-rose-500">Sale</Badge>}
        {!product.inStock && <Badge className="absolute top-3 right-3 bg-gray-500">Out of Stock</Badge>}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="rounded-full w-10 h-10 p-0 bg-rose-500 hover:bg-rose-600"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-rose-500 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
        </div>
        <div className="text-sm text-gray-500">
          {product.size} • {product.material}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          {product.sale_price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-rose-500">{formatPrice(product.sale_price)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
        <Link href={`/product/${product.id}`}>
          <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-0">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
