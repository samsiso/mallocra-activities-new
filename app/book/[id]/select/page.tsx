"use client"

/*
<ai_context>
Booking Select Page - Step 1 of booking flow
User selects date, time, and number of participants for the activity.
Dark glassmorphism theme with progress indicator.
Saves selections to localStorage and redirects to details page.
</ai_context>
*/

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Glassmorphism card component
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

// Progress indicator component
function BookingProgress({ currentStep = 1 }: { currentStep?: number }) {
  const steps = [
    { number: 1, label: "Select", icon: Calendar },
    { number: 2, label: "Details", icon: Users },
    { number: 3, label: "Payment", icon: Clock }
  ]

  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep

        return (
          <div key={step.number} className="flex items-center">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 transition-all",
                isActive
                  ? "border-yellow-400 bg-yellow-400 text-black"
                  : isCompleted
                    ? "border-green-400 bg-green-400 text-black"
                    : "border-white/30 bg-white/10 text-white/70"
              )}
            >
              <Icon className="size-4" />
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                isActive ? "text-yellow-400" : "text-white/70"
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px w-12 transition-all",
                  isCompleted ? "bg-green-400" : "bg-white/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function BookingSelectPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = params.id as string

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || ""
  )
  const [selectedTime, setSelectedTime] = useState(
    searchParams.get("time") || ""
  )
  const [adults, setAdults] = useState(
    parseInt(searchParams.get("adults") || "2")
  )
  const [children, setChildren] = useState(
    parseInt(searchParams.get("children") || "0")
  )

  // Mock activity data - in real app would fetch from API
  const [activity, setActivity] = useState({
    id: activityId,
    title: "Scenic Mallorca Helicopter Tour",
    location: "Palma de Mallorca",
    duration: "45 minutes",
    maxParticipants: 6,
    adultPrice: 179,
    childPrice: 139,
    spotsLeft: 3
  })

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().split("T")[0],
      display:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
              }),
      available: true
    }
  })

  const availableTimes = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]
  const totalPrice = 179 * adults + 139 * children

  const handleProceed = () => {
    const bookingData = {
      activityId,
      selectedDate,
      selectedTime,
      adults,
      children,
      totalPrice
    }
    localStorage.setItem("booking-data", JSON.stringify(bookingData))
    router.push(`/book/${activityId}/details`)
  }

  const canProceed = selectedDate && selectedTime && adults + children > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Select Your Experience
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Date Selection */}
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Calendar className="size-5 text-yellow-400" />
                Choose Date
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableDates.map(day => (
                  <button
                    key={day.date}
                    className={cn(
                      "rounded-lg border p-3 text-sm font-medium transition-all",
                      selectedDate === day.date
                        ? "border-yellow-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                        : "border-white/30 bg-white/10 text-white hover:border-yellow-400/50 hover:bg-white/20"
                    )}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    {day.display}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                  <Clock className="size-5 text-yellow-400" />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      className={cn(
                        "rounded-lg border p-3 text-sm font-medium transition-all",
                        selectedTime === time
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                          : "border-white/30 bg-white/10 text-white hover:border-yellow-400/50 hover:bg-white/20"
                      )}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Users className="size-5 text-yellow-400" />
                Participants
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Adults</div>
                    <div className="text-sm text-white/70">€179 each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-8 border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-white">{adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-8 border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Children</div>
                    <div className="text-sm text-white/70">€139 each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-8 border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-white">
                      {children}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-8 border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-bold text-white">
              Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-white/70">Date</span>
                  <span className="text-white">{selectedDate}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-white/70">Time</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/70">Participants</span>
                <span className="text-white">{adults + children}</span>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">€{totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleProceed}
                disabled={!canProceed}
                className={cn(
                  "w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600",
                  !canProceed && "cursor-not-allowed opacity-50"
                )}
              >
                Continue to Details
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Activity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
