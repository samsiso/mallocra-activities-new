"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarDays, MapPin, Clock, Star, Users, Award } from "lucide-react"
import {
  Activity,
  Sparkles,
  ArrowRight,
  Phone,
  Shield,
  CheckCircle,
  Heart,
  Zap,
  Mail,
  Gift,
  Calendar as CalendarIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="relative">
      <main className="relative z-0">
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
              alt="Beautiful Mallorca coastline"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/40 to-orange-900/60"></div>
          </div>

          <div className="relative z-10 flex min-h-screen items-center">
            <div className="mx-auto max-w-7xl px-6 py-20">
              <div className="text-center">
                <Badge className="mb-8 border border-white/30 bg-white/20 px-6 py-3 text-white backdrop-blur-sm">
                  <Sparkles className="mr-2 size-4" />
                  #1 Rated Activity Platform in Mallorca
                </Badge>

                <h1 className="mb-8 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  <span className="text-white">Discover</span> <br />
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Amazing
                  </span>{" "}
                  <br />
                  <span className="text-white">Experiences</span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/90">
                  Unlock the magic of Mallorca with our curated selection of
                  unforgettable activities. From crystal-clear waters to
                  historic landmarks, your perfect adventure awaits.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="border-0 bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-2xl"
                  >
                    <Activity className="mr-2 size-5" />
                    Browse Activities
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 bg-white/10 px-8 py-4 text-lg text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                  >
                    <Phone className="mr-2 size-5" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white">
              <Shield className="mr-2 size-4" />
              Trusted & Recognized
            </Badge>
            <h2 className="mb-8 text-4xl font-bold text-gray-900">
              Your Safety & Satisfaction is Our Priority
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Recognized by leading travel organizations and trusted by
              thousands of travelers worldwide
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <Badge className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white">
              <Gift className="mr-2 size-4" />
              Exclusive Offers
            </Badge>

            <h2 className="mb-8 text-4xl font-bold text-gray-900">
              Get 15% Off Your First Adventure
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Join our newsletter and be the first to discover new activities,
              exclusive deals, and insider tips for your Mallorca experience.
            </p>

            <div className="mx-auto max-w-md rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-center text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
                />

                <Button className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-700">
                  <Gift className="mr-2 size-5" />
                  Claim 15% Discount
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-br from-rose-600 via-purple-600 to-blue-600 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <Badge className="mb-8 bg-white/20 px-6 py-2 text-white backdrop-blur-sm">
              Ready for Your Adventure?
            </Badge>
            <h2 className="mb-8 text-5xl font-bold text-white md:text-6xl">
              Start Your Mallorca Journey Today
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-xl text-white/90">
              Join thousands of satisfied travelers who have discovered the
              magic of Mallorca with us. Book now and create memories that will
              last a lifetime.
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link href="/activities">
                <Button
                  size="lg"
                  className="bg-white px-12 py-6 text-xl font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-gray-100"
                >
                  <Sparkles className="mr-2 size-6" />
                  Book Your Adventure
                  <ArrowRight className="ml-2 size-6" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white px-12 py-6 text-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
