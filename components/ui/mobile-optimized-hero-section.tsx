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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { getVideoUrl, PROTECTED_CONFIG } from "@/lib/video-protection"

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

// Fallback video URLs - optimized for mobile
const FALLBACK_VIDEOS = [
  "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
  "https://player.vimeo.com/external/396879338.hd.mp4?s=2dd53044e6e34f0bb5c69e84e3d3414ffbc31e1c",
  // Additional public domain video fallbacks
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
]

export default function MobileOptimizedHeroSection({
  className
}: MobileOptimizedHeroSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false
  ])
  const [videoError, setVideoError] = useState<string | null>(null)

  // Mobile images - beach, boats, jet skis, water activities
  const videos = [
    {
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      poster:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      alt: "Jet ski adventure in crystal clear Mallorca waters"
    },
    {
      src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop",
      poster:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop",
      alt: "Luxury yacht sailing in Mallorca bay"
    },
    {
      src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1200&auto=format&fit=crop",
      poster:
        "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1200&auto=format&fit=crop",
      alt: "Beautiful beach and turquoise waters in Mallorca"
    },
    {
      src: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200&auto=format&fit=crop",
      poster:
        "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200&auto=format&fit=crop",
      alt: "Speedboat tour along Mallorca coastline"
    },
    {
      src: "https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?q=80&w=1200&auto=format&fit=crop",
      poster:
        "https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?q=80&w=1200&auto=format&fit=crop",
      alt: "Catamaran sailing at sunset in Mallorca"
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

  // Auto-rotate videos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [videos.length])

  const nextVideo = () => {
    setCurrentVideoIndex(prev => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex(prev => (prev - 1 + videos.length) % videos.length)
  }

  return (
    <section className={cn("relative h-screen overflow-hidden", className)}>
      {/* Video/Image Background Carousel */}
      <div className="absolute inset-0">
        {videos.map((media, index) => {
          const shouldRender =
            index === currentVideoIndex ||
            index === (currentVideoIndex + 1) % videos.length ||
            index === (currentVideoIndex - 1 + videos.length) % videos.length

          if (!shouldRender) return null

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentVideoIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Using images instead of videos for better mobile compatibility */}
              <Image
                src={media.src}
                alt={media.alt}
                fill
                className="object-cover"
                priority={index === currentVideoIndex}
                quality={90}
              />
            </div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-orange-900/70" />
      </div>

      {/* Video Indicators */}
      <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentVideoIndex(index)
              setVideoError(null) // Reset error when changing videos
            }}
            className={`h-2 w-6 rounded-full transition-colors ${
              index === currentVideoIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Debug info - remove after testing */}
      {videoError && (
        <div className="absolute left-4 top-4 z-20 rounded bg-red-500/80 p-2 text-xs text-white">
          {videoError}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Hero Content */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge
              className="inline-flex border px-4 py-2 text-xs font-semibold text-black shadow-lg backdrop-blur-lg"
              style={{
                borderColor: "rgba(255, 29, 206, 0.2)",
                backgroundColor: "rgba(255, 29, 206, 0.1)"
              }}
            >
              <Sparkles
                className="mr-2 size-4 drop-shadow-lg"
                style={{ color: "#fff546" }}
              />
              <span className="text-white drop-shadow-sm">
                #1 Activity Platform in Mallorca
              </span>
            </Badge>
          </motion.div>

          {/* Title - Matching Desktop */}
          <motion.h1
            className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block">
              <span className="text-white drop-shadow-lg">WE </span>
              <span className="text-yellow-400 drop-shadow-lg">ARE</span>
            </span>
            <span className="block text-black drop-shadow-lg">EXCURSIONS</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mb-6 text-base leading-relaxed text-white/95 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From thrilling water sports to cultural experiences. Book authentic
            local activities with instant confirmation.
          </motion.p>

          {/* Stats - Matching Desktop */}
          <motion.div
            className="mb-8 flex flex-wrap gap-2 text-xs text-white/95"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1.5 backdrop-blur-sm">
              <Star className="size-3 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              <span className="font-medium">4.8/5 rating</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1.5 backdrop-blur-sm">
              <Users
                className="size-3 drop-shadow-sm"
                style={{ color: "#fb067d" }}
              />
              <span className="font-medium">50k+ customers</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1.5 backdrop-blur-sm">
              <MapPin
                className="size-3 drop-shadow-sm"
                style={{ color: "#fb067d" }}
              />
              <span className="font-medium">Island-wide</span>
            </div>
          </motion.div>

          {/* Quick Search Form - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6"
          >
            <Link href="/activities" className="block">
              <div
                className="rounded-2xl border-2 p-5 shadow-xl backdrop-blur-lg transition-all duration-300 active:scale-95"
                style={{
                  borderColor: "rgba(255, 245, 70, 0.5)",
                  backgroundColor: "rgba(0, 0, 0, 0.4)"
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#fff546" }}
                    >
                      <Search className="size-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Find Your Perfect Activity
                      </h3>
                      <p className="text-sm text-white/80">
                        Explore 100+ amazing experiences
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-yellow-400" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
    </section>
  )
}
