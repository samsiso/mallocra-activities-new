"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users
} from "lucide-react"
import {
  RevenueData,
  ActivityPerformance,
  UserAnalytics,
  BookingTrends
} from "@/actions/db/analytics-actions"

interface AnalyticsDashboardProps {
  revenueData: RevenueData[]
  activityPerformance: ActivityPerformance[]
  userAnalytics?: UserAnalytics
  bookingTrends?: BookingTrends
}

export default function AnalyticsDashboard({
  revenueData,
  activityPerformance,
  userAnalytics,
  bookingTrends
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Use real data from props
  const topActivities = activityPerformance.slice(0, 5).map(activity => ({
    name: activity.title,
    bookings: activity.bookings,
    revenue: activity.revenue
  }))

  // Calculate customer segments from real user analytics data
  const totalUsers =
    (userAnalytics?.newUsers || 0) + (userAnalytics?.returningUsers || 0)
  const customerSegments = [
    {
      segment: "Returning Customers",
      percentage:
        totalUsers > 0
          ? Math.round(
              ((userAnalytics?.returningUsers || 0) / totalUsers) * 100
            )
          : 0,
      count: userAnalytics?.returningUsers || 0
    },
    {
      segment: "New Customers",
      percentage:
        totalUsers > 0
          ? Math.round(((userAnalytics?.newUsers || 0) / totalUsers) * 100)
          : 0,
      count: userAnalytics?.newUsers || 0
    },
    {
      segment: "Premium Members",
      percentage: 5, // This would need a premium membership tracking system
      count: Math.floor(totalUsers * 0.05)
    }
  ]

  // Calculate performance metrics from real data
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0)
  const totalBookings = revenueData.reduce((sum, day) => sum + day.bookings, 0)
  const avgOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
  const avgRating =
    activityPerformance.length > 0
      ? activityPerformance.reduce(
          (sum, activity) => sum + activity.rating,
          0
        ) / activityPerformance.length
      : 0

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "revenue", label: "Revenue", icon: TrendingUp },
            { id: "customers", label: "Customers", icon: Users },
            { id: "activities", label: "Activities", icon: Activity }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Trend Chart */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Revenue Trend
            </h3>
            {revenueData.length > 0 ? (
              <div className="flex h-64 items-end justify-between space-x-2">
                {revenueData.slice(-6).map((data, index) => {
                  const maxRevenue = Math.max(
                    ...revenueData.map(d => d.revenue)
                  )
                  const height =
                    maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 0
                  return (
                    <div
                      key={data.date}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div
                        className="w-full rounded-t bg-orange-500 transition-all duration-300 hover:bg-orange-400"
                        style={{ height: `${height}px` }}
                        title={`€${data.revenue.toLocaleString()}`}
                      ></div>
                      <span className="mt-2 text-sm text-gray-400">
                        {new Date(data.date).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-gray-400">
                No revenue data available
              </div>
            )}
          </div>

          {/* Top Activities */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Top Activities
            </h3>
            {topActivities.length > 0 ? (
              <div className="space-y-3">
                {topActivities.map((activity, index) => (
                  <div
                    key={activity.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-orange-500">
                        #{index + 1}
                      </span>
                      <span className="text-white">{activity.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-400">
                        €{activity.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {activity.bookings} bookings
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-400">
                No activity data available
              </div>
            )}
          </div>

          {/* Customer Segments */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Customer Segments
            </h3>
            <div className="space-y-4">
              {customerSegments.map(segment => (
                <div key={segment.segment}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-white">
                      {segment.segment}
                    </span>
                    <span className="text-sm text-gray-400">
                      {segment.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {segment.count} customers
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="mr-2 size-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="mr-2 size-5 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">
                    {totalBookings}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Total Bookings</p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="mr-2 size-5 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">
                    €{avgOrderValue.toFixed(0)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Avg. Order Value</p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="mr-2 size-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {userAnalytics?.userGrowth
                      ? `${userAnalytics.userGrowth.toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">User Growth</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Revenue Analytics
            </h3>
            {revenueData.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      €{totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {totalBookings}
                    </p>
                    <p className="text-sm text-gray-400">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      €{avgOrderValue.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">Average Order Value</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No revenue data available</p>
            )}
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Customer Analytics
            </h3>
            {userAnalytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {userAnalytics.newUsers}
                    </p>
                    <p className="text-sm text-gray-400">New Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {userAnalytics.returningUsers}
                    </p>
                    <p className="text-sm text-gray-400">Returning Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {userAnalytics.userGrowth.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400">User Growth</p>
                  </div>
                </div>

                {/* Top Locations */}
                <div>
                  <h4 className="text-md mb-3 font-semibold text-white">
                    Top Locations
                  </h4>
                  <div className="space-y-2">
                    {userAnalytics.topLocations.map(location => (
                      <div
                        key={location.location}
                        className="flex items-center justify-between"
                      >
                        <span className="text-white">{location.location}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">
                            {location.users} users
                          </span>
                          <span className="text-orange-500">
                            {location.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Groups */}
                <div>
                  <h4 className="text-md mb-3 font-semibold text-white">
                    Age Groups
                  </h4>
                  <div className="space-y-2">
                    {userAnalytics.ageGroups.map(group => (
                      <div
                        key={group.range}
                        className="flex items-center justify-between"
                      >
                        <span className="text-white">{group.range}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">
                            {group.count} users
                          </span>
                          <span className="text-orange-500">
                            {group.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No customer analytics available</p>
            )}
          </div>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Activity Performance
            </h3>
            {activityPerformance.length > 0 ? (
              <div className="space-y-4">
                {activityPerformance.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="border-b border-gray-700 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Rating: {activity.rating.toFixed(1)}/5
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          €{activity.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.bookings} bookings
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No activity performance data available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
