/**
 * Mock activities data for the landing page
 * Extracted from the monolithic component for better performance and maintainability
 */

import { ActivityWithDetails } from "@/actions/db/activities-actions"

export const mockActivities: Partial<ActivityWithDetails>[] = [
  {
    id: "activity-1",
    title: "Palma Cathedral & Historic Quarter Tour",
    slug: "palma-cathedral-tour",
    description:
      "Discover the architectural marvel of Palma Cathedral (La Seu) and explore the charming historic quarter",
    shortDescription:
      "Explore Palma's iconic cathedral and historic quarter with expert local guide",
    category: "cultural",
    location: "Palma de Mallorca",
    meetingPoint: "Palma Cathedral Main Entrance",
    durationMinutes: 180,
    latitude: "39.5663",
    longitude: "2.6501",
    videoUrl: null,
    maxParticipants: 15,
    minParticipants: 2,
    minAge: 8,
    maxAge: null,
    includedItems: ["Skip-the-line cathedral tickets", "Expert guide"],
    excludedItems: ["Hotel pickup"],
    whatToBring: ["Comfortable walking shoes"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: "Modest dress code required",
    weatherDependent: false,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.8",
    totalReviews: 324,
    totalBookings: 1250,
    operatorId: "operator-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: "img-1",
        activityId: "activity-1",
        imageUrl:
          "https://images.unsplash.com/photo-1556469559-7c67fdc47b81?w=800&h=600&fit=crop",
        altText: "Palma Cathedral",
        caption: "Stunning Gothic cathedral",
        isPrimary: true,
        sortOrder: 1,
        createdAt: new Date()
      }
    ],
    pricing: [
      {
        id: "price-1",
        activityId: "activity-1",
        priceType: "adult",
        basePrice: "45.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    availableToday: true,
    spotsLeft: 8
  },
  {
    id: "activity-2",
    title: "Serra de Tramuntana Mountain Adventure",
    slug: "tramuntana-adventure",
    description:
      "Experience the breathtaking beauty of the UNESCO World Heritage Serra de Tramuntana mountains",
    shortDescription:
      "UNESCO mountain adventure with stunning views and traditional villages",
    category: "land_adventures",
    location: "Serra de Tramuntana",
    meetingPoint: "Sóller Train Station",
    durationMinutes: 480,
    maxParticipants: 8,
    minParticipants: 2,
    minAge: 12,
    maxAge: null,
    includedItems: ["Professional guide", "4WD transport"],
    excludedItems: ["Hiking boots"],
    whatToBring: ["Hiking boots", "Camera"],
    cancellationPolicy: "Free cancellation up to 48 hours",
    safetyRequirements: "Moderate fitness required",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.9",
    totalReviews: 156,
    totalBookings: 430,
    operatorId: "operator-2",
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: "img-2",
        activityId: "activity-2",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        altText: "Tramuntana Mountains",
        caption: "Dramatic mountain landscape",
        isPrimary: true,
        sortOrder: 1,
        createdAt: new Date()
      }
    ],
    pricing: [
      {
        id: "price-2",
        activityId: "activity-2",
        priceType: "adult",
        basePrice: "89.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    availableToday: true,
    spotsLeft: 3
  },
  {
    id: "activity-3",
    title: "Mallorca Sailing & Snorkeling Adventure",
    slug: "sailing-adventure",
    description:
      "Set sail along Mallorca's stunning coastline aboard our luxury catamaran",
    shortDescription:
      "Luxury catamaran sailing with snorkeling and Mediterranean lunch",
    category: "water_sports",
    location: "Port de Palma",
    meetingPoint: "Marina Port de Palma, Pier 3",
    durationMinutes: 360,
    maxParticipants: 12,
    minParticipants: 4,
    minAge: 6,
    maxAge: null,
    includedItems: ["Catamaran cruise", "Snorkeling gear"],
    excludedItems: ["Hotel transfers"],
    whatToBring: ["Swimwear", "Sunscreen"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    safetyRequirements: "Swimming ability required",
    weatherDependent: true,
    instantConfirmation: true,
    status: "active",
    featured: true,
    avgRating: "4.7",
    totalReviews: 289,
    totalBookings: 850,
    operatorId: "operator-3",
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: "img-3",
        activityId: "activity-3",
        imageUrl:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        altText: "Sailing catamaran",
        caption: "Luxury sailing experience",
        isPrimary: true,
        sortOrder: 1,
        createdAt: new Date()
      }
    ],
    pricing: [
      {
        id: "price-3",
        activityId: "activity-3",
        priceType: "adult",
        basePrice: "75.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    availableToday: true,
    spotsLeft: 5
  },
  {
    id: "activity-11",
    title: "Mallorca Hot Air Balloon Sunrise Flight",
    slug: "hot-air-balloon-flight",
    description:
      "Experience Mallorca from a bird's eye view with our magical hot air balloon flight",
    shortDescription:
      "Magical sunrise hot air balloon flight with champagne breakfast",
    category: "land_adventures",
    location: "Central Mallorca Plains",
    meetingPoint: "Balloon Launch Site (Transport provided from Palma)",
    durationMinutes: 240,
    maxParticipants: 8,
    minParticipants: 2,
    minAge: 8,
    maxAge: null,
    includedItems: ["Hot air balloon flight", "Champagne breakfast"],
    excludedItems: ["Photography service"],
    whatToBring: ["Comfortable shoes", "Camera"],
    cancellationPolicy: "Free cancellation up to 48 hours, weather dependent",
    safetyRequirements:
      "Weather dependent activity, good physical condition required",
    weatherDependent: true,
    instantConfirmation: false,
    status: "active",
    featured: true,
    avgRating: "4.9",
    totalReviews: 187,
    totalBookings: 412,
    operatorId: "operator-11",
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: "img-12",
        activityId: "activity-11",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        altText: "Hot air balloon over Mallorca",
        caption: "Breathtaking aerial views",
        isPrimary: true,
        sortOrder: 1,
        createdAt: new Date()
      }
    ],
    pricing: [
      {
        id: "price-19",
        activityId: "activity-11",
        priceType: "adult",
        basePrice: "195.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    availableToday: false,
    spotsLeft: 3
  }
]

/**
 * Get featured activities (first 3 for homepage)
 */
export const getFeaturedActivities = () => mockActivities.slice(0, 3)

/**
 * Search activities by query (for search component)
 */
export const searchMockActivities = (query: string) => {
  if (!query) return []

  const lowerQuery = query.toLowerCase()
  return mockActivities.filter(
    activity =>
      activity.title?.toLowerCase().includes(lowerQuery) ||
      activity.shortDescription?.toLowerCase().includes(lowerQuery) ||
      activity.category?.toLowerCase().includes(lowerQuery) ||
      activity.location?.toLowerCase().includes(lowerQuery)
  )
}
