"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, LogIn } from "lucide-react"

// Prevent static generation of this page to avoid Clerk context issues
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Temporary simplified bookings page to fix build issues
export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      <section className="relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative text-center">
          <div className="mx-auto max-w-md rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
            <User className="mx-auto mb-6 size-16 text-yellow-400" />
            <h2 className="mb-4 text-3xl font-bold text-white">
              Bookings Page
            </h2>
            <p className="mb-8 text-white/70">
              This page is temporarily simplified for deployment. Full booking
              functionality will be restored soon.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
                  <LogIn className="mr-2 size-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/activities">
                <Button
                  variant="outline"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  Browse Activities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
