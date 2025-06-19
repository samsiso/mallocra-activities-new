"use client"

/*
<ai_context>
Interactive Activities Map Component for the Activities Page
Uses real activity data from the database with actual Mallorca coordinates.
Shows all activities with colored markers by category and interactive popups.
Integrated with the main activities page state and filtering.
</ai_context>
*/

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  MapPin,
  Star,
  Clock,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Navigation,
  Filter
} from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"
import Link from "next/link"
import Image from "next/image"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Dynamic imports to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), {
  ssr: false
})
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), {
  ssr: false
})

// Activity type interface
interface ActivityForMap {
  id: string
  title: string
  slug: string
  shortDescription: string
  category: string
  location: string
  latitude: number
  longitude: number
  avgRating: number
  totalReviews: number
  durationMinutes: number
  maxParticipants: number
  images: Array<{
    imageUrl: string
    altText: string
    isPrimary: boolean
  }>
  pricing: Array<{
    basePrice: string
    priceType: string
    isActive: boolean
  }>
}

// Category information for styling
const categoryInfo = {
  water_sports: {
    name: "Water Sports",
    color: "#0ea5e9", // sky-500
    bgColor: "bg-sky-500",
    emoji: "🌊",
    description: "Ocean & water activities"
  },
  land_adventures: {
    name: "Land Adventures",
    color: "#22c55e", // green-500
    bgColor: "bg-green-500",
    emoji: "🏔️",
    description: "Hiking & outdoor adventures"
  },
  cultural: {
    name: "Cultural",
    color: "#a855f7", // purple-500
    bgColor: "bg-purple-500",
    emoji: "🏛️",
    description: "History & culture"
  },
  nightlife: {
    name: "Nightlife",
    color: "#ec4899", // pink-500
    bgColor: "bg-pink-500",
    emoji: "🎉",
    description: "Bars & entertainment"
  },
  family_fun: {
    name: "Family Fun",
    color: "#f59e0b", // amber-500
    bgColor: "bg-amber-500",
    emoji: "👨‍👩‍👧‍👦",
    description: "Family activities"
  },
  food_wine: {
    name: "Food & Wine",
    color: "#dc2626", // red-600
    bgColor: "bg-red-600",
    emoji: "🍷",
    description: "Culinary experiences"
  },
  day_trips: {
    name: "Day Trips",
    color: "#0891b2", // cyan-600
    bgColor: "bg-cyan-600",
    emoji: "🚌",
    description: "Full day excursions"
  }
}

// Enhanced Map Legend
function MapLegend({
  isVisible,
  onClose,
  activities,
  visibleCategories,
  onCategoryToggle
}: {
  isVisible: boolean
  onClose: () => void
  activities: ActivityForMap[]
  visibleCategories: Set<string>
  onCategoryToggle: (category: string) => void
}) {
  if (!isVisible) return null

  const categoryCounts = activities.reduce(
    (acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-lg bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Activity Categories</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="size-8 p-0 text-gray-500 hover:text-gray-700"
        >
          <Eye className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {Object.entries(categoryInfo).map(([key, info]) => {
          const count = categoryCounts[key] || 0
          const isVisible = visibleCategories.has(key)

          if (count === 0) return null

          return (
            <div
              key={key}
              className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition-all duration-200 ${
                isVisible ? "bg-gray-50" : "bg-gray-100 opacity-60"
              }`}
              onClick={() => onCategoryToggle(key)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.emoji}</span>
                    <span className="font-medium text-gray-800">
                      {info.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{info.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
                {isVisible ? (
                  <Eye className="size-4 text-green-600" />
                ) : (
                  <EyeOff className="size-4 text-gray-400" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Activities: {activities.length}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              Object.keys(categoryInfo).forEach(cat => {
                if (categoryCounts[cat] > 0) {
                  onCategoryToggle(cat)
                }
              })
            }}
            className="h-7 px-2 text-xs"
          >
            Toggle All
          </Button>
        </div>
      </div>
    </div>
  )
}

// Custom marker with activity information
function ActivityMarker({
  activity,
  isVisible
}: {
  activity: ActivityForMap
  isVisible: boolean
}) {
  const categoryData =
    categoryInfo[activity.category as keyof typeof categoryInfo] ||
    categoryInfo.land_adventures
  const primaryImage =
    activity.images?.find(img => img.isPrimary) || activity.images?.[0]
  const adultPricing = activity.pricing?.find(
    p => p.priceType === "adult" && p.isActive
  )
  const price = adultPricing ? parseFloat(adultPricing.basePrice) : 0

  useEffect(() => {
    // Fix Leaflet icon paths
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png"
      })
    }
  }, [])

  if (!isVisible) return null

  return (
    <Marker position={[activity.latitude, activity.longitude]}>
      <Popup closeOnEscapeKey={true} className="activity-popup">
        <div className="w-80 rounded-lg bg-white p-0 shadow-lg">
          {/* Image Header */}
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={primaryImage.altText || activity.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <MapPin className="size-8 text-gray-500" />
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute left-2 top-2">
              <Badge className={`${categoryData.bgColor} text-white`}>
                {categoryData.emoji} {categoryData.name}
              </Badge>
            </div>

            {/* Price Badge */}
            {price > 0 && (
              <div className="absolute right-2 top-2">
                <Badge className="bg-white/90 font-bold text-gray-800">
                  €{price}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
              {activity.title}
            </h3>

            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              {activity.shortDescription}
            </p>

            {/* Activity Details */}
            <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{activity.avgRating}</span>
                <span>({activity.totalReviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>
                  {Math.floor(activity.durationMinutes / 60)}h{" "}
                  {activity.durationMinutes % 60}m
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="size-3" />
                <span>Max {activity.maxParticipants}</span>
              </div>
            </div>

            {/* Location */}
            <div className="mb-4 flex items-start gap-2 text-xs text-gray-600">
              <MapPin className="mt-0.5 size-3 text-gray-400" />
              <span>{activity.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link href={`/activities/${activity.slug}`} className="flex-1">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                >
                  View Details
                  <ArrowRight className="ml-1 size-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// Main map component
interface ActivitiesMapProps {
  activities: ActivityForMap[]
  height?: string
  className?: string
  showLegend?: boolean
}

export default function ActivitiesMap({
  activities,
  height = "500px",
  className = "",
  showLegend = true
}: ActivitiesMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set()
  )
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Initialize with all categories visible
    const allCategories = new Set(activities.map(a => a.category))
    setVisibleCategories(allCategories)

    // Fix Leaflet icon paths
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png"
      })
    }
  }, [activities])

  const handleCategoryToggle = (category: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const toggleLegend = () => {
    setShowLegendPanel(!showLegendPanel)
  }

  if (!isClient) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-100 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="mx-auto mb-2 size-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-sm text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 ${className}`}
        style={{ height }}
      >
        <div className="p-4 text-center">
          <MapPin className="mx-auto mb-2 size-8 text-gray-400" />
          <p className="text-sm text-gray-600">Map temporarily unavailable</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMapError(false)}
            className="mt-2"
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="mx-auto mb-2 size-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            No activities to display on map
          </p>
        </div>
      </div>
    )
  }

  try {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-gray-200 shadow-lg ${className}`}
        style={{ height }}
      >
        <MapContainer
          center={[39.6953, 2.9712]} // Center of Mallorca
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          className="leaflet-container"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={8}
          />

          {activities.map(activity => (
            <ActivityMarker
              key={activity.id}
              activity={activity}
              isVisible={visibleCategories.has(activity.category)}
            />
          ))}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {showLegend && (
            <Button
              size="sm"
              onClick={toggleLegend}
              className="bg-white/90 text-gray-700 hover:bg-white"
              variant="outline"
            >
              <Filter className="mr-1 size-4" />
              {showLegendPanel ? "Hide" : "Show"} Filters
            </Button>
          )}
        </div>

        {/* Legend Panel */}
        {showLegend && (
          <MapLegend
            isVisible={showLegendPanel}
            onClose={() => setShowLegendPanel(false)}
            activities={activities}
            visibleCategories={visibleCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        )}

        {/* Map Instructions */}
        {!showLegendPanel && (
          <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
            <p className="text-xs text-gray-700">
              💡 Click markers for details • Use filters to sort
            </p>
          </div>
        )}

        {/* Activity Count */}
        <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-700">
            {activities.filter(a => visibleCategories.has(a.category)).length}{" "}
            of {activities.length} activities shown
          </p>
        </div>

        {/* Custom CSS for enhanced styling */}
        <style jsx global>{`
          .leaflet-container {
            font-family: inherit;
            background: #f8fafc;
          }
          .leaflet-tile-pane {
            filter: contrast(1.05) saturate(1.1);
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
            box-shadow:
              0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            padding: 0 !important;
          }
          .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.4 !important;
            width: 320px !important;
          }
          .leaflet-popup-tip {
            background: white !important;
          }
          .leaflet-control-zoom {
            border: none !important;
            box-shadow:
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          }
          .leaflet-control-zoom a {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
            color: #374151 !important;
            transition: all 0.2s ease !important;
          }
          .leaflet-control-zoom a:hover {
            background-color: #f9fafb !important;
            border-color: #d1d5db !important;
          }
          .activity-popup .leaflet-popup-close-button {
            right: 8px !important;
            top: 8px !important;
            background: rgba(255, 255, 255, 0.9) !important;
            color: #374151 !important;
            border-radius: 50% !important;
            width: 24px !important;
            height: 24px !important;
            line-height: 24px !important;
            font-size: 16px !important;
            font-weight: bold !important;
          }
        `}</style>
      </div>
    )
  } catch (error) {
    console.error("Map render error:", error)
    setMapError(true)
    return null
  }
}
