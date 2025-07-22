export const dynamic = "force-dynamic"

import { Suspense } from "react"
import MediaHeader from "./_components/media-header"
import MediaManagement from "./_components/media-management"
import MediaOrganization from "./_components/media-organization"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getMediaStatsAction,
  getMediaFilesAction
} from "@/actions/db/media-actions"

export default async function MediaPage() {
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
                Media Management
              </h1>
              <p className="text-gray-400">
                Upload, organize, and manage activity images and videos
              </p>
            </div>

            {/* Stats Header */}
            <div className="mb-6">
              <Suspense
                fallback={<Skeleton className="h-32 w-full bg-gray-800" />}
              >
                <MediaHeaderFetcher />
              </Suspense>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="browse" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 lg:w-96">
                <TabsTrigger
                  value="browse"
                  className="data-[state=active]:bg-orange-600"
                >
                  Browse Media
                </TabsTrigger>
                <TabsTrigger
                  value="organize"
                  className="data-[state=active]:bg-orange-600"
                >
                  Organize Files
                </TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-800" />}
                >
                  <MediaManagementFetcher />
                </Suspense>
              </TabsContent>

              <TabsContent value="organize" className="space-y-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-800" />}
                >
                  <MediaOrganizationFetcher />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

async function MediaHeaderFetcher() {
  const { data: stats } = await getMediaStatsAction()

  if (!stats) {
    return <div className="text-red-400">Failed to load media stats</div>
  }

  return <MediaHeader stats={stats} />
}

async function MediaManagementFetcher() {
  const { data: mediaFiles } = await getMediaFilesAction(
    undefined,
    undefined,
    100
  ) // Get more files

  // Transform media files to match component interface (show ALL files, not just activity-assigned ones)
  const compatibleFiles = (mediaFiles || []).map(file => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.url,
    uploadedAt: file.uploadedAt,
    activityId: file.activityId || "unassigned", // Default for unassigned files
    activityName: file.activityName || "Unassigned Media" // Default name
  }))

  return <MediaManagement initialData={compatibleFiles} />
}

async function MediaOrganizationFetcher() {
  const { data: mediaFiles } = await getMediaFilesAction(
    undefined,
    undefined,
    200
  ) // Get all files

  // Transform for organization component
  const organizationFiles = (mediaFiles || []).map(file => ({
    id: file.id,
    name: file.name,
    type: file.type,
    url: file.url,
    activityName: file.activityName || "Unassigned Media"
  }))

  return <MediaOrganization mediaFiles={organizationFiles} />
}
