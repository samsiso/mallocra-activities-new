"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "./booking-progress"

export interface BookingStep {
  id: string
  title: string
  description?: string
  component: React.ReactNode
  validation?: () => boolean | Promise<boolean>
}

export interface BookingFormProps {
  steps: BookingStep[]
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void | Promise<void>
  className?: string
}

export function BookingForm({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  className
}: BookingFormProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    if (currentStepData.validation) {
      setIsValidating(true)
      const isValid = await currentStepData.validation()
      setIsValidating(false)

      if (!isValid) return
    }

    if (isLastStep) {
      setIsCompleting(true)
      await onComplete()
      setIsCompleting(false)
    } else {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1)
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Progress */}
      <BookingProgress
        currentStep={currentStep + 1}
        totalSteps={steps.length}
        steps={steps.map((step, index) => ({
          id: index + 1,
          label: step.title,
          description: step.description
        }))}
      />

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {currentStepData.component}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={isFirstStep || isValidating || isCompleting}
          className="gap-2 text-white hover:bg-white/10"
        >
          <ArrowLeft className="size-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isValidating || isCompleting}
          className="gap-2 bg-pink-500 text-white hover:bg-pink-600"
        >
          {isCompleting ? (
            <>Processing...</>
          ) : isLastStep ? (
            <>Complete Booking</>
          ) : (
            <>
              Next
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
