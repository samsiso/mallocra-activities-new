"use client"

/*
<ai_context>
Enhanced Booking Widget - Premium Brand Design
Implements rose/red, yellow, black, white color scheme with glassmorphism.
Features enhanced visual hierarchy, micro-interactions, and conversion-optimized design.
Matches the Mallorca Activities brand guidelines.
</ai_context>
*/

import React, { useState, useEffect } from "react"
import {
  Calendar,
  Users,
  Clock,
  Heart,
  Share2,
  Sparkles,
  Shield,
  CheckCircle,
  Minus,
  Plus,
  Star,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ActivityWithDetails } from "@/actions/db/activities-actions"
import {
  getActivityAvailabilityAction,
  AvailableDate,
  AvailableTimeSlot
} from "@/actions/db/availability-actions"
import { useCurrencyConversion } from "@/lib/hooks/use-currency-conversion"
import WeatherWidget from "@/components/weather/weather-widget"

interface BookingWidgetProps {
  activity: ActivityWithDetails
}

// Enhanced glassmorphism card component with brand styling
function GlassmorphismCard({
  children,
  className = "",
  variant = "default"
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "elevated" | "nested"
}) {
  const variants = {
    default:
      "rounded-xl border border-white/10 bg-black/40 backdrop-blur-lg shadow-xl",
    elevated:
      "rounded-xl border border-rose-500/20 bg-gradient-to-br from-black/60 to-rose-950/40 backdrop-blur-lg shadow-2xl shadow-rose-500/10",
    nested: "rounded-lg border border-white/5 bg-black/20 backdrop-blur-sm"
  }

  return <div className={`${variants[variant]} ${className}`}>{children}</div>
}

// Premium price display component
function PriceDisplay({
  price,
  label,
  highlight = false
}: {
  price: number
  label: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn("flex items-baseline gap-2", highlight && "animate-pulse")}
    >
      <span
        className={cn(
          "text-3xl font-black tracking-tight",
          highlight
            ? "bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"
            : "text-white"
        )}
      >
        €{price}
      </span>
      <span className="text-sm font-medium text-white/70">{label}</span>
    </div>
  )
}

export default function BookingWidget({ activity }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([])
  const [loading, setLoading] = useState(true)

  // Currency conversion hook
  const { formatPrice } = useCurrencyConversion()

  // Get pricing from database - handle both string and numeric values
  const adultPricing = activity.pricing?.find(p => p.priceType === "adult")
  const childPricing = activity.pricing?.find(p => p.priceType === "child")
  const basePrice = adultPricing
    ? parseFloat(String(adultPricing.basePrice))
    : 0
  const childPrice = childPricing
    ? parseFloat(String(childPricing.basePrice))
    : basePrice * 0.8

  const totalParticipants = adults + children
  const totalPrice = basePrice * adults + childPrice * children

  // Load real availability data
  useEffect(() => {
    async function loadAvailability() {
      setLoading(true)
      try {
        const result = await getActivityAvailabilityAction(activity.id, 7)
        if (result.isSuccess) {
          setAvailableDates(result.data)
          // Auto-select first available date
          const firstAvailable = result.data.find(d => d.available)
          if (firstAvailable && !selectedDate) {
            setSelectedDate(firstAvailable.date)
          }
        }
      } catch (error) {
        console.error("Error loading availability:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAvailability()
  }, [activity.id, selectedDate])

  // Get available times for selected date
  const getAvailableTimesForDate = (date: string): AvailableTimeSlot[] => {
    const dateData = availableDates.find(d => d.date === date)
    return dateData?.timeSlots || []
  }

  const availableTimes = getAvailableTimesForDate(selectedDate)

  const handleBooking = () => {
    const params = new URLSearchParams({
      adults: adults.toString(),
      children: children.toString(),
      date: selectedDate,
      time: selectedTime
    })
    window.location.href = `/book/${activity.id}/select?${params.toString()}`
  }

  const canBook =
    selectedDate &&
    selectedTime &&
    totalParticipants > 0 &&
    totalParticipants <= activity.maxParticipants

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsSticky(scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`transition-all duration-300 ${isSticky ? "fixed right-4 top-4 z-50 w-96 max-w-[90vw]" : "relative"}`}
    >
      <GlassmorphismCard
        variant="elevated"
        className={`relative overflow-hidden p-6 ${isSticky ? "border-yellow-400/20 shadow-2xl" : ""}`}
      >
        {/* Background gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-yellow-500/5" />

        {/* Sticky indicator */}
        {isSticky && (
          <div className="absolute -top-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
        )}

        {/* Premium header with enhanced pricing */}
        <div className="relative mb-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="space-y-2">
              <PriceDisplay price={basePrice} label="per adult" highlight />

              {/* Rating & Badge Row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">4.9</span>
                  <span className="text-xs text-white/60">(127 reviews)</span>
                </div>

                {activity.spotsLeft && activity.spotsLeft <= 5 && (
                  <Badge className="animate-pulse border-rose-500/50 bg-gradient-to-r from-rose-500/30 to-red-600/30 font-bold text-rose-200 shadow-lg">
                    <Award className="mr-1 size-3" />
                    Only {activity.spotsLeft} left!
                  </Badge>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10",
                  isWishlisted &&
                    "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20"
                )}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    "size-4 transition-all",
                    isWishlisted && "scale-110 fill-current"
                  )}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced trust signals */}
          <GlassmorphismCard variant="nested" className="p-3">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="size-3" />
                <span className="font-medium">Instant confirmation</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <CheckCircle className="size-3" />
                <span className="font-medium">Free cancellation</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Sparkles className="size-3" />
                <span className="font-medium">Best price guarantee</span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Weather Widget - for weather-dependent activities */}
        {activity.weatherDependent && (
          <div className="mb-6">
            <WeatherWidget
              location={activity.location}
              activityType={activity.category.toLowerCase()}
              isWeatherDependent={activity.weatherDependent}
              className="w-full"
              showSuitability={true}
            />
          </div>
        )}

        {/* Enhanced date selection */}
        <div className="mb-6 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 p-2">
              <Calendar className="size-4 text-white" />
            </div>
            Select Date
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableDates.slice(0, 6).map(day => (
                <button
                  key={day.date}
                  disabled={!day.available}
                  className={cn(
                    "relative rounded-xl border p-4 text-sm font-bold transition-all duration-300 hover:scale-[1.02]",
                    selectedDate === day.date
                      ? "border-yellow-400 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-400/30"
                      : day.available
                        ? "border-white/20 bg-gradient-to-br from-white/5 to-white/10 text-white hover:border-rose-400/50 hover:bg-gradient-to-br hover:from-rose-500/10 hover:to-yellow-500/10"
                        : "cursor-not-allowed border-white/5 text-white/30 opacity-50"
                  )}
                  onClick={() => day.available && setSelectedDate(day.date)}
                >
                  {day.popular && day.available && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                      Popular
                    </div>
                  )}
                  {day.display}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced time selection */}
        {selectedDate && (
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <div className="rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 p-2">
                <Clock className="size-4 text-white" />
              </div>
              Select Time
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map(timeSlot => (
                <button
                  key={timeSlot.time}
                  disabled={
                    timeSlot.status === "full" ||
                    timeSlot.status === "cancelled" ||
                    timeSlot.availableSpots < totalParticipants
                  }
                  className={cn(
                    "relative rounded-lg border p-3 text-sm font-bold transition-all duration-300 hover:scale-[1.02]",
                    selectedTime === timeSlot.time
                      ? "border-yellow-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20"
                      : timeSlot.status === "available" ||
                          (timeSlot.status === "limited" &&
                            timeSlot.availableSpots >= totalParticipants)
                        ? "border-white/20 bg-gradient-to-br from-white/5 to-white/10 text-white hover:border-rose-400/50 hover:bg-gradient-to-br hover:from-rose-500/10 hover:to-yellow-500/10"
                        : "cursor-not-allowed border-white/5 text-white/30 opacity-50"
                  )}
                  onClick={() => {
                    if (
                      timeSlot.status !== "full" &&
                      timeSlot.status !== "cancelled" &&
                      timeSlot.availableSpots >= totalParticipants
                    ) {
                      setSelectedTime(timeSlot.time)
                    }
                  }}
                >
                  {timeSlot.isPopular && timeSlot.status !== "full" && (
                    <div className="absolute -right-1 -top-1 size-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 shadow-lg"></div>
                  )}
                  <div className="text-center">
                    <div>{timeSlot.time}</div>
                    {timeSlot.status === "limited" && (
                      <div className="mt-1 text-xs text-yellow-400">
                        {timeSlot.availableSpots} left
                      </div>
                    )}
                    {timeSlot.status === "full" && (
                      <div className="mt-1 text-xs text-red-400">Full</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced participant selection */}
        <div className="mb-6 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 p-2">
              <Users className="size-4 text-white" />
            </div>
            Participants
          </h3>

          {/* Adults */}
          <GlassmorphismCard variant="nested" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Adults</p>
                <p className="text-sm text-white/60">
                  Ages 8+ • €{basePrice} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-110 hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-xl font-black text-white">
                  {adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-110 hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={() =>
                    setAdults(
                      Math.min(activity.maxParticipants - children, adults + 1)
                    )
                  }
                  disabled={totalParticipants >= activity.maxParticipants}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Children */}
          <GlassmorphismCard variant="nested" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Children</p>
                <p className="text-sm text-white/60">
                  Ages 6-7 • €{childPrice.toFixed(0)} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-110 hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-xl font-black text-white">
                  {children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-110 hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={() =>
                    setChildren(
                      Math.min(activity.maxParticipants - adults, children + 1)
                    )
                  }
                  disabled={totalParticipants >= activity.maxParticipants}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Enhanced price breakdown */}
        {totalParticipants > 0 && (
          <GlassmorphismCard variant="nested" className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500/10 to-yellow-500/10 p-4">
              <h4 className="mb-3 font-bold text-white">Price Breakdown</h4>
              <div className="space-y-2">
                {adults > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Adults × {adults}</span>
                    <span className="font-bold text-white">
                      €{(basePrice * adults).toFixed(2)}
                    </span>
                  </div>
                )}
                {children > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Children × {children}</span>
                    <span className="font-bold text-white">
                      €{(childPrice * children).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-2xl font-black text-transparent">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        )}

        {/* Enhanced book now button */}
        <Button
          onClick={handleBooking}
          disabled={!canBook}
          className={cn(
            "group relative h-14 w-full overflow-hidden text-lg font-black transition-all duration-500",
            canBook
              ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black hover:scale-[1.02] hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 hover:shadow-2xl hover:shadow-yellow-400/30"
              : "cursor-not-allowed bg-gray-700 text-gray-400"
          )}
        >
          <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          {canBook ? (
            <>
              <Sparkles className="mr-2 size-5 animate-pulse" />
              Book This Adventure - €{totalPrice.toFixed(2)}
            </>
          ) : (
            "Select Date & Time to Continue"
          )}
        </Button>

        {/* Enhanced additional info */}
        <div className="mt-6 space-y-3 text-center">
          <div className="flex justify-center gap-6 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <CheckCircle className="size-3 text-emerald-400" />
              <span>Free cancellation up to 24h</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="size-3 text-blue-400" />
              <span>Instant mobile tickets</span>
            </div>
          </div>

          <div className="text-xs text-white/50">
            Secure payment • No hidden fees • Book with confidence
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  )
}
