"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
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
  startOfDay
} from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface TimeSlot {
  time: string
  available: boolean
  price?: number
}

export interface DateTimePickerProps {
  selectedDate: Date | null
  selectedTime: string | null
  onDateChange: (date: Date) => void
  onTimeChange: (time: string) => void
  availableSlots?: Record<string, TimeSlot[]>
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  availableSlots = {},
  minDate = new Date(),
  maxDate,
  disabled = false
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get available times for selected date
  const availableTimesForDate = selectedDate
    ? availableSlots[format(selectedDate, "yyyy-MM-dd")] || []
    : []

  useEffect(() => {
    if (selectedDate && availableTimesForDate.length > 0) {
      setShowTimePicker(true)
    }
  }, [selectedDate, availableTimesForDate.length])

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateSelect = (date: Date) => {
    onDateChange(date)
    onTimeChange("") // Reset time when date changes
  }

  const isDateDisabled = (date: Date) => {
    if (disabled) return true
    if (isBefore(date, startOfDay(minDate))) return true
    if (maxDate && isBefore(startOfDay(maxDate), date)) return true

    const dateKey = format(date, "yyyy-MM-dd")
    const slots = availableSlots[dateKey]
    return !slots || slots.length === 0 || !slots.some(slot => slot.available)
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        {/* Calendar Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Calendar className="size-5 text-pink-400" />
            Select Date
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              disabled={disabled || isSameMonth(currentMonth, minDate)}
              className="size-8 text-white hover:bg-white/10"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[140px] text-center text-sm font-medium text-white">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              disabled={
                disabled || (maxDate && isSameMonth(currentMonth, maxDate))
              }
              className="size-8 text-white hover:bg-white/10"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-white/60"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for alignment */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {/* Calendar days */}
          {monthDays.map(date => {
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isDisabled = isDateDisabled(date)
            const dateKey = format(date, "yyyy-MM-dd")
            const hasAvailability = availableSlots[dateKey]?.some(
              slot => slot.available
            )

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                onClick={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                className={cn(
                  "relative rounded-lg p-2 text-sm transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent",
                  isSelected && "bg-pink-500 text-white",
                  !isSelected && !isDisabled && "text-white hover:bg-white/10",
                  !isSelected &&
                    isDisabled &&
                    "cursor-not-allowed text-white/30",
                  isToday(date) && !isSelected && "ring-1 ring-yellow-400"
                )}
                aria-label={`${format(date, "EEEE, MMMM d, yyyy")}${isDisabled ? " (unavailable)" : ""}`}
                aria-pressed={isSelected ? "true" : "false"}
              >
                {format(date, "d")}
                {hasAvailability && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-yellow-400" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Time Picker */}
      <AnimatePresence mode="wait">
        {showTimePicker && selectedDate && availableTimesForDate.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Clock className="size-5 text-pink-400" />
              Select Time
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableTimesForDate.map(slot => {
                const isSelected = selectedTime === slot.time

                return (
                  <motion.button
                    key={slot.time}
                    whileHover={slot.available ? { scale: 1.05 } : {}}
                    whileTap={slot.available ? { scale: 0.95 } : {}}
                    onClick={() => slot.available && onTimeChange(slot.time)}
                    disabled={!slot.available || disabled}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent",
                      isSelected && "bg-pink-500 text-white",
                      !isSelected &&
                        slot.available &&
                        "bg-white/10 text-white hover:bg-white/20",
                      !slot.available &&
                        "cursor-not-allowed bg-white/5 text-white/30"
                    )}
                    aria-label={`${slot.time}${!slot.available ? " (unavailable)" : ""}${slot.price ? ` - €${slot.price}` : ""}`}
                    aria-pressed={isSelected ? "true" : "false"}
                  >
                    {slot.time}
                    {slot.price && (
                      <span className="mt-0.5 block text-xs opacity-80">
                        €{slot.price}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-yellow-400/20 p-3 text-center"
        >
          <p className="text-sm font-medium text-white">
            Selected: {format(selectedDate, "EEE, MMM d")} at {selectedTime}
          </p>
        </motion.div>
      )}
    </div>
  )
}
