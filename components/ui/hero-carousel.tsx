"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroImage {
  src: string
  alt: string
  title: string
  subtitle: string
}

const heroImages: HeroImage[] = [
  {
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920&auto=format&fit=crop",
    alt: "Jet skiing in crystal clear waters",
    title: "Thrilling Water Sports",
    subtitle: "Experience the adrenaline rush of jet skiing in Palma Bay"
  },
  {
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1920&auto=format&fit=crop",
    alt: "Sailing at sunset",
    title: "Magical Sunset Sailing",
    subtitle: "Watch the sun set over the Mediterranean in luxury"
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    alt: "Mountain hiking adventure",
    title: "Mountain Exploration",
    subtitle: "Discover breathtaking views from Mallorca's peaks"
  },
  {
    src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
    alt: "Cultural site exploration",
    title: "Cultural Heritage",
    subtitle: "Explore centuries of Mediterranean history and culture"
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
    alt: "Happy customers enjoying activities",
    title: "Unforgettable Memories",
    subtitle: "Join thousands of happy adventurers"
  }
]

interface HeroCarouselProps {
  className?: string
  autoplay?: boolean
  interval?: number
}

export default function HeroCarousel({
  className,
  autoplay = true,
  interval = 5000
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === heroImages.length - 1 ? 0 : currentIndex + 1
    )
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-2xl",
        className
      )}
    >
      {/* Main Image Display */}
      <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              onLoad={() => index === 0 && setIsLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Image Content Overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="mb-2 text-xl font-bold drop-shadow-lg md:text-2xl">
                {image.title}
              </h3>
              <p className="text-sm drop-shadow-md md:text-base">
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-100">
            <div className="size-8 animate-spin rounded-full border-4 border-rose-400 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="size-10 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 md:size-12"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-5 md:size-6" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="size-10 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 md:size-12"
          aria-label="Next image"
        >
          <ChevronRight className="size-5 md:size-6" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4">
        {/* Slide Indicators */}
        <div className="flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "size-2 rounded-full transition-all duration-300 hover:scale-125 md:size-3",
                index === currentIndex
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayback}
          className="size-8 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="size-3" />
          ) : (
            <Play className="size-3" />
          )}
        </Button>
      </div>
    </div>
  )
}
