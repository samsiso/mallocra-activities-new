"use client"

/*
<ai_context>
Simplified header component without Clerk dependencies.
Safe version for deployment without authentication.
</ai_context>
*/

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, MapPin, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/activities", label: "Activities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
]

export default function HeaderSimple() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-500/20 bg-rose-400/95 backdrop-blur supports-[backdrop-filter]:bg-rose-400/60">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-lg bg-orange-600 p-2">
              <MapPin className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Mallorca Activities
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-orange-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-rose-500/20 bg-rose-400 sm:max-w-sm"
            >
              <nav className="mt-8 flex flex-col space-y-6">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-gray-300 transition-colors hover:text-orange-400"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-8 flex flex-col space-y-4">
                  <Button variant="ghost">Sign In</Button>
                  <Button>Sign Up</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
