import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, metadata } = await request.json()

    if (!amount || amount < 50) {
      // Minimum 50 cents
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency || "eur",
      metadata: {
        bookingId: metadata?.bookingId || "",
        activityId: metadata?.activityId || "",
        customerId: metadata?.customerId || ""
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error("Stripe payment intent creation error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent"
      },
      { status: 500 }
    )
  }
}
