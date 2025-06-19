"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { heroVideos, FALLBACK_VIDEOS } from "../_data/hero-videos"
import { getVideoUrl } from "@/lib/video-protection"

export default function HeroVideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [loadedVideos, setLoadedVideos] = useState(heroVideos)
  const [videoLoadStates, setVideoLoadStates] = useState<boolean[]>(
    new Array(heroVideos.length).fill(false)
  )

  // Auto-advance video every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % loadedVideos.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [loadedVideos.length])

  const nextVideo = () => {
    setCurrentVideoIndex(prev => (prev + 1) % loadedVideos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex(
      prev => (prev - 1 + loadedVideos.length) % loadedVideos.length
    )
  }

  return (
    <div className="absolute inset-0">
      {/* Background Video/Image Slideshow - Performance Optimized */}
      <div className="absolute inset-0">
        {loadedVideos.map((media, index) => {
          // Only render current video and adjacent ones for performance
          const shouldRender =
            index === currentVideoIndex ||
            index === (currentVideoIndex + 1) % loadedVideos.length ||
            index ===
              (currentVideoIndex - 1 + loadedVideos.length) %
                loadedVideos.length

          if (!shouldRender) return null

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentVideoIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {media.type === "video" ? (
                <video
                  src={
                    media.cloudinaryId
                      ? getVideoUrl(media.cloudinaryId, media.fallbackSrc)
                      : media.src
                  }
                  poster={media.poster}
                  autoPlay={index === currentVideoIndex}
                  muted
                  loop
                  playsInline
                  className="size-full object-cover"
                  preload={index === currentVideoIndex ? "auto" : "none"}
                  onError={e => {
                    console.error(
                      "🚨 Video failed to load:",
                      e.currentTarget.src
                    )
                    console.log("🔄 Attempting fallback video...")
                    // Automatically try fallback video
                    if (
                      media.fallbackSrc &&
                      e.currentTarget.src !== media.fallbackSrc
                    ) {
                      e.currentTarget.src = media.fallbackSrc
                    }
                  }}
                  onLoadStart={() => {
                    console.log(
                      "✅ Video loading:",
                      media.cloudinaryId || "fallback"
                    )
                    setVideoLoadStates(prev => {
                      const newStates = [...prev]
                      newStates[index] = true
                      return newStates
                    })
                  }}
                  onCanPlay={() => {
                    console.log(
                      "🎬 Video ready to play:",
                      media.cloudinaryId || "fallback"
                    )
                  }}
                />
              ) : (
                // Optimized image with lazy loading
                <Image
                  src={media.src}
                  alt={media.alt || "Hero image"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-orange-900/70"></div>

        {/* Video Loading Indicator */}
        {!videoLoadStates[currentVideoIndex] && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/50">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-white">
                <div className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                <span className="text-sm font-medium">
                  Loading experience...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slideshow Controls */}
      <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between sm:inset-x-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevVideo}
          className="size-12 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:size-10"
          aria-label="Previous video"
          aria-describedby="video-carousel-help"
        >
          <ChevronLeft className="size-5 sm:size-4" />
          <span className="sr-only">Go to previous video in carousel</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextVideo}
          className="size-12 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:size-10"
          aria-label="Next video"
          aria-describedby="video-carousel-help"
        >
          <ChevronRight className="size-5 sm:size-4" />
          <span className="sr-only">Go to next video in carousel</span>
        </Button>
      </div>

      {/* Slideshow Indicators */}
      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-2"
        role="tablist"
        aria-label="Video carousel indicators"
      >
        {loadedVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`h-3 w-8 touch-manipulation rounded-full transition-colors focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:h-2 ${
              index === currentVideoIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to video ${index + 1} of ${loadedVideos.length}`}
            aria-selected={index === currentVideoIndex}
            role="tab"
            tabIndex={index === currentVideoIndex ? 0 : -1}
          />
        ))}
      </div>

      {/* Screen reader helper text */}
      <div id="video-carousel-help" className="sr-only">
        Use arrow keys to navigate between videos, or click the indicators below
        the video
      </div>
    </div>
  )
}
