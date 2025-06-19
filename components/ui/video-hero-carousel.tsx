"use client"

/*
<ai_context>
Video-enhanced hero carousel for We Are Excursions landing page.
Integrates stunning Mallorca videos with existing image carousel.
Features performance optimization, accessibility controls, and mobile-first responsive design.
Implements hybrid approach: videos + images with seamless navigation.
</ai_context>
*/

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw
} from "lucide-react"

interface VideoSlide {
  type: "video"
  id: string
  title: string
  description: string
  videoUrl: string
  posterUrl: string
  webmUrl?: string
  mp4Url?: string
}

interface ImageSlide {
  type: "image"
  id: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
}

type CarouselSlide = VideoSlide | ImageSlide

interface VideoHeroCarouselProps {
  className?: string
}

const carouselSlides: CarouselSlide[] = [
  {
    type: "video",
    id: "mallorca-beaches",
    title: "Crystal Clear Waters",
    description: "Experience Mallorca's pristine beaches and turquoise waters",
    videoUrl:
      "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
    posterUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
    mp4Url:
      "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf"
  },
  {
    type: "video",
    id: "sailing-sunset",
    title: "Sunset Sailing Magic",
    description:
      "Magical sailing experiences as the sun sets over the Mediterranean",
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1920&auto=format&fit=crop",
    mp4Url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  },
  {
    type: "image",
    id: "jet-skiing",
    title: "Thrilling Water Sports",
    description: "High-speed adventures across the Mediterranean",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Jet skiing in Mallorca waters"
  },
  {
    type: "image",
    id: "sunset-sailing",
    title: "Magical Sunset Sailing",
    description: "Unforgettable evenings on the Mediterranean",
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Sunset sailing in Mallorca"
  },
  {
    type: "image",
    id: "mountain-hiking",
    title: "Mountain Adventures",
    description: "Explore breathtaking trails and stunning vistas",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Mountain hiking in Mallorca"
  },
  {
    type: "image",
    id: "cultural-sites",
    title: "Rich Cultural Heritage",
    description: "Discover centuries of Mediterranean history",
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Historic Palma Cathedral in Mallorca"
  }
]

export default function VideoHeroCarousel({
  className
}: VideoHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % carouselSlides.length)
      }, 6000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  // Handle video play/pause when slide changes
  useEffect(() => {
    const currentSlideData = carouselSlides[currentSlide]
    if (currentSlideData.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay failed, handle gracefully
          setIsPlaying(false)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [currentSlide, isPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    const newIndex =
      currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentSlide + 1) % carouselSlides.length
    goToSlide(newIndex)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    setIsAutoPlaying(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const currentSlideData = carouselSlides[currentSlide]

  return (
    <div
      className={cn("group relative overflow-hidden rounded-2xl", className)}
    >
      {/* Main Carousel Container */}
      <div className="relative aspect-[16/9] h-[300px] md:h-[400px] lg:h-[500px]">
        {/* Current Slide Content */}
        {currentSlideData.type === "video" ? (
          <div className="relative size-full">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="size-full object-cover"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster={currentSlideData.posterUrl}
              onLoadedData={handleVideoLoad}
              onError={() => setVideoLoaded(false)}
            >
              {currentSlideData.webmUrl && (
                <source src={currentSlideData.webmUrl} type="video/webm" />
              )}
              {currentSlideData.mp4Url && (
                <source src={currentSlideData.mp4Url} type="video/mp4" />
              )}
              <source src={currentSlideData.videoUrl} type="video/mp4" />
              {/* Fallback image if video fails */}
              <Image
                src={currentSlideData.posterUrl}
                alt={currentSlideData.title}
                fill
                className="object-cover"
                priority
              />
            </video>

            {/* Video Loading Overlay */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="size-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="text-sm">Loading video...</span>
                </div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="size-10 rounded-full bg-white/90 p-0 backdrop-blur-sm hover:bg-white"
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="size-4 text-gray-800" />
                ) : (
                  <Play className="size-4 text-gray-800" />
                )}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="size-10 rounded-full bg-white/90 p-0 backdrop-blur-sm hover:bg-white"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="size-4 text-gray-800" />
                ) : (
                  <Volume2 className="size-4 text-gray-800" />
                )}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="size-10 rounded-full bg-white/90 p-0 backdrop-blur-sm hover:bg-white"
                onClick={restartVideo}
                aria-label="Restart video"
              >
                <RotateCcw className="size-4 text-gray-800" />
              </Button>
            </div>
          </div>
        ) : (
          <Image
            src={currentSlideData.imageUrl}
            alt={currentSlideData.imageAlt}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority={currentSlide === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Slide Content */}
        <div className="absolute bottom-6 left-6 text-white">
          <Badge className="mb-3 border-none bg-yellow-400 px-3 py-1 font-bold text-black shadow-lg">
            {currentSlideData.type === "video"
              ? "🎬 Featured Video"
              : "📸 Experience"}
          </Badge>
          <h3 className="mb-2 text-2xl font-bold drop-shadow-lg md:text-3xl lg:text-4xl">
            {currentSlideData.title}
          </h3>
          <p className="max-w-md text-sm drop-shadow-md md:text-base">
            {currentSlideData.description}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button
          size="sm"
          variant="secondary"
          className="size-12 rounded-full bg-white/90 p-0 opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5 text-gray-800" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button
          size="sm"
          variant="secondary"
          className="size-12 rounded-full bg-white/90 p-0 opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight className="size-5 text-gray-800" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-8 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-yellow-400 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      {isAutoPlaying && (
        <div className="absolute right-4 top-4">
          <Badge className="border-none bg-white/90 text-xs text-gray-800 backdrop-blur-sm">
            Auto-playing
          </Badge>
        </div>
      )}
    </div>
  )
}
