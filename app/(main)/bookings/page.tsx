"use client"

import { useEffect, useState } from "react"

// Loading component
function BookingsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-yellow-400"></div>
        <p className="text-xl">Loading your bookings...</p>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const [mounted, setMounted] = useState(false)
  const [BookingsContent, setBookingsContent] = useState<any>(null)

  useEffect(() => {
    // Only load the content client-side
    const loadContent = async () => {
      try {
        const contentModule = await import("./client-bookings")
        setBookingsContent(() => contentModule.default)
      } catch (error) {
        console.error("Failed to load bookings content:", error)
      }
      setMounted(true)
    }

    loadContent()
  }, [])

  if (!mounted || !BookingsContent) {
    return <BookingsLoading />
  }

  return <BookingsContent />
}
