"use server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Search, Sparkles } from "lucide-react"

export default async function HeroSectionServer() {
  return (
    <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Main Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-8 inline-flex border border-white/20 bg-white/10 px-6 py-3 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg transition-all duration-300 hover:bg-white/15 hover:shadow-yellow-400/20">
              <Sparkles className="mr-3 size-5 text-yellow-400 drop-shadow-lg" />
              <span className="font-semibold drop-shadow-sm">
                #1 Activity Platform in Mallorca
              </span>
            </Badge>

            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              <span className="font-black tracking-wide text-black drop-shadow-lg">
                Discover
              </span>{" "}
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
                Mallorca's
              </span>{" "}
              <br />
              <span className="text-white drop-shadow-md">Best Activities</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/95 drop-shadow-sm sm:text-xl lg:mx-0">
              From thrilling water sports to cultural experiences. Book
              authentic local activities with instant confirmation.
            </p>

            {/* Stats */}
            <div className="mb-10 flex flex-wrap justify-center gap-3 text-sm text-white/95 sm:gap-8 sm:text-base lg:justify-start">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="size-5 text-green-400" />
                <span className="font-medium">500+ Activities</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="size-5 text-green-400" />
                <span className="font-medium">50k+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="size-5 text-green-400" />
                <span className="font-medium">4.8★ Average Rating</span>
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="space-y-6">
              {/* Primary CTA */}
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/50"
                >
                  Explore Activities
                  <ArrowRight className="ml-2 size-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
                >
                  Watch Video
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-lg">
                  <Input
                    placeholder="Search activities... (e.g., sailing, hiking, cathedral)"
                    className="border-0 bg-transparent px-6 py-4 pr-14 text-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-orange-400"
                  />
                  <Button
                    size="icon"
                    className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Search className="size-5" />
                  </Button>
                </div>
                <p className="mt-2 text-center text-sm text-white/70 lg:text-left">
                  Try: "sailing", "cathedral", "mountain adventure"
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Feature highlights */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-xl font-bold text-white">
                  🏆 Top Rated Activities
                </h3>
                <p className="text-white/80">
                  Curated experiences with 4.8+ star ratings from thousands of
                  travelers
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-xl font-bold text-white">
                  ⚡ Instant Confirmation
                </h3>
                <p className="text-white/80">
                  Book now, experience later. Most activities confirmed
                  instantly
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-xl font-bold text-white">
                  🎯 Local Experts
                </h3>
                <p className="text-white/80">
                  Authentic experiences led by passionate local guides
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
