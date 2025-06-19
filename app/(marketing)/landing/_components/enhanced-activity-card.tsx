"use client"

import { ActivityWithDetails } from "@/actions/db/activities-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Heart,
  MapPin,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

interface EnhancedActivityCardProps {
  activity: ActivityWithDetails
}

export default function EnhancedActivityCard({
  activity
}: EnhancedActivityCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group cursor-pointer"
    >
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
              </div>

              {/* Wishlist button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleWishlistToggle}
                className="size-10 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
              >
                <Heart
                  className={`size-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Bottom content overlay */}
            <div className="absolute inset-x-4 bottom-4">
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{activity.avgRating}</span>
                <span className="text-white/70">({activity.totalReviews})</span>
                {activity.spotsLeft && activity.spotsLeft <= 5 && (
                  <Badge className="ml-auto bg-red-500 text-xs font-bold text-white">
                    Only {activity.spotsLeft} left!
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-orange-400">
              {activity.title}
            </h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-300">
              {activity.shortDescription}
            </p>

            {/* Activity details */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="size-4" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="size-4" />
                <span>
                  {Math.round(activity.durationMinutes / 60)}h duration
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="size-4" />
                <span>Up to {activity.maxParticipants} people</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <TrendingUp className="size-4" />
                <span>{activity.totalBookings} bookings</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  €{price}
                </div>
                <div className="text-xs text-gray-500">per person</div>
              </div>
            </div>

            {/* Action button */}
            <Link
              href={`/book/${activity.id}/select`}
              onClick={e => e.stopPropagation()}
            >
              <Button className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
