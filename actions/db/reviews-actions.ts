"use server"

import { supabaseServerClient } from "@/lib/supabase-server"
import { ActionState } from "@/types"

// Use the dedicated server-only client
const supabase = supabaseServerClient

// Types for reviews - keeping the existing camelCase interface for compatibility
export interface SelectReview {
  id: string
  bookingId: string | null
  customerId: string
  activityId: string
  rating: number
  title: string
  content: string
  pros: string | null
  cons: string | null
  wouldRecommend: boolean
  isVerified: boolean
  isPublished: boolean
  helpfulVotes: number
  operatorResponse: string | null
  operatorResponseDate: Date | null
  photoUrls: string[] | null
  reviewerName: string
  reviewerEmail: string
  createdAt: Date
  updatedAt: Date
}

export interface InsertReview {
  bookingId?: string | null
  customerId: string
  activityId: string
  rating: number
  title: string
  content: string
  pros?: string | null
  cons?: string | null
  wouldRecommend: boolean
  isVerified?: boolean
  isPublished?: boolean
  helpfulVotes?: number
  operatorResponse?: string | null
  operatorResponseDate?: Date | null
  photoUrls?: string[] | null
  reviewerName: string
  reviewerEmail: string
}

// Get all reviews for an activity
export async function getActivityReviewsAction(
  activityId: string,
  sortBy: "newest" | "oldest" | "highest" | "lowest" | "helpful" = "newest",
  limit: number = 10,
  offset: number = 0
): Promise<ActionState<{ reviews: SelectReview[], totalCount: number }>> {
  try {
    // Build order clause based on sortBy
    let orderColumn = "created_at"
    let ascending = false
    
    switch (sortBy) {
      case "oldest":
        orderColumn = "created_at"
        ascending = true
        break
      case "highest":
        orderColumn = "rating"
        ascending = false
        break
      case "lowest":
        orderColumn = "rating"
        ascending = true
        break
      case "helpful":
        orderColumn = "helpful_votes"
        ascending = false
        break
      default:
        orderColumn = "created_at"
        ascending = false
    }

    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('activity_id', activityId)
      .eq('is_published', true)
      .order(orderColumn, { ascending })
      .range(offset, offset + limit - 1)

    if (reviewsError) {
      throw reviewsError
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('activity_id', activityId)
      .eq('is_published', true)

    if (countError) {
      throw countError
    }

    // Transform the data to match our interface
    const transformedReviews: SelectReview[] = (reviews || []).map(review => ({
      id: review.id,
      bookingId: review.booking_id,
      customerId: review.customer_id,
      activityId: review.activity_id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros,
      cons: review.cons,
      wouldRecommend: review.would_recommend,
      isVerified: review.is_verified,
      isPublished: review.is_published,
      helpfulVotes: review.helpful_votes,
      operatorResponse: review.operator_response,
      operatorResponseDate: review.operator_response_date ? new Date(review.operator_response_date) : null,
      photoUrls: review.photo_urls,
      reviewerName: review.reviewer_name,
      reviewerEmail: review.reviewer_email,
      createdAt: new Date(review.created_at),
      updatedAt: new Date(review.updated_at)
    }))

    return {
      isSuccess: true,
      message: "Reviews retrieved successfully",
      data: { reviews: transformedReviews, totalCount: count || 0 }
    }
  } catch (error) {
    console.error("Error getting activity reviews:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get reviews" 
    }
  }
}

// Get review statistics for an activity
export async function getActivityReviewStatsAction(
  activityId: string
): Promise<ActionState<{
  avgRating: number
  totalReviews: number
  ratingDistribution: { stars: number; count: number; percentage: number }[]
  recommendationPercentage: number
}>> {
  try {
    // Get all ratings and recommendations for the activity
    const { data: reviewStats, error } = await supabase
      .from('reviews')
      .select('rating, would_recommend')
      .eq('activity_id', activityId)
      .eq('is_published', true)

    if (error) {
      throw error
    }

    const totalReviews = reviewStats?.length || 0
    
    if (totalReviews === 0) {
      return {
        isSuccess: true,
        message: "No reviews found",
        data: {
          avgRating: 0,
          totalReviews: 0,
          ratingDistribution: [],
          recommendationPercentage: 0
        }
      }
    }

    // Calculate average rating
    const avgRating = reviewStats!.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    // Calculate rating distribution
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviewStats!.forEach(review => {
      ratingCounts[review.rating as keyof typeof ratingCounts]++
    })

    const ratingDistribution = Object.entries(ratingCounts).map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: Math.round((count / totalReviews) * 100)
    })).reverse() // Show 5 stars first

    // Calculate recommendation percentage
    const recommendCount = reviewStats!.filter(review => review.would_recommend).length
    const recommendationPercentage = Math.round((recommendCount / totalReviews) * 100)

    return {
      isSuccess: true,
      message: "Review statistics retrieved successfully",
      data: {
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        ratingDistribution,
        recommendationPercentage
      }
    }
  } catch (error) {
    console.error("Error getting review statistics:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get review statistics" 
    }
  }
}

// Create a new review
export async function createReviewAction(
  reviewData: InsertReview
): Promise<ActionState<SelectReview>> {
  try {
    // Transform camelCase to snake_case for database
    const dbReviewData = {
      booking_id: reviewData.bookingId,
      customer_id: reviewData.customerId,
      activity_id: reviewData.activityId,
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content,
      pros: reviewData.pros,
      cons: reviewData.cons,
      would_recommend: reviewData.wouldRecommend,
      is_verified: reviewData.isVerified ?? true,
      is_published: reviewData.isPublished ?? true,
      helpful_votes: reviewData.helpfulVotes ?? 0,
      operator_response: reviewData.operatorResponse,
      operator_response_date: reviewData.operatorResponseDate,
      photo_urls: reviewData.photoUrls,
      reviewer_name: reviewData.reviewerName,
      reviewer_email: reviewData.reviewerEmail
    }

    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert(dbReviewData)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Transform back to camelCase for return
    const transformedReview: SelectReview = {
      id: newReview.id,
      bookingId: newReview.booking_id,
      customerId: newReview.customer_id,
      activityId: newReview.activity_id,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      pros: newReview.pros,
      cons: newReview.cons,
      wouldRecommend: newReview.would_recommend,
      isVerified: newReview.is_verified,
      isPublished: newReview.is_published,
      helpfulVotes: newReview.helpful_votes,
      operatorResponse: newReview.operator_response,
      operatorResponseDate: newReview.operator_response_date ? new Date(newReview.operator_response_date) : null,
      photoUrls: newReview.photo_urls,
      reviewerName: newReview.reviewer_name,
      reviewerEmail: newReview.reviewer_email,
      createdAt: new Date(newReview.created_at),
      updatedAt: new Date(newReview.updated_at)
    }

    // 🔔 SEND ADMIN NOTIFICATION FOR BAD REVIEWS (1-2 stars)
    if (reviewData.rating <= 2) {
      try {
        // Import the notification function
        const { sendTelegramBadReviewAlertAction } = await import("@/actions/notifications/telegram-notifications")
        
        const notificationResult = await sendTelegramBadReviewAlertAction({
          customerName: reviewData.reviewerName || "Anonymous",
          activityTitle: `Activity ${reviewData.activityId}`,
          rating: reviewData.rating,
          comment: reviewData.content,
          bookingReference: reviewData.bookingId || "Unknown",
          reviewDate: new Date().toLocaleDateString()
        })

        if (notificationResult.isSuccess) {
          console.log("🚨 Bad review notification sent to admin")
        } else {
          console.warn("⚠️ Failed to send bad review notification:", notificationResult.message)
        }
      } catch (notificationError) {
        console.warn("Bad review notification error:", notificationError)
        // Don't fail the review creation if notification fails
      }
    }

    // Update activity rating stats
    await updateActivityRatingStatsAction(reviewData.activityId)

    return {
      isSuccess: true,
      message: "Review created successfully",
      data: transformedReview
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return { 
      isSuccess: false, 
      message: "Failed to create review" 
    }
  }
}

// Update helpful votes for a review
export async function updateReviewHelpfulVotesAction(
  reviewId: string,
  increment: boolean = true
): Promise<ActionState<{ helpfulVotes: number }>> {
  try {
    // Get current helpful votes
    const { data: currentReview, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful_votes')
      .eq('id', reviewId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    const newVotes = increment 
      ? (currentReview.helpful_votes || 0) + 1 
      : Math.max(0, (currentReview.helpful_votes || 0) - 1)

    // Update the helpful votes
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({ helpful_votes: newVotes })
      .eq('id', reviewId)
      .select('helpful_votes')
      .single()

    if (updateError) {
      throw updateError
    }

    return {
      isSuccess: true,
      message: "Helpful votes updated successfully",
      data: { helpfulVotes: updatedReview.helpful_votes }
    }
  } catch (error) {
    console.error("Error updating helpful votes:", error)
    return { 
      isSuccess: false, 
      message: "Failed to update helpful votes" 
    }
  }
}

// Get user's review for a specific activity
export async function getUserActivityReviewAction(
  userId: string,
  activityId: string
): Promise<ActionState<SelectReview | null>> {
  try {
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('customer_id', userId)
      .eq('activity_id', activityId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }

    if (!review) {
      return {
        isSuccess: true,
        message: "No review found",
        data: null
      }
    }

    // Transform the data
    const transformedReview: SelectReview = {
      id: review.id,
      bookingId: review.booking_id,
      customerId: review.customer_id,
      activityId: review.activity_id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros,
      cons: review.cons,
      wouldRecommend: review.would_recommend,
      isVerified: review.is_verified,
      isPublished: review.is_published,
      helpfulVotes: review.helpful_votes,
      operatorResponse: review.operator_response,
      operatorResponseDate: review.operator_response_date ? new Date(review.operator_response_date) : null,
      photoUrls: review.photo_urls,
      reviewerName: review.reviewer_name,
      reviewerEmail: review.reviewer_email,
      createdAt: new Date(review.created_at),
      updatedAt: new Date(review.updated_at)
    }

    return {
      isSuccess: true,
      message: "Review retrieved successfully",
      data: transformedReview
    }
  } catch (error) {
    console.error("Error getting user review:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get user review" 
    }
  }
}

// Get user's bookings for a specific activity to check if they can leave a review
export async function getUserActivityBookingsAction(
  userId: string,
  activityId: string
): Promise<ActionState<{ canReview: boolean; bookings: any[]; eligibleBookingId?: string }>> {
  try {
    // Get user profile first to get the correct internal user ID
    const { data: userProfileResult, error: profileError } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfileResult) {
      return {
        isSuccess: false,
        message: "User profile not found"
      }
    }

    // Get all bookings for this user and activity
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', userProfileResult.id)
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false })

    if (bookingsError) {
      throw bookingsError
    }

    // Check if user has any completed or confirmed bookings
    const eligibleBookings = (bookings || []).filter((booking: any) => 
      booking.status === "completed" || booking.status === "confirmed"
    )

    // Check if user has already reviewed this activity
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('customer_id', userProfileResult.id)
      .eq('activity_id', activityId)
      .single()

    const hasExistingReview = existingReview && !reviewError
    const canReview = eligibleBookings.length > 0 && !hasExistingReview
    const eligibleBookingId = eligibleBookings.length > 0 ? eligibleBookings[0].id : undefined

    return {
      isSuccess: true,
      message: canReview 
        ? "User can leave a review" 
        : hasExistingReview 
          ? "User has already reviewed this activity"
          : "User has no eligible bookings for this activity",
      data: {
        canReview,
        bookings: eligibleBookings,
        eligibleBookingId
      }
    }
  } catch (error) {
    console.error("Error checking user activity bookings:", error)
    return { 
      isSuccess: false, 
      message: "Failed to check user bookings" 
    }
  }
}

// Helper function to update activity rating statistics
async function updateActivityRatingStatsAction(activityId: string) {
  try {
    // Get all published reviews for this activity
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('activity_id', activityId)
      .eq('is_published', true)

    if (error) {
      throw error
    }

    if (!reviews || reviews.length === 0) {
      return
    }

    // Calculate new average rating
    const avgRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    const totalReviews = reviews.length

    // Update activity table
    const { error: updateError } = await supabase
      .from('activities')
      .update({
        avg_rating: avgRating.toString(),
        total_reviews: totalReviews
      })
      .eq('id', activityId)

    if (updateError) {
      throw updateError
    }

  } catch (error) {
    console.error("Error updating activity rating stats:", error)
  }
} 