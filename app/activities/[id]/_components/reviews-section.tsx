"use client"

/*
<ai_context>
Reviews section component for activity detail pages.
Shows overall rating, rating distribution, and individual customer reviews.
Provides social proof to boost conversion rates.
Now connected to activities database.
</ai_context>
*/

import { useState } from "react"
import { Star, ThumbsUp, MoreHorizontal, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ActivityWithDetails } from "@/actions/db/activities-actions"

interface ReviewsSectionProps {
  activity: ActivityWithDetails
}

// Mock reviews data (will be replaced with database query)
const mockReviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612c6cd?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2025-01-20",
    title: "Absolutely incredible experience!",
    content:
      "This activity was the highlight of our Mallorca trip! The instructor was professional and made us feel safe while having the time of our lives. The views were breathtaking, and we even spotted some dolphins! Highly recommend for anyone visiting the island.",
    helpful: 12,
    verified: true
  },
  {
    id: "2",
    author: "Marcus Weber",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2025-01-18",
    title: "Perfect for beginners",
    content:
      "Never done this before, but the team made it so easy and fun! Great safety briefing and constant support. The experience was amazing - perfect photo opportunities!",
    helpful: 8,
    verified: true
  },
  {
    id: "3",
    author: "Emma Thompson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 4,
    date: "2025-01-15",
    title: "Great fun, slightly overpriced",
    content:
      "Really enjoyed the experience and the guide was fantastic. Beautiful location and well-organized. Only downside is it felt a bit pricey for the duration, but overall worth it for the memories!",
    helpful: 5,
    verified: true
  },
  {
    id: "4",
    author: "David Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2025-01-12",
    title: "Adventure of a lifetime!",
    content:
      "Booked this for my wife's birthday and it exceeded all expectations. Professional equipment, stunning scenery, and an unforgettable experience. The photos were a nice touch too!",
    helpful: 15,
    verified: true
  }
]

const ratingDistribution = [
  { stars: 5, percentage: 78, count: 183 },
  { stars: 4, percentage: 15, count: 35 },
  { stars: 3, percentage: 4, count: 10 },
  { stars: 2, percentage: 2, count: 4 },
  { stars: 1, percentage: 1, count: 2 }
]

export default function ReviewsSection({ activity }: ReviewsSectionProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  // Extract rating data from activity
  const rating = parseFloat(activity.avgRating || "4.5")
  const reviewCount = activity.totalReviews

  const displayedReviews = showAllReviews
    ? mockReviews
    : mockReviews.slice(0, 3)

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "size-4",
      md: "size-5",
      lg: "size-6"
    }

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating ? "fill-current text-yellow-500" : "text-gray-400"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>

        {/* Overall Rating Summary */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Rating Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{rating}</div>
                {renderStars(rating, "lg")}
                <p className="mt-1 text-sm text-gray-400">
                  {reviewCount} reviews
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>98% would recommend this activity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>95% rated 4 stars or higher</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map(item => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex w-12 items-center gap-1 text-sm text-gray-300">
                  <span>{item.stars}</span>
                  <Star className="size-3 fill-current text-yellow-500" />
                </div>
                <div className="h-2 flex-1 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-sm text-gray-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-700 pt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Filter className="mr-2 size-4" />
            All Ratings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Verified Only
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Sort by:</span>
          <select
            className="rounded border border-gray-600 bg-gray-800 px-2 py-1 text-gray-300"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map(review => (
          <div
            key={review.id}
            className="rounded-lg border border-gray-700 bg-gray-800 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={review.avatar} alt={review.author} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {review.author
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">
                      {review.author}
                    </h4>
                    {review.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-600 text-white"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-white">{review.title}</h5>
              <p className="leading-relaxed text-gray-300">{review.content}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ThumbsUp className="mr-2 size-4" />
                Helpful ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!showAllReviews && mockReviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(true)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Show All {mockReviews.length} Reviews
          </Button>
        </div>
      )}
    </div>
  )
}
