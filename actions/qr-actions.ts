"use server"

import QRCode from 'qrcode'
import { ActionState } from "@/types"

export interface QRBookingData {
  bookingReference: string
  customerName: string
  activityTitle: string
  bookingDate: string
  bookingTime: string
  totalAmount: number
  participants: number
  verificationHash?: string
}

export interface QRCodeResult {
  qrDataURL: string
  qrText: string
  bookingReference: string
}

/**
 * Generate QR code for booking confirmation
 * Contains booking reference and verification data for staff scanning
 */
export async function generateBookingQRCodeAction(
  bookingData: QRBookingData
): Promise<ActionState<QRCodeResult>> {
  try {
    // Create verification hash (simple hash for demo - use proper crypto in production)
    const verificationData = `${bookingData.bookingReference}-${bookingData.customerName}-${bookingData.activityTitle}`
    const verificationHash = btoa(verificationData).slice(0, 8)

    // Create QR code data with structured information
    const qrData = {
      type: "MALLORCA_BOOKING",
      ref: bookingData.bookingReference,
      customer: bookingData.customerName,
      activity: bookingData.activityTitle,
      date: bookingData.bookingDate,
      time: bookingData.bookingTime,
      amount: bookingData.totalAmount,
      participants: bookingData.participants,
      hash: verificationHash,
      timestamp: new Date().toISOString()
    }

    // Convert to JSON string for QR code
    const qrText = JSON.stringify(qrData)

    // Generate QR code as base64 data URL
    const qrDataURL = await QRCode.toDataURL(qrText, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    })

    return {
      isSuccess: true,
      message: "QR code generated successfully",
      data: {
        qrDataURL,
        qrText,
        bookingReference: bookingData.bookingReference
      }
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    return {
      isSuccess: false,
      message: `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Verify QR code data (for staff scanning app)
 */
export async function verifyBookingQRCodeAction(
  qrText: string
): Promise<ActionState<QRBookingData & { isValid: boolean }>> {
  try {
    const qrData = JSON.parse(qrText)
    
    // Verify it's a Mallorca booking QR code
    if (qrData.type !== "MALLORCA_BOOKING") {
      return {
        isSuccess: false,
        message: "Invalid QR code type"
      }
    }

    // Verify hash (simple verification for demo)
    const verificationData = `${qrData.ref}-${qrData.customer}-${qrData.activity}`
    const expectedHash = btoa(verificationData).slice(0, 8)
    const isValid = qrData.hash === expectedHash

    return {
      isSuccess: true,
      message: isValid ? "QR code verified successfully" : "QR code verification failed",
      data: {
        bookingReference: qrData.ref,
        customerName: qrData.customer,
        activityTitle: qrData.activity,
        bookingDate: qrData.date,
        bookingTime: qrData.time,
        totalAmount: qrData.amount,
        participants: qrData.participants,
        verificationHash: qrData.hash,
        isValid
      }
    }
  } catch (error) {
    console.error("Error verifying QR code:", error)
    return {
      isSuccess: false,
      message: "Invalid QR code format"
    }
  }
} 