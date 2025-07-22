export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { notFound } from "next/navigation"
import AdminSidebar from "@/app/admin/dashboard/_components/admin-sidebar"
import AdminBreadcrumb from "@/components/ui/admin-breadcrumb"
import ActivityEditForm from "./_components/activity-edit-form"
import { getActivityByIdSupabaseAction } from "@/actions/supabase-activities-actions"

interface EditActivityPageProps {
  params: Promise<{ id: string }>
}

export default async function EditActivityPage({
  params
}: EditActivityPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            <Suspense fallback={<EditActivitySkeleton />}>
              <EditActivityFetcher activityId={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

async function EditActivityFetcher({ activityId }: { activityId: string }) {
  const { data: activity, isSuccess } =
    await getActivityByIdSupabaseAction(activityId)

  if (!isSuccess || !activity) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Activities", href: "/admin/activities" },
          { label: activity.title, href: `/admin/activities/${activityId}` },
          { label: "Edit" }
        ]}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-orange-500">
          Edit Activity
        </h1>
        <p className="text-gray-400">
          Modify the details for "{activity.title}"
        </p>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg bg-gray-800 p-6">
        <ActivityEditForm activity={activity} />
      </div>
    </>
  )
}

function EditActivitySkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-4 w-16 rounded bg-gray-700"></div>
        <div className="size-4 rounded bg-gray-700"></div>
        <div className="h-4 w-24 rounded bg-gray-700"></div>
        <div className="size-4 rounded bg-gray-700"></div>
        <div className="h-4 w-32 rounded bg-gray-700"></div>
        <div className="size-4 rounded bg-gray-700"></div>
        <div className="h-4 w-16 rounded bg-gray-700"></div>
      </div>

      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 rounded bg-gray-700"></div>
        <div className="h-4 w-96 rounded bg-gray-700"></div>
      </div>

      {/* Form skeleton */}
      <div className="rounded-lg bg-gray-800 p-6">
        <div className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
