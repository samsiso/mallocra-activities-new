"use client"

import { motion } from "framer-motion"
import {
  Shield,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface TrustSignal {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

export interface TrustSignalsProps {
  signals?: TrustSignal[]
  layout?: "grid" | "list" | "compact"
  animate?: boolean
  className?: string
}

const defaultSignals: TrustSignal[] = [
  {
    icon: <Shield className="size-5" />,
    title: "Secure Booking",
    description: "SSL encrypted payment",
    highlight: true
  },
  {
    icon: <Clock className="size-5" />,
    title: "Free Cancellation",
    description: "Up to 24 hours before"
  },
  {
    icon: <Award className="size-5" />,
    title: "Best Price Guarantee",
    description: "Found cheaper? We'll match it"
  },
  {
    icon: <Users className="size-5" />,
    title: "Trusted by 10,000+",
    description: "Happy customers"
  }
]

export function TrustSignals({
  signals = defaultSignals,
  layout = "grid",
  animate = true,
  className
}: TrustSignalsProps) {
  const layoutClasses = {
    grid: "grid grid-cols-2 gap-3",
    list: "space-y-3",
    compact: "flex flex-wrap gap-4"
  }

  if (layout === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-4", className)}>
        {signals.map((signal, index) => (
          <CompactSignal
            key={index}
            signal={signal}
            index={index}
            animate={animate}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {signals.map((signal, index) => (
        <SignalCard
          key={index}
          signal={signal}
          index={index}
          animate={animate}
          layout={layout}
        />
      ))}
    </div>
  )
}

function SignalCard({
  signal,
  index,
  animate,
  layout
}: {
  signal: TrustSignal
  index: number
  animate: boolean
  layout: "grid" | "list"
}) {
  const content = (
    <div
      className={cn(
        "rounded-lg border p-3 backdrop-blur-sm transition-all",
        signal.highlight
          ? "border-pink-500/30 bg-pink-500/10"
          : "border-white/20 bg-white/10",
        "hover:border-white/30 hover:bg-white/15"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3",
          layout === "list" && "items-center"
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            signal.highlight
              ? "bg-pink-500/20 text-pink-400"
              : "bg-white/10 text-white/80"
          )}
        >
          {signal.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">{signal.title}</p>
          <p className="text-sm text-white/60">{signal.description}</p>
        </div>
      </div>
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {content}
    </motion.div>
  )
}

function CompactSignal({
  signal,
  index,
  animate
}: {
  signal: TrustSignal
  index: number
  animate: boolean
}) {
  const content = (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "text-sm",
          signal.highlight ? "text-pink-400" : "text-white/60"
        )}
      >
        {signal.icon}
      </div>
      <span className="text-sm font-medium text-white">{signal.title}</span>
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      {content}
    </motion.div>
  )
}

// Security badges component
export function SecurityBadges({ className }: { className?: string }) {
  const badges = [
    { icon: Lock, label: "SSL Secure" },
    { icon: Shield, label: "Verified" },
    { icon: CheckCircle, label: "Protected" }
  ]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"
          >
            <Icon className="size-3.5 text-green-400" />
            <span className="text-xs font-medium text-white/80">
              {badge.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// Review trust component
export function ReviewTrust({
  rating,
  reviewCount,
  className
}: {
  rating: number
  reviewCount: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-white/30"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-white">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-white/60">
        ({reviewCount.toLocaleString()} reviews)
      </span>
    </motion.div>
  )
}
