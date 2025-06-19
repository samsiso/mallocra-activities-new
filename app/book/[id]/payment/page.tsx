"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { createBookingAction } from "@/actions/db/bookings-actions"
import { syncClerkUserAction } from "@/actions/db/users-actions"
import {
  sendBookingConfirmationEmailAction,
  BookingEmailData
} from "@/actions/email-actions"
import {
  sendMultiChannelBookingConfirmationAction,
  MultiChannelBookingData
} from "@/actions/notifications/multi-channel-notifications"
import { sendTelegramAdminBookingAlertAction } from "@/actions/notifications/telegram-notifications"
import { AlertCircle, Loader2, CreditCard, User, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BookingPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoaded: userLoaded } = useUser()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("booking-data")
    if (savedData) {
      setBookingData(JSON.parse(savedData))
    } else {
      router.push(`/activities/${params.id}`)
    }
  }, [params.id, router])

  // Sync user profile when user loads
  useEffect(() => {
    const syncUserProfile = async () => {
      if (userLoaded && user) {
        try {
          const result = await syncClerkUserAction({
            id: user.id,
            emailAddresses: user.emailAddresses || [],
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumbers: user.phoneNumbers || []
          })
          if (result.isSuccess) {
            setUserProfile(result.data)
          }
        } catch (error) {
          console.error("Error syncing user profile:", error)
        }
      } else if (userLoaded && !user) {
        setIsGuest(true)
      }
    }

    syncUserProfile()
  }, [userLoaded, user])

  const handlePayment = async () => {
    if (!bookingData) return

    setIsProcessing(true)

    try {
      let customerId = "guest-user"

      // If user is authenticated, use their Clerk ID
      if (user && userProfile) {
        customerId = userProfile.id
      } else if (isGuest) {
        // For guest bookings, we'll use a special guest identifier
        customerId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      }

      // Generate booking reference
      const bookingReference = `MAL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`

      // Create booking in database
      const result = await createBookingAction({
        bookingReference,
        activityId: bookingData.activityId,
        customerId: customerId,
        bookingDate: bookingData.selectedDate,
        bookingTime: bookingData.selectedTime,
        adults: bookingData.adults,
        children: bookingData.children,
        totalParticipants: bookingData.adults + bookingData.children,
        totalAmount: bookingData.totalPrice.toString(),
        subtotal: bookingData.totalPrice.toString(),
        leadCustomerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
        leadCustomerEmail: bookingData.customerDetails.email,
        leadCustomerPhone: bookingData.customerDetails.phone,
        specialRequirements: bookingData.customerDetails.specialRequirements
      })

      if (result.isSuccess) {
        // Send confirmation notifications (email + SMS + WhatsApp + Telegram)
        try {
          // Email data (keep existing email system)
          const emailData: BookingEmailData = {
            bookingReference: result.data.bookingReference,
            activityTitle: bookingData.activity?.title || "Mallorca Activity",
            bookingDate: bookingData.selectedDate,
            bookingTime: bookingData.selectedTime,
            totalParticipants: bookingData.adults + bookingData.children,
            totalAmount: Number(bookingData.totalPrice),
            leadCustomerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
            leadCustomerEmail: bookingData.customerDetails.email,
            leadCustomerPhone: bookingData.customerDetails.phone,
            specialRequirements:
              bookingData.customerDetails.specialRequirements,
            isGuestBooking: !user || isGuest
          }

          // Multi-channel notification data
          const multiChannelData: MultiChannelBookingData = {
            customerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
            customerEmail: bookingData.customerDetails.email,
            customerPhone: bookingData.customerDetails.phone,
            telegramChatId: bookingData.customerDetails.telegramChatId, // Optional field
            activityTitle: bookingData.activity?.title || "Mallorca Activity",
            bookingDate: bookingData.selectedDate,
            bookingTime: bookingData.selectedTime,
            bookingReference: result.data.bookingReference,
            totalAmount: Number(bookingData.totalPrice),
            participantCount: bookingData.adults + bookingData.children
          }

          // Send email (existing system)
          const emailResult =
            await sendBookingConfirmationEmailAction(emailData)

          // Send multi-channel notifications (new system)
          const notificationResult =
            await sendMultiChannelBookingConfirmationAction(multiChannelData)

          // 🔔 SEND ADMIN NOTIFICATION VIA TELEGRAM
          const adminNotificationResult =
            await sendTelegramAdminBookingAlertAction({
              customerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
              customerEmail: bookingData.customerDetails.email,
              customerPhone: bookingData.customerDetails.phone,
              activityTitle: bookingData.activity?.title || "Mallorca Activity",
              bookingDate: bookingData.selectedDate,
              bookingTime: bookingData.selectedTime,
              bookingReference: result.data.bookingReference,
              totalAmount: Number(bookingData.totalPrice),
              participantCount: bookingData.adults + bookingData.children
            })

          // Log results
          if (emailResult.isSuccess) {
            console.log("✅ Email confirmation sent successfully")
          } else {
            console.warn("⚠️ Email confirmation failed:", emailResult.message)
          }

          if (notificationResult.isSuccess) {
            console.log(
              "✅ Multi-channel notifications:",
              notificationResult.message
            )
            console.log("📱 Notification channels:", notificationResult.data)
          } else {
            console.warn(
              "⚠️ Multi-channel notifications failed:",
              notificationResult.message
            )
          }

          if (adminNotificationResult.isSuccess) {
            console.log("🔔 Admin Telegram notification sent successfully")
          } else {
            console.warn(
              "⚠️ Admin Telegram notification failed:",
              adminNotificationResult.message
            )
          }

          // Show success message to user regardless of notification status
          // (Don't fail the booking if notifications fail)
        } catch (notificationError) {
          console.warn("Notification sending error:", notificationError)
          // Don't fail the booking if notifications fail
        }

        // Clear localStorage and redirect to confirmation
        localStorage.removeItem("booking-data")
        router.push(`/booking-confirmation/${result.data.id}`)
      } else {
        alert("Booking failed: " + result.message)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading while user authentication is being determined
  if (!userLoaded || !bookingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 size-8 animate-spin" />
          <p>Loading booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
          <h1 className="mb-6 text-3xl font-bold text-white">
            Complete Your Booking
          </h1>

          {/* User Status Badge */}
          <div className="mb-6 flex justify-center">
            {user ? (
              <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
                <User className="mr-2 size-4" />
                Booking as{" "}
                {user.firstName || user.emailAddresses?.[0]?.emailAddress}
              </Badge>
            ) : (
              <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
                <AlertCircle className="mr-2 size-4" />
                Guest Booking
              </Badge>
            )}
          </div>

          {/* Guest Notice */}
          {isGuest && (
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 text-yellow-400" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Guest Booking</p>
                  <p className="mt-1">
                    You're booking as a guest. To manage your bookings later,{" "}
                    <button
                      onClick={() => router.push("/signup")}
                      className="underline hover:text-yellow-100"
                    >
                      create an account
                    </button>{" "}
                    or{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="underline hover:text-yellow-100"
                    >
                      sign in
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 text-white">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{bookingData.selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{bookingData.selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Participants:</span>
              <span>
                {bookingData.adults} adults, {bookingData.children} children
              </span>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-yellow-400">
                  €{bookingData.totalPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 size-4" />
                  Complete Booking
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(`/book/${params.id}/details`)}
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Back to Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
