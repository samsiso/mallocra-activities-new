import { NextRequest, NextResponse } from "next/server"
import {
  sendTelegramAdminBookingAlertAction,
  sendTelegramPaymentFailureAlertAction,
  sendTelegramCancellationAlertAction,
  sendTelegramBadReviewAlertAction,
  sendTelegramWeatherAlertAction,
  sendTelegramCapacityWarningAction,
  sendTelegramCustomerInquiryAction,
  sendTelegramDailySummaryAction
} from "@/actions/notifications/telegram-notifications"

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    let result

    switch (type) {
      case "booking":
        result = await sendTelegramAdminBookingAlertAction({
          customerName: "John Test Smith",
          customerEmail: "john.test@example.com",
          customerPhone: "+34 123 456 789",
          activityTitle: "Sunset Sailing Experience",
          bookingDate: "2025-01-30",
          bookingTime: "18:00",
          bookingReference: "MAL-123456-TEST",
          totalAmount: 150.0,
          participantCount: 4
        })
        break

      case "payment-failure":
        result = await sendTelegramPaymentFailureAlertAction({
          customerName: "Jane Test Smith",
          customerEmail: "jane.test@example.com",
          activityTitle: "Catamaran Adventure",
          amount: 280.0,
          bookingReference: "MAL-789012-TEST",
          errorMessage: "Card declined - insufficient funds"
        })
        break

      case "cancellation":
        result = await sendTelegramCancellationAlertAction({
          customerName: "Bob Test Wilson",
          activityTitle: "Scuba Diving Experience",
          bookingDate: "2025-01-28",
          bookingTime: "09:00",
          refundAmount: 180.0,
          bookingReference: "MAL-345678-TEST",
          reason: "Family emergency - cannot travel"
        })
        break

      case "bad-review":
        result = await sendTelegramBadReviewAlertAction({
          customerName: "Alice Test Brown",
          activityTitle: "Helicopter Tour",
          rating: 2,
          comment:
            "The tour was cancelled due to weather but no alternative was offered. Very disappointing experience and poor customer service.",
          bookingReference: "MAL-901234-TEST",
          reviewDate: "2025-01-25"
        })
        break

      case "weather":
        result = await sendTelegramWeatherAlertAction({
          activityTitle: "Mountain Hiking Adventure",
          date: "2025-01-26",
          time: "08:00",
          weatherCondition: "Heavy rain and strong winds",
          risk: "high",
          affectedBookings: 12,
          recommendation: "Cancel or reschedule for safety"
        })
        break

      case "capacity":
        result = await sendTelegramCapacityWarningAction({
          activityTitle: "Boat Trip to Es Vedra",
          date: "2025-01-27",
          time: "14:00",
          currentBookings: 23,
          maxCapacity: 25,
          percentageFull: 92
        })
        break

      case "inquiry":
        result = await sendTelegramCustomerInquiryAction({
          customerName: "Maria Test Garcia",
          customerEmail: "maria.test@example.com",
          customerPhone: "+34 987 654 321",
          activityTitle: "Private Yacht Charter",
          preferredDate: "2025-02-10",
          message:
            "Hi, I'm looking to book a private yacht for my anniversary. Do you have availability for 6 people? What's included?",
          urgency: "normal"
        })
        break

      case "daily-summary":
        result = await sendTelegramDailySummaryAction({
          date: new Date().toLocaleDateString(),
          totalRevenue: 2450.0,
          totalBookings: 18,
          newCustomers: 7,
          cancellations: 2,
          averageRating: 4.6,
          upcomingActivities: 12,
          weatherConcerns: 1
        })
        break

      // NEW: Integration verification tests
      case "integration-test":
        // Test all critical business event integrations
        const integrationResults = []

        // Test 1: Verify booking notification works (simulates successful booking)
        try {
          const bookingTest = await sendTelegramAdminBookingAlertAction({
            customerName: "Integration Test Customer",
            customerEmail: "test@integration.com",
            customerPhone: "+34 000 000 000",
            activityTitle: "Integration Test Activity",
            bookingDate: new Date().toLocaleDateString(),
            bookingTime: "12:00",
            bookingReference: "INT-TEST-001",
            totalAmount: 99.99,
            participantCount: 2
          })
          integrationResults.push({
            test: "Booking Notification",
            status: bookingTest.isSuccess ? "PASS" : "FAIL",
            message: bookingTest.message
          })
        } catch (error) {
          integrationResults.push({
            test: "Booking Notification",
            status: "ERROR",
            message: String(error)
          })
        }

        // Test 2: Verify payment failure notification works (simulates payment webhook)
        try {
          const paymentTest = await sendTelegramPaymentFailureAlertAction({
            customerName: "Integration Test Customer",
            customerEmail: "test@integration.com",
            activityTitle: "Integration Test Activity",
            amount: 99.99,
            bookingReference: "INT-TEST-001",
            errorMessage: "Integration test payment failure"
          })
          integrationResults.push({
            test: "Payment Failure Alert",
            status: paymentTest.isSuccess ? "PASS" : "FAIL",
            message: paymentTest.message
          })
        } catch (error) {
          integrationResults.push({
            test: "Payment Failure Alert",
            status: "ERROR",
            message: String(error)
          })
        }

        // Test 3: Verify cancellation notification works (simulates booking cancellation)
        try {
          const cancellationTest = await sendTelegramCancellationAlertAction({
            customerName: "Integration Test Customer",
            activityTitle: "Integration Test Activity",
            bookingDate: new Date().toLocaleDateString(),
            bookingTime: "12:00",
            refundAmount: 99.99,
            bookingReference: "INT-TEST-001",
            reason: "Integration test cancellation"
          })
          integrationResults.push({
            test: "Cancellation Alert",
            status: cancellationTest.isSuccess ? "PASS" : "FAIL",
            message: cancellationTest.message
          })
        } catch (error) {
          integrationResults.push({
            test: "Cancellation Alert",
            status: "ERROR",
            message: String(error)
          })
        }

        // Test 4: Verify bad review notification works (simulates 1-star review)
        try {
          const reviewTest = await sendTelegramBadReviewAlertAction({
            customerName: "Integration Test Customer",
            activityTitle: "Integration Test Activity",
            rating: 1,
            comment:
              "Integration test bad review - this should trigger admin notification",
            bookingReference: "INT-TEST-001",
            reviewDate: new Date().toLocaleDateString()
          })
          integrationResults.push({
            test: "Bad Review Alert",
            status: reviewTest.isSuccess ? "PASS" : "FAIL",
            message: reviewTest.message
          })
        } catch (error) {
          integrationResults.push({
            test: "Bad Review Alert",
            status: "ERROR",
            message: String(error)
          })
        }

        return NextResponse.json({
          success: true,
          message: "Integration test completed",
          data: {
            testsRun: integrationResults.length,
            passed: integrationResults.filter(r => r.status === "PASS").length,
            failed: integrationResults.filter(r => r.status === "FAIL").length,
            errors: integrationResults.filter(r => r.status === "ERROR").length,
            results: integrationResults
          }
        })

      default:
        return NextResponse.json(
          {
            error:
              "Invalid notification type. Use: booking, payment-failure, cancellation, bad-review, weather, capacity, inquiry, daily-summary, integration-test"
          },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.isSuccess,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    console.error("Test notification error:", error)
    return NextResponse.json(
      { error: "Failed to send test notification", details: String(error) },
      { status: 500 }
    )
  }
}
