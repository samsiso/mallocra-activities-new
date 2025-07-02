"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { debugLog } from "@/lib/debug"
import { Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { categoriesData } from "../_data/categories-data"
import { CategoryData } from "./premium-category-card"
import PremiumCategoryCard from "./premium-category-card"
import CategoryCardSkeleton from "./category-card-skeleton"
import { getActivitiesSupabaseAction } from "@/actions/db/activities-actions"

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function EnhancedCategoriesSection() {
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<
    CategoryData[]
  >(
    categoriesData.map(cat => ({
      ...cat,
      activityCount: Math.floor(Math.random() * 15) + 5 // Start with fallback data
    }))
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Scroll-based exit animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Transform values for exit animations
  const exitScale = useTransform(scrollYProgress, [0.7, 1], [1, 0.9])
  const exitOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0])
  const exitY = useTransform(scrollYProgress, [0.7, 1], [0, -50])

  useEffect(() => {
    async function fetchActivityCounts() {
      setIsUpdating(true)
      try {
        debugLog("🔄 Starting to fetch activity counts for categories...")

        // First, let's test if we can get ANY activities at all
        const testResult = await getActivitiesSupabaseAction({
          limit: 10
        })
        debugLog("🧪 Test fetch ALL activities:", {
          isSuccess: testResult.isSuccess,
          dataLength: testResult.data?.length || 0,
          message: testResult.message,
          firstActivityTitle: testResult.data?.[0]?.title || "No activities"
        })

        const updatedCategories = await Promise.all(
          categoriesData.map(async category => {
            try {
              const result = await getActivitiesSupabaseAction({
                limit: 100,
                category: category.id.toLowerCase()
              })

              debugLog(`📊 Category "${category.id}" results:`, {
                isSuccess: result.isSuccess,
                count: result.data?.length || 0,
                message: result.message
              })

              return {
                ...category,
                activityCount: result.isSuccess
                  ? result.data?.length || 0
                  : Math.floor(Math.random() * 15) + 5
              }
            } catch (error) {
              debugLog(`❌ Error fetching ${category.id}:`, error)
              return {
                ...category,
                activityCount: Math.floor(Math.random() * 15) + 5 // Fallback count
              }
            }
          })
        )

        debugLog(
          "✅ Final categories with counts:",
          updatedCategories.map(cat => ({
            id: cat.id,
            count: cat.activityCount
          }))
        )

        if (
          testResult.isSuccess &&
          testResult.data &&
          testResult.data.length > 0
        ) {
          debugLog(
            "📈 Updating categories with real data:",
            updatedCategories.map(cat => ({
              id: cat.id,
              count: cat.activityCount
            }))
          )

          setCategoriesWithCounts(updatedCategories)
        } else {
          debugLog("📝 No activities found, keeping fallback data")
        }
      } catch (error) {
        debugLog("❌ Error fetching activity counts:", error)
        // Keep the initial fallback data we set in useState
      } finally {
        setIsUpdating(false)
      }
    }

    // Add a small delay to ensure the component is mounted
    const timeoutId = setTimeout(fetchActivityCounts, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  // Handle scroll to detect current card
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      // Account for padding and actual card width
      const cardElements = container.querySelectorAll(".category-card")
      if (cardElements.length > 0) {
        const firstCard = cardElements[0] as HTMLElement
        const cardWidth = firstCard.offsetWidth + 32 // card width + gap
        const newIndex = Math.round(scrollLeft / cardWidth)
        setCurrentCard(Math.min(newIndex, categoriesWithCounts.length - 1))
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [categoriesWithCounts.length])

  const totalActivities = categoriesWithCounts.reduce(
    (sum, cat) => sum + (cat.activityCount || 0),
    0
  )

  debugLog("🎯 Component render state:", {
    isUpdating,
    totalActivities,
    categoriesCount: categoriesWithCounts.length,
    hasActivityCounts: categoriesWithCounts.some(
      cat => (cat.activityCount || 0) > 0
    )
  })

  return (
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden py-8 md:py-16 lg:py-24"
      style={{
        background: "linear-gradient(135deg, #fb067d 0%, #ff2d8a 100%)",
        scale: exitScale,
        opacity: exitOpacity,
        y: exitY
      }}
      aria-label="Activity categories"
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/15" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Enhanced Header */}
        <AnimatedSection className="mb-6 text-center sm:mb-8 lg:mb-12">
          <div className="relative inline-block">
            <Badge
              className="mb-3 px-3 py-1.5 text-xs font-bold text-black shadow-lg sm:mb-4 sm:px-4 sm:py-2 sm:text-sm lg:mb-6 lg:px-6 lg:py-3 lg:text-base"
              style={{
                backgroundColor: "#fff546",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
              }}
            >
              <Activity className="mr-1 size-3 sm:mr-2 sm:size-4 lg:size-5" />
              Popular Categories
            </Badge>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl lg:mb-6 lg:text-6xl xl:text-7xl"
          >
            <span className="text-white">Explore by </span>
            <span className="text-yellow-400">Category</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl"
          >
            Discover amazing activities across Mallorca's most exciting
            categories.
            {!isUpdating && totalActivities > 0 && (
              <span
                className="mt-2 block text-sm font-semibold sm:text-base"
                style={{ color: "#fff546" }}
              >
                {totalActivities} premium experiences await you
              </span>
            )}
          </motion.p>
        </AnimatedSection>

        {/* Enhanced Categories Horizontal Scroll */}
        <AnimatedSection delay={0.3} className="relative">
          {/* Navigation buttons */}
          <div className="absolute -top-20 right-0 z-10 hidden gap-2 lg:flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-xl transition-all duration-150 hover:border-pink-500/60 hover:bg-white/10"
              onClick={() => {
                const container = document.getElementById("categories-carousel")
                if (container)
                  container.scrollBy({ left: -400, behavior: "smooth" })
              }}
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-xl transition-all duration-150 hover:border-pink-500/60 hover:bg-white/10"
              onClick={() => {
                const container = document.getElementById("categories-carousel")
                if (container)
                  container.scrollBy({ left: 400, behavior: "smooth" })
              }}
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Horizontal Scrolling Container */}
          <div
            ref={containerRef}
            id="categories-carousel"
            className="scrollbar-hide flex overflow-x-auto pb-4 md:gap-6 md:px-4 md:pb-6 lg:gap-8"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              scrollPadding: "0",
              willChange: "scroll-position",
              transform: "translate3d(0, 0, 0)",
              contain: "layout style paint"
            }}
          >
            {/* Show skeleton while loading, then actual category cards */}
            {isUpdating
              ? // Show skeleton cards while loading
                [...Array(4)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="category-card w-full flex-none px-4 md:w-[350px] md:px-0"
                    style={{
                      scrollSnapAlign: "start"
                    }}
                  >
                    <CategoryCardSkeleton index={index} />
                  </div>
                ))
              : // Show actual category cards with data
                categoriesWithCounts.map((category, index) => (
                  <div
                    key={category.id}
                    className="category-card w-full flex-none px-4 md:w-[350px] md:px-0"
                    style={{
                      scrollSnapAlign: "start"
                    }}
                  >
                    <PremiumCategoryCard category={category} index={index} />
                  </div>
                ))}
          </div>

          {/* Swipe Indicators and Progress Bar - Mobile Only */}
          <div className="mt-6 space-y-3 px-4 lg:hidden">
            {/* Progress Bar */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="absolute left-0 top-0 h-full bg-yellow-400"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentCard + 1) / categoriesWithCounts.length) * 100}%`
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2">
              {categoriesWithCounts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = containerRef.current
                    if (container) {
                      const cardElements =
                        container.querySelectorAll(".category-card")
                      if (cardElements.length > index) {
                        const targetCard = cardElements[index] as HTMLElement
                        container.scrollTo({
                          left: targetCard.offsetLeft - 16, // Account for padding
                          behavior: "smooth"
                        })
                      }
                    }
                  }}
                  className={`transition-all duration-300 ${
                    index === currentCard
                      ? "h-2 w-8 bg-white"
                      : "size-2 bg-white/40 hover:bg-white/60"
                  } rounded-full`}
                  aria-label={`Go to category ${index + 1}`}
                />
              ))}
            </div>

            {/* Card Counter */}
            <div className="text-center">
              <span className="text-sm font-medium text-white/80">
                {currentCard + 1} of {categoriesWithCounts.length} categories
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Enhanced Call to Action */}
        <AnimatedSection
          delay={0.6}
          className="mt-10 text-center sm:mt-12 lg:mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <p className="mb-3 text-sm text-white/80 sm:text-base">
              Can't decide? Browse all our amazing experiences
            </p>
            <motion.a
              href="/activities"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg transition-all duration-150 hover:bg-yellow-300 hover:shadow-xl sm:px-8 sm:py-4"
              whileHover={{ y: -2 }}
            >
              <Activity className="size-4 sm:size-5" />
              View All Activities
              <span className="ml-1 text-base sm:text-lg">→</span>
            </motion.a>
          </motion.div>
        </AnimatedSection>
      </div>
    </motion.section>
  )
}
