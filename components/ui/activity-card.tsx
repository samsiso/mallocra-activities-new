"use client"

/*
<ai_context>
Activity card component for displaying activity listings.
Features image galleries, pricing, ratings, availability, and booking options.
Implements dark theme with lighter, more vibrant rose accents and yellow premium indicators.
</ai_context>
*/

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Clock,
  Users,
  MapPin,
  Star,
  Heart,
  Calendar,
  Zap,
  TrendingUp
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ActivityCardProps {
  id: string
  title: string
  shortDescription: string
  category: string
  location: string
  duration: number // in minutes
  maxParticipants: number
  price: number
  currency: string
  rating: number
  reviewCount: number
  imageUrl: string
  imageAlt: string
  availableToday?: boolean
  featured?: boolean
  spotsLeft?: number
  className?: string
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}min`
  } else if (remainingMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${remainingMinutes}min`
  }
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0
  }).format(price)
}

export default function ActivityCard({
  id,
  title,
  shortDescription,
  category,
  location,
  duration,
  maxParticipants,
  price,
  currency,
  rating,
  reviewCount,
  imageUrl,
  imageAlt,
  availableToday = true,
  featured = false,
  spotsLeft,
  className
}: ActivityCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"

  return (
    <Link href={`/activities/${id}`} className="group block">
      <Card
        className={cn(
          "overflow-hidden border-2 border-yellow-300/80 bg-rose-500/95 transition-all duration-300",
          "hover:-translate-y-2 hover:border-yellow-300 hover:shadow-2xl hover:shadow-yellow-300/30",
          "focus-within:border-yellow-300 focus-within:shadow-2xl focus-within:shadow-yellow-300/30",
          className
        )}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageError ? fallbackImageUrl : imageUrl}
            alt={imageAlt}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-110",
              !imageLoaded && "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={featured}
          />

          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-rose-500" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {featured && (
                <Badge className="border-none bg-yellow-300 font-bold text-black shadow-xl shadow-yellow-300/50">
                  ⭐ Featured
                </Badge>
              )}
              {availableToday && (
                <Badge className="border-none bg-green-500 font-bold text-white shadow-lg shadow-green-500/40">
                  <Zap className="mr-1 size-3" />
                  Available Today
                </Badge>
              )}
              {spotsLeft && spotsLeft <= 5 && (
                <Badge className="border-none bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/40">
                  <TrendingUp className="mr-1 size-3" />
                  Only {spotsLeft} spots left
                </Badge>
              )}
            </div>

            {/* Wishlist button */}
            <Button
              variant="ghost"
              size="sm"
              className="size-9 border-none bg-black/30 p-0 shadow-lg backdrop-blur-sm hover:bg-black/50"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={cn(
                  "size-4 transition-colors",
                  isWishlisted ? "fill-rose-400 text-rose-400" : "text-white"
                )}
              />
            </Button>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute inset-x-3 bottom-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1 rounded bg-black/30 px-2 py-1 shadow-lg backdrop-blur-sm">
                <Star className="size-4 fill-yellow-300 text-yellow-300 drop-shadow-md" />
                <span className="text-sm font-bold drop-shadow-sm">
                  {rating}
                </span>
                <span className="text-xs text-gray-200 drop-shadow-sm">
                  ({reviewCount})
                </span>
              </div>

              <div className="rounded bg-black/30 px-2 py-1 shadow-lg backdrop-blur-sm">
                <span className="text-lg font-bold drop-shadow-lg">
                  {formatPrice(price, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white drop-shadow-md transition-colors group-hover:text-yellow-100">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-yellow-100 drop-shadow-sm">
              {shortDescription}
            </p>
          </div>

          {/* Activity Details */}
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-yellow-100">
            <div className="flex items-center gap-1">
              <MapPin className="size-4 text-yellow-300 drop-shadow-sm" />
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4 text-yellow-300 drop-shadow-sm" />
              <span className="font-medium">{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-4 text-yellow-300 drop-shadow-sm" />
              <span className="font-medium">Up to {maxParticipants}</span>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {availableToday && (
                <Badge
                  variant="outline"
                  className="border-green-400 bg-green-500/20 font-bold text-green-300 shadow-sm"
                >
                  <Calendar className="mr-1 size-3" />
                  Book Today
                </Badge>
              )}
            </div>

            <Link
              href={`/book/${id}/select`}
              onClick={e => e.stopPropagation()}
            >
              <Button
                size="sm"
                className="border-none bg-yellow-300 px-4 font-bold text-black shadow-xl shadow-yellow-300/50 transition-all duration-200 hover:scale-105 hover:bg-yellow-200 hover:shadow-yellow-200/60"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
