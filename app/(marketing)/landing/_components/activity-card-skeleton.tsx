"use client"

export default function ActivityCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-xl">
      {/* Image skeleton */}
      <div className="mb-4 h-48 animate-pulse rounded-lg bg-gray-700/50"></div>

      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Title */}
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700/50"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-700/30"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-700/30"></div>
        </div>

        {/* Stats row */}
        <div className="flex justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-700/30"></div>
          <div className="h-4 w-12 animate-pulse rounded bg-gray-700/30"></div>
        </div>

        {/* Price */}
        <div className="h-8 w-24 animate-pulse rounded bg-gray-700/50"></div>
      </div>
    </div>
  )
}
