"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Prevent static generation of this page to avoid Clerk context issues
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Create a simple loading component
function LoadingBookings() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      <div className="text-xl text-white">🔄 Loading bookings...</div>
    </div>
  )
}

// Create a client-only component for the actual content
const BookingsContent = dynamic(() => import("./bookings-content"), {
  ssr: false,
  loading: LoadingBookings
})

export default function BookingsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingBookings />
  }

  return <BookingsContent />
}
