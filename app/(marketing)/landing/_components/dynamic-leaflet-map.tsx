"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamic import for Leaflet map with SSR disabled and loading state
const LeafletMapDynamic = dynamic(() => import("@/components/ui/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="size-6 animate-spin rounded-full border-2 border-gray-600 border-t-orange-500"></div>
        <span className="text-sm font-medium">Loading interactive map...</span>
      </div>
    </div>
  )
})

interface DynamicLeafletMapProps {
  className?: string
  [key: string]: any
}

export default function DynamicLeafletMap({
  className = "",
  ...props
}: DynamicLeafletMapProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`flex h-64 w-full items-center justify-center rounded-lg border border-gray-700 bg-gray-800 ${className}`}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <div className="size-6 animate-spin rounded-full border-2 border-gray-600 border-t-orange-500"></div>
            <span className="text-sm font-medium">Loading map...</span>
          </div>
        </div>
      }
    >
      <LeafletMapDynamic className={className} {...props} />
    </Suspense>
  )
}
