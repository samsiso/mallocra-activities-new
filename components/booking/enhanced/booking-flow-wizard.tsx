"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system/tokens"
import {
  Check,
  ChevronRight,
  Calendar,
  Users,
  CreditCard,
  CheckCircle
} from "lucide-react"

interface BookingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

interface BookingFlowWizardProps {
  steps: BookingStep[]
  currentStep?: number
  onStepChange?: (step: number) => void
  onComplete?: () => void
  className?: string
  showProgressBar?: boolean
  allowStepNavigation?: boolean
}

export function BookingFlowWizard({
  steps,
  currentStep = 0,
  onStepChange,
  onComplete,
  className,
  showProgressBar = true,
  allowStepNavigation = true
}: BookingFlowWizardProps) {
  const [activeStep, setActiveStep] = useState(currentStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setActiveStep(currentStep)
  }, [currentStep])

  const handleStepChange = (newStep: number) => {
    if (
      !allowStepNavigation &&
      newStep > activeStep &&
      !completedSteps.includes(activeStep)
    ) {
      return
    }

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveStep(newStep)
      onStepChange?.(newStep)
      setIsTransitioning(false)
    }, 300)
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, activeStep])
      handleStepChange(activeStep + 1)
    } else {
      setCompletedSteps([...completedSteps, activeStep])
      onComplete?.()
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      handleStepChange(activeStep - 1)
    }
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="mb-8">
          <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600">
              Step {activeStep + 1} of {steps.length}
            </span>
            <span className="font-medium text-pink-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeStep
            const isCompleted = completedSteps.includes(index)
            const isClickable =
              allowStepNavigation && (isCompleted || index <= activeStep)

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <motion.button
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => isClickable && handleStepChange(index)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex size-12 items-center justify-center rounded-full",
                    "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                    isActive && "ring-2 ring-pink-500 ring-offset-2",
                    isClickable && "cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-300",
                      isActive
                        ? "shadow-pink-glow/30 bg-gradient-to-br from-pink-500 to-pink-600"
                        : isCompleted
                          ? "bg-green-500"
                          : "bg-gray-300"
                    )}
                  />
                  <div className="relative z-10 text-white">
                    {isCompleted ? (
                      <Check className="size-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                </motion.button>

                <div className="ml-3 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  {isActive && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {step.description}
                    </p>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div className="mx-4 max-w-[100px] flex-1">
                    <div
                      className={cn(
                        "h-0.5 transition-all duration-500",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md md:p-8">
                {/* Step Header */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-pink-500/20 p-3">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {steps[activeStep].title}
                    </h2>
                    <p className="text-gray-600">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>

                {/* Step Component */}
                <div>{steps[activeStep].component}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrevious}
          disabled={activeStep === 0}
          className={cn(
            "rounded-xl px-6 py-3 font-medium transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
            activeStep === 0
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "border border-white/20 bg-white/20 text-gray-700 backdrop-blur-sm hover:bg-white/30"
          )}
        >
          Previous
        </motion.button>

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => allowStepNavigation && handleStepChange(index)}
              disabled={
                !allowStepNavigation ||
                (!completedSteps.includes(index) && index > activeStep)
              }
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                index === activeStep
                  ? "w-8 bg-pink-500"
                  : completedSteps.includes(index)
                    ? "bg-green-500"
                    : "bg-gray-300",
                allowStepNavigation &&
                  (completedSteps.includes(index) || index <= activeStep) &&
                  "cursor-pointer hover:bg-pink-400"
              )}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className={cn(
            "rounded-xl px-6 py-3 font-medium transition-all duration-300",
            "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
            "hover:shadow-pink-glow/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
            "flex items-center gap-2"
          )}
        >
          {activeStep === steps.length - 1 ? (
            <>
              Complete
              <CheckCircle className="size-5" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="size-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

// Example usage with default booking steps
export const defaultBookingSteps: BookingStep[] = [
  {
    id: "select",
    title: "Select Date & Time",
    description: "Choose when you want to experience this activity",
    icon: <Calendar className="size-6 text-pink-600" />,
    component: <div>Date selection component</div>
  },
  {
    id: "participants",
    title: "Participants",
    description: "How many people will be joining?",
    icon: <Users className="size-6 text-pink-600" />,
    component: <div>Participants component</div>
  },
  {
    id: "payment",
    title: "Payment",
    description: "Secure payment processing",
    icon: <CreditCard className="size-6 text-pink-600" />,
    component: <div>Payment component</div>
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Your booking is complete!",
    icon: <CheckCircle className="size-6 text-pink-600" />,
    component: <div>Confirmation component</div>
  }
]
