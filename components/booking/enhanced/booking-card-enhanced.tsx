"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system"
import { Calendar, Clock, Users, MapPin, Shield, Zap } from "lucide-react"
import { useState } from "react"

interface BookingCardEnhancedProps {
  title: string
  description?: string
  date: Date
  time: string
  participants: number
  location: string
  price: number
  originalPrice?: number
  status?: "available" | "limited" | "soldout"
  spotsLeft?: number
  variant?: "standard" | "featured" | "compact"
  onBook?: () => void
  className?: string
  children?: React.ReactNode
  isInstantBooking?: boolean
  hasInsurance?: boolean
}

export function BookingCardEnhanced({
  title,
  description,
  date,
  time,
  participants,
  location,
  price,
  originalPrice,
  status = "available",
  spotsLeft,
  variant = "standard",
  onBook,
  className,
  children,
  isInstantBooking = false,
  hasInsurance = false
}: BookingCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusConfig = {
    available: {
      color: "text-green-600",
      bg: "bg-green-500/10",
      label: "Available"
    },
    limited: {
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      label: `Only ${spotsLeft} spots left!`
    },
    soldout: {
      color: "text-red-600",
      bg: "bg-red-500/10",
      label: "Sold Out"
    }
  }

  const cardVariants = {
    standard: "p-6 md:p-8",
    featured: "p-8 md:p-10 border-2 border-pink-500/20",
    compact: "p-4 md:p-5"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/10 backdrop-blur-md",
        "border border-white/20",
        "hover:shadow-pink-glow/20 shadow-lg",
        "transition-all duration-300",
        cardVariants[variant],
        className
      )}
    >
      {/* Glass gradient overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `linear-gradient(135deg, ${designTokens.colors.glass.pink[10]} 0%, transparent 50%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-bold text-gray-900 md:text-2xl">
              {title}
            </h3>
            {variant === "featured" && (
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="ml-2 rounded-lg bg-pink-500/20 p-2"
              >
                <Zap className="size-5 text-pink-600" />
              </motion.div>
            )}
          </div>

          {description && variant !== "compact" && (
            <p className="line-clamp-2 text-sm text-gray-600 md:text-base">
              {description}
            </p>
          )}
        </div>

        {/* Details Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <Calendar className="size-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <Clock className="size-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-medium">{time}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <Users className="size-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Participants</p>
              <p className="text-sm font-medium">{participants}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <MapPin className="size-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="truncate text-sm font-medium">{location}</p>
            </div>
          </div>
        </div>

        {/* Status & Price */}
        <div className="mb-6 flex items-center justify-between">
          <div
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              statusConfig[status].bg,
              statusConfig[status].color
            )}
          >
            {statusConfig[status].label}
          </div>

          <div className="text-right">
            {originalPrice && originalPrice > price && (
              <p className="text-sm text-gray-400 line-through">
                €{originalPrice}
              </p>
            )}
            <p className="text-2xl font-bold text-gray-900">
              €{price}
              <span className="text-sm font-normal text-gray-500">/person</span>
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        {(isInstantBooking || hasInsurance) && variant !== "compact" && (
          <div className="mb-6 flex items-center gap-4">
            {isInstantBooking && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Zap className="size-4 text-yellow-500" />
                <span>Instant Booking</span>
              </div>
            )}
            {hasInsurance && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Shield className="size-4 text-green-500" />
                <span>Insurance Included</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {onBook && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBook}
            disabled={status === "soldout"}
            className={cn(
              "w-full rounded-xl px-4 py-3 font-semibold",
              "transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
              status === "soldout"
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "hover:shadow-pink-glow/30 bg-pink-600 text-white hover:bg-pink-700"
            )}
          >
            {status === "soldout" ? "Sold Out" : "Book Now"}
          </motion.button>
        )}

        {/* Custom Content */}
        {children}
      </div>

      {/* Animated Background Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-20 -top-20 size-40 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-40 rounded-full bg-yellow-500/10 blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
