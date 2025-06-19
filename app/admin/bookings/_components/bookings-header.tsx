"use client"

import {
  Calendar,
  Plus,
  FileText,
  AlertCircle,
  DollarSign,
  Users,
  Settings,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import Link from "next/link"

export default function BookingsHeader() {
  // Mock stats for client component
  const stats = {
    total: 42,
    confirmed: 35,
    pending: 5,
    cancelled: 2,
    totalRevenue: 8450,
    totalParticipants: 127
  }

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
                Bookings
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-orange-500">
            Bookings Management
          </h1>
          <p className="text-sm text-gray-400">
            Manage customer bookings, confirmations, and payments
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <Plus className="size-4" />
            <span>New Booking</span>
          </button>

          <button className="inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
            <FileText className="size-4" />
            <span>Export Report</span>
          </button>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
          >
            <DollarSign className="size-4" />
            <span>Revenue</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-blue-600 p-2">
              <Calendar className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Confirmed</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.confirmed}
              </p>
            </div>
            <div className="rounded-lg bg-green-600 p-2">
              <CheckCircle className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-600 p-2">
              <Clock className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">
                {stats.cancelled}
              </p>
            </div>
            <div className="rounded-lg bg-red-600 p-2">
              <XCircle className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                €{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-600 p-2">
              <DollarSign className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Participants</p>
              <p className="text-2xl font-bold text-blue-400">
                {stats.totalParticipants}
              </p>
            </div>
            <div className="rounded-lg bg-indigo-600 p-2">
              <Users className="size-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
