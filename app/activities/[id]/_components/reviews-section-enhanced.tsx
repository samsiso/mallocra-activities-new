"use client"

/*
<ai_context>
Enhanced Reviews Section - Real-time data from Supabase with authentication
Comprehensive review display with rating distribution, sorting options, and authenticated review submission.
Now connected to Clerk authentication and booking verification.
</ai_context>
*/

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  ThumbsUp,
  Filter,
  SortDesc,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle,
  Calendar,
  User,
  LogIn,
  AlertTriangle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  getActivityReviewsAction,
  getActivityReviewStatsAction,
  updateReviewHelpfulVotesAction
} from "@/actions/db/reviews-actions"
import ReviewSubmissionModal from "./review-submission-modal"

interface EnhancedReviewsSectionProps {
  activityId: string
  userId: string | null
  userProfile: any
  userBookingInfo: any
  activityTitle: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: { rating: number; count: number; percentage: number }[]
  recentTrend: "up" | "down" | "stable"
  verifiedPercentage: number
}

interface Review {
  id: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  title?: string
  content?: string
  pros?: string
  cons?: string
  wouldRecommend: boolean
  isVerified: boolean
  helpfulVotes: number
  photoUrls?: string[]
  createdAt: string
  operatorResponse?: string
  operatorResponseDate?: string
}

export default function EnhancedReviewsSection({
  activityId,
  userId,
  userProfile,
  userBookingInfo,
  activityTitle
}: EnhancedReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // Load reviews and stats
  const loadReviews = async () => {
    setIsLoading(true)
    try {
      console.log("Loading reviews for activity:", activityId)

      const [reviewsResult, statsResult] = await Promise.all([
        getActivityReviewsAction(
          activityId,
          sortBy,
          showAllReviews ? 50 : 6,
          0
        ),
        getActivityReviewStatsAction(activityId)
      ])

      console.log("Reviews result:", reviewsResult)
      console.log("Stats result:", statsResult)

      if (reviewsResult.isSuccess && reviewsResult.data) {
        // Transform database reviews to match our interface
        const transformedReviews = reviewsResult.data.reviews.map(
          (review: any) => ({
            id: review.id,
            customerId: review.customerId,
            customerName: review.reviewerName || "Anonymous User",
            customerAvatar: review.customerAvatar,
            rating: review.rating,
            title: review.title,
            content: review.content,
            pros: review.pros,
            cons: review.cons,
            wouldRecommend: review.wouldRecommend || false,
            isVerified: review.isVerified || false,
            helpfulVotes: review.helpfulVotes || 0,
            photoUrls: review.photoUrls || [],
            createdAt: review.createdAt?.toString() || new Date().toISOString(),
            operatorResponse: review.operatorResponse,
            operatorResponseDate: review.operatorResponseDate?.toString()
          })
        )
        console.log("Transformed reviews:", transformedReviews)
        setReviews(transformedReviews)
      }

      if (statsResult.isSuccess && statsResult.data) {
        // Transform stats to match our interface
        const transformedStats = {
          averageRating: statsResult.data.avgRating || 0,
          totalReviews: statsResult.data.totalReviews || 0,
          ratingDistribution:
            statsResult.data.ratingDistribution?.map((item: any) => ({
              rating: item.stars,
              count: item.count,
              percentage: item.percentage
            })) || [],
          recentTrend: "stable" as const,
          verifiedPercentage: statsResult.data.recommendationPercentage || 0
        }
        console.log("Transformed stats:", transformedStats)
        setReviewStats(transformedStats)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [activityId, sortBy, showAllReviews])

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const result = await updateReviewHelpfulVotesAction(reviewId, true)
      if (result.isSuccess) {
        // Update the local state
        setReviews(prev =>
          prev.map(review =>
            review.id === reviewId
              ? { ...review, helpfulVotes: (review.helpfulVotes || 0) + 1 }
              : review
          )
        )
      }
    } catch (error) {
      console.error("Error updating helpful vote:", error)
    }
  }

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

  // Use real data if available, fallback to activity data
  const rating =
    reviewStats?.averageRating || parseFloat(userProfile?.avgRating || "0")
  const reviewCount =
    reviews.length ||
    reviewStats?.totalReviews ||
    userProfile?.totalReviews ||
    0

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-700"></div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-16 rounded bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 rounded bg-gray-700"></div>
                <div className="h-4 rounded bg-gray-700"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 rounded bg-gray-700"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
          {userId && userBookingInfo && (
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
            >
              <LogIn className="mr-2 size-4" />
              Write Review
            </Button>
          )}
        </div>

        {reviewCount === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 size-12 text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              No reviews yet
            </h3>
            <p className="mb-6 text-gray-400">
              Be the first to share your experience with this activity!
            </p>
            {userId && userBookingInfo && (
              <Button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
              >
                <LogIn className="mr-2 size-4" />
                Write First Review
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Overall Rating Summary */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Rating Overview */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">
                      {rating.toFixed(1)}
                    </div>
                    {renderStars(Math.round(rating), "lg")}
                    <p className="mt-1 text-sm text-gray-400">
                      {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {reviewStats && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✓</span>
                        <span>
                          {reviewStats.verifiedPercentage}% verified reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✓</span>
                        <span>
                          {reviewStats.ratingDistribution
                            .filter(item => item.rating >= 4)
                            .reduce((sum, item) => sum + item.percentage, 0)}
                          % rated 4 stars or higher
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Rating Distribution */}
              {reviewStats && (
                <div className="space-y-3">
                  {reviewStats.ratingDistribution.map(item => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <div className="flex w-12 items-center gap-1 text-sm text-gray-300">
                        <span>{item.rating}</span>
                        <Star className="size-3 fill-current text-yellow-500" />
                      </div>
                      <div className="h-2 flex-1 rounded-full bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm text-gray-400">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
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
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-700 bg-gray-800 p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-gray-600 text-white">
                          {review.customerName
                            ? `${review.customerName[0]}${review.customerAvatar?.[0] || ""}`
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">
                            {review.customerName
                              ? `${review.customerName} ${review.customerAvatar || ""}`.trim()
                              : "Anonymous User"}
                          </h4>
                          {review.isVerified && (
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
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {review.title && (
                      <h5 className="font-medium text-white">{review.title}</h5>
                    )}
                    {review.content && (
                      <p className="leading-relaxed text-gray-300">
                        {review.content}
                      </p>
                    )}

                    {(review.pros || review.cons) && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {review.pros && (
                          <div className="rounded-lg border border-green-700 bg-green-900/20 p-3">
                            <h6 className="mb-1 font-medium text-green-400">
                              What they loved:
                            </h6>
                            <p className="text-sm text-gray-300">
                              {review.pros}
                            </p>
                          </div>
                        )}
                        {review.cons && (
                          <div className="rounded-lg border border-amber-700 bg-amber-900/20 p-3">
                            <h6 className="mb-1 font-medium text-amber-400">
                              Could be improved:
                            </h6>
                            <p className="text-sm text-gray-300">
                              {review.cons}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {review.wouldRecommend !== null && (
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            review.wouldRecommend
                              ? "text-green-400"
                              : "text-red-400"
                          )}
                        >
                          {review.wouldRecommend
                            ? "✓ Recommends this activity"
                            : "✗ Doesn't recommend this activity"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ThumbsUp className="mr-2 size-4" />
                      Helpful ({review.helpfulVotes || 0})
                    </Button>

                    {review.operatorResponse && (
                      <div className="ml-4 flex-1">
                        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-3">
                          <h6 className="mb-1 font-medium text-blue-400">
                            Operator Response:
                          </h6>
                          <p className="text-sm text-gray-300">
                            {review.operatorResponse}
                          </p>
                          {review.operatorResponseDate && (
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(
                                review.operatorResponseDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!showAllReviews && reviews.length >= 6 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(true)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Show All Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        activityId={activityId}
        activityTitle={activityTitle || "Activity"}
        bookingId={userBookingInfo?.eligibleBookingId}
        userId={userId || undefined}
        onReviewSubmitted={loadReviews}
      />
    </div>
  )
}
