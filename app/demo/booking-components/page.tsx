"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { User, Baby } from "lucide-react"
import {
  BookingCard,
  BookingProgress,
  DateTimePicker,
  ParticipantSelector,
  PriceDisplay,
  BookingSummary,
  AvailabilityIndicator,
  WeatherWidget,
  TrustSignals,
  BookingConfirmation,
  LoadingStates,
  BookingForm,
  GuestDetailsForm,
  SpecialRequirementsInput,
  PaymentForm,
  BookingReceipt,
  NextSteps,
  SecurityBadges,
  ReviewTrust
} from "@/components/booking"

// Demo data
const demoAvailableSlots = {
  [format(new Date(), "yyyy-MM-dd")]: [
    { time: "09:00", available: true, price: 45 },
    { time: "10:00", available: true, price: 45 },
    { time: "11:00", available: false },
    { time: "14:00", available: true, price: 50 },
    { time: "15:00", available: true, price: 50 },
    { time: "16:00", available: true, price: 45 }
  ],
  [format(addDays(new Date(), 1), "yyyy-MM-dd")]: [
    { time: "09:00", available: true, price: 45 },
    { time: "10:00", available: true, price: 45 },
    { time: "14:00", available: true, price: 50 }
  ]
}

export default function BookingComponentsDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [participants, setParticipants] = useState({
    adults: 2,
    children: 1,
    seniors: 0
  })
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequirements: ""
  })
  const [currentStep, setCurrentStep] = useState(0)

  const handleParticipantChange = (type: string, count: number) => {
    setParticipants({ ...participants, [type]: count })
  }

  const demoWeather = {
    temperature: 24,
    condition: "sunny" as const,
    humidity: 65,
    windSpeed: 12,
    forecast: "Clear skies expected throughout the day",
    warning: "High UV index - sunscreen recommended"
  }

  const demoPricing = {
    adultPrice: 45,
    childPrice: 25,
    seniorPrice: 40,
    subtotal: 115,
    discount: 10,
    total: 105
  }

  const participantTypes = [
    {
      type: "adults" as const,
      label: "Adults",
      icon: <User className="size-5" />,
      price: 45,
      description: "Ages 18+"
    },
    {
      type: "children" as const,
      label: "Children",
      icon: <Baby className="size-5" />,
      price: 25,
      description: "Ages 3-17"
    },
    {
      type: "seniors" as const,
      label: "Seniors",
      icon: <User className="size-5" />,
      price: 40,
      description: "Ages 65+"
    }
  ]

  const bookingSteps = [
    {
      id: "select",
      title: "Select",
      description: "Date & Participants",
      component: (
        <div className="space-y-6">
          <DateTimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            availableSlots={demoAvailableSlots}
          />
          <ParticipantSelector
            participants={participants}
            onParticipantChange={handleParticipantChange}
            participantTypes={participantTypes}
          />
        </div>
      )
    },
    {
      id: "details",
      title: "Details",
      description: "Your Information",
      component: (
        <div className="space-y-6">
          <GuestDetailsForm
            details={guestDetails}
            onChange={setGuestDetails}
            participantCount={
              participants.adults + participants.children + participants.seniors
            }
          />
          <SpecialRequirementsInput
            value={guestDetails.specialRequirements}
            onChange={value =>
              setGuestDetails({ ...guestDetails, specialRequirements: value })
            }
          />
        </div>
      )
    },
    {
      id: "payment",
      title: "Payment",
      description: "Secure Checkout",
      component: (
        <PaymentForm
          amount={demoPricing.total}
          onSubmit={() => console.log("Payment submitted")}
        />
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-900/20 via-purple-900/20 to-black p-4">
      <div className="mx-auto max-w-7xl space-y-12 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Booking Component Library Demo
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Modern, accessible booking components built with 21st.dev principles
          </p>
        </div>

        {/* Component Sections */}
        <div className="space-y-16">
          {/* Booking Cards */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Booking Cards
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <BookingCard variant="default">
                <h3 className="text-lg font-semibold text-white">
                  Default Card
                </h3>
                <p className="mt-2 text-white/60">
                  Standard glass morphism effect
                </p>
              </BookingCard>
              <BookingCard variant="elevated">
                <h3 className="text-lg font-semibold text-white">
                  Elevated Card
                </h3>
                <p className="mt-2 text-white/60">Enhanced shadow and blur</p>
              </BookingCard>
              <BookingCard variant="bordered">
                <h3 className="text-lg font-semibold text-white">
                  Bordered Card
                </h3>
                <p className="mt-2 text-white/60">Pink accent border</p>
              </BookingCard>
            </div>
          </section>

          {/* Progress Indicator */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Progress Indicator
            </h2>
            <BookingCard>
              <BookingProgress currentStep={2} totalSteps={3} />
            </BookingCard>
          </section>

          {/* Date & Time Picker */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Date & Time Picker
            </h2>
            <BookingCard>
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                availableSlots={demoAvailableSlots}
              />
            </BookingCard>
          </section>

          {/* Participant Selector */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Participant Selector
            </h2>
            <BookingCard>
              <ParticipantSelector
                participants={participants}
                onParticipantChange={handleParticipantChange}
                participantTypes={participantTypes}
              />
            </BookingCard>
          </section>

          {/* Price Display */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Price Display
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <BookingCard>
                <h3 className="mb-4 text-sm font-medium text-white/60">
                  Small
                </h3>
                <PriceDisplay
                  originalPrice={60}
                  discountedPrice={45}
                  size="sm"
                />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-sm font-medium text-white/60">
                  Medium
                </h3>
                <PriceDisplay
                  originalPrice={60}
                  discountedPrice={45}
                  size="md"
                />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-sm font-medium text-white/60">
                  Large
                </h3>
                <PriceDisplay
                  originalPrice={60}
                  discountedPrice={45}
                  size="lg"
                />
              </BookingCard>
            </div>
          </section>

          {/* Availability Indicators */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Availability Indicators
            </h2>
            <div className="space-y-4">
              <AvailabilityIndicator
                status="available"
                spotsLeft={15}
                totalSpots={20}
              />
              <AvailabilityIndicator
                status="limited"
                spotsLeft={3}
                totalSpots={20}
              />
              <AvailabilityIndicator status="unavailable" />
              <AvailabilityIndicator status="checking" />
            </div>
          </section>

          {/* Weather Widget */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Weather Widget
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <WeatherWidget weather={demoWeather} activityType="outdoor" />
              <WeatherWidget
                weather={demoWeather}
                activityType="water"
                compact
              />
            </div>
          </section>

          {/* Trust Signals */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Trust Signals
            </h2>
            <div className="space-y-6">
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Grid Layout
                </h3>
                <TrustSignals layout="grid" />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Compact Layout
                </h3>
                <TrustSignals layout="compact" />
              </BookingCard>
              <div className="space-y-4">
                <SecurityBadges />
                <ReviewTrust rating={4.8} reviewCount={1234} />
              </div>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Loading States
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Date Picker Skeleton
                </h3>
                <LoadingStates.DatePickerSkeleton />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Form Skeleton
                </h3>
                <LoadingStates.FormSkeleton />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Payment Loading
                </h3>
                <LoadingStates.PaymentLoading />
              </BookingCard>
              <BookingCard>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Success Animation
                </h3>
                <LoadingStates.SuccessAnimation message="Booking Confirmed!" />
              </BookingCard>
            </div>
          </section>

          {/* Multi-step Form */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Multi-step Booking Form
            </h2>
            <BookingCard variant="elevated">
              <BookingForm
                steps={bookingSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onComplete={() => console.log("Booking completed")}
              />
            </BookingCard>
          </section>

          {/* Booking Summary */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Booking Summary
            </h2>
            <div className="mx-auto max-w-md">
              <BookingSummary
                activityTitle="Sunset Catamaran Cruise"
                activityLocation="Port de Pollença"
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                participants={participants}
                pricing={demoPricing}
                sticky={false}
              />
            </div>
          </section>

          {/* Confirmation & Next Steps */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Confirmation & Next Steps
            </h2>
            <BookingCard variant="elevated">
              <BookingConfirmation
                bookingReference="MAL-2024-0123"
                activityTitle="Sunset Catamaran Cruise"
                date="March 15, 2024"
                time="18:00"
                participants={participants}
                totalAmount={105}
                customerEmail="john@example.com"
                onDownloadReceipt={() => console.log("Download receipt")}
                onShare={() => console.log("Share booking")}
              />
            </BookingCard>
            <div className="mt-8">
              <NextSteps />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
