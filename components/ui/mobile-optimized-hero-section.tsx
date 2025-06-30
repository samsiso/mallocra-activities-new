"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Search,
  Star,
  Users,
  Award,
  Zap,
  MapPin,
  Play,
  Calendar,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface MobileOptimizedHeroSectionProps {
  className?: string
}

interface CategoryCardProps {
  title: string
  description: string
  icon: string
  count: number
  href: string
  delay: number
}

function MobileCategoryCard({
  title,
  description,
  icon,
  count,
  href,
  delay
}: CategoryCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <Link href={href} className="block">
        <div className="rounded-xl border border-pink-500/30 bg-pink-500/15 p-4 backdrop-blur-md transition-all duration-300 active:scale-95">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-xs text-white/70">{count} activities</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function MobileOptimizedHeroSection({
  className
}: MobileOptimizedHeroSectionProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const videos = [
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop"
    }
  ]

  const categories = [
    {
      title: "Water Sports",
      description: "Jet skiing & diving",
      icon: "🌊",
      count: 24,
      href: "/activities?category=water",
      delay: 0
    },
    {
      title: "Cultural Tours",
      description: "Historic sites & markets",
      icon: "🏛️",
      count: 18,
      href: "/activities?category=culture",
      delay: 0.1
    },
    {
      title: "Adventures",
      description: "Hiking & climbing",
      icon: "⛰️",
      count: 12,
      href: "/activities?category=mountain",
      delay: 0.2
    },
    {
      title: "Food & Wine",
      description: "Culinary experiences",
      icon: "🍷",
      count: 15,
      href: "/activities?category=food",
      delay: 0.3
    }
  ]

  return (
    <section className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Video Background with Overlay */}
      <div className="absolute inset-0">
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={videos[currentVideoIndex].poster}
        >
          <source src={videos[currentVideoIndex].src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Hero Content */}
        <div className="flex flex-1 flex-col justify-center px-4 py-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Badge className="border-none bg-gradient-to-r from-pink-600 to-pink-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
              🏆 #1 Rated in Mallorca
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mb-4 text-4xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block text-black drop-shadow-lg">Discover</span>
            <span className="block text-yellow-400 drop-shadow-lg">
              Mallorca's
            </span>
            <span className="block text-white drop-shadow-lg">
              Best Activities
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mb-6 text-base leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Book instantly with local experts and create unforgettable memories
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            className="mb-8 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: Zap, text: "Instant Booking", color: "text-yellow-400" },
              { icon: MapPin, text: "Local Experts", color: "text-pink-400" },
              { icon: Award, text: "Best Price", color: "text-yellow-400" },
              { icon: Users, text: "Small Groups", color: "text-pink-400" }
            ].map((benefit, index) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
              >
                <benefit.icon className={cn("size-4", benefit.color)} />
                <span className="text-xs font-medium text-white">
                  {benefit.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Quick Search Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex w-full items-center justify-between rounded-xl border border-pink-500/40 bg-pink-500/20 p-4 backdrop-blur-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="size-5 text-white" />
                <span className="font-medium text-white">Quick Search</span>
              </div>
              <ChevronDown
                className={cn(
                  "size-5 text-white transition-transform",
                  showSearch && "rotate-180"
                )}
              />
            </button>

            {/* Expandable Search Form */}
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-3 overflow-hidden"
              >
                <select className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
                  <option>All Activities</option>
                  <option>Water Sports</option>
                  <option>Cultural Tours</option>
                  <option>Adventures</option>
                </select>
                <input
                  type="date"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm"
                />
                <select className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
                  <option>Number of Guests</option>
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3-4 People</option>
                  <option>5+ People</option>
                </select>
                <Button className="w-full bg-gradient-to-r from-pink-600 to-pink-500 py-6 text-base font-semibold text-white shadow-lg">
                  Search Activities
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/activities" className="block">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-pink-500 py-6 text-base font-semibold text-white shadow-lg">
                Browse All Activities
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-white/30 bg-white/10 py-6 text-base font-semibold text-white backdrop-blur-sm"
            >
              <Play className="mr-2 size-5" />
              Watch Video Tour
            </Button>
          </motion.div>
        </div>

        {/* Categories Section */}
        <div className="border-t border-white/10 bg-black/30 px-4 py-6 backdrop-blur-md">
          <motion.h3
            className="mb-4 text-lg font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Popular Categories
          </motion.h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(category => (
              <MobileCategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex h-6 w-4 items-start justify-center rounded-full border border-white/30 p-1">
            <motion.div
              className="size-0.5 rounded-full bg-white"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
