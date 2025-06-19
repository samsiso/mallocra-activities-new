"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Shield,
  Award,
  CheckCircle
} from "lucide-react"

export default function PreferredFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-500/10"></div>
        <div className="absolute left-1/4 top-0 size-96 rounded-full bg-yellow-400/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              {/* Company Branding */}
              <div className="lg:col-span-1">
                <div className="mb-8 flex items-center space-x-3">
                  <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 p-3 shadow-lg shadow-yellow-400/20">
                    <MapPin className="size-7 font-bold text-black" />
                  </div>
                  <div className="text-xl font-bold">
                    <span className="text-white">WE</span>
                    <span className="text-yellow-400"> ARE </span>
                    <span className="text-white">EXCURSIONS</span>
                  </div>
                </div>

                <p className="mb-8 leading-relaxed text-gray-300">
                  Your gateway to authentic Mallorca experiences. Discover the
                  island's hidden gems with our carefully curated activities and
                  expert local guides.
                </p>

                {/* Social Media Links */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-yellow-400">
                    Follow Our Adventures
                  </h4>
                  <div className="flex space-x-4">
                    {[
                      {
                        name: "Facebook",
                        icon: Facebook,
                        href: "#",
                        color: "hover:bg-blue-600"
                      },
                      {
                        name: "Instagram",
                        icon: Instagram,
                        href: "#",
                        color:
                          "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500"
                      },
                      {
                        name: "Twitter",
                        icon: Twitter,
                        href: "#",
                        color: "hover:bg-sky-500"
                      },
                      {
                        name: "YouTube",
                        icon: Youtube,
                        href: "#",
                        color: "hover:bg-red-600"
                      },
                      {
                        name: "TikTok",
                        icon: Music,
                        href: "#",
                        color: "hover:bg-black"
                      }
                    ].map(social => (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`group flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                        aria-label={`Follow us on ${social.name}`}
                      >
                        <social.icon className="size-5 text-white transition-transform duration-300 group-hover:scale-110" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities Navigation */}
              <div>
                <h4 className="mb-8 text-lg font-bold text-yellow-400">
                  Activities
                </h4>
                <ul className="space-y-4">
                  {[
                    { label: "All Activities", href: "/activities" },
                    {
                      label: "Water Sports",
                      href: "/activities?category=water_sports"
                    },
                    {
                      label: "Land Adventures",
                      href: "/activities?category=land_adventures"
                    },
                    {
                      label: "Cultural Tours",
                      href: "/activities?category=cultural"
                    },
                    {
                      label: "Nightlife",
                      href: "/activities?category=nightlife"
                    },
                    {
                      label: "Featured Activities",
                      href: "/activities?featured=true"
                    },
                    {
                      label: "Family Friendly",
                      href: "/activities?family=true"
                    }
                  ].map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-gray-300 transition-all duration-200 hover:translate-x-2 hover:text-yellow-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Navigation */}
              <div>
                <h4 className="mb-8 text-lg font-bold text-yellow-400">
                  Company
                </h4>
                <ul className="space-y-4">
                  {[
                    { label: "About Us", href: "/about" },
                    { label: "Contact", href: "/contact" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "My Bookings", href: "/bookings" },
                    { label: "Wishlist", href: "/wishlist" },
                    { label: "Gift Cards", href: "/gift-cards" },
                    { label: "Careers", href: "/careers" }
                  ].map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-gray-300 transition-all duration-200 hover:translate-x-2 hover:text-yellow-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Support */}
              <div>
                <h4 className="mb-8 text-lg font-bold text-yellow-400">
                  Contact & Support
                </h4>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-yellow-400/10 p-2">
                      <MapPin className="size-5 text-yellow-400" />
                    </div>
                    <div className="text-gray-300">
                      <p className="font-semibold text-white">
                        Palma de Mallorca
                      </p>
                      <p className="text-sm">Balearic Islands, Spain</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-yellow-400/10 p-2">
                      <span className="text-yellow-400">📞</span>
                    </div>
                    <a
                      href="tel:+34971123456"
                      className="font-medium text-gray-300 transition-colors hover:text-yellow-400"
                    >
                      +34 971 123 456
                    </a>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-yellow-400/10 p-2">
                      <span className="text-yellow-400">✉️</span>
                    </div>
                    <a
                      href="mailto:hello@weareexcursions.com"
                      className="font-medium text-gray-300 transition-colors hover:text-yellow-400"
                    >
                      hello@weareexcursions.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              {/* Copyright */}
              <div className="text-center text-gray-400 md:text-left">
                <p>
                  &copy; {new Date().getFullYear()} We Are Excursions. All
                  rights reserved.
                </p>
              </div>

              {/* Certifications & Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-yellow-400" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-yellow-400" />
                  <span>TripAdvisor Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-yellow-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">🌍</span>
                <select className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors focus:border-yellow-400 focus:outline-none">
                  <option value="en" className="bg-gray-800">
                    English
                  </option>
                  <option value="es" className="bg-gray-800">
                    Español
                  </option>
                  <option value="de" className="bg-gray-800">
                    Deutsch
                  </option>
                  <option value="fr" className="bg-gray-800">
                    Français
                  </option>
                  <option value="it" className="bg-gray-800">
                    Italiano
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
