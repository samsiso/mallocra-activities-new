"use client"

import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  cloudinaryId?: string // Optional Cloudinary ID for better optimization
  fill?: boolean
  sizes?: string
  quality?: number
  loading?: "eager" | "lazy"
}

/**
 * OptimizedImage component
 * Renders an optimized image using either Cloudinary (preferred) or fallbacks to standard URLs
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  cloudinaryId,
  fill = false,
  sizes = "100vw",
  quality = 80,
  loading
}: OptimizedImageProps) {
  // If we have a Cloudinary ID, use the Cloudinary component for best optimization
  if (cloudinaryId) {
    return (
      <CldImage
        src={cloudinaryId}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        priority={priority}
        fill={fill}
        sizes={sizes}
        loading={loading}
      />
    )
  }

  // If we have a regular URL (could be Cloudinary or other source)
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      priority={priority}
      fill={fill}
      sizes={sizes}
      quality={quality}
      loading={loading}
    />
  )
}
