"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfToday
} from "date-fns"

export interface TimeSlot {
  time: string
  available: boolean
  spots?: number
  price?: number
}

export interface DayAvailability {
  date: Date
  available: boolean
  spots?: number
  minPrice?: number
  timeSlots?: TimeSlot[]
  isPopular?: boolean
}

interface AvailabilityCalendarProps {
  availableDates?: DayAvailability[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onTimeSelect?: (time: string) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  showPricing?: boolean
  showTimeSlots?: boolean
  locale?: string
}

export function AvailabilityCalendar({
  availableDates = [],
  selectedDate,
  onDateSelect,
  onTimeSelect,
  minDate = new Date(),
  maxDate,
  className,
  showPricing = true,
  showTimeSlots = true,
  locale = "en-US"
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = monthStart.getDay()
  const emptyDays = Array(startDayOfWeek).fill(null)

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = async (date: Date) => {
    const dayAvailability = availableDates.find(d => isSameDay(d.date, date))
    if (!dayAvailability?.available || isBefore(date, minDate)) return

    setIsLoading(true)
    setSelectedTime(null)

    // Simulate loading time slots
    await new Promise(resolve => setTimeout(resolve, 300))

    onDateSelect?.(date)
    setIsLoading(false)
  }

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
    onTimeSelect?.(time)
  }

  const getDayStatus = (
    date: Date
  ): "available" | "unavailable" | "limited" | "popular" => {
    const dayAvailability = availableDates.find(d => isSameDay(d.date, date))

    if (
      !dayAvailability ||
      !dayAvailability.available ||
      isBefore(date, minDate)
    ) {
      return "unavailable"
    }

    if (dayAvailability.isPopular) return "popular"
    if (dayAvailability.spots && dayAvailability.spots < 5) return "limited"

    return "available"
  }

  const getSelectedDaySlots = (): TimeSlot[] => {
    if (!selectedDate) return []

    const dayAvailability = availableDates.find(d =>
      isSameDay(d.date, selectedDate)
    )
    return dayAvailability?.timeSlots || []
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Calendar Header */}
      <div className="rounded-t-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="size-5 text-pink-600" />
            Select Date
          </h3>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePreviousMonth}
              disabled={isSameMonth(currentMonth, minDate)}
              className={cn(
                "rounded-lg p-2 transition-all duration-300",
                "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500",
                isSameMonth(currentMonth, minDate) &&
                  "cursor-not-allowed opacity-50"
              )}
            >
              <ChevronLeft className="size-5" />
            </motion.button>

            <div className="min-w-[140px] rounded-lg bg-white/20 px-4 py-2 text-center">
              <p className="font-medium text-gray-900">
                {format(currentMonth, "MMMM yyyy")}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              disabled={maxDate && isSameMonth(currentMonth, maxDate)}
              className={cn(
                "rounded-lg p-2 transition-all duration-300",
                "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500",
                maxDate &&
                  isSameMonth(currentMonth, maxDate) &&
                  "cursor-not-allowed opacity-50"
              )}
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Limited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-pink-500" />
            <span className="text-gray-600">Popular</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-b-2xl border border-t-0 border-white/20 bg-white/5 p-4 backdrop-blur-sm">
        <div className="mb-2 grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {monthDays.map(date => {
            const status = getDayStatus(date)
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isCurrentDay = isToday(date)
            const dayAvailability = availableDates.find(d =>
              isSameDay(d.date, date)
            )

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={status !== "unavailable" ? { scale: 1.05 } : {}}
                whileTap={status !== "unavailable" ? { scale: 0.95 } : {}}
                onClick={() => handleDateClick(date)}
                disabled={status === "unavailable"}
                className={cn(
                  "relative aspect-square rounded-xl transition-all duration-300",
                  "flex flex-col items-center justify-center",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                  status === "unavailable" && "cursor-not-allowed opacity-40",
                  status === "available" && "hover:bg-white/20",
                  status === "limited" && "hover:bg-yellow-500/20",
                  status === "popular" && "hover:bg-pink-500/20",
                  isSelected && "bg-pink-500/20 ring-2 ring-pink-500",
                  isCurrentDay && "ring-2 ring-gray-300"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-pink-600" : "text-gray-900"
                  )}
                >
                  {format(date, "d")}
                </span>

                {/* Status Indicator */}
                {status !== "unavailable" && (
                  <div
                    className={cn(
                      "absolute bottom-1 size-2 rounded-full",
                      status === "available" && "bg-green-500",
                      status === "limited" && "bg-yellow-500",
                      status === "popular" && "bg-pink-500"
                    )}
                  />
                )}

                {/* Price Display */}
                {showPricing && dayAvailability?.minPrice && (
                  <span className="absolute -right-1 -top-1 rounded bg-pink-100 px-1 text-[10px] font-medium text-pink-600">
                    €{dayAvailability.minPrice}
                  </span>
                )}

                {/* Popular Badge */}
                {status === "popular" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -left-1 -top-1"
                  >
                    <TrendingUp className="size-3 text-pink-600" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {showTimeSlots && selectedDate && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Clock className="size-5 text-pink-600" />
                Available Times for {format(selectedDate, "MMM d, yyyy")}
              </h4>

              {isLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-white/20"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                  {getSelectedDaySlots().map(slot => (
                    <motion.button
                      key={slot.time}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.95 } : {}}
                      onClick={() =>
                        slot.available && handleTimeClick(slot.time)
                      }
                      disabled={!slot.available}
                      className={cn(
                        "relative rounded-lg p-3 transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-pink-500",
                        slot.available
                          ? selectedTime === slot.time
                            ? "shadow-pink-glow/30 bg-pink-500 text-white"
                            : "bg-white/20 text-gray-900 hover:bg-white/30"
                          : "cursor-not-allowed bg-gray-200/20 text-gray-400"
                      )}
                    >
                      <p className="font-medium">{slot.time}</p>
                      {slot.spots && slot.spots < 5 && (
                        <p className="mt-1 text-xs opacity-80">
                          {slot.spots} spots left
                        </p>
                      )}
                      {showPricing && slot.price && (
                        <p className="mt-1 text-xs font-semibold">
                          €{slot.price}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Availability Notice */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
                <AlertCircle className="mt-0.5 size-5 text-yellow-600" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">Limited availability</p>
                  <p className="mt-1 text-xs">
                    Book now to secure your spot. Prices may vary by time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
