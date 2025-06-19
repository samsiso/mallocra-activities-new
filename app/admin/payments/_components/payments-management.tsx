"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  User,
  CreditCard,
  Euro
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import SortableTable from "@/app/admin/_components/sortable-table"

interface Payment {
  id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed" | "refunded"
  customerEmail: string
  customerName: string
  activityName: string
  paymentMethod: string
  createdAt: string
  stripeChargeId: string | null
}

interface PaymentsManagementProps {
  initialData: Payment[]
}

export default function PaymentsManagement({
  initialData
}: PaymentsManagementProps) {
  const [payments, setPayments] = useState<Payment[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter
    const matchesMethod =
      methodFilter === "all" || payment.paymentMethod === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: (currency || "EUR").toUpperCase()
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return <Badge className="bg-green-600 text-white">Succeeded</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-600 text-white">Failed</Badge>
      case "refunded":
        return <Badge className="bg-gray-600 text-white">Refunded</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="size-4 text-blue-500" />
      case "bank_transfer":
        return <Euro className="size-4 text-green-500" />
      default:
        return <CreditCard className="size-4 text-gray-500" />
    }
  }

  const handleRefund = (paymentId: string) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: "refunded" as const }
          : payment
      )
    )
  }

  const handleViewDetails = (paymentId: string) => {
    console.log("View payment details:", paymentId)
    // Navigate to payment details page or open modal
  }

  const columns = [
    {
      key: "id",
      label: "Payment ID",
      sortable: true,
      render: (payment: Payment) => (
        <div className="space-y-1">
          <div className="font-mono text-sm text-white">{payment.id}</div>
          {payment.stripeChargeId && (
            <div className="text-xs text-gray-400">
              Stripe: {payment.stripeChargeId}
            </div>
          )}
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (payment: Payment) => (
        <div className="font-medium text-white">
          {formatCurrency(payment.amount, payment.currency)}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (payment: Payment) => getStatusBadge(payment.status)
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (payment: Payment) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className="size-4 text-gray-400" />
            <span className="font-medium text-white">
              {payment.customerName}
            </span>
          </div>
          <div className="text-sm text-gray-400">{payment.customerEmail}</div>
        </div>
      )
    },
    {
      key: "activityName",
      label: "Activity",
      sortable: true,
      render: (payment: Payment) => (
        <div className="max-w-xs truncate text-white">
          {payment.activityName}
        </div>
      )
    },
    {
      key: "paymentMethod",
      label: "Method",
      sortable: true,
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2">
          {getPaymentMethodIcon(payment.paymentMethod || "unknown")}
          <span className="capitalize text-white">
            {(payment.paymentMethod || "unknown").replace("_", " ")}
          </span>
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="size-4 text-gray-400" />
          <span>{formatDate(payment.createdAt)}</span>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (payment: Payment) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(payment.id)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Eye className="size-3" />
          </Button>
          {payment?.status === "succeeded" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRefund(payment.id)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <RefreshCw className="size-3" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const paymentMethods = Array.from(
    new Set(payments.map(payment => payment.paymentMethod))
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search payments, customers, activities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Methods</SelectItem>
            {paymentMethods.map(method => (
              <SelectItem key={method} value={method}>
                {method
                  .replace("_", " ")
                  .replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-white">
        <span className="font-medium">{filteredPayments.length}</span>
        <span className="ml-1 text-gray-400">
          payment{filteredPayments.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Payments Table */}
      <SortableTable
        data={filteredPayments}
        columns={columns}
        className="border-gray-700 bg-gray-800"
      />

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="py-12 text-center">
          <CreditCard className="mx-auto mb-4 size-12 text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-white">
            No payments found
          </h3>
          <p className="text-gray-400">
            {searchTerm || statusFilter !== "all" || methodFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No payment transactions to display"}
          </p>
        </div>
      )}
    </div>
  )
}
