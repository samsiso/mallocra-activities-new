"use client"

import Link from "next/link"
import {
  Waves,
  Mountain,
  Camera,
  MapPin,
  Utensils,
  Building,
  ArrowRight
} from "lucide-react"

const tourismCategories = [
  {
    id: "beaches-coast",
    title: "Beaches & Coast",
    description: "Discover pristine beaches and hidden coves",
    icon: Waves,
    color: "from-blue-500 to-cyan-400",
    href: "/blog/tag/beaches"
  },
  {
    id: "outdoor-adventures",
    title: "Outdoor Adventures",
    description: "Hiking, cycling, and nature experiences",
    icon: Mountain,
    color: "from-green-500 to-emerald-400",
    href: "/blog/tag/adventure"
  },
  {
    id: "cultural-heritage",
    title: "Culture & Heritage",
    description: "Historic sites, museums, and traditions",
    icon: Building,
    color: "from-purple-500 to-violet-400",
    href: "/blog/tag/culture"
  },
  {
    id: "local-experiences",
    title: "Local Experiences",
    description: "Authentic Mallorcan lifestyle and events",
    icon: Camera,
    color: "from-rose-500 to-pink-400",
    href: "/blog/tag/local"
  },
  {
    id: "gastronomy",
    title: "Food & Dining",
    description: "Traditional cuisine and best restaurants",
    icon: Utensils,
    color: "from-orange-500 to-amber-400",
    href: "/blog/tag/food"
  },
  {
    id: "hidden-gems",
    title: "Hidden Gems",
    description: "Secret spots locals love to visit",
    icon: MapPin,
    color: "from-indigo-500 to-blue-400",
    href: "/blog/tag/hidden-gems"
  }
]

export default function TourismCategoriesSection() {
  return (
    <section className="my-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">Explore Mallorca</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          From stunning beaches to hidden mountain villages, discover what makes
          Mallorca special through our travel guides
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tourismCategories.map(category => {
          const IconComponent = category.icon
          return (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              <div className="relative z-10">
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${category.color} p-3`}
                >
                  <IconComponent className="size-6 text-white" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">
                  {category.title}
                </h3>

                <p className="mb-4 text-gray-300">{category.description}</p>

                <div className="flex items-center text-sm font-medium text-rose-400 group-hover:text-rose-300">
                  Explore guides
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 transition-opacity group-hover:opacity-10`}
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
