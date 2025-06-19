"use client"

import { useState } from "react"
import BookingQRTicket from "@/components/qr/booking-qr-ticket"
import { QRBookingData } from "@/actions/qr-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Sample booking data for testing
const sampleBookings: QRBookingData[] = [
  {
    bookingReference: "MAL-2024-001",
    customerName: "John Smith",
    activityTitle: "Catamaran Sunset Cruise",
    bookingDate: "2024-02-15",
    bookingTime: "18:00",
    totalAmount: 75.0,
    participants: 2
  },
  {
    bookingReference: "MAL-2024-002",
    customerName: "Maria Garcia",
    activityTitle: "Hiking in Serra de Tramuntana",
    bookingDate: "2024-02-16",
    bookingTime: "09:00",
    totalAmount: 45.0,
    participants: 1
  },
  {
    bookingReference: "MAL-2024-003",
    customerName: "Hans Mueller",
    activityTitle: "Cultural Tour of Palma",
    bookingDate: "2024-02-17",
    bookingTime: "10:30",
    totalAmount: 35.0,
    participants: 4
  }
]

export default function TestQRPage() {
  const [selectedBooking, setSelectedBooking] = useState<QRBookingData>(
    sampleBookings[0]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-white hover:text-pink-400"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <Badge
              className="mb-4 px-6 py-2 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(to right, #ff1dce, #dc2626)"
              }}
            >
              🎫 QR Code Demo
            </Badge>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Mobile QR Tickets
            </h1>
            <p className="text-lg text-gray-300">
              Professional mobile tickets with QR codes for instant check-in
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking Selection */}
          <div className="lg:col-span-1">
            <Card
              style={{
                backgroundColor: "rgba(255, 29, 206, 0.05)",
                borderColor: "rgba(255, 29, 206, 0.3)"
              }}
            >
              <CardHeader>
                <CardTitle className="text-white">Select Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleBookings.map(booking => (
                    <Button
                      key={booking.bookingReference}
                      variant={
                        selectedBooking.bookingReference ===
                        booking.bookingReference
                          ? "default"
                          : "outline"
                      }
                      className={`h-auto w-full justify-start p-4 ${
                        selectedBooking.bookingReference ===
                        booking.bookingReference
                          ? "border-pink-600 bg-pink-600 hover:bg-pink-700"
                          : "border-pink-400/50 text-white hover:bg-pink-500/20"
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold">
                          {booking.activityTitle}
                        </div>
                        <div className="text-xs opacity-80">
                          #{booking.bookingReference}
                        </div>
                        <div className="text-xs opacity-80">
                          {booking.bookingDate} at {booking.bookingTime}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card
              className="mt-6"
              style={{
                backgroundColor: "rgba(255, 245, 70, 0.05)",
                borderColor: "rgba(255, 245, 70, 0.3)"
              }}
            >
              <CardHeader>
                <CardTitle className="text-white">✨ Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span>Instant QR generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span>Downloadable to phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span>Professional design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span>Verification hash security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span>Works offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Ticket Display */}
          <div className="lg:col-span-2">
            <BookingQRTicket bookingData={selectedBooking} />

            {/* Instructions */}
            <Card
              className="mt-6"
              style={{
                backgroundColor: "rgba(255, 29, 206, 0.05)",
                borderColor: "rgba(255, 29, 206, 0.3)"
              }}
            >
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold text-white">
                  🏝️ How It Works
                </h3>
                <div className="grid gap-4 text-sm text-gray-300 md:grid-cols-3">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255, 29, 206, 0.2)" }}
                    >
                      <span className="font-bold text-white">1</span>
                    </div>
                    <p>
                      <strong className="text-white">Book Activity</strong>
                      <br />
                      Customer completes booking
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255, 29, 206, 0.2)" }}
                    >
                      <span className="font-bold text-white">2</span>
                    </div>
                    <p>
                      <strong className="text-white">Get QR Ticket</strong>
                      <br />
                      Instant mobile ticket generated
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255, 29, 206, 0.2)" }}
                    >
                      <span className="font-bold text-white">3</span>
                    </div>
                    <p>
                      <strong className="text-white">Easy Check-in</strong>
                      <br />
                      Staff scans QR for verification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
