import type { Metadata } from "next"
import AdminLoginClient from "@/components/admin-login-client"

export const metadata: Metadata = {
  title: "Admin Login - Olukosi Carpets",
  description: "Secure admin access to manage Olukosi Carpets inventory, orders, and business operations.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return <AdminLoginClient />
}
