"use client"

import { SelectBlog } from "@/db/schema"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BlogCardProps {
  blog: SelectBlog
  className?: string
}

export default function BlogCard({ blog, className }: BlogCardProps) {
  const categoryColor = getCategoryColor(blog.category)
  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt)
    : new Date(blog.createdAt)
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true })

  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10",
        className
      )}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge className={`${categoryColor} border-0 text-white`}>
            {formatCategoryName(blog.category)}
          </Badge>
        </div>
        {blog.isFeatured && (
          <div className="absolute right-3 top-3">
            <Badge className="border-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              <Tag className="mr-1 size-3" /> Featured
            </Badge>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex grow flex-col p-6">
        <div className="mb-3 flex items-center text-sm text-gray-400">
          <Calendar className="mr-1 size-3" />
          <span>{timeAgo}</span>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="transition-colors group-hover:text-rose-400"
        >
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white">
            {blog.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 grow text-sm text-gray-300">
          {blog.summary}
        </p>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {blog.authorImageUrl ? (
                <img
                  src={blog.authorImageUrl}
                  alt={blog.author}
                  className="mr-3 size-8 rounded-full ring-2 ring-white/20"
                />
              ) : (
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-sm font-medium text-white ring-2 ring-white/20">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-300">
                {blog.author}
              </span>
            </div>

            <Link
              href={`/blog/${blog.slug}`}
              className="text-sm font-medium text-rose-400 transition-colors hover:text-rose-300"
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "travel_guide":
      return "bg-gradient-to-r from-blue-500 to-cyan-400"
    case "activity_spotlight":
      return "bg-gradient-to-r from-green-500 to-emerald-400"
    case "local_culture":
      return "bg-gradient-to-r from-purple-500 to-violet-400"
    case "tips_and_tricks":
      return "bg-gradient-to-r from-yellow-500 to-amber-400"
    case "seasonal_guide":
      return "bg-gradient-to-r from-orange-500 to-red-400"
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-400"
  }
}

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
