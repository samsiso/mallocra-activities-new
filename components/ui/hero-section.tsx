"use client"

/*
<ai_context>
Enhanced hero section with video background and improved mobile optimization.
Features a stunning Mallorca beach video background with professional rose theme.
Implements mobile-first design with responsive layouts and video accessibility.
Simple, reliable video implementation that works across all browsers.
</ai_context>
*/

import { cn } from "@/lib/utils"
import { Search, Star, Users, Award, Zap, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface HeroSectionProps {
  className?: string
}

interface CategoryCardProps {
  title: string
  description: string
  icon: string
  count: number
  href: string
}

function CategoryCard({
  title,
  description,
  icon,
  count,
  href
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400 bg-white p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:bg-rose-50 hover:shadow-2xl hover:shadow-rose-400/30">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl drop-shadow-lg">{icon}</span>
          <div>
            <h3 className="font-bold text-gray-900 drop-shadow-md transition-colors group-hover:text-rose-600">
              {title}
            </h3>
            <Badge
              variant="outline"
              className="border-yellow-400 bg-yellow-100 text-xs text-yellow-800"
            >
              {count} activities
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 group-hover:text-gray-700">
          {description}
        </p>
      </div>
    </Link>
  )
}

function SearchForm() {
  return (
    <form className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search activities, locations, or experiences..."
          className="h-14 rounded-full border-2 border-yellow-400 bg-white pl-12 pr-4 text-base shadow-lg transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 md:h-16 md:pl-14 md:text-lg"
        />
      </div>
      <Button
        type="submit"
        className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-rose-600 px-6 font-semibold text-white transition-all hover:scale-105 hover:bg-rose-700 md:h-12 md:px-8"
      >
        Search
      </Button>
    </form>
  )
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-rose-100", className)}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="size-full object-cover"
          poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop"
          onLoadedData={() => console.log("Video loaded successfully")}
          onError={e => console.error("Video failed to load:", e)}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-turquoise-sea-44378-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://player.vimeo.com/external/396879338.hd.mp4?s=2dd53044e6e34f0bb5c69e84e3d3414ffbc31e1c"
            type="video/mp4"
          />
          <source
            src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Enhanced Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left side - Enhanced Image Carousel */}
            <div className="relative order-2 lg:order-1">
              <div className="relative h-96 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-rose-400/30">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
                  alt="Crystal Clear Waters of Mallorca"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">
                    Crystal Clear Waters
                  </h3>
                  <p className="text-lg opacity-90">
                    Experience Mallorca's pristine beaches
                  </p>
                </div>
              </div>

              {/* Trust Indicators Below Image */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-white p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    4.9/5 Rating
                  </p>
                  <p className="text-xs text-gray-600">2,400+ Reviews</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-lg backdrop-blur-sm">
                  <Users className="mx-auto size-6 text-rose-600" />
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    50,000+
                  </p>
                  <p className="text-xs text-gray-600">Happy Customers</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-lg backdrop-blur-sm">
                  <Award className="mx-auto size-6 text-yellow-500" />
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    Award Winner
                  </p>
                  <p className="text-xs text-gray-600">Top Rated 2024</p>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Content with backdrop */}
            <div className="order-1 flex flex-col justify-center lg:order-2">
              <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
                {/* Trust Badge */}
                <Badge className="mb-6 w-fit border-none bg-yellow-400 px-4 py-2 font-bold text-black shadow-xl shadow-yellow-400/50">
                  🏆 #1 Rated Activity Platform in Mallorca
                </Badge>

                {/* Enhanced Headlines */}
                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 drop-shadow-lg md:text-5xl lg:text-6xl">
                  Discover
                  <span className="block text-rose-600">Amazing</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Experiences
                  </span>
                </h1>

                <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
                  From thrilling water sports to peaceful cultural tours,
                  discover the best of Mallorca with{" "}
                  <span className="font-semibold text-rose-600">
                    We Are Excursions
                  </span>
                  . Book instantly with local experts and create unforgettable
                  memories.
                </p>

                {/* Key Benefits */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="size-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Instant Booking
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-rose-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Local Experts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Best Price Guarantee
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-rose-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Small Groups
                    </span>
                  </div>
                </div>

                {/* Enhanced Search Form */}
                <div className="mb-8">
                  <SearchForm />
                </div>

                {/* Popular Categories */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Popular Categories
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CategoryCard
                      title="Water Sports"
                      description="Jet skis, sailing, diving & more"
                      icon="🌊"
                      count={24}
                      href="/activities?category=water-sports"
                    />
                    <CategoryCard
                      title="Cultural Tours"
                      description="History, art & local experiences"
                      icon="🏛️"
                      count={18}
                      href="/activities?category=cultural"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
