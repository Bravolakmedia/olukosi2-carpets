import type { Metadata } from "next"
import GalleryClient from "@/components/gallery-client"

export const metadata: Metadata = {
  title: "Gallery - Olukosi Carpets",
  description:
    "Browse our complete collection of premium carpets, canopies, and mats. Find the perfect piece for your space.",
  openGraph: {
    title: "Gallery - Olukosi Carpets",
    description:
      "Browse our complete collection of premium carpets, canopies, and mats. Find the perfect piece for your space.",
    images: [
      {
        url: "/gallery-og.png",
        width: 1200,
        height: 630,
        alt: "Olukosi Carpets Gallery",
      },
    ],
  },
}

export default function GalleryPage() {
  return <GalleryClient />
}