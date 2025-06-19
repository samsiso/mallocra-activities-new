"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Euro,
  CreditCard,
  Users,
  Percent
} from "lucide-react"
import { useEffect, useState } from "react"
import { getFinancialDashboardAction } from "@/actions/db/dashboard-actions"

interface FinancialDashboardData {
  monthlyRevenue: { amount: number; growth: number }
  commissionBreakdown: { platform: number; operators: number; sales: number }
  paymentHealth: { successRate: number; totalTransactions: number }
  revenueChart: Array<{ day: string; revenue: number }>
}

export default function FinancialDashboard() {
  const [data, setData] = useState<FinancialDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getFinancialDashboardAction()
        if (result.isSuccess) {
          setData(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Failed to load financial dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <div className="h-4 animate-pulse rounded bg-gray-700"></div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-8 animate-pulse rounded bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-gray-700"></div>
                <div className="h-3 animate-pulse rounded bg-gray-700"></div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="col-span-full border-gray-700 bg-gray-800">
          <CardHeader className="pb-2">
            <div className="h-4 animate-pulse rounded bg-gray-700"></div>
          </CardHeader>
          <CardContent>
            <div className="h-32 animate-pulse rounded bg-gray-700"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              {error || "Failed to load financial dashboard"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue))

  return (
    <div className="space-y-6">
      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Revenue */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">
              Monthly Revenue
            </CardTitle>
            <Euro className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              €{data.monthlyRevenue.amount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center space-x-2">
              {data.monthlyRevenue.growth >= 0 ? (
                <TrendingUp className="size-4 text-green-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
              <span
                className={`text-xs ${data.monthlyRevenue.growth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {data.monthlyRevenue.growth >= 0 ? "+" : ""}
                {data.monthlyRevenue.growth.toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Commission Breakdown */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">
              Commission Split
            </CardTitle>
            <Percent className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Platform</span>
                <span className="text-sm font-medium text-white">
                  {data.commissionBreakdown.platform.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.commissionBreakdown.platform}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Operators</span>
                <span className="text-sm font-medium text-white">
                  {data.commissionBreakdown.operators.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.commissionBreakdown.operators}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Sales</span>
                <span className="text-sm font-medium text-white">
                  {data.commissionBreakdown.sales.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.commissionBreakdown.sales}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Health */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">
              Payment Health
            </CardTitle>
            <CreditCard className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.paymentHealth.successRate.toFixed(1)}%
            </div>
            <div className="mt-1 text-xs text-gray-400">Success Rate</div>
            <div className="mt-3">
              <Progress
                value={data.paymentHealth.successRate}
                className="h-2"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Transactions</span>
              <Badge variant="secondary" className="bg-gray-700 text-gray-100">
                {data.paymentHealth.totalTransactions}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-100">
            7-Day Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenueChart.length > 0 ? (
              data.revenueChart.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-400">{day.day}</div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="mr-3 h-4 flex-1 overflow-hidden rounded-full bg-gray-700">
                        <div
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{
                            width: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="min-w-[80px] text-right text-sm font-medium text-white">
                        €{day.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400">
                No revenue data available for the last 7 days
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
