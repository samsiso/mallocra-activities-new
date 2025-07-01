"use client"

/*
<ai_context>
Enhanced Activities Across Mallorca section with premium dark theme design.
Features glassmorphism effects, dynamic database integration, and modern animations.
Replaces the basic light-themed section with sophisticated dark premium styling.
</ai_context>
*/

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { debugLog } from "@/lib/debug"
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shield,
  Heart,
  Activity,
  Star,
  Clock,
  Users,
  ArrowRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getActivitiesSupabaseAction,
  ActivityWithDetails
} from "@/actions/db/activities-actions"
import dynamic from "next/dynamic"
import { MapLocationSkeleton } from "./map-location-skeleton"

// Dynamic import to avoid SSR issues with Leaflet
const EnhancedLeafletMap = dynamic(
  () => import("./enhanced-leaflet-map").then(mod => mod.EnhancedLeafletMap),
  {
    ssr: false,
    loading: () => <MapLocationSkeleton />
  }
)

interface EnhancedActivitiesMapSectionProps {
  className?: string
}

// Location categories for featured highlights
const locationCategories = [
  {
    id: "water_sports",
    title: "Water Sports Activities",
    emoji: "🌊",
    color: "blue",
    description:
      "Catamaran cruises, scuba diving, and kayaking adventures around Palma Bay and the eastern coast.",
    gradient: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400"
  },
  {
    id: "land_adventures",
    title: "Mountain Adventures",
    emoji: "🏔️",
    color: "green",
    description:
      "UNESCO World Heritage hiking trails in Serra de Tramuntana mountains with breathtaking views.",
    gradient: "from-green-500 to-emerald-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    textColor: "text-green-400"
  },
  {
    id: "cultural",
    title: "Cultural Tours",
    emoji: "🏛️",
    color: "purple",
    description:
      "Historic Palma Cathedral, charming Deia village, and traditional Mallorcan cultural experiences.",
    gradient: "from-purple-500 to-violet-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-400"
  },
  {
    id: "nightlife",
    title: "Nightlife Experiences",
    emoji: "🎉",
    color: "orange",
    description:
      "BCM Planet Dance, boat parties, and vibrant nightlife across Mallorca's party destinations.",
    gradient: "from-orange-500 to-amber-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    textColor: "text-orange-400"
  },
  {
    id: "family_fun",
    title: "Family Adventures",
    emoji: "👨‍👩‍👧‍👦",
    color: "rose",
    description:
      "Palma Aquarium, family-friendly beaches, and activities perfect for all ages.",
    gradient: "from-rose-500 to-pink-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    textColor: "text-rose-400"
  },
  {
    id: "food_wine",
    title: "Food & Wine",
    emoji: "🍷",
    color: "amber",
    description:
      "Traditional tapas tours, wine tastings, and authentic Mallorcan culinary experiences.",
    gradient: "from-amber-500 to-yellow-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-400"
  }
]

// Fallback activities data for immediate display
const fallbackActivities: ActivityWithDetails[] = [
  {
    id: "1",
    operatorId: "demo-operator",
    title: "Catamaran Cruise & Snorkeling",
    slug: "catamaran-cruise-snorkeling",
    description:
      "Explore crystal-clear waters around Mallorca with this premium catamaran experience",
    shortDescription: "Premium catamaran cruise with snorkeling",
    category: "water_sports",
    location: "Palma Bay",
    meetingPoint: "Port of Palma",
    latitude: "39.5696",
    longitude: "2.6502",
    durationMinutes: 240,
    maxParticipants: 12,
    minParticipants: 1,
    minAge: 8,
    maxAge: null,
    includedItems: ["Equipment", "Professional guide", "Refreshments"],
    excludedItems: [],
    whatToBring: ["Swimwear", "Sunscreen"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: "Basic swimming ability required",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.8",
    totalReviews: 156,
    totalBookings: 250,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    pricing: []
  },
  {
    id: "2",
    operatorId: "demo-operator",
    title: "Serra de Tramuntana Hiking",
    slug: "serra-tramuntana-hiking",
    description:
      "UNESCO World Heritage hiking through dramatic mountain landscapes",
    shortDescription: "UNESCO World Heritage mountain hiking",
    category: "land_adventures",
    location: "Valldemossa",
    meetingPoint: "Valldemossa Town Center",
    latitude: "39.7094",
    longitude: "2.6238",
    durationMinutes: 360,
    maxParticipants: 8,
    minParticipants: 2,
    minAge: 12,
    maxAge: null,
    includedItems: ["Certified guide", "Mountain equipment", "Lunch"],
    excludedItems: [],
    whatToBring: ["Hiking boots", "Water bottle"],
    cancellationPolicy: "Free cancellation up to 48 hours",
    safetyRequirements: "Good physical condition required",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.9",
    totalReviews: 89,
    totalBookings: 140,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    pricing: []
  },
  {
    id: "3",
    operatorId: "demo-operator",
    title: "Palma Cathedral & Old Town Tour",
    slug: "palma-cathedral-tour",
    description:
      "Discover the stunning Gothic cathedral and historic quarter of Palma",
    shortDescription: "Gothic cathedral and historic quarter tour",
    category: "cultural",
    location: "Palma de Mallorca",
    meetingPoint: "Cathedral Main Entrance",
    latitude: "39.5667",
    longitude: "2.6500",
    durationMinutes: 180,
    maxParticipants: 15,
    minParticipants: 1,
    minAge: null,
    maxAge: null,
    includedItems: ["Skip-the-line tickets", "Expert guide"],
    excludedItems: [],
    whatToBring: ["Comfortable shoes"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: null,
    weatherDependent: false,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.7",
    totalReviews: 203,
    totalBookings: 380,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    pricing: []
  },
  {
    id: "4",
    operatorId: "demo-operator",
    title: "Boat Party Experience",
    slug: "boat-party-experience",
    description:
      "Ultimate nightlife experience with DJ, drinks, and swimming stops",
    shortDescription: "Ultimate boat party with DJ and drinks",
    category: "nightlife",
    location: "Magaluf",
    meetingPoint: "Magaluf Marina",
    latitude: "39.5105",
    longitude: "2.5340",
    durationMinutes: 300,
    maxParticipants: 50,
    minParticipants: 5,
    minAge: 18,
    maxAge: null,
    includedItems: ["Open bar", "DJ entertainment"],
    excludedItems: [],
    whatToBring: ["Swimwear", "Party mood"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: "Must be 18+ for alcohol consumption",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.6",
    totalReviews: 124,
    totalBookings: 200,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    pricing: []
  },
  {
    id: "5",
    operatorId: "demo-operator",
    title: "Family Beach Adventure",
    slug: "family-beach-adventure",
    description: "Perfect family day with beach games, snorkeling, and picnic",
    shortDescription: "Perfect family beach day with activities",
    category: "family_fun",
    location: "Cala Mondragó",
    meetingPoint: "Cala Mondragó Beach Entrance",
    latitude: "39.3442",
    longitude: "3.1936",
    durationMinutes: 240,
    maxParticipants: 20,
    minParticipants: 2,
    minAge: null,
    maxAge: null,
    includedItems: [
      "Family-friendly activities",
      "All equipment",
      "Picnic lunch"
    ],
    excludedItems: [],
    whatToBring: ["Swimwear", "Sunscreen", "Towels"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: "Adult supervision required for children",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.8",
    totalReviews: 167,
    totalBookings: 190,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    pricing: []
  }
]

export function EnhancedActivitiesMapSection({
  className = ""
}: EnhancedActivitiesMapSectionProps) {
  const [activities, setActivities] =
    useState<ActivityWithDetails[]>(fallbackActivities)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({
    water_sports: 2,
    land_adventures: 1,
    cultural: 1,
    nightlife: 1,
    family_fun: 1
  })

  // Fetch activities data
  useEffect(() => {
    debugLog("🗺️ Map component mounted. Initial state:", {
      activitiesLength: activities.length,
      isUpdating,
      fallbackActivitiesLength: fallbackActivities.length,
      firstFallbackActivity: fallbackActivities[0]?.title
    })

    const fetchActivities = async () => {
      setIsUpdating(true)
      debugLog("🗺️ Starting to fetch activities for map...")
      try {
        const result = await getActivitiesSupabaseAction({
          limit: 50,
          sortBy: "popular"
        })

        debugLog("🗺️ Map fetch result:", {
          isSuccess: result.isSuccess,
          dataLength: result.data?.length || 0,
          message: result.message
        })

        if (result.isSuccess && result.data && result.data.length > 0) {
          debugLog("✅ Map: Got real activities:", result.data.length)
          // Convert Supabase data to ActivityWithDetails format
          const formattedActivities: ActivityWithDetails[] = result.data.map(
            activity => ({
              ...activity,
              images: [],
              pricing: []
            })
          )
          setActivities(formattedActivities)

          // Calculate category statistics
          const stats = result.data.reduce(
            (acc, activity) => {
              acc[activity.category] = (acc[activity.category] || 0) + 1
              return acc
            },
            {} as Record<string, number>
          )
          setCategoryStats(stats)
        } else {
          debugLog("📝 Map: No real activities found, keeping fallback data")
          debugLog(
            "📝 Current fallback activities:",
            fallbackActivities.map(a => a.title)
          )
        }
      } catch (err) {
        debugLog("❌ Map: Error fetching activities:", err)
        debugLog("📝 Keeping fallback data due to error")
      } finally {
        setIsUpdating(false)
        debugLog("🏁 Map: Fetch complete, isUpdating set to false")
      }
    }

    const timeoutId = setTimeout(fetchActivities, 200)
    return () => clearTimeout(timeoutId)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  if (error) {
    return (
      <section className={`relative py-20 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <p className="text-red-400">Failed to load activities map: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      className={`relative overflow-hidden py-12 sm:py-16 lg:py-20 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Deep Pink Brand Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-pink-500 to-pink-600" />

      {/* Ambient Lighting Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 size-72 rounded-full bg-yellow-400/10 blur-3xl sm:size-96" />
        <div className="absolute bottom-0 right-1/4 size-72 rounded-full bg-pink-300/10 blur-3xl sm:size-96" />
      </div>

      {/* Pattern Overlay - removed to fix syntax error */}

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Header Section */}
        <motion.div
          className="mb-6 text-center sm:mb-8"
          variants={itemVariants}
        >
          <Badge className="mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
            <MapPin className="mr-1 size-3 sm:mr-2 sm:size-4" />
            Explore Locations
          </Badge>

          <h2 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl lg:text-5xl">
            Activities Across{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Mallorca
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-sm text-white/90 sm:text-base lg:text-xl">
            Discover amazing activities across the beautiful island
          </p>
        </motion.div>

        {/* Map Section - Now directly below title */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
            {isUpdating ? (
              <MapLocationSkeleton />
            ) : (
              <EnhancedLeafletMap
                activities={activities}
                height="100%"
                className="w-full"
                showLegend={true}
              />
            )}
          </div>
        </motion.div>

        {/* Enhanced Location Highlights - Now below map */}
        <motion.div variants={itemVariants}>
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
              Featured Locations ({activities.length} activities)
            </h3>

            {isUpdating ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-lg border border-gray-800 bg-gray-800/50 p-4"
                  >
                    <div className="mb-2 h-6 w-3/4 rounded bg-gray-700" />
                    <div className="h-4 w-full rounded bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {/* Scrollable Featured Activity Cards Container */}
                <div className="relative">
                  <motion.div
                    className="scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-red-600/50 hover:scrollbar-thumb-red-600/70 h-[250px] space-y-3 overflow-y-auto pr-2 sm:h-[350px] lg:h-[400px] lg:space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Featured Activity Cards - Show all activities */}
                    {activities.map((activity, index) => {
                      const categoryConfig = locationCategories.find(
                        cat => cat.id === activity.category
                      )
                      return (
                        <motion.div
                          key={activity.id}
                          className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/15"
                          variants={cardVariants}
                          whileHover="hover"
                        >
                          <div className="relative p-3 sm:p-4">
                            {/* Activity Header */}
                            <div className="mb-2 flex items-start justify-between sm:mb-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div
                                  className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br sm:size-12 ${categoryConfig?.gradient || "from-red-600 to-amber-500"}`}
                                >
                                  <span className="text-lg sm:text-xl">
                                    {categoryConfig?.emoji || "🎯"}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold leading-tight text-white sm:text-base">
                                    {activity.title}
                                  </h4>
                                  <p className="mt-0.5 flex items-center gap-1 text-xs text-white/70 sm:mt-1 sm:text-sm">
                                    <MapPin className="size-3" />
                                    {activity.location}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="size-4 text-yellow-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>

                            {/* Activity Details */}
                            <p className="mb-2 line-clamp-2 text-xs text-white/80 sm:mb-3 sm:text-sm">
                              {activity.shortDescription ||
                                activity.description}
                            </p>

                            {/* Activity Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 sm:gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  <span>
                                    {Math.floor(activity.durationMinutes / 60)}h
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="size-3" />
                                  <span>{activity.maxParticipants}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="size-3 text-amber-400" />
                                  <span>{activity.avgRating}</span>
                                </div>
                              </div>
                            </div>

                            {/* Featured Badge */}
                            {activity.featured && (
                              <div className="absolute right-2 top-2">
                                <Badge className="border-yellow-400/30 bg-yellow-400/20 px-2 py-1 text-xs text-yellow-400">
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Fade indicator for scrollable content */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-pink-600 to-transparent" />

                  {/* Scroll indicator */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white/60 sm:right-4">
                    <div className="flex flex-col gap-px">
                      <div
                        className="size-1 animate-bounce rounded-full bg-yellow-400/70"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="size-1 animate-bounce rounded-full bg-yellow-400/50"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="size-1 animate-bounce rounded-full bg-yellow-400/30"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs">Scroll</span>
                  </div>
                </div>

                {/* Show More Button */}
                <motion.button
                  className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 p-2.5 text-sm font-bold text-black shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl sm:mt-4 sm:p-3 sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  <span>View All Activities</span>
                  <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
                </motion.button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-white/60">No activities available</p>
              </div>
            )}

            {/* Enhanced Booking Information */}
            <motion.div
              className="mt-4 overflow-hidden rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-xl sm:mt-6 sm:p-4"
              variants={itemVariants}
            >
              <div className="mb-2 flex items-center gap-2 sm:mb-3">
                <MapPin className="size-4 text-yellow-400 sm:size-5" />
                <span className="text-sm font-semibold text-white sm:text-base">
                  Instant Booking Available
                </span>
              </div>
              <p className="mb-2 text-xs text-white/80 sm:mb-3 sm:text-sm">
                Click any location marker to see detailed activity information,
                pricing, and availability. Book your perfect Mallorca adventure
                with just a few clicks!
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 sm:gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-yellow-400" />
                  <span className="whitespace-nowrap">
                    Instant confirmation
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="size-3 text-yellow-400" />
                  <span className="whitespace-nowrap">Secure payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="size-3 text-yellow-400" />
                  <span className="whitespace-nowrap">Local experts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
