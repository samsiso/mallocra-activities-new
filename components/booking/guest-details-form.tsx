"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Users, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface GuestDetails {
  name: string
  email: string
  phone: string
  additionalGuests?: Array<{
    name: string
    age?: number
  }>
  specialRequirements?: string
  emergencyContact?: {
    name: string
    phone: string
  }
}

export interface GuestDetailsFormProps {
  details: GuestDetails
  onChange: (details: GuestDetails) => void
  participantCount?: number
  errors?: Record<string, string>
  className?: string
}

export function GuestDetailsForm({
  details,
  onChange,
  participantCount = 1,
  errors = {},
  className
}: GuestDetailsFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleFieldChange = (field: keyof GuestDetails, value: any) => {
    onChange({ ...details, [field]: value })
    setTouched({ ...touched, [field]: true })
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Primary Guest */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <User className="size-5 text-pink-400" />
          Primary Guest Details
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={details.name}
              onChange={e => handleFieldChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="John Doe"
              className={cn(
                "border-white/20 bg-white/10 text-white placeholder:text-white/40",
                "focus:border-pink-400 focus:ring-pink-400",
                touched.name && errors.name && "border-red-400"
              )}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {touched.name && errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="name-error"
                className="flex items-center gap-1 text-sm text-red-400"
              >
                <AlertCircle className="size-3" />
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={e => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="john@example.com"
                className={cn(
                  "border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/40",
                  "focus:border-pink-400 focus:ring-pink-400",
                  touched.email && errors.email && "border-red-400"
                )}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {touched.email && errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="email-error"
                className="flex items-center gap-1 text-sm text-red-400"
              >
                <AlertCircle className="size-3" />
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={e => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+34 600 000 000"
                className={cn(
                  "border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/40",
                  "focus:border-pink-400 focus:ring-pink-400",
                  touched.phone && errors.phone && "border-red-400"
                )}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {touched.phone && errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="phone-error"
                className="flex items-center gap-1 text-sm text-red-400"
              >
                <AlertCircle className="size-3" />
                {errors.phone}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Guests */}
      {participantCount > 1 && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Users className="size-5 text-pink-400" />
            Additional Guests
          </h3>
          <p className="text-sm text-white/60">
            Please provide names for all participants (optional)
          </p>

          <div className="space-y-3">
            {Array.from({ length: participantCount - 1 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  type="text"
                  placeholder={`Guest ${index + 2} name`}
                  value={details.additionalGuests?.[index]?.name || ""}
                  onChange={e => {
                    const guests = [...(details.additionalGuests || [])]
                    guests[index] = { ...guests[index], name: e.target.value }
                    handleFieldChange("additionalGuests", guests)
                  }}
                  className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-pink-400"
                />
                <Input
                  type="number"
                  placeholder="Age"
                  min="0"
                  max="120"
                  value={details.additionalGuests?.[index]?.age || ""}
                  onChange={e => {
                    const guests = [...(details.additionalGuests || [])]
                    guests[index] = {
                      ...guests[index],
                      age: parseInt(e.target.value) || undefined
                    }
                    handleFieldChange("additionalGuests", guests)
                  }}
                  className="w-20 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-pink-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Fields Note */}
      <div className="rounded-lg bg-pink-500/10 p-3">
        <p className="text-sm text-white/80">
          * Required fields. We'll use this information to send booking
          confirmations.
        </p>
      </div>
    </div>
  )
}
