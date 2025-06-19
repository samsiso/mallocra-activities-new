"use client"

import { motion } from "framer-motion"

// Glassmorphism card component
function GlassCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

// Skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/20 ${className}`} />
}

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        {/* Profile Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* User Info Skeleton */}
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {/* Avatar Skeleton */}
                <Skeleton className="size-24 rounded-full" />

                {/* User Details Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="mt-8 grid gap-4 border-t border-white/20 pt-6 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 text-center">
                  <Skeleton className="mx-auto h-8 w-16" />
                  <Skeleton className="mx-auto h-4 w-24" />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Profile Tabs Skeleton */}
        <div className="space-y-6">
          {/* Tab Navigation Skeleton */}
          <GlassCard className="p-3">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </GlassCard>

          {/* Tab Content Skeleton */}
          <GlassCard>
            <Skeleton className="mb-6 h-6 w-48" />

            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
