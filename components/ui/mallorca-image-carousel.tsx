"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  Volume2,
  VolumeX,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselImage {
  url: string
  alt: string
  title?: string
  description?: string
}

interface MallorcaImageCarouselProps {
  images?: CarouselImage[]
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  showThumbnails?: boolean
  enableFullscreen?: boolean
  enableKeyboardNavigation?: boolean
  className?: string
  imageClassName?: string
  overlayGradient?: boolean
  parallaxEffect?: boolean
  soundEffects?: boolean
}

export function MallorcaImageCarousel({
  images,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  showThumbnails = false,
  enableFullscreen = true,
  enableKeyboardNavigation = true,
  className,
  imageClassName,
  overlayGradient = true,
  parallaxEffect = true,
  soundEffects = false
}: MallorcaImageCarouselProps) {
  // Default Mallorca beach/sea images
  const defaultImages: CarouselImage[] = [
    {
      url: "https://images.unsplash.com/photo-1578530332818-6ba472e67b9f?q=80&w=2070&auto=format&fit=crop",
      alt: "Turquoise waters and sandy beach at Cala Mondragó, Mallorca",
      title: "Cala Mondragó",
      description:
        "Experience the pristine turquoise waters of Mallorca's protected natural beach"
    },
    {
      url: "https://images.unsplash.com/photo-1570135460345-26da4177b7f6?q=80&w=2070&auto=format&fit=crop",
      alt: "Luxury yachts and sailboats in Port de Sóller marina at sunset",
      title: "Port de Sóller",
      description:
        "Discover luxury sailing experiences in Mallorca's charming marina"
    },
    {
      url: "https://images.unsplash.com/photo-1601389004506-dcf7e42de4d8?q=80&w=2070&auto=format&fit=crop",
      alt: "Crystal clear Mediterranean waters at Es Trenc beach with white sand",
      title: "Es Trenc Beach",
      description:
        "Relax on the Caribbean-like white sand beaches of southern Mallorca"
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop",
      alt: "Traditional fishing boats in a picturesque Mallorca cove",
      title: "Cala Figuera",
      description:
        "Explore authentic fishing villages with traditional Mallorcan boats"
    },
    {
      url: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=2070&auto=format&fit=crop",
      alt: "Aerial view of Cap de Formentor with dramatic cliffs and blue sea",
      title: "Cap de Formentor",
      description:
        "Adventure to the dramatic cliffs and panoramic views of northern Mallorca"
    }
  ]

  const carouselImages = images || defaultImages
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(soundEffects)
  const [showInfo, setShowInfo] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const carouselRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Preload images for smoother transitions
  useEffect(() => {
    carouselImages.forEach(image => {
      const img = new window.Image()
      img.src = image.url
    })
  }, [carouselImages])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselImages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval, carouselImages.length])

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
        case " ":
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case "f":
        case "F":
          toggleFullscreen()
          break
        case "Escape":
          if (isFullscreen) setIsFullscreen(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, isFullscreen, enableKeyboardNavigation])

  // Parallax effect on mouse move
  useEffect(() => {
    if (!parallaxEffect) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = ((clientX - innerWidth / 2) / innerWidth) * 20
      const y = ((clientY - innerHeight / 2) / innerHeight) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [parallaxEffect])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1))
    playTransitionSound()
  }, [carouselImages.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % carouselImages.length)
    playTransitionSound()
  }, [carouselImages.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    playTransitionSound()
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!enableFullscreen) return

    if (!document.fullscreenElement) {
      carouselRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [enableFullscreen])

  const playTransitionSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }

  const currentImage = carouselImages[currentIndex]

  return (
    <>
      {/* Sound effect audio element */}
      {soundEffects && (
        <audio
          ref={audioRef}
          src="/sounds/whoosh.mp3"
          preload="auto"
          className="hidden"
        />
      )}

      <div
        ref={carouselRef}
        className={cn(
          "relative size-full overflow-hidden rounded-xl",
          isFullscreen && "fixed inset-0 z-50 rounded-none",
          className
        )}
        role="region"
        aria-label="Image carousel"
        aria-roledescription="carousel"
      >
        {/* Main image container with parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: parallaxEffect ? mousePosition.x : 0,
              y: parallaxEffect ? mousePosition.y : 0
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className={cn(
                "object-cover",
                parallaxEffect && "scale-110",
                imageClassName
              )}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            {/* Gradient overlay */}
            {overlayGradient && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Info overlay */}
        <AnimatePresence>
          {(showInfo || isFullscreen) && currentImage.title && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-6 bottom-20 z-10 md:inset-x-12"
            >
              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="text-lg text-white/90">
                    {currentImage.description}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {showControls && (
          <>
            {/* Previous button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className={cn(
                "absolute left-4 top-1/2 z-20 -translate-y-1/2",
                "border-white/20 bg-white/10 backdrop-blur-sm",
                "text-white hover:bg-white/20",
                "size-12 rounded-full",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </Button>

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className={cn(
                "absolute right-4 top-1/2 z-20 -translate-y-1/2",
                "border-white/20 bg-white/10 backdrop-blur-sm",
                "text-white hover:bg-white/20",
                "size-12 rounded-full",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </Button>

            {/* Top controls bar */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
              {/* Play/Pause button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "border-white/20 bg-white/10 backdrop-blur-sm",
                  "text-white hover:bg-white/20",
                  "size-10 rounded-full"
                )}
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>

              {/* Sound toggle */}
              {soundEffects && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "border-white/20 bg-white/10 backdrop-blur-sm",
                    "text-white hover:bg-white/20",
                    "size-10 rounded-full"
                  )}
                  aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                >
                  {soundEnabled ? (
                    <Volume2 className="size-4" />
                  ) : (
                    <VolumeX className="size-4" />
                  )}
                </Button>
              )}

              {/* Info toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className={cn(
                  "border-white/20 bg-white/10 backdrop-blur-sm",
                  "text-white hover:bg-white/20",
                  "size-10 rounded-full"
                )}
                aria-label="Toggle image information"
              >
                <Info className="size-4" />
              </Button>

              {/* Fullscreen button */}
              {enableFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className={cn(
                    "border-white/20 bg-white/10 backdrop-blur-sm",
                    "text-white hover:bg-white/20",
                    "size-10 rounded-full"
                  )}
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  <Maximize2 className="size-4" />
                </Button>
              )}
            </div>
          </>
        )}

        {/* Indicators */}
        {showIndicators && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  "focus:ring-2 focus:ring-pink-400 focus:ring-offset-2",
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {showThumbnails && !isFullscreen && (
          <div className="absolute inset-x-4 bottom-20 z-20">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              {carouselImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded",
                    "transition-all duration-200",
                    "focus:ring-2 focus:ring-pink-400 focus:ring-offset-2",
                    index === currentIndex
                      ? "scale-110 ring-2 ring-white"
                      : "opacity-70 hover:opacity-100"
                  )}
                  aria-label={`View ${image.alt}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Image {currentIndex + 1} of {carouselImages.length}:{" "}
          {currentImage.alt}
        </div>
      </div>
    </>
  )
}

// Export a simplified version for basic use cases
export function SimpleImageCarousel({
  images,
  className
}: {
  images?: CarouselImage[]
  className?: string
}) {
  return (
    <MallorcaImageCarousel
      images={images}
      className={className}
      showThumbnails={false}
      enableFullscreen={false}
      parallaxEffect={false}
    />
  )
}

// Export types for external use
export type { CarouselImage, MallorcaImageCarouselProps }
