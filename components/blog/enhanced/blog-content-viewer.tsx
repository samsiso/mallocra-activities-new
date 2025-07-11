"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system"
import {
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  Heart,
  ChevronUp,
  Copy,
  Check,
  MessageCircle,
  Eye
} from "lucide-react"
import Image from "next/image"

interface BlogContentViewerProps {
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: Date
  readingTime: number
  category: {
    name: string
    color?: string
  }
  tags?: string[]
  viewCount?: number
  likeCount?: number
  commentCount?: number
  featuredImage?: string
  onShare?: () => void
  onBookmark?: () => void
  onLike?: () => void
  className?: string
  showTableOfContents?: boolean
  showReadingProgress?: boolean
  showSocialShare?: boolean
}

export function BlogContentViewer({
  title,
  content,
  author,
  publishedAt,
  readingTime,
  category,
  tags = [],
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  featuredImage,
  onShare,
  onBookmark,
  onLike,
  className,
  showTableOfContents = true,
  showReadingProgress = true,
  showSocialShare = true
}: BlogContentViewerProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  // Extract headings for table of contents
  const extractHeadings = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const headings = doc.querySelectorAll("h2, h3")

    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || "",
      level: heading.tagName.toLowerCase()
    }))
  }

  const headings = extractHeadings(content)

  useEffect(() => {
    const handleScroll = () => {
      // Reading progress
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (window.scrollY / scrollHeight) * 100
      setReadingProgress(Math.min(scrollProgress, 100))

      // Show/hide scroll to top
      setShowScrollTop(window.scrollY > 500)

      // Active section for table of contents
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll("h2, h3")
        let currentSection = ""

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 100) {
            currentSection = `heading-${index}`
          }
        })

        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (id: string) => {
    const index = parseInt(id.split("-")[1])
    const element = contentRef.current?.querySelectorAll("h2, h3")[index]

    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this article: ${title}`,
          url: window.location.href
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    onShare?.()
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.()
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike?.()
  }

  return (
    <div className={cn("relative", className)}>
      {/* Reading Progress Bar */}
      {showReadingProgress && (
        <motion.div
          className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-pink-500 to-pink-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: readingProgress / 100 }}
          style={{ transformOrigin: "0 0" }}
        />
      )}

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <header className="mb-8">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative mb-8 h-[400px] overflow-hidden rounded-2xl md:h-[500px]">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <span
              className={cn(
                "inline-block rounded-full px-4 py-2 text-sm font-semibold",
                "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
              )}
            >
              {category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <time dateTime={publishedAt.toISOString()}>
                {publishedAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-4" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="size-4" />
              <span>{likeCount.toLocaleString()} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              <span>{commentCount} comments</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-pink-500/20">
                  <User className="size-6 text-pink-600" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{author.name}</p>
                {author.bio && (
                  <p className="text-sm text-gray-600">{author.bio}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={cn(
                  "rounded-lg p-2 transition-all duration-300",
                  "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500",
                  isLiked && "bg-pink-500/20"
                )}
              >
                <Heart
                  className={cn(
                    "size-5",
                    isLiked ? "fill-pink-500 text-pink-500" : "text-gray-600"
                  )}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={cn(
                  "rounded-lg p-2 transition-all duration-300",
                  "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500",
                  isBookmarked && "bg-yellow-500/20"
                )}
              >
                <Bookmark
                  className={cn(
                    "size-5",
                    isBookmarked
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-600"
                  )}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="rounded-lg p-2 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {copied ? (
                  <Check className="size-5 text-green-500" />
                ) : (
                  <Share2 className="size-5 text-gray-600" />
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content Area with Table of Contents */}
        <div className="flex gap-8">
          {/* Table of Contents - Desktop */}
          {showTableOfContents && headings.length > 0 && (
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24">
                <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {headings.map(heading => (
                      <motion.button
                        key={heading.id}
                        whileHover={{ x: 4 }}
                        onClick={() => scrollToSection(heading.id)}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-300",
                          "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500",
                          heading.level === "h3" && "pl-6",
                          activeSection === heading.id
                            ? "bg-pink-500/20 font-medium text-pink-600"
                            : "text-gray-600"
                        )}
                      >
                        {heading.text}
                      </motion.button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <article className="min-w-0 flex-1">
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
              style={
                {
                  "--tw-prose-body": designTokens.colors.contrast.secondary,
                  "--tw-prose-headings": designTokens.colors.contrast.primary,
                  "--tw-prose-links": designTokens.colors.brand.pink,
                  "--tw-prose-bold": designTokens.colors.contrast.primary,
                  "--tw-prose-quotes": designTokens.colors.contrast.secondary,
                  "--tw-prose-quote-borders": designTokens.colors.brand.pink,
                  "--tw-prose-code": designTokens.colors.brand.pink,
                  "--tw-prose-pre-bg": designTokens.colors.glass.black[5]
                } as React.CSSProperties
              }
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm text-gray-700 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="hover:shadow-pink-glow/30 fixed bottom-8 right-8 z-40 rounded-full bg-pink-500 p-3 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <ChevronUp className="size-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
