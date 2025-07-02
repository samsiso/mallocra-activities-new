"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Heart,
  Sparkles
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-pink-700 via-pink-600 to-pink-500">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative">
        {/* Main Footer Content - Mobile Optimized */}
        <div className="border-t border-white/20 py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Company Info - Mobile First */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg">
                    <Sparkles className="size-4 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Mallorca Activities
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                  Discover the best experiences Mallorca has to offer. From
                  cultural tours to thrilling adventures, we've got your perfect
                  holiday covered.
                </p>
                <div className="space-y-3">
                  <a
                    href="https://maps.google.com"
                    className="flex items-center text-sm text-white/80 transition-colors hover:text-yellow-400 sm:text-base"
                  >
                    <MapPin className="mr-3 size-4 shrink-0 text-yellow-400" />
                    <span>Palma de Mallorca, Spain</span>
                  </a>
                  <a
                    href="tel:+34971123456"
                    className="flex items-center text-sm text-white/80 transition-colors hover:text-yellow-400 sm:text-base"
                  >
                    <Phone className="mr-3 size-4 shrink-0 text-yellow-400" />
                    <span>+34 971 123 456</span>
                  </a>
                  <a
                    href="mailto:info@mallorca-activities.com"
                    className="flex items-center text-sm text-white/80 transition-colors hover:text-yellow-400 sm:text-base"
                  >
                    <Mail className="mr-3 size-4 shrink-0 text-yellow-400" />
                    <span className="break-all">
                      info@mallorca-activities.com
                    </span>
                  </a>
                </div>
              </div>

              {/* Quick Links - Mobile Optimized */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Quick Links
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      All Activities
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bookings"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Wishlist
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Activity Categories - Mobile Optimized */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Categories
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/activities?category=water_sports"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Water Sports
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=land_adventures"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Land Adventures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=cultural"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Cultural Tours
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=food_wine"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Food & Wine
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=nightlife"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Nightlife
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=day_trips"
                      className="inline-block py-1 text-sm text-white/80 transition duration-300 hover:pl-2 hover:text-yellow-400 sm:text-base"
                    >
                      Day Trips
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter & Social - Mobile Optimized */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Stay Connected
                </h3>

                {/* Social Media - Touch Friendly */}
                <div className="space-y-3">
                  <p className="text-sm text-white/80 sm:text-base">
                    Follow us for updates
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:size-11"
                    >
                      <Facebook className="size-5" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:size-11"
                    >
                      <Twitter className="size-5" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:size-11"
                    >
                      <Instagram className="size-5" />
                    </a>
                  </div>
                </div>

                {/* Newsletter - Mobile Optimized */}
                <div className="space-y-3">
                  <p className="text-sm text-white/80 sm:text-base">
                    Get exclusive deals
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 sm:rounded-r-none sm:py-2 sm:text-base"
                    />
                    <Button className="w-full rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 py-3 font-medium text-black hover:from-yellow-500 hover:to-amber-600 sm:w-auto sm:rounded-l-none sm:py-2">
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Trust Badges - Mobile Friendly */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className="border-green-500/30 bg-green-500/20 text-xs text-green-400 sm:text-sm">
                    10k+ travelers
                  </Badge>
                  <Badge className="border-blue-500/30 bg-blue-500/20 text-xs text-blue-400 sm:text-sm">
                    24/7 Support
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile Centered */}
        <div className="border-t border-white/20 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-2 text-sm text-white/70 sm:text-base">
                <span>© {currentYear} Mallorca Activities</span>
                <Heart className="size-4 fill-pink-300 text-pink-300" />
                <span>Mallorca</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs sm:gap-6 sm:text-sm">
                <Link
                  href="/privacy"
                  className="text-white/70 transition-colors hover:text-yellow-400"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-white/70 transition-colors hover:text-yellow-400"
                >
                  Terms
                </Link>
                <Link
                  href="/cookies"
                  className="text-white/70 transition-colors hover:text-yellow-400"
                >
                  Cookies
                </Link>
                <Link
                  href="/help"
                  className="text-white/70 transition-colors hover:text-yellow-400"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
