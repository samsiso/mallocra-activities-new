"use client"

/*
Mobile Filter Chips Component
Horizontal scrolling filter pills for better mobile UX
Replaces dropdowns with touch-friendly chips
*/

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileFiltersProps {
  selectedCategory: string
  selectedLocation: string
  sortBy: string
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSortChange: (value: string) => void
  onReset: () => void
}

const categories = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "water_sports", label: "Water Sports", emoji: "🌊" },
  { value: "land_adventures", label: "Adventures", emoji: "🏔️" },
  { value: "cultural", label: "Cultural", emoji: "🏛️" },
  { value: "food_wine", label: "Food & Wine", emoji: "🍷" },
  { value: "nightlife", label: "Nightlife", emoji: "🎉" },
  { value: "family_fun", label: "Family", emoji: "👨‍👩‍👧‍👦" }
]

const locations = [
  { value: "all", label: "All Locations" },
  { value: "palma", label: "Palma" },
  { value: "alcudia", label: "Alcudia" },
  { value: "soller", label: "Soller" },
  { value: "pollensa", label: "Pollensa" }
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price_low", label: "Price ↑" },
  { value: "price_high", label: "Price ↓" },
  { value: "rating", label: "Top Rated" }
]

export default function MobileFilters({
  selectedCategory,
  selectedLocation,
  sortBy,
  onCategoryChange,
  onLocationChange,
  onSortChange,
  onReset
}: MobileFiltersProps) {
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    sortBy !== "featured"

  return (
    <div className="space-y-4">
      {/* Category Pills - Always Visible */}
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`
                flex-none rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  selectedCategory === cat.value
                    ? "bg-pink-500 text-white shadow-lg"
                    : "border border-white/20 bg-white/10 text-white/80"
                }
              `}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* More Filters Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="h-10 border-white/30 bg-white/10 text-white backdrop-blur-sm"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filters
          {hasActiveFilters && (
            <Badge className="ml-2 bg-pink-500 text-white">
              {
                [
                  selectedCategory !== "all",
                  selectedLocation !== "all",
                  sortBy !== "featured"
                ].filter(Boolean).length
              }
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 text-white/80 hover:text-white"
          >
            <X className="mr-1 size-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
              {/* Location Pills */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-white/80">
                  Location
                </h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map(loc => (
                    <button
                      key={loc.value}
                      onClick={() => onLocationChange(loc.value)}
                      className={`
                        rounded-full px-3 py-1.5 text-sm transition-all
                        ${
                          selectedLocation === loc.value
                            ? "bg-pink-500 text-white"
                            : "border border-white/20 bg-white/10 text-white/80"
                        }
                      `}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Pills */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-white/80">
                  Sort By
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map(sort => (
                    <button
                      key={sort.value}
                      onClick={() => onSortChange(sort.value)}
                      className={`
                        rounded-full px-3 py-1.5 text-sm transition-all
                        ${
                          sortBy === sort.value
                            ? "bg-pink-500 text-white"
                            : "border border-white/20 bg-white/10 text-white/80"
                        }
                      `}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
