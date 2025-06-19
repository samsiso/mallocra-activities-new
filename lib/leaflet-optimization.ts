/*
<ai_context>
Leaflet Optimization Utility - Week 2 Performance Enhancement
Centralizes Leaflet icon fixes and optimizations to prevent runtime require() hacks
and improve map loading performance. Called once during map initialization.
</ai_context>
*/

import L from "leaflet"

// Flag to track if optimization has been applied
let isOptimized = false

/**
 * Optimizes Leaflet for better performance by fixing icon paths
 * and implementing performance enhancements. Should be called once
 * during map component initialization.
 */
export function optimizeLeaflet(): void {
  // Prevent multiple optimizations
  if (isOptimized) return

  try {
    // Fix default marker icons (common Leaflet issue in bundled environments)
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
    })

    // Performance optimizations
    // Disable fade animations on tiles for better performance
    if (typeof window !== "undefined") {
      ;(L as any).Browser.any3d = false
    }

    isOptimized = true
    console.log("✅ Leaflet optimization applied successfully")
  } catch (error) {
    console.error("❌ Failed to optimize Leaflet:", error)
  }
}

/**
 * Creates optimized marker icons for different activity categories
 * with performance-focused settings
 */
export function createOptimizedMarkerIcon(category: string): L.Icon {
  const iconConfig = getIconConfigForCategory(category)

  return L.icon({
    iconUrl: iconConfig.url,
    iconRetinaUrl: iconConfig.retinaUrl,
    iconSize: [25, 41], // Smaller size for better performance
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    shadowSize: [41, 41],
    className: `activity-marker activity-marker--${category.toLowerCase()}` // For CSS styling
  })
}

/**
 * Returns optimized icon configuration for activity categories
 */
function getIconConfigForCategory(category: string): {
  url: string
  retinaUrl: string
} {
  const baseUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images"

  // Map categories to optimized icon URLs
  const iconMap: Record<string, { url: string; retinaUrl: string }> = {
    "water-sports": {
      url: `${baseUrl}/marker-icon.png`,
      retinaUrl: `${baseUrl}/marker-icon-2x.png`
    },
    "land-adventures": {
      url: `${baseUrl}/marker-icon.png`,
      retinaUrl: `${baseUrl}/marker-icon-2x.png`
    },
    cultural: {
      url: `${baseUrl}/marker-icon.png`,
      retinaUrl: `${baseUrl}/marker-icon-2x.png`
    },
    nightlife: {
      url: `${baseUrl}/marker-icon.png`,
      retinaUrl: `${baseUrl}/marker-icon-2x.png`
    },
    default: {
      url: `${baseUrl}/marker-icon.png`,
      retinaUrl: `${baseUrl}/marker-icon-2x.png`
    }
  }

  return iconMap[category.toLowerCase()] || iconMap.default
}

/**
 * Performance-optimized map configuration
 */
export const OPTIMIZED_MAP_CONFIG = {
  // Disable animations for better performance
  zoomAnimation: false,
  fadeAnimation: false,
  markerZoomAnimation: false,

  // Optimize tile loading
  maxZoom: 18,
  minZoom: 10,

  // Attribution (required for OSM)
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  // Performance settings
  updateWhenIdle: true,
  updateWhenZooming: false,
  keepBuffer: 2
} as const

/**
 * Optimized tile layer configuration for Mallorca
 */
export const OPTIMIZED_TILE_LAYER = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    attribution: OPTIMIZED_MAP_CONFIG.attribution,
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    // Performance optimizations
    updateWhenIdle: true,
    updateWhenZooming: false,
    keepBuffer: 2
  }
} as const

/**
 * Activity marker clustering configuration for performance
 * when displaying 100+ activities
 */
export const CLUSTERING_CONFIG = {
  // Enable clustering when more than this many markers
  threshold: 100,

  // Cluster configuration
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,

  // Performance settings
  removeOutsideVisibleBounds: true,
  animate: false // Disable animations for performance
} as const

/**
 * Mallorca-specific map bounds for performance optimization
 */
export const MALLORCA_BOUNDS = {
  center: [39.6953, 2.9712] as [number, number],
  bounds: [
    [39.2854, 2.3094], // Southwest
    [40.1051, 3.6329] // Northeast
  ] as [[number, number], [number, number]],
  defaultZoom: 12
} as const
