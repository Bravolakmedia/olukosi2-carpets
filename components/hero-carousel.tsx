"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// Sample carousel images - replace with your actual carpet images
const carouselImages = [
  {
    src: "/hero-1.jpg",
    alt: "Luxury carpet collection",
  },
  {
    src: "/hero-2.jpg",
    alt: "Premium canopies for events",
  },
  {
    src: "/hero-3.jpg",
    alt: "High-quality mats collection",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src || "/placeholder.svg?height=800&width=1200"}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
