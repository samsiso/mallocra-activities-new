"use client"

import {
  Users,
  Plus,
  FileText,
  Settings,
  UserCheck,
  UserX,
  Crown,
  Shield
} from "lucide-react"
import Link from "next/link"

interface UserStats {
  total: number
  active: number
  inactive: number
  premium: number
  newThisMonth: number
  totalBookings: number
}

interface UsersHeaderProps {
  stats?: UserStats
}

export default function UsersHeader({ stats }: UsersHeaderProps) {
  // Use provided stats or fall back to mock data
  const userStats = stats || {
    total: 1247,
    active: 1156,
    inactive: 91,
    premium: 234,
    newThisMonth: 89,
    totalBookings: 3421
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
                Users
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-orange-500">
            User Management
          </h1>
          <p className="text-sm text-gray-400">
            Manage customer accounts, profiles, and permissions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <Plus className="size-4" />
            <span>Add User</span>
          </button>

          <button className="inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
            <FileText className="size-4" />
            <span>Export Users</span>
          </button>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
          >
            <Users className="size-4" />
            <span>User Analytics</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {userStats.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-blue-600 p-2">
              <Users className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-green-400">
                {userStats.active.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-green-600 p-2">
              <UserCheck className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-red-400">
                {userStats.inactive}
              </p>
            </div>
            <div className="rounded-lg bg-red-600 p-2">
              <UserX className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Premium</p>
              <p className="text-2xl font-bold text-yellow-400">
                {userStats.premium}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-600 p-2">
              <Crown className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                New This Month
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {userStats.newThisMonth}
              </p>
            </div>
            <div className="rounded-lg bg-indigo-600 p-2">
              <Plus className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-purple-400">
                {userStats.totalBookings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-purple-600 p-2">
              <Shield className="size-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
