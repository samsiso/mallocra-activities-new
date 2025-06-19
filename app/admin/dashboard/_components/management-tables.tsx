"use server"

import {
  Table,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { getActivitiesAction } from "@/actions/db/activities-actions"
import { getBookingsAction } from "@/actions/db/bookings-actions"

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    confirmed: { color: "bg-green-600 text-green-100", icon: CheckCircle },
    pending: { color: "bg-yellow-600 text-yellow-100", icon: Clock },
    cancelled: { color: "bg-red-600 text-red-100", icon: XCircle },
    completed: { color: "bg-blue-600 text-blue-100", icon: CheckCircle },
    active: { color: "bg-green-600 text-green-100", icon: CheckCircle },
    draft: { color: "bg-gray-600 text-gray-100", icon: Clock },
    inactive: { color: "bg-red-600 text-red-100", icon: XCircle }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: "bg-gray-600 text-gray-100",
    icon: Clock
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
    >
      <Icon className="mr-1 size-3" />
      {status}
    </span>
  )
}

async function getManagementData() {
  try {
    const [activitiesResponse, bookingsResponse] = await Promise.all([
      getActivitiesAction(),
      getBookingsAction()
    ])

    const activities = activitiesResponse.isSuccess
      ? activitiesResponse.data.slice(0, 5)
      : []

    const bookings = bookingsResponse.isSuccess
      ? bookingsResponse.data.slice(0, 5)
      : []

    return { activities, bookings }
  } catch (error) {
    console.error("Error fetching management data:", error)
    return { activities: [], bookings: [] }
  }
}

export default async function ManagementTables() {
  const { activities, bookings } = await getManagementData()

  return (
    <div className="space-y-8">
      {/* Recent Activities Table */}
      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center text-xl font-semibold text-orange-500">
              <Table className="mr-2 size-5" />
              Recent Activities
            </h3>
            <Link
              href="/admin/activities"
              className="flex items-center text-sm font-medium text-orange-500 hover:text-orange-400"
            >
              View All
              <ExternalLink className="ml-1 size-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                <th className="p-4 font-medium">Activity</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Bookings</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No activities found
                  </td>
                </tr>
              ) : (
                activities.map(activity => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-700 transition-colors hover:bg-gray-700"
                  >
                    <td className="p-4">
                      <div>
                        <p className="max-w-xs truncate font-medium text-white">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Created{" "}
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-300">
                        {activity.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{activity.location}</td>
                    <td className="p-4">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="p-4 text-gray-300">
                      {activity.totalBookings || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 transition-colors hover:text-orange-500">
                          <Eye className="size-4" />
                        </button>
                        <button className="p-1 text-gray-400 transition-colors hover:text-orange-500">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1 text-gray-400 transition-colors hover:text-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center text-xl font-semibold text-orange-500">
              <Table className="mr-2 size-5" />
              Recent Bookings
            </h3>
            <Link
              href="/admin/bookings"
              className="flex items-center text-sm font-medium text-orange-500 hover:text-orange-400"
            >
              View All
              <ExternalLink className="ml-1 size-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                <th className="p-4 font-medium">Booking Ref</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Participants</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-700 transition-colors hover:bg-gray-700"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">
                          {booking.bookingReference}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-300">
                          {booking.leadCustomerName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.leadCustomerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-300">
                      {booking.totalParticipants}
                    </td>
                    <td className="p-4 text-gray-300">
                      €{booking.totalAmount}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 transition-colors hover:text-orange-500">
                          <Eye className="size-4" />
                        </button>
                        <button className="p-1 text-gray-400 transition-colors hover:text-orange-500">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1 text-gray-400 transition-colors hover:text-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
