"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { createBookingServerAction } from "@/actions/create-booking-action"
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
import {
  AlertCircle,
  Loader2,
  CreditCard,
  User,
  Mail,
  Calendar,
  Clock,
  Users,
  CheckCircle
} from "lucide-react"
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
function BookingProgress({ currentStep = 3 }: { currentStep?: number }) {
  const steps = [
    { number: 1, label: "Select", icon: Calendar },
    { number: 2, label: "Details", icon: Users },
    { number: 3, label: "Payment", icon: CreditCard }
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
                    ? "border-pink-400 bg-pink-400 text-white"
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
                  isCompleted ? "bg-pink-400" : "bg-white/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

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
        // For guest bookings, generate a UUID format
        customerId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0
            const v = c == "x" ? r : (r & 0x3) | 0x8
            return v.toString(16)
          }
        )
      }

      // Generate booking reference
      const bookingReference = `MAL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`

      // Create booking with all required fields
      const bookingPayload = {
        bookingReference,
        activityId: bookingData.activityId,
        customerId: customerId,
        bookingDate: bookingData.selectedDate,
        bookingTime: bookingData.selectedTime,
        adults: bookingData.adults,
        children: bookingData.children,
        seniors: 0,
        totalParticipants: bookingData.adults + bookingData.children,
        subtotal: bookingData.totalPrice.toString(),
        totalAmount: bookingData.totalPrice.toString(),
        currency: "EUR",
        leadCustomerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
        leadCustomerEmail: bookingData.customerDetails.email,
        leadCustomerPhone: bookingData.customerDetails.phone,
        specialRequirements:
          bookingData.customerDetails.specialRequirements || null
      }

      // Log the booking data we're sending
      console.log("Sending booking data:", bookingPayload)

      // Create booking using server action
      const result = await createBookingServerAction(bookingPayload)

      console.log("Booking result:", result)

      if (result.isSuccess) {
        console.log("✅ Booking created successfully!")
        // Send confirmation notifications (email + SMS + WhatsApp + Telegram)
        try {
          // Email data (keep existing email system)
          const emailData: BookingEmailData = {
            bookingReference: result.data?.bookingReference || bookingReference,
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
            bookingReference: result.data?.bookingReference || bookingReference,
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
              bookingReference:
                result.data?.bookingReference || bookingReference,
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
        router.push(
          `/booking-confirmation/${result.data?.id || bookingReference}`
        )
      } else {
        console.error("Booking failed:", result)
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 size-8 animate-spin" />
          <p>Loading booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress Indicator */}
        <BookingProgress currentStep={3} />

        <GlassCard>
          <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
            Complete Your Booking
          </h1>

          {/* User Status Badge */}
          <div className="mb-6 flex justify-center">
            {user ? (
              <Badge className="border-pink-500/30 bg-pink-500/20 text-pink-300">
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
        </GlassCard>
      </div>
    </div>
  )
}
