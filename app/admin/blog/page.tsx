"use server"

import { Suspense } from "react"
import BlogHeader from "./_components/blog-header"
import BlogManagement from "./_components/blog-management"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"

// Mock data to avoid server action issues
const mockBlogStats = {
  totalPosts: 47,
  published: 42,
  drafts: 4,
  scheduled: 1,
  totalViews: 28947,
  thisMonth: 12,
  avgViews: 616,
  topCategory: "Adventure",
  popularTags: [
    { tag: "hiking", count: 18 },
    { tag: "adventure", count: 15 },
    { tag: "mallorca", count: 12 },
    { tag: "safety", count: 9 },
    { tag: "water-sports", count: 8 },
    { tag: "cultural", count: 6 }
  ]
}

const mockBlogPosts = [
  {
    id: "blog-1",
    title: "Top 10 Adventure Activities in Mallorca",
    slug: "top-10-adventure-activities-mallorca",
    excerpt:
      "Discover the most thrilling outdoor activities Mallorca has to offer, from coasteering to mountain hiking...",
    status: "published" as const,
    author: "Sarah O'Connor",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    views: 2847,
    category: "Adventure",
    tags: ["hiking", "adventure", "mallorca", "coasteering"]
  },
  {
    id: "blog-2",
    title: "Safety Tips for Mountain Hiking in Serra de Tramuntana",
    slug: "safety-tips-mountain-hiking-serra-tramuntana",
    excerpt:
      "Essential safety guidelines for a successful mountain hiking experience in Mallorca's UNESCO World Heritage site...",
    status: "published" as const,
    author: "Mike Johnson",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    views: 1892,
    category: "Safety",
    tags: ["hiking", "safety", "serra-tramuntana", "mountains"]
  },
  {
    id: "blog-3",
    title: "Best Kayaking Spots for Beginners in Mallorca",
    slug: "best-kayaking-spots-beginners-mallorca",
    excerpt:
      "A comprehensive guide to the most beginner-friendly kayaking locations around the island...",
    status: "draft" as const,
    author: "Emma Walsh",
    publishedAt: null,
    views: 0,
    category: "Water Sports",
    tags: ["kayaking", "beginners", "water-sports", "mallorca"]
  }
]

export default async function BlogPage() {
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
                  <BlogHeader stats={mockBlogStats} />
                </Suspense>
              </div>

              <div className="rounded-lg bg-gray-800 p-6">
                <Suspense
                  fallback={<Skeleton className="h-96 w-full bg-gray-700" />}
                >
                  <BlogManagement initialData={mockBlogPosts} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
