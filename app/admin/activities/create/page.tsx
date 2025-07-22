export const dynamic = "force-dynamic"

import AdminSidebar from "@/app/admin/dashboard/_components/admin-sidebar"
import AdminBreadcrumb from "@/components/ui/admin-breadcrumb"
import ActivityCreateForm from "./_components/activity-create-form"

export default async function CreateActivityPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb
              items={[
                { label: "Activities", href: "/admin/activities" },
                { label: "Create New Activity" }
              ]}
            />

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-orange-500">
                Create New Activity
              </h1>
              <p className="text-gray-400">
                Add a new activity to your catalog
              </p>
            </div>

            {/* Create Form */}
            <div className="rounded-lg bg-gray-800 p-6">
              <ActivityCreateForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
