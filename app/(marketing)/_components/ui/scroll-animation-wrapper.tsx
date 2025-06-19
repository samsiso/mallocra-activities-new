/*
<ai_context>
ScrollAnimationWrapper component extracted from landing page.
Provides scroll-triggered animations for any child components.
Uses Intersection Observer for performance optimization.
</ai_context>
*/

"use client"

import { useState, useEffect, useRef } from "react"

interface ScrollAnimationWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollAnimationWrapper({
  children,
  className = "",
  delay = 0
}: ScrollAnimationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}
