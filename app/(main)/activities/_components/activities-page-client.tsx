"use client"

/*
<ai_context>
Activities Page Client Component - Interactive UI Layer
Handles all client-side interactions, state management, filtering, and search functionality.
Separated from server component for optimal performance and maintainability.
Uses CSS animations instead of Framer Motion for better performance.
NOW WITH INFINITE SCROLL: IntersectionObserver for seamless pagination.
</ai_context>
*/

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Map,
  Loader2
} from "lucide-react"

// Import components
import {
  ActivityWithDetails,
  ActivitySearchParams,
  getActivitiesSupabaseAction
} from "@/actions/supabase-activities-actions"
import ActivityCard from "./activity-card"
import MobileActivityCard from "./mobile-activity-card"
import MobileFilters from "./mobile-filters"
import GlassmorphismCard from "./glassmorphism-card"
import dynamic from "next/dynamic"

// Dynamic import for heavy components (Leaflet map)
const ActivitiesMap = dynamic(() => import("@/components/ui/activities-map"), {
  ssr: false, // Disable SSR for map component
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm"
      style={{ height: "700px" }}
    >
      <div className="animate-in fade-in flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm duration-500">
        <Loader2 className="size-5 animate-spin text-yellow-400" />
        <span className="text-white/90">Loading map...</span>
      </div>
    </div>
  )
})

interface ActivitiesPageClientProps {
  initialActivities: any[]
  initialSearchParams: ActivitySearchParams
}

export default function ActivitiesPageClient({
  initialActivities,
  initialSearchParams
}: ActivitiesPageClientProps) {
  const [activities, setActivities] = useState<any[]>(initialActivities)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialActivities.length >= 20) // Assume more if we got full page
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || "")
  const [selectedCategory, setSelectedCategory] = useState(
    initialSearchParams.category || "all"
  )
  const [selectedLocation, setSelectedLocation] = useState(
    initialSearchParams.location || "all"
  )
  const [sortBy, setSortBy] = useState(initialSearchParams.sortBy || "featured")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  const router = useRouter()
  const searchParams = useSearchParams()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 20

  // Fetch activities with new filters
  const fetchActivities = async (reset = true) => {
    if (reset) {
      setLoading(true)
      setCurrentPage(0)
    } else {
      setLoadingMore(true)
    }

    try {
      const params: ActivitySearchParams = {
        search: searchTerm || undefined,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        location: selectedLocation === "all" ? undefined : selectedLocation,
        sortBy: sortBy as any,
        limit: ITEMS_PER_PAGE,
        offset: reset ? 0 : (currentPage + 1) * ITEMS_PER_PAGE
      }

      const result = await getActivitiesSupabaseAction(params)
      if (result.isSuccess) {
        const newActivities = result.data || []

        if (reset) {
          setActivities(newActivities)
          setCurrentPage(0)
        } else {
          setActivities(prev => [...prev, ...newActivities])
          setCurrentPage(prev => prev + 1)
        }

        // Check if there are more items to load
        setHasMore(newActivities.length === ITEMS_PER_PAGE)
      } else {
        console.error("Failed to fetch activities:", result.message)
        if (reset) {
          setActivities([])
        }
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
      if (reset) {
        setActivities([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more activities for infinite scroll
  const loadMoreActivities = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchActivities(false)
    }
  }, [
    loadingMore,
    hasMore,
    currentPage,
    searchTerm,
    selectedCategory,
    selectedLocation,
    sortBy
  ])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreActivities()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px" // Start loading 100px before the element is visible
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadMoreActivities, hasMore, loadingMore, loading])

  // URL params update
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/activities?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({ search: searchTerm })
    fetchActivities(true)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateUrlParams({ category: value === "all" ? "" : value })
    fetchActivities(true)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    updateUrlParams({ location: value === "all" ? "" : value })
    fetchActivities(true)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateUrlParams({ sort: value })
    fetchActivities(true)
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedLocation("all")
    setSortBy("featured")
    setViewMode("grid")
    setCurrentPage(0)
    updateUrlParams({ search: "", category: "", location: "", sort: "" })
    fetchActivities(true)
  }

  return (
    <div
      className="relative min-h-screen"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Background */}
      <div className="activities-red-background bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pb-16 pt-32 sm:pt-36 lg:pt-40 xl:pt-44">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 size-80 animate-pulse rounded-full bg-gradient-to-r from-pink-400/25 to-pink-500/25 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-gradient-to-l from-white/15 to-transparent blur-3xl" />
            <div className="bg-gradient-radial absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full from-rose-500/15 to-transparent blur-2xl" />
            <div className="absolute right-1/4 top-1/4 size-64 rounded-full bg-gradient-to-br from-pink-400/10 to-pink-500/10 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4">
            <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-700">
              {/* Enhanced Hero Badge */}
              <Badge className="animate-in zoom-in-75 fade-in group mb-8 border border-white/40 bg-gradient-to-r from-yellow-400/95 to-amber-500/95 px-6 py-3 text-lg font-bold text-black shadow-2xl shadow-yellow-500/30 backdrop-blur-xl transition-all delay-100 duration-500 hover:scale-105 hover:shadow-yellow-500/50">
                <Sparkles className="mr-3 size-5 text-black transition-all duration-300 group-hover:animate-pulse" />
                Discover Amazing Activities
              </Badge>

              {/* Enhanced Main Title */}
              <h1 className="animate-in slide-in-from-bottom-6 fade-in mb-8 text-4xl font-bold leading-tight text-white delay-300 duration-700 sm:text-5xl lg:text-6xl xl:text-7xl">
                Explore{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                  Mallorca's
                </span>{" "}
                Best
              </h1>

              {/* Enhanced Description */}
              <p className="animate-in slide-in-from-bottom-4 fade-in mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/95 delay-500 duration-700 sm:text-xl">
                From water sports to cultural tours, find and book the perfect
                activities for your Mallorca adventure. Experience the island
                like never before.
              </p>

              {/* Mobile Search Bar - Visible on small screens */}
              <div className="animate-in slide-in-from-bottom-6 fade-in mb-4 delay-500 duration-700 lg:hidden">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/70" />
                  <Input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="h-12 w-full border-white/40 bg-white/20 pl-12 pr-24 text-base text-white backdrop-blur-xl transition-all duration-300 placeholder:text-white/70 focus:border-pink-400 focus:bg-white/30"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    size="sm"
                    className="absolute right-2 top-1/2 h-8 -translate-y-1/2 bg-pink-500 px-4 text-sm font-medium text-white"
                  >
                    Search
                  </Button>
                </form>
              </div>

              {/* Mobile Filters - Visible on small screens */}
              <div className="animate-in slide-in-from-bottom-6 fade-in delay-600 mb-6 duration-700 lg:hidden">
                <MobileFilters
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                  sortBy={sortBy}
                  onCategoryChange={handleCategoryChange}
                  onLocationChange={handleLocationChange}
                  onSortChange={handleSortChange}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Enhanced Glass Search Form - Hidden on mobile */}
              <div className="animate-in slide-in-from-bottom-8 fade-in hidden delay-700 duration-1000 lg:block">
                <GlassmorphismCard className="relative mx-auto max-w-6xl overflow-hidden border-white/50 bg-white/20 shadow-2xl shadow-black/20 backdrop-blur-2xl transition-all duration-500 hover:bg-white/25 hover:shadow-black/30">
                  {/* Subtle inner glow effect */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                  <form
                    onSubmit={handleSearch}
                    className="relative z-10 space-y-6"
                  >
                    {/* Main Search Row */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      {/* Enhanced Search Input */}
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/70" />
                        <Input
                          type="text"
                          placeholder="Search activities..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="h-14 border-white/40 bg-white/15 pl-12 text-base text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/70 focus:border-yellow-400 focus:bg-white/20"
                        />
                      </div>

                      {/* Enhanced Category Filter */}
                      <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="h-14 border-white/40 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 focus:border-yellow-400 focus:bg-white/20 lg:w-52">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="water_sports">
                            Water Sports
                          </SelectItem>
                          <SelectItem value="land_adventures">
                            Land Adventures
                          </SelectItem>
                          <SelectItem value="cultural">
                            Cultural & Culinary
                          </SelectItem>
                          <SelectItem value="nightlife">Nightlife</SelectItem>
                          <SelectItem value="day_trips">Day Trips</SelectItem>
                          <SelectItem value="family_fun">Family Fun</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Enhanced Location Filter */}
                      <Select
                        value={selectedLocation}
                        onValueChange={handleLocationChange}
                      >
                        <SelectTrigger className="h-14 border-white/40 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 focus:border-yellow-400 focus:bg-white/20 lg:w-52">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="palma">Palma</SelectItem>
                          <SelectItem value="alcudia">Alcudia</SelectItem>
                          <SelectItem value="soller">Soller</SelectItem>
                          <SelectItem value="pollensa">Pollensa</SelectItem>
                          <SelectItem value="cala_millor">
                            Cala Millor
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Enhanced Search Button */}
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-14 bg-gradient-to-r from-pink-500 to-pink-600 px-8 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-pink-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <Search className="mr-2 size-5" />
                        {loading ? "Searching..." : "Search"}
                      </Button>
                    </div>

                    {/* Enhanced Sort Options Row */}
                    <div className="flex flex-col gap-4 border-t border-white/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <SlidersHorizontal className="size-5 text-white/90" />
                        <span className="text-sm font-medium text-white/90">
                          Sort by:
                        </span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                          <SelectTrigger className="h-11 w-44 border-white/40 bg-white/15 text-sm text-white backdrop-blur-sm transition-all duration-300 focus:border-yellow-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="price_low">
                              Price: Low to High
                            </SelectItem>
                            <SelectItem value="price_high">
                              Price: High to Low
                            </SelectItem>
                            <SelectItem value="rating">
                              Highest Rated
                            </SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <span className="font-medium">
                          {activities.length > 0
                            ? `${activities.length} activities found`
                            : loading
                              ? "Searching..."
                              : "Start your search"}
                        </span>
                      </div>
                    </div>
                  </form>
                </GlassmorphismCard>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid Section */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Section Header */}
              <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
                <div>
                  <h2 className="mb-1 text-2xl font-bold text-white sm:mb-2 sm:text-3xl">
                    {activities.length > 0 ? (
                      <>
                        Found{" "}
                        <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                          {activities.length}
                        </span>{" "}
                        Activities
                      </>
                    ) : loading ? (
                      <>
                        <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                          Discovering
                        </span>{" "}
                        Activities...
                      </>
                    ) : (
                      "No Activities Found"
                    )}
                  </h2>
                  {!loading && activities.length > 0 && (
                    <p className="text-lg text-white/70">
                      Discover your perfect Mallorca adventure
                    </p>
                  )}
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  {/* View Toggle - Hidden on Mobile */}
                  <div className="flex overflow-hidden rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`border-0 px-3 py-2 transition-all hover:scale-105 active:scale-95 ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Filter className="mr-2 size-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                      className={`border-0 px-3 py-2 transition-all hover:scale-105 active:scale-95 ${
                        viewMode === "map"
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Map className="mr-2 size-4" />
                      Map
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-yellow-400/50 hover:bg-white/20 active:scale-95"
                  >
                    <Filter className="mr-2 size-4" />
                    More Filters
                  </Button>
                </div>
              </div>

              {/* Activities Grid or Map */}
              {loading ? (
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:gap-12">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10">
                        <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-800" />
                        <div className="p-6">
                          <div className="mb-4 flex gap-2">
                            <div className="h-5 w-16 rounded bg-white/20" />
                            <div className="h-5 w-20 rounded bg-white/20" />
                          </div>
                          <div className="mb-4 h-6 w-3/4 rounded bg-white/20" />
                          <div className="mb-6 space-y-2">
                            <div className="h-4 w-full rounded bg-white/20" />
                            <div className="h-4 w-2/3 rounded bg-white/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <>
                      {/* Mobile Grid - Single Column with Mobile Cards */}
                      <div className="grid gap-4 sm:hidden">
                        {activities.map((activity, index) => (
                          <div
                            key={activity.id}
                            className="animate-in fade-in slide-in-from-bottom-8 duration-500"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <MobileActivityCard activity={activity} />
                          </div>
                        ))}
                      </div>

                      {/* Desktop Grid - Multi Column with Regular Cards */}
                      <div className="hidden grid-cols-1 gap-6 sm:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8 2xl:gap-12">
                        {activities.map((activity, index) => (
                          <div
                            key={activity.id}
                            className="animate-in fade-in slide-in-from-right-12 duration-700"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ActivityCard
                              activity={activity}
                              variant="default"
                              index={index}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Infinite Scroll Sentinel & Load More Indicator */}
                      {hasMore && (
                        <div
                          ref={loadMoreRef}
                          className="mt-12 flex justify-center"
                        >
                          {loadingMore ? (
                            <div className="animate-in fade-in flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm duration-500">
                              <Loader2 className="size-5 animate-spin text-yellow-400" />
                              <span className="text-white/90">
                                Loading more activities...
                              </span>
                            </div>
                          ) : (
                            <div className="h-20 opacity-0">
                              {/* Invisible sentinel for IntersectionObserver */}
                            </div>
                          )}
                        </div>
                      )}

                      {/* End of Results Message */}
                      {!hasMore && activities.length > ITEMS_PER_PAGE && (
                        <div className="mt-12 text-center">
                          <div className="animate-in fade-in inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm duration-500">
                            <Sparkles className="size-4 text-yellow-400" />
                            <span className="text-white/90">
                              You've seen all {activities.length} activities!
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <ActivitiesMap
                        activities={activities.map(activity => ({
                          id: activity.id,
                          title: activity.title,
                          slug: activity.slug,
                          shortDescription: activity.short_description,
                          category: activity.category,
                          location: activity.location,
                          latitude: activity.latitude || 39.6953,
                          longitude: activity.longitude || 2.9712,
                          avgRating: activity.avg_rating,
                          totalReviews: activity.total_reviews,
                          durationMinutes: activity.duration_minutes,
                          maxParticipants: activity.max_participants,
                          images: activity.activity_images || [],
                          pricing: activity.activity_pricing || []
                        }))}
                        height="700px"
                        className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm"
                        showLegend={true}
                      />
                    </div>
                  )}
                </>
              ) : (
                /* Enhanced Empty State */
                <div className="py-16 text-center">
                  <GlassmorphismCard className="mx-auto max-w-md border-white/30 bg-white/15 backdrop-blur-xl">
                    <div className="mb-4 text-6xl">🏝️</div>
                    <h3 className="mb-4 text-2xl font-bold text-white">
                      No Activities Found
                    </h3>
                    <p className="mb-6 leading-relaxed text-white/70">
                      Try adjusting your search criteria or explore all our
                      amazing activities
                    </p>
                    <Button
                      onClick={handleResetFilters}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-amber-600 hover:shadow-xl active:scale-95"
                    >
                      <Sparkles className="mr-2 size-4" />
                      View All Activities
                    </Button>
                  </GlassmorphismCard>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
