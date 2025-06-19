"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, LucideIcon } from "lucide-react"
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

interface EnhancedCategoryCardProps {
  category: CategoryData
  index: number
}

export default function EnhancedCategoryCard({
  category,
  index
}: EnhancedCategoryCardProps) {
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
        scale: 1.03,
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
        <div
          className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-transparent shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:border-orange-400/30 hover:shadow-orange-500/20"
          style={{
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)"
          }}
        >
          {/* Enhanced Image Section */}
          <div className="relative h-72 overflow-hidden">
            <Image
              src={imageError ? fallbackImageUrl : category.imageUrl}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={index < 2}
            />

            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-500 ${
                isHovered ? "opacity-60" : "opacity-40"
              }`}
              style={{
                background: `linear-gradient(135deg, ${category.gradient.from}20, ${category.gradient.to}20)`
              }}
            />

            {/* Floating Icon */}
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{
                scale: 1.2,
                rotate: 10,
                transition: { duration: 0.3 }
              }}
              className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
            >
              <Icon className="size-6 text-white drop-shadow-lg" />
            </motion.div>

            {/* Activity Count Badge */}
            {category.activityCount && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="absolute right-6 top-6"
              >
                <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 font-bold text-black shadow-xl">
                  {category.activityCount} activities
                </Badge>
              </motion.div>
            )}

            {/* Bottom content overlay */}
            <div className="absolute inset-x-6 bottom-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.4 }}
              >
                <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg transition-colors duration-300 group-hover:text-yellow-400">
                  {category.title}
                </h3>
                <p className="text-sm text-white/90 drop-shadow-sm">
                  {category.shortDescription}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="relative p-6">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

            <div className="relative z-10">
              {/* Description */}
              <p className="mb-4 leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-200">
                {category.description}
              </p>

              {/* Features */}
              <div className="mb-6 space-y-2">
                {category.features.slice(0, 3).map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.15 + 0.5 + featureIndex * 0.1
                    }}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <div className="size-1.5 rounded-full bg-orange-400" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom row with price and CTA */}
              <div className="flex items-center justify-between">
                {category.averagePrice && (
                  <div className="text-left">
                    <div className="text-sm text-gray-500">From</div>
                    <div className="text-xl font-bold text-orange-400">
                      €{category.averagePrice}
                    </div>
                  </div>
                )}

                {/* Enhanced CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn border border-white/20 bg-white/5 text-white transition-all duration-300 hover:border-orange-400/50 hover:bg-orange-500/20 hover:text-white"
                  >
                    Explore
                    <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Subtle shine effect on hover */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{ x: "100%", opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
