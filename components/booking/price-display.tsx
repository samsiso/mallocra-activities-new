"use client"

import { motion } from "framer-motion"
import { TrendingUp, Tag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PriceDisplayProps {
  originalPrice?: number
  discountedPrice: number
  currency?: string
  currencySymbol?: string
  discount?: number
  size?: "sm" | "md" | "lg"
  showSavings?: boolean
  animate?: boolean
  className?: string
}

export function PriceDisplay({
  originalPrice,
  discountedPrice,
  currency = "EUR",
  currencySymbol = "€",
  discount,
  size = "md",
  showSavings = true,
  animate = true,
  className
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > discountedPrice
  const savings = hasDiscount ? originalPrice - discountedPrice : 0
  const discountPercentage =
    discount || (hasDiscount ? Math.round((savings / originalPrice) * 100) : 0)

  const sizeClasses = {
    sm: {
      price: "text-2xl",
      original: "text-sm",
      badge: "text-xs px-2 py-0.5",
      savings: "text-xs"
    },
    md: {
      price: "text-3xl",
      original: "text-base",
      badge: "text-sm px-2.5 py-1",
      savings: "text-sm"
    },
    lg: {
      price: "text-4xl",
      original: "text-lg",
      badge: "text-base px-3 py-1.5",
      savings: "text-base"
    }
  }

  const classes = sizeClasses[size]

  const content = (
    <div className={cn("inline-flex flex-col items-start gap-2", className)}>
      <div className="flex items-baseline gap-3">
        {/* Current Price */}
        <div className="flex items-baseline">
          <span className={cn("font-bold text-white", classes.price)}>
            {currencySymbol}
            {discountedPrice.toFixed(2)}
          </span>
          <span className="ml-1 text-sm text-white/60">{currency}</span>
        </div>

        {/* Original Price */}
        {hasDiscount && (
          <span className={cn("text-white/50 line-through", classes.original)}>
            {currencySymbol}
            {originalPrice.toFixed(2)}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.1
            }}
          >
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full bg-pink-500 font-semibold text-white",
                classes.badge
              )}
            >
              <Tag className="size-3" />-{discountPercentage}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Savings Message */}
      {hasDiscount && showSavings && savings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5"
        >
          <Sparkles className="size-4 text-yellow-400" />
          <span className={cn("font-medium text-yellow-400", classes.savings)}>
            Save {currencySymbol}
            {savings.toFixed(2)}
          </span>
        </motion.div>
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

// Currency converter component
export function CurrencyConverter({
  amount,
  fromCurrency = "EUR",
  toCurrency,
  exchangeRate,
  className
}: {
  amount: number
  fromCurrency?: string
  toCurrency: string
  exchangeRate: number
  className?: string
}) {
  const convertedAmount = amount * exchangeRate

  return (
    <div
      className={cn("flex items-center gap-2 text-sm text-white/60", className)}
    >
      <TrendingUp className="size-4" />
      <span>
        ≈ {getCurrencySymbol(toCurrency)}
        {convertedAmount.toFixed(2)} {toCurrency}
      </span>
    </div>
  )
}

// Helper function to get currency symbol
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    JPY: "¥",
    CHF: "₣",
    CAD: "C$",
    AUD: "A$",
    NZD: "NZ$"
  }
  return symbols[currency] || currency
}
