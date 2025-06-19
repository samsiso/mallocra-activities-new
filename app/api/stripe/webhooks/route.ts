/*
<ai_context>
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
Now includes booking payment failure notifications to admin via Telegram.
</ai_context>
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { getBookingByReferenceAction } from "@/actions/db/bookings-actions"
import { sendTelegramPaymentFailureAlertAction } from "@/actions/notifications/telegram-notifications"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.payment_failed",
  "payment_intent.succeeded"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        case "payment_intent.payment_failed":
          await handlePaymentFailure(event)
          break

        case "payment_intent.succeeded":
          await handlePaymentSuccess(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400
        }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}

async function handlePaymentFailure(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  console.log(
    "🔴 Payment failed:",
    paymentIntent.id,
    paymentIntent.last_payment_error?.message
  )

  const bookingReference = paymentIntent.metadata?.bookingReference

  if (!bookingReference) {
    console.log(
      "Payment failure for non-booking transaction, skipping notification"
    )
    return
  }

  try {
    const bookingResult = await getBookingByReferenceAction(bookingReference)

    if (!bookingResult.isSuccess) {
      console.error(
        "Failed to get booking for payment failure:",
        bookingReference
      )
      return
    }

    const booking = bookingResult.data

    const notificationResult = await sendTelegramPaymentFailureAlertAction({
      customerName: booking.leadCustomerName || "Unknown Customer",
      customerEmail: booking.leadCustomerEmail || "Unknown Email",
      activityTitle: `Activity ${booking.activityId}`, // Use activity ID as fallback
      amount: Number(booking.totalAmount) || 0,
      bookingReference: booking.bookingReference,
      errorMessage:
        paymentIntent.last_payment_error?.message || "Payment declined"
    })

    if (notificationResult.isSuccess) {
      console.log("✅ Payment failure notification sent to admin")
    } else {
      console.warn(
        "⚠️ Failed to send payment failure notification:",
        notificationResult.message
      )
    }
  } catch (error) {
    console.error("Error handling payment failure notification:", error)
  }
}

async function handlePaymentSuccess(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  console.log(
    "✅ Payment succeeded:",
    paymentIntent.id,
    `€${(paymentIntent.amount / 100).toFixed(2)}`
  )

  const bookingReference = paymentIntent.metadata?.bookingReference

  if (bookingReference) {
    console.log("📋 Booking payment confirmed:", bookingReference)
  }
}
