"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface SpecialRequirementsInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  suggestions?: string[]
  className?: string
}

export function SpecialRequirementsInput({
  value,
  onChange,
  maxLength = 500,
  placeholder = "Let us know if you have any special requirements, dietary restrictions, accessibility needs, or other requests...",
  suggestions = [
    "Vegetarian/Vegan meals",
    "Wheelchair accessibility",
    "Child-friendly options",
    "Photography restrictions",
    "Language preferences"
  ],
  className
}: SpecialRequirementsInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const charactersUsed = value.length
  const charactersRemaining = maxLength - charactersUsed
  const percentageUsed = (charactersUsed / maxLength) * 100

  const handleSuggestionClick = (suggestion: string) => {
    const newValue = value ? `${value}\n${suggestion}` : suggestion
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label
          htmlFor="special-requirements"
          className="flex items-center gap-2 text-white"
        >
          <MessageSquare className="size-4 text-pink-400" />
          Special Requirements
          <span className="text-sm font-normal text-white/60">(Optional)</span>
        </Label>

        <div className="relative">
          <Textarea
            id="special-requirements"
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={4}
            className={cn(
              "resize-none border-white/20 bg-white/10 text-white placeholder:text-white/40",
              "focus:border-pink-400 focus:ring-pink-400",
              "transition-all duration-200"
            )}
            aria-describedby="character-count"
          />

          {/* Character count */}
          <div className="mt-2 flex items-center justify-between">
            <AnimatePresence>
              {isFocused && suggestions.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-white/60"
                >
                  Click suggestions below to add
                </motion.p>
              )}
            </AnimatePresence>

            <div
              id="character-count"
              className={cn(
                "text-sm transition-colors",
                percentageUsed > 90
                  ? "text-red-400"
                  : percentageUsed > 75
                    ? "text-yellow-400"
                    : "text-white/60"
              )}
            >
              {charactersRemaining} characters remaining
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={false}
              animate={{ width: `${percentageUsed}%` }}
              transition={{ duration: 0.2 }}
              className={cn(
                "h-full transition-colors",
                percentageUsed > 90
                  ? "bg-red-400"
                  : percentageUsed > 75
                    ? "bg-yellow-400"
                    : "bg-pink-400"
              )}
            />
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <p className="flex items-center gap-1 text-sm text-white/60">
              <Info className="size-3" />
              Common requests:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 transition-colors hover:bg-white/20"
                  type="button"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info message */}
      {value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-green-400/10 p-3"
        >
          <p className="flex items-start gap-2 text-sm text-white/80">
            <Info className="size-4 shrink-0 text-green-400" />
            We'll do our best to accommodate your requests and will contact you
            if we have any questions.
          </p>
        </motion.div>
      )}
    </div>
  )
}
