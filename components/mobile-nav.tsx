"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Order", href: "/order" },
  { name: "Payment", href: "/payment" },
  { name: "Contact", href: "/contact" },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button - Always visible on mobile */}
      <Button
        onClick={toggleMenu}
        variant="ghost"
        size="icon"
        className="bg-rose-500 hover:bg-rose-600 text-white fixed top-4 right-4 z-50 rounded-full shadow-lg"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-navy-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/" className="font-bold text-xl text-white" onClick={() => setIsOpen(false)}>
              Olukosi Carpets
            </Link>
          </div>
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-3 text-lg font-medium text-white transition-colors hover:text-rose-400 border-b border-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/cart"
              className="py-3 flex items-center gap-2 text-lg font-medium text-white transition-colors hover:text-rose-400 border-b border-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>
            <Link
              href="/admin-login"
              className="py-3 flex items-center gap-2 text-lg font-medium text-white transition-colors hover:text-rose-400"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
