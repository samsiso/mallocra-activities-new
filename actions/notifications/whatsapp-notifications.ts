"use server"

import { ActionState } from "@/types"
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendWhatsAppNotificationAction(
  phoneNumber: string,
  message: string
): Promise<ActionState<{ messageSid: string }>> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_SANDBOX) {
      throw new Error("Twilio WhatsApp credentials not configured")
    }

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_SANDBOX, // 'whatsapp:+14155238886'
      to: `whatsapp:${phoneNumber}`,
      body: message
    })

    return {
      isSuccess: true,
      message: "WhatsApp message sent successfully",
      data: { messageSid: result.sid }
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error)
    return {
      isSuccess: false,
      message: `Failed to send WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function sendWhatsAppBookingConfirmationAction(
  phoneNumber: string,
  bookingData: {
    customerName: string
    activityTitle: string
    bookingDate: string
    bookingTime: string
    bookingReference: string
    totalAmount: number
  }
): Promise<ActionState<{ messageSid: string }>> {
  const message = `🎉 Booking Confirmed!

Hi ${bookingData.customerName}! Your Mallorca adventure is confirmed!

📅 Activity: ${bookingData.activityTitle}
🗓️ Date: ${bookingData.bookingDate}
🕒 Time: ${bookingData.bookingTime}
💰 Total: €${bookingData.totalAmount}

📋 Reference: ${bookingData.bookingReference}

We can't wait to make your experience unforgettable! 🌴`

  return await sendWhatsAppNotificationAction(phoneNumber, message)
}

export async function sendWhatsAppPaymentConfirmationAction(
  phoneNumber: string,
  paymentData: {
    customerName: string
    paymentType: "deposit" | "full"
    paymentAmount: number
    bookingReference: string
    activityTitle: string
  }
): Promise<ActionState<{ messageSid: string }>> {
  const paymentTypeText = paymentData.paymentType === "deposit" ? "deposit" : "full payment"
  const remainingMessage = paymentData.paymentType === "deposit" 
    ? "Your adventure is secured! Final payment will be required on the day of the activity."
    : "You're all set! We look forward to seeing you for your adventure."

  const message = `💳 Payment Confirmed

Hi ${paymentData.customerName}! Your ${paymentTypeText} has been successfully processed.

💰 Amount: €${paymentData.paymentAmount}
📋 Booking: ${paymentData.bookingReference}
🎯 Activity: ${paymentData.activityTitle}

${remainingMessage}

Need help? Reply to this message! 📱`

  return await sendWhatsAppNotificationAction(phoneNumber, message)
} 