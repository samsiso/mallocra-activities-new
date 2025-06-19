"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Users,
  Euro,
  Activity,
  Clock,
  CheckCircle,
  UserPlus,
  Star,
  MapPin,
  MessageSquare,
  ArrowRight,
  Zap,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardStats, RecentActivity } from "@/actions/db/dashboard-actions"

interface EnhancedQuickStatsProps {
  initialStats: DashboardStats | null
  initialActivity: RecentActivity[]
}

interface StatCardProps {
  title: string
  count: number
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
}

function StatCard({
  title,
  count,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor,
  borderColor
}: StatCardProps) {
  const changeIcon =
    changeType === "increase"
      ? TrendingUp
      : changeType === "decrease"
        ? TrendingDown
        : Activity
  const ChangeIcon = changeIcon

  return (
    <Card
      className={`${bgColor} ${borderColor} group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10`}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`rounded-xl p-3 ${bgColor} border ${borderColor} transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`size-6 ${color}`} />
          </div>
          <div className="flex items-center space-x-1">
            <ChangeIcon
              className={`size-4 ${
                changeType === "increase"
                  ? "text-green-400"
                  : changeType === "decrease"
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                changeType === "increase"
                  ? "text-green-400"
                  : changeType === "decrease"
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {change}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {title}
          </h3>
          <div className="text-3xl font-bold text-white">
            {count.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "booking":
      return <Calendar className="size-4 text-blue-400" />
    case "review":
      return <Star className="size-4 text-yellow-400" />
    case "user":
      return <UserPlus className="size-4 text-green-400" />
    case "activity":
      return <MapPin className="size-4 text-orange-400" />
    default:
      return <Activity className="size-4 text-gray-400" />
  }
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const timeAgo = new Date(activity.timestamp).toLocaleString()

  return (
    <div className="group flex items-start space-x-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4 transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-800/50">
      <div className="shrink-0 rounded-lg bg-gray-700/50 p-2 transition-transform duration-200 group-hover:scale-110">
        <ActivityIcon type={activity.type} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="truncate text-sm font-medium text-white">
            {activity.title}
          </h4>
          <Badge
            variant="outline"
            className="border-gray-600 bg-gray-700/50 text-xs text-gray-300"
          >
            {activity.type}
          </Badge>
        </div>

        <p className="mb-2 line-clamp-2 text-sm text-gray-400">
          {activity.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="size-3" />
            <span>{timeAgo}</span>
          </div>
          {activity.metadata && (
            <div className="flex items-center space-x-2">
              {activity.metadata.amount && (
                <span className="font-medium text-green-400">
                  €{activity.metadata.amount}
                </span>
              )}
              {activity.metadata.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="size-3 fill-current text-yellow-400" />
                  <span>{activity.metadata.rating}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EnhancedQuickStats({
  initialStats,
  initialActivity
}: EnhancedQuickStatsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats)
  const [activity, setActivity] = useState<RecentActivity[]>(initialActivity)
  const [isLoading, setIsLoading] = useState(!initialStats)

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats)
      setIsLoading(false)
    }
    if (initialActivity) {
      setActivity(initialActivity)
    }
  }, [initialStats, initialActivity])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-gray-700/50 bg-gray-800/50">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="size-12 rounded-xl bg-gray-700"></div>
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

  if (!stats) {
    return (
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertTriangle className="size-6" />
            <span>Failed to load dashboard statistics</span>
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
            Quick Statistics
          </h2>
          <p className="text-gray-400">Key metrics at a glance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="border-orange-500/20 bg-orange-900/20 text-orange-400"
          >
            <Zap className="mr-1 size-3" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Activities"
          count={stats.totalActivities.count}
          change={stats.totalActivities.change}
          changeType={stats.totalActivities.changeType}
          icon={MapPin}
          color="text-orange-400"
          bgColor="bg-orange-900/20"
          borderColor="border-orange-500/20"
        />

        <StatCard
          title="Total Users"
          count={stats.totalUsers.count}
          change={stats.totalUsers.change}
          changeType={stats.totalUsers.changeType}
          icon={Users}
          color="text-blue-400"
          bgColor="bg-blue-900/20"
          borderColor="border-blue-500/20"
        />

        <StatCard
          title="Total Reviews"
          count={stats.totalReviews.count}
          change={stats.totalReviews.change}
          changeType={stats.totalReviews.changeType}
          icon={Star}
          color="text-yellow-400"
          bgColor="bg-yellow-900/20"
          borderColor="border-yellow-500/20"
        />

        <StatCard
          title="Total Bookings"
          count={stats.totalBookings.count}
          change={stats.totalBookings.change}
          changeType={stats.totalBookings.changeType}
          icon={Calendar}
          color="text-green-400"
          bgColor="bg-green-900/20"
          borderColor="border-green-500/20"
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-green-500/20 bg-gradient-to-br from-green-900/20 to-emerald-900/20 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl border border-green-500/20 bg-green-900/30 p-3">
                <Euro className="size-6 text-green-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="size-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  {stats.weeklyRevenue.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
                Weekly Revenue
              </h3>
              <div className="text-3xl font-bold text-white">
                €{stats.weeklyRevenue.amount.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl border border-purple-500/20 bg-purple-900/30 p-3">
                <Target className="size-6 text-purple-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="size-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">
                  {stats.monthlyRevenue.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
                Monthly Revenue
              </h3>
              <div className="text-3xl font-bold text-white">
                €{stats.monthlyRevenue.amount.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-white">
              <MessageSquare className="size-5 text-orange-500" />
              <span>Recent Activity</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              View All
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activity.length > 0 ? (
            <div className="space-y-4">
              {activity.slice(0, 5).map((item, index) => (
                <ActivityItem key={index} activity={item} />
              ))}
              {activity.length > 5 && (
                <div className="pt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white"
                  >
                    Load More Activities
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400">
              <Activity className="mx-auto mb-4 size-12 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
