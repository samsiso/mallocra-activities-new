"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  CheckSquare,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import SortableTable, { SortableColumn } from "../../_components/sortable-table"
import CSVExport from "../../_components/csv-export"

interface Booking {
  id: string
  activityId: string
  activityTitle: string
  customerName: string
  customerEmail: string
  totalParticipants: number
  totalAmount: number
  status: string
  bookingDate: Date
  activityDate: Date
  createdAt: Date
  updatedAt: Date
}

interface BookingsManagementProps {
  initialBookings?: any[]
}

export default function BookingsManagement({
  initialBookings = []
}: BookingsManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(!initialBookings.length)

  // Load and format bookings from server data
  useEffect(() => {
    formatBookings(initialBookings)
  }, [initialBookings])

  const formatBookings = (rawBookings: any[]) => {
    const formatted: Booking[] = rawBookings.map(booking => ({
      id: booking.id,
      activityId: booking.activityId,
      activityTitle:
        booking.activity?.title || `Activity ${booking.activityId}`,
      customerName: booking.customerName || "Unknown Customer",
      customerEmail: booking.customerEmail || "",
      totalParticipants: booking.participants || 1,
      totalAmount: parseFloat(booking.totalAmount?.toString()) || 0,
      status: booking.status || "pending",
      bookingDate: new Date(booking.bookingDate),
      activityDate: new Date(booking.activityDate),
      createdAt: new Date(booking.createdAt),
      updatedAt: new Date(booking.updatedAt)
    }))
    setBookings(formatted)
    setIsLoading(false)
  }

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        booking =>
          booking.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.customerEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.activityTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(
            booking =>
              booking.activityDate >= today &&
              booking.activityDate <
                new Date(today.getTime() + 24 * 60 * 60 * 1000)
          )
          break
        case "week":
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(
            booking =>
              booking.activityDate >= today &&
              booking.activityDate <= weekFromNow
          )
          break
        case "month":
          const monthFromNow = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
          )
          filtered = filtered.filter(
            booking =>
              booking.activityDate >= today &&
              booking.activityDate <= monthFromNow
          )
          break
      }
    }

    return filtered
  }, [bookings, searchQuery, statusFilter, dateFilter])

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id))
    }
  }

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  // Bulk actions
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedBookings.length === 0) return

    try {
      // In real implementation, this would call the API
      setBookings(prev =>
        prev.map(booking =>
          selectedBookings.includes(booking.id)
            ? { ...booking, status: newStatus }
            : booking
        )
      )
      setSelectedBookings([])
    } catch (error) {
      console.error("Error updating bookings:", error)
    }
  }

  // Table columns configuration
  const columns: SortableColumn[] = [
    {
      key: "select",
      label: "",
      sortable: false,
      width: "w-12",
      render: (_, booking) => (
        <button
          onClick={() => handleSelectBooking(booking.id)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {selectedBookings.includes(booking.id) ? (
            <CheckSquare className="size-4 text-orange-500" />
          ) : (
            <Square className="size-4" />
          )}
        </button>
      )
    },
    {
      key: "id",
      label: "Booking ID",
      sortable: true,
      width: "w-32",
      render: id => (
        <span className="font-mono text-sm text-orange-400">
          #{id.slice(-6).toUpperCase()}
        </span>
      )
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (name, booking) => (
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-400">{booking.customerEmail}</p>
        </div>
      )
    },
    {
      key: "activityTitle",
      label: "Activity",
      sortable: true,
      render: (title, booking) => (
        <Link
          href={`/activities/${booking.activityId}`}
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          {title}
        </Link>
      )
    },
    {
      key: "totalParticipants",
      label: "Participants",
      sortable: true,
      render: participants => (
        <span className="text-gray-300">{participants} people</span>
      )
    },
    {
      key: "totalAmount",
      label: "Amount",
      sortable: true,
      render: amount => (
        <span className="font-medium text-green-400">
          €{amount.toLocaleString()}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: status => {
        const statusStyles = {
          confirmed: "bg-green-600 text-green-100",
          pending: "bg-yellow-600 text-yellow-100",
          cancelled: "bg-red-600 text-red-100",
          completed: "bg-blue-600 text-blue-100"
        }
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-600 text-gray-100"}`}
          >
            {status}
          </span>
        )
      }
    },
    {
      key: "activityDate",
      label: "Activity Date",
      sortable: true,
      render: date => new Date(date).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      width: "w-32",
      render: (_, booking) => (
        <div className="flex items-center space-x-1">
          <Link
            href={`/booking/${booking.id}`}
            className="p-1 text-gray-400 transition-colors hover:text-blue-400"
            title="View Details"
          >
            <Eye className="size-4" />
          </Link>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-green-400"
            title="Edit Booking"
          >
            <Edit className="size-4" />
          </button>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-purple-400"
            title="Contact Customer"
          >
            <Mail className="size-4" />
          </button>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-red-400"
            title="Cancel Booking"
          >
            <XCircle className="size-4" />
          </button>
        </div>
      )
    }
  ]

  if (isLoading) {
    return (
      <div className="rounded-lg bg-gray-800 p-8 text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, customers, activities..."
              className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Date Filter */}
          <select
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Export */}
          <CSVExport />
        </div>

        {/* Bulk Actions */}
        {selectedBookings.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
            <span className="text-sm text-white">
              {selectedBookings.length} bookings selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange("confirmed")}
                className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => handleBulkStatusChange("cancelled")}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={() => console.log("Send emails to selected customers")}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Email Customers
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>

        {/* Select All */}
        <button
          onClick={handleSelectAll}
          className="flex items-center space-x-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          {selectedBookings.length === filteredBookings.length ? (
            <CheckSquare className="size-4 text-orange-500" />
          ) : (
            <Square className="size-4" />
          )}
          <span>Select All</span>
        </button>
      </div>

      {/* Bookings Table */}
      <SortableTable
        columns={columns}
        data={filteredBookings}
        defaultSort={{ key: "createdAt", direction: "desc" }}
        onRowClick={booking => console.log("Row clicked:", booking)}
        rowClassName={booking =>
          selectedBookings.includes(booking.id)
            ? "bg-gray-750 border-l-4 border-orange-500"
            : ""
        }
      />
    </div>
  )
}
