"use client"

import { useEffect, useRef, useState } from "react"

// Lightweight intersection observer hook
export function useInViewport(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
        ...options
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}

// Lightweight animated section component
interface LightAnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: "fade-up" | "fade-in" | "scale" | "slide-left" | "slide-right"
}

export function LightAnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-up"
}: LightAnimatedSectionProps) {
  const { ref, isInView } = useInViewport()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShouldAnimate(true), delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  const animationClasses = {
    "fade-up": `transition-all duration-700 ease-out ${
      shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
    "fade-in": `transition-opacity duration-700 ease-out ${
      shouldAnimate ? "opacity-100" : "opacity-0"
    }`,
    scale: `transition-all duration-700 ease-out ${
      shouldAnimate ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`,
    "slide-left": `transition-all duration-700 ease-out ${
      shouldAnimate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
    }`,
    "slide-right": `transition-all duration-700 ease-out ${
      shouldAnimate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
    }`
  }

  return (
    <div ref={ref} className={`${animationClasses[animation]} ${className}`}>
      {children}
    </div>
  )
}

// Lightweight hover animations using CSS
export function LightHoverCard({
  children,
  className = "",
  hoverEffect = "lift"
}: {
  children: React.ReactNode
  className?: string
  hoverEffect?: "lift" | "scale" | "glow" | "none"
}) {
  const hoverClasses = {
    lift: "transition-transform duration-300 hover:-translate-y-2",
    scale: "transition-transform duration-300 hover:scale-105",
    glow: "transition-shadow duration-300 hover:shadow-2xl hover:shadow-orange-500/20",
    none: ""
  }

  return (
    <div className={`${hoverClasses[hoverEffect]} ${className}`}>
      {children}
    </div>
  )
}

// Combined hover and view animations
export function LightActivityCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isInView } = useInViewport()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true)
    }
  }, [isInView])

  return (
    <div
      ref={ref}
      className={`
        group cursor-pointer
        transition-all duration-700 ease-out
        ${
          shouldAnimate
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-12 scale-95 opacity-0"
        }
        hover:-translate-y-3 hover:scale-105
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// CSS-based scroll animations
export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = "2rem"
}: {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  distance?: string
}) {
  const { ref, isInView } = useInViewport()

  const directionMap = {
    up: `translateY(${distance})`,
    down: `translateY(-${distance})`,
    left: `translateX(${distance})`,
    right: `translateX(-${distance})`
  }

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "translate(0)" : directionMap[direction],
        opacity: isInView ? 1 : 0,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      className={className}
    >
      {children}
    </div>
  )
}
