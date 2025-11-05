"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Grid as GridIcon,
  List as ListIcon,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@radix-ui/react-checkbox"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { useDebounce } from "@/hooks/useDebounce"

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
const subcategories = [
  "All",
  "Persian",
  "Modern",
  "Turkish",
  "Oriental",
  "Event",
  "Garden",
  "Door",
  "Kitchen",
]
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
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleChecked =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (checked: CheckedState) => {
      setter(checked === true)
    }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)

  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedSubcategory !== "All")
        params.append("subcategory", selectedSubcategory)
      if (selectedMaterial !== "All") params.append("material", selectedMaterial)
      if (selectedColor !== "All") params.append("color", selectedColor)
      if (showOnlyInStock) params.append("inStock", "true")
      if (showOnlySale) params.append("isSale", "true")
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
      params.append("sortBy", sortBy)

      try {
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch products")
        const { products } = await response.json()
        setProducts(products || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [
    debouncedSearch,
    selectedCategory,
    selectedSubcategory,
    selectedMaterial,
    selectedColor,
    priceRange,
    sortBy,
    showOnlyInStock,
    showOnlySale,
  ])

  const filteredProducts = useMemo(() => products, [products])

  if (loading) {
    return <p className="text-center py-20">Loading products…</p>
  }
  if (error) {
    return <p className="text-red-600 text-center py-20">Error: {error}</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-700">Our Gallery</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Discover our extensive collection of premium carpets, canopies, and mats. Each piece is carefully
          selected for quality and style.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
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

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">Search</label>
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

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sc) => (
                      <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">Material</label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {colors.map((col) => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Price Range: {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
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

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={showOnlyInStock}
                    onCheckedChange={handleChecked(setShowOnlyInStock)}
                    className="w-4 h-4 border rounded bg-white checked:bg-rose-500"
                  />
                  <label className="text-sm text-black">In Stock Only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={showOnlySale}
                    onCheckedChange={handleChecked(setShowOnlySale)}
                    className="w-4 h-4 border rounded bg-white checked:bg-rose-500"
                  />
                  <label className="text-sm text-black">On Sale Only</label>
                </div>
              </div>

            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:w-3/4">
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
                  <span className="text-sm text-gray-600">{filteredProducts.length} products found</span>
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
                      <GridIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold mb-2 text-black">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative w-full pt-[100%]">
                          <Image
                            src={product.image_url || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 flex flex-col items-start gap-2">
                      <div className="flex justify-between w-full items-start">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        {product.isSale ? (
                          <Badge className="bg-rose-500">Sale</Badge>
                        ) : product.isNew ? (
                          <Badge className="bg-emerald-500">New</Badge>
                        ) : (
                          <Badge className="bg-gray-200 text-gray-700">{product.category}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.size} • {product.material}
                      </div>
                      <div className="flex justify-between items-center w-full mt-2">
                        <div className="text-2xl font-bold">
                          {formatPrice(product.sale_price ?? product.price)}
                        </div>
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
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
