import { Suspense } from "react"
import BlogHeader from "./_components/blog-header"
import BlogManagement from "./_components/blog-management"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getBlogPostsAction,
  getBlogStatsAction,
  getBlogCategoriesAction
} from "@/actions/db/blog-server-actions"

export default async function BlogPage() {
  // Fetch real data from database
  const [statsResult, postsResult, categoriesResult] = await Promise.all([
    getBlogStatsAction(),
    getBlogPostsAction({ limit: 50 }),
    getBlogCategoriesAction()
  ])

  // Transform stats data for the header component
  const blogStats =
    statsResult.isSuccess && statsResult.data
      ? {
          ...statsResult.data,
          thisMonth: 0, // TODO: Calculate from actual data
          avgViews:
            statsResult.data.totalPosts > 0
              ? Math.round(
                  statsResult.data.totalViews / statsResult.data.totalPosts
                )
              : 0,
          topCategory: categoriesResult.data?.[0]?.name || "Activities",
          popularTags: [] // TODO: Implement tag counting
        }
      : {
          totalPosts: 0,
          published: 0,
          drafts: 0,
          scheduled: 0,
          totalViews: 0,
          thisMonth: 0,
          avgViews: 0,
          topCategory: "Activities",
          popularTags: []
        }

  // Transform posts data for the management component
  const blogPosts =
    postsResult.isSuccess && postsResult.data
      ? postsResult.data.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          status: post.status,
          author: post.author?.fullName || "Unknown",
          publishedAt: post.publishedAt,
          views: post.views,
          category: post.category || "Uncategorized",
          tags: post.tags || []
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
                Blog Management
              </h1>
              <p className="text-gray-400">
                Create, edit, and manage blog posts and content
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-32 w-full bg-gray-700" />}
                >
                  <BlogHeader stats={blogStats} />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-700" />}
                >
                  <BlogManagement initialData={blogPosts} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
