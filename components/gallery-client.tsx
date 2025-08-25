"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@radix-ui/react-checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox"; // ✅ Add this


// Sample product data - replace with actual data from Supabase
const products = [
  {
    id: 1,
    name: "Luxury Persian Carpet",
    description: "Hand-woven premium Persian carpet with intricate traditional designs",
    price: 120000,
    salePrice: null,
    image: "/product-1.jpg",
    category: "Carpets",
    subcategory: "Persian",
    size: "8x10 ft",
    material: "Wool",
    color: "Red",
    isNew: true,
    isSale: false,
    inStock: true,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "Modern Geometric Rug",
    description: "Contemporary geometric pattern rug perfect for modern homes",
    price: 85000,
    salePrice: 65000,
    image: "/product-2.jpg",
    category: "Carpets",
    subcategory: "Modern",
    size: "6x9 ft",
    material: "Synthetic",
    color: "Blue",
    isNew: false,
    isSale: true,
    inStock: true,
    rating: 4.5,
    reviews: 18,
  },
  {
    id: 3,
    name: "Outdoor Event Canopy",
    description: "Durable waterproof canopy perfect for outdoor events and gatherings",
    price: 150000,
    salePrice: null,
    image: "/product-3.jpg",
    category: "Canopies",
    subcategory: "Event",
    size: "10x10 ft",
    material: "Polyester",
    color: "White",
    isNew: true,
    isSale: false,
    inStock: true,
    rating: 4.7,
    reviews: 12,
  },
  {
    id: 4,
    name: "Premium Door Mat",
    description: "High-quality entrance mat with non-slip backing for safety",
    price: 15000,
    salePrice: null,
    image: "/product-4.jpg",
    category: "Mats",
    subcategory: "Door",
    size: "2x3 ft",
    material: "Rubber",
    color: "Brown",
    isNew: false,
    isSale: false,
    inStock: true,
    rating: 4.3,
    reviews: 31,
  },
  {
    id: 5,
    name: "Traditional Turkish Carpet",
    description: "Authentic Turkish carpet with beautiful traditional patterns",
    price: 95000,
    salePrice: null,
    image: "/product-5.png",
    category: "Carpets",
    subcategory: "Turkish",
    size: "5x8 ft",
    material: "Wool",
    color: "Beige",
    isNew: false,
    isSale: false,
    inStock: false,
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 6,
    name: "Garden Party Canopy",
    description: "Elegant canopy perfect for garden parties and outdoor dining",
    price: 180000,
    salePrice: 140000,
    image: "/product-6.png",
    category: "Canopies",
    subcategory: "Garden",
    size: "12x12 ft",
    material: "Canvas",
    color: "Green",
    isNew: false,
    isSale: true,
    inStock: true,
    rating: 4.9,
    reviews: 8,
  },
  {
    id: 7,
    name: "Kitchen Floor Mat",
    description: "Anti-fatigue kitchen mat with cushioned support",
    price: 25000,
    salePrice: null,
    image: "/product-7.png",
    category: "Mats",
    subcategory: "Kitchen",
    size: "2x4 ft",
    material: "Foam",
    color: "Gray",
    isNew: true,
    isSale: false,
    inStock: true,
    rating: 4.4,
    reviews: 22,
  },
  {
    id: 8,
    name: "Vintage Oriental Rug",
    description: "Beautiful vintage-style oriental rug with aged patina",
    price: 110000,
    salePrice: null,
    image: "/product-8.png",
    category: "Carpets",
    subcategory: "Oriental",
    size: "7x10 ft",
    material: "Wool",
    color: "Multi",
    isNew: false,
    isSale: false,
    inStock: true,
    rating: 4.7,
    reviews: 19,
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [selectedMaterial, setSelectedMaterial] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)

  const handleChecked =
  (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
  (checked: CheckedState) => {
    setter(checked === true);
  };


  // Format price in Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSubcategory = selectedSubcategory === "All" || product.subcategory === selectedSubcategory
      const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial
      const matchesColor = selectedColor === "All" || product.color === selectedColor
      const currentPrice = product.salePrice || product.price
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

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.salePrice || a.price) - (b.salePrice || b.price)
        case "price-high":
          return (b.salePrice || b.price) - (a.salePrice || a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew ? 1 : -1
        default:
          return 0
      }
    })

    return filtered
  }, [
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

              {/* Search */}
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

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Material Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Material</label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  onValueChange={setPriceRange}
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
                  <label htmlFor="in-stock" className="text-sm">
                    In Stock Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
  checked={showOnlySale}
  onCheckedChange={handleChecked(setShowOnlySale)}
/>
                  <label htmlFor="on-sale" className="text-sm">
                    On Sale Only
                  </label>
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
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
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

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
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

// Product Card Component
function ProductCard({ product, viewMode }: { product: any; viewMode: "grid" | "list" }) {
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
              src={product.image || "/placeholder.svg?height=200&width=200"}
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
                {product.isSale ? (
                  <div>
                    <span className="text-2xl font-bold text-rose-500">{formatPrice(product.salePrice!)}</span>
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
          src={product.image || "/placeholder.svg?height=400&width=400"}
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
          {product.isSale ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-rose-500">{formatPrice(product.salePrice!)}</span>
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
