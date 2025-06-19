import { getBlogsByTagAction, getTagsAction } from "@/actions/db/blogs-actions"
import BlogCard from "../../_components/blog-card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Tag as TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import BlogListSkeleton from "../../_components/blog-list-skeleton"
import { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: tags } = await getTagsAction()
  const tag = tags?.find(t => t.slug === slug)

  if (!tag) {
    return {
      title: "Tag Not Found",
      description: "The requested tag could not be found."
    }
  }

  return {
    title: `${tag.name} - Blog Posts | We Are Excursions`,
    description: `Explore blog posts about ${tag.name} in Mallorca. Tips, guides, and insights about ${tag.name} for your next visit.`
  }
}

export default async function BlogTagPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: tags } = await getTagsAction()
  const tag = tags?.find(t => t.slug === slug)

  if (!tag) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-rose-500/30 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center text-rose-200 transition-colors hover:text-white"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Blog
            </Link>

            <div className="mb-4 flex items-center">
              <Badge className="mr-3 bg-gray-100 text-rose-800">
                <TagIcon className="mr-1 size-3" />
                Tag
              </Badge>
              <h1 className="text-4xl font-bold text-white">{tag.name}</h1>
            </div>

            <p className="text-xl text-rose-100">
              Explore articles and guides about {tag.name} in Mallorca
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<BlogListSkeleton count={9} />}>
          <BlogsByTag slug={slug} />
        </Suspense>

        <div className="mt-12">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Explore More Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags &&
              tags
                .filter(t => t.slug !== slug)
                .slice(0, 12)
                .map(otherTag => (
                  <Link
                    key={otherTag.id}
                    href={`/blog/tag/${otherTag.slug}`}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {otherTag.name}
                  </Link>
                ))}

            <Link
              href="/blog/tags"
              className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-sm text-rose-700 transition-colors duration-200 hover:bg-rose-200 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
            >
              View All Tags
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

async function BlogsByTag({ slug }: { slug: string }) {
  const { data: blogs, isSuccess } = await getBlogsByTagAction(slug)

  if (!isSuccess || !blogs || blogs.length === 0) {
    return (
      <div className="rounded-lg bg-white py-12 text-center shadow-md dark:bg-gray-800">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          No blog posts found with this tag.
        </p>
        <Link
          href="/blog"
          className="font-medium text-rose-500 hover:text-rose-600"
        >
          Browse all articles
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 text-gray-700 dark:text-gray-300">
        Found {blogs.length} article{blogs.length !== 1 ? "s" : ""} with this
        tag
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}
