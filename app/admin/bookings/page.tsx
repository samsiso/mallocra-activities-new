export const dynamic = "force-dynamic"

import { Suspense } from "react"
import BookingsManagement from "./_components/bookings-management"
import BookingsHeader from "./_components/bookings-header"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getBookingsForAdminAction,
  getBookingsStatsAction
} from "@/actions/db/bookings-actions"

export default async function BookingsManagementPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            {/* Header Section */}
            <Suspense fallback={<BookingsHeaderSkeleton />}>
              <BookingsHeaderFetcher />
            </Suspense>

            {/* Bookings Management Section */}
            <Suspense fallback={<BookingsManagementSkeleton />}>
              <BookingsDataFetcher />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

async function BookingsHeaderFetcher() {
  const { data: stats, isSuccess } = await getBookingsStatsAction()

  if (!isSuccess || !stats) {
    return (
      <div className="mb-8 rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load booking statistics
      </div>
    )
  }

  return <BookingsHeader stats={stats} />
}

async function BookingsDataFetcher() {
  const { data: bookings, isSuccess } = await getBookingsForAdminAction()

  if (!isSuccess || !bookings) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Failed to load bookings data
      </div>
    )
  }

  return <BookingsManagement initialBookings={bookings} />
}

function BookingsHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="mb-2 h-8 w-1/3 rounded bg-gray-700"></div>
      <div className="h-4 w-1/2 rounded bg-gray-700"></div>
    </div>
  )
}

function BookingsManagementSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-4">
      {/* Stats Loading */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-800 p-4">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
            <div className="h-6 w-1/2 rounded bg-gray-700"></div>
          </div>
        ))}
      </div>

      {/* Search and filters skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-10 w-64 rounded bg-gray-700"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 rounded bg-gray-700"></div>
          <div className="h-10 w-24 rounded bg-gray-700"></div>
        </div>
      </div>

      {/* Table Loading */}
      <div className="rounded-lg bg-gray-800 p-6">
        <div className="mb-4 h-6 w-1/4 rounded bg-gray-700"></div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-gray-700"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
