import type { Metadata } from "next"
import PaymentClient from "@/components/payment-client"

export const metadata: Metadata = {
  title: "Payment - Olukosi Carpets",
  description: "Complete your payment securely for your carpet order.",
  openGraph: {
    title: "Payment - Olukosi Carpets",
    description: "Complete your payment securely for your carpet order.",
  },
}

export default function PaymentPage() {
  return <PaymentClient />
}
