"use client"

/*
<ai_context>
Individual Booking Detail Page - Complete booking management interface
Shows full booking details, QR codes for mobile tickets, voucher download,
and options for modification/cancellation. Dark glassmorphism theme.
</ai_context>
*/

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Download,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  QrCode,
  Share2,
  ArrowLeft,
  FileText,
  Star,
  Info,
  Smartphone,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getBookingByIdAction } from "@/actions/db/bookings-actions"
import QRCode from "qrcode"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// Glassmorphism card component
function GlassCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

// QR Code component
function BookingQRCode({ bookingReference }: { bookingReference: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          bookingRef: bookingReference,
          type: "mallorca-activities-booking",
          url: `${window.location.origin}/booking/${bookingReference}`
        })
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }
    generateQR()
  }, [bookingReference])

  return (
    <GlassCard className="text-center">
      <div className="mb-4">
        <QrCode className="mx-auto size-8 text-yellow-400" />
        <h3 className="mt-2 text-lg font-bold text-white">Mobile Ticket</h3>
        <p className="text-sm text-white/70">Scan to show your booking</p>
      </div>

      {qrCodeUrl && (
        <div className="mx-auto w-fit rounded-lg bg-white p-4">
          <Image
            src={qrCodeUrl}
            alt="Booking QR Code"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
          onClick={() => {
            if (qrCodeUrl) {
              const link = document.createElement("a")
              link.download = `mallorca-ticket-${bookingReference}.png`
              link.href = qrCodeUrl
              link.click()
            }
          }}
        >
          <Smartphone className="mr-2 size-4" />
          Save to Phone
        </Button>
      </div>
    </GlassCard>
  )
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          className: "bg-green-500/20 border-green-500/30 text-green-400",
          icon: CheckCircle
        }
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
          icon: AlertCircle
        }
      case "completed":
        return {
          label: "Completed",
          className: "bg-blue-500/20 border-blue-500/30 text-blue-400",
          icon: CheckCircle
        }
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-500/20 border-red-500/30 text-red-400",
          icon: X
        }
      default:
        return {
          label: "Unknown",
          className: "bg-gray-500/20 border-gray-500/30 text-gray-400",
          icon: AlertCircle
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge className={`border px-3 py-1 font-medium ${config.className}`}>
      <Icon className="mr-2 size-4" />
      {config.label}
    </Badge>
  )
}

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const voucherRef = useRef<HTMLDivElement>(null)

  // Mock booking data - in real app would fetch from database
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Try to fetch from database first
        const result = await getBookingByIdAction(bookingId)
        if (result.isSuccess && result.data) {
          setBooking(result.data)
        } else {
          // Fallback to mock data for demo
          setBooking({
            id: bookingId,
            bookingReference: bookingId.slice(0, 8).toUpperCase(),
            status: "confirmed",
            activityTitle: "Scenic Mallorca Helicopter Tour",
            activityLocation: "Palma de Mallorca Airport",
            activityImage:
              "https://images.unsplash.com/photo-1544717304-a2db4a3d16c6?w=800&h=600&fit=crop",
            bookingDate: "2025-02-15",
            bookingTime: "10:30",
            duration: "45 minutes",
            adults: 2,
            children: 0,
            totalParticipants: 2,
            totalAmount: 358,
            currency: "EUR",
            leadCustomerName: "John Doe",
            leadCustomerEmail: "john.doe@example.com",
            leadCustomerPhone: "+34 123 456 789",
            specialRequirements: "Window seats preferred",
            confirmationSentAt: "2025-01-25T10:00:00Z",
            createdAt: "2025-01-25T09:30:00Z",
            paymentStatus: "paid",
            paymentMethod: "card"
          })
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        // Set mock data on error
        setBooking({
          id: bookingId,
          bookingReference: bookingId.slice(0, 8).toUpperCase(),
          status: "confirmed",
          activityTitle: "Scenic Mallorca Helicopter Tour",
          activityLocation: "Palma de Mallorca Airport",
          activityImage:
            "https://images.unsplash.com/photo-1544717304-a2db4a3d16c6?w=800&h=600&fit=crop",
          bookingDate: "2025-02-15",
          bookingTime: "10:30",
          duration: "45 minutes",
          adults: 2,
          children: 0,
          totalParticipants: 2,
          totalAmount: 358,
          currency: "EUR",
          leadCustomerName: "John Doe",
          leadCustomerEmail: "john.doe@example.com",
          leadCustomerPhone: "+34 123 456 789",
          specialRequirements: "Window seats preferred",
          confirmationSentAt: "2025-01-25T10:00:00Z",
          createdAt: "2025-01-25T09:30:00Z",
          paymentStatus: "paid",
          paymentMethod: "card"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const downloadVoucher = async () => {
    if (!voucherRef.current || !booking) return

    try {
      const canvas = await html2canvas(voucherRef.current, {
        backgroundColor: "#1f2937",
        scale: 2
      })

      const pdf = new jsPDF()
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      )
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        )
        heightLeft -= pageHeight
      }

      pdf.save(`mallorca-voucher-${booking.bookingReference}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-yellow-400"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <GlassCard className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-400" />
          <h1 className="mb-2 text-2xl font-bold text-white">
            Booking Not Found
          </h1>
          <p className="mb-6 text-white/70">
            We couldn't find a booking with ID: {bookingId}
          </p>
          <Link href="/bookings">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              View All Bookings
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/bookings">
            <Button
              variant="outline"
              className="mb-4 border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Bookings
            </Button>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white lg:text-4xl">
                Booking Details
              </h1>
              <p className="text-white/70">
                Reference: {booking.bookingReference}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Activity Information */}
            <GlassCard>
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48">
                  <Image
                    src={booking.activityImage}
                    alt={booking.activityTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="mb-3 text-2xl font-bold text-white">
                    {booking.activityTitle}
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="size-4 text-yellow-400" />
                      <span className="text-sm">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="size-4 text-yellow-400" />
                      <span className="text-sm">{booking.bookingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="size-4 text-yellow-400" />
                      <span className="text-sm">
                        {booking.activityLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="size-4 text-yellow-400" />
                      <span className="text-sm">
                        {booking.totalParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Customer Information */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Customer Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <Users className="size-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Lead Customer</p>
                    <p className="font-medium text-white">
                      {booking.leadCustomerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <Mail className="size-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium text-white">
                      {booking.leadCustomerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <Phone className="size-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Phone</p>
                    <p className="font-medium text-white">
                      {booking.leadCustomerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <Users className="size-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Group Size</p>
                    <p className="font-medium text-white">
                      {booking.adults} adults
                      {booking.children > 0 && `, ${booking.children} children`}
                    </p>
                  </div>
                </div>
              </div>

              {booking.specialRequirements && (
                <>
                  <Separator className="my-4 bg-white/20" />
                  <div>
                    <h4 className="mb-2 font-medium text-white">
                      Special Requirements
                    </h4>
                    <p className="text-sm text-white/80">
                      {booking.specialRequirements}
                    </p>
                  </div>
                </>
              )}
            </GlassCard>

            {/* Payment Information */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Payment Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Payment Status</span>
                  <Badge
                    className={cn(
                      "border",
                      booking.paymentStatus === "paid"
                        ? "border-green-500/30 bg-green-500/20 text-green-400"
                        : "border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
                    )}
                  >
                    <CreditCard className="mr-2 size-3" />
                    {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Payment Method</span>
                  <span className="font-medium capitalize text-white">
                    {booking.paymentMethod}
                  </span>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-yellow-400">
                    €{booking.totalAmount}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Booking Actions
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={downloadVoucher}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600"
                >
                  <Download className="mr-2 size-4" />
                  Download Voucher
                </Button>

                <Link href={`/booking/${booking.id}/modify`}>
                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                    disabled={
                      booking.status === "cancelled" ||
                      booking.status === "completed"
                    }
                  >
                    <Edit className="mr-2 size-4" />
                    Modify Booking
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Share2 className="mr-2 size-4" />
                  Share Booking
                </Button>

                <Link href={`/booking/${booking.id}/cancel`}>
                  <Button
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    disabled={
                      booking.status === "cancelled" ||
                      booking.status === "completed"
                    }
                  >
                    <X className="mr-2 size-4" />
                    Cancel Booking
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* QR Code */}
            <BookingQRCode bookingReference={booking.bookingReference} />

            {/* Quick Info */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">Quick Info</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Booking ID</span>
                  <span className="font-mono text-white">
                    {booking.bookingReference}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Booked</span>
                  <span className="text-white">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Duration</span>
                  <span className="text-white">{booking.duration}</span>
                </div>

                {booking.confirmationSentAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Confirmed</span>
                    <span className="text-white">
                      {new Date(
                        booking.confirmationSentAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Help & Support */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">Need Help?</h3>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Phone className="mr-2 size-4" />
                  Call Support
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Mail className="mr-2 size-4" />
                  Email Support
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Info className="mr-2 size-4" />
                  FAQ
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Hidden voucher for PDF generation */}
        <div ref={voucherRef} className="hidden">
          <div
            className="bg-gray-900 p-8 text-white"
            style={{ width: "800px" }}
          >
            <div className="mb-6 border-b border-white/20 pb-6">
              <h1 className="mb-2 text-3xl font-bold text-yellow-400">
                Mallorca Activities
              </h1>
              <h2 className="text-xl font-bold">Booking Voucher</h2>
              <p className="text-white/70">
                Reference: {booking.bookingReference}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-8">
              <div>
                <h3 className="mb-4 font-bold">Activity Details</h3>
                <p>
                  <strong>Activity:</strong> {booking.activityTitle}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(booking.bookingDate)}
                </p>
                <p>
                  <strong>Time:</strong> {booking.bookingTime}
                </p>
                <p>
                  <strong>Location:</strong> {booking.activityLocation}
                </p>
                <p>
                  <strong>Duration:</strong> {booking.duration}
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-bold">Customer Details</h3>
                <p>
                  <strong>Name:</strong> {booking.leadCustomerName}
                </p>
                <p>
                  <strong>Email:</strong> {booking.leadCustomerEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.leadCustomerPhone}
                </p>
                <p>
                  <strong>Participants:</strong> {booking.adults} adults
                  {booking.children > 0 && `, ${booking.children} children`}
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    Total: €{booking.totalAmount}
                  </p>
                  <p className="text-white/70">Status: {booking.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
