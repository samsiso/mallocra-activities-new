"use server"

import { sendTelegramAdminBookingAlertAction, sendTelegramPaymentFailureAlertAction } from "./telegram-notifications"
import { sendSMSBookingConfirmationAction, sendSMSPaymentConfirmationAction } from "./sms-notifications"  
import { sendWhatsAppBookingConfirmationAction, sendWhatsAppPaymentConfirmationAction } from "./whatsapp-notifications"
import { ActionState } from "@/types"

export interface MultiChannelBookingData {
  customerName: string
  customerEmail: string
  customerPhone: string
  telegramChatId?: string // Optional - if customer provided
  activityTitle: string
  bookingDate: string
  bookingTime: string
  bookingReference: string
  totalAmount: number
  participantCount: number
}

export interface MultiChannelPaymentData {
  customerName: string
  customerPhone: string
  telegramChatId?: string
  paymentType: "deposit" | "full"
  paymentAmount: number
  bookingReference: string
  activityTitle: string
}

export async function sendMultiChannelBookingConfirmationAction(
  data: MultiChannelBookingData
): Promise<ActionState<{
  sms: boolean
  whatsapp: boolean
  telegram: boolean
}>> {
  const results = {
    sms: false,
    whatsapp: false,
    telegram: false
  }

  // Send SMS
  try {
    const smsResult = await sendSMSBookingConfirmationAction(data.customerPhone, {
      customerName: data.customerName,
      activityTitle: data.activityTitle,
      bookingDate: data.bookingDate,
      bookingReference: data.bookingReference
    })
    results.sms = smsResult.isSuccess
    console.log("SMS notification result:", smsResult.isSuccess ? "SUCCESS" : smsResult.message)
  } catch (error) {
    console.error("SMS notification failed:", error)
  }

  // Send WhatsApp (if customer opted in to Twilio sandbox)
  try {
    const whatsappResult = await sendWhatsAppBookingConfirmationAction(data.customerPhone, {
      customerName: data.customerName,
      activityTitle: data.activityTitle,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      bookingReference: data.bookingReference,
      totalAmount: data.totalAmount
    })
    results.whatsapp = whatsappResult.isSuccess
    console.log("WhatsApp notification result:", whatsappResult.isSuccess ? "SUCCESS" : whatsappResult.message)
  } catch (error) {
    console.error("WhatsApp notification failed:", error)
  }

  // Send Telegram (if customer provided chat ID)
  if (data.telegramChatId) {
    try {
      const telegramResult = await sendTelegramAdminBookingAlertAction({
        customerName: data.customerName,
        activityTitle: data.activityTitle,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        bookingReference: data.bookingReference,
        totalAmount: data.totalAmount
      })
      results.telegram = telegramResult.isSuccess
      console.log("Telegram notification result:", telegramResult.isSuccess ? "SUCCESS" : telegramResult.message)
    } catch (error) {
      console.error("Telegram notification failed:", error)
    }
  }

  const successCount = Object.values(results).filter(Boolean).length
  const totalAttempted = data.telegramChatId ? 3 : 2

  if (successCount > 0) {
    return {
      isSuccess: true,
      message: `Notifications sent: ${successCount}/${totalAttempted} channels`,
      data: results
    }
  } else {
    return {
      isSuccess: false,
      message: `Failed to send notifications to any channel`
    }
  }
}

export async function sendMultiChannelPaymentConfirmationAction(
  data: MultiChannelPaymentData
): Promise<ActionState<{
  sms: boolean
  whatsapp: boolean
  telegram: boolean
}>> {
  const results = {
    sms: false,
    whatsapp: false,
    telegram: false
  }

  // Send SMS
  try {
    const smsResult = await sendSMSPaymentConfirmationAction(data.customerPhone, {
      customerName: data.customerName,
      paymentType: data.paymentType,
      paymentAmount: data.paymentAmount,
      bookingReference: data.bookingReference
    })
    results.sms = smsResult.isSuccess
    console.log("SMS payment notification result:", smsResult.isSuccess ? "SUCCESS" : smsResult.message)
  } catch (error) {
    console.error("SMS payment notification failed:", error)
  }

  // Send WhatsApp
  try {
    const whatsappResult = await sendWhatsAppPaymentConfirmationAction(data.customerPhone, {
      customerName: data.customerName,
      paymentType: data.paymentType,
      paymentAmount: data.paymentAmount,
      bookingReference: data.bookingReference,
      activityTitle: data.activityTitle
    })
    results.whatsapp = whatsappResult.isSuccess
    console.log("WhatsApp payment notification result:", whatsappResult.isSuccess ? "SUCCESS" : whatsappResult.message)
  } catch (error) {
    console.error("WhatsApp payment notification failed:", error)
  }

  // Send Telegram (if customer provided chat ID)
  if (data.telegramChatId) {
    try {
      const telegramResult = await sendTelegramPaymentFailureAlertAction({
        customerName: data.customerName,
        paymentAmount: data.paymentAmount,
        bookingReference: data.bookingReference,
        activityTitle: data.activityTitle,
        errorMessage: "Payment processing notification"
      })
      results.telegram = telegramResult.isSuccess
      console.log("Telegram payment notification result:", telegramResult.isSuccess ? "SUCCESS" : telegramResult.message)
    } catch (error) {
      console.error("Telegram payment notification failed:", error)
    }
  }

  const successCount = Object.values(results).filter(Boolean).length
  const totalAttempted = data.telegramChatId ? 3 : 2

  if (successCount > 0) {
    return {
      isSuccess: true,
      message: `Payment notifications sent: ${successCount}/${totalAttempted} channels`,
      data: results
    }
  } else {
    return {
      isSuccess: false,
      message: `Failed to send payment notifications to any channel`
    }
  }
} 