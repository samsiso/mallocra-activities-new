"use client"

/*
<ai_context>
Enhanced Activity Card Component - Phase 1 Improvements
Features improved visual hierarchy, enhanced information density, card variants,
better badges, availability status, and sophisticated interactive elements.
Maintains performance optimization with CSS animations and glassmorphism design.
</ai_context>
*/

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Heart,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Camera,
  Award,
  AlertCircle
} from "lucide-react"
import GlassmorphismCard from "./glassmorphism-card"

interface ActivityCardProps {
  activity: any // Using any for now since we're dealing with Supabase response format
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Real data extraction from Supabase (supporting both structures for compatibility)
  const primaryImage = activity.activity_images?.[0] || activity.images?.[0]

  // Price extraction - prioritize adult pricing, fallback to any pricing, then default
  const adultPricing =
    activity.activity_pricing?.find((p: any) => p.price_type === "adult") ||
    activity.pricing?.find((p: any) => p.priceType === "adult")
  const anyPricing = activity.activity_pricing?.[0] || activity.pricing?.[0]
  const basePrice =
    adultPricing?.base_price ||
    adultPricing?.basePrice ||
    anyPricing?.base_price ||
    anyPricing?.basePrice ||
    45

  // Location and basic info
  const location = activity.location || "Mallorca"
  const rating = activity.avg_rating ? parseFloat(activity.avg_rating) : 4.8
  const reviewCount = activity.total_reviews || 0
  const duration = activity.duration_minutes
    ? Math.round(activity.duration_minutes / 60)
    : 3
  const maxParticipants = activity.max_participants || 20
  const category = activity.category || "adventure"
  const minAge = activity.min_age || 0

  const handleImageLoad = () => {
    setIsImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setIsImageLoading(false)
    setImageError(true)
  }

  // Enhanced image URL logic with fallbacks
  const getReliableImageUrl = () => {
    const imageSource = primaryImage?.imageUrl || primaryImage?.image_url
    if (imageSource) {
      let url = imageSource

      // Fix Unsplash URLs if needed
      if (
        url.includes("images.unsplash.com") &&
        !url.includes("ixlib=rb-4.0.3")
      ) {
        const photoIdMatch = url.match(/photo-([a-zA-Z0-9_-]+)/)
        if (photoIdMatch) {
          const photoId = photoIdMatch[1]
          url = `https://images.unsplash.com/photo-${photoId}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`
        }
      }
      return url
    }

    // Enhanced fallback system
    const fallbackImages = {
      water_sports:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      land_adventures:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cultural:
        "https://images.unsplash.com/photo-1571847834200-19126e61ad0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nightlife:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      family_fun:
        "https://images.unsplash.com/photo-1552154266-f5e9e91fe4f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }

    return (
      fallbackImages[category as keyof typeof fallbackImages] ||
      fallbackImages.land_adventures
    )
  }

  const imageUrl = getReliableImageUrl()

  // Enhanced category colors and overlays
  const getCategoryColors = () => {
    const colors = {
      water_sports: "from-blue-400 to-cyan-500",
      land_adventures: "from-green-400 to-emerald-500",
      cultural: "from-purple-400 to-violet-500",
      nightlife: "from-pink-400 to-rose-500",
      family_fun: "from-pink-400 to-rose-500"
    }
    return colors[category as keyof typeof colors] || colors.land_adventures
  }

  const getCategoryOverlay = (cat: string) => {
    const overlays = {
      water_sports: "bg-gradient-to-br from-blue-500/30 to-cyan-600/30",
      land_adventures: "bg-gradient-to-br from-green-500/30 to-emerald-600/30",
      cultural: "bg-gradient-to-br from-purple-500/30 to-violet-600/30",
      nightlife: "bg-gradient-to-br from-pink-500/30 to-rose-600/30",
      family_fun: "bg-gradient-to-br from-pink-500/30 to-rose-600/30"
    }
    return overlays[cat as keyof typeof overlays] || overlays.land_adventures
  }

  // Smart badge logic with real data
  const getBadges = () => {
    const badges = []

    // Trending badge based on high rating and reviews
    if (rating >= 4.7 && reviewCount > 500) {
      badges.push({
        text: "Trending",
        class:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white activity-badge-trending"
      })
    }

    // Limited availability based on max participants
    if (maxParticipants && maxParticipants <= 10) {
      badges.push({
        text: `${maxParticipants} max`,
        class:
          "bg-gradient-to-r from-red-500 to-pink-600 text-white activity-badge-limited"
      })
    }

    // Popular badge based on reviews
    if (reviewCount > 1000) {
      badges.push({
        text: "Popular",
        class:
          "bg-gradient-to-r from-yellow-500 to-pink-600 text-white activity-badge-pulse"
      })
    }

    return badges
  }

  const badges = getBadges()
  const difficultyLevel =
    minAge >= 16 ? "Advanced" : minAge >= 12 ? "Intermediate" : "Beginner"

  return (
    <Link
      href={`/activities/${activity.slug || activity.id}`}
      className="group block size-full"
    >
      <div
        className={`
          duration-600 activity-card-variant-animations activity-card-will-change relative h-[640px] w-full overflow-hidden rounded-3xl border
          border-white/10 bg-white/5 backdrop-blur-xl
          transition-all ease-out hover:-translate-y-3 hover:scale-[1.02]
          hover:border-white/20 hover:bg-white/10
          hover:shadow-2xl hover:shadow-black/40
        `}
      >
        {/* Enhanced Background Glass Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50" />

        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
          {/* Loading State */}
          {isImageLoading && (
            <div className="absolute inset-0 z-20 flex animate-pulse items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center text-white/60">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-white/20">
                  <div className="size-6 animate-spin">
                    <svg
                      className="size-6 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-xs">Loading adventure...</span>
              </div>
            </div>
          )}

          {/* Category Color Overlay */}
          <div
            className={`absolute inset-0 z-10 opacity-20 mix-blend-overlay ${getCategoryColors()}`}
          />

          {/* Main Image */}
          <Image
            src={imageUrl}
            alt={primaryImage?.alt_text || activity.title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              isImageLoading || imageError ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={false}
          />

          {/* Error State with Beautiful Fallback */}
          {imageError && !isImageLoading && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getCategoryColors()} z-20`}
            >
              <div className="text-center text-white">
                <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <MapPin className="size-8" />
                </div>
                <p className="text-lg font-bold">{activity.title}</p>
                <p className="mt-1 text-sm text-white/80">Mallorca Adventure</p>
              </div>
            </div>
          )}

          {/* Enhanced Gradient Overlay */}
          <div className="z-15 absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Top Badges Row */}
          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
            {/* Trending Badge */}
            {(category === "water-sports" || category === "nightlife") && (
              <Badge className="activity-badge-trending border border-green-400/30 bg-green-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                <TrendingUp className="mr-1 size-3" />
                Trending
              </Badge>
            )}

            {/* Limited Availability Badge */}
            {category === "adventure" && (
              <Badge className="activity-badge-limited border border-red-400/30 bg-red-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                <Zap className="mr-1 size-3" />3 spots left
              </Badge>
            )}
          </div>

          {/* Enhanced Wishlist Heart */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
          >
            <Heart
              className={`size-5 transition-colors duration-300 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          {/* Enhanced Rating Badge */}
          {activity.avg_rating && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <Star className="mr-1 size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-white">
                {activity.avg_rating}
              </span>
              {activity.total_reviews && (
                <span className="ml-1 text-xs text-white/80">
                  ({activity.total_reviews})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Content Section */}
        <div className="flex h-[376px] flex-col space-y-3 p-4">
          {/* Enhanced Badge Section */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`border-white/40 bg-gradient-to-r text-white/90 ${getCategoryColors()} border-transparent text-xs`}
            >
              {activity.category
                ?.replace("_", " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>

            <Badge className="border-white/40 bg-white/15 text-xs text-white/80 backdrop-blur-sm">
              <Shield className="mr-1 size-3" />
              {difficultyLevel}
            </Badge>
          </div>

          {/* Title and Description */}
          <div className="shrink-0">
            <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-yellow-400">
              {activity.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/80">
              {activity.short_description}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid shrink-0 grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur-sm">
              <MapPin className="size-3 shrink-0 text-yellow-400" />
              <div className="min-w-0">
                <div className="truncate font-medium text-white/90">
                  {location}
                </div>
                <div className="text-xs text-white/60">Location</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur-sm">
              <Clock className="size-3 shrink-0 text-blue-400" />
              <div className="min-w-0">
                <div className="font-medium text-white/90">{duration}h</div>
                <div className="text-xs text-white/60">Duration</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur-sm">
              <Users className="size-3 shrink-0 text-green-400" />
              <div className="min-w-0">
                <div className="font-medium text-white/90">
                  Max {maxParticipants}
                </div>
                <div className="text-xs text-white/60">Available</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur-sm">
              <Calendar className="size-3 shrink-0 text-purple-400" />
              <div className="min-w-0">
                <div className="font-medium text-white/90">Today</div>
                <div className="text-xs text-white/60">Available</div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Price and Booking - Fixed at bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
            <div>
              <div className="text-xs text-white/60">From</div>
              <div className="text-xl font-bold text-white">
                €{basePrice.toFixed(0)}
              </div>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-pink-600 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl active:scale-95"
            >
              <span>Book</span>
              <ArrowRight className="ml-1 size-3 transition-all group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Enhanced Loading Skeleton Component
export function ActivityCardSkeleton({
  variant = "default"
}: {
  variant?: "default" | "featured"
}) {
  return (
    <div
      className={`
        relative h-[640px] animate-pulse overflow-hidden rounded-3xl border border-white/10
        bg-white/5
        backdrop-blur-xl
      `}
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-r from-gray-800/50 to-gray-700/50" />

      {/* Content Skeleton */}
      <div className="flex h-[376px] flex-col space-y-3 p-4">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-gray-700/50" />
          <div className="h-4 w-12 rounded-full bg-gray-700/30" />
        </div>

        {/* Title */}
        <div className="shrink-0 space-y-2">
          <div className="h-4 w-3/4 rounded-lg bg-gray-700/50" />
          <div className="h-3 w-1/2 rounded-lg bg-gray-700/30" />
        </div>

        {/* Info Grid */}
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <div className="h-12 rounded-lg bg-gray-700/30" />
          <div className="h-12 rounded-lg bg-gray-700/30" />
          <div className="h-12 rounded-lg bg-gray-700/30" />
          <div className="h-12 rounded-lg bg-gray-700/30" />
        </div>

        {/* Price and Button */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-700/30 pt-3">
          <div className="space-y-1">
            <div className="h-3 w-8 rounded bg-gray-700/30" />
            <div className="h-5 w-12 rounded bg-gray-700/50" />
          </div>
          <div className="h-8 w-16 rounded bg-gray-700/50" />
        </div>
      </div>
    </div>
  )
}

// Enhanced Grid Skeleton
export function ActivityGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => {
        const isFeatured = index % 7 === 0
        return (
          <div
            key={index}
            className={`
              animate-in fade-in duration-700
              ${isFeatured ? "md:col-span-2 xl:col-span-2 2xl:col-span-2" : ""}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ActivityCardSkeleton
              variant={isFeatured ? "featured" : "default"}
            />
          </div>
        )
      })}
    </div>
  )
}
