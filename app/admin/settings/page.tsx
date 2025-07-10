import { Suspense } from "react"
import SettingsHeader from "./_components/settings-header"
import SettingsManagement from "./_components/settings-management"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getSystemSettingsAction,
  getSettingsStatsAction,
  getFeatureFlagsAction,
  getEmailTemplatesAction
} from "@/actions/db/settings-server-actions"
import { supabaseAdminClient } from "@/lib/supabase-server"

export default async function SettingsPage() {
  // Fetch real data from database
  const [statsResult, settingsResult, flagsResult, templatesResult] =
    await Promise.all([
      getSettingsStatsAction(),
      getSystemSettingsAction(),
      getFeatureFlagsAction(),
      getEmailTemplatesAction()
    ])

  // Get total users count
  const { count: totalUsers } = await supabaseAdminClient
    .from("users_profiles")
    .select("*", { count: "exact", head: true })

  // Transform stats data for the header component
  const systemStats =
    statsResult.isSuccess && statsResult.data
      ? {
          activeSettings: statsResult.data.totalSettings,
          recentChanges: statsResult.data.recentChanges,
          systemHealth: 98.5, // TODO: Calculate based on monitoring data
          lastBackup: new Date().toISOString(), // TODO: Get from backup system
          totalUsers: totalUsers || 0,
          storageUsed: 45.2 // TODO: Calculate from actual storage metrics
        }
      : {
          activeSettings: 0,
          recentChanges: 0,
          systemHealth: 100,
          lastBackup: new Date().toISOString(),
          totalUsers: 0,
          storageUsed: 0
        }

  // Transform settings data for the management component
  const systemSettings =
    settingsResult.isSuccess && settingsResult.data
      ? settingsResult.data.map(setting => ({
          id: setting.key,
          category:
            setting.category.charAt(0).toUpperCase() +
            setting.category.slice(1),
          name: setting.label,
          value: setting.value,
          type: mapSettingType(setting.type),
          description: setting.description || "",
          lastModified: setting.updatedAt,
          modifiedBy: setting.updatedBy || "System"
        }))
      : []

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
              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-32 w-full bg-gray-700" />}
                >
                  <SettingsHeader stats={systemStats} />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-700" />}
                >
                  <SettingsManagement initialData={systemSettings} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to map database types to UI types
function mapSettingType(
  dbType: string
): "text" | "number" | "boolean" | "file" | "password" {
  switch (dbType) {
    case "text":
    case "select":
    case "multiselect":
      return "text"
    case "number":
      return "number"
    case "boolean":
      return "boolean"
    case "color":
    case "date":
    case "time":
      return "text"
    case "json":
      return "text" // Could be handled specially if needed
    default:
      return "text"
  }
}
