"use server"

import { ActionState } from "@/types"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function sendTelegramNotificationAction(
  chatId: string,
  message: string
): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN not configured")
    }

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error')
    }

    return {
      isSuccess: true,
      message: "Telegram notification sent successfully",
      data: { messageId: data.result.message_id }
    }
  } catch (error) {
    console.error("Telegram notification error:", error)
    return { 
      isSuccess: false, 
      message: error instanceof Error ? error.message : "Failed to send Telegram notification" 
    }
  }
}

// BOOKING NOTIFICATIONS
export async function sendTelegramAdminBookingAlertAction(bookingData: {
  customerName: string
  customerEmail: string
  customerPhone: string
  activityTitle: string
  bookingDate: string
  bookingTime: string
  bookingReference: string
  totalAmount: number
  participantCount: number
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `🔔 <b>NEW BOOKING ALERT!</b>

💰 <b>Revenue: €${bookingData.totalAmount.toFixed(2)}</b>
👥 <b>Participants: ${bookingData.participantCount}</b>

📅 <b>Activity:</b> ${bookingData.activityTitle}
🗓️ <b>Date:</b> ${bookingData.bookingDate}
🕒 <b>Time:</b> ${bookingData.bookingTime}

👤 <b>Customer:</b> ${bookingData.customerName}
📧 <b>Email:</b> ${bookingData.customerEmail}
📞 <b>Phone:</b> ${bookingData.customerPhone}

📋 <b>Reference:</b> ${bookingData.bookingReference}

✅ <i>Booking confirmed and payment processed</i>`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending booking alert:", error)
    return { 
      isSuccess: false, 
      message: "Failed to send booking alert" 
    }
  }
}

// 🚨 URGENT ALERTS (Immediate Action Required)
export async function sendTelegramPaymentFailureAlertAction(paymentData: {
  customerName: string
  customerEmail: string
  activityTitle: string
  amount: number
  bookingReference: string
  errorMessage: string
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `🚨 <b>PAYMENT FAILURE - URGENT!</b>

💳 <b>Failed Amount: €${paymentData.amount.toFixed(2)}</b>
❌ <b>Error:</b> ${paymentData.errorMessage}

👤 <b>Customer:</b> ${paymentData.customerName}
📧 <b>Email:</b> ${paymentData.customerEmail}
📅 <b>Activity:</b> ${paymentData.activityTitle}
📋 <b>Reference:</b> ${paymentData.bookingReference}

⚠️ <i>Contact customer immediately to resolve payment</i>`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending payment failure alert:", error)
    return { isSuccess: false, message: "Failed to send payment failure alert" }
  }
}

export async function sendTelegramCancellationAlertAction(cancellationData: {
  customerName: string
  activityTitle: string
  bookingDate: string
  bookingTime: string
  refundAmount: number
  bookingReference: string
  reason?: string
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `🚨 <b>BOOKING CANCELLATION</b>

💸 <b>Refund: €${cancellationData.refundAmount.toFixed(2)}</b>

👤 <b>Customer:</b> ${cancellationData.customerName}
📅 <b>Activity:</b> ${cancellationData.activityTitle}
🗓️ <b>Date:</b> ${cancellationData.bookingDate}
🕒 <b>Time:</b> ${cancellationData.bookingTime}
📋 <b>Reference:</b> ${cancellationData.bookingReference}

${cancellationData.reason ? `💭 <b>Reason:</b> ${cancellationData.reason}` : ''}

⚠️ <i>Process refund and update availability</i>`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending cancellation alert:", error)
    return { isSuccess: false, message: "Failed to send cancellation alert" }
  }
}

export async function sendTelegramBadReviewAlertAction(reviewData: {
  customerName: string
  activityTitle: string
  rating: number
  comment: string
  bookingReference: string
  reviewDate: string
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `🚨 <b>BAD REVIEW ALERT!</b>

⭐ <b>Rating: ${reviewData.rating}/5 stars</b>

👤 <b>Customer:</b> ${reviewData.customerName}
📅 <b>Activity:</b> ${reviewData.activityTitle}
📋 <b>Reference:</b> ${reviewData.bookingReference}
🗓️ <b>Date:</b> ${reviewData.reviewDate}

💬 <b>Comment:</b>
"${reviewData.comment}"

⚠️ <i>Respond immediately to mitigate reputation damage</i>`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending bad review alert:", error)
    return { isSuccess: false, message: "Failed to send bad review alert" }
  }
}

export async function sendTelegramWeatherAlertAction(weatherData: {
  activityTitle: string
  date: string
  time: string
  weatherCondition: string
  risk: 'high' | 'medium' | 'low'
  affectedBookings: number
  recommendation: string
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const riskEmoji = weatherData.risk === 'high' ? '🔴' : weatherData.risk === 'medium' ? '🟡' : '🟢'

    const message = `🌦️ <b>WEATHER ALERT</b> ${riskEmoji}

📅 <b>Activity:</b> ${weatherData.activityTitle}
🗓️ <b>Date:</b> ${weatherData.date}
🕒 <b>Time:</b> ${weatherData.time}

🌤️ <b>Condition:</b> ${weatherData.weatherCondition}
⚠️ <b>Risk Level:</b> ${weatherData.risk.toUpperCase()}
👥 <b>Affected Bookings:</b> ${weatherData.affectedBookings}

💡 <b>Recommendation:</b> ${weatherData.recommendation}

${weatherData.risk === 'high' ? '🚨 <i>Consider cancelling for safety</i>' : '⚠️ <i>Monitor conditions closely</i>'}`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending weather alert:", error)
    return { isSuccess: false, message: "Failed to send weather alert" }
  }
}

export async function sendTelegramCapacityWarningAction(capacityData: {
  activityTitle: string
  date: string
  time: string
  currentBookings: number
  maxCapacity: number
  percentageFull: number
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `📊 <b>CAPACITY WARNING</b>

📅 <b>Activity:</b> ${capacityData.activityTitle}
🗓️ <b>Date:</b> ${capacityData.date}
🕒 <b>Time:</b> ${capacityData.time}

👥 <b>Current:</b> ${capacityData.currentBookings}/${capacityData.maxCapacity}
📈 <b>Full:</b> ${capacityData.percentageFull}%

${capacityData.percentageFull >= 90 ? '🔴 <i>Nearly full - watch for overbooking</i>' : '🟡 <i>High demand - consider adding capacity</i>'}`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending capacity warning:", error)
    return { isSuccess: false, message: "Failed to send capacity warning" }
  }
}

// ⚠️ IMPORTANT NOTIFICATIONS (Same Day Action)
export async function sendTelegramCustomerInquiryAction(inquiryData: {
  customerName: string
  customerEmail: string
  customerPhone: string
  activityTitle: string
  preferredDate: string
  message: string
  urgency: 'high' | 'normal'
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const urgencyEmoji = inquiryData.urgency === 'high' ? '🔥' : '💬'

    const message = `${urgencyEmoji} <b>NEW CUSTOMER INQUIRY</b>

👤 <b>Customer:</b> ${inquiryData.customerName}
📧 <b>Email:</b> ${inquiryData.customerEmail}
📞 <b>Phone:</b> ${inquiryData.customerPhone}

📅 <b>Activity:</b> ${inquiryData.activityTitle}
🗓️ <b>Preferred Date:</b> ${inquiryData.preferredDate}

💭 <b>Message:</b>
"${inquiryData.message}"

${inquiryData.urgency === 'high' ? '⚡ <i>High priority - respond within 1 hour</i>' : '📝 <i>Respond within 4 hours</i>'}`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending customer inquiry:", error)
    return { isSuccess: false, message: "Failed to send customer inquiry" }
  }
}

// 📊 DAILY SUMMARIES (End of Day Reports)
export async function sendTelegramDailySummaryAction(summaryData: {
  date: string
  totalRevenue: number
  totalBookings: number
  newCustomers: number
  cancellations: number
  averageRating: number
  upcomingActivities: number
  weatherConcerns: number
}): Promise<ActionState<{ messageId: number }>> {
  try {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
      throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured")
    }

    const message = `📊 <b>DAILY SUMMARY - ${summaryData.date}</b>

💰 <b>Revenue:</b> €${summaryData.totalRevenue.toFixed(2)}
📋 <b>Bookings:</b> ${summaryData.totalBookings}
👤 <b>New Customers:</b> ${summaryData.newCustomers}
❌ <b>Cancellations:</b> ${summaryData.cancellations}

⭐ <b>Average Rating:</b> ${summaryData.averageRating.toFixed(1)}/5.0
📅 <b>Tomorrow's Activities:</b> ${summaryData.upcomingActivities}
${summaryData.weatherConcerns > 0 ? `🌦️ <b>Weather Concerns:</b> ${summaryData.weatherConcerns}` : '☀️ <b>Weather:</b> All clear'}

${summaryData.totalRevenue > 1000 ? '🎉 <i>Great day!</i>' : summaryData.totalRevenue > 500 ? '👍 <i>Good day!</i>' : '📈 <i>Room for improvement</i>'}`

    return await sendTelegramNotificationAction(TELEGRAM_ADMIN_CHAT_ID, message)
  } catch (error) {
    console.error("Error sending daily summary:", error)
    return { isSuccess: false, message: "Failed to send daily summary" }
  }
} 