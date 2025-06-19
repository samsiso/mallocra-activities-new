"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OptimizedVideoProps {
  src: string
  cloudinaryId?: string
  className?: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  width?: number
  height?: number
  lazy?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  onLoadStart?: () => void
  onLoadedData?: () => void
  onError?: (error: any) => void
}

/**
 * OptimizedVideo component
 * Renders an optimized video with lazy loading and poster image support
 */
export function OptimizedVideo({
  src,
  cloudinaryId,
  className,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  width,
  height,
  lazy = true,
  objectFit = "cover",
  onLoadStart,
  onLoadedData,
  onError
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !videoRef.current) return

    const options = {
      root: null,
      rootMargin: "200px", // Load when 200px from viewport
      threshold: 0.1
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(videoRef.current)

    return () => {
      observer.disconnect()
    }
  }, [lazy])

  // Format the video source URL
  const videoSrc = cloudinaryId
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${cloudinaryId}`
    : src

  // Video load handlers
  const handleLoadStart = () => {
    onLoadStart?.()
  }

  const handleLoadedData = () => {
    setIsLoaded(true)
    onLoadedData?.()
  }

  const handleError = (error: any) => {
    console.error("Video loading error:", error)
    onError?.(error)
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-gray-900", className)}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto"
      }}
    >
      <video
        ref={videoRef}
        className={cn(
          "size-full transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          {
            "object-cover": objectFit === "cover",
            "object-contain": objectFit === "contain",
            "object-fill": objectFit === "fill",
            "object-none": objectFit === "none",
            "object-scale-down": objectFit === "scale-down"
          }
        )}
        poster={poster}
        controls={controls}
        autoPlay={isVisible && autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload={lazy ? "none" : "auto"}
        width={width}
        height={height}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onError={handleError}
      >
        {isVisible && <source src={videoSrc} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="size-12 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />
        </div>
      )}
    </div>
  )
}
