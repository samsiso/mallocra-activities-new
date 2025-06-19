"use client"

/*
<ai_context>
Enhanced Similar Activities - Full Width Grid Component
Shows related activities in an attractive grid layout for the main page.
Features dark glassmorphism theme and improved visual presentation.
Designed for cross-selling and user engagement.
</ai_context>
*/

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ActivityWithDetails,
  getActivitiesSupabaseAction
} from "@/actions/db/activities-actions"

interface SimilarActivitiesProps {
  currentActivityId: string
  category: string
}

// Enhanced glassmorphism card component
function GlassmorphismCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default function SimilarActivities({
  currentActivityId,
  category
}: SimilarActivitiesProps) {
  const [similarActivities, setSimilarActivities] = useState<
    ActivityWithDetails[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarActivities = async () => {
      setLoading(true)
      // Get 3 activities from the same category, excluding current activity
      const result = await getActivitiesSupabaseAction()
      if (result.isSuccess) {
        // Filter for same category and exclude current activity
        const filtered = result.data
          .filter(
            act => act.id !== currentActivityId && act.category === category
          )
          .slice(0, 3)

        // If not enough in same category, add from different categories
        if (filtered.length < 3) {
          const additional = result.data
            .filter(
              act => act.id !== currentActivityId && act.category !== category
            )
            .slice(0, 3 - filtered.length)
          setSimilarActivities([...filtered, ...additional])
        } else {
          setSimilarActivities(filtered)
        }
      }
      setLoading(false)
    }

    fetchSimilarActivities()
  }, [currentActivityId, category])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <GlassmorphismCard key={i} className="overflow-hidden p-0">
            <div className="h-48 animate-pulse bg-white/10"></div>
            <div className="space-y-3 p-4">
              <div className="h-4 animate-pulse rounded bg-white/10"></div>
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/10"></div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/10"></div>
            </div>
          </GlassmorphismCard>
        ))}
      </div>
    )
  }

  if (similarActivities.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No similar activities found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {similarActivities.map(similarActivity => {
        const primaryImage =
          similarActivity.images?.find(img => img.isPrimary) ||
          similarActivity.images?.[0]
        const adultPricing = similarActivity.pricing?.find(
          p => p.priceType === "adult"
        )
        const price = adultPricing ? parseFloat(adultPricing.basePrice) : 0

        return (
          <Link
            key={similarActivity.id}
            href={`/activities/${similarActivity.slug}`}
            className="group block"
          >
            <GlassmorphismCard className="group overflow-hidden p-0 transition-all duration-300 hover:bg-white/15">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={
                    primaryImage?.imageUrl ||
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&q=85"
                  }
                  alt={primaryImage?.altText || similarActivity.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute left-3 top-3">
                  <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">
                    {similarActivity.category
                      .replace("_", " ")
                      .replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>

                {/* Featured Badge */}
                {similarActivity.featured && (
                  <div className="absolute right-3 top-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 border-white/30 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                  onClick={e => {
                    e.preventDefault()
                    // Handle wishlist toggle
                  }}
                >
                  <Heart className="size-4 text-white" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-3 p-4">
                {/* Title */}
                <h3 className="line-clamp-2 font-semibold leading-tight text-white transition-colors group-hover:text-yellow-400">
                  {similarActivity.title}
                </h3>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>{similarActivity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>
                      {Math.floor(similarActivity.durationMinutes / 60)}h
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>Max {similarActivity.maxParticipants}</span>
                  </div>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-white">
                      {similarActivity.avgRating}
                    </span>
                    <span className="text-sm text-white/60">
                      ({similarActivity.totalReviews})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-yellow-400">
                      €{price}
                    </span>
                    <span className="ml-1 text-sm text-white/60">
                      per person
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                  {similarActivity.shortDescription}
                </p>

                {/* CTA */}
                <div className="pt-2">
                  <Button className="w-full border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-white transition-all hover:from-yellow-400/30 hover:to-amber-500/30">
                    View Details
                  </Button>
                </div>
              </div>
            </GlassmorphismCard>
          </Link>
        )
      })}
    </div>
  )
}
