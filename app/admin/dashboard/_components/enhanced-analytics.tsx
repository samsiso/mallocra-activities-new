"use client"

import { useEffect, useState } from "react"
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Star,
  AlertTriangle,
  BarChart3,
  Target,
  Clock,
  CheckCircle
} from "lucide-react"
import { DashboardAnalytics } from "@/actions/db/dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  growth?: number
  status?: "positive" | "negative" | "neutral"
  trend?: "up" | "down" | "stable"
  className?: string
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  growth,
  status = "neutral",
  trend = "stable",
  className = ""
}: MetricCardProps) {
  const statusColors = {
    positive: "text-green-400 bg-green-900/20 border-green-500/20",
    negative: "text-red-400 bg-red-900/20 border-red-500/20",
    neutral: "text-blue-400 bg-blue-900/20 border-blue-500/20"
  }

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Activity
  }

  const TrendIcon = trendIcons[trend]

  return (
    <Card
      className={`border-gray-700/50 bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-orange-500/10 ${className}`}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={`rounded-lg p-3 ${statusColors[status]}`}>
            <Icon className="size-6" />
          </div>
          {growth !== undefined && (
            <div className="flex items-center space-x-1">
              <TrendIcon
                className={`size-4 ${
                  trend === "up"
                    ? "text-green-400"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  trend === "up"
                    ? "text-green-400"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {growth > 0 ? "+" : ""}
                {growth}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {title}
          </h3>
          <div className="text-3xl font-bold text-white">
            {typeof value === "number" &&
            title.toLowerCase().includes("revenue")
              ? `€${value.toLocaleString()}`
              : value.toLocaleString()}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

interface PerformanceIndicatorProps {
  label: string
  value: number
  unit?: string
  status: "good" | "warning" | "critical"
  icon: React.ComponentType<{ className?: string }>
}

function PerformanceIndicator({
  label,
  value,
  unit = "",
  status,
  icon: Icon
}: PerformanceIndicatorProps) {
  const statusConfig = {
    good: {
      color: "text-green-400",
      bg: "bg-green-900/20",
      border: "border-green-500/20"
    },
    warning: {
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      border: "border-yellow-500/20"
    },
    critical: {
      color: "text-red-400",
      bg: "bg-red-900/20",
      border: "border-red-500/20"
    }
  }

  const config = statusConfig[status]

  return (
    <div
      className={`rounded-lg border p-4 ${config.bg} ${config.border} transition-all duration-300 hover:scale-105`}
    >
      <div className="flex items-center space-x-3">
        <div className={`rounded-lg p-2 ${config.bg}`}>
          <Icon className={`size-5 ${config.color}`} />
        </div>
        <div>
          <div className="text-sm text-gray-400">{label}</div>
          <div className={`text-xl font-bold ${config.color}`}>
            {value}
            {unit}
          </div>
        </div>
      </div>
    </div>
  )
}

interface EnhancedAnalyticsProps {
  initialData: DashboardAnalytics | null
}

export default function EnhancedAnalytics({
  initialData
}: EnhancedAnalyticsProps) {
  const [data, setData] = useState<DashboardAnalytics | null>(initialData)
  const [isLoading, setIsLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) {
      setData(initialData)
      setIsLoading(false)
    }
  }, [initialData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border-gray-700/50 bg-gray-800/50">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="size-12 rounded-lg bg-gray-700"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                    <div className="h-8 w-1/2 rounded bg-gray-700"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertTriangle className="size-6" />
            <span>Failed to load analytics data</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-white">
            Analytics Overview
          </h2>
          <p className="text-gray-400">
            Real-time insights into your business performance
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-green-500/20 bg-green-900/20 text-green-400"
        >
          Live Data
        </Badge>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.users.total}
          subtitle={`${data.users.newThisMonth} new this month`}
          icon={Users}
          growth={data.users.growth}
          status="positive"
          trend="up"
        />

        <MetricCard
          title="Active Users"
          value={data.users.activeUsers}
          subtitle={`${Math.round((data.users.activeUsers / data.users.total) * 100)}% of total`}
          icon={Activity}
          growth={8.2}
          status="positive"
          trend="up"
        />

        <MetricCard
          title="Total Activities"
          value={data.activities.total}
          subtitle={`${data.activities.published} published, ${data.activities.draft} drafts`}
          icon={MapPin}
          growth={data.activities.growth}
          status="positive"
          trend="up"
        />

        <MetricCard
          title="Activity Views"
          value={data.activities.totalViews}
          subtitle={`Avg rating: ${data.activities.avgRating}★`}
          icon={Eye}
          growth={12.3}
          status="positive"
          trend="up"
        />
      </div>

      {/* Booking & Revenue Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Bookings"
          value={data.bookings.total}
          subtitle={`${data.bookings.thisMonth} this month`}
          icon={Calendar}
          growth={data.bookings.growth}
          status="positive"
          trend="up"
        />

        <MetricCard
          title="Confirmed Bookings"
          value={data.bookings.confirmed}
          subtitle={`${data.bookings.pending} pending`}
          icon={CheckCircle}
          growth={18.5}
          status="positive"
          trend="up"
        />

        <MetricCard
          title="Total Revenue"
          value={data.bookings.revenue}
          subtitle="All time revenue"
          icon={DollarSign}
          growth={data.bookings.growth}
          status="positive"
          trend="up"
          className="md:col-span-2"
        />
      </div>

      {/* Performance Indicators */}
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="size-5 text-orange-500" />
            <span>System Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <PerformanceIndicator
              label="Response Time"
              value={data.performance.responseTime}
              unit="ms"
              status={
                data.performance.responseTime < 200
                  ? "good"
                  : data.performance.responseTime < 500
                    ? "warning"
                    : "critical"
              }
              icon={Clock}
            />

            <PerformanceIndicator
              label="Uptime"
              value={data.performance.uptime}
              unit="%"
              status={
                data.performance.uptime > 99
                  ? "good"
                  : data.performance.uptime > 95
                    ? "warning"
                    : "critical"
              }
              icon={Target}
            />

            <PerformanceIndicator
              label="Error Rate"
              value={data.performance.errorRate}
              unit="%"
              status={
                data.performance.errorRate < 1
                  ? "good"
                  : data.performance.errorRate < 5
                    ? "warning"
                    : "critical"
              }
              icon={AlertTriangle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
