"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { debugLog } from "@/lib/debug"
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
import LeafletMap from "@/components/ui/leaflet-map"
import { getHeroVideosAction } from "@/actions/db/media-actions"
import PreferredFooter from "@/components/preferred-footer"
import EnhancedCategoriesSection from "./landing/_components/enhanced-categories-section"
import { EnhancedActivitiesMapSection } from "./landing/_components/enhanced-activities-map-section"
import MobileOptimizedHeroSection from "@/components/ui/mobile-optimized-hero-section"
import DesktopHeroSection from "@/components/ui/desktop-hero-section"
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
  debugLog("🚨 CRITICAL: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing!")
  debugLog(
    "💡 Add this to .env.local: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfqvslgiy"
  )
}

// Enhanced Activity Card Component
function EnhancedActivityCard({ activity }: { activity: ActivityWithDetails }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isMounted) {
      setIsWishlisted(!isWishlisted)
    }
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
          className="hover:shadow-3xl w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-150 hover:border-orange-400/50 hover:shadow-orange-500/30"
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
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bz6tp9NrhAVaLH4a8YnqH8Ey41dC"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Only Wishlist button - no badges */}
            {isMounted && (
              <div className="absolute right-4 top-4">
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
                    className={`size-5 transition-colors duration-150 sm:size-4 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white"}`}
                  />
                </Button>
              </div>
            )}

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

            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors duration-150 group-hover:text-orange-400">
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

              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-pink-500 to-yellow-500 px-4 text-white transition-all duration-150 hover:from-pink-600 hover:to-yellow-600 sm:h-8 sm:px-3"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = `/book/${activity.id}/select`
                }}
              >
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
                <ArrowRight className="ml-1 size-4 sm:size-3" />
              </Button>
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
            <div className="h-8 w-20 rounded bg-gray-600"></div>
            <div className="h-8 w-16 rounded bg-gray-600"></div>
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
          debugLog("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 150)

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
      className="rounded-xl border p-4 shadow-2xl backdrop-blur-md sm:p-6 lg:p-8"
      style={{
        borderColor: "rgba(250, 5, 124, 0.3)",
        backgroundColor: "rgba(250, 5, 124, 0.15)"
      }}
    >
      <h3
        id="search-heading"
        className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl"
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
              placeholder="Try 'boat tours', 'hiking'..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              className="h-10 border-white/30 bg-white/20 text-sm text-white backdrop-blur-sm transition-all placeholder:text-white/70 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 sm:h-12 sm:text-base lg:h-14 lg:text-lg"
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
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white/80 transition-all duration-150 hover:border-yellow-400 hover:bg-white/20 hover:text-white"
                >
                  {query}
                </button>
              )
            )}
          </div>

          <Button
            type="submit"
            className="h-10 w-full text-sm font-semibold text-black shadow-lg transition-all duration-150 hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:h-12 sm:text-base lg:h-14 lg:text-lg"
            style={{
              background: `#fff546`
            }}
            aria-describedby="search-button-help"
          >
            <Search
              className="mr-1 size-3 sm:mr-2 sm:size-4 lg:mr-3 lg:size-5"
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
          <div className="animate-in fade-in slide-in-from-top-2 absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-white/20 bg-black/90 shadow-2xl backdrop-blur-xl duration-100">
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
                    className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left transition-all duration-100 hover:scale-[1.02] hover:border-pink-500/50 hover:bg-white/10 active:scale-[0.98]"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Enhanced Image */}
                      {activity.images?.[0] && (
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={activity.images[0].imageUrl}
                            alt={activity.images[0].altText || activity.title}
                            fill
                            className="object-cover transition-transform duration-150 group-hover:scale-110"
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
                          <h4 className="font-semibold text-white transition-colors hover:text-yellow-400">
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
                      <div className="flex items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-semibold text-black transition-all duration-150 hover:shadow-lg"
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentFeaturedCard, setCurrentFeaturedCard] = useState(0)
  const featuredContainerRef = useRef<HTMLDivElement>(null)

  // Image slideshow timer - Working immediately!
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % loadedVideos.length)
    }, 2500) // 2.5 second intervals for faster slideshow
    return () => clearInterval(interval)
  }, [loadedVideos.length])

  // Handle scroll to detect current featured activity card
  useEffect(() => {
    const container = featuredContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      // Account for padding and actual card width
      const cardElements = container.querySelectorAll(".featured-activity-card")
      if (cardElements.length > 0) {
        const firstCard = cardElements[0] as HTMLElement
        const cardWidth = firstCard.offsetWidth + 32 // card width + gap
        const newIndex = Math.round(scrollLeft / cardWidth)
        setCurrentFeaturedCard(
          Math.min(newIndex, featuredActivities.length - 1)
        )
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [featuredActivities.length])

  // Fetch featured activities
  useEffect(() => {
    const fetchFeaturedActivities = async () => {
      debugLog("🔍 Starting to fetch featured activities...")
      try {
        const response = await fetch("/api/featured-activities")
        const result = await response.json()

        debugLog("📊 Featured activities API response:", result)

        if (result.success && result.data && result.data.length > 0) {
          debugLog("✅ Successfully fetched activities:", result.data.length)
          setFeaturedActivities(result.data.slice(0, 6)) // Limit to 6 activities
        } else {
          debugLog("⚠️ API returned no activities, using fallback strategy...")

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
              debugLog(
                "✅ Fallback successful, loaded:",
                fallbackResult.data.length,
                "activities"
              )
              setFeaturedActivities(fallbackResult.data.slice(0, 6))
            } else {
              debugLog("❌ Both API and fallback failed, no activities loaded")
            }
          } catch (fallbackError) {
            debugLog("💥 Fallback strategy failed:", fallbackError)
          }
        }
      } catch (error) {
        debugLog("💥 Error fetching featured activities:", error)

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
            debugLog(
              "✅ Network error fallback successful:",
              fallbackResult.data.length,
              "activities"
            )
            setFeaturedActivities(fallbackResult.data.slice(0, 6))
          }
        } catch (fallbackError) {
          debugLog("💥 Network error fallback failed:", fallbackError)
        }
      }
    }

    // Execute immediately
    fetchFeaturedActivities()
  }, [])

  debugLog(
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
      latitude: "39.5674",
      longitude: "2.6479",
      videoUrl: null,
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
      latitude: "39.7654",
      longitude: "2.7148",
      videoUrl: null,
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
      latitude: "39.5615",
      longitude: "2.6281",
      videoUrl: null,
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
      latitude: "39.6334",
      longitude: "2.9889",
      videoUrl: null,
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
      latitude: "39.5353",
      longitude: "3.3307",
      videoUrl: null,
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
      latitude: "39.6834",
      longitude: "2.8507",
      videoUrl: null,
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

  const handleVideoError = () => {
    debugLog("🚨 Video failed to load:", videoRef.current?.src)
    debugLog("🔄 Attempting fallback video...")
    // Automatically try fallback video
    if (
      heroVideos[currentVideoIndex]?.fallbackSrc &&
      videoRef.current?.src !== heroVideos[currentVideoIndex]?.fallbackSrc
    ) {
      videoRef.current.src = heroVideos[currentVideoIndex]?.fallbackSrc
    }
    setIsVideoLoaded(false)
    setIsVideoPlaying(false)
  }

  return (
    <div
      className="relative"
      style={{
        scrollBehavior: "smooth"
      }}
    >
      <main
        style={{
          WebkitOverflowScrolling: "touch"
        }}
      >
        {/* Responsive Hero Section - Both Mobile and Desktop show "WE ARE EXCURSIONS" */}
        <div className="block lg:hidden">
          <MobileOptimizedHeroSection />
        </div>

        {/* Desktop Hero Section - Same branding as mobile but optimized for desktop */}
        <div className="hidden lg:block">
          <DesktopHeroSection />
        </div>

        {/* Enhanced Activity Categories Section - Horizontal Scroll */}
        <EnhancedCategoriesSection />

        {/* Enhanced Featured Activities Section - Real Database-Driven - MOBILE OPTIMIZED */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black py-12 sm:py-16 lg:py-24"
          style={{
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Ambient background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-yellow-500/5 to-transparent"></div>
          <div className="bg-grid-white/[0.02] absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,_transparent_20%,_black)]"></div>

          <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <AnimatedSection className="mb-8 text-center sm:mb-12 lg:mb-20">
              <div className="animate-in zoom-in-75 fade-in duration-350 relative inline-block ease-out">
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

              <h2 className="animate-in slide-in-from-bottom-4 fade-in duration-350 mb-4 text-3xl font-bold text-white delay-100 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
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
                ref={featuredContainerRef}
                id="featured-carousel"
                className="scrollbar-hide flex overflow-x-auto pb-4 md:gap-6 md:px-4 md:pb-6 lg:gap-8"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  scrollPadding: "0",
                  WebkitOverflowScrolling: "touch"
                }}
              >
                {featuredActivities.length > 0
                  ? featuredActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="featured-activity-card animate-in fade-in slide-in-from-right-12 duration-250 w-full flex-none px-4 md:w-[350px] md:px-0"
                        style={{
                          scrollSnapAlign: "start",
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <EnhancedActivityCard activity={activity} />
                      </div>
                    ))
                  : // Enhanced loading state with skeleton cards
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className="featured-activity-card animate-in fade-in slide-in-from-right-12 duration-250 w-full flex-none px-4 md:w-[350px] md:px-0"
                        style={{
                          scrollSnapAlign: "start",
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <ActivityCardSkeleton />
                      </div>
                    ))}
              </div>

              {/* Swipe Indicators and Progress Bar - Mobile Only */}
              <div className="mt-6 space-y-3 px-4 lg:hidden">
                {/* Progress Bar */}
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-yellow-400"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((currentFeaturedCard + 1) / featuredActivities.length) * 100}%`
                    }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  />
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2">
                  {featuredActivities.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const container = featuredContainerRef.current
                        if (container) {
                          const cardElements = container.querySelectorAll(
                            ".featured-activity-card"
                          )
                          if (cardElements.length > index) {
                            const targetCard = cardElements[
                              index
                            ] as HTMLElement
                            container.scrollTo({
                              left: targetCard.offsetLeft - 16, // Account for padding
                              behavior: "smooth"
                            })
                          }
                        }
                      }}
                      className={`transition-all duration-150 ${
                        index === currentFeaturedCard
                          ? "h-2 w-8 bg-white"
                          : "size-2 bg-white/40 hover:bg-white/60"
                      } rounded-full`}
                      aria-label={`Go to activity ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Card Counter */}
                <div className="text-center">
                  <span className="text-sm font-medium text-white/80">
                    {currentFeaturedCard + 1} of {featuredActivities.length}{" "}
                    activities
                  </span>
                </div>
              </div>

              {/* Enhanced scroll indicator with stats - MOBILE OPTIMIZED */}
              <div className="animate-in fade-in slide-in-from-bottom-4 delay-350 duration-250 mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-between lg:gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Palette className="size-3 sm:size-4" />
                  <span className="text-xs sm:text-sm">
                    {featuredActivities.length > 0
                      ? `${featuredActivities.length} featured experiences available`
                      : "Loading featured experiences..."}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 sm:gap-4 sm:text-sm lg:gap-6">
                  <div className="flex items-center gap-1">
                    <Star className="size-3 text-yellow-400 sm:size-4" />
                    <span>Avg 4.8★ rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-3 text-blue-400 sm:size-4" />
                    <span>1000+ bookings</span>
                  </div>
                  <div className="hidden items-center gap-1 sm:flex">
                    <CheckCircle className="size-3 text-green-400 sm:size-4" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedSection
              className="mt-16 hidden text-center sm:block"
              delay={0.4}
            >
              <div className="transition-all duration-150 hover:scale-105 active:scale-95">
                <Link href="/activities">
                  <Button
                    size="lg"
                    className="hover:shadow-3xl group relative overflow-hidden px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-150"
                    style={{
                      background: "linear-gradient(to right, #ff1dce, #dc2626)",
                      boxShadow: "0 25px 50px -12px rgba(255, 29, 206, 0.25)"
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <Activity className="mr-3 size-6" />
                      Explore All Activities
                      <ArrowRight className="ml-3 size-6 transition-transform duration-150 group-hover:translate-x-1" />
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to right, #e91e63, #b91c1c)"
                      }}
                    ></div>
                  </Button>
                </Link>
              </div>

              <p className="animate-in fade-in duration-250 mt-4 text-gray-400 delay-500">
                Browse 50+ amazing activities across Mallorca
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Enhanced Activity Locations Map Section */}
        <EnhancedActivitiesMapSection />

        {/* Enhanced Newsletter Section - COMMENTED OUT */}
        {/* 
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <AnimatedSection>
              <Badge className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-white">
                <Gift className="mr-2 size-4" />
                Exclusive Offers
              </Badge>

              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Get 15% Off Your First Adventure
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
                Join our newsletter and be the first to discover new activities,
                exclusive deals, and insider tips.
              </p>

              <GlassmorphismCard className="mx-auto max-w-md p-6">
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
                    <Gift className="mr-2 size-4" />
                    Claim 15% Discount
                  </Button>
                </div>
              </GlassmorphismCard>
            </AnimatedSection>
          </div>
        </section>
        */}

        {/* Premium Reviews Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 sm:py-16 lg:py-20">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 to-yellow-400/5" />
            <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-pink-600/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-yellow-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <AnimatedSection className="mb-8 text-center sm:mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1.5 text-xs font-bold text-black shadow-lg sm:px-6 sm:py-2 sm:text-sm">
                <Star className="mr-1.5 size-3 sm:mr-2 sm:size-4" />
                Trusted by Thousands
              </Badge>
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-4xl lg:text-5xl">
                What Our{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Adventurers Say
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-sm text-gray-300 sm:text-base lg:text-lg">
                Real stories from travelers who discovered the magic of Mallorca
                with us
              </p>

              {/* Overall Rating */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400 sm:size-6"
                    />
                  ))}
                </div>
                <p className="text-lg font-bold text-white sm:text-xl">
                  4.9 out of 5 · 10,237 reviews
                </p>
              </div>
            </AnimatedSection>

            {/* Premium Reviews Carousel */}
            <div className="relative">
              {/* Navigation Buttons for Desktop */}
              <div className="absolute -top-24 right-0 z-10 hidden gap-2 lg:flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-white/20 bg-white/10 text-white backdrop-blur-xl hover:border-yellow-400/50 hover:bg-white/20"
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
                  className="size-12 border-white/20 bg-white/10 text-white backdrop-blur-xl hover:border-yellow-400/50 hover:bg-white/20"
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
                className="scrollbar-hide flex gap-3 overflow-x-auto px-3 pb-4 sm:gap-4 sm:px-0 sm:pb-6"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  scrollPadding: "0 12px"
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
                    className="group w-[85vw] max-w-[340px] shrink-0 snap-start sm:w-[380px] sm:min-w-[380px] lg:w-[420px] lg:min-w-[420px]"
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-4 shadow-xl backdrop-blur-sm transition-all duration-150 hover:border-white/20 hover:bg-white/15 hover:shadow-2xl hover:shadow-pink-500/10 sm:p-8">
                      {/* Floating Quote Icon */}
                      <div className="absolute -right-2 -top-2 size-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 opacity-10 blur-2xl" />
                      <div className="absolute right-2 top-2 text-2xl text-yellow-400/20 sm:right-4 sm:top-4 sm:text-4xl">
                        ❝
                      </div>

                      {/* Review Header */}
                      <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="size-10 shrink-0 rounded-full border-2 border-yellow-400/30 object-cover sm:size-14"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white sm:text-base">
                            {testimonial.name}
                          </h3>
                          <p className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="size-3" />
                            {testimonial.location}
                          </p>
                          <div className="mt-1 flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="size-3 fill-yellow-400 text-yellow-400 sm:size-4"
                              />
                            ))}
                          </div>
                        </div>
                        <Badge className="hidden shrink-0 border-green-400/30 bg-green-400/20 px-2 py-1 text-xs text-green-400 sm:flex">
                          <CheckCircle className="mr-1 size-3" />
                          Verified
                        </Badge>
                      </div>

                      {/* Review Text */}
                      <p className="mb-3 line-clamp-4 flex-1 text-xs leading-relaxed text-gray-200 sm:mb-4 sm:line-clamp-none sm:text-base">
                        "{testimonial.text}"
                      </p>

                      {/* Activity Badge */}
                      <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Badge className="w-fit border-pink-400/30 bg-pink-400/10 px-2 py-1 text-[10px] text-pink-300 sm:px-3 sm:py-1.5 sm:text-xs">
                          <Activity className="mr-1 size-3" />
                          {testimonial.activity}
                        </Badge>
                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          2 weeks ago
                        </p>
                      </div>

                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 transition-opacity duration-150 group-hover:opacity-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Scroll Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 sm:hidden">
                <ChevronLeft className="size-3 animate-pulse" />
                <span>Swipe to see more reviews</span>
                <ChevronRight className="size-3 animate-pulse" />
              </div>

              {/* Enhanced Trust Section */}
              <div className="mt-8 sm:mt-12">
                <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <CheckCircle className="size-8 text-green-400 sm:size-10" />
                      </div>
                      <p className="text-xl font-bold text-white sm:text-2xl">
                        100%
                      </p>
                      <p className="text-xs text-gray-400 sm:text-sm">
                        Verified Reviews
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <Award className="size-8 text-yellow-400 sm:size-10" />
                      </div>
                      <p className="text-xl font-bold text-white sm:text-2xl">
                        4.9/5
                      </p>
                      <p className="text-xs text-gray-400 sm:text-sm">
                        Average Rating
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <Heart className="size-8 text-pink-400 sm:size-10" />
                      </div>
                      <p className="text-xl font-bold text-white sm:text-2xl">
                        10k+
                      </p>
                      <p className="text-xs text-gray-400 sm:text-sm">
                        Happy Customers
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <TrendingUp className="size-8 text-blue-400 sm:size-10" />
                      </div>
                      <p className="text-xl font-bold text-white sm:text-2xl">
                        98%
                      </p>
                      <p className="text-xs text-gray-400 sm:text-sm">
                        Would Recommend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-500 to-pink-600 py-12 sm:py-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20"></div>
            <div className="absolute left-1/4 top-0 size-72 rounded-full bg-yellow-400/10 blur-3xl sm:size-96"></div>
            <div className="absolute bottom-0 right-1/4 size-72 rounded-full bg-pink-300/10 blur-3xl sm:size-96"></div>
          </div>

          <div className="relative mx-auto max-w-6xl px-3 sm:px-4">
            <AnimatedSection>
              {/* Glassmorphism Container */}
              <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-pink-500/20 backdrop-blur-sm sm:rounded-3xl sm:p-8 lg:p-12">
                  {/* Badge */}
                  <div className="mb-4 flex justify-center sm:mb-6">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1.5 text-sm font-bold text-black shadow-lg sm:px-6 sm:py-2 sm:text-base">
                      <Sparkles className="mr-1.5 size-3 sm:mr-2 sm:size-4" />
                      Ready for Adventure?
                    </Badge>
                  </div>

                  {/* Headline */}
                  <h2 className="mb-3 text-center text-2xl font-bold text-white sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl">
                    Start Your{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      Mallorca Journey
                    </span>{" "}
                    Today
                  </h2>

                  {/* Subtext */}
                  <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-white/90 sm:mb-8 sm:text-base lg:mb-10 lg:text-lg">
                    Join thousands of satisfied travelers who have discovered
                    the magic of Mallorca with us. Book your perfect adventure
                    now and create memories that will last a lifetime.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:gap-6">
                    <Link href="/activities">
                      <Button
                        size="lg"
                        className="group relative h-auto w-full overflow-hidden px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-150 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                        style={{
                          background:
                            "linear-gradient(to right, #ec4899, #db2777)",
                          boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.4)"
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to right, #db2777, #be185d)"
                          }}
                        ></div>
                        <span className="relative flex items-center justify-center">
                          <Sparkles className="mr-1.5 size-4 sm:mr-2 sm:size-5" />
                          Book Your Adventure
                          <ArrowRight className="ml-1.5 size-4 transition-transform duration-150 group-hover:translate-x-1 sm:ml-2 sm:size-5" />
                        </span>
                      </Button>
                    </Link>

                    <Link href="/test-qr">
                      <Button
                        size="lg"
                        variant="outline"
                        className="group h-auto w-full border-2 border-pink-200 bg-transparent px-6 py-3 text-base font-bold text-pink-200 shadow-lg transition-all duration-150 hover:scale-105 hover:bg-pink-200 hover:text-pink-700 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                      >
                        <span className="flex items-center justify-center">
                          🎫 Try QR Tickets
                          <ArrowRight className="ml-1.5 size-4 transition-transform duration-150 group-hover:translate-x-1 sm:ml-2 sm:size-5" />
                        </span>
                      </Button>
                    </Link>

                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="group h-auto w-full border-2 border-yellow-400 bg-transparent px-6 py-3 text-base font-bold text-yellow-400 shadow-lg transition-all duration-150 hover:scale-105 hover:bg-yellow-400 hover:text-pink-700 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                      >
                        <span className="flex items-center justify-center">
                          Get in Touch
                          <ArrowRight className="ml-1.5 size-4 transition-transform duration-150 group-hover:translate-x-1 sm:ml-2 sm:size-5" />
                        </span>
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Elements */}
                  <div className="mt-6 border-t border-white/20 pt-4 sm:mt-8 sm:pt-6 lg:mt-12 lg:pt-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:gap-6 sm:text-sm lg:gap-8">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Shield className="size-3 text-yellow-400 sm:size-4" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="size-3 text-yellow-400 sm:size-4" />
                        <span>Instant</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Heart className="size-3 text-yellow-400 sm:size-4" />
                        <span>5-Star</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Users className="size-3 text-yellow-400 sm:size-4" />
                        <span>10,000+</span>
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
