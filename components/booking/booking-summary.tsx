"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Users, MapPin, Receipt, Info } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { PriceDisplay } from "./price-display"

export interface BookingSummaryProps {
  activityTitle: string
  activityLocation?: string
  selectedDate: Date | null
  selectedTime: string | null
  participants: {
    adults: number
    children: number
    seniors?: number
  }
  pricing: {
    adultPrice: number
    childPrice: number
    seniorPrice?: number
    subtotal: number
    discount?: number
    total: number
  }
  currency?: string
  sticky?: boolean
  className?: string
}

export function BookingSummary({
  activityTitle,
  activityLocation,
  selectedDate,
  selectedTime,
  participants,
  pricing,
  currency = "EUR",
  sticky = true,
  className
}: BookingSummaryProps) {
  const totalParticipants =
    participants.adults + participants.children + (participants.seniors || 0)
  const hasDiscount = pricing.discount && pricing.discount > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl",
        sticky && "sticky top-24",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
          <Receipt className="size-5 text-pink-400" />
          Booking Summary
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Activity Info */}
        <div className="space-y-3">
          <h4 className="font-medium text-white">{activityTitle}</h4>

          {activityLocation && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="size-4" />
              {activityLocation}
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          {selectedDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/60">
                <Calendar className="size-4" />
                Date
              </span>
              <span className="font-medium text-white">
                {format(selectedDate, "EEE, MMM d, yyyy")}
              </span>
            </div>
          )}

          {selectedTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/60">
                <Clock className="size-4" />
                Time
              </span>
              <span className="font-medium text-white">{selectedTime}</span>
            </div>
          )}

          {totalParticipants > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/60">
                <Users className="size-4" />
                Participants
              </span>
              <span className="font-medium text-white">
                {totalParticipants}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        {totalParticipants > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            {participants.adults > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {participants.adults} × Adult
                </span>
                <span className="text-white">
                  €{(participants.adults * pricing.adultPrice).toFixed(2)}
                </span>
              </div>
            )}

            {participants.children > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {participants.children} × Child
                </span>
                <span className="text-white">
                  €{(participants.children * pricing.childPrice).toFixed(2)}
                </span>
              </div>
            )}

            {participants.seniors &&
              participants.seniors > 0 &&
              pricing.seniorPrice && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    {participants.seniors} × Senior
                  </span>
                  <span className="text-white">
                    €{(participants.seniors * pricing.seniorPrice).toFixed(2)}
                  </span>
                </div>
              )}

            {/* Subtotal */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-sm">
              <span className="text-white/60">Subtotal</span>
              <span className="text-white">€{pricing.subtotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-yellow-400">Discount</span>
                <span className="text-yellow-400">
                  -€{(pricing.discount || 0).toFixed(2)}
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Total */}
        {totalParticipants > 0 && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Total</span>
              <PriceDisplay
                discountedPrice={pricing.total}
                originalPrice={hasDiscount ? pricing.subtotal : undefined}
                size="sm"
                showSavings={false}
                animate={false}
              />
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="rounded-lg bg-pink-500/10 p-3">
          <div className="flex gap-2">
            <Info className="size-4 shrink-0 text-pink-400" />
            <p className="text-xs text-white/80">
              Free cancellation up to 24 hours before the activity
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
