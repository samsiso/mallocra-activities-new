"use server"

import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react"
import { getActivitiesAction } from "@/actions/db/activities-actions"
import { getBookingsAction } from "@/actions/db/bookings-actions"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral"
}: MetricCardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-400"
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="mt-2 flex items-center">
              <TrendingUp className={`mr-1 size-4 ${trendColors[trend]}`} />
              <span className={`text-sm ${trendColors[trend]}`}>{change}</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-orange-600 p-3">
          <Icon className="size-6 text-white" />
        </div>
      </div>
    </div>
  )
}

async function getMetrics() {
  try {
    const [activitiesResponse, bookingsResponse] = await Promise.all([
      getActivitiesAction(),
      getBookingsAction()
    ])

    // For now, we'll mock user count since there's no getAllUsersAction
    const totalUsers = 0 // Will be updated when user action is available
    const totalActivities = activitiesResponse.isSuccess
      ? activitiesResponse.data.length
      : 0
    const totalBookings = bookingsResponse.isSuccess
      ? bookingsResponse.data.length
      : 0

    // Calculate revenue from bookings (assuming each booking has a price)
    const totalRevenue = bookingsResponse.isSuccess
      ? bookingsResponse.data.reduce((sum: number, booking: any) => {
          return sum + (booking.totalPrice || 0)
        }, 0)
      : 0

    return {
      totalUsers,
      totalActivities,
      totalBookings,
      totalRevenue
    }
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return {
      totalUsers: 0,
      totalActivities: 0,
      totalBookings: 0,
      totalRevenue: 0
    }
  }
}

export default async function DashboardOverview() {
  const metrics = await getMetrics()

  const metricCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      change: "+12% from last month",
      icon: Users,
      trend: "up" as const
    },
    {
      title: "Active Activities",
      value: metrics.totalActivities.toLocaleString(),
      change: "+5% from last month",
      icon: MapPin,
      trend: "up" as const
    },
    {
      title: "Total Bookings",
      value: metrics.totalBookings.toLocaleString(),
      change: "+18% from last month",
      icon: Calendar,
      trend: "up" as const
    },
    {
      title: "Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: "+23% from last month",
      icon: DollarSign,
      trend: "up" as const
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </div>
  )
}
