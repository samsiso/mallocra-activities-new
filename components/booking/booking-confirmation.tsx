"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  Mail,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface BookingConfirmationProps {
  bookingReference: string
  activityTitle: string
  date: string
  time: string
  participants: {
    adults: number
    children: number
    seniors?: number
  }
  totalAmount: number
  customerEmail: string
  onDownloadReceipt?: () => void
  onShare?: () => void
  className?: string
}

export function BookingConfirmation({
  bookingReference,
  activityTitle,
  date,
  time,
  participants,
  totalAmount,
  customerEmail,
  onDownloadReceipt,
  onShare,
  className
}: BookingConfirmationProps) {
  const totalParticipants =
    participants.adults + participants.children + (participants.seniors || 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("mx-auto max-w-2xl space-y-8 text-center", className)}
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2
        }}
        className="mx-auto flex size-24 items-center justify-center rounded-full bg-green-500"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <CheckCircle className="size-12 text-white" />
        </motion.div>
      </motion.div>

      {/* Confirmation Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-white">Booking Confirmed!</h1>
        <p className="text-lg text-white/80">
          Thank you for your booking. We've sent a confirmation to{" "}
          {customerEmail}
        </p>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm"
      >
        <div className="space-y-4">
          {/* Reference Number */}
          <div className="rounded-lg bg-pink-500/20 p-4">
            <p className="text-sm text-white/60">Booking Reference</p>
            <p className="mt-1 font-mono text-2xl font-bold text-white">
              {bookingReference}
            </p>
          </div>

          {/* Booking Info */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Activity</span>
              <span className="font-medium text-white">{activityTitle}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Date & Time</span>
              <span className="font-medium text-white">
                {date} at {time}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Participants</span>
              <span className="font-medium text-white">
                {totalParticipants} total
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total Paid</span>
              <span className="text-xl font-bold text-white">
                €{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Button
          onClick={onDownloadReceipt}
          variant="outline"
          className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          <Download className="size-4" />
          Download Receipt
        </Button>
        <Button
          onClick={onShare}
          variant="outline"
          className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          <Share2 className="size-4" />
          Share Booking
        </Button>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="rounded-lg bg-blue-500/10 p-6 text-left"
      >
        <h3 className="mb-3 font-semibold text-white">What's Next?</h3>
        <div className="space-y-2 text-sm text-white/80">
          <p className="flex items-start gap-2">
            <Mail className="size-4 shrink-0 text-blue-400" />
            Check your email for detailed confirmation and meeting point
            information
          </p>
          <p className="flex items-start gap-2">
            <Calendar className="size-4 shrink-0 text-blue-400" />
            Add the activity to your calendar to receive reminders
          </p>
          <p className="flex items-start gap-2">
            <MessageSquare className="size-4 shrink-0 text-blue-400" />
            Contact us if you have any questions or special requests
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
