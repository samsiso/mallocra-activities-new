"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Download,
  Euro,
  CreditCard,
  RefreshCw,
  Clock,
  TrendingUp
} from "lucide-react"

interface PaymentStats {
  totalRevenue: number
  successfulPayments: number
  refunds: number
  pendingPayments: number
  thisMonth: number
  avgOrderValue: number
}

interface PaymentsHeaderProps {
  stats: PaymentStats
}

export default function PaymentsHeader({ stats }: PaymentsHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR"
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>Admin</span>
        <span>/</span>
        <span className="text-orange-500">Payments Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payments Management</h1>
          <p className="mt-1 text-gray-400">
            Monitor transactions, process refunds, and track revenue
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-orange-600 text-white hover:bg-orange-700">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Revenue
            </CardTitle>
            <Euro className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Successful Payments
            </CardTitle>
            <CreditCard className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.successfulPayments.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Completed transactions</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Refunds
            </CardTitle>
            <RefreshCw className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.refunds}</div>
            <p className="text-xs text-gray-500">Processed refunds</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending
            </CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.pendingPayments}
            </div>
            <p className="text-xs text-gray-500">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              This Month
            </CardTitle>
            <TrendingUp className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.thisMonth)}
            </div>
            <p className="text-xs text-gray-500">Monthly revenue</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Order Value
            </CardTitle>
            <Euro className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.avgOrderValue)}
            </div>
            <p className="text-xs text-gray-500">Per transaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
