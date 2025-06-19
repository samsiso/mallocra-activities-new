"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import Framer Motion components to reduce initial bundle
const MotionDiv = dynamic(
  () => import("framer-motion").then(mod => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div className="opacity-0">Loading...</div>
  }
)

const MotionSection = dynamic(
  () => import("framer-motion").then(mod => ({ default: mod.motion.section })),
  {
    ssr: false,
    loading: () => <section className="opacity-0">Loading...</section>
  }
)

// Dynamic useInView hook
const useInViewDynamic = dynamic(
  () => import("framer-motion").then(mod => ({ default: mod.useInView })),
  { ssr: false }
)

// Wrapper component for animated sections with fallback
interface DynamicAnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function DynamicAnimatedSection({
  children,
  className = "",
  delay = 0
}: DynamicAnimatedSectionProps) {
  return (
    <Suspense
      fallback={
        <div className={`transition-opacity duration-700 ${className}`}>
          {children}
        </div>
      }
    >
      <DynamicMotionContent className={className} delay={delay}>
        {children}
      </DynamicMotionContent>
    </Suspense>
  )
}

// The actual motion component that only loads when needed
function DynamicMotionContent({
  children,
  className,
  delay
}: DynamicAnimatedSectionProps) {
  // This will only be used client-side after dynamic import
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

// Dynamic activity card with motion
interface DynamicActivityCardProps {
  children: React.ReactNode
  className?: string
}

export function DynamicActivityCard({
  children,
  className = ""
}: DynamicActivityCardProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${className}`}
        >
          {children}
        </div>
      }
    >
      <DynamicActivityMotion className={className}>
        {children}
      </DynamicActivityMotion>
    </Suspense>
  )
}

function DynamicActivityMotion({
  children,
  className
}: DynamicActivityCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      viewport={{ once: true }}
      className={`group cursor-pointer ${className}`}
    >
      {children}
    </MotionDiv>
  )
}
