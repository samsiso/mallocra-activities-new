/*
<ai_context>
Contains the Stripe configuration for the app.
Enhanced to handle missing environment variables gracefully during build time.
</ai_context>
*/

import Stripe from "stripe"

// Only warn during build time, don't throw error
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey && typeof window === "undefined") {
  console.warn("⚠️ STRIPE_SECRET_KEY is not set - payment operations will fail")
}

// Use a fallback key to prevent build errors, actual payments will fail gracefully
export const stripe = new Stripe(
  stripeSecretKey || "sk_test_fallback_key_for_build",
  {
    apiVersion: "2024-06-20",
    typescript: true
  }
)
