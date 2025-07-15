"use client"

/*
<ai_context>
My Bookings Page - User Dashboard for Managing Activity Bookings
Features beautiful gradients, glassmorphism, and professional layouts consistent with the platform design.
Uses the main layout for consistent header/footer navigation.
Enhanced with analytics, calendar view, and comprehensive booking management.
Now integrated with Clerk auth for real user data.
</ai_context>
*/

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Download,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  CalendarIcon,
  List,
  Search,
  Filter,
  User,
  LogIn,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import {
  getUserBookingsAction,
  getBookingByReferenceAction
} from "@/actions/db/bookings-actions"
import { syncClerkUserAction } from "@/actions/db/users-actions"
import BookingAnalytics from "./_components/booking-analytics"
import BookingCalendar from "./_components/booking-calendar"

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

// Enhanced animated section wrapper
function AnimatedSection({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="size-5 text-green-400" />
      case "pending":
        return <Clock className="size-5 text-yellow-400" />
      case "cancelled":
        return <XCircle className="size-5 text-red-400" />
      case "completed":
        return <CheckCircle className="size-5 text-blue-400" />
      default:
        return <AlertCircle className="size-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-green-500/30 bg-green-500/20 text-green-400"
      case "pending":
        return "border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
      case "cancelled":
        return "border-red-500/30 bg-red-500/20 text-red-400"
      case "completed":
        return "border-blue-500/30 bg-blue-500/20 text-blue-400"
      default:
        return "border-gray-500/30 bg-gray-500/20 text-gray-400"
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <GlassmorphismCard className="overflow-hidden transition-all duration-300 hover:border-yellow-400/30 hover:bg-white/15">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Activity Image */}
          <div className="relative size-32 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/placeholder-activity.jpg"
              alt="Activity"
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {booking.activityTitle || "Activity"}
                </h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(booking.bookingDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {booking.bookingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-4" />
                    {booking.totalParticipants} people
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  className={cn("mb-2 border", getStatusBadge(booking.status))}
                >
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status}</span>
                </Badge>
                <p className="text-lg font-bold text-yellow-400">
                  €{booking.totalAmount}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/booking/${booking.id}`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-300 hover:to-amber-400 hover:shadow-yellow-400/30"
                >
                  <Download className="mr-1 size-4" />
                  View Details
                </Button>
              </Link>

              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-105 hover:border-rose-400/50 hover:bg-rose-500/20"
                >
                  <MessageSquare className="mr-1 size-4" />
                  Contact
                </Button>
              )}
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  )
}

export default function BookingsContent() {
  const { user, isLoaded: userLoaded } = useUser()
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "analytics">(
    "list"
  )
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Sync user profile and fetch bookings
  useEffect(() => {
    const fetchData = async () => {
      if (userLoaded && user) {
        try {
          // Sync user profile
          const profileResult = await syncClerkUserAction({
            id: user.id,
            emailAddresses: user.emailAddresses || [],
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumbers: user.phoneNumbers || []
          })

          if (profileResult.isSuccess) {
            setUserProfile(profileResult.data)

            // Fetch user bookings
            const bookingsResult = await getUserBookingsAction(
              profileResult.data.id
            )
            if (bookingsResult.isSuccess) {
              setBookings(bookingsResult.data)
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setLoading(false)
        }
      } else if (userLoaded && !user) {
        setLoading(false)
      }
    }

    fetchData()
  }, [userLoaded, user])

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true
    if (activeTab === "upcoming")
      return booking.status === "confirmed" || booking.status === "pending"
    if (activeTab === "completed") return booking.status === "completed"
    return true
  })

  // Show loading state
  if (!userLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin" />
          <p className="text-xl">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  // Show auth required state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
        <section className="relative flex min-h-screen items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative text-center">
            <GlassmorphismCard className="mx-auto max-w-md">
              <User className="mx-auto mb-6 size-16 text-yellow-400" />
              <h2 className="mb-4 text-3xl font-bold text-white">
                Sign In Required
              </h2>
              <p className="mb-8 text-white/70">
                Please sign in to view and manage your bookings
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
                    <LogIn className="mr-2 size-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </GlassmorphismCard>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      {/* Hero Section */}
      <section className="relative pb-12 pt-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <AnimatedSection className="text-center">
            <Badge className="mb-8 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-lg font-bold text-black shadow-xl">
              <Calendar className="mr-2 size-5" />
              My Bookings
            </Badge>

            <h1 className="mb-8 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {user.firstName || "Adventurer"}
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90">
              Manage your bookings, download receipts, and get ready for amazing
              experiences in Mallorca
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* View Mode & Tabs Section */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4">
          <AnimatedSection>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* View Mode Selector */}
              <GlassmorphismCard className="shrink-0 p-3">
                <div className="flex rounded-lg bg-black/20 p-1">
                  {[
                    { id: "list", label: "List", icon: List },
                    { id: "calendar", label: "Calendar", icon: CalendarIcon },
                    { id: "analytics", label: "Analytics", icon: BarChart3 }
                  ].map(mode => {
                    const Icon = mode.icon
                    return (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setViewMode(
                            mode.id as "list" | "calendar" | "analytics"
                          )
                        }
                        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          viewMode === mode.id
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <Icon className="size-4" />
                        {mode.label}
                      </button>
                    )
                  })}
                </div>
              </GlassmorphismCard>

              {/* Filter Tabs */}
              <GlassmorphismCard className="p-3">
                <div className="flex rounded-lg bg-black/20 p-1">
                  {[
                    { id: "all", label: "All Bookings" },
                    { id: "upcoming", label: "Upcoming" },
                    { id: "completed", label: "Completed" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </GlassmorphismCard>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <AnimatedSection>
            {viewMode === "list" && (
              <>
                {filteredBookings.length > 0 ? (
                  <div className="space-y-6">
                    {filteredBookings.map((booking, index) => (
                      <AnimatedSection key={booking.id} delay={index * 0.1}>
                        <BookingCard booking={booking} />
                      </AnimatedSection>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <GlassmorphismCard className="mx-auto max-w-md">
                      <div className="text-6xl">📅</div>
                      <h3 className="mb-4 text-2xl font-bold text-white">
                        No Bookings Found
                      </h3>
                      <p className="mb-6 text-white/70">
                        Ready to start your Mallorca adventure? Browse our
                        amazing activities!
                      </p>
                      <Link href="/activities">
                        <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
                          <Sparkles className="mr-2 size-4" />
                          Explore Activities
                        </Button>
                      </Link>
                    </GlassmorphismCard>
                  </div>
                )}
              </>
            )}

            {viewMode === "calendar" && <BookingCalendar />}

            {viewMode === "analytics" && <BookingAnalytics />}
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
