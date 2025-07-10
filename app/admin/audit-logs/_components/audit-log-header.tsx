"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  Shield
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuditLogStats {
  totalLogs: number
  todayLogs: number
  criticalEvents: number
  topActions: Array<{ action: string; count: number }>
  topUsers: Array<{ userId: string; userName: string; count: number }>
  severityBreakdown: Array<{ severity: string; count: number }>
}

interface AuditLogHeaderProps {
  stats: AuditLogStats
}

export default function AuditLogHeader({ stats }: AuditLogHeaderProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "error":
        return "bg-orange-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400"
      case "error":
        return "text-orange-400"
      case "warning":
        return "text-yellow-400"
      case "info":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Logs
            </CardTitle>
            <FileText className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalLogs.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">All time records</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Today's Activity
            </CardTitle>
            <Activity className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.todayLogs}
            </div>
            <p className="text-xs text-gray-500">Actions logged today</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Critical Events
            </CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.criticalEvents}
            </div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Security Status
            </CardTitle>
            <Shield className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.criticalEvents === 0 ? "Secure" : "Alert"}
            </div>
            <p className="text-xs text-gray-500">
              {stats.criticalEvents === 0
                ? "No critical issues"
                : "Review required"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top Actions */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="mr-2 size-5 text-purple-500" />
              Top Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topActions.length > 0 ? (
                stats.topActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-300">
                      {action.action}
                    </span>
                    <Badge variant="secondary" className="bg-gray-700">
                      {action.count}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No actions recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="mr-2 size-5 text-cyan-500" />
              Most Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topUsers.length > 0 ? (
                stats.topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-300">
                      {user.userName}
                    </span>
                    <Badge variant="secondary" className="bg-gray-700">
                      {user.count}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No user activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Activity className="mr-2 size-5 text-orange-500" />
              Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.severityBreakdown.map((item, index) => {
                const percentage =
                  stats.totalLogs > 0 ? (item.count / stats.totalLogs) * 100 : 0
                return (
                  <div key={index}>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`text-sm capitalize ${getSeverityTextColor(item.severity)}`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-sm text-gray-400">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${getSeverityColor(item.severity)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
