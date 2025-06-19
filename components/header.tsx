/*
<ai_context>
Enhanced header component for the We Are Excursions platform.
Features improved spacing, better visual hierarchy, sophisticated mobile menu with category dropdowns,
and modern design with glassmorphism effects.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import {
  Menu,
  MapPin,
  X,
  Calendar,
  Heart,
  Home,
  Compass,
  Phone,
  Info,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Waves,
  Mountain,
  Camera,
  Utensils,
  Music,
  Plane,
  Car,
  Building,
  Sun,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { ThemeSwitcher } from "./utilities/theme-switcher"

// Performance optimization: throttle function
const throttle = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0
  return (...args: any[]) => {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime)
      )
    }
  }
}

const navLinks = [
  { href: "/activities", label: "All Activities", icon: Compass },
  { href: "/about", label: "About", icon: Info },
  { href: "/blog", label: "Blog", icon: FileText }
]

const signedInLinks = [
  { href: "/bookings", label: "My Bookings", icon: Calendar },
  { href: "/wishlist", label: "Wishlist", icon: Heart }
]

const activityCategories = [
  {
    href: "/activities?category=water_sports",
    label: "Water Sports",
    icon: Waves,
    description: "Diving, sailing, jet skiing and more"
  },
  {
    href: "/activities?category=land_adventures",
    label: "Land Adventures",
    icon: Mountain,
    description: "Hiking, cycling, rock climbing"
  },
  {
    href: "/activities?category=cultural",
    label: "Cultural Tours",
    icon: Camera,
    description: "Museums, historic sites, local experiences"
  },
  {
    href: "/activities?category=food_wine",
    label: "Food & Wine",
    icon: Utensils,
    description: "Tastings, cooking classes, markets"
  },
  {
    href: "/activities?category=nightlife",
    label: "Nightlife",
    icon: Music,
    description: "Bars, clubs, evening entertainment"
  },
  {
    href: "/activities?category=day_trips",
    label: "Day Trips",
    icon: Car,
    description: "Explore beyond Mallorca"
  }
]

const quickLinks = [
  { href: "/popular", label: "Popular Activities", icon: Sun },
  { href: "/deals", label: "Special Deals", icon: Heart },
  { href: "/transport", label: "Transportation", icon: Plane },
  { href: "/accommodation", label: "Hotels & Stays", icon: Building }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  console.log("🔥 Header component is rendering!")

  // Check if Clerk is available
  const isClerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleScroll = useCallback(
    throttle(() => {
      setIsScrolled(window.scrollY > 10)
    }, 16), // 60fps throttling
    []
  )

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Safe Clerk component for authenticated users
  function SafeSignedIn({ children }: { children: React.ReactNode }) {
    if (!isClerkAvailable) {
      return null
    }

    return <SignedIn>{children}</SignedIn>
  }

  // Safe Clerk component for unauthenticated users
  function SafeSignedOut({ children }: { children: React.ReactNode }) {
    if (!isClerkAvailable) {
      // If Clerk is not available, show the content (as if user is signed out)
      return <>{children}</>
    }

    return <SignedOut>{children}</SignedOut>
  }

  // Safe user button component
  function SafeUserButton() {
    if (!isClerkAvailable) {
      return null
    }

    return <UserButton />
  }

  // Safe sign in button
  function SafeSignInButton() {
    if (!isClerkAvailable) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 hover:text-rose-200"
        >
          Sign In
        </Button>
      )
    }

    return (
      <SignInButton>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 hover:text-rose-200"
        >
          Sign In
        </Button>
      </SignInButton>
    )
  }

  // Safe sign up button
  function SafeSignUpButton() {
    if (!isClerkAvailable) {
      return (
        <Button
          size="sm"
          className="bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold text-black hover:from-yellow-500 hover:to-amber-600 hover:shadow-lg"
        >
          Sign Up
        </Button>
      )
    }

    return (
      <SignUpButton>
        <Button
          size="sm"
          className="bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold text-black hover:from-yellow-500 hover:to-amber-600 hover:shadow-lg"
        >
          Sign Up
        </Button>
      </SignUpButton>
    )
  }

  return (
    <header className="circular-nav-header sticky left-1/2 top-0 z-[9999] w-full max-w-5xl -translate-x-1/2 px-6 pt-6">
      {/* Glassy Navigation Container */}
      <div
        className={`relative mx-auto flex items-center justify-between rounded-full border border-white/30 px-6 py-3 shadow-lg transition-all duration-500 ${
          isScrolled ? "bg-white/25 shadow-xl" : "bg-white/20"
        }`}
        style={{
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: isScrolled
            ? "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            : "0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Subtle inner glow - REMOVED TO FIX BLACK BAR */}

        <div className="relative flex w-full items-center justify-between">
          {/* Compact Logo with WE ARE EXCURSIONS Branding */}
          <Link
            href="/"
            className="group flex items-center space-x-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-orange-400/80 via-yellow-500/70 to-amber-500/80 p-2 shadow-lg shadow-orange-500/20 backdrop-blur-sm transition-all duration-300 group-hover:shadow-orange-500/40">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <MapPin className="relative z-10 size-4 font-bold text-white drop-shadow-lg" />
            </div>
            <div className="hidden text-sm font-bold transition-all duration-300 group-hover:text-white sm:block">
              <span className="text-black drop-shadow-lg">WE</span>
              <span className="text-yellow-400 drop-shadow-lg"> ARE </span>
              <span className="text-white drop-shadow-lg">EXCURSIONS</span>
            </div>
          </Link>

          {/* Center Navigation - Compact Glass Pills */}
          <nav className="flex items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList className="hidden items-center space-x-1 lg:flex">
                {navLinks.map(link => {
                  const IconComponent = link.icon
                  return (
                    <NavigationMenuItem key={link.href}>
                      {link.href === "/activities" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-2 border border-transparent px-4 py-2 text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white hover:shadow-lg"
                            >
                              <IconComponent className="size-4" />
                              {link.label}
                              <ChevronDown className="size-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="bg-white/8 w-80 border-white/20 shadow-xl backdrop-blur-xl"
                            style={{
                              backdropFilter: "blur(20px) saturate(150%)",
                              WebkitBackdropFilter: "blur(20px) saturate(150%)"
                            }}
                          >
                            <div className="grid grid-cols-1 gap-1 p-2">
                              {activityCategories.map(category => {
                                const CategoryIcon = category.icon
                                return (
                                  <DropdownMenuItem key={category.href} asChild>
                                    <Link
                                      href={category.href}
                                      className="flex items-start gap-3 rounded-lg p-3 text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
                                    >
                                      <CategoryIcon className="mt-0.5 size-5 text-yellow-400" />
                                      <div>
                                        <div className="font-medium">
                                          {category.label}
                                        </div>
                                        <div className="text-xs text-white/60">
                                          {category.description}
                                        </div>
                                      </div>
                                    </Link>
                                  </DropdownMenuItem>
                                )
                              })}
                            </div>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <div className="p-2">
                              <DropdownMenuItem asChild>
                                <Link
                                  href="/activities"
                                  className="flex items-center gap-2 rounded-lg p-2 font-medium text-orange-400 transition-all duration-200 hover:bg-white/10 hover:text-orange-300"
                                >
                                  <Compass className="size-4" />
                                  View All Activities
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={link.href}
                          className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white"
                        >
                          <IconComponent className="size-3" />
                          {link.label}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  )
                })}

                <SafeSignedIn>
                  {signedInLinks.map(link => {
                    const IconComponent = link.icon
                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white"
                        >
                          <IconComponent className="size-3" />
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
                </SafeSignedIn>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right Section - Compact for circular design */}
          <div className="flex items-center space-x-2">
            <SafeSignedOut>
              <div className="hidden items-center space-x-3 lg:flex">
                <SafeSignInButton />
                <SafeSignUpButton />
              </div>
            </SafeSignedOut>

            <SafeSignedIn>
              <div className="hidden lg:block">
                <SafeUserButton />
              </div>
            </SafeSignedIn>

            <div className="hidden lg:block">
              <ThemeSwitcher />
            </div>

            {/* Enhanced Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative border border-transparent text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white lg:hidden"
                  onClick={toggleMenu}
                >
                  <div className="flex flex-col space-y-1">
                    <div
                      className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
                    />
                    <div
                      className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
                    />
                    <div
                      className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
                    />
                  </div>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full border-l border-white/20 bg-white/5 backdrop-blur-xl sm:max-w-sm"
                style={{
                  backdropFilter: "blur(20px) saturate(150%)",
                  WebkitBackdropFilter: "blur(20px) saturate(150%)"
                }}
              >
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-400/80 to-amber-500/80 p-2 shadow-lg backdrop-blur-sm">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <MapPin className="relative z-10 size-5 font-bold text-white" />
                      </div>
                      <span className="text-lg font-bold">
                        <span className="text-black drop-shadow-lg">WE</span>
                        <span className="text-yellow-400 drop-shadow-lg">
                          {" "}
                          ARE{" "}
                        </span>
                        <span className="text-white drop-shadow-lg">
                          EXCURSIONS
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.map(link => {
                        const LinkIcon = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-center text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LinkIcon className="size-5 text-orange-400" />
                            <span className="text-xs font-medium">
                              {link.label}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-300">
                      Navigation
                    </h3>
                    <div className="space-y-1">
                      {navLinks.map(link => {
                        const IconComponent = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-lg p-3 text-gray-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <IconComponent className="size-5" />
                            <span className="font-medium">{link.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Activity Categories */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-300">
                      Activity Categories
                    </h3>
                    <div className="space-y-1">
                      {activityCategories.map(category => {
                        const CategoryIcon = category.icon
                        return (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="flex items-start gap-3 rounded-lg p-3 text-gray-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <CategoryIcon className="mt-0.5 size-5 text-yellow-400" />
                            <div>
                              <div className="font-medium">
                                {category.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {category.description}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <SafeSignedIn>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-300">
                        Account
                      </h3>
                      <div className="space-y-1">
                        {signedInLinks.map(link => {
                          const IconComponent = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 rounded-lg p-3 text-gray-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <IconComponent className="size-5" />
                              <span className="font-medium">{link.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </SafeSignedIn>

                  <SafeSignedOut>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-300">
                        Account
                      </h3>
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 rounded-lg bg-rose-500/5 p-3 text-gray-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="size-5" />
                          <span className="font-medium">Sign In</span>
                        </Button>
                        <Button
                          className="w-full justify-start gap-3 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 p-3 text-black transition-all duration-200 hover:from-yellow-500 hover:to-amber-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="size-5" />
                          <span className="font-medium">Sign Up</span>
                        </Button>
                      </div>
                    </div>
                  </SafeSignedOut>

                  {/* Settings and Theme */}
                  <div className="mt-auto border-t border-rose-500/20 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Settings className="size-5" />
                        <span className="font-medium">Theme</span>
                      </div>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
