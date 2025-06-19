"use server"

import { ActionState } from "@/types"
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendSMSNotificationAction(
  phoneNumber: string,
  message: string
): Promise<ActionState<{ messageSid: string }>> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio credentials not configured")
    }

    const result = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      body: message
    })

    return {
      isSuccess: true,
      message: "SMS sent successfully",
      data: { messageSid: result.sid }
    }
  } catch (error) {
    console.error("SMS notification error:", error)
    return {
      isSuccess: false,
      message: `Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function sendSMSBookingConfirmationAction(
  phoneNumber: string,
  bookingData: {
    customerName: string
    activityTitle: string
    bookingDate: string
    bookingReference: string
  }
): Promise<ActionState<{ messageSid: string }>> {
  const message = `🎉 Mallorca Activities: Hi ${bookingData.customerName}! Your ${bookingData.activityTitle} is confirmed for ${bookingData.bookingDate}. Ref: ${bookingData.bookingReference}. Questions? Reply to this message!`

  return await sendSMSNotificationAction(phoneNumber, message)
}

export async function sendSMSPaymentConfirmationAction(
  phoneNumber: string,
  paymentData: {
    customerName: string
    paymentType: "deposit" | "full"
    paymentAmount: number
    bookingReference: string
  }
): Promise<ActionState<{ messageSid: string }>> {
  const paymentTypeText = paymentData.paymentType === "deposit" ? "deposit" : "full payment"
  const message = `💳 Mallorca Activities: Hi ${paymentData.customerName}! Your ${paymentTypeText} of €${paymentData.paymentAmount} is confirmed. Ref: ${paymentData.bookingReference}. Thank you!`

  return await sendSMSNotificationAction(phoneNumber, message)
} 