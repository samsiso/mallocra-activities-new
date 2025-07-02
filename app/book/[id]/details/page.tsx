"use client"

/*
<ai_context>
Booking Details Page - Step 2 of booking flow
User enters customer information and contact details.
Loads booking data from localStorage and saves combined data for payment step.
Pink glassmorphism theme with form validation and progress indicator.
</ai_context>
*/

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Calendar, Clock, Users } from "lucide-react"
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
function BookingProgress({ currentStep = 2 }: { currentStep?: number }) {
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

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    const savedData = localStorage.getItem("booking-data")
    if (savedData) {
      setBookingData(JSON.parse(savedData))
    } else {
      router.push(`/activities/${params.id}`)
    }
  }, [params.id, router])

  const handleContinue = () => {
    if (!bookingData) return

    const completeBookingData = {
      ...bookingData,
      customerDetails: formData
    }
    localStorage.setItem("booking-data", JSON.stringify(completeBookingData))
    router.push(`/book/${params.id}/payment`)
  }

  const canProceed =
    formData.firstName && formData.lastName && formData.email && formData.phone

  if (!bookingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400">
        <div className="text-center text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 p-8">
      <div className="mx-auto max-w-4xl">
        <BookingProgress currentStep={2} />

        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Your Details
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-bold text-white">
                Booking Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Date</span>
                  <span className="text-white">{bookingData.selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time</span>
                  <span className="text-white">{bookingData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Participants</span>
                  <span className="text-white">
                    {bookingData.adults} adults, {bookingData.children} children
                  </span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">
                      €{bookingData.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-6 text-xl font-bold text-white">
                Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        firstName: e.target.value
                      }))
                    }
                    className="mt-1 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        lastName: e.target.value
                      }))
                    }
                    className="mt-1 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, email: e.target.value }))
                    }
                    className="mt-1 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, phone: e.target.value }))
                    }
                    className="mt-1 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => router.push(`/book/${params.id}/select`)}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back
                </Button>

                <Button
                  onClick={handleContinue}
                  disabled={!canProceed}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600 disabled:opacity-50 sm:w-auto"
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
