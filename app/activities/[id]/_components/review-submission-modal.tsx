"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Star,
  X,
  ThumbsUp,
  ThumbsDown,
  Camera,
  CheckCircle,
  User,
  LogIn,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createReviewAction } from "@/actions/db/reviews-actions"

interface ReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  activityId: string
  activityTitle: string
  bookingId?: string
  userId?: string
  onReviewSubmitted?: () => void
}

export default function ReviewSubmissionModal({
  isOpen,
  onClose,
  activityId,
  activityTitle,
  bookingId,
  userId,
  onReviewSubmitted
}: ReviewSubmissionModalProps) {
  const [step, setStep] = useState<"rating" | "details" | "photos" | "submit">(
    "rating"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Review data state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [pros, setPros] = useState("")
  const [cons, setCons] = useState("")
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])

  // Validation state
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState({})

  // Check authentication and booking eligibility
  useEffect(() => {
    if (!userId) {
      setCurrentStep(1) // Force login step
      setValidationErrors({ auth: "Please log in to submit a review" })
    } else if (!bookingId) {
      setValidationErrors({
        booking: "You must have completed this activity to leave a review"
      })
    } else {
      // User is authenticated and has booking, allow review
      setValidationErrors({})
    }
  }, [userId, bookingId])

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {}

    if (currentStep === 1 && !userId) {
      errors.auth = "Please log in to continue"
      setValidationErrors(errors)
      return false
    }

    if (currentStep === 1 && !bookingId) {
      errors.booking =
        "You must have booked and completed this activity to leave a review"
      setValidationErrors(errors)
      return false
    }

    if (currentStep === 2) {
      if (rating === 0) {
        errors.rating = "Please select a rating"
      }
    }

    if (currentStep === 3) {
      if (!comment.trim()) {
        errors.reviewText = "Please write your review"
      }
      if (!title.trim()) {
        errors.reviewTitle = "Please add a title for your review"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setStep("rating")
    setRating(0)
    setHoverRating(0)
    setTitle("")
    setComment("")
    setPros("")
    setCons("")
    setWouldRecommend(null)
    setPhotos([])
    setPhotoUrls([])
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    if (!bookingId || !userId) {
      alert("You must be logged in and have a booking to leave a review")
      return
    }

    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      alert("Please write at least 10 characters in your review")
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        bookingId,
        customerId: userId,
        activityId,
        rating,
        title: title.trim() || null,
        content: comment.trim(),
        reviewerName: "Anonymous User",
        reviewerEmail: "user@example.com",
        pros: pros.trim() || null,
        cons: cons.trim() || null,
        wouldRecommend: wouldRecommend ?? true,
        photoUrls: [],
        isVerified: true,
        isPublished: true,
        helpfulVotes: 0
      }

      const result = await createReviewAction(reviewData)

      if (result.isSuccess) {
        alert("Review submitted successfully!")
        onReviewSubmitted?.()
        handleClose()
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "rating":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-white">
                How would you rate this experience?
              </h3>
              <p className="mb-6 text-gray-400">
                Tap the stars to rate {activityTitle}
              </p>

              <div className="mb-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "size-10",
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-500"
                      )}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="text-center">
                  <p className="font-medium text-yellow-400">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep("details")}
                disabled={rating === 0}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case "details":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">
                Review Title (Optional)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Summarize your experience..."
                className="mt-2 border-gray-600 bg-gray-800 text-white"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="comment" className="text-white">
                Tell us about your experience *
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share details about your experience, what you enjoyed, and any suggestions for future travelers..."
                className="mt-2 min-h-[120px] border-gray-600 bg-gray-800 text-white"
                maxLength={1000}
              />
              <div className="mt-1 text-right text-sm text-gray-400">
                {comment.length}/1000 characters
              </div>
            </div>

            <div>
              <Label className="mb-3 block text-white">
                Would you recommend this to a friend?
              </Label>
              <div className="flex gap-4">
                <Button
                  variant={wouldRecommend === true ? "default" : "outline"}
                  onClick={() => setWouldRecommend(true)}
                  className={cn(
                    "flex-1",
                    wouldRecommend === true
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  <ThumbsUp className="mr-2 size-4" />
                  Yes, definitely!
                </Button>
                <Button
                  variant={wouldRecommend === false ? "default" : "outline"}
                  onClick={() => setWouldRecommend(false)}
                  className={cn(
                    "flex-1",
                    wouldRecommend === false
                      ? "bg-red-600 hover:bg-red-700"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  <ThumbsDown className="mr-2 size-4" />
                  Not really
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("rating")}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={comment.trim().length < 10 || isSubmitting}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {!userId
              ? "Sign In Required"
              : !bookingId
                ? "Booking Required"
                : `Share Your Experience`}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {!userId
              ? "Please sign in to leave a review for this activity"
              : !bookingId
                ? "You must have booked and completed this activity to leave a review"
                : `Help others discover ${activityTitle}`}
          </DialogDescription>
        </DialogHeader>

        {/* Authentication Check */}
        {!userId && (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/20">
                <User className="size-8 text-red-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Sign In Required
              </h3>
              <p className="mb-6 text-gray-300">
                Please sign in to your account to share your experience with
                this activity.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => (window.location.href = "/login")}
                >
                  <LogIn className="mr-2 size-4" />
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Verification Check */}
        {userId && !bookingId && (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-orange-500/20">
                <Calendar className="size-8 text-orange-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Booking Required
              </h3>
              <p className="mb-6 text-gray-300">
                You must have booked and completed this activity to leave a
                review. This helps ensure authentic feedback.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => (window.location.href = `/book/${activityId}`)}
                >
                  <Calendar className="mr-2 size-4" />
                  Book This Activity
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Review Form - Only show if authenticated and has booking */}
        {userId && bookingId && renderStepContent()}

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {["rating", "details"].map((stepName, index) => (
            <div
              key={stepName}
              className={cn(
                "size-2 rounded-full transition-colors",
                stepName === step
                  ? "bg-rose-500"
                  : ["rating", "details"].indexOf(step) > index
                    ? "bg-rose-300"
                    : "bg-gray-600"
              )}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
