"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  MapPin,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  Home,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getBookingByIdAction } from "@/actions/db/bookings-actions"
import { motion } from "framer-motion"

export default function BookingConfirmationPage() {
  const params = useParams()
  const { user, isLoaded: userLoaded } = useUser()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingByIdAction(bookingId)
        if (result.isSuccess) {
          setBooking(result.data)
        } else {
          setError(result.message)
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin" />
          <p className="text-xl">Loading booking confirmation...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 p-4">
        <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-xl backdrop-blur-sm">
          <AlertCircle className="mx-auto mb-4 size-16 text-red-400" />
          <h1 className="mb-2 text-2xl font-bold text-white">
            Booking Not Found
          </h1>
          <p className="mb-6 text-white/70">
            {error || "The booking could not be found"}
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              <Home className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isGuestBooking = booking.customerId.startsWith("guest-")

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 p-4">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-sm"
        >
          {/* Success Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="mx-auto mb-4 size-20 text-yellow-400" />
            </motion.div>

            <h1 className="mb-2 text-4xl font-bold text-white">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-lg text-white/70">
              Your Mallorca adventure is all set and ready to go
            </p>
          </div>

          {/* Guest User Notice */}
          {isGuestBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 text-yellow-400" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Guest Booking Confirmed</p>
                  <p className="mt-1">
                    Your booking is confirmed! To easily manage future bookings
                    and receive updates,{" "}
                    <Link
                      href="/signup"
                      className="underline hover:text-yellow-100"
                    >
                      create an account
                    </Link>{" "}
                    using the same email address.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Booking Reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 rounded-lg bg-white/10 p-4 text-center"
          >
            <p className="mb-1 text-sm text-white/70">Booking Reference</p>
            <p className="text-2xl font-bold text-yellow-400">
              {booking.bookingReference}
            </p>
            <p className="mt-2 text-xs text-white/50">
              Save this reference number for your records
            </p>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Booking Details</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <Calendar className="size-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white/70">Date</p>
                  <p className="font-bold text-white">
                    {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <Clock className="size-5 text-green-400" />
                <div>
                  <p className="text-sm text-white/70">Time</p>
                  <p className="font-bold text-white">{booking.bookingTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <Users className="size-5 text-purple-400" />
                <div>
                  <p className="text-sm text-white/70">Participants</p>
                  <p className="font-bold text-white">
                    {booking.totalParticipants} people
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <MapPin className="size-5 text-rose-400" />
                <div>
                  <p className="text-sm text-white/70">Total Amount</p>
                  <p className="font-bold text-yellow-400">
                    €{booking.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <p className="mb-2 text-sm text-white/70">Lead Customer</p>
              <p className="font-bold text-white">{booking.leadCustomerName}</p>
              <p className="text-sm text-white/70">
                {booking.leadCustomerEmail}
              </p>
              {booking.leadCustomerPhone && (
                <p className="text-sm text-white/70">
                  {booking.leadCustomerPhone}
                </p>
              )}
            </div>

            {booking.specialRequirements && (
              <div className="rounded-lg bg-white/5 p-4">
                <p className="mb-2 text-sm text-white/70">
                  Special Requirements
                </p>
                <p className="text-white">{booking.specialRequirements}</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {user ? (
              <Link href="/bookings">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600">
                  <Eye className="mr-2 size-4" />
                  View My Bookings
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600">
                    Create Account to Manage Bookings
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  navigator.share?.({
                    title: "Booking Confirmation",
                    text: `My booking is confirmed! Reference: ${booking.bookingReference}`,
                    url: window.location.href
                  }) || navigator.clipboard.writeText(window.location.href)
                }}
              >
                <Share2 className="mr-2 size-4" />
                Share
              </Button>

              <Link href="/activities">
                <Button
                  variant="outline"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Home className="mr-2 size-4" />
                  Explore More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 text-center"
          >
            <p className="mb-2 text-sm font-bold text-white">Need Help?</p>
            <p className="text-xs text-white/70">
              Contact us at{" "}
              <a
                href="mailto:bookings@mallocra-activities.com"
                className="text-yellow-400 hover:underline"
              >
                bookings@mallocra-activities.com
              </a>{" "}
              or WhatsApp us for immediate assistance.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
