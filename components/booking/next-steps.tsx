"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Phone, Mail, Camera, Star, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface NextStep {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NextStepsProps {
  steps?: NextStep[]
  className?: string
}

const defaultSteps: NextStep[] = [
  {
    icon: <Calendar className="size-5" />,
    title: "Add to Calendar",
    description: "Set a reminder for your upcoming activity",
    action: {
      label: "Add to Calendar",
      onClick: () => console.log("Add to calendar")
    }
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Get Directions",
    description: "Find the meeting point and plan your route",
    action: {
      label: "View Map",
      onClick: () => console.log("View map")
    }
  },
  {
    icon: <Camera className="size-5" />,
    title: "Prepare for Your Trip",
    description: "Check what to bring and wear for the activity",
    action: {
      label: "View Checklist",
      onClick: () => console.log("View checklist")
    }
  },
  {
    icon: <Star className="size-5" />,
    title: "Leave a Review",
    description: "Share your experience after the activity",
    action: {
      label: "Write Review",
      onClick: () => console.log("Write review")
    }
  }
]

export function NextSteps({ steps = defaultSteps, className }: NextStepsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">What's Next?</h2>
        <p className="mt-2 text-white/60">
          Here are some helpful next steps for your booking
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, index) => (
          <NextStepCard key={index} step={step} index={index} />
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-6 text-center"
      >
        <Gift className="mx-auto mb-3 size-8 text-pink-400" />
        <h3 className="text-lg font-semibold text-white">
          Exclusive Offer for You!
        </h3>
        <p className="mt-2 text-sm text-white/80">
          Book another activity within 7 days and get 10% off with code
          EXPLORE10
        </p>
        <Button
          className="mt-4 bg-pink-500 text-white hover:bg-pink-600"
          onClick={() => console.log("Browse activities")}
        >
          Browse More Activities
        </Button>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center justify-center space-y-2 text-center"
      >
        <p className="text-sm text-white/60">Need help or have questions?</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="tel:+34600000000"
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-pink-400"
          >
            <Phone className="size-4" />
            +34 600 000 000
          </a>
          <a
            href="mailto:support@mallorcaactivities.com"
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-pink-400"
          >
            <Mail className="size-4" />
            support@mallorcaactivities.com
          </a>
        </div>
      </motion.div>
    </div>
  )
}

function NextStepCard({ step, index }: { step: NextStep; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/15"
    >
      {/* Background decoration */}
      <div
        className="absolute -right-8 -top-8 size-24 rounded-full bg-pink-500/10 blur-2xl transition-all group-hover:bg-pink-500/20"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-white/10 text-pink-400">
          {step.icon}
        </div>

        <div>
          <h3 className="font-semibold text-white">{step.title}</h3>
          <p className="mt-1 text-sm text-white/60">{step.description}</p>
        </div>

        {step.action && (
          <Button
            onClick={step.action.onClick}
            variant="ghost"
            size="sm"
            className="mt-2 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300"
          >
            {step.action.label} →
          </Button>
        )}
      </div>
    </motion.div>
  )
}
