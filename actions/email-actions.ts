"use server"

import { emailService, EMAIL_CONFIG } from "@/lib/email"
import { ActionState } from "@/types"

export interface BookingEmailData {
  bookingReference: string
  activityTitle: string
  bookingDate: string
  bookingTime: string
  totalParticipants: number
  totalAmount: number
  leadCustomerName: string
  leadCustomerEmail: string
  leadCustomerPhone?: string
  specialRequirements?: string
  isGuestBooking: boolean
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmailAction(
  emailData: BookingEmailData
): Promise<ActionState<{ emailId: string; emailDisabled?: boolean }>> {
  try {
    // Validate required fields
    if (!emailData.leadCustomerEmail) {
      return {
        isSuccess: false,
        message: "Email address is required"
      }
    }

    if (!emailData.bookingReference) {
      return {
        isSuccess: false,
        message: "Booking reference is required"
      }
    }

    // Check if email is enabled
    if (!EMAIL_CONFIG.isEmailEnabled) {
      console.log("Email functionality is disabled - booking will proceed without email confirmation")
      return {
        isSuccess: true,
        message: "Booking completed successfully (email confirmation is currently disabled)",
        data: { emailId: "email-disabled", emailDisabled: true }
      }
    }

    // Send the email
    const result = await emailService.sendBookingConfirmation({
      to: emailData.leadCustomerEmail,
      bookingData: emailData
    })

    if (!result.success) {
      // Don't fail the booking if email fails, just log it
      console.error("Email failed but booking succeeded:", result.error)
      return {
        isSuccess: true,
        message: "Booking completed successfully (email confirmation failed to send)",
        data: { emailId: "email-failed", emailDisabled: false }
      }
    }

    return {
      isSuccess: true,
      message: "Booking confirmation email sent successfully",
      data: { emailId: result.data?.id || "unknown", emailDisabled: false }
    }
  } catch (error) {
    console.error("Error in sendBookingConfirmationEmailAction:", error)
    // Don't fail the booking if email fails
    return {
      isSuccess: true,
      message: "Booking completed successfully (email service error)",
      data: { emailId: "email-error", emailDisabled: true }
    }
  }
}

/**
 * Send booking reminder email (future feature)
 */
export async function sendBookingReminderEmailAction(
  emailData: BookingEmailData
): Promise<ActionState<{ emailId: string }>> {
  try {
    // Future implementation for booking reminders
    return {
      isSuccess: true,
      message: "Booking reminder feature coming soon",
      data: { emailId: "feature-coming-soon" }
    }
  } catch (error) {
    console.error("Error in sendBookingReminderEmailAction:", error)
    return {
      isSuccess: false,
      message: "Failed to send reminder email"
    }
  }
}

/**
 * Test email configuration (for development)
 */
export async function testEmailConfigAction(): Promise<ActionState<{ status: string }>> {
  try {
    // Check if environment variables are set
    const missingVars = []
    
    if (!process.env.RESEND_API_KEY) {
      missingVars.push("RESEND_API_KEY")
    }
    
    if (!process.env.RESEND_FROM_EMAIL) {
      missingVars.push("RESEND_FROM_EMAIL")
    }

    if (missingVars.length > 0) {
      return {
        isSuccess: false,
        message: `Missing environment variables: ${missingVars.join(", ")}. Email functionality is disabled.`
      }
    }

    // Send a test email to validate configuration
    const testBookingData: BookingEmailData = {
      bookingReference: "TEST-2025-001",
      activityTitle: "Test Activity - Email Configuration",
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: "10:00",
      totalParticipants: 2,
      totalAmount: 100,
      leadCustomerName: "Test User",
      leadCustomerEmail: process.env.RESEND_FROM_EMAIL || "test@example.com",
      leadCustomerPhone: "+34 123 456 789",
      specialRequirements: "This is a test email to verify configuration",
      isGuestBooking: true
    }

    const result = await emailService.sendBookingConfirmation({
      to: process.env.RESEND_FROM_EMAIL || "test@example.com",
      bookingData: testBookingData
    })

    if (!result.success) {
      return {
        isSuccess: false,
        message: `Email test failed: ${result.error}`
      }
    }

    return {
      isSuccess: true,
      message: "Email configuration test successful",
      data: { status: "Email sent successfully" }
    }
  } catch (error) {
    console.error("Error in testEmailConfigAction:", error)
    return {
      isSuccess: false,
      message: "Email configuration test failed"
    }
  }
}

/**
 * Check email configuration status
 */
export async function checkEmailConfigAction(): Promise<ActionState<{ 
  emailEnabled: boolean; 
  missingVars: string[]; 
  status: string 
}>> {
  try {
    const missingVars = []
    
    if (!process.env.RESEND_API_KEY) {
      missingVars.push("RESEND_API_KEY")
    }
    
    if (!process.env.RESEND_FROM_EMAIL) {
      missingVars.push("RESEND_FROM_EMAIL")
    }

    const emailEnabled = missingVars.length === 0

    return {
      isSuccess: true,
      message: emailEnabled 
        ? "Email configuration is complete" 
        : "Email configuration is incomplete",
      data: {
        emailEnabled,
        missingVars,
        status: emailEnabled 
          ? "Email functionality is enabled" 
          : `Missing: ${missingVars.join(", ")}`
      }
    }
  } catch (error) {
    console.error("Error checking email configuration:", error)
    return {
      isSuccess: false,
      message: "Failed to check email configuration"
    }
  }
} 