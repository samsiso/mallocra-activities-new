import { Resend } from "resend"

// Initialize Resend with error handling
let resend: Resend | null = null

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  } else {
    console.warn(
      "RESEND_API_KEY not found - email functionality will be disabled"
    )
  }
} catch (error) {
  console.error("Error initializing Resend:", error)
}

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || "bookings@mallocra-activities.com",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Mallorca Activities",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  isEmailEnabled: !!process.env.RESEND_API_KEY
}

// Email service functions
export const emailService = {
  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation({
    to,
    bookingData
  }: {
    to: string
    bookingData: {
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
  }) {
    try {
      // Check if email is enabled
      if (!resend || !EMAIL_CONFIG.isEmailEnabled) {
        console.warn(
          "Email functionality disabled - RESEND_API_KEY not configured"
        )
        return {
          success: true,
          message: "Email functionality is currently disabled",
          data: { id: "email-disabled" }
        }
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: [to],
        subject: `Booking Confirmed: ${bookingData.activityTitle} - ${bookingData.bookingReference}`,
        html: generateBookingConfirmationHTML(bookingData),
        text: generateBookingConfirmationText(bookingData)
      })

      if (error) {
        console.error("Error sending booking confirmation email:", error)
        return { success: false, error: error.message }
      }

      console.log("Booking confirmation email sent successfully:", data)
      return { success: true, data }
    } catch (error) {
      console.error("Error in sendBookingConfirmation:", error)
      return { success: false, error: "Failed to send email" }
    }
  },

  /**
   * Send booking reminder email (future feature)
   */
  async sendBookingReminder({
    to,
    bookingData
  }: {
    to: string
    bookingData: any
  }) {
    // Check if email is enabled
    if (!resend || !EMAIL_CONFIG.isEmailEnabled) {
      console.warn(
        "Email functionality disabled - RESEND_API_KEY not configured"
      )
      return {
        success: true,
        message: "Email functionality is currently disabled",
        data: { id: "email-disabled" }
      }
    }

    // Implementation for booking reminders
    console.log("Booking reminder feature coming soon")
    return { success: true, message: "Feature coming soon" }
  }
}

/**
 * Generate HTML email template for booking confirmation
 */
function generateBookingConfirmationHTML(booking: any): string {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - ${EMAIL_CONFIG.appName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          background: white;
          padding: 40px 30px;
        }
        .booking-ref {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #333;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
          font-weight: bold;
          font-size: 18px;
        }
        .details-grid {
          display: grid;
          gap: 15px;
          margin: 30px 0;
        }
        .detail-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .detail-label {
          font-weight: bold;
          color: #667eea;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .detail-value {
          font-size: 16px;
          color: #333;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .contact-info {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2196f3;
        }
        ${
          booking.isGuestBooking
            ? `
        .guest-notice {
          background: #fff3cd;
          color: #856404;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        `
            : ""
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Your Mallorca adventure is all set and ready to go</p>
        </div>
        
        <div class="content">
          <h2>Hello ${booking.leadCustomerName}!</h2>
          <p>Great news! Your booking for <strong>${booking.activityTitle}</strong> has been confirmed and is ready for your amazing Mallorca experience.</p>
          
          <div class="booking-ref">
            <div class="detail-label">Booking Reference</div>
            <div style="font-size: 24px; margin-top: 5px;">${booking.bookingReference}</div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">Save this reference number for your records</div>
          </div>

          ${
            booking.isGuestBooking
              ? `
          <div class="guest-notice">
            <strong>Guest Booking Confirmed</strong><br>
            Your booking is confirmed! To easily manage future bookings and receive updates, 
            <a href="${EMAIL_CONFIG.appUrl}/signup" style="color: #856404; text-decoration: underline;">create an account</a> 
            using the same email address.
          </div>
          `
              : ""
          }
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">📅 Date</div>
              <div class="detail-value">${formatDate(booking.bookingDate)}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">🕒 Time</div>
              <div class="detail-value">${booking.bookingTime}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">👥 Participants</div>
              <div class="detail-value">${booking.totalParticipants} people</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">💰 Total Amount</div>
              <div class="detail-value">€${booking.totalAmount}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">📧 Contact Email</div>
              <div class="detail-value">${booking.leadCustomerEmail}</div>
            </div>
            
            ${
              booking.leadCustomerPhone
                ? `
            <div class="detail-item">
              <div class="detail-label">📱 Contact Phone</div>
              <div class="detail-value">${booking.leadCustomerPhone}</div>
            </div>
            `
                : ""
            }
            
            ${
              booking.specialRequirements
                ? `
            <div class="detail-item">
              <div class="detail-label">📝 Special Requirements</div>
              <div class="detail-value">${booking.specialRequirements}</div>
            </div>
            `
                : ""
            }
          </div>
          
          <div style="text-align: center;">
            <a href="${EMAIL_CONFIG.appUrl}/booking/${booking.bookingReference}" class="cta-button">
              View Full Booking Details
            </a>
          </div>
          
          <div class="contact-info">
            <strong>Need Help?</strong><br>
            Contact us at <a href="mailto:bookings@mallocra-activities.com">bookings@mallocra-activities.com</a> 
            or WhatsApp us for immediate assistance.<br>
            <small>We're here to make your Mallorca experience unforgettable!</small>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>${EMAIL_CONFIG.appName}</strong></p>
          <p>Your Premier Mallorca Adventure Platform</p>
          <p>
            <a href="${EMAIL_CONFIG.appUrl}" style="color: #667eea;">Visit Website</a> | 
            <a href="${EMAIL_CONFIG.appUrl}/activities" style="color: #667eea;">Explore Activities</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate plain text email for booking confirmation
 */
function generateBookingConfirmationText(booking: any): string {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return `
🎉 BOOKING CONFIRMED - ${EMAIL_CONFIG.appName}

Hello ${booking.leadCustomerName}!

Great news! Your booking for ${booking.activityTitle} has been confirmed.

BOOKING REFERENCE: ${booking.bookingReference}
(Save this reference number for your records)

BOOKING DETAILS:
📅 Date: ${formatDate(booking.bookingDate)}
🕒 Time: ${booking.bookingTime}
👥 Participants: ${booking.totalParticipants} people
💰 Total Amount: €${booking.totalAmount}
📧 Contact Email: ${booking.leadCustomerEmail}
${booking.leadCustomerPhone ? `📱 Contact Phone: ${booking.leadCustomerPhone}` : ""}
${booking.specialRequirements ? `📝 Special Requirements: ${booking.specialRequirements}` : ""}

${
  booking.isGuestBooking
    ? `
GUEST BOOKING NOTICE:
Your booking is confirmed! To easily manage future bookings and receive updates, 
create an account at ${EMAIL_CONFIG.appUrl}/signup using the same email address.
`
    : ""
}

View your full booking details: ${EMAIL_CONFIG.appUrl}/booking/${booking.bookingReference}

NEED HELP?
Contact us at bookings@mallocra-activities.com or WhatsApp us for immediate assistance.

${EMAIL_CONFIG.appName} - Your Premier Mallorca Adventure Platform
Visit: ${EMAIL_CONFIG.appUrl}
  `.trim()
}
