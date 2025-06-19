"use client"

import { Suspense } from "react"
import SettingsHeader from "./_components/settings-header"
import SettingsManagement from "./_components/settings-management"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"

export default function SettingsPage() {
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
                Settings Management
              </h1>
              <p className="text-gray-400">
                Configure system settings, preferences, and integrations
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <Suspense
                fallback={<Skeleton className="h-32 w-full bg-gray-800" />}
              >
                <SettingsHeaderFetcher />
              </Suspense>

              <Suspense
                fallback={<Skeleton className="h-96 w-full bg-gray-800" />}
              >
                <SettingsManagementFetcher />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsHeaderFetcher() {
  // In a real app, fetch system stats from API
  const stats = {
    activeSettings: 47,
    recentChanges: 8,
    systemHealth: 98.5,
    lastBackup: "2024-01-20T10:30:00Z",
    totalUsers: 1247,
    storageUsed: 68.2
  }

  return <SettingsHeader stats={stats} />
}

function SettingsManagementFetcher() {
  // In a real app, fetch settings from API
  const settings = [
    {
      id: "site_name",
      category: "General",
      name: "Site Name",
      value: "Mallocra Activities",
      type: "text" as const,
      description: "The name of your website displayed in headers and titles",
      lastModified: "2024-01-15T09:30:00Z",
      modifiedBy: "Admin User"
    },
    {
      id: "site_logo",
      category: "General",
      name: "Site Logo",
      value: "/logo.png",
      type: "file" as const,
      description: "Main logo displayed in the navigation bar",
      lastModified: "2024-01-10T14:20:00Z",
      modifiedBy: "Sarah O'Connor"
    },
    {
      id: "email_notifications",
      category: "Notifications",
      name: "Email Notifications",
      value: "true",
      type: "boolean" as const,
      description: "Enable or disable email notifications for bookings",
      lastModified: "2024-01-18T11:45:00Z",
      modifiedBy: "Mike Johnson"
    },
    {
      id: "max_booking_days",
      category: "Bookings",
      name: "Max Booking Days Ahead",
      value: "90",
      type: "number" as const,
      description: "Maximum number of days in advance customers can book",
      lastModified: "2024-01-12T16:15:00Z",
      modifiedBy: "Admin User"
    },
    {
      id: "stripe_public_key",
      category: "Payments",
      name: "Stripe Public Key",
      value: "pk_test_***",
      type: "password" as const,
      description: "Stripe publishable key for payment processing",
      lastModified: "2024-01-05T08:30:00Z",
      modifiedBy: "Admin User"
    }
  ]

  return <SettingsManagement initialData={settings} />
}
