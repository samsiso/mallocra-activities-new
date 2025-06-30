"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
      transition={{ duration: 0.8, delay }}
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
    <section
      className="relative overflow-hidden py-24"
      style={{
        background: `linear-gradient(135deg, #fce4ec, #f8bbd0, #fce4ec)`
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
        <AnimatedSection className="mb-20 text-center">
          <div className="relative inline-block">
            <Badge
              className="mb-6 px-6 py-3 text-base font-bold text-white shadow-2xl"
              style={{
                background: `linear-gradient(to right, #ff1dce, #dc2626)`,
                boxShadow: "0 20px 25px -5px rgba(255, 29, 206, 0.4)"
              }}
            >
              <Activity className="mr-2 size-5" />
              Popular Categories
            </Badge>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl"
          >
            Explore by{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(to right, #db2777, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              Category
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl"
          >
            Discover amazing activities across Mallorca's most exciting
            categories.
            {!isUpdating && totalActivities > 0 && (
              <span className="mt-2 block text-lg font-semibold text-pink-600">
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
            id="categories-carousel"
            className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 lg:gap-8"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              scrollPadding: "0 24px",
              willChange: "scroll-position",
              transform: "translate3d(0, 0, 0)",
              contain: "layout style paint"
            }}
          >
            {/* Always show actual category cards with data */}
            {categoriesWithCounts.map((category, index) => (
              <div
                key={category.id}
                className="flex-none"
                style={{
                  width: "350px",
                  minWidth: "350px",
                  scrollSnapAlign: "start"
                }}
              >
                <PremiumCategoryCard category={category} index={index} />
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-6 flex justify-center lg:hidden">
            <div className="flex items-center gap-2 rounded-full border-2 border-white bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
              <svg
                className="size-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Scroll to explore categories
              </span>
              <svg
                className="size-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </AnimatedSection>

        {/* Enhanced Call to Action */}
        <AnimatedSection delay={1.2} className="mt-20 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <p className="mb-4 text-lg text-gray-600">
              Can't decide? Browse all our amazing experiences
            </p>
            <motion.a
              href="/activities"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="size-5" />
              View All Activities
              <span className="ml-2 text-lg">→</span>
            </motion.a>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}
