"use client"

/*
<ai_context>
Wishlist Page - User Dashboard for Saved Activities
Features beautiful gradients, glassmorphism, and professional layouts consistent with the platform design.
Uses the main layout for consistent header/footer navigation.
</ai_context>
*/

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Heart,
  MapPin,
  Users,
  Star,
  Calendar,
  Trash2,
  Share2,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Mock wishlist data
const mockWishlistItems = [
  {
    id: "1",
    activityTitle: "Private Yacht Charter Experience",
    activitySlug: "private-yacht-charter",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
    category: "Water Sports",
    location: "Palma Bay",
    duration: "4 hours",
    price: 450,
    rating: 4.9,
    reviews: 127,
    featured: true,
    dateAdded: "2025-01-20"
  },
  {
    id: "2",
    activityTitle: "Serra de Tramuntana Hiking Tour",
    activitySlug: "tramuntana-hiking-tour",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    category: "Land Adventures",
    location: "Soller",
    duration: "6 hours",
    price: 85,
    rating: 4.8,
    reviews: 203,
    featured: false,
    dateAdded: "2025-01-18"
  },
  {
    id: "3",
    activityTitle: "Mallorca Wine & Olive Oil Tasting",
    activitySlug: "wine-olive-oil-tasting",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    category: "Food & Wine",
    location: "Binissalem",
    duration: "3 hours",
    price: 65,
    rating: 4.7,
    reviews: 89,
    featured: false,
    dateAdded: "2025-01-15"
  },
  {
    id: "4",
    activityTitle: "Formentor Lighthouse Sunset Tour",
    activitySlug: "formentor-lighthouse-sunset",
    image:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=800&auto=format&fit=crop",
    category: "Cultural Tours",
    location: "Formentor",
    duration: "5 hours",
    price: 95,
    rating: 4.9,
    reviews: 156,
    featured: true,
    dateAdded: "2025-01-12"
  }
]

function WishlistCard({
  item,
  onRemove
}: {
  item: (typeof mockWishlistItems)[0]
  onRemove: (id: string) => void
}) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(item.id)
    }, 300)
  }

  const formatDateAdded = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group cursor-pointer transition-all duration-300 ${isRemoving ? "scale-95 opacity-50" : ""}`}
    >
      <GlassmorphismCard className="overflow-hidden border-white/30 bg-white/20 p-0 transition-all duration-300 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/20">
        {/* Enhanced Image Section */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={item.image}
            alt={item.activityTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Top badges and actions */}
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {item.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-white shadow-xl">
                  <Sparkles className="mr-1 size-3" />
                  Featured
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-white/30 bg-white/20 text-white backdrop-blur-sm"
              >
                {item.category}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                onClick={e => {
                  e.preventDefault()
                  // Handle share functionality
                }}
              >
                <Share2 className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-600/80"
                onClick={e => {
                  e.preventDefault()
                  handleRemove()
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1 rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold">{item.rating}</span>
                <span className="text-xs text-gray-200">({item.reviews})</span>
              </div>

              <div className="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
                <span className="text-xl font-bold">€{item.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/80">
              <MapPin className="size-4" />
              <span className="text-sm">{item.location}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Calendar className="size-4" />
              <span className="text-sm">{item.duration}</span>
            </div>
          </div>

          <h3 className="mb-4 text-xl font-bold text-white transition-colors group-hover:text-yellow-400">
            {item.activityTitle}
          </h3>

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Added {formatDateAdded(item.dateAdded)}
            </div>

            <div className="flex gap-2">
              <Link href={`/book/${item.activitySlug}/select`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-yellow-500 font-bold text-white hover:from-pink-600 hover:to-yellow-600"
                >
                  Book Now
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  )
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  const clearWishlist = () => {
    setWishlistItems([])
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
              <Heart className="mr-2 size-5" />
              My Wishlist
            </Badge>

            <h1 className="mb-8 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Your{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Saved
              </span>{" "}
              Adventures
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90">
              Keep track of your favorite activities and book them when you're
              ready for your next Mallorca adventure
            </p>

            {wishlistItems.length > 0 && (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="flex items-center gap-2 text-white/80">
                  <Heart className="size-5 text-rose-400" />
                  <span>{wishlistItems.length} saved activities</span>
                </div>

                <Button
                  onClick={clearWishlist}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Trash2 className="mr-2 size-4" />
                  Clear All
                </Button>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <AnimatedSection>
            {wishlistItems.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item, index) => (
                  <AnimatedSection key={item.id} delay={index * 0.1}>
                    <WishlistCard item={item} onRemove={removeFromWishlist} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <GlassmorphismCard className="mx-auto max-w-md">
                  <div className="text-6xl">💕</div>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    Your Wishlist is Empty
                  </h3>
                  <p className="mb-6 text-white/70">
                    Start exploring our amazing activities and save your
                    favorites for later!
                  </p>
                  <Link href="/activities">
                    <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
                      <Sparkles className="mr-2 size-4" />
                      Discover Activities
                    </Button>
                  </Link>
                </GlassmorphismCard>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
