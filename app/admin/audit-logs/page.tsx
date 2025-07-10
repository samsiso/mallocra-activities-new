import { Suspense } from "react"
import AuditLogHeader from "./_components/audit-log-header"
import AuditLogViewer from "./_components/audit-log-viewer"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getAuditLogsAction,
  getAuditLogStatsAction
} from "@/actions/db/audit-log-actions"

export default async function AuditLogsPage() {
  // Fetch initial data
  const [logsResult, statsResult] = await Promise.all([
    getAuditLogsAction({ limit: 50 }),
    getAuditLogStatsAction()
  ])

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
                Audit Logs
              </h1>
              <p className="text-gray-400">
                Track and monitor all system activities and changes
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-32 w-full bg-gray-700" />}
                >
                  <AuditLogHeader
                    stats={
                      statsResult.data || {
                        totalLogs: 0,
                        todayLogs: 0,
                        criticalEvents: 0,
                        topActions: [],
                        topUsers: [],
                        severityBreakdown: []
                      }
                    }
                  />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-700" />}
                >
                  <AuditLogViewer
                    initialLogs={logsResult.data?.logs || []}
                    totalCount={logsResult.data?.total || 0}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
