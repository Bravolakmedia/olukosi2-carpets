import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Olukosi Carpets",
  description: "Premium carpets, canopies, mats & more at wholesale & retail prices",
  metadataBase: new URL("https://olukosi-carpet-frontend.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://olukosi-carpet-frontend.vercel.app",
    title: "Olukosi Carpets",
    description: "Premium carpets, canopies, mats & more at wholesale & retail prices",
    siteName: "Olukosi Carpets",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Olukosi Carpets - Premium carpets, canopies, mats & more",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olukosi Carpets",
    description: "Premium carpets, canopies, mats & more at wholesale & retail prices",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="pt-16">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
