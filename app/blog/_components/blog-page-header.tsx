"use server"

import { Suspense } from "react"
import { getTagsAction } from "@/actions/db/blogs-actions"
import { Tag } from "lucide-react"
import Link from "next/link"

export default async function BlogPageHeader() {
  return (
    <div className="border-b border-rose-500/30 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-white">
            Mallorca Travel Blog
          </h1>
          <p className="mb-10 text-xl text-rose-100">
            Discover insider tips, hidden gems, and everything you need to know
            about enjoying your time in Mallorca
          </p>

          <Suspense fallback={<TagsSkeleton />}>
            <PopularTags />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function PopularTags() {
  const { data: tags } = await getTagsAction()

  if (!tags || tags.length === 0) {
    return null
  }

  // Limit to first 8 tags
  const displayTags = tags.slice(0, 8)

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
        <Tag className="size-4 text-rose-300" />
        <span className="mr-2 text-rose-200">Popular Tags:</span>

        {displayTags.map(tag => (
          <Link
            key={tag.id}
            href={`/blog/tag/${tag.slug}`}
            className="rounded-full bg-white/10 px-3 py-1 text-sm text-rose-100 transition-colors duration-200 hover:bg-white/20"
          >
            {tag.name}
          </Link>
        ))}
      </div>

      <Link
        href="/blog/tags"
        className="text-sm text-rose-300 underline-offset-2 hover:text-rose-200 hover:underline"
      >
        View All Tags
      </Link>
    </div>
  )
}

function TagsSkeleton() {
  return (
    <div>
      <div className="mb-2 flex flex-wrap justify-center gap-2">
        <div className="size-4 animate-pulse rounded bg-rose-300/20" />
        <div className="mr-2 h-6 w-28 animate-pulse rounded bg-rose-300/20" />

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-full bg-rose-300/20"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <div className="mx-auto h-5 w-24 animate-pulse rounded bg-rose-300/20" />
    </div>
  )
}
