"use client"

/**
 * Hero Section Variants Component - Landing Page
 *
 * Three distinct hero section designs for the Client Design Variant System
 * Allows real-time switching between Video, Image, and Interactive 3D hero styles
 *
 * Variants:
 * 1. Video Background - Dynamic video carousel with overlays (current production)
 * 2. Static Parallax - High-quality images with parallax effects
 * 3. Interactive 3D - CSS 3D transforms and interactive animations
 */

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useVariants, useComponentVariant } from "@/context/VariantContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Mountain,
  Waves,
  Activity,
  ChevronDown,
  MousePointer,
  Zap,
  Award,
  Heart,
  TrendingUp
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface HeroVideo {
  cloudinaryId: string
  src: string
  fallbackSrc: string
  poster: string
  alt: string
  title: string
}

interface HeroVariantsProps {
  heroVideos: HeroVideo[]
  onSearch?: (query: string) => void
}

export function HeroVariants({ heroVideos, onSearch }: HeroVariantsProps) {
  const { variants } = useVariants()
  const heroVariant = useComponentVariant("hero")
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150])

  // Handle mouse movement for interactive variant
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    if (heroVariant.current === "interactive") {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [heroVariant.current])

  // Auto-advance videos for video variant
  useEffect(() => {
    if (heroVariant.current === "video" && heroVideos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % heroVideos.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [heroVariant.current, heroVideos.length])

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Variant-specific configurations
  const variantConfigs = {
    video: {
      containerClass:
        "relative min-h-screen flex items-center justify-center overflow-hidden",
      backgroundClass:
        "bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900",
      contentClass: "relative z-20 text-center px-4 max-w-4xl mx-auto",
      overlayClass:
        "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10"
    },
    image: {
      containerClass:
        "relative min-h-screen flex items-center justify-center overflow-hidden",
      backgroundClass:
        "bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900",
      contentClass: "relative z-20 text-center px-4 max-w-4xl mx-auto",
      overlayClass:
        "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"
    },
    interactive: {
      containerClass:
        "relative min-h-screen flex items-center justify-center overflow-hidden",
      backgroundClass:
        "bg-gradient-to-br from-purple-900 via-pink-900 to-red-900",
      contentClass: "relative z-20 text-center px-4 max-w-4xl mx-auto",
      overlayClass:
        "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10"
    }
  }

  const currentConfig = variantConfigs[heroVariant.current]

  return (
    <motion.section
      className={`${currentConfig.containerClass} ${currentConfig.backgroundClass}`}
      key={`hero-${heroVariant.current}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Video Background Variant */}
      {heroVariant.current === "video" && (
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.video
              key={currentVideoIndex}
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              poster={heroVideos[currentVideoIndex]?.poster}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
            >
              <source
                src={heroVideos[currentVideoIndex]?.src}
                type="video/mp4"
              />
              <source
                src={heroVideos[currentVideoIndex]?.fallbackSrc}
                type="video/mp4"
              />
            </motion.video>
          </AnimatePresence>

          {/* Video Controls */}
          <div className="absolute bottom-6 left-6 z-30 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVideoToggle}
              className="border-white/30 bg-black/20 text-white hover:bg-black/40"
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMuteToggle}
              className="border-white/30 bg-black/20 text-white hover:bg-black/40"
            >
              {isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </Button>
          </div>

          {/* Video Indicators */}
          <div className="absolute bottom-6 right-6 z-30 flex gap-2">
            {heroVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`size-2 rounded-full transition-all duration-300 ${
                  index === currentVideoIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Static Parallax Variant */}
      {heroVariant.current === "image" && (
        <motion.div className="absolute inset-0 z-0" style={{ y: parallaxY }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50" />
          <Image
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop"
            alt="Mallorca landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Floating Elements */}
          <motion.div
            className="absolute left-10 top-1/4 size-32 rounded-full bg-white/10 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-10 size-24 rounded-full bg-pink-500/20 blur-2xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Interactive 3D Variant */}
      {heroVariant.current === "interactive" && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900" />

          {/* 3D Interactive Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute size-64 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-2xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.1}deg) rotateX(${mousePosition.y * 0.1}deg)`
                }}
                animate={{
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>

          {/* Interactive Cursor Trail */}
          <motion.div
            className="pointer-events-none absolute z-10 size-4 rounded-full bg-yellow-300 blur-sm"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* Overlay */}
      <div className={currentConfig.overlayClass} />

      {/* Main Content */}
      <div className={currentConfig.contentClass}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Badge className="border-pink-500/30 bg-gradient-to-r from-pink-500/20 to-red-500/20 px-4 py-2 text-sm text-white">
            <Award className="mr-1 size-4" />
            {heroVariant.current === "video"
              ? "Premium Video Experience"
              : heroVariant.current === "image"
                ? "High-Quality Imagery"
                : "Interactive 3D Experience"}
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <span className="text-black">Discover</span>{" "}
            <span
              className="text-yellow-400"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
            >
              Mallorca's
            </span>
            <br />
            <span className="text-white">Best Activities</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-4 text-lg text-white/90"
          >
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-current text-yellow-400" />
              <span className="font-semibold">4.9</span>
            </div>
            <div className="size-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-1">
              <Users className="size-5 text-pink-400" />
              <span>50k+ Happy Customers</span>
            </div>
            <div className="size-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-1">
              <TrendingUp className="size-5 text-green-400" />
              <span>Trending Now</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mb-8 max-w-2xl"
        >
          <div className="flex gap-3 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="flex flex-1 items-center gap-3">
              <Search className="ml-2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  heroVariant.current === "video"
                    ? "Search activities with video previews..."
                    : heroVariant.current === "image"
                      ? "Discover beautiful Mallorca experiences..."
                      : "Find interactive adventures..."
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-lg text-gray-800 placeholder:text-gray-500 focus:ring-0"
                onKeyPress={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-red-600 hover:shadow-xl"
            >
              <Search className="mr-2 size-5" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-red-500 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-red-600 hover:shadow-2xl"
          >
            <Activity className="mr-2 size-5" />
            Explore Activities
            <ArrowRight className="ml-2 size-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2 border-white/30 px-8 py-4 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl"
          >
            <Heart className="mr-2 size-5" />
            View Favorites
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mx-auto grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4"
        >
          {[
            { icon: Activity, label: "Activities", value: "150+" },
            { icon: MapPin, label: "Locations", value: "50+" },
            { icon: Users, label: "Customers", value: "50k+" },
            { icon: Award, label: "Rating", value: "4.9★" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <stat.icon className="size-6 text-pink-300" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/70"
          >
            <span className="text-sm">
              {heroVariant.current === "interactive"
                ? "Move mouse to interact"
                : "Scroll to explore"}
            </span>
            <ChevronDown className="size-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Variant Info Badge (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <motion.div
          className="absolute left-4 top-20 z-50"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="rounded-full border border-pink-500/30 bg-black/80 px-3 py-2 text-xs text-white backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3" />
              Hero:{" "}
              {heroVariant.current === "video"
                ? "Video Background"
                : heroVariant.current === "image"
                  ? "Static Parallax"
                  : "Interactive 3D"}
            </div>
            {heroVariant.current === "interactive" && (
              <div className="mt-1 text-xs text-gray-300">
                Mouse: {Math.round(mousePosition.x)}%,{" "}
                {Math.round(mousePosition.y)}%
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  )
}
