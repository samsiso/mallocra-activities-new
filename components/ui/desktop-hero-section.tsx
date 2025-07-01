"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Search, Star, Users, Award, Zap, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { getVideoUrl, PROTECTED_CONFIG } from "@/lib/video-protection"

interface DesktopHeroSectionProps {
  className?: string
}

export default function DesktopHeroSection({
  className
}: DesktopHeroSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dfqvslgiy"

  // Fallback video URLs
  const FALLBACK_VIDEOS = [
    "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
    "https://player.vimeo.com/external/396879338.hd.mp4?s=2dd53044e6e34f0bb5c69e84e3d3414ffbc31e1c"
  ]

  // Desktop videos with Cloudinary - Same as in page.tsx
  const videos = [
    {
      cloudinaryId: "lcwtw5eus5cvbcddrpqh", // VERIFIED: 26s HD, 45MB
      src: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,h_1080/lcwtw5eus5cvbcddrpqh.mp4`,
      fallbackSrc: FALLBACK_VIDEOS[0],
      poster:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
      alt: "Professional Mallorca activity video"
    },
    {
      cloudinaryId: "rjuszbicymgknucnikjy", // VERIFIED: 26s HD
      src: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,h_1080/rjuszbicymgknucnikjy.mp4`,
      fallbackSrc: FALLBACK_VIDEOS[1],
      poster:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
      alt: "Stunning Mallorca adventure footage"
    },
    {
      cloudinaryId: "gezph6p3putc1ljotgcp", // VERIFIED: 18s Full HD
      src: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,h_1080/gezph6p3putc1ljotgcp.mp4`,
      fallbackSrc: FALLBACK_VIDEOS[0],
      poster:
        "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=2070&auto=format&fit=crop",
      alt: "Beautiful Mallorca landscape video"
    },
    {
      cloudinaryId: "z93bie9boj1omghtlje2", // VERIFIED: 29s 4K quality
      src: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,h_1080/z93bie9boj1omghtlje2.mp4`,
      fallbackSrc: FALLBACK_VIDEOS[1],
      poster:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
      alt: "High-quality Mallorca activity video"
    },
    {
      cloudinaryId: "gfayerv3n0kf23m7tryo", // VERIFIED: 20s 4K quality
      src: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920,h_1080/gfayerv3n0kf23m7tryo.mp4`,
      fallbackSrc: FALLBACK_VIDEOS[0],
      poster:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
      alt: "Premium Mallorca experience video"
    }
  ]

  // Auto-rotate videos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [videos.length])

  return (
    <section className={cn("relative h-screen overflow-hidden", className)}>
      {/* Video Background */}
      <div className="absolute inset-0">
        {videos.map((video, index) => (
          <video
            key={index}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              index === currentVideoIndex ? "opacity-100" : "opacity-0"
            }`}
            src={video.src}
            autoPlay
            muted
            loop
            playsInline
            poster={video.poster}
            onLoadedData={() => {
              console.log(`✅ Video ${video.cloudinaryId} loaded successfully`)
            }}
            onError={e => {
              console.error(
                `❌ Video ${video.cloudinaryId} failed to load from ${video.src}`
              )
              console.log(`🔄 Trying fallback: ${video.fallbackSrc}`)
              const videoElement = e.currentTarget
              if (videoElement.src !== video.fallbackSrc) {
                videoElement.src = video.fallbackSrc
              }
            }}
          >
            <source src={video.src} type="video/mp4" />
            <source src={video.fallbackSrc} type="video/mp4" />
          </video>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Video Indicators */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`h-2 w-12 rounded-full transition-all duration-150 ${
              index === currentVideoIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Badge
                  className="mb-8 inline-flex border px-6 py-3 text-base font-semibold text-black shadow-xl backdrop-blur-lg"
                  style={{
                    borderColor: "rgba(251, 6, 125, 0.2)",
                    backgroundColor: "rgba(251, 6, 125, 0.1)"
                  }}
                >
                  <Sparkles
                    className="mr-2 size-5 drop-shadow-lg"
                    style={{ color: "#fff546" }}
                  />
                  <span className="text-white drop-shadow-sm">
                    #1 Activity Platform in Mallorca
                  </span>
                </Badge>
              </motion.div>

              {/* Title - Same as Mobile */}
              <motion.h1
                className="mb-8 text-6xl font-black uppercase leading-none tracking-tighter lg:text-8xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                <span className="block">
                  <span className="text-white drop-shadow-lg">WE </span>
                  <span className="text-yellow-400 drop-shadow-lg">ARE</span>
                </span>
                <span className="block text-black drop-shadow-lg">
                  EXCURSIONS
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mb-8 text-xl leading-relaxed text-white/95 drop-shadow-sm lg:text-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                From thrilling water sports to cultural experiences. Book
                authentic local activities with instant confirmation.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="mb-10 flex flex-wrap gap-4 text-white/95"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
              >
                <div className="flex items-center gap-2 rounded-lg bg-black/20 px-4 py-2 backdrop-blur-sm">
                  <Star className="size-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                  <span className="font-medium">4.8/5 rating</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-black/20 px-4 py-2 backdrop-blur-sm">
                  <Users
                    className="size-5 drop-shadow-sm"
                    style={{ color: "#fb067d" }}
                  />
                  <span className="font-medium">50k+ customers</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-black/20 px-4 py-2 backdrop-blur-sm">
                  <MapPin
                    className="size-5 drop-shadow-sm"
                    style={{ color: "#fb067d" }}
                  />
                  <span className="font-medium">Island-wide</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/activities">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-6 text-lg font-bold text-black shadow-xl transition-all duration-150 hover:scale-105 hover:from-yellow-500 hover:to-amber-600 hover:shadow-2xl"
                  >
                    <Search className="mr-2 size-5" />
                    Browse Activities
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white bg-white/10 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Quick Search */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden lg:block"
            >
              <div
                className="rounded-3xl border-2 p-8 shadow-2xl backdrop-blur-lg"
                style={{
                  borderColor: "rgba(255, 245, 70, 0.5)",
                  backgroundColor: "rgba(0, 0, 0, 0.4)"
                }}
              >
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Find Your Perfect Activity
                </h3>

                {/* Quick Category Links */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🌊",
                      title: "Water Sports",
                      count: 24,
                      href: "/activities?category=water"
                    },
                    {
                      icon: "🏛️",
                      title: "Cultural Tours",
                      count: 18,
                      href: "/activities?category=culture"
                    },
                    {
                      icon: "⛰️",
                      title: "Adventures",
                      count: 12,
                      href: "/activities?category=mountain"
                    },
                    {
                      icon: "🍷",
                      title: "Food & Wine",
                      count: 15,
                      href: "/activities?category=food"
                    }
                  ].map((category, index) => (
                    <Link key={index} href={category.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer rounded-xl border border-white/30 bg-white/10 p-4 text-center backdrop-blur-md transition-all duration-150 hover:bg-white/20"
                      >
                        <div className="mb-2 text-3xl">{category.icon}</div>
                        <h4 className="font-semibold text-white">
                          {category.title}
                        </h4>
                        <p className="text-sm text-white/70">
                          {category.count} activities
                        </p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
