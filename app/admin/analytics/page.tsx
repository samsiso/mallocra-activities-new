"use server"

import { Suspense } from "react"
import AnalyticsHeader from "./_components/analytics-header"
import AnalyticsDashboard from "./_components/analytics-dashboard"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getAnalyticsOverviewAction,
  getRevenueDataAction,
  getActivityPerformanceAction,
  getUserAnalyticsAction,
  getBookingTrendsAction
} from "@/actions/db/analytics-actions"

export default async function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-orange-500">
                Analytics Dashboard
              </h1>
              <p className="text-gray-400">
                Track performance, bookings, and revenue metrics
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              {/* Header Section */}
              <Suspense
                fallback={
                  <div className="animate-pulse">
                    <div className="mb-2 h-8 w-1/3 rounded bg-gray-700"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-700"></div>
                  </div>
                }
              >
                <AnalyticsHeaderFetcher />
              </Suspense>

              {/* Analytics Dashboard */}
              <Suspense
                fallback={
                  <div className="mt-8 space-y-4">
                    {/* Charts Loading */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse rounded-lg bg-gray-800 p-6"
                        >
                          <div className="mb-4 h-6 w-1/3 rounded bg-gray-700"></div>
                          <div className="h-64 rounded bg-gray-700"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <AnalyticsDashboardFetcher />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function AnalyticsHeaderFetcher() {
  const { data: overview } = await getAnalyticsOverviewAction()

  if (!overview) {
    return <div className="text-red-400">Failed to load analytics overview</div>
  }

  return <AnalyticsHeader overview={overview} />
}

async function AnalyticsDashboardFetcher() {
  const [
    { data: revenueData },
    { data: activityPerformance },
    { data: userAnalytics },
    { data: bookingTrends }
  ] = await Promise.all([
    getRevenueDataAction(30),
    getActivityPerformanceAction(),
    getUserAnalyticsAction(),
    getBookingTrendsAction()
  ])

  return (
    <AnalyticsDashboard
      revenueData={revenueData || []}
      activityPerformance={activityPerformance || []}
      userAnalytics={userAnalytics}
      bookingTrends={bookingTrends}
    />
  )
}
