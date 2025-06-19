import { getTagsAction } from "@/actions/db/blogs-actions"
import Link from "next/link"
import { ArrowLeft, Tag as TagIcon } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Tags | We Are Excursions",
  description:
    "Browse all topics and tags from our Mallorca travel blog. Find articles on activities, destinations, local culture, and travel tips."
}

export default async function BlogTagsPage() {
  const { data: tags } = await getTagsAction()

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

            <h1 className="mb-4 text-4xl font-bold text-white">Blog Tags</h1>

            <p className="text-xl text-rose-100">
              Browse all topics from our Mallorca travel blog
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
            <div className="mb-6 flex items-center">
              <TagIcon className="mr-2 size-5 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Tags ({tags?.length || 0})
              </h2>
            </div>

            {!tags || tags.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  No tags found.
                </p>
                <Link
                  href="/blog"
                  className="font-medium text-rose-500 hover:text-rose-600"
                >
                  Browse articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="group flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-rose-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-rose-900/20"
                  >
                    <TagIcon className="mr-2 size-4 text-gray-400 transition-colors group-hover:text-rose-500" />
                    <span className="text-gray-700 transition-colors group-hover:text-rose-600 dark:text-gray-300 dark:group-hover:text-rose-300">
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Looking for something specific?
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center font-medium text-rose-500 hover:text-rose-600"
              >
                Browse all articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
