import type { Metadata } from "next"
import CartClient from "@/components/cart-client"

export const metadata: Metadata = {
  title: "Shopping Cart - Olukosi Carpets",
  description: "Review your selected items and proceed to checkout.",
  openGraph: {
    title: "Shopping Cart - Olukosi Carpets",
    description: "Review your selected items and proceed to checkout.",
  },
}

export default function CartPage() {
  return <CartClient />
}