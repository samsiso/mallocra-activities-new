"use client"

import { useState, useEffect, useRef } from "react"
import { OptimizedVideo } from "./optimized-video"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VideoSource {
  cloudinaryId: string
  title: string
  directUrl?: string // Add direct URL support for external videos
}

interface VideoCarouselProps {
  videos: VideoSource[]
  autoRotate?: boolean
  rotationInterval?: number // in ms
  showControls?: boolean
  showIndicators?: boolean
  className?: string
  overlayText?: React.ReactNode
}

export function VideoCarousel({
  videos,
  autoRotate = true,
  rotationInterval = 8000, // 8 seconds default
  showControls = true,
  showIndicators = true,
  className,
  overlayText
}: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle auto-rotation
  useEffect(() => {
    if (autoRotate && isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % videos.length)
      }, rotationInterval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoRotate, isPlaying, rotationInterval, videos.length])

  // Navigation handlers
  const goToNext = () => {
    setActiveIndex(prev => (prev + 1) % videos.length)
    resetTimer()
  }

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1))
    resetTimer()
  }

  const goToIndex = (index: number) => {
    setActiveIndex(index)
    resetTimer()
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      if (autoRotate && isPlaying) {
        timerRef.current = setInterval(() => {
          setActiveIndex(prev => (prev + 1) % videos.length)
        }, rotationInterval)
      }
    }
  }

  // Pause/resume auto-rotation when user interacts
  const handleUserInteraction = () => {
    setIsPlaying(false)
  }

  // Resume auto-rotation after a period of inactivity
  useEffect(() => {
    if (!isPlaying) {
      const resumeTimer = setTimeout(() => {
        setIsPlaying(true)
      }, 10000) // Resume after 10 seconds of inactivity

      return () => clearTimeout(resumeTimer)
    }
  }, [isPlaying])

  if (videos.length === 0) {
    return null
  }

  return (
    <div
      className={cn("relative h-screen w-full overflow-hidden", className)}
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* Videos */}
      {videos.map((video, index) => (
        <div
          key={video.cloudinaryId}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-1000",
            index === activeIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          {video.directUrl ? (
            // Use direct video element for Pixabay URLs
            <video
              src={video.directUrl}
              muted
              loop
              autoPlay
              playsInline
              className="size-full object-cover"
              preload={index === 0 ? "auto" : "none"}
            />
          ) : (
            // Use OptimizedVideo for Cloudinary videos
            <OptimizedVideo
              cloudinaryId={video.cloudinaryId}
              src="" // We're using cloudinaryId instead
              muted
              loop
              autoPlay
              controls={false}
              objectFit="cover"
              className="size-full"
              lazy={index !== 0} // Only eager-load the first video
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Overlay text */}
      {overlayText && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {overlayText}
        </div>
      )}

      {/* Navigation controls */}
      {showControls && videos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
            aria-label="Previous video"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
            aria-label="Next video"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && videos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                "h-2 w-8 rounded-full transition-all",
                index === activeIndex
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
