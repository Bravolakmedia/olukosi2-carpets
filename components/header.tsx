"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import MobileNav from "./mobile-nav"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Order", href: "/order" },
  { name: "Payment", href: "/payment" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-navy-900 text-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          Olukosi Carpets
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-rose-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-rose-400"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
          </Link>

          <Link
            href="/admin-login"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-rose-400"
          >
            <User className="h-5 w-5" />
            <span>Admin Login</span>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </header>
  )
}
