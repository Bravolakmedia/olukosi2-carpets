import type { Metadata } from "next"
import ContactClient from "@/components/contact-client"

export const metadata: Metadata = {
  title: "Contact Us - Olukosi Carpets",
  description: "Get in touch with Olukosi Carpets. We're here to help with your carpet, canopy, and mat needs.",
  openGraph: {
    title: "Contact Us - Olukosi Carpets",
    description: "Get in touch with Olukosi Carpets. We're here to help with your carpet, canopy, and mat needs.",
  },
}

export default function ContactPage() {
  return <ContactClient />
}
