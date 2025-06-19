"use client"

import { SelectBlog } from "@/db/schema"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeaturedBlogCardProps {
  blog: SelectBlog
  className?: string
}

export default function FeaturedBlogCard({
  blog,
  className
}: FeaturedBlogCardProps) {
  const categoryColor = getCategoryColor(blog.category)
  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt)
    : new Date(blog.createdAt)
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true })

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <div className="relative">
        <div className="absolute left-0 top-0 z-10 size-full bg-gradient-to-r from-rose-600/90 to-rose-600/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>

        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="h-60 w-full object-cover"
        />

        <div className="absolute left-4 top-4 z-20 flex space-x-2">
          <Badge className={`${categoryColor} text-white`}>
            {formatCategoryName(blog.category)}
          </Badge>

          <Badge
            variant="outline"
            className="border-amber-600 bg-amber-500/90 text-white"
          >
            <Star className="mr-1 size-3 fill-current" /> Featured
          </Badge>
        </div>
      </div>

      <div className="flex grow flex-col p-6">
        <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-1 size-3" />
          <span>{timeAgo}</span>

          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              {blog.authorImageUrl ? (
                <img
                  src={blog.authorImageUrl}
                  alt={blog.author}
                  className="mr-2 size-6 rounded-full"
                />
              ) : (
                <div className="mr-2 flex size-6 items-center justify-center rounded-full bg-rose-500 text-white">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {blog.author}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="transition-colors group-hover:text-rose-500"
        >
          <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            {blog.title}
          </h3>
        </Link>

        <p className="mb-6 grow text-base text-gray-600 dark:text-gray-300">
          {blog.summary}
        </p>

        <Button asChild variant="default" className="mt-auto w-full">
          <Link href={`/blog/${blog.slug}`}>
            Read Article <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
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
