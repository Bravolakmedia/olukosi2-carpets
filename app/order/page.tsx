import type { Metadata } from "next"
import OrderClient from "@/components/order-client"

export const metadata: Metadata = {
  title: "Place Order - Olukosi Carpets",
  description: "Place your order for premium carpets, canopies, and mats. Fast delivery across Nigeria.",
  openGraph: {
    title: "Place Order - Olukosi Carpets",
    description: "Place your order for premium carpets, canopies, and mats. Fast delivery across Nigeria.",
  },
}

export default function OrderPage() {
  return <OrderClient />
}