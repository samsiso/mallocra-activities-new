"use client"

/*
<ai_context>
Enhanced Google Maps component for displaying multiple activity locations across Mallorca.
Shows different activity types with color-coded markers and interactive info windows.
Responsive and accessible with proper loading states and activity clustering.
</ai_context>
*/

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MapPin, Loader2 } from "lucide-react"

interface ActivityLocation {
  id: string
  name: string
  category: string
  latitude: number
  longitude: number
  price: string
  rating: number
  image?: string
}

interface GoogleMapProps {
  address?: string
  latitude?: number
  longitude?: number
  zoom?: number
  height?: string
  className?: string
  markerTitle?: string
  showActivityLocations?: boolean
}

// Sample activity locations for demonstration
const sampleActivityLocations: ActivityLocation[] = [
  {
    id: "1",
    name: "Catamaran Sunset Cruise",
    category: "Water Sports",
    latitude: 39.5696,
    longitude: 2.6502,
    price: "€45",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=100&fit=crop"
  },
  {
    id: "2",
    name: "Serra de Tramuntana Hiking",
    category: "Land Adventures",
    latitude: 39.75,
    longitude: 2.7,
    price: "€25",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=150&h=100&fit=crop"
  },
  {
    id: "3",
    name: "Palma Cathedral Tour",
    category: "Cultural Tours",
    latitude: 39.5665,
    longitude: 2.6502,
    price: "€35",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=100&fit=crop"
  },
  {
    id: "4",
    name: "Alcudia Beach Activities",
    category: "Water Sports",
    latitude: 39.8522,
    longitude: 3.1189,
    price: "€30",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=100&fit=crop"
  },
  {
    id: "5",
    name: "Deia Village Walk",
    category: "Cultural Tours",
    latitude: 39.75,
    longitude: 2.65,
    price: "€20",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop"
  },
  {
    id: "6",
    name: "Cala d'Or Scuba Diving",
    category: "Water Sports",
    latitude: 39.3728,
    longitude: 3.2096,
    price: "€65",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=100&fit=crop"
  }
]

// Category colors for markers
const categoryColors = {
  "Water Sports": "#0ea5e9", // Blue
  "Land Adventures": "#10b981", // Green
  "Cultural Tours": "#8b5cf6", // Purple
  "Food & Wine": "#f59e0b", // Amber
  Nightlife: "#ec4899", // Pink
  "Day Trips": "#f97316" // Orange
}

export default function GoogleMap({
  address = "Palma, Mallorca, Spain",
  latitude,
  longitude,
  zoom = 10,
  height = "400px",
  className = "",
  markerTitle = "Meeting Point",
  showActivityLocations = true
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

        if (!apiKey) {
          throw new Error("Google Maps API key not found")
        }

        console.log(
          "Loading Google Maps with API key:",
          apiKey.substring(0, 10) + "..."
        )

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "marker"]
        })

        // Load Google Maps
        await loader.load()

        if (!mapRef.current) {
          throw new Error("Map container not found")
        }

        // Default to Palma coordinates if not provided
        let lat = latitude ?? 39.5696
        let lng = longitude ?? 2.6502

        console.log("Creating map at coordinates:", lat, lng)

        const center = { lat, lng }

        // Create map instance with enhanced styling
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f8fafc" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0ea5e9" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#e2e8f0" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#cbd5e1" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#f1f5f9" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#dcfce7" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f8fafc" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#1e293b" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff", weight: 2 }]
            }
          ]
        })

        if (showActivityLocations) {
          // Add multiple activity location markers
          sampleActivityLocations.forEach(location => {
            const color =
              categoryColors[
                location.category as keyof typeof categoryColors
              ] || "#ea580c"

            // Create custom marker with enhanced styling
            const marker = new google.maps.Marker({
              position: { lat: location.latitude, lng: location.longitude },
              map: map,
              title: location.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: color,
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 3,
                strokeOpacity: 1
              },
              animation: google.maps.Animation.DROP
            })

            // Create info window with rich content
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-4 max-w-xs">
                  <div class="flex items-center gap-3 mb-3">
                    <img 
                      src="${location.image}" 
                      alt="${location.name}"
                      class="w-16 h-12 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 class="font-bold text-gray-900 text-sm">${location.name}</h3>
                      <p class="text-xs text-gray-600">${location.category}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">★</span>
                      <span class="text-sm font-medium">${location.rating}</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900">${location.price}</div>
                  </div>
                  
                  <button 
                    onclick="window.open('/activities', '_blank')"
                    class="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              `,
              pixelOffset: new google.maps.Size(0, -10)
            })

            // Add click listener to marker
            marker.addListener("click", () => {
              // Close other info windows
              infoWindow.open(map, marker)
            })

            // Add hover effects
            marker.addListener("mouseover", () => {
              marker.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 4,
                strokeOpacity: 1
              })
            })

            marker.addListener("mouseout", () => {
              marker.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: color,
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 3,
                strokeOpacity: 1
              })
            })
          })
        } else {
          // Add single marker for specific location
          new google.maps.Marker({
            position: center,
            map: map,
            title: markerTitle,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#ea580c",
              fillOpacity: 0.9,
              strokeColor: "#ffffff",
              strokeWeight: 3
            },
            animation: google.maps.Animation.DROP
          })
        }

        console.log("Map loaded successfully")
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError(err instanceof Error ? err.message : "Failed to load map")
        setIsLoading(false)
      }
    }

    initMap()
  }, [address, latitude, longitude, zoom, markerTitle, showActivityLocations])

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 ${className}`}
        style={{ height }}
      >
        <div className="p-4 text-center">
          <MapPin className="mx-auto mb-2 size-8 text-gray-400" />
          <p className="mb-1 text-sm text-gray-600">Map unavailable</p>
          <p className="text-xs text-gray-500">{address}</p>
          <p className="mt-2 text-xs text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 size-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="size-full"
        aria-label={`Interactive map showing ${showActivityLocations ? "activity locations" : markerTitle} in Mallorca`}
      />

      {/* Map Legend */}
      {showActivityLocations && !isLoading && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">
            Activity Types
          </h4>
          <div className="space-y-1">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
