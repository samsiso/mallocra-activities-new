"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, LucideIcon, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

  const fallbackImageUrl = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop`

  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{
        y: -12,
        transition: {
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1]
        }
      }}
      className="group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={category.href}>
        <div className="relative h-full overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(236,72,153,0.25)]">
          {/* Enhanced Image Section with overlay */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={imageError ? fallbackImageUrl : category.imageUrl}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={index < 2}
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

            {/* Top Elements */}
            <div className="absolute inset-x-6 top-6 flex items-start justify-between">
              {/* Premium Icon Badge */}
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                className="rounded-2xl bg-white p-3 shadow-xl"
              >
                <Icon className="size-7 text-gray-900" />
              </motion.div>

              {/* Activity Count */}
              {category.activityCount && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  <Badge className="rounded-full bg-white/95 px-4 py-1.5 font-bold text-gray-900 shadow-lg backdrop-blur-sm">
                    <Sparkles className="mr-1.5 size-3.5 text-pink-600" />
                    {category.activityCount} experiences
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Bottom Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.4 }}
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
            {/* Description */}
            <p className="mb-5 text-base leading-relaxed text-gray-700">
              {category.description}
            </p>

            {/* Features List */}
            <div className="mb-6 space-y-2.5">
              {category.features.slice(0, 3).map((feature, featureIndex) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.15 + 0.5 + featureIndex * 0.1
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-5 items-center justify-center rounded-full bg-pink-100">
                    <div className="size-2 rounded-full bg-pink-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </motion.div>
              ))}
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
                <Button className="group/btn rounded-full bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                  Explore
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
