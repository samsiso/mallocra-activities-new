"use client"

import {
  Activity,
  Plus,
  FileText,
  AlertCircle,
  TrendingUp,
  Eye,
  Settings
} from "lucide-react"
import Link from "next/link"

interface ActivityStats {
  total: number
  active: number
  draft: number
  inactive: number
}

interface ActivitiesHeaderProps {
  stats?: ActivityStats
}

export default function ActivitiesHeader({ stats }: ActivitiesHeaderProps) {
  // Use provided stats or fall back to mock data
  const activityStats = stats || {
    total: 24,
    active: 18,
    draft: 4,
    inactive: 2
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
                Activities
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-orange-500">
            Activities Management
          </h1>
          <p className="text-sm text-gray-400">
            Manage all activities, pricing, availability, and content
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <Plus className="size-4" />
            <span>New Activity</span>
          </button>

          <button className="inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
            <FileText className="size-4" />
            <span>Import</span>
          </button>

          <Link
            href="/activities"
            className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
          >
            <Eye className="size-4" />
            <span>View Live</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Activities
              </p>
              <p className="text-2xl font-bold text-white">
                {activityStats.total}
              </p>
            </div>
            <div className="rounded-lg bg-blue-600 p-2">
              <Activity className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {activityStats.active}
              </p>
            </div>
            <div className="rounded-lg bg-green-600 p-2">
              <TrendingUp className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-yellow-400">
                {activityStats.draft}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-600 p-2">
              <FileText className="size-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-red-400">
                {activityStats.inactive}
              </p>
            </div>
            <div className="rounded-lg bg-red-600 p-2">
              <AlertCircle className="size-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
