"use client"

/*
<ai_context>
Leaflet Map component for displaying activity locations across Mallorca.
No API key required - uses free OpenStreetMap data.
Shows colored markers for different activity types with interactive popups.
Much simpler than Google Maps and works immediately.
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
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Dynamic import to avoid SSR issues
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

// Enhanced activity data with more customer-focused information
const activityLocations = [
  {
    id: 1,
    name: "Catamaran Sunset Cruise",
    position: [39.5696, 2.6502] as [number, number], // Palma Bay
    price: 45,
    originalPrice: 55,
    rating: 4.8,
    reviews: 324,
    duration: "3 hours",
    category: "water",
    emoji: "🌊",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop",
    description:
      "Sail into the sunset with unlimited drinks and stunning coastal views",
    highlights: ["Unlimited drinks", "Professional crew", "Swimming stops"],
    difficulty: "Easy",
    maxGuests: 45,
    popular: true
  },
  {
    id: 2,
    name: "Serra de Tramuntana Hiking",
    position: [39.7817, 2.8186] as [number, number], // Mountains
    price: 35,
    originalPrice: 45,
    rating: 4.9,
    reviews: 189,
    duration: "6 hours",
    category: "land",
    emoji: "🏔️",
    image:
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=400&auto=format&fit=crop",
    description:
      "UNESCO World Heritage mountain trails with breathtaking panoramic views",
    highlights: ["UNESCO site", "Expert guide", "Photo opportunities"],
    difficulty: "Moderate",
    maxGuests: 12,
    popular: false
  },
  {
    id: 3,
    name: "Palma Cathedral Tour",
    position: [39.5663, 2.6309] as [number, number], // Historic center
    price: 25,
    originalPrice: 30,
    rating: 4.7,
    reviews: 156,
    duration: "2 hours",
    category: "cultural",
    emoji: "🏛️",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop",
    description: "Discover the Gothic masterpiece with skip-the-line access",
    highlights: ["Skip the line", "Audio guide", "Rooftop access"],
    difficulty: "Easy",
    maxGuests: 25,
    popular: true
  },
  {
    id: 4,
    name: "Scuba Diving Adventure",
    position: [39.6954, 3.4707] as [number, number], // Eastern coast
    price: 65,
    originalPrice: 75,
    rating: 4.9,
    reviews: 98,
    duration: "4 hours",
    category: "water",
    emoji: "🌊",
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400&auto=format&fit=crop",
    description:
      "Explore underwater caves and marine life with certified instructors",
    highlights: ["All equipment", "Certified instructor", "Underwater photos"],
    difficulty: "Intermediate",
    maxGuests: 8,
    popular: false
  },
  {
    id: 5,
    name: "Deia Village Walking Tour",
    position: [39.7442, 2.6486] as [number, number], // Traditional village
    price: 20,
    originalPrice: 25,
    rating: 4.6,
    reviews: 234,
    duration: "3 hours",
    category: "cultural",
    emoji: "🏛️",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
    description:
      "Authentic village experience with local tapas and cultural insights",
    highlights: ["Local guide", "Tapas included", "Art galleries"],
    difficulty: "Easy",
    maxGuests: 15,
    popular: true
  },
  {
    id: 6,
    name: "Beach Kayaking & Snorkeling",
    position: [39.4745, 3.0951] as [number, number], // Coastal waters
    price: 40,
    originalPrice: 50,
    rating: 4.8,
    reviews: 176,
    duration: "4 hours",
    category: "water",
    emoji: "🌊",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94901b50?q=80&w=400&auto=format&fit=crop",
    description:
      "Paddle through crystal clear waters and discover hidden coves",
    highlights: ["Equipment included", "Hidden beaches", "Snorkel gear"],
    difficulty: "Easy",
    maxGuests: 16,
    popular: false
  }
]

const categoryInfo = {
  water: {
    name: "Water Adventures",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    description: "Ocean & water-based activities",
    count: activityLocations.filter(a => a.category === "water").length
  },
  land: {
    name: "Mountain & Land",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    description: "Hiking & outdoor adventures",
    count: activityLocations.filter(a => a.category === "land").length
  },
  cultural: {
    name: "Cultural Experiences",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    description: "History, art & local culture",
    count: activityLocations.filter(a => a.category === "cultural").length
  }
}

// Enhanced Legend Component
function MapLegend({
  isVisible,
  onClose
}: {
  isVisible: boolean
  onClose: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!isVisible) return null

  return (
    <div className="absolute right-4 top-4 z-20 max-w-xs rounded-xl border border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Activity Guide</h3>
            <p className="text-xs text-gray-600">Activity locations & info</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="size-6 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="size-6 p-0 text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-4 p-4">
          {/* Category Legend */}
          <div className="space-y-3">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-3 rounded-full ${info.color}`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      {info.name}
                    </p>
                    <p className="text-xs text-gray-600">{info.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="px-2 py-0.5 text-xs">
                  {info.count}
                </Badge>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-orange-50 p-2 text-center">
                <p className="font-bold text-orange-600">€20-65</p>
                <p className="text-gray-600">Price range</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-center">
                <p className="font-bold text-green-600">2-6h</p>
                <p className="text-gray-600">Duration</p>
              </div>
            </div>
          </div>

          {/* Special Badges */}
          <div className="border-t border-gray-100 pt-3">
            <p className="mb-2 text-xs font-semibold text-gray-700">
              Look for:
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span>🔥</span>
                <span className="text-gray-600">Most popular activities</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>⭐</span>
                <span className="text-gray-600">Highest rated experiences</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>💰</span>
                <span className="text-gray-600">Special discounted prices</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Custom marker component
function CustomMarker({
  location,
  onMarkerClick
}: {
  location: (typeof activityLocations)[0]
  onMarkerClick: () => void
}) {
  return (
    <Marker
      position={location.position}
      eventHandlers={{
        click: onMarkerClick
      }}
    >
      <Popup minWidth={320} maxWidth={320} className="custom-popup">
        <div className="-m-3 p-0">
          {/* Activity Image */}
          <div className="relative -mx-3 -mt-3 mb-3 h-32 overflow-hidden rounded-t-lg">
            <img
              src={location.image}
              alt={location.name}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Badges */}
            <div className="absolute left-2 top-2 flex gap-2">
              {location.popular && (
                <Badge className="bg-orange-500 px-2 py-1 text-xs text-white">
                  🔥 Popular
                </Badge>
              )}
              <Badge
                className={`${categoryInfo[location.category as keyof typeof categoryInfo].color} px-2 py-1 text-xs text-white`}
              >
                {location.emoji}
              </Badge>
            </div>

            {/* Price */}
            <div className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                {location.originalPrice > location.price && (
                  <span className="text-xs text-gray-500 line-through">
                    €{location.originalPrice}
                  </span>
                )}
                <span className="text-sm font-bold text-gray-900">
                  €{location.price}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div>
              <h3 className="mb-1 text-sm font-bold text-gray-900">
                {location.name}
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                {location.description}
              </p>
            </div>

            {/* Rating & Details */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{location.rating}</span>
                  <span className="text-gray-500">({location.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="size-3" />
                  <span>{location.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="size-3" />
                <span>Max {location.maxGuests}</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-700">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {location.highlights.slice(0, 3).map((highlight, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="h-8 flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-xs text-white hover:from-orange-600 hover:to-red-600"
              >
                Book Now
                <ArrowRight className="ml-1 size-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-gray-300 px-3 text-xs"
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

interface LeafletMapProps {
  height?: string
  className?: string
  showLegend?: boolean
}

export default function LeafletMap({
  height = "500px",
  className = "",
  showLegend = true
}: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Ensure Leaflet icon fix for dynamic imports
    if (typeof window !== "undefined") {
      const L = require("leaflet")

      // Fix for default markers
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
      })
    }
  }, [])

  const handleMarkerClick = () => {
    if (showLegend) {
      setShowLegendPanel(true)
    }
  }

  const handleCloseLegend = () => {
    setShowLegendPanel(false)
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
          <button
            onClick={() => setMapError(false)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
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
          whenReady={() => {
            // Ensure map is properly initialized
            setTimeout(() => {
              // Map will be invalidated automatically by react-leaflet
            }, 100)
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={8}
          />

          {activityLocations.map(location => (
            <CustomMarker
              key={location.id}
              location={location}
              onMarkerClick={handleMarkerClick}
            />
          ))}
        </MapContainer>

        {showLegend && (
          <MapLegend isVisible={showLegendPanel} onClose={handleCloseLegend} />
        )}

        {/* Map Instructions Overlay */}
        {!showLegendPanel && (
          <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
            <p className="text-xs text-gray-700">
              💡 Click any marker to see activity guide
            </p>
          </div>
        )}

        {/* Custom CSS for better popup styling */}
        <style jsx global>{`
          .leaflet-container {
            font-family: inherit;
            background: #f8fafc;
          }
          .leaflet-tile-pane {
            filter: contrast(1.1) saturate(1.1);
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          }
          .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.4 !important;
          }
          .leaflet-popup-tip {
            background: white !important;
          }
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
          }
          .leaflet-control-zoom a {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
            color: #374151 !important;
          }
          .leaflet-control-zoom a:hover {
            background-color: #f9fafb !important;
          }
          .leaflet-tile {
            border-radius: 4px;
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
