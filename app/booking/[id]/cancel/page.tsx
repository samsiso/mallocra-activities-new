"use client"

/*
<ai_context>
Booking Cancellation Page - Allows users to cancel existing bookings
Shows cancellation policy, refund calculation, and cancellation reason selection.
Dark glassmorphism theme with confirmation flow.
</ai_context>
*/

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  X,
  AlertTriangle,
  Info,
  Calculator,
  RefreshCcw,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

const cancellationReasons = [
  "Change of plans",
  "Weather concerns",
  "Medical emergency",
  "Travel cancellation",
  "Found alternative",
  "Financial reasons",
  "Other"
]

export default function BookingCancelPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [additionalComments, setAdditionalComments] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Cancellation policy calculation
  const calculateRefund = (bookingDate: string, totalAmount: number) => {
    const now = new Date()
    const activityDate = new Date(bookingDate)
    const hoursUntilActivity =
      (activityDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    let refundPercentage = 0
    let cancellationFee = 0

    if (hoursUntilActivity >= 72) {
      refundPercentage = 100
      cancellationFee = 0
    } else if (hoursUntilActivity >= 24) {
      refundPercentage = 75
      cancellationFee = 25
    } else if (hoursUntilActivity >= 12) {
      refundPercentage = 50
      cancellationFee = 25
    } else {
      refundPercentage = 0
      cancellationFee = 50
    }

    const refundAmount =
      (totalAmount * refundPercentage) / 100 - cancellationFee

    return {
      refundPercentage,
      cancellationFee,
      refundAmount: Math.max(0, refundAmount),
      hoursUntilActivity
    }
  }

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingByIdAction(bookingId)
        if (result.isSuccess && result.data) {
          setBooking(result.data)
        } else {
          // Fallback to mock data
          setBooking({
            id: bookingId,
            bookingReference: bookingId.slice(0, 8).toUpperCase(),
            status: "confirmed",
            activityTitle: "Scenic Mallorca Helicopter Tour",
            bookingDate: "2025-02-15",
            bookingTime: "10:30",
            totalAmount: 358,
            leadCustomerName: "John Doe"
          })
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleCancel = async () => {
    setIsCancelling(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, would call updateBookingStatusAction
    alert(`Booking cancelled successfully!
    
Cancellation Details:
- Reason: ${selectedReason}
- Refund Amount: €${refundDetails.refundAmount.toFixed(2)}
- Processing Time: 3-5 business days
    
You will receive a confirmation email shortly.`)

    setIsCancelling(false)
    router.push("/bookings")
  }

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

  const refundDetails = calculateRefund(
    booking.bookingDate,
    booking.totalAmount
  )
  const canCancel =
    booking.status === "confirmed" || booking.status === "pending"

  if (!canCancel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <GlassCard className="max-w-md text-center">
          <AlertTriangle className="mx-auto mb-4 size-12 text-red-400" />
          <h1 className="mb-2 text-2xl font-bold text-white">Cannot Cancel</h1>
          <p className="mb-6 text-white/70">
            This booking cannot be cancelled as it has already been{" "}
            {booking.status}.
          </p>
          <Link href={`/booking/${bookingId}`}>
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              Back to Booking
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
              Cancel Booking
            </h1>
            <p className="text-white/70">
              {booking.activityTitle} - Reference: {booking.bookingReference}
            </p>
          </div>

          {/* Warning Banner */}
          <GlassCard className="mb-8 border-red-500/30 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 size-5 shrink-0 text-red-400" />
              <div>
                <h3 className="mb-2 font-bold text-red-400">
                  Important Notice
                </h3>
                <p className="text-sm text-white/80">
                  Cancelling this booking is permanent and cannot be undone.
                  Please review the cancellation policy and refund details
                  carefully before proceeding.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cancellation Form */}
          <div className="space-y-8 lg:col-span-2">
            {/* Cancellation Policy */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Info className="size-5 text-blue-400" />
                Cancellation Policy
              </h3>

              <div className="space-y-4 text-sm text-white/80">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                    <p className="font-medium text-green-400">
                      72+ hours before
                    </p>
                    <p>100% refund (no fees)</p>
                  </div>
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                    <p className="font-medium text-yellow-400">
                      24-72 hours before
                    </p>
                    <p>75% refund (€25 fee)</p>
                  </div>
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                    <p className="font-medium text-orange-400">
                      12-24 hours before
                    </p>
                    <p>50% refund (€25 fee)</p>
                  </div>
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="font-medium text-red-400">
                      Less than 12 hours
                    </p>
                    <p>No refund (€50 fee)</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-white/60">
                  * Refunds are processed within 3-5 business days to the
                  original payment method
                </p>
              </div>
            </GlassCard>

            {/* Cancellation Reason */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Reason for Cancellation
              </h3>

              <div className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {cancellationReasons.map(reason => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={cn(
                        "rounded-lg border p-3 text-left text-sm transition-all",
                        selectedReason === reason
                          ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
                          : "border-white/30 bg-white/10 text-white hover:border-yellow-400/50 hover:bg-white/20"
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments" className="text-white">
                    Additional Comments (Optional)
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Please provide any additional details about your cancellation..."
                    value={additionalComments}
                    onChange={e => setAdditionalComments(e.target.value)}
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-yellow-400"
                    rows={3}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Time Information */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Clock className="size-5 text-yellow-400" />
                Time Until Activity
              </h3>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.floor(refundDetails.hoursUntilActivity)}
                  </p>
                  <p className="text-sm text-white/70">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.floor((refundDetails.hoursUntilActivity % 1) * 60)}
                  </p>
                  <p className="text-sm text-white/70">Minutes</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-white/70">
                Activity scheduled for {booking.bookingDate} at{" "}
                {booking.bookingTime}
              </p>
            </GlassCard>
          </div>

          {/* Refund Calculation Sidebar */}
          <div className="space-y-8">
            {/* Refund Summary */}
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <Calculator className="size-4 text-yellow-400" />
                Refund Calculation
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Original Amount</span>
                  <span className="text-white">€{booking.totalAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">Refund Percentage</span>
                  <span className="text-white">
                    {refundDetails.refundPercentage}%
                  </span>
                </div>

                {refundDetails.cancellationFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Cancellation Fee</span>
                    <span className="text-red-400">
                      -€{refundDetails.cancellationFee}
                    </span>
                  </div>
                )}

                <Separator className="bg-white/20" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total Refund</span>
                  <span
                    className={cn(
                      refundDetails.refundAmount > 0
                        ? "text-green-400"
                        : "text-red-400"
                    )}
                  >
                    €{refundDetails.refundAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {refundDetails.refundAmount === 0 && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">
                    No refund available due to late cancellation policy
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Processing Information */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">
                Processing Information
              </h3>

              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="size-4 text-blue-400" />
                  <span>Refund processed in 3-5 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="size-4 text-blue-400" />
                  <span>Confirmation email will be sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-blue-400" />
                  <span>Support available 24/7</span>
                </div>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!showConfirmation ? (
                <Button
                  onClick={() => setShowConfirmation(true)}
                  disabled={!selectedReason}
                  className={cn(
                    "w-full font-bold",
                    selectedReason
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "cursor-not-allowed bg-gray-600 text-gray-400"
                  )}
                >
                  <X className="mr-2 size-4" />
                  {selectedReason ? "Cancel Booking" : "Select Reason First"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
                    <p className="mb-2 font-medium text-red-400">
                      Are you sure?
                    </p>
                    <p className="text-sm text-white/80">
                      This action cannot be undone.
                    </p>
                  </div>

                  <Button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="w-full bg-red-500 font-bold text-white hover:bg-red-600"
                  >
                    {isCancelling ? (
                      <>
                        <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-current"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 size-4" />
                        Confirm Cancellation
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowConfirmation(false)}
                    variant="outline"
                    className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Go Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
