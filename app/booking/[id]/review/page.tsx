"use client"

/*
<ai_context>
Booking Review Page - Allows users to rate and review completed activities
Features star ratings, photo uploads, detailed feedback forms, and social sharing.
Dark glassmorphism theme with rich media support.
</ai_context>
*/

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  Camera,
  Send,
  ArrowLeft,
  Upload,
  X,
  Heart,
  ThumbsUp,
  Share2,
  Award,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getBookingByIdAction } from "@/actions/db/bookings-actions"

// Glassmorphism card component
function GlassCard({
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

// Star rating component
function StarRating({
  rating,
  setRating,
  readonly = false,
  size = "size-6"
}: {
  rating: number
  setRating?: (rating: number) => void
  readonly?: boolean
  size?: string
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-all",
            !readonly && "hover:scale-110",
            readonly && "cursor-default"
          )}
          onClick={() => !readonly && setRating && setRating(star)}
        >
          <Star
            className={cn(
              size,
              "transition-colors",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/30 hover:text-white/60"
            )}
          />
        </button>
      ))}
    </div>
  )
}

// Photo upload component
function PhotoUpload({
  photos,
  setPhotos
}: {
  photos: File[]
  setPhotos: (photos: File[]) => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos([...photos, ...files.slice(0, 5 - photos.length)])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Label className="text-white">Share Your Experience (Optional)</Label>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="group relative">
              <Image
                src={URL.createObjectURL(photo)}
                alt={`Photo ${index + 1}`}
                width={150}
                height={150}
                className="h-24 w-full rounded-lg object-cover sm:h-32"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 size-6 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                onClick={() => removePhoto(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {photos.length < 5 && (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            id="photo-upload"
          />
          <Label
            htmlFor="photo-upload"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/30 bg-white/5 p-6 transition-colors hover:bg-white/10"
          >
            <Camera className="size-5 text-yellow-400" />
            <span className="text-white">Add Photos ({photos.length}/5)</span>
          </Label>
        </div>
      )}
    </div>
  )
}

export default function BookingReviewPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Review form state
  const [overallRating, setOverallRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [funRating, setFunRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [nickname, setNickname] = useState("")
  const [recommendToFriends, setRecommendToFriends] = useState<boolean | null>(
    null
  )

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingByIdAction(bookingId)
        if (result.isSuccess && result.data) {
          setBooking(result.data)
          setNickname(result.data.customerName?.split(" ")[0] || "")
        } else {
          // Fallback to mock data
          setBooking({
            id: bookingId,
            bookingReference: bookingId.slice(0, 8).toUpperCase(),
            status: "completed",
            activityTitle: "Scenic Mallorca Helicopter Tour",
            activityLocation: "Palma de Mallorca Airport",
            activityImage:
              "https://images.unsplash.com/photo-1544717304-a2db4a3d16c6?w=800&h=600&fit=crop",
            bookingDate: "2025-01-20",
            bookingTime: "10:30",
            customerName: "John Doe",
            totalAmount: 358
          })
          setNickname("John")
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleSubmitReview = async () => {
    if (overallRating === 0) {
      alert("Please provide an overall rating")
      return
    }

    setSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, would submit review data
    alert(`Review submitted successfully!
    
Thank you for your feedback:
- Overall Rating: ${overallRating}/5 stars
- Would Recommend: ${recommendToFriends ? "Yes" : "No"}
- Photos: ${photos.length} uploaded
    
Your review helps other travelers make great choices!`)

    setSubmitting(false)
    router.push(`/booking/${bookingId}`)
  }

  const canSubmitReview = overallRating > 0 && reviewText.length >= 10

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-yellow-400"></div>
          <p>Loading booking...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <GlassCard className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Booking Not Found
          </h1>
          <Link href="/bookings">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              Back to Bookings
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  if (booking.status !== "completed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <GlassCard className="max-w-md text-center">
          <Award className="mx-auto mb-4 size-12 text-yellow-400" />
          <h1 className="mb-2 text-2xl font-bold text-white">
            Review Not Available
          </h1>
          <p className="mb-6 text-white/70">
            You can only review activities after they are completed.
          </p>
          <Link href={`/booking/${bookingId}`}>
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
              Back to Booking
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/booking/${bookingId}`}>
            <Button
              variant="outline"
              className="mb-4 border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Booking Details
            </Button>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white lg:text-4xl">
              Share Your Experience
            </h1>
            <p className="text-white/70">
              {booking.activityTitle} - {booking.bookingDate}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Review Form */}
          <div className="space-y-8 lg:col-span-2">
            {/* Activity Summary */}
            <GlassCard>
              <div className="flex gap-4">
                <div className="relative size-24 overflow-hidden rounded-lg">
                  <Image
                    src={booking.activityImage}
                    alt={booking.activityTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {booking.activityTitle}
                  </h3>
                  <p className="text-sm text-white/70">
                    {booking.activityLocation} • {booking.bookingDate} at{" "}
                    {booking.bookingTime}
                  </p>
                  <Badge className="mt-2 border-green-500/30 bg-green-500/20 text-green-400">
                    <CheckCircle className="mr-1 size-3" />
                    Completed
                  </Badge>
                </div>
              </div>
            </GlassCard>

            {/* Overall Rating */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Overall Rating
              </h3>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={overallRating}
                  setRating={setOverallRating}
                  size="size-8"
                />
                <span className="text-white/70">
                  {overallRating === 0
                    ? "Tap to rate"
                    : overallRating === 1
                      ? "Poor"
                      : overallRating === 2
                        ? "Fair"
                        : overallRating === 3
                          ? "Good"
                          : overallRating === 4
                            ? "Very Good"
                            : "Excellent"}
                </span>
              </div>
            </GlassCard>

            {/* Detailed Ratings */}
            <GlassCard>
              <h3 className="mb-6 text-xl font-bold text-white">
                Rate Different Aspects
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Value for Money</p>
                    <p className="text-sm text-white/60">
                      Was it worth the price?
                    </p>
                  </div>
                  <StarRating rating={valueRating} setRating={setValueRating} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Service Quality</p>
                    <p className="text-sm text-white/60">
                      Staff and organization
                    </p>
                  </div>
                  <StarRating
                    rating={serviceRating}
                    setRating={setServiceRating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Fun Factor</p>
                    <p className="text-sm text-white/60">
                      How enjoyable was it?
                    </p>
                  </div>
                  <StarRating rating={funRating} setRating={setFunRating} />
                </div>
              </div>
            </GlassCard>

            {/* Written Review */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Tell Us More
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="review-title" className="text-white">
                    Review Title
                  </Label>
                  <Input
                    id="review-title"
                    placeholder="Sum up your experience in a few words"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    className="mt-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-yellow-400"
                  />
                </div>

                <div>
                  <Label htmlFor="review-text" className="text-white">
                    Your Review
                  </Label>
                  <Textarea
                    id="review-text"
                    placeholder="Share details about your experience. What did you like? What could be improved? (Minimum 10 characters)"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    className="mt-2 min-h-32 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-yellow-400"
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-white/60">
                    {reviewText.length}/500 characters
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Photo Upload */}
            <GlassCard>
              <PhotoUpload photos={photos} setPhotos={setPhotos} />
            </GlassCard>

            {/* Recommendation */}
            <GlassCard>
              <h3 className="mb-4 text-xl font-bold text-white">
                Would you recommend this to friends?
              </h3>

              <div className="flex gap-4">
                <Button
                  variant={recommendToFriends === true ? "default" : "outline"}
                  onClick={() => setRecommendToFriends(true)}
                  className={cn(
                    "flex-1",
                    recommendToFriends === true
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <ThumbsUp className="mr-2 size-4" />
                  Yes, absolutely!
                </Button>

                <Button
                  variant={recommendToFriends === false ? "default" : "outline"}
                  onClick={() => setRecommendToFriends(false)}
                  className={cn(
                    "flex-1",
                    recommendToFriends === false
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  Not really
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Review Summary */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">
                Review Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Overall Rating</span>
                  <div className="flex gap-1">
                    <StarRating rating={overallRating} readonly size="size-4" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">Review Length</span>
                  <span
                    className={cn(
                      "text-white",
                      reviewText.length >= 10
                        ? "text-green-400"
                        : "text-red-400"
                    )}
                  >
                    {reviewText.length >= 10 ? "✓ Good" : "Too short"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">Photos</span>
                  <span className="text-white">{photos.length} uploaded</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/70">Recommendation</span>
                  <span className="text-white">
                    {recommendToFriends === null
                      ? "Not set"
                      : recommendToFriends
                        ? "Yes"
                        : "No"}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Reviewer Info */}
            <GlassCard>
              <h3 className="mb-4 text-lg font-bold text-white">
                How you'll appear
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nickname" className="text-white">
                    Display Name
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="mt-2 border-white/30 bg-white/10 text-white focus:border-yellow-400"
                  />
                </div>

                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                  <p className="text-sm text-blue-400">
                    Your review will be verified as a real booking to help other
                    travelers.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Submit Button */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmitReview}
                disabled={!canSubmitReview || submitting}
                className={cn(
                  "w-full font-bold",
                  canSubmitReview
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600"
                    : "cursor-not-allowed bg-gray-600 text-gray-400"
                )}
              >
                {submitting ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    {canSubmitReview
                      ? "Submit Review"
                      : "Complete Required Fields"}
                  </>
                )}
              </Button>

              {!canSubmitReview && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                  <p className="text-sm text-yellow-400">
                    Please provide an overall rating and write at least 10
                    characters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
