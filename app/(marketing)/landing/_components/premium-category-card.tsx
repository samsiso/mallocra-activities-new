"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  ArrowRight,
  LucideIcon,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export interface CategoryData {
  id: string
  title: string
  description: string
  shortDescription: string
  slug: string
  icon: LucideIcon
  imageUrl: string
  gradient: {
    from: string
    to: string
  }
  activityCount?: number
  averagePrice?: number
  features: string[]
  href: string
}

interface PremiumCategoryCardProps {
  category: CategoryData
  index: number
}

export default function PremiumCategoryCard({
  category,
  index
}: PremiumCategoryCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const fallbackImageUrl = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop`

  const Icon = category.icon

  // Detect when card is leaving viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsExiting(true)
        } else if (entry.isIntersecting) {
          setIsExiting(false)
        }
      },
      { threshold: 0.1 }
    )

    const cardElement = document.getElementById(`category-card-${category.id}`)
    if (cardElement) {
      observer.observe(cardElement)
    }

    return () => {
      if (cardElement) {
        observer.unobserve(cardElement)
      }
    }
  }, [category.id])

  return (
    <motion.div
      id={`category-card-${category.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.15,
        delay: index * 0.025,
        ease: "easeOut"
      }}
      animate={{
        opacity: isExiting ? 0.3 : 1,
        scale: isExiting ? 0.95 : 1,
        rotateX: isExiting ? -5 : 0,
        y: isExiting ? -20 : 0
      }}
      whileHover={{
        y: -8,
        transition: {
          duration: 0.1,
          ease: "easeOut"
        }
      }}
      className="group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
    >
      <Link href={category.href}>
        <div className="duration-250 relative h-full overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_60px_rgba(236,72,153,0.25)]">
          {/* Enhanced Image Section with overlay */}
          <div className="relative h-64 overflow-hidden">
            {/* Blur placeholder */}
            <div
              className={`duration-350 absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 transition-opacity ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
            />

            <Image
              src={imageError ? fallbackImageUrl : category.imageUrl}
              alt={category.title}
              fill
              className={`duration-350 object-cover transition-all ${
                imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
              } group-hover:scale-110`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageLoaded(true)}
              priority={index < 2}
              loading={index < 2 ? "eager" : "lazy"}
            />

            {/* Beautiful gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Animated gradient on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.4 : 0 }}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${category.gradient.from}, ${category.gradient.to})`
              }}
            />

            {/* Top Elements - Clean, no badges */}
            <div className="absolute inset-x-6 top-6 flex items-start justify-between">
              {/* Premium Icon Only */}
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.15 }
                }}
                className="rounded-2xl bg-white p-3 shadow-xl"
              >
                <Icon className="size-7 text-gray-900" />
              </motion.div>
            </div>

            {/* Bottom Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.075 + 0.2 }}
              >
                <h3 className="mb-1.5 text-3xl font-bold text-white drop-shadow-lg">
                  {category.title}
                </h3>
                <p className="text-base text-white/90 drop-shadow-md">
                  {category.shortDescription}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Premium Content Section */}
          <div className="p-6">
            {/* Rating Stars */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.4 }}
              className="mb-4 flex items-center gap-2"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">4.8</span>
              <span className="text-sm text-gray-500">
                ({category.activityCount || 150} reviews)
              </span>
            </motion.div>

            {/* Quick Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.075 + 0.25 }}
                className="flex flex-col items-center rounded-lg bg-pink-50 p-3"
              >
                <Clock className="mb-1 size-5 text-pink-600" />
                <span className="text-xs font-medium text-gray-600">
                  Duration
                </span>
                <span className="text-sm font-bold text-gray-900">2-8 hrs</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.075 + 0.3 }}
                className="flex flex-col items-center rounded-lg bg-pink-50 p-3"
              >
                <Users className="mb-1 size-5 text-pink-600" />
                <span className="whitespace-nowrap text-xs font-medium text-gray-600">
                  Group Size
                </span>
                <span className="text-sm font-bold text-gray-900">2-15</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.075 + 0.35 }}
                className="flex flex-col items-center rounded-lg bg-pink-50 p-3"
              >
                <TrendingUp className="mb-1 size-5 text-pink-600" />
                <span className="text-xs font-medium text-gray-600">
                  Difficulty
                </span>
                <span className="text-sm font-bold text-gray-900">Easy</span>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-end justify-between border-t border-gray-100 pt-6">
              {/* Price */}
              {category.averagePrice && (
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Starting from
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      €{category.averagePrice}
                    </span>
                    <span className="text-sm text-gray-500">/person</span>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="group/btn rounded-full bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-150 hover:shadow-xl">
                  Explore
                  <ArrowRight className="ml-2 size-4 transition-transform duration-150 group-hover/btn:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Premium shine effect */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: isHovered ? "100%" : "-100%",
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
