"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Lock, Shield, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SecurityBadges } from "./trust-signals"

export interface PaymentFormProps {
  amount: number
  currency?: string
  onSubmit: () => void | Promise<void>
  isProcessing?: boolean
  stripeElement?: React.ReactNode
  className?: string
}

export function PaymentForm({
  amount,
  currency = "EUR",
  onSubmit,
  isProcessing = false,
  stripeElement,
  className
}: PaymentFormProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (agreedToTerms && !isProcessing) {
      await onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Payment Header */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
          <CreditCard className="size-5 text-pink-400" />
          Payment Details
        </h3>

        <div className="rounded-lg bg-pink-500/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-white">
              €{amount.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Stripe Element */}
      {stripeElement && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/20 bg-white/5 p-4">
            {stripeElement}
          </div>

          {/* Security Info */}
          <div className="flex items-center justify-center">
            <SecurityBadges />
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="mt-1 size-4 rounded border-white/40 bg-white/10 text-pink-500 focus:ring-pink-500"
            aria-describedby="terms-description"
          />
          <div className="space-y-1">
            <span className="text-sm text-white">
              I agree to the{" "}
              <a href="/terms" className="underline hover:text-pink-400">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-pink-400">
                Privacy Policy
              </a>
            </span>
            <p id="terms-description" className="text-xs text-white/60">
              By completing this booking, you agree to our cancellation policy
              and terms of service.
            </p>
          </div>
        </label>
      </div>

      {/* Payment Info */}
      <div className="space-y-3 rounded-lg bg-blue-500/10 p-4">
        <div className="flex items-start gap-2">
          <Info className="size-4 shrink-0 text-blue-400" />
          <div className="space-y-2 text-sm text-white/80">
            <p>• Your payment is processed securely via Stripe</p>
            <p>• Free cancellation up to 24 hours before the activity</p>
            <p>• You'll receive instant confirmation via email</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!agreedToTerms || isProcessing}
        className={cn(
          "w-full py-6 text-lg font-semibold",
          "bg-gradient-to-r from-pink-500 to-pink-600",
          "hover:from-pink-600 hover:to-pink-700",
          "disabled:from-gray-500 disabled:to-gray-600",
          "transition-all duration-200"
        )}
      >
        {isProcessing ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing Payment...
          </motion.div>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="size-5" />
            Complete Secure Payment
          </span>
        )}
      </Button>

      {/* Additional Security Note */}
      <p className="text-center text-xs text-white/60">
        <Shield className="inline size-3" /> Your payment information is
        encrypted and secure
      </p>
    </form>
  )
}
