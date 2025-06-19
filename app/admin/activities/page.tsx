"use server"

import { Suspense } from "react"
import EnhancedActivitiesManagement from "./_components/enhanced-activities-management"
import ActivitiesHeader from "./_components/activities-header"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getActivitiesForAdminAction,
  getActivitiesStatsAction
} from "@/actions/db/activities-actions"

export default async function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-orange-500">
                Activities Management
              </h1>
              <p className="text-gray-400">
                Create, edit, and manage activity listings
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense fallback={<ActivitiesHeaderSkeleton />}>
                  <ActivitiesHeaderFetcher />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense fallback={<ActivitiesManagementSkeleton />}>
                  <ActivitiesManagementFetcher />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function ActivitiesHeaderFetcher() {
  const { data: stats, isSuccess } = await getActivitiesStatsAction()

  if (!isSuccess || !stats) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load activities statistics
      </div>
    )
  }

  return <ActivitiesHeader stats={stats} />
}

async function ActivitiesManagementFetcher() {
  const { data: activities, isSuccess } = await getActivitiesForAdminAction()

  if (!isSuccess || !activities) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load activities data
      </div>
    )
  }

  return <EnhancedActivitiesManagement initialActivities={activities} />
}

function ActivitiesHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-48 rounded bg-gray-700"></div>
        <div className="h-10 w-32 rounded bg-gray-700"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-750 rounded-lg p-4">
            <div className="mb-2 h-4 w-16 rounded bg-gray-600"></div>
            <div className="mb-2 h-8 w-12 rounded bg-gray-600"></div>
            <div className="h-3 w-24 rounded bg-gray-600"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivitiesManagementSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Search and filters skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-10 w-64 rounded bg-gray-700"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 rounded bg-gray-700"></div>
          <div className="h-10 w-24 rounded bg-gray-700"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-gray-750 overflow-hidden rounded-lg">
        <div className="h-12 border-b border-gray-600 bg-gray-700"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-750 h-16 border-b border-gray-600 last:border-b-0"
          ></div>
        ))}
      </div>
    </div>
  )
}
