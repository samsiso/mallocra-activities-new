"use client"

import { ActivityWithDetails } from "@/actions/db/activities-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Heart, MapPin, Star } from "lucide-react"
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.3 }}
      className="h-full"
      style={{ touchAction: "manipulation" }}
    >
      <Link href={`/activities/${activity.slug}`} className="block h-full">
        <div
          className="h-full overflow-hidden rounded-xl border-2 border-pink-500/20 bg-black/80 shadow-lg"
          style={{
            transform: "none",
            WebkitTransform: "none"
          }}
        >
          {/* Enhanced Image Section */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageError ? fallbackImageUrl : imageUrl}
              alt={primaryImage?.altText || activity.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority
              loading="eager"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Top Right - Only Wishlist */}
            <div className="absolute right-3 top-3">
              <button
                onClick={handleWishlistToggle}
                className="flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-700 transition-colors hover:bg-white"
              >
                <Heart
                  className={`size-4 transition-colors ${
                    isWishlisted ? "fill-pink-500 text-pink-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Bottom - Price only */}
            <div className="absolute bottom-3 right-3">
              <div className="rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                <div className="text-xl font-bold text-white">€{price}</div>
              </div>
            </div>
          </div>

          {/* Card Content - Simplified */}
          <div className="p-3">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-base font-bold text-white">
              {activity.title}
            </h3>

            {/* Key Info Row */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <MapPin className="size-3" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{Math.round(activity.durationMinutes / 60)}h</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span>{activity.avgRating}</span>
              </div>
            </div>

            {/* Action button */}
            <button className="w-full rounded-md bg-pink-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-pink-600 active:scale-100 active:bg-pink-500">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
