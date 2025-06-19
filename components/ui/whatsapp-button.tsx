"use client"

/*
<ai_context>
Floating WhatsApp button component.
Sticky positioned on the bottom right corner of the screen for easy customer contact.
Uses WhatsApp green branding and includes hover animations.
</ai_context>
*/

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export default function WhatsAppButton({
  phoneNumber = "+34612345678", // Fake Spanish number
  message = "Hi! I'm interested in booking an activity in Mallorca. Can you help me?",
  className = ""
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`fixed bottom-6 right-6 z-50 size-14 rounded-full bg-green-500 p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-xl ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="size-7 text-white" />
    </Button>
  )
}
