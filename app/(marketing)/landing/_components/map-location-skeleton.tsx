"use client"

/*
<ai_context>
Loading skeleton component for the Activities Map section.
Shows animated placeholders while activity data is being fetched.
Maintains layout consistency during loading states.
</ai_context>
*/

export function MapLocationSkeleton() {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/50">
      {/* Map skeleton with animated pulse */}
      <div className="size-full animate-pulse bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Fake map markers */}
        <div className="absolute left-[20%] top-[30%] size-4 animate-pulse rounded-full bg-blue-500/60" />
        <div className="absolute left-[60%] top-[25%] size-4 animate-pulse rounded-full bg-green-500/60" />
        <div className="absolute left-[45%] top-[60%] size-4 animate-pulse rounded-full bg-purple-500/60" />
        <div className="absolute left-[70%] top-[70%] size-4 animate-pulse rounded-full bg-orange-500/60" />
        <div className="absolute left-[30%] top-[80%] size-4 animate-pulse rounded-full bg-rose-500/60" />

        {/* Loading indicator overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-lg border border-gray-600/50 bg-black/80 px-4 py-2 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              <span className="text-sm text-gray-300">
                Loading activities...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons skeleton */}
      <div className="absolute left-4 top-4 z-10">
        <div className="h-8 w-24 animate-pulse rounded-md border border-gray-600/50 bg-black/80" />
      </div>

      {/* Activity count skeleton */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="h-6 w-20 animate-pulse rounded-md border border-gray-600/50 bg-black/80" />
      </div>
    </div>
  )
}
