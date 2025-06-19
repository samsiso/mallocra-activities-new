"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, CheckCircle, AlertTriangle } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface PaymentFormProps {
  clientSecret: string
  amount: number
  currency: string
  bookingReference: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function PaymentForm({
  clientSecret,
  amount,
  currency,
  bookingReference,
  onSuccess,
  onError
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!stripe) return

    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          onSuccess(paymentIntent.id)
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe, clientSecret, onSuccess])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-confirmation/${bookingReference}`
      }
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Payment failed")
        onError(error.message || "Payment failed")
      } else {
        setMessage("An unexpected error occurred.")
        onError("An unexpected error occurred.")
      }
    }

    setIsProcessing(false)
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
    wallets: {
      applePay: "auto" as const,
      googlePay: "auto" as const
    }
  }

  return (
    <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="size-5" />
          Payment Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount Display */}
          <div className="rounded-lg border border-white/20 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Total Amount:</span>
              <span className="text-xl font-bold text-white">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.toUpperCase()
                }).format(amount / 100)}
              </span>
            </div>
            <div className="mt-2 text-sm text-white/60">
              Booking Reference: {bookingReference}
            </div>
          </div>

          {/* Stripe Payment Element */}
          <div className="rounded-lg border border-white/20 bg-white/5 p-4">
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>

          {/* Error/Success Messages */}
          {message && (
            <Alert className="border-orange-500/30 bg-orange-500/10">
              <AlertTriangle className="size-4" />
              <AlertDescription className="text-white/80">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="w-full bg-orange-600 text-white hover:bg-orange-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 size-4" />
                Pay{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.toUpperCase()
                }).format(amount / 100)}
              </>
            )}
          </Button>

          {/* Payment Security Notice */}
          <div className="text-center text-sm text-white/60">
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="size-4" />
              <span>Payments are securely processed by Stripe</span>
            </div>
            <p className="mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface StripePaymentElementProps {
  amount: number
  currency: string
  bookingId: string
  activityId: string
  customerId: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export function StripePaymentElement({
  amount,
  currency,
  bookingId,
  activityId,
  customerId,
  onSuccess,
  onError
}: StripePaymentElementProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          bookingId,
          activityId,
          customerId
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || "Failed to initialize payment")
          onError(data.error || "Failed to initialize payment")
        }
      })
      .catch(err => {
        setError("Failed to initialize payment")
        onError("Failed to initialize payment")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [amount, currency, bookingId, activityId, customerId, onError])

  if (loading) {
    return (
      <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 size-8 animate-spin text-orange-400" />
            <p className="text-white/70">Initializing secure payment...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !clientSecret) {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-4 size-8 text-red-400" />
            <p className="text-red-300">
              {error || "Payment initialization failed"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#ea580c",
        colorBackground: "rgba(255, 255, 255, 0.1)",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "6px",
        borderRadius: "8px"
      }
    }
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentForm
        clientSecret={clientSecret}
        amount={amount * 100} // Convert to cents for display
        currency={currency}
        bookingReference={bookingId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
