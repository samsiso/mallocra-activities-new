"use client"

/*
<ai_context>
Booking Modification Page - Allows users to modify existing bookings
Change date, time, participant count with price difference calculation.
Dark glassmorphism theme with form validation.
</ai_context>
*/

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Save,
  AlertTriangle,
  Info,
  Calculator
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getBookingByIdAction } from "@/actions/db/bookings-actions"

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

export default function BookingModifyPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModifying, setIsModifying] = useState(false)

  // Modification form state
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1) // Start from tomorrow
    return {
      date: date.toISOString().split("T")[0],
      display:
        i === 0
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

  const originalPrice = 358
  const newPrice = 179 * adults + 139 * children
  const priceDifference = newPrice - originalPrice
  const modificationFee = 25 // Fixed €25 modification fee

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingByIdAction(bookingId)
        if (result.isSuccess && result.data) {
          setBooking(result.data)
          setSelectedDate(result.data.bookingDate)
          setSelectedTime("10:30") // Default time since BookingWithDetails doesn't have bookingTime
          setAdults(result.data.participants > 0 ? result.data.participants : 2) // Use participants
          setChildren(0) // Default to 0 children
        } else {
          // Fallback to mock data
          const mockBooking = {
            id: bookingId,
            bookingReference: bookingId.slice(0, 8).toUpperCase(),
            status: "confirmed",
            activityTitle: "Scenic Mallorca Helicopter Tour",
            bookingDate: "2025-02-15",
            bookingTime: "10:30",
            adults: 2,
            children: 0,
            totalAmount: 358
          }
          setBooking(mockBooking)
          setSelectedDate(mockBooking.bookingDate)
          setSelectedTime(mockBooking.bookingTime)
          setAdults(mockBooking.adults)
          setChildren(mockBooking.children)
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleSaveModifications = async () => {
    setIsModifying(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, would call updateBookingAction
    alert(`Booking modified successfully! 
    
New Details:
- Date: ${selectedDate}
- Time: ${selectedTime}  
- Participants: ${adults} adults, ${children} children
- Price Change: €${priceDifference.toFixed(2)}
- Modification Fee: €${modificationFee}
- Total Due: €${(priceDifference + modificationFee).toFixed(2)}`)

    setIsModifying(false)
    router.push(`/booking/${bookingId}`)
  }

  const canModify = selectedDate && selectedTime && adults + children > 0
  const hasChanges =
    selectedDate !== booking?.bookingDate ||
    selectedTime !== "10:30" || // Compare with default time
    adults + children !== booking?.participants // Compare total participants

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-yellow-400"></div>
          <p>Loading booking...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <GlassCard className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Booking Not Found
          </h1>
          <Link href="/bookings">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              Back to Bookings
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/booking/${bookingId}`}>
            <Button
              variant="outline"
              className="mb-4 border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Booking Details
            </Button>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white lg:text-4xl">
              Modify Booking
            </h1>
            <p className="text-white/70">
              {booking.activityTitle} - Reference: {booking.bookingReference}
            </p>
          </div>

          {/* Modification Policy */}
          <GlassCard className="mb-8">
            <div className="flex items-start gap-3">
              <Info className="mt-1 size-5 shrink-0 text-blue-400" />
              <div>
                <h3 className="mb-2 font-bold text-white">
                  Modification Policy
                </h3>
                <ul className="space-y-1 text-sm text-white/80">
                  <li>
                    • Modifications allowed up to 24 hours before activity
                  </li>
                  <li>• €25 modification fee applies to all changes</li>
                  <li>• Price differences will be charged or refunded</li>
                  <li>• Changes subject to availability</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Modification Form */}
          <div className="space-y-8 lg:col-span-2">
            {/* Date Selection */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Calendar className="size-5 text-yellow-400" />
                Select New Date
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availableDates.slice(0, 12).map(day => (
                  <button
                    key={day.date}
                    disabled={!day.available}
                    className={cn(
                      "rounded-lg border p-3 text-sm font-medium transition-all",
                      selectedDate === day.date
                        ? "border-yellow-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                        : day.available
                          ? "border-white/30 bg-white/10 text-white hover:border-yellow-400/50 hover:bg-white/20"
                          : "cursor-not-allowed border-white/10 text-white/30 opacity-50"
                    )}
                    onClick={() => day.available && setSelectedDate(day.date)}
                  >
                    {day.display}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Time Selection */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Clock className="size-5 text-yellow-400" />
                Select New Time
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
            </GlassCard>

            {/* Participant Selection */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Users className="size-5 text-yellow-400" />
                Update Participants
              </h3>

              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-4">
                  <div>
                    <p className="font-medium text-white">Adults</p>
                    <p className="text-sm text-white/60">Ages 8+ • €179 each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 border-white/30 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-lg font-bold text-white">
                      {adults}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 border-white/30 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-4">
                  <div>
                    <p className="font-medium text-white">Children</p>
                    <p className="text-sm text-white/60">
                      Ages 6-7 • €139 each
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 border-white/30 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-lg font-bold text-white">
                      {children}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 border-white/30 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-8">
            {/* Modification Summary */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">
                Modification Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 text-white/60">Current Booking</p>
                  <p className="text-white">
                    {booking.bookingDate} at {booking.bookingTime}
                  </p>
                  <p className="text-white">
                    {booking.adults} adults, {booking.children} children
                  </p>
                </div>

                <Separator className="bg-white/20" />

                <div>
                  <p className="mb-1 text-white/60">New Booking</p>
                  <p className="text-white">
                    {selectedDate} at {selectedTime}
                  </p>
                  <p className="text-white">
                    {adults} adults, {children} children
                  </p>
                </div>

                {hasChanges && (
                  <>
                    <Separator className="bg-white/20" />

                    <div>
                      <p className="mb-2 text-white/60">Changes Detected</p>
                      {selectedDate !== booking.bookingDate && (
                        <p className="text-xs text-yellow-400">
                          • Date changed
                        </p>
                      )}
                      {selectedTime !== booking.bookingTime && (
                        <p className="text-xs text-yellow-400">
                          • Time changed
                        </p>
                      )}
                      {(adults !== booking.adults ||
                        children !== booking.children) && (
                        <p className="text-xs text-yellow-400">
                          • Participants changed
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </GlassCard>

            {/* Price Calculation */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <Calculator className="size-4 text-yellow-400" />
                Price Changes
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Original Price</span>
                  <span className="text-white">€{originalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">New Price</span>
                  <span className="text-white">€{newPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">Modification Fee</span>
                  <span className="text-white">€{modificationFee}</span>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex justify-between font-bold">
                  <span className="text-white">
                    {priceDifference >= 0 ? "Amount Due" : "Refund"}
                  </span>
                  <span
                    className={cn(
                      "text-lg",
                      priceDifference >= 0 ? "text-red-400" : "text-green-400"
                    )}
                  >
                    €{Math.abs(priceDifference + modificationFee).toFixed(2)}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSaveModifications}
                disabled={!canModify || !hasChanges || isModifying}
                className={cn(
                  "w-full font-bold",
                  canModify && hasChanges
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600"
                    : "cursor-not-allowed bg-gray-600 text-gray-400"
                )}
              >
                {isModifying ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    {hasChanges ? "Save Modifications" : "No Changes Made"}
                  </>
                )}
              </Button>

              {!hasChanges && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                  <Info className="size-4 text-blue-400" />
                  <span className="text-sm text-blue-400">
                    Make changes above to modify your booking
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
