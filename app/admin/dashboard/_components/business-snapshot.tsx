"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertCircle,
  Euro
} from "lucide-react"
import { useEffect, useState } from "react"
import { getBusinessSnapshotAction } from "@/actions/db/dashboard-actions"

interface BusinessSnapshotData {
  todayRevenue: { amount: number; target: number; growth: number }
  todayBookings: { total: number; confirmed: number; pending: number }
  activeUsers: { total: number; customers: number; operators: number }
  pendingActions: { total: number; urgent: number }
}

export default function BusinessSnapshot() {
  const [data, setData] = useState<BusinessSnapshotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getBusinessSnapshotAction()
        if (result.isSuccess) {
          setData(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Failed to load business snapshot")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <div className="h-4 animate-pulse rounded bg-gray-700"></div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 h-8 animate-pulse rounded bg-gray-700"></div>
              <div className="h-3 animate-pulse rounded bg-gray-700"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              {error || "Failed to load business snapshot"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const revenueProgress =
    (data.todayRevenue.amount / data.todayRevenue.target) * 100

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Today's Revenue */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-100">
            Today's Revenue
          </CardTitle>
          <Euro className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            €{data.todayRevenue.amount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center space-x-2">
            {data.todayRevenue.growth >= 0 ? (
              <TrendingUp className="size-4 text-green-500" />
            ) : (
              <TrendingDown className="size-4 text-red-500" />
            )}
            <span
              className={`text-xs ${data.todayRevenue.growth >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {data.todayRevenue.growth >= 0 ? "+" : ""}
              {data.todayRevenue.growth.toFixed(1)}% vs yesterday
            </span>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Target: €{data.todayRevenue.target.toLocaleString()}</span>
              <span>{revenueProgress.toFixed(1)}%</span>
            </div>
            <Progress value={revenueProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Bookings */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-100">
            Today's Bookings
          </CardTitle>
          <Calendar className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.todayBookings.total}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Badge
                variant="secondary"
                className="bg-green-900 text-green-100"
              >
                {data.todayBookings.confirmed} Confirmed
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="secondary"
                className="bg-yellow-900 text-yellow-100"
              >
                {data.todayBookings.pending} Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-100">
            Active Users
          </CardTitle>
          <Users className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.activeUsers.total}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <div className="text-xs text-gray-400">
              {data.activeUsers.customers} Customers
            </div>
            <div className="text-xs text-gray-400">
              {data.activeUsers.operators} Operators
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-100">
            Pending Actions
          </CardTitle>
          <AlertCircle className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.pendingActions.total}
          </div>
          <div className="mt-2 flex items-center space-x-2">
            {data.pendingActions.urgent > 0 && (
              <Badge variant="destructive" className="bg-red-900 text-red-100">
                {data.pendingActions.urgent} Urgent
              </Badge>
            )}
            <span className="text-xs text-gray-400">Requires attention</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
