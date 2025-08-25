"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample cart data - replace with actual cart state management
const initialCartItems = [
  {
    id: 1,
    name: "Luxury Persian Carpet",
    description: "Hand-woven premium Persian carpet with intricate designs",
    price: 120000,
    salePrice: null,
    image: "/product-1.jpg",
    category: "Carpets",
    size: "8x10 ft",
    color: "Red",
    quantity: 1,
    inStock: true,
    maxQuantity: 5,
  },
  {
    id: 2,
    name: "Modern Geometric Rug",
    description: "Contemporary geometric pattern rug for modern homes",
    price: 85000,
    salePrice: 65000,
    image: "/product-2.jpg",
    category: "Carpets",
    size: "6x9 ft",
    color: "Blue",
    quantity: 2,
    inStock: true,
    maxQuantity: 3,
  },
  {
    id: 3,
    name: "Premium Door Mat",
    description: "High-quality entrance mat with non-slip backing",
    price: 15000,
    salePrice: null,
    image: "/product-4.jpg",
    category: "Mats",
    size: "2x3 ft",
    color: "Brown",
    quantity: 1,
    inStock: false,
    maxQuantity: 10,
  },
]

export default function CartClient() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  // Format price in Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) } : item)),
    )
  }

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  // Move to wishlist
  const moveToWishlist = (id: number) => {
    // Implement wishlist functionality
    removeItem(id)
  }

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
      setPromoDiscount(0.1) // 10% discount
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.salePrice || item.price
    return total + itemPrice * item.quantity
  }, 0)

  const discountAmount = subtotal * promoDiscount
  const deliveryFee = subtotal > 100000 ? 0 : 5000 // Free delivery over ₦100,000
  const total = subtotal - discountAmount + deliveryFee

  const inStockItems = cartItems.filter((item) => item.inStock)
  const outOfStockItems = cartItems.filter((item) => !item.inStock)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/gallery">
              <Button className="bg-rose-500 hover:bg-rose-600">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/gallery">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-gray-600">{cartItems.length} items in your cart</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Out of Stock Alert */}
              {outOfStockItems.length > 0 && (
                <Alert>
                  <AlertDescription>
                    Some items in your cart are currently out of stock and won't be included in your order.
                  </AlertDescription>
                </Alert>
              )}

              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Items ({inStockItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {inStockItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=100&width=100"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              {item.salePrice ? (
                                <div>
                                  <span className="font-bold text-rose-500">{formatPrice(item.salePrice)}</span>
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold">{formatPrice(item.price)}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                  className="w-16 text-center border-0 focus-visible:ring-0"
                                  min="1"
                                  max={item.maxQuantity}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {item.quantity >= item.maxQuantity && (
                                <span className="text-xs text-amber-600">Max quantity reached</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => moveToWishlist(item.id)}>
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-500">Out of Stock Items ({outOfStockItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {outOfStockItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0 opacity-60">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=100&width=100"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg grayscale"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-red-500">Out of Stock</Badge>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                              </div>
                            </div>
                            <span className="font-bold">{formatPrice(item.price)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-500">Currently unavailable</span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => moveToWishlist(item.id)}>
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label>Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                      />
                      <Button variant="outline" onClick={applyPromoCode} disabled={promoApplied || !promoCode}>
                        Apply
                      </Button>
                    </div>
                    {promoApplied && <p className="text-sm text-green-600">Promo code applied successfully!</p>}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal ({inStockItems.length} items):</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%):</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                    </div>

                    {deliveryFee === 0 && (
                      <p className="text-xs text-green-600">Free delivery on orders over ₦100,000</p>
                    )}

                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    onClick={() => router.push("/order")}
                    disabled={inStockItems.length === 0}
                  >
                    Proceed to Checkout ({inStockItems.length} items)
                  </Button>

                  {/* Security Info */}
                  <div className="text-xs text-gray-500 text-center">
                    <p>Secure checkout with SSL encryption</p>
                    <p>30-day return policy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
