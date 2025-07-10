"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface BookingCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "elevated" | "bordered"
  animate?: boolean
}

export function BookingCard({
  children,
  className,
  variant = "default",
  animate = true
}: BookingCardProps) {
  const variants = {
    default: "bg-white/15 backdrop-blur-xl border-white/20",
    elevated: "bg-white/20 backdrop-blur-2xl border-white/30 shadow-2xl",
    bordered: "bg-white/10 backdrop-blur-lg border-2 border-pink-500/30"
  }

  const content = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 md:p-8",
        "transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {/* Gradient orb for visual interest */}
      <div
        className="absolute -right-20 -top-20 size-40 rounded-full bg-pink-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 size-40 rounded-full bg-yellow-400/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {content}
    </motion.div>
  )
}
