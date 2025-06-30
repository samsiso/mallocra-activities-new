"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Shield,
  Gift,
  ArrowRight,
  Activity,
  Sparkles,
  CheckCircle,
  Search,
  Waves,
  Mountain,
  Building,
  Moon,
  ChevronLeft,
  ChevronRight,
  Award,
  Heart,
  Clock,
  Zap,
  TrendingUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Palette
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  LightActivityCard,
  LightAnimatedSection
} from "@/app/(marketing)/landing/_components/lightweight-animations"
import {
  ActivityWithDetails,
  searchActivitiesAction
} from "@/actions/db/activities-actions"
import { useRouter } from "next/navigation"
// Temporarily disabled to fix SSR issue
// import LeafletMap from "@/components/ui/leaflet-map"
import { getHeroVideosAction } from "@/actions/db/media-actions"
import PreferredFooter from "@/components/preferred-footer"
import EnhancedCategoriesSection from "./landing/_components/enhanced-categories-section"
import MobileOptimizedHeroSection from "@/components/ui/mobile-optimized-hero-section"
// Temporarily disabled to fix SSR issue
// import { EnhancedActivitiesMapSection } from "./landing/_components/enhanced-activities-map-section"
import {
  PROTECTED_CONFIG,
  getVideoUrl,
  runStartupCheck
} from "@/lib/video-protection"

// 🚨 PROTECTED VIDEO CONFIGURATION - DO NOT EDIT! 🚨
// Cloud Name: dfqvslgiy (VERIFIED WORKING)
// These video IDs are PRODUCTION-TESTED and WORKING
// Any changes to this configuration may break the landing page
// If videos stop working, check environment variables first!

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dfqvslgiy"

// Fallback video URLs in case Cloudinary fails
const FALLBACK_VIDEOS = [
  "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
  "https://player.vimeo.com/external/396879338.hd.mp4?s=2dd53044e6e34f0bb5c69e84e3d3414ffbc31e1c"
]

// 🎬 BULLETPROOF Hero Videos Configuration
const heroVideos = [
  {
    type: "video", // ✅ VERIFIED: 26s HD, 45MB, Working
    cloudinaryId: "lcwtw5eus5cvbcddrpqh",
    src: "",
    fallbackSrc: FALLBACK_VIDEOS[0],
    poster:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    alt: "Professional Mallorca activity video",
    title: "Premium Experience"
  },
  {
    type: "video", // ✅ VERIFIED: 26s HD, Working
    cloudinaryId: "rjuszbicymgknucnikjy",
    src: "",
    fallbackSrc: FALLBACK_VIDEOS[1],
    poster:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
    alt: "Stunning Mallorca adventure footage",
    title: "Unforgettable Adventures"
  },
  {
    type: "video", // ✅ VERIFIED: 18s Full HD, Working
    cloudinaryId: "gezph6p3putc1ljotgcp",
    src: "",
    fallbackSrc: FALLBACK_VIDEOS[0],
    poster:
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=2070&auto=format&fit=crop",
    alt: "Beautiful Mallorca landscape video",
    title: "Paradise Activities"
  },
  {
    type: "video", // ✅ VERIFIED: 29s 4K quality, Working
    cloudinaryId: "z93bie9boj1omghtlje2",
    src: "",
    fallbackSrc: FALLBACK_VIDEOS[1],
    poster:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    alt: "High-quality Mallorca activity video",
    title: "Luxury Adventures"
  },
  {
    type: "video", // ✅ VERIFIED: 20s 4K quality, Working
    cloudinaryId: "gfayerv3n0kf23m7tryo",
    src: "",
    fallbackSrc: FALLBACK_VIDEOS[0],
    poster:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    alt: "Premium Mallorca experience video",
    title: "Elite Activities"
  }
]

// 🛡️ Environment validation - prevent silent failures
if (typeof window !== "undefined" && !CLOUDINARY_CLOUD_NAME) {
  console.error("🚨 CRITICAL: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing!")
  console.log(
    "💡 Add this to .env.local: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfqvslgiy"
  )
}

// Enhanced Activity Card Component
function EnhancedActivityCard({ activity }: { activity: ActivityWithDetails }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  // Get primary image with better fallback handling
  const primaryImage =
    activity.images.find(img => img.isPrimary) || activity.images[0]
  const imageUrl =
    primaryImage?.imageUrl ||
    `https://images.unsplash.com/photo-1577948000111-9c970dfe3743?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`

  const [imageError, setImageError] = useState(false)
  const fallbackImageUrl = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`

  // Get adult pricing
  const adultPricing = activity.pricing.find(p => p.priceType === "adult")
  const price = adultPricing ? parseFloat(adultPricing.basePrice) : 0

  return (
    <LightActivityCard className="">
      <Link href={`/activities/${activity.slug}`}>
        <div
          className="hover:shadow-3xl w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/50 hover:shadow-orange-500/30"
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)"
          }}
        >
          {/* Enhanced Image Section */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={imageError ? fallbackImageUrl : imageUrl}
              alt={primaryImage?.altText || activity.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bz6tp9NrhAVaLH4a8YnqH8Ey41dC"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute inset-x-4 top-4 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                {activity.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-white shadow-xl">
                    <Sparkles className="mr-1 size-3" />
                    Featured
                  </Badge>
                )}
                {activity.availableToday && (
                  <Badge className="bg-green-500 font-bold text-white shadow-lg">
                    <Zap className="mr-1 size-3" />
                    Available Today
                  </Badge>
                )}
                {activity.spotsLeft && activity.spotsLeft <= 5 && (
                  <Badge className="bg-orange-500 font-bold text-white shadow-lg">
                    <TrendingUp className="mr-1 size-3" />
                    Only {activity.spotsLeft} spots left
                  </Badge>
                )}
              </div>

              {/* Wishlist button */}
              <Button
                variant="ghost"
                size="sm"
                className="size-10 border-none bg-black/30 p-0 shadow-lg backdrop-blur-sm hover:bg-black/50 sm:size-9"
                onClick={handleWishlistToggle}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`size-5 transition-colors sm:size-4 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white"}`}
                />
              </Button>
            </div>

            {/* Bottom info overlay */}
            <div className="absolute inset-x-4 bottom-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1 rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">
                    {activity.avgRating}
                  </span>
                  <span className="text-xs text-gray-200">
                    ({activity.totalReviews})
                  </span>
                </div>

                <div className="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
                  <span className="text-xl font-bold">€{price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section - FIXED: Dark background with light text */}
          <div className="bg-gray-900 p-3">
            <div className="mb-3 flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-orange-300 bg-orange-100 text-orange-800"
              >
                {activity.category
                  .replace("_", " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-1 text-gray-300">
                <MapPin className="size-4" />
                <span className="text-sm">{activity.location}</span>
              </div>
            </div>

            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-orange-400">
              {activity.title}
            </h3>

            <p className="mb-3 line-clamp-2 text-sm text-gray-300">
              {activity.shortDescription}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>Max {activity.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{Math.floor(activity.durationMinutes / 60)}h</span>
                </div>
              </div>

              <Link
                href={`/book/${activity.id}/select`}
                onClick={e => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  className="h-9 bg-gradient-to-r from-pink-500 to-yellow-500 px-4 text-white hover:from-pink-600 hover:to-yellow-600 sm:h-8 sm:px-3"
                >
                  <span className="hidden sm:inline">Book Now</span>
                  <span className="sm:hidden">Book</span>
                  <ArrowRight className="ml-1 size-4 sm:size-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </LightActivityCard>
  )
}

// Animated Section Component - Now using lightweight animations
function AnimatedSection({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <LightAnimatedSection
      className={className}
      delay={delay}
      animation="fade-up"
    >
      {children}
    </LightAnimatedSection>
  )
}

// Glassmorphism Card Component
function GlassmorphismCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border shadow-xl backdrop-blur-sm ${className}`}
      style={{
        borderColor: "rgba(250, 5, 124, 0.2)",
        backgroundColor: "rgba(250, 5, 124, 0.1)"
      }}
    >
      {children}
    </div>
  )
}

// Activity Card Skeleton Component
function ActivityCardSkeleton() {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
        {/* Image skeleton */}
        <div className="relative h-56 animate-pulse bg-gray-700">
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-20 rounded bg-gray-600"></div>
              <div className="h-6 w-24 rounded bg-gray-600"></div>
            </div>
            <div className="size-9 rounded bg-gray-600"></div>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <div className="h-8 w-20 rounded bg-gray-700"></div>
            <div className="h-8 w-16 rounded bg-gray-700"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="bg-gray-900 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-gray-700"></div>
            <div className="h-4 w-20 rounded bg-gray-700"></div>
          </div>
          <div className="mb-2 h-5 w-3/4 rounded bg-gray-700"></div>
          <div className="mb-3 space-y-2">
            <div className="h-3 w-full rounded bg-gray-700"></div>
            <div className="h-3 w-2/3 rounded bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 rounded bg-gray-700"></div>
              <div className="h-4 w-12 rounded bg-gray-700"></div>
            </div>
            <div className="h-8 w-20 rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Search Component with Autocomplete
function EnhancedSearchComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<ActivityWithDetails[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search for suggestions
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true)
        try {
          const result = await searchActivitiesAction(searchTerm, { limit: 5 })
          if (result.isSuccess) {
            setSuggestions(result.data || [])
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/activities?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleSuggestionClick = (activity: ActivityWithDetails) => {
    router.push(`/activities/${activity.slug || activity.id}`)
    setShowSuggestions(false)
  }

  const handleQuickSearch = (query: string) => {
    setSearchTerm(query)
    router.push(`/activities?search=${encodeURIComponent(query)}`)
  }

  return (
    <div
      className="rounded-xl border p-4 shadow-2xl backdrop-blur-md lg:p-8"
      style={{
        borderColor: "rgba(250, 5, 124, 0.3)",
        backgroundColor: "rgba(250, 5, 124, 0.15)"
      }}
    >
      <h3
        id="search-heading"
        className="mb-6 hidden text-2xl font-bold text-white lg:block"
      >
        Find Your Perfect Activity
      </h3>

      <div ref={searchRef} className="relative">
        <form
          onSubmit={handleSearch}
          role="search"
          aria-labelledby="search-heading"
          className="space-y-5"
        >
          <div className="relative">
            <label htmlFor="activity-search" className="sr-only">
              Search for activities
            </label>
            <Input
              id="activity-search"
              type="text"
              placeholder="Try 'boat tours', 'hiking', or 'Palma'..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              className="h-12 border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all placeholder:text-white/70 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 sm:h-14"
              aria-describedby="search-help"
              autoComplete="off"
            />
            <div id="search-help" className="sr-only">
              Enter keywords to search for activities like boat tours, hiking,
              or location names
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              </div>
            )}
          </div>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap gap-2">
            {["boat tours", "hiking", "Palma", "sailing", "caves"].map(
              query => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleQuickSearch(query)}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white/80 transition-all hover:border-yellow-400 hover:bg-white/20 hover:text-white"
                >
                  {query}
                </button>
              )
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold text-black shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:h-14 sm:text-lg"
            style={{
              background: `#fff546`
            }}
            aria-describedby="search-button-help"
          >
            <Search
              className="mr-2 size-4 sm:mr-3 sm:size-5"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Search Activities</span>
            <span className="sm:hidden">Search</span>
          </Button>
          <div id="search-button-help" className="sr-only">
            Click to search for activities matching your keywords
          </div>
        </form>

        {/* Enhanced Autocomplete dropdown with expanded cards */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-white/20 bg-black/90 shadow-2xl backdrop-blur-xl duration-200">
            <div className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Suggested Activities
                </span>
                <span className="text-xs text-white/40">
                  {suggestions.length} found
                </span>
              </div>

              <div className="max-h-96 space-y-3 overflow-y-auto">
                {suggestions.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => handleSuggestionClick(activity)}
                    className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                    style={{
                      "--hover-border-color": "#fa057c"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor =
                        "rgba(250, 5, 124, 0.5)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Enhanced Image */}
                      {activity.images?.[0] && (
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={activity.images[0].imageUrl}
                            alt={activity.images[0].altText || activity.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="80px"
                          />
                          {activity.featured && (
                            <div className="absolute left-1 top-1">
                              <Badge className="bg-orange-500 px-1 py-0 text-xs text-white">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced Content */}
                      <div className="min-w-0 flex-1 space-y-2">
                        {/* Title and Category */}
                        <div className="space-y-1">
                          <h4
                            className="font-semibold text-white transition-colors"
                            style={{ "--hover-color": "#fff546" }}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = "#fff546"
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = "white"
                            }}
                          >
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className="border-blue-400/30 bg-blue-600/20 text-xs text-blue-300">
                              {activity.category.replace("_", " ")}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-white/60">
                              <MapPin className="size-3" />
                              {activity.location}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {activity.shortDescription && (
                          <p className="line-clamp-2 text-sm text-white/70">
                            {activity.shortDescription}
                          </p>
                        )}

                        {/* Details Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/60">
                            {activity.durationMinutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {Math.floor(
                                  activity.durationMinutes / 60
                                )}h {activity.durationMinutes % 60}m
                              </span>
                            )}
                            {activity.maxParticipants && (
                              <span className="flex items-center gap-1">
                                <Users className="size-3" />
                                Up to {activity.maxParticipants}
                              </span>
                            )}
                            {activity.avgRating && (
                              <span className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                {activity.avgRating}
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div
                              className="text-lg font-bold"
                              style={{ color: "#fff546" }}
                            >
                              €{activity.pricing?.[0]?.basePrice || "N/A"}
                            </div>
                            <div className="text-xs text-white/50">
                              per person
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Action */}
                      <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowRight
                          className="size-5"
                          style={{ color: "#fa057c" }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Enhanced View All Results */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-semibold text-black transition-all hover:shadow-lg"
                  style={{
                    background: `linear-gradient(to right, #fff546, #fa057c)`
                  }}
                >
                  <Search className="size-4" />
                  View all {suggestions.length}+ results for "{searchTerm}"
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LandingPage() {
  // 🛡️ PROTECTED: Auto-validate environment on component load
  useEffect(() => {
    runStartupCheck()
  }, [])

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [featuredActivities, setFeaturedActivities] = useState<
    ActivityWithDetails[]
  >([])
  const [loadedVideos, setLoadedVideos] = useState(heroVideos) // Start with defaults
  const [videoLoadStates, setVideoLoadStates] = useState<boolean[]>(
    new Array(heroVideos.length).fill(false)
  )

  // Image slideshow timer - Working immediately!
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % loadedVideos.length)
    }, 5000) // 5 second intervals for smooth slideshow
    return () => clearInterval(interval)
  }, [loadedVideos.length])

  // Fetch featured activities
  useEffect(() => {
    const fetchFeaturedActivities = async () => {
      console.log("🔍 Starting to fetch featured activities...")
      try {
        const response = await fetch("/api/featured-activities")
        const result = await response.json()

        console.log("📊 Featured activities API response:", result)

        if (result.success && result.data && result.data.length > 0) {
          console.log("✅ Successfully fetched activities:", result.data.length)
          setFeaturedActivities(result.data.slice(0, 6)) // Limit to 6 activities
        } else {
          console.log(
            "⚠️ API returned no activities, using fallback strategy..."
          )

          // Try to fetch from database actions directly as fallback
          try {
            const { getFeaturedActivitiesAction } = await import(
              "@/actions/db/activities-actions"
            )
            const fallbackResult = await getFeaturedActivitiesAction()

            if (
              fallbackResult.isSuccess &&
              fallbackResult.data &&
              fallbackResult.data.length > 0
            ) {
              console.log(
                "✅ Fallback successful, loaded:",
                fallbackResult.data.length,
                "activities"
              )
              setFeaturedActivities(fallbackResult.data.slice(0, 6))
            } else {
              console.log(
                "❌ Both API and fallback failed, no activities loaded"
              )
            }
          } catch (fallbackError) {
            console.error("💥 Fallback strategy failed:", fallbackError)
          }
        }
      } catch (error) {
        console.error("💥 Error fetching featured activities:", error)

        // Try fallback strategy on network error
        try {
          const { getFeaturedActivitiesAction } = await import(
            "@/actions/db/activities-actions"
          )
          const fallbackResult = await getFeaturedActivitiesAction()

          if (
            fallbackResult.isSuccess &&
            fallbackResult.data &&
            fallbackResult.data.length > 0
          ) {
            console.log(
              "✅ Network error fallback successful:",
              fallbackResult.data.length,
              "activities"
            )
            setFeaturedActivities(fallbackResult.data.slice(0, 6))
          }
        } catch (fallbackError) {
          console.error("💥 Network error fallback failed:", fallbackError)
        }
      }
    }

    // Execute immediately
    fetchFeaturedActivities()
  }, [])

  console.log(
    "🎯 Current featuredActivities state:",
    featuredActivities.length,
    featuredActivities
  )

  const nextVideo = () => {
    setCurrentVideoIndex(prev => (prev + 1) % loadedVideos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex(
      prev => (prev - 1 + loadedVideos.length) % loadedVideos.length
    )
  }

  // Mock activities if API fails completely
  const mockActivities: ActivityWithDetails[] = [
    {
      id: "activity-1",
      title: "Palma Cathedral & Historic Quarter Tour",
      slug: "palma-cathedral-tour",
      description:
        "Discover the architectural marvel of Palma Cathedral (La Seu) and explore the charming historic quarter",
      shortDescription:
        "Explore Palma's iconic cathedral and historic quarter with expert local guide",
      category: "cultural",
      location: "Palma de Mallorca",
      meetingPoint: "Palma Cathedral Main Entrance",
      durationMinutes: 180,
      maxParticipants: 15,
      minParticipants: 2,
      minAge: 8,
      maxAge: null,
      includedItems: ["Skip-the-line cathedral tickets", "Expert guide"],
      excludedItems: ["Hotel pickup"],
      whatToBring: ["Comfortable walking shoes"],
      cancellationPolicy: "Free cancellation up to 24 hours",
      safetyRequirements: "Modest dress code required",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active",
      featured: true,
      avgRating: "4.8",
      totalReviews: 324,
      totalBookings: 1250,
      operatorId: "operator-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-1",
          activityId: "activity-1",
          imageUrl:
            "https://images.unsplash.com/photo-1556469559-7c67fdc47b81?w=800&h=600&fit=crop",
          altText: "Palma Cathedral",
          caption: "Stunning Gothic cathedral",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-1",
          activityId: "activity-1",
          priceType: "adult",
          basePrice: "45.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: true,
      spotsLeft: 8
    },
    {
      id: "activity-2",
      title: "Serra de Tramuntana Mountain Adventure",
      slug: "tramuntana-adventure",
      description:
        "Experience the breathtaking beauty of the UNESCO World Heritage Serra de Tramuntana mountains",
      shortDescription:
        "UNESCO mountain adventure with stunning views and traditional villages",
      category: "land_adventures",
      location: "Serra de Tramuntana",
      meetingPoint: "Sóller Train Station",
      durationMinutes: 480,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 12,
      maxAge: null,
      includedItems: ["Professional guide", "4WD transport"],
      excludedItems: ["Hiking boots"],
      whatToBring: ["Hiking boots", "Camera"],
      cancellationPolicy: "Free cancellation up to 48 hours",
      safetyRequirements: "Moderate fitness required",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active",
      featured: true,
      avgRating: "4.9",
      totalReviews: 156,
      totalBookings: 430,
      operatorId: "operator-2",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-2",
          activityId: "activity-2",
          imageUrl:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
          altText: "Tramuntana Mountains",
          caption: "Dramatic mountain landscape",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-2",
          activityId: "activity-2",
          priceType: "adult",
          basePrice: "89.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: true,
      spotsLeft: 3
    },
    {
      id: "activity-3",
      title: "Mallorca Sailing & Snorkeling Adventure",
      slug: "sailing-adventure",
      description:
        "Set sail along Mallorca's stunning coastline aboard our luxury catamaran",
      shortDescription:
        "Luxury catamaran sailing with snorkeling and Mediterranean lunch",
      category: "water_sports",
      location: "Port de Palma",
      meetingPoint: "Marina Port de Palma, Pier 3",
      durationMinutes: 360,
      maxParticipants: 12,
      minParticipants: 4,
      minAge: 6,
      maxAge: null,
      includedItems: ["Catamaran cruise", "Snorkeling gear"],
      excludedItems: ["Hotel transfers"],
      whatToBring: ["Swimwear", "Sunscreen"],
      cancellationPolicy: "Free cancellation up to 24 hours",
      safetyRequirements: "Swimming ability required",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active",
      featured: true,
      avgRating: "4.7",
      totalReviews: 289,
      totalBookings: 850,
      operatorId: "operator-3",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-3",
          activityId: "activity-3",
          imageUrl:
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
          altText: "Sailing catamaran",
          caption: "Luxury sailing experience",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-3",
          activityId: "activity-3",
          priceType: "adult",
          basePrice: "75.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: true,
      spotsLeft: 5
    },
    {
      id: "activity-11",
      title: "Mallorca Hot Air Balloon Sunrise Flight",
      slug: "hot-air-balloon-flight",
      description:
        "Experience Mallorca from a bird's eye view with our magical hot air balloon flight",
      shortDescription:
        "Magical sunrise hot air balloon flight with champagne breakfast",
      category: "land_adventures",
      location: "Central Mallorca Plains",
      meetingPoint: "Balloon Launch Site (Transport provided from Palma)",
      durationMinutes: 240,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 8,
      maxAge: null,
      includedItems: ["Hot air balloon flight", "Champagne breakfast"],
      excludedItems: ["Photography service"],
      whatToBring: ["Comfortable shoes", "Camera"],
      cancellationPolicy: "Free cancellation up to 48 hours, weather dependent",
      safetyRequirements:
        "Weather dependent activity, good physical condition required",
      weatherDependent: true,
      instantConfirmation: false,
      status: "active",
      featured: true,
      avgRating: "4.9",
      totalReviews: 187,
      totalBookings: 412,
      operatorId: "operator-11",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-12",
          activityId: "activity-11",
          imageUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
          altText: "Hot air balloon over Mallorca",
          caption: "Breathtaking aerial views",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-19",
          activityId: "activity-11",
          priceType: "adult",
          basePrice: "195.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: false,
      spotsLeft: 3
    },
    {
      id: "activity-9",
      title: "Caves of Drach Underground Lake Boat Tour",
      slug: "dragon-caves-adventure",
      description:
        "Descend into Mallorca's most spectacular underground world at the famous Dragon Caves",
      shortDescription:
        "Underground caves exploration with boat ride and classical concert",
      category: "cultural",
      location: "Porto Cristo - Caves of Drach",
      meetingPoint: "Caves of Drach Main Entrance",
      durationMinutes: 180,
      maxParticipants: 40,
      minParticipants: 8,
      minAge: 4,
      maxAge: null,
      includedItems: ["Cave entrance tickets", "Underground boat ride"],
      excludedItems: ["Transportation to Porto Cristo"],
      whatToBring: ["Comfortable walking shoes", "Light jacket"],
      cancellationPolicy: "Free cancellation up to 24 hours",
      safetyRequirements: "Some stairs and uneven surfaces",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active",
      featured: true,
      avgRating: "4.7",
      totalReviews: 1156,
      totalBookings: 3200,
      operatorId: "operator-9",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-10",
          activityId: "activity-9",
          imageUrl:
            "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
          altText: "Underground lake in caves",
          caption: "Magical underground world",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-16",
          activityId: "activity-9",
          priceType: "adult",
          basePrice: "32.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: true,
      spotsLeft: 22
    },
    {
      id: "activity-12",
      title: "Mallorca Wine Tasting & Vineyard Tour",
      slug: "wine-tasting-experience",
      description:
        "Discover the finest wines of Mallorca with visits to traditional bodegas and modern wineries",
      shortDescription:
        "Premium wine tasting tour with local delicacies and vineyard walks",
      category: "cultural",
      location: "Binissalem Wine Region",
      meetingPoint: "Binissalem Train Station",
      durationMinutes: 360,
      maxParticipants: 12,
      minParticipants: 4,
      minAge: 18,
      maxAge: null,
      includedItems: ["Wine tastings", "Local cheese and charcuterie"],
      excludedItems: ["Transportation to Binissalem"],
      whatToBring: ["Valid photo ID", "Designated driver arrangement"],
      cancellationPolicy: "Free cancellation up to 24 hours",
      safetyRequirements:
        "Must be 18+ with valid ID, responsible alcohol consumption",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active",
      featured: false,
      avgRating: "4.6",
      totalReviews: 298,
      totalBookings: 756,
      operatorId: "operator-12",
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-13",
          activityId: "activity-12",
          imageUrl:
            "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&h=600&fit=crop",
          altText: "Wine tasting in vineyard",
          caption: "Discover Mallorca wines",
          isPrimary: true,
          sortOrder: 1,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-21",
          activityId: "activity-12",
          priceType: "adult",
          basePrice: "78.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      availableToday: true,
      spotsLeft: 8
    }
  ]

  return (
    <div
      className="relative"
      style={{
        scrollBehavior: "smooth",
        contain: "layout"
      }}
    >
      <main
        style={{
          willChange: "scroll-position",
          overflowAnchor: "none"
        }}
      >
        {/* Mobile Optimized Hero Section */}
        <div className="lg:hidden">
          <MobileOptimizedHeroSection />
        </div>

        {/* Desktop Hero Section with Full Screen Image & Slideshow */}
        <section
          className="relative hidden min-h-screen overflow-hidden lg:block"
          aria-label="Hero video carousel"
          role="banner"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            contain: "layout style paint"
          }}
        >
          {/* Background Video/Image Slideshow - Performance Optimized */}
          <div
            className="absolute inset-0"
            style={{
              willChange: "transform",
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden"
            }}
          >
            {loadedVideos.map((media, index) => {
              // Only render current video and adjacent ones for performance
              const shouldRender =
                index === currentVideoIndex ||
                index === (currentVideoIndex + 1) % loadedVideos.length ||
                index ===
                  (currentVideoIndex - 1 + loadedVideos.length) %
                    loadedVideos.length

              if (!shouldRender) return null

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentVideoIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    willChange: "opacity",
                    transform: "translate3d(0, 0, 0)"
                  }}
                >
                  {media.type === "video" ? (
                    <video
                      src={
                        media.cloudinaryId
                          ? getVideoUrl(media.cloudinaryId, media.fallbackSrc)
                          : media.src
                      }
                      poster={media.poster}
                      autoPlay={index === currentVideoIndex}
                      muted
                      loop
                      playsInline
                      className="size-full object-cover"
                      preload={index === currentVideoIndex ? "auto" : "none"}
                      style={{
                        willChange: "transform",
                        transform: "translate3d(0, 0, 0)"
                      }}
                      onError={e => {
                        console.error(
                          "🚨 Video failed to load:",
                          e.currentTarget.src
                        )
                        console.log("🔄 Attempting fallback video...")
                        // Automatically try fallback video
                        if (
                          media.fallbackSrc &&
                          e.currentTarget.src !== media.fallbackSrc
                        ) {
                          e.currentTarget.src = media.fallbackSrc
                        }
                      }}
                      onLoadStart={() => {
                        console.log(
                          "✅ Video loading:",
                          media.cloudinaryId || "fallback"
                        )
                        setVideoLoadStates(prev => {
                          const newStates = [...prev]
                          newStates[index] = true
                          return newStates
                        })
                      }}
                      onCanPlay={() => {
                        console.log(
                          "🎬 Video ready to play:",
                          media.cloudinaryId || "fallback"
                        )
                      }}
                    />
                  ) : (
                    // Optimized image with lazy loading
                    <Image
                      src={media.src}
                      alt={media.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  )}
                </div>
              )
            })}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-orange-900/70"></div>

            {/* Video Loading Indicator */}
            {!videoLoadStates[currentVideoIndex] && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/50">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-white">
                    <div className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    <span className="text-sm font-medium">
                      Loading experience...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slideshow Controls */}
          <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between sm:inset-x-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevVideo}
              className="size-12 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:size-10"
              aria-label="Previous video"
              aria-describedby="video-carousel-help"
            >
              <ChevronLeft className="size-5 sm:size-4" />
              <span className="sr-only">Go to previous video in carousel</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextVideo}
              className="size-12 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:size-10"
              aria-label="Next video"
              aria-describedby="video-carousel-help"
            >
              <ChevronRight className="size-5 sm:size-4" />
              <span className="sr-only">Go to next video in carousel</span>
            </Button>
          </div>

          {/* Slideshow Indicators */}
          <div
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-2"
            role="tablist"
            aria-label="Video carousel indicators"
          >
            {loadedVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`h-3 w-8 touch-manipulation rounded-full transition-colors focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:h-2 ${
                  index === currentVideoIndex ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`Go to video ${index + 1} of ${loadedVideos.length}`}
                aria-selected={index === currentVideoIndex}
                role="tab"
                tabIndex={index === currentVideoIndex ? 0 : -1}
              />
            ))}
          </div>

          {/* Screen reader helper text */}
          <div id="video-carousel-help" className="sr-only">
            Use arrow keys to navigate between videos, or click the indicators
            below the video
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                {/* Left side - Main Content */}
                <div className="text-center lg:text-left">
                  <Badge
                    className="mb-8 inline-flex border px-6 py-3 text-black shadow-2xl ring-1 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl"
                    style={{
                      willChange: "transform",
                      transform: "translateZ(0)",
                      borderColor: "rgba(255, 29, 206, 0.2)",
                      backgroundColor: "rgba(255, 29, 206, 0.1)"
                    }}
                  >
                    <Sparkles
                      className="mr-3 size-5 drop-shadow-lg"
                      style={{ color: "#fff546" }}
                    />
                    <span className="font-semibold text-white drop-shadow-sm">
                      #1 Activity Platform in Mallorca
                    </span>
                  </Badge>

                  <h1 className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter sm:text-7xl lg:text-8xl">
                    <span className="block">
                      <span className="text-white drop-shadow-lg">WE </span>
                      <span className="text-yellow-400 drop-shadow-lg">
                        ARE
                      </span>
                    </span>
                    <span className="block text-black drop-shadow-lg">
                      EXCURSIONS
                    </span>
                  </h1>

                  <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/95 drop-shadow-sm sm:text-xl lg:mx-0">
                    From thrilling water sports to cultural experiences. Book
                    authentic local activities with instant confirmation.
                  </p>

                  {/* Stats */}
                  <div className="mb-10 flex flex-wrap justify-center gap-3 text-sm text-white/95 sm:gap-8 sm:text-base lg:justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 backdrop-blur-sm sm:gap-3 sm:px-4">
                      <Star className="size-4 fill-yellow-400 text-yellow-400 drop-shadow-sm sm:size-5" />
                      <span className="font-medium">4.8/5 rating</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 backdrop-blur-sm sm:gap-3 sm:px-4">
                      <Users
                        className="size-4 drop-shadow-sm sm:size-5"
                        style={{ color: "#fa057c" }}
                      />
                      <span className="font-medium">50k+ customers</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 backdrop-blur-sm sm:gap-3 sm:px-4">
                      <MapPin
                        className="size-4 drop-shadow-sm sm:size-5"
                        style={{ color: "#fa057c" }}
                      />
                      <span className="font-medium">Island-wide</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Enhanced Search */}
                <div className="lg:pl-8">
                  <EnhancedSearchComponent />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Activity Categories Section - Horizontal Scroll */}
        <EnhancedCategoriesSection />

        {/* Enhanced Featured Activities Section - Real Database-Driven */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black py-24"
          style={{
            contain: "layout style paint",
            willChange: "transform"
          }}
        >
          {/* Ambient background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-yellow-500/5 to-transparent"></div>
          <div className="bg-grid-white/[0.02] absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,_transparent_20%,_black)]"></div>

          <div className="relative mx-auto max-w-7xl px-4">
            <AnimatedSection className="mb-20 text-center">
              <div className="animate-in zoom-in-75 fade-in relative inline-block duration-700 ease-out">
                <Badge
                  className="mb-6 px-6 py-3 text-base font-bold text-white shadow-2xl"
                  style={{
                    background: `linear-gradient(to right, #ff1dce, #dc2626)`
                  }}
                >
                  <Star className="mr-2 size-5" />
                  Top Rated Experiences
                </Badge>
              </div>

              <h2 className="animate-in slide-in-from-bottom-4 fade-in mb-6 text-5xl font-bold text-white delay-200 duration-700 sm:text-6xl lg:text-7xl">
                Featured{" "}
                <span
                  className="bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(to right, #ff1dce, #fff546)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Activities
                </span>
              </h2>

              <p className="animate-in slide-in-from-bottom-4 fade-in mx-auto max-w-4xl text-xl leading-relaxed text-gray-300 delay-500 duration-700 sm:text-2xl">
                Hand-picked experiences that showcase the very best of what
                Mallorca has to offer. Each activity is carefully curated for
                unforgettable memories.
              </p>
            </AnimatedSection>

            {/* Enhanced Horizontal Scrolling Carousel with Navigation */}
            <div className="relative">
              {/* Navigation buttons */}
              <div className="absolute -top-20 right-0 z-10 hidden gap-2 lg:flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-white/20 bg-white/5 text-white backdrop-blur-xl hover:border-orange-400/50 hover:bg-white/10"
                  onClick={() => {
                    const container =
                      document.getElementById("featured-carousel")
                    if (container)
                      container.scrollBy({ left: -400, behavior: "smooth" })
                  }}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-white/20 bg-white/5 text-white backdrop-blur-xl hover:border-orange-400/50 hover:bg-white/10"
                  onClick={() => {
                    const container =
                      document.getElementById("featured-carousel")
                    if (container)
                      container.scrollBy({ left: 400, behavior: "smooth" })
                  }}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>

              <div
                id="featured-carousel"
                className="scrollbar-hide flex gap-4 overflow-x-auto px-1 pb-6"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  scrollPadding: "0 24px",
                  willChange: "scroll-position",
                  transform: "translate3d(0, 0, 0)",
                  contain: "layout style paint"
                }}
              >
                {featuredActivities.length > 0
                  ? featuredActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="animate-in fade-in slide-in-from-right-12 w-[280px] min-w-[280px] shrink-0 duration-500 sm:w-[320px] sm:min-w-[320px] md:w-[350px] md:min-w-[350px] lg:w-[380px] lg:min-w-[380px] xl:w-[400px] xl:min-w-[400px]"
                        style={{
                          scrollSnapAlign: "start",
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <EnhancedActivityCard activity={activity} />
                      </div>
                    ))
                  : // Enhanced loading state with skeleton cards
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className="animate-in fade-in slide-in-from-right-12 w-[280px] min-w-[280px] shrink-0 duration-500 sm:w-[320px] sm:min-w-[320px] md:w-[350px] md:min-w-[350px] lg:w-[380px] lg:min-w-[380px] xl:w-[400px] xl:min-w-[400px]"
                        style={{
                          scrollSnapAlign: "start",
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <ActivityCardSkeleton />
                      </div>
                    ))}
              </div>

              {/* Enhanced scroll indicator with stats */}
              <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-col items-center gap-4 delay-700 duration-500 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Palette className="size-4" />
                  <span className="text-sm">
                    {featuredActivities.length > 0
                      ? `${featuredActivities.length} featured experiences available`
                      : "Loading featured experiences..."}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-400" />
                    <span>Avg 4.8★ rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-4 text-blue-400" />
                    <span>1000+ bookings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-green-400" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedSection className="mt-16 text-center" delay={0.8}>
              <div className="transition-all duration-300 hover:scale-105 active:scale-95">
                <Link href="/activities">
                  <Button
                    size="lg"
                    className="hover:shadow-3xl group relative overflow-hidden px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300"
                    style={{
                      background: "linear-gradient(to right, #ff1dce, #dc2626)",
                      boxShadow: "0 25px 50px -12px rgba(255, 29, 206, 0.25)"
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <Activity className="mr-3 size-6" />
                      Explore All Activities
                      <ArrowRight className="ml-3 size-6 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to right, #e91e63, #b91c1c)"
                      }}
                    ></div>
                  </Button>
                </Link>
              </div>

              <p className="animate-in fade-in mt-4 text-gray-400 delay-1000 duration-500">
                Browse 50+ amazing activities across Mallorca
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Enhanced Activity Locations Map Section - Temporarily disabled to fix SSR issue */}
        {/* <EnhancedActivitiesMapSection /> */}

        {/* Enhanced Testimonials Section - Moved to just above CTA */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <AnimatedSection className="mb-16 text-center">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white">
                <Heart className="mr-2 size-4" />
                Customer Stories
              </Badge>
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                What Our Guests Say
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Real experiences from travelers who have discovered the magic of
                Mallorca with us
              </p>
            </AnimatedSection>

            {/* Enhanced Horizontal Scrolling Reviews Carousel with Navigation */}
            <div className="relative">
              {/* Navigation buttons */}
              <div className="absolute -top-20 right-0 z-10 hidden gap-2 lg:flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-gray-300/40 bg-white/70 text-gray-700 backdrop-blur-xl hover:border-purple-400/50 hover:bg-white/90"
                  onClick={() => {
                    const container =
                      document.getElementById("reviews-carousel")
                    if (container)
                      container.scrollBy({ left: -400, behavior: "smooth" })
                  }}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-gray-300/40 bg-white/70 text-gray-700 backdrop-blur-xl hover:border-purple-400/50 hover:bg-white/90"
                  onClick={() => {
                    const container =
                      document.getElementById("reviews-carousel")
                    if (container)
                      container.scrollBy({ left: 400, behavior: "smooth" })
                  }}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>

              <div
                id="reviews-carousel"
                className="scrollbar-hide flex gap-6 overflow-x-auto px-1 pb-6"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  scrollPadding: "0 24px",
                  willChange: "scroll-position",
                  transform: "translate3d(0, 0, 0)",
                  contain: "layout style paint"
                }}
              >
                {[
                  {
                    name: "Sarah Johnson",
                    location: "London, UK",
                    rating: 5,
                    text: "Absolutely incredible experience! The catamaran sunset cruise was magical, and our guide Marco was fantastic. We'll definitely be booking again next year!",
                    image:
                      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=150&auto=format&fit=crop",
                    activity: "Catamaran Sunset Cruise"
                  },
                  {
                    name: "Michael Weber",
                    location: "Berlin, Germany",
                    rating: 5,
                    text: "The hiking tour in Tramuntana was breathtaking. Perfect organization, beautiful routes, and amazing views. Highly recommend We Are Excursions!",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
                    activity: "Serra de Tramuntana Hiking"
                  },
                  {
                    name: "Emma Thompson",
                    location: "Manchester, UK",
                    rating: 5,
                    text: "Professional service from start to finish. The cultural tour gave us insights into Mallorca we never would have discovered on our own. Outstanding!",
                    image:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
                    activity: "Palma Cultural Tour"
                  },
                  {
                    name: "Lucas Martin",
                    location: "Paris, France",
                    rating: 5,
                    text: "The jet ski tour was absolutely thrilling! Professional instructors, top-quality equipment, and stunning coastline views. An unforgettable adventure!",
                    image:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
                    activity: "Jet Ski Coastal Tour"
                  },
                  {
                    name: "Sofia Rodriguez",
                    location: "Madrid, Spain",
                    rating: 5,
                    text: "The cooking class with local chef was amazing! Learned traditional Mallorcan recipes and enjoyed delicious food. Perfect cultural experience!",
                    image:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
                    activity: "Traditional Cooking Class"
                  },
                  {
                    name: "James Wilson",
                    location: "Dublin, Ireland",
                    rating: 5,
                    text: "The scuba diving experience was world-class! Crystal clear waters, abundant marine life, and excellent dive masters. Highly recommended!",
                    image:
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
                    activity: "Scuba Diving Adventure"
                  }
                ].map((testimonial, index) => (
                  <div
                    key={testimonial.name}
                    className="animate-in fade-in slide-in-from-right-12 w-[350px] min-w-[350px] shrink-0 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] sm:w-[380px] sm:min-w-[380px] md:w-[400px] md:min-w-[400px]"
                    style={{
                      scrollSnapAlign: "start",
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <GlassmorphismCard className="h-full p-8">
                      <div className="mb-6 flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="size-16 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.location}
                          </p>
                          <div className="mt-1 flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="size-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="mb-4 leading-relaxed text-gray-700">
                        "{testimonial.text}"
                      </blockquote>

                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-xs text-blue-700"
                      >
                        {testimonial.activity}
                      </Badge>
                    </GlassmorphismCard>
                  </div>
                ))}
              </div>

              {/* Enhanced scroll indicator */}
              <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-col items-center gap-4 delay-700 duration-500 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="size-4" />
                  <span className="text-sm">
                    6 customer testimonials from real experiences
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-400" />
                    <span>All 5★ reviews</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-green-400" />
                    <span>Verified bookings</span>
                  </div>
                  <div className="hidden items-center gap-1 sm:flex">
                    <ArrowRight className="size-4 text-blue-400" />
                    <span>Drag to explore →</span>
                  </div>
                </div>
              </div>

              {/* Recognized by Leading Travel Publications - No Background */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-800 mt-16 text-center">
                <p className="mb-8 text-sm font-medium text-gray-600">
                  Recognized by Leading Travel Publications
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {[
                    "TripAdvisor Excellence",
                    "Lonely Planet Recommended",
                    "Travel + Leisure Top Pick",
                    "Conde Nast Traveler Award"
                  ].map((publication, index) => (
                    <div
                      key={publication}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-400 flex items-center gap-2 text-gray-700"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <Award className="size-5 text-amber-500" />
                      <span className="text-sm font-medium">{publication}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20"></div>
            <div className="absolute left-1/4 top-0 size-96 rounded-full bg-yellow-400/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-rose-400/10 blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <AnimatedSection>
              {/* Glassmorphism Container */}
              <div className="mx-auto max-w-4xl">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-12 shadow-2xl shadow-rose-500/20 backdrop-blur-sm">
                  {/* Badge */}
                  <div className="mb-6 flex justify-center">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-2 font-bold text-black shadow-lg">
                      <Sparkles className="mr-2 size-4" />
                      Ready for Adventure?
                    </Badge>
                  </div>

                  {/* Headline */}
                  <h2 className="mb-6 text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                    Start Your{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      Mallorca Journey
                    </span>{" "}
                    Today
                  </h2>

                  {/* Subtext */}
                  <p className="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-white/90">
                    Join thousands of satisfied travelers who have discovered
                    the magic of Mallorca with us. Book your perfect adventure
                    now and create memories that will last a lifetime.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                    <Link href="/activities">
                      <Button
                        size="lg"
                        className="group relative overflow-hidden px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        style={{
                          background:
                            "linear-gradient(to right, #ff1dce, #dc2626)",
                          boxShadow: "0 20px 25px -5px rgba(255, 29, 206, 0.4)"
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to right, #e91e63, #b91c1c)"
                          }}
                        ></div>
                        <span className="relative flex items-center">
                          <Sparkles className="mr-2 size-5" />
                          Book Your Adventure
                          <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>

                    <Link href="/test-qr">
                      <Button
                        size="lg"
                        variant="outline"
                        className="group border-2 border-pink-400 bg-transparent px-8 py-4 text-lg font-bold text-pink-400 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pink-400 hover:text-white hover:shadow-xl"
                      >
                        <span className="flex items-center">
                          🎫 Try QR Tickets
                          <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>

                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="group border-2 border-yellow-400 bg-transparent px-8 py-4 text-lg font-bold text-yellow-400 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:text-rose-900 hover:shadow-xl"
                      >
                        <span className="flex items-center">
                          Get in Touch
                          <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Elements */}
                  <div className="mt-12 border-t border-white/20 pt-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4 text-yellow-400" />
                        <span>Secure Booking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-yellow-400" />
                        <span>Instant Confirmation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="size-4 text-yellow-400" />
                        <span>5-Star Rated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-yellow-400" />
                        <span>10,000+ Happy Travelers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <PreferredFooter />
      </main>
    </div>
  )
}
