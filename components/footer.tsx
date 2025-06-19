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
    <footer className="relative bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative">
        {/* Main Footer Content */}
        <div className="border-t border-white/10 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500">
                    <Sparkles className="size-4 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Mallorca Activities
                  </h3>
                </div>
                <p className="leading-relaxed text-white/80">
                  Discover the best experiences Mallorca has to offer. From
                  cultural tours to thrilling adventures, we've got your perfect
                  holiday covered.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-white/70">
                    <MapPin className="mr-3 size-4 text-yellow-400" />
                    <span>Palma de Mallorca, Spain</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Phone className="mr-3 size-4 text-yellow-400" />
                    <span>+34 971 123 456</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Mail className="mr-3 size-4 text-yellow-400" />
                    <span>info@mallorca-activities.com</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      All Activities
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bookings"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Wishlist
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Activity Categories */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Activity Categories
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/activities?category=water_sports"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Water Sports
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=land_adventures"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Land Adventures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=cultural"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Cultural Tours
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=food_wine"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Food & Wine
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=nightlife"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Nightlife
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities?category=day_trips"
                      className="text-white/70 transition duration-300 hover:pl-2 hover:text-yellow-400"
                    >
                      Day Trips
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter & Social */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Stay Connected</h3>

                {/* Social Media */}
                <div className="space-y-4">
                  <p className="text-white/70">Follow us for updates</p>
                  <div className="flex space-x-3">
                    <Button
                      size="icon"
                      className="border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <Facebook className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <Twitter className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <Instagram className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="space-y-3">
                  <p className="text-white/70">Get exclusive deals</p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 rounded-l-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <Button className="rounded-l-none bg-gradient-to-r from-yellow-400 to-amber-500 font-medium text-black hover:from-yellow-500 hover:to-amber-600">
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
                    Trusted by 10k+ travelers
                  </Badge>
                  <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-400">
                    24/7 Support
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2 text-white/60">
                <span>© {currentYear} Mallorca Activities. Made with</span>
                <Heart className="size-4 fill-red-400 text-red-400" />
                <span>in Mallorca</span>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link
                  href="/privacy"
                  className="text-sm text-white/60 transition-colors hover:text-yellow-400"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-white/60 transition-colors hover:text-yellow-400"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-sm text-white/60 transition-colors hover:text-yellow-400"
                >
                  Cookie Policy
                </Link>
                <Link
                  href="/help"
                  className="text-sm text-white/60 transition-colors hover:text-yellow-400"
                >
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
