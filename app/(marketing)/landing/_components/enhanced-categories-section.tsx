"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
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
        console.log("🔄 Starting to fetch activity counts for categories...")

        // First, let's test if we can get ANY activities at all
        const testResult = await getActivitiesSupabaseAction({
          limit: 10
        })
        console.log("🧪 Test fetch ALL activities:", {
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

              console.log(`📊 Category "${category.id}" results:`, {
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
              console.error(`❌ Error fetching ${category.id}:`, error)
              return {
                ...category,
                activityCount: Math.floor(Math.random() * 15) + 5 // Fallback count
              }
            }
          })
        )

        console.log(
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
          console.log(
            "📈 Updating categories with real data:",
            updatedCategories.map(cat => ({
              id: cat.id,
              count: cat.activityCount
            }))
          )

          setCategoriesWithCounts(updatedCategories)
        } else {
          console.log("📝 No activities found, keeping fallback data")
        }
      } catch (error) {
        console.error("❌ Error fetching activity counts:", error)
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
      const cardWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentCard(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const totalActivities = categoriesWithCounts.reduce(
    (sum, cat) => sum + (cat.activityCount || 0),
    0
  )

  console.log("🎯 Component render state:", {
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
      className="relative overflow-hidden py-12 md:py-24"
      style={{
        background: `linear-gradient(135deg, #fb067d, #ec4899, #fb067d)`,
        scale: exitScale,
        opacity: exitOpacity,
        y: exitY
      }}
      aria-label="Activity categories"
    >
      {/* Subtle Background Effects */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at top left, rgba(248, 187, 208, 0.5), transparent)`
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at bottom right, rgba(252, 228, 236, 0.5), transparent)`
        }}
      />
      <div className="bg-grid-white/[0.05] absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,_transparent_20%,_black)]" />

      {/* Subtle floating orbs */}
      <div
        className="absolute left-1/4 top-20 size-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      />
      <div
        className="absolute bottom-20 right-1/4 size-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Enhanced Header */}
        <AnimatedSection className="mb-8 text-center md:mb-20">
          <div className="relative inline-block">
            <Badge
              className="mb-4 px-5 py-2 text-sm font-bold text-white shadow-2xl md:mb-6 md:px-6 md:py-3 md:text-base"
              style={{
                background: `rgba(255, 255, 255, 0.2)`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.3)"
              }}
            >
              <Activity className="mr-2 size-4 md:size-5" />
              Popular Categories
            </Badge>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 text-3xl font-bold text-white sm:text-4xl md:mb-8 md:text-5xl lg:text-7xl"
          >
            Explore by{" "}
            <span
              className="inline-block"
              style={{
                color: "#fff546"
              }}
            >
              Category
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
          >
            Discover amazing activities across Mallorca's most exciting
            categories.
            {!isUpdating && totalActivities > 0 && (
              <span className="mt-2 block text-sm font-semibold text-yellow-300 md:text-lg">
                {totalActivities} premium experiences await you
              </span>
            )}
          </motion.p>
        </AnimatedSection>

        {/* Enhanced Categories Horizontal Scroll */}
        <AnimatedSection delay={0.6} className="relative">
          {/* Navigation buttons */}
          <div className="absolute -top-20 right-0 z-10 hidden gap-2 lg:flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-12 items-center justify-center rounded-full border-2 border-white bg-white/90 text-gray-800 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl"
              style={
                {
                  "--hover-border-color": "rgba(255, 29, 206, 0.6)"
                } as React.CSSProperties
              }
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(236, 72, 153, 1)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 1)"
              }}
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
              className="flex size-12 items-center justify-center rounded-full border-2 border-white bg-white/90 text-gray-800 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl"
              style={
                {
                  "--hover-border-color": "rgba(255, 29, 206, 0.6)"
                } as React.CSSProperties
              }
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(236, 72, 153, 1)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 1)"
              }}
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
                    className="w-full flex-none px-4 md:w-[350px] md:px-0"
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
                    className="w-full flex-none px-4 md:w-[350px] md:px-0"
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
                transition={{ duration: 0.3, ease: "easeOut" }}
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
                      const cardWidth = container.offsetWidth
                      container.scrollTo({
                        left: index * cardWidth,
                        behavior: "smooth"
                      })
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
        <AnimatedSection delay={0.6} className="mt-12 text-center md:mt-20">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <p className="mb-4 text-base text-white/90 md:text-lg">
              Can't decide? Browse all our amazing experiences
            </p>
            <motion.a
              href="/activities"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-pink-600 shadow-lg transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:shadow-xl md:px-8 md:py-4"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="size-4 md:size-5" />
              View All Activities
              <span className="ml-2 text-base md:text-lg">→</span>
            </motion.a>
          </motion.div>
        </AnimatedSection>
      </div>
    </motion.section>
  )
}
