"use client"

import { useState, useEffect } from "react"
import { QrCode, Download, Calendar, MapPin, Users, Euro } from "lucide-react"
import {
  generateBookingQRCodeAction,
  QRBookingData,
  QRCodeResult
} from "@/actions/qr-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BookingQRTicketProps {
  bookingData: QRBookingData
  className?: string
}

export default function BookingQRTicket({
  bookingData,
  className
}: BookingQRTicketProps) {
  const [qrResult, setQrResult] = useState<QRCodeResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateQRCode()
  }, [bookingData])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await generateBookingQRCodeAction(bookingData)

      if (result.isSuccess) {
        setQrResult(result.data)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Failed to generate QR code")
      console.error("QR generation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrResult) return

    const link = document.createElement("a")
    link.download = `mallorca-ticket-${bookingData.bookingReference}.png`
    link.href = qrResult.qrDataURL
    link.click()
  }

  if (loading) {
    return (
      <Card
        className={`overflow-hidden border-2 ${className}`}
        style={{
          borderColor: "rgba(255, 29, 206, 0.3)",
          backgroundColor: "rgba(255, 29, 206, 0.05)"
        }}
      >
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center">
            <div
              className="size-8 animate-spin rounded-full border-b-2"
              style={{ borderColor: "#ff1dce" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !qrResult) {
    return (
      <Card
        className={`overflow-hidden border-2 ${className}`}
        style={{
          borderColor: "rgba(220, 38, 38, 0.3)",
          backgroundColor: "rgba(220, 38, 38, 0.05)"
        }}
      >
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <QrCode className="mx-auto mb-2 size-8" />
            <p className="text-sm">{error || "Failed to generate ticket"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`overflow-hidden border-2 shadow-xl ${className}`}
      style={{
        borderColor: "rgba(255, 29, 206, 0.4)",
        backgroundColor: "rgba(255, 29, 206, 0.05)",
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 29, 206, 0.1), rgba(255, 245, 70, 0.05))"
      }}
    >
      {/* Ticket Header */}
      <div
        className="border-b border-dashed p-4"
        style={{ borderColor: "rgba(255, 29, 206, 0.2)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255, 29, 206, 0.2)" }}
            >
              <QrCode className="size-4" style={{ color: "#ff1dce" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Mobile Ticket</h3>
              <p className="text-xs text-gray-600">Mallorca Activities</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-green-400 bg-green-50 text-xs text-green-700"
          >
            ✓ Confirmed
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code Section */}
          <div className="text-center">
            <div
              className="inline-block rounded-xl border-2 bg-white p-4"
              style={{ borderColor: "rgba(255, 29, 206, 0.2)" }}
            >
              <img
                src={qrResult.qrDataURL}
                alt={`QR Code for booking ${bookingData.bookingReference}`}
                className="mx-auto size-48"
              />
            </div>
            <p className="mx-auto mt-2 max-w-48 text-xs text-gray-600">
              Show this QR code to staff for instant check-in
            </p>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              className="mt-3 border-pink-400 text-pink-600 hover:bg-pink-50"
            >
              <Download className="mr-2 size-4" />
              Save to Phone
            </Button>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <h4
                className="mb-1 text-lg font-bold"
                style={{ color: "#ff1dce" }}
              >
                {bookingData.activityTitle}
              </h4>
              <p className="font-mono text-sm text-gray-600">
                #{bookingData.bookingReference}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="size-4" style={{ color: "#ff1dce" }} />
                <div>
                  <p className="text-sm font-medium">
                    {bookingData.bookingDate}
                  </p>
                  <p className="text-xs text-gray-600">
                    {bookingData.bookingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="size-4" style={{ color: "#ff1dce" }} />
                <div>
                  <p className="text-sm font-medium">
                    {bookingData.participants} Participant(s)
                  </p>
                  <p className="text-xs text-gray-600">
                    {bookingData.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Euro className="size-4" style={{ color: "#ff1dce" }} />
                <div>
                  <p className="text-sm font-medium">
                    €{bookingData.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Total Amount</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div
              className="mt-6 rounded-lg p-3"
              style={{
                backgroundColor: "rgba(255, 245, 70, 0.1)",
                border: "1px solid rgba(255, 245, 70, 0.3)"
              }}
            >
              <h5
                className="mb-1 text-xs font-semibold"
                style={{ color: "#B45309" }}
              >
                Important:
              </h5>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• Arrive 15 minutes before activity time</li>
                <li>• Present this QR code to staff</li>
                <li>• Keep phone charged for scanning</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Ticket Footer */}
      <div
        className="border-t border-dashed bg-gray-50/50 p-4"
        style={{ borderColor: "rgba(255, 29, 206, 0.2)" }}
      >
        <div className="flex items-center justify-between text-xs text-gray-600">
          <p>🏝️ Mallorca Activities Platform</p>
          <p>Need help? Contact support</p>
        </div>
      </div>
    </Card>
  )
}
