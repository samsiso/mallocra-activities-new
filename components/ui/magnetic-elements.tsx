"use client"

/*
<ai_context>
Advanced Magnetic Interactive Elements - 2024 Design Trends
Features magnetic buttons with cursor tracking, floating interactive helpers,
and sophisticated hover effects that create stunning user experiences.
</ai_context>
*/

import { useState, useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from "framer-motion"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  BookmarkPlus,
  MessageCircle,
  Zap,
  Star,
  Trophy,
  Gift
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  href?: string
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  href
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Magnetic effect - stronger when closer
    const maxDistance = 100
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance
      x.set(distanceX * strength * 0.3)
      y.set(distanceY * strength * 0.3)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const baseClasses = {
    primary:
      "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-rose-500 text-rose-600 hover:bg-rose-50 hover:shadow-lg"
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative overflow-hidden rounded-xl font-semibold transition-all duration-300",
        "transform-gpu will-change-transform",
        baseClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={isHovered ? { x: [-100, 300] } : { x: -100 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Sparkles effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  scale: 0,
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%"
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Sparkles className="size-3 text-yellow-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 flex items-center gap-2">
        {children}
        <motion.div
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="size-4" />
        </motion.div>
      </span>
    </motion.button>
  )
}

interface FloatingActionBubbleProps {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  position: { bottom: number; right: number }
  delay?: number
}

export function FloatingActionBubble({
  icon,
  tooltip,
  onClick,
  position,
  delay = 0
}: FloatingActionBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50"
          style={{ bottom: position.bottom, right: position.right }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.button
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              {icon}
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-sm text-white"
              >
                {tooltip}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ProgressCelebrationProps {
  progress: number
  total: number
  title: string
  onComplete?: () => void
}

export function ProgressCelebration({
  progress,
  total,
  title,
  onComplete
}: ProgressCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const percentage = (progress / total) * 100
  const isComplete = progress >= total

  useEffect(() => {
    if (isComplete && !showCelebration) {
      setShowCelebration(true)
      onComplete?.()

      // Auto-hide celebration after 3 seconds
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isComplete, showCelebration, onComplete])

  return (
    <div className="relative">
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">{title}</h3>
          <Badge className="bg-yellow-400 text-black">
            {progress}/{total}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/90 to-orange-500/90"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: 2 }}
              >
                <Trophy className="mx-auto mb-2 size-12" />
              </motion.div>
              <h4 className="text-lg font-bold">Congratulations!</h4>
              <p className="text-sm opacity-90">You've completed {title}!</p>
            </div>

            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute size-3 rounded-full bg-yellow-300"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0
                }}
                animate={{
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 300 - 150,
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SmartHoverCardProps {
  children: React.ReactNode
  previewContent: React.ReactNode
  className?: string
}

export function SmartHoverCard({
  children,
  previewContent,
  className
}: SmartHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <motion.div
      className={cn("relative cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {children}

      {/* Hover Preview */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-50 min-w-64 rounded-xl border border-white/50 bg-white/95 p-4 shadow-2xl backdrop-blur-md"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 50
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {previewContent}

            {/* Arrow pointer */}
            <div className="absolute -left-2 top-8 size-4 rotate-45 border-l border-t border-white/50 bg-white/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
