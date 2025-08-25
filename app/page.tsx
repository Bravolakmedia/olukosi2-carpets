import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import ProductShowcase from "@/components/product-showcase"
import HeroCarousel from "@/components/hero-carousel"
import { ChevronRight, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Olukosi Carpets - Premium Carpets, Canopies & Mats",
  description: "Explore our premium collection of carpets, canopies, mats & more - all at wholesale & retail prices.",
  openGraph: {
    title: "Olukosi Carpets - Premium Carpets, Canopies & Mats",
    description: "Explore our premium collection of carpets, canopies, mats & more - all at wholesale & retail prices.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Olukosi Carpets",
      },
    ],
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <HeroCarousel />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Welcome to Olukosi Carpets
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Explore our premium collection of carpets, canopies, mats & more - all at wholesale & retail prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-6 text-lg">
                Browse Gallery <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white font-semibold px-8 py-6 text-lg"
              >
                Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl text-black font-bold text-center mb-8">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Carpets", "Canopies", "Mats"].map((category) => (
              <div key={category} className="relative group overflow-hidden rounded-lg shadow-md">
                <Image
                  src={`/category-${category.toLowerCase()}.jpg`}
                  alt={`${category} Collection`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-bold text-white mb-2">{category}</h3>
                    <Link
                      href={`/gallery?category=${category.toLowerCase()}`}
                      className="text-white/90 hover:text-white text-sm inline-flex items-center"
                    >
                      View Collection <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/gallery" className="text-rose-600 hover:text-rose-700 font-medium flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductShowcase />
          <div className="mt-10 text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
            >
              View Special Offers
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-rose-600 text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Discover our premium collection of carpets, canopies, and mats at wholesale and retail prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
