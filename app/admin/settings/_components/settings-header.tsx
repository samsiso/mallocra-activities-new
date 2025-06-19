"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Settings, Activity, Clock, Users, HardDrive } from "lucide-react"

interface SystemStats {
  activeSettings: number
  recentChanges: number
  systemHealth: number
  lastBackup: string
  totalUsers: number
  storageUsed: number
}

interface SettingsHeaderProps {
  stats: SystemStats
}

export default function SettingsHeader({ stats }: SettingsHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>Admin</span>
        <span>/</span>
        <span className="text-orange-500">Settings Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings Management</h1>
          <p className="mt-1 text-gray-400">
            Configure system settings, permissions, and site preferences
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-orange-600 text-white hover:bg-orange-700">
            <Save className="mr-2 size-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Settings
            </CardTitle>
            <Settings className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.activeSettings}
            </div>
            <p className="text-xs text-gray-500">Configured settings</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Recent Changes
            </CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.recentChanges}
            </div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              System Health
            </CardTitle>
            <Activity className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.systemHealth}%
            </div>
            <p className="text-xs text-gray-500">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Last Backup
            </CardTitle>
            <HardDrive className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatDate(stats.lastBackup)}
            </div>
            <p className="text-xs text-gray-500">Automatic backup</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="size-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Storage Used
            </CardTitle>
            <HardDrive className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.storageUsed}%
            </div>
            <p className="text-xs text-gray-500">Of allocated space</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
