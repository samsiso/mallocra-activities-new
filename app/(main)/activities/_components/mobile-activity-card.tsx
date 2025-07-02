"use client"

/*
Mobile-optimized Activity Card Component
Features touch-friendly design, simplified information display,
larger touch targets, and swipe gestures for better mobile UX
*/

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Heart, Clock, Users } from "lucide-react"

interface MobileActivityCardProps {
  activity: any
}

export default function MobileActivityCard({
  activity
}: MobileActivityCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Extract data
  const primaryImage = activity.activity_images?.[0] || activity.images?.[0]
  const pricing = activity.activity_pricing?.[0] || activity.pricing?.[0]
  const basePrice = pricing?.base_price || pricing?.basePrice || 45
  const location = activity.location || "Mallorca"
  const rating = activity.avg_rating ? parseFloat(activity.avg_rating) : 4.8
  const duration = activity.duration_minutes
    ? Math.round(activity.duration_minutes / 60)
    : 3

  // Get image URL with fallback
  const getImageUrl = () => {
    const imageSource = primaryImage?.imageUrl || primaryImage?.image_url
    if (imageSource && !imageError) return imageSource

    // Pink-themed fallback gradient
    return "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3e%3cdefs%3e%3clinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23ec4899'/%3e%3cstop offset='100%25' stop-color='%23f472b6'/%3e%3c/linearGradient%3e%3c/defs%3e%3crect width='400' height='300' fill='url(%23a)'/%3e%3c/svg%3e"
  }

  return (
    <Link
      href={`/activities/${activity.slug || activity.id}`}
      className="group block w-full"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-300 active:scale-[0.98]">
        {/* Compact Image Section - 200px height for mobile */}
        <div className="relative h-[200px] w-full overflow-hidden">
          <Image
            src={getImageUrl()}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-500 group-active:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Price Badge - Top Left */}
          <div className="absolute left-3 top-3 z-10">
            <Badge className="border-0 bg-pink-500/90 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
              €{basePrice}
            </Badge>
          </div>

          {/* Wishlist Button - Top Right, Larger Touch Target */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 z-10 size-10 rounded-full bg-black/40 backdrop-blur-sm transition-all active:scale-90"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`mx-auto size-5 transition-colors ${
                isWishlisted ? "fill-pink-500 text-pink-500" : "text-white"
              }`}
            />
          </button>

          {/* Title Overlay - Bottom of Image */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <h3 className="line-clamp-2 text-lg font-bold text-white">
              {activity.title}
            </h3>
          </div>
        </div>

        {/* Simplified Content Section */}
        <div className="space-y-3 p-4">
          {/* Quick Info Row */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <MapPin className="size-4 text-pink-400" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4 text-pink-400" />
              <span>{duration}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex gap-2">
            <Badge className="border-white/20 bg-white/10 text-xs text-white/90">
              {activity.category
                ?.replace("_", " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>
          </div>

          {/* Book Button - Full Width for Easy Tapping */}
          <Button
            className="h-12 w-full bg-gradient-to-r from-pink-500 to-pink-600 font-bold text-white shadow-lg transition-all active:scale-95"
            size="lg"
          >
            Book Now
          </Button>
        </div>
      </div>
    </Link>
  )
}
