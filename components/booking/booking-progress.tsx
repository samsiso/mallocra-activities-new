"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BookingProgressProps {
  currentStep: number
  totalSteps: number
  steps?: Array<{
    id: number
    label: string
    description?: string
  }>
}

const defaultSteps = [
  { id: 1, label: "Select", description: "Date & Participants" },
  { id: 2, label: "Details", description: "Your Information" },
  { id: 3, label: "Payment", description: "Secure Checkout" }
]

export function BookingProgress({
  currentStep,
  totalSteps,
  steps = defaultSteps
}: BookingProgressProps) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center justify-between" role="list">
        {steps.slice(0, totalSteps).map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isLast = index === totalSteps - 1

          return (
            <li
              key={step.id}
              className={cn("relative flex items-center", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "#fb067d"
                      : isCurrent
                        ? "#fff546"
                        : "rgba(255, 255, 255, 0.2)"
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full",
                    "border-2 transition-colors",
                    isCompleted && "border-pink-600",
                    isCurrent && "border-yellow-400",
                    !isCompleted && !isCurrent && "border-white/40"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    >
                      <Check className="size-5 text-white" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent ? "text-black" : "text-white"
                      )}
                      aria-hidden="true"
                    >
                      {step.id}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCompleted || isCurrent ? "text-white" : "text-white/60"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 hidden text-xs text-white/50 sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div
                  className="absolute left-[50%] top-5 -z-10 h-0.5 w-full"
                  aria-hidden="true"
                >
                  <div className="size-full bg-white/20" />
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: isCompleted ? 1 : 0,
                      originX: 0
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 h-full bg-gradient-to-r from-pink-500 to-pink-600"
                  />
                </div>
              )}

              {/* Screen reader only */}
              <span className="sr-only">
                {isCompleted && "Completed: "}
                {isCurrent && "Current: "}
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
