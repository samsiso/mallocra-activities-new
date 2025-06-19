"use client"

/*
<ai_context>
Activities Loading Component
Provides skeleton loading state for activities grid while server-side data fetching is in progress.
Uses dark theme glassmorphism design matching the activities page aesthetic.
</ai_context>
*/

export default function ActivitiesLoading() {
  return (
    <div
      className="relative min-h-screen"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Background matching main page */}
      <div className="activities-red-background bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800"></div>

      <div className="relative z-10">
        {/* Hero Section Loading */}
        <section className="relative pb-12 pt-24">
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="text-center">
              {/* Badge skeleton */}
              <div className="mx-auto mb-6 h-8 w-56 animate-pulse rounded-full bg-white/20" />

              {/* Title skeleton */}
              <div className="mx-auto mb-6 h-16 w-96 animate-pulse rounded-lg bg-white/20" />

              {/* Description skeleton */}
              <div className="w-2xl mx-auto mb-8 h-6 animate-pulse rounded bg-white/20" />

              {/* Search form skeleton */}
              <div className="mx-auto max-w-6xl rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="h-12 flex-1 animate-pulse rounded-lg bg-white/20" />
                  <div className="h-12 w-48 animate-pulse rounded-lg bg-white/20" />
                  <div className="h-12 w-48 animate-pulse rounded-lg bg-white/20" />
                  <div className="h-12 w-32 animate-pulse rounded-lg bg-white/20" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-white/20" />
                    <div className="h-4 w-12 animate-pulse rounded bg-white/20" />
                    <div className="h-10 w-40 animate-pulse rounded bg-white/20" />
                  </div>
                  <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid Loading */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4">
            {/* Section Header skeleton */}
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <div className="mb-2 h-8 w-64 animate-pulse rounded bg-white/20" />
                <div className="h-5 w-80 animate-pulse rounded bg-white/20" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-32 animate-pulse rounded-lg bg-white/20" />
                <div className="h-10 w-36 animate-pulse rounded-lg bg-white/20" />
              </div>
            </div>

            {/* Activities Cards Grid Loading */}
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10">
                    {/* Image skeleton */}
                    <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-800" />

                    {/* Content skeleton */}
                    <div className="p-6">
                      {/* Badges skeleton */}
                      <div className="mb-4 flex gap-2">
                        <div className="h-5 w-16 rounded bg-white/20" />
                        <div className="h-5 w-20 rounded bg-white/20" />
                      </div>

                      {/* Title skeleton */}
                      <div className="mb-4 h-6 w-3/4 rounded bg-white/20" />

                      {/* Description skeleton */}
                      <div className="mb-6 space-y-2">
                        <div className="h-4 w-full rounded bg-white/20" />
                        <div className="h-4 w-2/3 rounded bg-white/20" />
                      </div>

                      {/* Details skeleton */}
                      <div className="mb-4 flex gap-4">
                        <div className="h-4 w-16 rounded bg-white/20" />
                        <div className="h-4 w-12 rounded bg-white/20" />
                        <div className="h-4 w-16 rounded bg-white/20" />
                      </div>

                      {/* CTA skeleton */}
                      <div className="flex justify-between">
                        <div className="h-4 w-24 rounded bg-white/20" />
                        <div className="h-4 w-20 rounded bg-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
