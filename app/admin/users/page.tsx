"use server"

import { Suspense } from "react"
import UsersHeader from "./_components/users-header"
import UsersManagement from "./_components/users-management"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getUsersForAdminAction,
  getUsersStatsAction
} from "@/actions/db/users-actions"

export default async function UsersPage() {
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
                Users Management
              </h1>
              <p className="text-gray-400">
                Manage user accounts, permissions, and activity
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense fallback={<UsersHeaderSkeleton />}>
                  <UsersHeaderFetcher />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense fallback={<UsersManagementSkeleton />}>
                  <UsersManagementFetcher />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function UsersHeaderFetcher() {
  const { data: stats, isSuccess } = await getUsersStatsAction()

  if (!isSuccess || !stats) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load user statistics
      </div>
    )
  }

  return <UsersHeader stats={stats} />
}

async function UsersManagementFetcher() {
  const { data: users, isSuccess } = await getUsersForAdminAction()

  if (!isSuccess || !users) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load users data
      </div>
    )
  }

  return <UsersManagement initialUsers={users} />
}

function UsersHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-48 rounded bg-gray-700"></div>
        <div className="h-10 w-32 rounded bg-gray-700"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-750 rounded-lg p-4">
            <div className="mb-2 h-4 w-16 rounded bg-gray-600"></div>
            <div className="mb-2 h-8 w-12 rounded bg-gray-600"></div>
            <div className="h-3 w-20 rounded bg-gray-600"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersManagementSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Search and filters skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-10 w-64 rounded bg-gray-700"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 rounded bg-gray-700"></div>
          <div className="h-10 w-24 rounded bg-gray-700"></div>
          <div className="h-10 w-24 rounded bg-gray-700"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-gray-750 overflow-hidden rounded-lg">
        <div className="h-12 border-b border-gray-600 bg-gray-700"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-750 h-16 border-b border-gray-600 last:border-b-0"
          ></div>
        ))}
      </div>
    </div>
  )
}
