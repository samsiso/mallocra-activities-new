/*
<ai_context>
BackgroundSlider component extracted from landing page.
Provides automatic image slideshow with smooth transitions for hero backgrounds.
</ai_context>
*/

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface BackgroundSliderProps {
  images: Array<{
    url: string
    alt: string
  }>
  interval?: number
}

export function BackgroundSlider({
  images,
  interval = 5000
}: BackgroundSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="absolute inset-0 size-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}
