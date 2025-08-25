"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User } from "lucide-react"

// Navigation items
const navItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Order", href: "/order" },
  { name: "Payment", href: "/payment" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? "hidden" : ""
  }

  // Close menu when clicking outside
  const closeMenu = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
      document.body.style.overflow = ""
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-navy-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-bold z-50">
          Olukosi Carpets
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="z-50 text-white focus:outline-none"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} aria-hidden="true"></div>
        )}

        {/* Side Navigation Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-navy-900 z-40 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          <div className="p-6 pt-20">
            {/* Navigation Links */}
            <nav className="space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white text-xl font-medium hover:text-rose-400 transition-colors py-2 border-b border-gray-800"
                  onClick={() => {
                    setIsOpen(false)
                    document.body.style.overflow = ""
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Additional Links */}
            <div className="mt-8 space-y-6">
              <Link
                href="/cart"
                className="flex items-center text-white text-xl font-medium hover:text-rose-400 transition-colors py-2 border-b border-gray-800"
                onClick={() => {
                  setIsOpen(false)
                  document.body.style.overflow = ""
                }}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                Cart
              </Link>
              <Link
                href="/admin-login"
                className="flex items-center text-white text-xl font-medium hover:text-rose-400 transition-colors py-2 border-b border-gray-800"
                onClick={() => {
                  setIsOpen(false)
                  document.body.style.overflow = ""
                }}
              >
                <User className="mr-3 h-5 w-5" />
                Admin Login
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 text-gray-400">
              <p className="mb-2">Contact Us:</p>
              <p className="text-sm mb-1">151 Station Road Idi-Seke, Osogbo</p>
              <p className="text-sm mb-1">olukosicarpets@gmail.com</p>
              <p className="text-sm">+234 812 487 2665</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
