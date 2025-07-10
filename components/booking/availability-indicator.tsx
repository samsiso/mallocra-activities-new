"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export type AvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable"
  | "checking"

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus
  spotsLeft?: number
  totalSpots?: number
  showDetails?: boolean
  size?: "sm" | "md" | "lg"
  animate?: boolean
  className?: string
}

export function AvailabilityIndicator({
  status,
  spotsLeft,
  totalSpots,
  showDetails = true,
  size = "md",
  animate = true,
  className
}: AvailabilityIndicatorProps) {
  const configs = {
    available: {
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
      label: "Available",
      description:
        spotsLeft && spotsLeft > 5
          ? `${spotsLeft} spots remaining`
          : "Spots available"
    },
    limited: {
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
      label: "Limited Availability",
      description: spotsLeft ? `Only ${spotsLeft} spots left!` : "Book soon!"
    },
    unavailable: {
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
      label: "Fully Booked",
      description: "No spots available"
    },
    checking: {
      icon: Clock,
      color: "text-white/60",
      bgColor: "bg-white/10",
      borderColor: "border-white/20",
      label: "Checking availability...",
      description: "Please wait"
    }
  }

  const config = configs[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: {
      container: "px-3 py-1.5",
      icon: "h-4 w-4",
      text: "text-sm",
      description: "text-xs"
    },
    md: {
      container: "px-4 py-2",
      icon: "h-5 w-5",
      text: "text-base",
      description: "text-sm"
    },
    lg: {
      container: "px-5 py-3",
      icon: "h-6 w-6",
      text: "text-lg",
      description: "text-base"
    }
  }

  const sizes = sizeClasses[size]

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border backdrop-blur-sm",
        config.bgColor,
        config.borderColor,
        sizes.container,
        className
      )}
    >
      <motion.div
        animate={status === "checking" ? { rotate: 360 } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Icon className={cn(sizes.icon, config.color)} />
      </motion.div>

      <div className="flex flex-col">
        <span className={cn("font-medium text-white", sizes.text)}>
          {config.label}
        </span>
        {showDetails && config.description && (
          <span className={cn("text-white/60", sizes.description)}>
            {config.description}
          </span>
        )}
      </div>

      {/* Progress bar for limited availability */}
      {status === "limited" && spotsLeft && totalSpots && showDetails && (
        <div className="ml-auto">
          <AvailabilityProgress
            spotsLeft={spotsLeft}
            totalSpots={totalSpots}
            size={size}
          />
        </div>
      )}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  )
}

// Progress indicator for limited spots
function AvailabilityProgress({
  spotsLeft,
  totalSpots,
  size = "md"
}: {
  spotsLeft: number
  totalSpots: number
  size?: "sm" | "md" | "lg"
}) {
  const percentage = (spotsLeft / totalSpots) * 100
  const isUrgent = percentage <= 20

  const sizeClasses = {
    sm: "h-1.5 w-16",
    md: "h-2 w-20",
    lg: "h-2.5 w-24"
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "overflow-hidden rounded-full bg-white/20",
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full", isUrgent ? "bg-red-400" : "bg-yellow-400")}
        />
      </div>
      {isUrgent && <TrendingUp className="size-3 text-red-400" />}
    </div>
  )
}

// Quick status badge variant
export function AvailabilityBadge({
  status,
  className
}: {
  status: AvailabilityStatus
  className?: string
}) {
  const configs = {
    available: {
      color: "bg-green-400/20 text-green-400 border-green-400/30",
      label: "Available"
    },
    limited: {
      color: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
      label: "Limited"
    },
    unavailable: {
      color: "bg-red-400/20 text-red-400 border-red-400/30",
      label: "Sold Out"
    },
    checking: {
      color: "bg-white/10 text-white/60 border-white/20",
      label: "Checking..."
    }
  }

  const config = configs[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
