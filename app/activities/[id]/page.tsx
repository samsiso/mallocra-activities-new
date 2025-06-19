"use server"

// Force dynamic rendering to avoid build-time Supabase dependency
// Note: These exports are moved to avoid server directive conflicts

/*
<ai_context>
Activity Detail Page - Enhanced with improved visual design and authentication
Displays comprehensive activity information with booking functionality and reviews.
Now connected to Clerk auth for personalized experience and review capabilities.
Updated to use consistent header from layout instead of custom header.
</ai_context>
*/

import { Suspense } from "react"
import { notFound } from "next/navigation"
import ActivityImageGallery from "./_components/activity-image-gallery"
import ActivityDescription from "./_components/activity-description"
import BookingWidget from "./_components/booking-widget"
import EnhancedReviewsSection from "./_components/reviews-section-enhanced"
import SimilarActivities from "./_components/similar-activities"
import ActivityLocationMap from "./_components/activity-location-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Heart,
  Share2,
  Sparkles,
  Camera,
  Play,
  Navigation,
  Award,
  Shield,
  Globe,
  Menu,
  CalendarDays,
  Info
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { auth } from "@clerk/nextjs/server"
import { getActivityByIdOrSlugAction } from "@/actions/db/activities-actions"
import { getUserActivityBookingsAction } from "@/actions/db/reviews-actions"
import { getCurrentUserProfileAction } from "@/actions/db/users-actions"
import { WeatherDisplay } from "@/components/weather/weather-display"
import { CurrencySelector } from "@/components/ui/currency-selector"

// Import Footer
import Footer from "@/components/footer"

// Activity detail page props
interface ActivityDetailPageProps {
  params: Promise<{ id: string }>
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

async function ActivityDetailContent({
  activityId,
  userId,
  userProfile,
  userBookingInfo
}: {
  activityId: string
  userId: string | null
  userProfile: any
  userBookingInfo: any
}) {
  // Fetch activity from database using robust lookup (handles both slug and ID)
  const activityResult = await getActivityByIdOrSlugAction(activityId)

  if (!activityResult.isSuccess || !activityResult.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-white">
          <h1 className="mb-4 text-3xl font-bold">Activity Not Found</h1>
          <p className="mb-6 text-white/70">
            The activity you're looking for doesn't exist or is no longer
            available.
          </p>
          <Link href="/activities">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-300 hover:to-amber-400">
              <ArrowLeft className="mr-2 size-4" />
              Back to Activities
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const activity = activityResult.data

  const formatPrice = (price: any) => {
    if (typeof price === "string") {
      return `€${parseFloat(price).toFixed(0)}`
    }
    return `€${price?.toFixed(0) || "0"}`
  }

  const formatDuration = (duration: any) => {
    if (typeof duration === "number") {
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h`
      } else {
        return `${minutes}m`
      }
    }
    return duration || "N/A"
  }

  const getFeatureIcon = (feature: any) => {
    const featureName =
      typeof feature === "string"
        ? feature.toLowerCase()
        : feature?.name?.toLowerCase() || ""

    if (featureName.includes("transport") || featureName.includes("pickup")) {
      return "🚗"
    } else if (
      featureName.includes("guide") ||
      featureName.includes("instructor")
    ) {
      return "👥"
    } else if (
      featureName.includes("equipment") ||
      featureName.includes("gear")
    ) {
      return "⚙️"
    } else if (
      featureName.includes("meal") ||
      featureName.includes("food") ||
      featureName.includes("lunch")
    ) {
      return "🍽️"
    } else if (
      featureName.includes("photo") ||
      featureName.includes("picture")
    ) {
      return "📸"
    }
    return "✨"
  }

  return (
    <div className="pb-20">
      {/* Enhanced Navigation Bar */}
      <nav className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl p-4">
          <div className="flex items-center justify-between">
            <Link
              href="/activities"
              className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back to Activities
            </Link>

            <div className="flex items-center gap-3">
              <CurrencySelector />

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Share2 className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Heart className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 size-96 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Activity Details */}
            <div className="lg:col-span-2">
              {/* Activity Title & Quick Info */}
              <div className="mb-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {activity.category && (
                    <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 font-bold text-white">
                      {activity.category}
                    </Badge>
                  )}

                  {activity.difficulty && (
                    <Badge
                      variant="outline"
                      className="border-white/30 bg-white/10 font-medium text-white"
                    >
                      {activity.difficulty} Difficulty
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="size-4 fill-current" />
                    <span className="font-medium">
                      {activity.averageRating || "4.8"}
                    </span>
                    <span className="text-white/60">
                      ({activity.totalReviews || "234"} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="mb-4 text-4xl font-bold leading-tight text-white lg:text-5xl">
                  {activity.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  {activity.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-5 text-rose-400" />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="size-5 text-amber-400" />
                    <span>{formatDuration(activity.duration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-blue-400" />
                    <span>Max {activity.maxParticipants || "N/A"} people</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <ActivityImageGallery activity={activity} />

              {/* Activity Description */}
              <ActivityDescription activity={activity} />
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget
                  activity={{
                    id: activity.id,
                    title: activity.title,
                    priceAdult: activity.priceAdult,
                    priceChild: activity.priceChild,
                    maxParticipants: activity.maxParticipants,
                    duration: activity.duration,
                    category: activity.category
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Reviews Section with Authentication */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <EnhancedReviewsSection
            activityId={activity.id}
            userId={userId}
            userProfile={userProfile}
            userBookingInfo={userBookingInfo}
            activityTitle={activity.title}
          />
        </div>
      </section>

      {/* Location Map */}
      {activity.latitude && activity.longitude && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <ActivityLocationMap
              latitude={activity.latitude}
              longitude={activity.longitude}
              title={activity.title}
              address={activity.location}
            />
          </div>
        </section>
      )}

      {/* Similar Activities */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SimilarActivities
            currentActivityId={activity.id}
            category={activity.category}
          />
        </div>
      </section>
    </div>
  )
}

export default async function ActivityDetailPage({
  params
}: ActivityDetailPageProps) {
  const { id } = await params

  // Get authenticated user
  const { userId: clerkUserId } = await auth()
  let userProfile = null
  let userBookingInfo = null

  // Fetch user profile and booking info if authenticated
  if (clerkUserId) {
    try {
      const profileResult = await getCurrentUserProfileAction()
      if (profileResult.isSuccess && profileResult.data) {
        userProfile = profileResult.data

        // Check if user has booked this activity and can review
        const bookingCheckResult = await getUserActivityBookingsAction(
          clerkUserId,
          id
        )
        if (bookingCheckResult.isSuccess) {
          userBookingInfo = bookingCheckResult.data
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      <Suspense fallback={<ActivityDetailSkeleton />}>
        <ActivityDetailContent
          activityId={id}
          userId={clerkUserId}
          userProfile={userProfile}
          userBookingInfo={userBookingInfo}
        />
      </Suspense>
    </div>
  )
}

// Loading skeleton component
function ActivityDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-8 animate-pulse rounded bg-white/20" />
            <div className="h-64 animate-pulse rounded bg-white/20" />
            <div className="space-y-4">
              <div className="h-4 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/20" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 animate-pulse rounded bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
