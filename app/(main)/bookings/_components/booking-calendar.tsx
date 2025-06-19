"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { cn } from "@/lib/utils"

function GlassCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-white">
            Booking Calendar
          </h2>
          <p className="text-white/70">
            Visual overview of your scheduled activities
          </p>
        </div>
      </div>

      <GlassCard>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <h3 className="text-xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="py-12 text-center">
          <Calendar className="mx-auto mb-4 size-16 text-white/30" />
          <h3 className="mb-2 text-xl font-bold text-white">
            Calendar View Coming Soon
          </h3>
          <p className="text-white/70">
            Visual calendar view with booking details will be available soon.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
