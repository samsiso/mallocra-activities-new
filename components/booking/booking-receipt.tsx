"use client"

import { format } from "date-fns"
import { Printer, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface BookingReceiptProps {
  booking: {
    reference: string
    date: Date
    activity: {
      title: string
      location: string
      date: string
      time: string
    }
    customer: {
      name: string
      email: string
      phone: string
    }
    participants: {
      adults: number
      children: number
      seniors?: number
    }
    pricing: {
      subtotal: number
      discount?: number
      total: number
      currency: string
    }
    paymentMethod?: string
    specialRequirements?: string
  }
  companyInfo?: {
    name: string
    address: string
    phone: string
    email: string
    website: string
  }
  className?: string
}

export function BookingReceipt({
  booking,
  companyInfo = {
    name: "Mallorca Activities",
    address: "Palma de Mallorca, Spain",
    phone: "+34 600 000 000",
    email: "info@mallorcaactivities.com",
    website: "www.mallorcaactivities.com"
  },
  className
}: BookingReceiptProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log("Downloading receipt...")
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Actions - Hidden in print */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="size-4" />
          Download PDF
        </Button>
      </div>

      {/* Receipt Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-black print:border-0 print:p-0">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {companyInfo.address}
                <br />
                {companyInfo.phone}
                <br />
                {companyInfo.email}
                <br />
                {companyInfo.website}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Booking Receipt</h2>
              <p className="mt-1 text-sm text-gray-600">
                Date: {format(booking.date, "dd/MM/yyyy")}
              </p>
              <p className="mt-2 font-mono text-lg font-bold">
                #{booking.reference}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Customer Details</h3>
            <p className="mt-2 text-sm text-gray-600">
              {booking.customer.name}
              <br />
              {booking.customer.email}
              <br />
              {booking.customer.phone}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Activity Details</h3>
            <p className="mt-2 text-sm text-gray-600">
              {booking.activity.title}
              <br />
              {booking.activity.location}
              <br />
              {booking.activity.date} at {booking.activity.time}
            </p>
          </div>
        </div>

        {/* Participants */}
        <div className="mt-6">
          <h3 className="font-semibold">Participants</h3>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {booking.participants.adults > 0 && (
                <tr>
                  <td className="py-1 text-gray-600">Adults</td>
                  <td className="py-1 text-right">
                    {booking.participants.adults}
                  </td>
                </tr>
              )}
              {booking.participants.children > 0 && (
                <tr>
                  <td className="py-1 text-gray-600">Children</td>
                  <td className="py-1 text-right">
                    {booking.participants.children}
                  </td>
                </tr>
              )}
              {booking.participants.seniors &&
                booking.participants.seniors > 0 && (
                  <tr>
                    <td className="py-1 text-gray-600">Seniors</td>
                    <td className="py-1 text-right">
                      {booking.participants.seniors}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Special Requirements */}
        {booking.specialRequirements && (
          <div className="mt-6">
            <h3 className="font-semibold">Special Requirements</h3>
            <p className="mt-2 text-sm text-gray-600">
              {booking.specialRequirements}
            </p>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <table className="w-full">
            <tbody className="text-sm">
              <tr>
                <td className="py-1">Subtotal</td>
                <td className="py-1 text-right">
                  {booking.pricing.currency}{" "}
                  {booking.pricing.subtotal.toFixed(2)}
                </td>
              </tr>
              {booking.pricing.discount && (
                <tr className="text-green-600">
                  <td className="py-1">Discount</td>
                  <td className="py-1 text-right">
                    -{booking.pricing.currency}{" "}
                    {booking.pricing.discount.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-gray-200 font-semibold">
                <td className="pt-2">Total</td>
                <td className="pt-2 text-right text-lg">
                  {booking.pricing.currency} {booking.pricing.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          {booking.paymentMethod && (
            <p className="mt-2 text-sm text-gray-600">
              Payment Method: {booking.paymentMethod}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>Thank you for your booking!</p>
          <p className="mt-1">
            For any questions, please contact us at {companyInfo.email}
          </p>
        </div>
      </div>
    </div>
  )
}
