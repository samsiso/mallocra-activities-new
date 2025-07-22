import {
  getBlogBySlugAction,
  getBlogTagsAction,
  getRelatedBlogsAction
} from "@/actions/db/blogs-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Eye, Tag, ArrowLeft } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import BlogCard from "../_components/blog-card"
import { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: blog } = await getBlogBySlugAction(slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found."
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.summary,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.summary,
      images: [{ url: blog.imageUrl }]
    }
  }
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: blog } = await getBlogBySlugAction(slug)

  if (!blog) {
    notFound()
  }

  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt)
    : new Date(blog.createdAt)
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true })
  const formattedDate = format(publishedAt, "MMMM d, yyyy")

  // Estimate reading time (avg reading speed: 225 words per minute)
  const wordCount = blog.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 225)

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-900">
      {/* Hero section with image */}
      <div className="relative h-96 w-full">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/30"></div>
        <img
          src={blog.imageUrl || ""}
          alt={blog.title || ""}
          className="size-full object-cover"
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge
                className={`${getCategoryColor(blog.category)} text-white`}
              >
                {formatCategoryName(blog.category)}
              </Badge>

              {blog.isFeatured && (
                <Badge
                  variant="outline"
                  className="border-amber-600 bg-amber-500/80 text-white"
                >
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-200">
              <div className="flex items-center">
                {blog.authorImageUrl ? (
                  <img
                    src={blog.authorImageUrl}
                    alt={blog.author}
                    className="mr-2 size-8 rounded-full"
                  />
                ) : (
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-rose-500 text-white">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{blog.author}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-1 size-4" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center">
                <Clock className="mr-1 size-4" />
                <span>{readingTime} min read</span>
              </div>

              <div className="flex items-center">
                <Eye className="mr-1 size-4" />
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="rounded-lg bg-white p-6 shadow-md lg:p-10 dark:bg-gray-800">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center text-rose-500 hover:text-rose-600"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Blog
              </Link>

              <div className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-rose-500 hover:prose-a:text-rose-600 mb-10 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              {/* Tags */}
              <Suspense>
                <BlogTags blogId={blog.id} />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  About the Author
                </h3>
                <div className="mb-4 flex items-center">
                  {blog.authorImageUrl ? (
                    <img
                      src={blog.authorImageUrl}
                      alt={blog.author}
                      className="mr-4 size-16 rounded-full"
                    />
                  ) : (
                    <div className="mr-4 flex size-16 items-center justify-center rounded-full bg-rose-500 text-xl text-white">
                      {blog.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {blog.author}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Travel Expert
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Local expert sharing insider tips and guides to help you
                  discover the best of Mallorca.
                </p>
              </div>

              {/* Related Articles */}
              <Suspense>
                <RelatedArticles blogId={blog.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function BlogTags({ blogId }: { blogId: string }) {
  const { data: tags } = await getBlogTagsAction(blogId)

  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div>
      <Separator className="my-8" />
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
        <div className="flex items-center">
          <Tag className="mr-2 size-4 text-rose-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Tags:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

async function RelatedArticles({ blogId }: { blogId: string }) {
  const { data: relatedBlogs } = await getRelatedBlogsAction(blogId)

  if (!relatedBlogs || relatedBlogs.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
        Related Articles
      </h3>

      <div className="space-y-6">
        {relatedBlogs.map(blog => (
          <div key={blog.id} className="group">
            <Link href={`/blog/${blog.slug}`} className="mb-2 block">
              <div className="mb-2 aspect-video overflow-hidden rounded-lg">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="font-medium text-gray-900 transition-colors group-hover:text-rose-500 dark:text-white">
                {blog.title}
              </h4>
            </Link>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(
                new Date(blog.publishedAt || blog.createdAt),
                { addSuffix: true }
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="text-sm font-medium text-rose-500 hover:text-rose-600"
        >
          View All Articles
        </Link>
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "travel_guide":
      return "bg-blue-500"
    case "activity_spotlight":
      return "bg-green-500"
    case "local_culture":
      return "bg-purple-500"
    case "tips_and_tricks":
      return "bg-yellow-500"
    case "seasonal_guide":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
