"use server"

import { Suspense } from "react"
import {
  getDashboardAnalyticsAction,
  getDashboardStatsAction,
  getRecentActivityAction
} from "@/actions/db/dashboard-actions"

export default async function TestDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-orange-500">
          Dashboard Test Page
        </h1>
        <p className="mb-8 text-gray-400">
          Testing live data integration with dashboard components
        </p>

        <Suspense
          fallback={<div className="text-gray-400">Loading analytics...</div>}
        >
          <AnalyticsTest />
        </Suspense>

        <Suspense
          fallback={<div className="text-gray-400">Loading stats...</div>}
        >
          <StatsTest />
        </Suspense>

        <Suspense
          fallback={
            <div className="text-gray-400">Loading recent activity...</div>
          }
        >
          <ActivityTest />
        </Suspense>
      </div>
    </div>
  )
}

async function AnalyticsTest() {
  const {
    data: analyticsData,
    isSuccess,
    message
  } = await getDashboardAnalyticsAction()

  return (
    <div className="mb-8 rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-orange-400">
        Analytics Data Test
      </h2>
      <div className="mb-2">
        <span
          className={`rounded px-2 py-1 text-sm ${isSuccess ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>
        <span className="ml-2 text-gray-400">{message}</span>
      </div>
      {analyticsData && (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Total Users</div>
            <div className="text-xl font-bold">{analyticsData.users.total}</div>
            <div className="text-xs text-green-400">
              +{analyticsData.users.growth}%
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Activities</div>
            <div className="text-xl font-bold">
              {analyticsData.activities.total}
            </div>
            <div className="text-xs text-green-400">
              +{analyticsData.activities.growth}%
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Bookings</div>
            <div className="text-xl font-bold">
              {analyticsData.bookings.total}
            </div>
            <div className="text-xs text-green-400">
              +{analyticsData.bookings.growth}%
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Revenue</div>
            <div className="text-xl font-bold">
              €{analyticsData.bookings.revenue}
            </div>
            <div className="text-xs text-green-400">
              +{analyticsData.bookings.growth}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

async function StatsTest() {
  const {
    data: statsData,
    isSuccess,
    message
  } = await getDashboardStatsAction()

  return (
    <div className="mb-8 rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-orange-400">
        Stats Data Test
      </h2>
      <div className="mb-2">
        <span
          className={`rounded px-2 py-1 text-sm ${isSuccess ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>
        <span className="ml-2 text-gray-400">{message}</span>
      </div>
      {statsData && (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Activities</div>
            <div className="text-xl font-bold">
              {statsData.totalActivities.count}
            </div>
            <div className="text-xs text-green-400">
              {statsData.totalActivities.change}
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Users</div>
            <div className="text-xl font-bold">
              {statsData.totalUsers.count}
            </div>
            <div className="text-xs text-green-400">
              {statsData.totalUsers.change}
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Reviews</div>
            <div className="text-xl font-bold">
              {statsData.totalReviews.count}
            </div>
            <div className="text-xs text-green-400">
              {statsData.totalReviews.change}
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Bookings</div>
            <div className="text-xl font-bold">
              {statsData.totalBookings.count}
            </div>
            <div className="text-xs text-green-400">
              {statsData.totalBookings.change}
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Weekly Revenue</div>
            <div className="text-xl font-bold">
              {statsData.weeklyRevenue.amount}
            </div>
            <div className="text-xs text-green-400">
              {statsData.weeklyRevenue.change}
            </div>
          </div>
          <div className="rounded bg-gray-700 p-3">
            <div className="text-sm text-gray-400">Monthly Revenue</div>
            <div className="text-xl font-bold">
              {statsData.monthlyRevenue.amount}
            </div>
            <div className="text-xs text-green-400">
              {statsData.monthlyRevenue.change}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

async function ActivityTest() {
  const {
    data: activityData,
    isSuccess,
    message
  } = await getRecentActivityAction()

  return (
    <div className="mb-8 rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-orange-400">
        Recent Activity Test
      </h2>
      <div className="mb-2">
        <span
          className={`rounded px-2 py-1 text-sm ${isSuccess ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>
        <span className="ml-2 text-gray-400">{message}</span>
      </div>
      {activityData && activityData.length > 0 && (
        <div className="mt-4 space-y-3">
          {activityData.slice(0, 5).map(activity => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 rounded bg-gray-700 p-3"
            >
              <div
                className={`mt-2 size-2 rounded-full ${
                  activity.type === "booking"
                    ? "bg-blue-400"
                    : activity.type === "review"
                      ? "bg-yellow-400"
                      : activity.type === "user"
                        ? "bg-green-400"
                        : "bg-gray-400"
                }`}
              ></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {activity.description}
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="rounded bg-gray-600 px-2 py-1 text-xs">
                    {activity.type}
                  </span>
                  <span className="rounded bg-gray-600 px-2 py-1 text-xs">
                    {activity.status}
                  </span>
                  {activity.metadata?.amount && (
                    <span className="rounded bg-green-900 px-2 py-1 text-xs text-green-300">
                      €{activity.metadata.amount}
                    </span>
                  )}
                  {activity.metadata?.rating && (
                    <span className="rounded bg-yellow-900 px-2 py-1 text-xs text-yellow-300">
                      {activity.metadata.rating}★
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
