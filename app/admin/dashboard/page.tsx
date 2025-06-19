"use server"

import { Suspense } from "react"
import EnhancedQuickStats from "./_components/enhanced-quick-stats"
import EnhancedAnalytics from "./_components/enhanced-analytics"
import QuickActions from "./_components/quick-actions"
import AdminSidebar from "./_components/admin-sidebar"
import BusinessSnapshot from "./_components/business-snapshot"
import FinancialDashboard from "./_components/financial-dashboard"
import OperationalCommandCenter from "./_components/operational-command-center"
import {
  getDashboardAnalyticsAction,
  getDashboardStatsAction,
  getRecentActivityAction
} from "@/actions/db/dashboard-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, TrendingUp, BarChart3 } from "lucide-react"

export default async function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-lg text-gray-400">
                    Manage your activities, bookings, and users with real-time
                    analytics
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className="border-green-500/20 bg-green-900/20 px-3 py-1 text-green-400"
                  >
                    <div className="mr-2 size-2 animate-pulse rounded-full bg-green-400"></div>
                    Live Data
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-500/20 bg-blue-900/20 px-3 py-1 text-blue-400"
                  >
                    <BarChart3 className="mr-2 size-4" />
                    Analytics
                  </Badge>
                </div>
              </div>

              {/* Quick Overview Cards */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/20 to-red-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-orange-900/30 p-2">
                        <Activity className="size-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">System Status</p>
                        <p className="text-lg font-semibold text-white">
                          All Systems Operational
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-900/30 p-2">
                        <Users className="size-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Active Sessions</p>
                        <p className="text-lg font-semibold text-white">
                          Real-time Updates
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-green-900/30 p-2">
                        <TrendingUp className="size-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Performance</p>
                        <p className="text-lg font-semibold text-white">
                          Excellent
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="space-y-8">
              {/* Section 1: Today's Business Snapshot */}
              <section>
                <div className="mb-4">
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    Today's Business Snapshot
                  </h2>
                  <p className="text-gray-400">
                    Critical metrics requiring immediate attention
                  </p>
                </div>
                <Suspense
                  fallback={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="h-32 animate-pulse rounded-lg bg-gray-800"
                        ></div>
                      ))}
                    </div>
                  }
                >
                  <BusinessSnapshot />
                </Suspense>
              </section>

              {/* Section 2: Financial Dashboard */}
              <section>
                <div className="mb-4">
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    Revenue & Financial Overview
                  </h2>
                  <p className="text-gray-400">
                    Commission tracking and payment health monitoring
                  </p>
                </div>
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="h-32 animate-pulse rounded-lg bg-gray-800"
                          ></div>
                        ))}
                      </div>
                      <div className="h-64 animate-pulse rounded-lg bg-gray-800"></div>
                    </div>
                  }
                >
                  <FinancialDashboard />
                </Suspense>
              </section>

              {/* Section 3: Operational Command Center */}
              <section>
                <div className="mb-4">
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    Operational Command Center
                  </h2>
                  <p className="text-gray-400">
                    Booking operations and activity management
                  </p>
                </div>
                <Suspense
                  fallback={
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="h-96 animate-pulse rounded-lg bg-gray-800"></div>
                      <div className="h-96 animate-pulse rounded-lg bg-gray-800"></div>
                    </div>
                  }
                >
                  <OperationalCommandCenter />
                </Suspense>
              </section>

              {/* Section 4: System Analytics & Legacy Components */}
              <section>
                <div className="mb-4">
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    System Analytics & Quick Actions
                  </h2>
                  <p className="text-gray-400">
                    Detailed analytics and administrative tools
                  </p>
                </div>

                {/* Quick Stats Section */}
                <div className="mb-8">
                  <Suspense fallback={<QuickStatsSkeleton />}>
                    <QuickStatsSection />
                  </Suspense>
                </div>

                {/* Analytics Section */}
                <div className="mb-8">
                  <Suspense fallback={<AnalyticsSkeleton />}>
                    <AnalyticsSection />
                  </Suspense>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6">
                  <QuickActions />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Server Components for Data Fetching
async function QuickStatsSection() {
  const [statsResult, activityResult] = await Promise.all([
    getDashboardStatsAction(),
    getRecentActivityAction()
  ])

  return (
    <EnhancedQuickStats
      initialStats={statsResult.isSuccess ? statsResult.data : null}
      initialActivity={activityResult.isSuccess ? activityResult.data : []}
    />
  )
}

async function AnalyticsSection() {
  const analyticsResult = await getDashboardAnalyticsAction()

  return (
    <EnhancedAnalytics
      initialData={analyticsResult.isSuccess ? analyticsResult.data : null}
    />
  )
}

// Loading Skeletons
function QuickStatsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-700"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-700"></div>
        </div>
        <div className="h-6 w-20 animate-pulse rounded bg-gray-700"></div>
      </div>

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
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

      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 rounded bg-gray-700"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="size-10 rounded-lg bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-700"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-gray-700"></div>
        </div>
        <div className="h-6 w-20 animate-pulse rounded bg-gray-700"></div>
      </div>

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

      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg bg-gray-700/50 p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-600"></div>
                    <div className="h-6 w-1/2 rounded bg-gray-600"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
