"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Users,
  AlertTriangle,
  XCircle,
  Star,
  Calendar
} from "lucide-react"
import { useEffect, useState } from "react"
import { getOperationalDataAction } from "@/actions/db/dashboard-actions"

interface OperationalData {
  upcomingBookings: Array<{
    id: string
    activityTitle: string
    customerName: string
    time: string
    participants: number
    status: string
    specialRequirements?: string
  }>
  activityAlerts: Array<{
    id: string
    type: "availability" | "weather" | "rating"
    title: string
    description: string
    severity: "low" | "medium" | "high"
    activityTitle: string
  }>
  recentCancellations: Array<{
    id: string
    activityTitle: string
    customerName: string
    reason: string
    amount: number
    cancelledAt: string
  }>
}

export default function OperationalCommandCenter() {
  const [data, setData] = useState<OperationalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getOperationalDataAction()
        if (result.isSuccess) {
          setData(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Failed to load operational data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-6">
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader className="pb-2">
                <div className="h-4 animate-pulse rounded bg-gray-700"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-16 animate-pulse rounded bg-gray-700"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              {error || "Failed to load operational data"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900 text-red-100 border-red-700"
      case "medium":
        return "bg-yellow-900 text-yellow-100 border-yellow-700"
      case "low":
        return "bg-blue-900 text-blue-100 border-blue-700"
      default:
        return "bg-gray-900 text-gray-100 border-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-900 text-green-100"
      case "pending":
        return "bg-yellow-900 text-yellow-100"
      case "cancelled":
        return "bg-red-900 text-red-100"
      default:
        return "bg-gray-900 text-gray-100"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column - Booking Operations */}
      <div className="space-y-6">
        {/* Upcoming Bookings */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-100">
              <Calendar className="size-5 text-orange-500" />
              <span>Next 24 Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingBookings.length > 0 ? (
                data.upcomingBookings.map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-3"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">
                          {booking.activityTitle}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="size-3" />
                          <span>{booking.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="size-3" />
                          <span>{booking.participants} guests</span>
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-300">
                        {booking.customerName}
                      </div>
                      {booking.specialRequirements && (
                        <div className="mt-1 text-xs text-orange-400">
                          Special: {booking.specialRequirements}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400">
                  No upcoming bookings in the next 24 hours
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cancellations */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-100">
              <XCircle className="size-5 text-red-500" />
              <span>Recent Cancellations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentCancellations.length > 0 ? (
                data.recentCancellations.map(cancellation => (
                  <div
                    key={cancellation.id}
                    className="rounded-lg border border-gray-700 bg-gray-900 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">
                        {cancellation.activityTitle}
                      </h4>
                      <span className="text-sm font-medium text-red-400">
                        €{cancellation.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1 text-xs text-gray-300">
                      {cancellation.customerName}
                    </div>
                    <div className="mb-1 text-xs text-gray-400">
                      Cancelled: {cancellation.cancelledAt}
                    </div>
                    <div className="text-xs text-orange-400">
                      Reason: {cancellation.reason}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400">
                  No recent cancellations
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Activity Management */}
      <div className="space-y-6">
        {/* Activity Alerts */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-100">
              <AlertTriangle className="size-5 text-orange-500" />
              <span>Activity Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.activityAlerts.length > 0 ? (
                data.activityAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-3 ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {alert.type === "rating" && <Star className="size-4" />}
                        {alert.type === "availability" && (
                          <Users className="size-4" />
                        )}
                        {alert.type === "weather" && (
                          <AlertTriangle className="size-4" />
                        )}
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          alert.severity === "high"
                            ? "border-red-500 text-red-400"
                            : alert.severity === "medium"
                              ? "border-yellow-500 text-yellow-400"
                              : "border-blue-500 text-blue-400"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="mb-1 text-xs opacity-90">
                      {alert.description}
                    </div>
                    <div className="text-xs opacity-75">
                      Activity: {alert.activityTitle}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400">
                  No activity alerts at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
