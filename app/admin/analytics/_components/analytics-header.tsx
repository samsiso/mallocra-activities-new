"use client"

import {
  BarChart3,
  FileText,
  Download,
  Settings,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  Euro
} from "lucide-react"
import Link from "next/link"
import { AnalyticsOverview } from "@/actions/db/analytics-actions"

interface AnalyticsHeaderProps {
  overview: AnalyticsOverview
}

export default function AnalyticsHeader({ overview }: AnalyticsHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-orange-500"
            >
              <Settings className="mr-2 size-4" />
              Admin
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <span className="ml-1 text-sm font-medium text-orange-500 md:ml-2">
                Analytics
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-orange-500">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Track performance, bookings, and revenue analytics
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            <Calendar className="size-4" />
            <span>Date Range</span>
          </button>

          <button className="inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
            <Download className="size-4" />
            <span>Export Report</span>
          </button>

          <button className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700">
            <TrendingUp className="size-4" />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                €{overview.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <Euro className="size-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="mr-1 size-4 text-green-500" />
            <span className="text-sm text-green-500">
              {overview.growthRate > 0 ? "+" : ""}
              {overview.growthRate.toFixed(1)}%
            </span>
            <span className="ml-1 text-sm text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-white">
                {overview.totalBookings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3">
              <BarChart3 className="size-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-400">
              €{overview.averageBookingValue.toFixed(2)} avg value
            </span>
          </div>
        </div>

        {/* Total Activities */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Activities</p>
              <p className="text-2xl font-bold text-white">
                {overview.totalActivities}
              </p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-3">
              <Activity className="size-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-400">
              {overview.conversionRate.toFixed(1)}% conversion rate
            </span>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {overview.totalUsers}
              </p>
            </div>
            <div className="rounded-full bg-orange-500/10 p-3">
              <Users className="size-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="truncate text-sm text-gray-400">
              Top: {overview.topPerformingActivity}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
