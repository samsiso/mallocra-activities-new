"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { designTokens } from "@/components/design-system"
import {
  Search,
  Filter,
  X,
  Calendar,
  Tag,
  User,
  TrendingUp,
  Clock,
  Grid,
  List,
  ChevronDown
} from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface BlogSearchFilterProps {
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string | null) => void
  onTagChange?: (tags: string[]) => void
  onAuthorChange?: (author: string | null) => void
  onSortChange?: (sort: SortOption) => void
  onViewChange?: (view: ViewMode) => void
  categories?: Category[]
  tags?: string[]
  authors?: Author[]
  currentView?: ViewMode
  className?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  count: number
  color?: string
}

export interface Author {
  id: string
  name: string
  avatar?: string
  postCount: number
}

export type SortOption = "latest" | "popular" | "trending" | "oldest"
export type ViewMode = "grid" | "list"

export function BlogSearchFilter({
  onSearch,
  onCategoryChange,
  onTagChange,
  onAuthorChange,
  onSortChange,
  onViewChange,
  categories = [],
  tags = [],
  authors = [],
  currentView = "grid",
  className
}: BlogSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("latest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    onSearch?.(debouncedSearch)
  }, [debouncedSearch, onSearch])

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    onCategoryChange?.(categorySlug)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(newTags)
    onTagChange?.(newTags)
  }

  const handleAuthorSelect = (authorId: string | null) => {
    setSelectedAuthor(authorId)
    onAuthorChange?.(authorId)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    onSortChange?.(sort)
    setShowSortDropdown(false)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedTags([])
    setSelectedAuthor(null)
    setSortBy("latest")

    onSearch?.("")
    onCategoryChange?.(null)
    onTagChange?.([])
    onAuthorChange?.(null)
    onSortChange?.("latest")
  }

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedTags.length +
    (selectedAuthor ? 1 : 0) +
    (searchQuery ? 1 : 0)

  const sortOptions = [
    { value: "latest", label: "Latest", icon: Clock },
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "oldest", label: "Oldest", icon: Calendar }
  ]

  const categoryColors = {
    guide: "from-blue-500 to-blue-600",
    tips: "from-green-500 to-green-600",
    destination: "from-purple-500 to-purple-600",
    activity: "from-pink-500 to-pink-600",
    event: "from-yellow-500 to-yellow-600"
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className={cn(
                "w-full rounded-xl py-3 pl-12 pr-4",
                "border border-white/20 bg-white/10 backdrop-blur-sm",
                "text-gray-900 placeholder:text-gray-500",
                "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500",
                "transition-all duration-300"
              )}
            />
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors duration-300 hover:bg-white/20"
              >
                <X className="size-4 text-gray-500" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "rounded-xl px-4 py-3 font-medium",
              "border border-white/20 bg-white/10 backdrop-blur-sm",
              "transition-all duration-300 hover:bg-white/20",
              "focus:outline-none focus:ring-2 focus:ring-pink-500",
              "flex items-center gap-2",
              showFilters && "border-pink-500/30 bg-pink-500/20"
            )}
          >
            <Filter className="size-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-pink-500 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          {/* Sort Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={cn(
                "rounded-xl px-4 py-3 font-medium",
                "border border-white/20 bg-white/10 backdrop-blur-sm",
                "transition-all duration-300 hover:bg-white/20",
                "focus:outline-none focus:ring-2 focus:ring-pink-500",
                "flex items-center gap-2"
              )}
            >
              {sortOptions.find(opt => opt.value === sortBy)?.icon &&
                React.createElement(
                  sortOptions.find(opt => opt.value === sortBy)!.icon,
                  { className: "w-5 h-5" }
                )}
              <span className="hidden md:inline">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-300",
                  showSortDropdown && "rotate-180"
                )}
              />
            </motion.button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value as SortOption)
                      }
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left",
                        "transition-colors duration-300 hover:bg-gray-50",
                        sortBy === option.value && "bg-pink-50 text-pink-600"
                      )}
                    >
                      <option.icon className="size-5" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange?.("grid")}
              className={cn(
                "rounded-l-xl p-3 transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-pink-500",
                currentView === "grid"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-white/20"
              )}
            >
              <Grid className="size-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange?.("list")}
              className={cn(
                "rounded-r-xl p-3 transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-pink-500",
                currentView === "list"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-white/20"
              )}
            >
              <List className="size-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategorySelect(null)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium",
                        "transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-pink-500",
                        !selectedCategory
                          ? "bg-pink-500 text-white"
                          : "bg-white/20 hover:bg-white/30"
                      )}
                    >
                      All Categories
                    </motion.button>
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategorySelect(category.slug)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium",
                          "transition-all duration-300",
                          "focus:outline-none focus:ring-2 focus:ring-pink-500",
                          selectedCategory === category.slug
                            ? "text-white"
                            : "bg-white/20 hover:bg-white/30"
                        )}
                        style={{
                          background:
                            selectedCategory === category.slug
                              ? `linear-gradient(to right, ${categoryColors[category.slug as keyof typeof categoryColors] || "from-gray-500 to-gray-600"})`
                              : undefined
                        }}
                      >
                        {category.name}
                        <span className="ml-2 text-xs opacity-80">
                          ({category.count})
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Tag className="size-4" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm",
                          "transition-all duration-300",
                          "focus:outline-none focus:ring-2 focus:ring-pink-500",
                          selectedTags.includes(tag)
                            ? "bg-pink-500 text-white"
                            : "bg-white/20 hover:bg-white/30"
                        )}
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors */}
              {authors.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="size-4" />
                    Authors
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {authors.map(author => (
                      <motion.button
                        key={author.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          handleAuthorSelect(
                            selectedAuthor === author.id ? null : author.id
                          )
                        }
                        className={cn(
                          "rounded-lg p-3 text-sm",
                          "transition-all duration-300",
                          "focus:outline-none focus:ring-2 focus:ring-pink-500",
                          selectedAuthor === author.id
                            ? "border-pink-500/30 bg-pink-500/20"
                            : "bg-white/10 hover:bg-white/20",
                          "border border-white/20"
                        )}
                      >
                        <p className="truncate font-medium">{author.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {author.postCount} posts
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="border-t border-white/20 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAllFilters}
                    className="rounded-lg bg-gray-500/20 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
