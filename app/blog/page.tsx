import { getBlogsAction } from "@/actions/db/blogs-actions"
import BlogCard from "./_components/blog-card"
import FeaturedBlogCard from "./_components/featured-blog-card"
import BlogPageHeader from "./_components/blog-page-header"
import { Suspense } from "react"
import BlogListSkeleton from "./_components/blog-list-skeleton"
import TourismCategoriesSection from "./_components/tourism-categories-section"
import TravelTipsWidget from "./_components/travel-tips-widget"
import SeasonalContentSection from "./_components/seasonal-content-section"

export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <BlogPageHeader />

      <div className="container mx-auto px-4 py-12">
        {/* Tourism Categories Showcase */}
        <TourismCategoriesSection />

        {/* Featured Articles Section */}
        <Suspense fallback={<BlogListSkeleton featured={true} />}>
          <FeaturedBlogsSection />
        </Suspense>

        {/* Travel Tips & Quick Info */}
        <TravelTipsWidget />

        {/* Seasonal Content */}
        <SeasonalContentSection />

        {/* Latest Articles Grid */}
        <div className="my-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Latest Travel Guides
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Discover the best of Mallorca with our insider guides, local tips,
              and seasonal recommendations
            </p>
          </div>
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function FeaturedBlogsSection() {
  const { data: featuredBlogs } = await getBlogsAction(
    1,
    3,
    undefined,
    undefined,
    true
  )

  if (!featuredBlogs || featuredBlogs.length === 0) {
    return null
  }

  return (
    <div className="my-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Must-Read Travel Guides
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Essential reads for your Mallorca adventure - handpicked by our local
          experts
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {featuredBlogs.map(blog => (
          <FeaturedBlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

async function BlogList() {
  const { data: blogs } = await getBlogsAction(12)

  if (!blogs || blogs.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 py-12 text-center backdrop-blur-sm">
        <p className="text-gray-400">No blog posts found.</p>
        <p className="mt-2 text-sm text-gray-500">
          Check back soon for the latest travel guides and tips!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
