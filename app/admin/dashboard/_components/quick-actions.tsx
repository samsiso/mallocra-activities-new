"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Upload,
  Download,
  Bell,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  Mail,
  FileText,
  Settings
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function QuickActions() {
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExportData = async () => {
    setIsExporting(true)
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsExporting(false)
    console.log("Data exported successfully")
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    // Simulate refresh process
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    console.log("Data refreshed successfully")
  }

  const handleSendNotifications = () => {
    console.log("Sending notifications...")
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="h-32 animate-pulse rounded bg-gray-700"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const quickActions = [
    {
      id: "add-activity",
      title: "Add New Activity",
      description: "Create a new activity listing",
      icon: Plus,
      color: "bg-orange-600 hover:bg-orange-700",
      href: "/admin/activities/new"
    },
    {
      id: "export-data",
      title: "Export Data",
      description: "Download CSV reports",
      icon: Download,
      color: "bg-blue-600 hover:bg-blue-700",
      action: handleExportData,
      loading: isExporting
    },
    {
      id: "refresh-data",
      title: "Refresh Analytics",
      description: "Update all dashboard metrics",
      icon: RefreshCw,
      color: "bg-green-600 hover:bg-green-700",
      action: handleRefreshData,
      loading: isRefreshing
    },
    {
      id: "send-notifications",
      title: "Send Notifications",
      description: "Notify users of updates",
      icon: Bell,
      color: "bg-purple-600 hover:bg-purple-700",
      action: handleSendNotifications
    }
  ]

  const managementShortcuts = [
    {
      title: "Manage Users",
      description: "11 total users",
      icon: Users,
      color: "text-blue-400",
      href: "/admin/users",
      count: 11,
      change: "+3 this month"
    },
    {
      title: "Review Activities",
      description: "28 activities",
      icon: Activity,
      color: "text-orange-400",
      href: "/admin/activities",
      count: 28,
      change: "+5 this month"
    },
    {
      title: "Email Templates",
      description: "Manage communications",
      icon: Mail,
      color: "text-green-400",
      href: "/admin/settings",
      count: 8,
      change: "2 updated"
    },
    {
      title: "Content Management",
      description: "Blog posts & pages",
      icon: FileText,
      color: "text-yellow-400",
      href: "/admin/blog",
      count: 5,
      change: "1 draft"
    }
  ]

  const systemStatus = {
    databaseHealth: 98,
    serverResponse: 95,
    apiCalls: 87,
    userSatisfaction: 92
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  onClick={action.action}
                  disabled={action.loading}
                  className={`h-auto flex-col items-start space-y-2 p-4 ${action.color}`}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <a href={action.href}>
                      <div className="flex w-full items-center space-x-2">
                        <Icon
                          className={`size-5 ${action.loading ? "animate-spin" : ""}`}
                        />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </a>
                  ) : (
                    <>
                      <div className="flex w-full items-center space-x-2">
                        <Icon
                          className={`size-5 ${action.loading ? "animate-spin" : ""}`}
                        />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </>
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Management Shortcuts */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Management Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Quick access to key areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {managementShortcuts.map(shortcut => {
              const Icon = shortcut.icon
              return (
                <a
                  key={shortcut.title}
                  href={shortcut.href}
                  className="flex items-center space-x-3 rounded-lg border border-gray-700 p-4 transition-colors hover:bg-gray-700"
                >
                  <Icon className={`size-6 ${shortcut.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {shortcut.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-gray-400"
                      >
                        {shortcut.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {shortcut.description}
                    </p>
                    <p className="text-xs text-green-400">{shortcut.change}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(systemStatus).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      value >= 95
                        ? "text-green-400"
                        : value >= 90
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {value}%
                  </span>
                </div>
                <Progress
                  value={value}
                  className={`h-2 ${
                    value >= 95
                      ? "bg-green-900"
                      : value >= 90
                        ? "bg-yellow-900"
                        : "bg-red-900"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Updates</CardTitle>
          <CardDescription className="text-gray-400">
            Latest changes and improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                title: "Enhanced Analytics Dashboard",
                description:
                  "Added real-time data visualization and performance metrics",
                time: "2 hours ago",
                type: "feature"
              },
              {
                title: "Universal Search Implemented",
                description:
                  "Search across activities, users, reviews, and bookings",
                time: "3 hours ago",
                type: "feature"
              },
              {
                title: "Database Optimization",
                description: "Improved query performance by 40%",
                time: "1 day ago",
                type: "improvement"
              },
              {
                title: "New Export Options",
                description: "CSV export now available for all data types",
                time: "2 days ago",
                type: "feature"
              }
            ].map((update, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`mt-1 size-2 rounded-full ${
                    update.type === "feature"
                      ? "bg-green-500"
                      : update.type === "improvement"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {update.title}
                    </span>
                    <span className="text-xs text-gray-500">{update.time}</span>
                  </div>
                  <p className="text-sm text-gray-400">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
