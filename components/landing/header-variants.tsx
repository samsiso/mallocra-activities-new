"use client"

/**
 * Header Variants Component - Landing Page
 *
 * Demonstrates the Client Design Variant System with 3 distinct header styles
 * Allows real-time switching between Glass, Solid, and Gradient header designs
 *
 * Variants:
 * 1. Glass Morphism - Transparent with backdrop blur (current production)
 * 2. Solid Dark - Opaque dark background with strong contrast
 * 3. Brand Gradient - Pink-to-red gradient with brand emphasis
 */

import { motion } from "framer-motion"
import { useVariants, useComponentVariant } from "@/context/VariantContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Heart, Search, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"

export function HeaderVariants() {
  const { variants } = useVariants()
  const headerVariant = useComponentVariant("header")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define the three header style variants
  const headerStyles = {
    glass: {
      className:
        "backdrop-blur-md bg-white/25 border-b border-white/20 shadow-lg",
      style: {},
      description: "Glass Morphism - Modern transparent design",
      textColor: "text-white",
      hoverColor: "hover:text-pink-300"
    },
    solid: {
      className: "bg-gray-900/95 border-b border-pink-500/30 shadow-xl",
      style: {},
      description: "Solid Dark - Professional high contrast",
      textColor: "text-white",
      hoverColor: "hover:text-pink-400"
    },
    gradient: {
      className: "border-b border-pink-600/50 shadow-2xl",
      style: {
        background:
          "linear-gradient(135deg, #ff1dce 0%, #dc2626 50%, #b91c1c 100%)"
      },
      description: "Brand Gradient - Bold brand identity",
      textColor: "text-white",
      hoverColor: "hover:text-yellow-300"
    }
  }

  const currentStyle = headerStyles[headerVariant.current]

  // Navigation items
  const navItems = [
    { href: "/activities", label: "Activities" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" }
  ]

  return (
    <motion.header
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${currentStyle.className}`}
      style={currentStyle.style}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      key={`header-${headerVariant.current}`} // Force re-render on variant change
    >
      {/* Desktop Header */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3">
              {/* Logo Icon */}
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    headerVariant.current === "gradient"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "linear-gradient(135deg, #ff1dce, #dc2626)"
                }}
              >
                <MapPin className="size-5 text-white" />
              </div>

              {/* Brand Text */}
              <div className="hidden sm:block">
                <div className={`text-lg font-bold ${currentStyle.textColor}`}>
                  WE ARE{" "}
                  <span
                    className={
                      headerVariant.current === "gradient"
                        ? "text-yellow-300"
                        : "text-pink-300"
                    }
                  >
                    EXCURSIONS
                  </span>
                </div>
                <div className="text-xs text-white/70">Mallorca Activities</div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(item => (
              <motion.div
                key={item.href}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`font-medium transition-colors duration-200 ${currentStyle.textColor} ${currentStyle.hoverColor}`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className={`hidden sm:flex ${currentStyle.textColor} ${currentStyle.hoverColor} hover:bg-white/10`}
              >
                <Search className="size-4" />
              </Button>
            </motion.div>

            {/* Wishlist Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className={`hidden sm:flex ${currentStyle.textColor} ${currentStyle.hoverColor} hover:bg-white/10`}
              >
                <Heart className="size-4" />
              </Button>
            </motion.div>

            {/* User Account Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className={`${currentStyle.textColor} ${currentStyle.hoverColor} hover:bg-white/10`}
              >
                <User className="mr-1 size-4" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${currentStyle.textColor} hover:bg-white/10`}
              >
                {isMobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`overflow-hidden border-t md:hidden ${
          headerVariant.current === "glass"
            ? "border-white/20"
            : headerVariant.current === "solid"
              ? "border-pink-500/30"
              : "border-pink-600/50"
        }`}
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          background:
            headerVariant.current === "gradient"
              ? "linear-gradient(135deg, #ff1dce 0%, #dc2626 50%, #b91c1c 100%)"
              : currentStyle.style.background ||
                (headerVariant.current === "glass"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(17, 24, 39, 0.95)")
        }}
      >
        <div className="space-y-3 p-4">
          {/* Mobile Navigation Links */}
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: isMobileMenuOpen ? 0 : -20,
                opacity: isMobileMenuOpen ? 1 : 0
              }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 font-medium transition-colors duration-200 ${currentStyle.textColor} ${currentStyle.hoverColor} hover:bg-white/10`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          {/* Mobile Action Buttons */}
          <motion.div
            className="flex gap-3 border-t border-white/20 pt-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isMobileMenuOpen ? 0 : 20,
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Search className="mr-1 size-4" />
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Heart className="mr-1 size-4" />
              Wishlist
            </Button>
          </motion.div>

          {/* Contact Info (Mobile Only) */}
          <motion.div
            className="space-y-2 border-t border-white/20 pt-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isMobileMenuOpen ? 0 : 20,
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="size-4" />
              <span>+34 971 123 456</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="size-4" />
              <span>info@weareexcursions.com</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Variant Info Badge (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <motion.div
          className="absolute right-4 top-16 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="rounded-full border border-pink-500/30 bg-black/80 px-3 py-1 text-xs text-white backdrop-blur-sm">
            Header: {currentStyle.description}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
