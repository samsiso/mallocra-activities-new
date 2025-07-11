"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system"
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Heart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface BlogCardEnhancedProps {
  id: string
  title: string
  excerpt: string
  slug: string
  featuredImage?: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: Date
  readingTime: number
  category: {
    name: string
    slug: string
    color?: string
  }
  tags?: string[]
  viewCount?: number
  likeCount?: number
  variant?: "standard" | "featured" | "compact" | "horizontal"
  onLike?: () => void
  className?: string
  isPopular?: boolean
}

export function BlogCardEnhanced({
  id,
  title,
  excerpt,
  slug,
  featuredImage,
  author,
  publishedAt,
  readingTime,
  category,
  tags = [],
  viewCount = 0,
  likeCount = 0,
  variant = "standard",
  onLike,
  className,
  isPopular = false
}: BlogCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    onLike?.()
  }

  const categoryColors = {
    guide: "from-blue-500 to-blue-600",
    tips: "from-green-500 to-green-600",
    destination: "from-purple-500 to-purple-600",
    activity: "from-pink-500 to-pink-600",
    event: "from-yellow-500 to-yellow-600"
  }

  const cardVariants = {
    standard: "flex-col",
    featured: "flex-col",
    compact: "flex-col",
    horizontal: "flex-row"
  }

  const imageHeights = {
    standard: "h-48",
    featured: "h-64",
    compact: "h-40",
    horizontal: "h-full w-1/3"
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("h-full", className)}
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div
          className={cn(
            "relative h-full overflow-hidden rounded-2xl",
            "bg-white/10 backdrop-blur-md",
            "border border-white/20",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-300",
            "hover:scale-[1.02] hover:border-pink-500/30",
            "flex",
            cardVariants[variant]
          )}
        >
          {/* Featured Image */}
          <div
            className={cn(
              "relative overflow-hidden",
              imageHeights[variant],
              variant === "horizontal" ? "shrink-0" : "w-full"
            )}
          >
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-yellow-500/20" />
            )}

            {/* Category Badge */}
            <div className="absolute left-4 top-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold text-white",
                  "bg-gradient-to-r",
                  categoryColors[
                    category.slug as keyof typeof categoryColors
                  ] || "from-gray-500 to-gray-600"
                )}
              >
                {category.name}
              </motion.div>
            </div>

            {/* Popular Badge */}
            {isPopular && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-4 top-4 rounded-full bg-yellow-500 p-2"
              >
                <TrendingUp className="size-4 text-white" />
              </motion.div>
            )}

            {/* Like Button */}
            {variant !== "compact" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={cn(
                  "absolute bottom-4 right-4 rounded-full p-2",
                  "bg-white/20 backdrop-blur-sm",
                  "transition-all duration-300",
                  "hover:bg-white/30",
                  isLiked && "bg-pink-500/30"
                )}
              >
                <Heart
                  className={cn(
                    "size-5 transition-colors duration-300",
                    isLiked ? "fill-pink-500 text-pink-500" : "text-white"
                  )}
                />
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6">
            {/* Meta Information */}
            <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                <time dateTime={publishedAt.toISOString()}>
                  {publishedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" />
                <span>{readingTime} min read</span>
              </div>
              {variant !== "compact" && viewCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="size-4" />
                  <span>{viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3
              className={cn(
                "mb-2 font-bold text-gray-900",
                "line-clamp-2 transition-colors duration-300 group-hover:text-pink-600",
                variant === "featured" ? "text-2xl" : "text-xl"
              )}
            >
              {title}
            </h3>

            {/* Excerpt */}
            {variant !== "compact" && (
              <p className="mb-4 line-clamp-3 flex-1 text-gray-600">
                {excerpt}
              </p>
            )}

            {/* Author */}
            {variant !== "compact" && (
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-pink-500/20">
                      <User className="size-4 text-pink-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {author.name}
                  </span>
                </div>

                {/* Read More Arrow */}
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-pink-600"
                >
                  <ArrowRight className="size-5" />
                </motion.div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && variant === "featured" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-3 py-1 text-xs text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hover Gradient Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent" />
          </motion.div>
        </div>
      </Link>
    </motion.article>
  )
}
