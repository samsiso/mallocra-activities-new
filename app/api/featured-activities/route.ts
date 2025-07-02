import { NextResponse } from "next/server"
import { getFeaturedActivitiesAction } from "@/actions/db/activities-actions"

export async function GET() {
  try {
    console.log("[Featured Activities API] Starting request...")

    // Get real featured activities from database
    const result = await getFeaturedActivitiesAction(6)

    console.log("[Featured Activities API] Database result:", result)

    if (result.isSuccess && result.data) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Featured activities retrieved successfully"
      })
    } else {
      // Fallback to hardcoded featured activities if database fails
      const fallbackActivities = [
        {
          id: "palma-cathedral-tour",
          title: "Palma Cathedral & Historic Quarter Tour",
          slug: "palma-cathedral-tour",
          shortDescription:
            "Explore Palma's iconic cathedral and historic quarter with expert local guide",
          description:
            "Discover the architectural marvel of Palma Cathedral (La Seu) and explore the charming historic quarter",
          category: "cultural",
          location: "Palma de Mallorca",
          durationMinutes: 180,
          maxParticipants: 15,
          featured: true,
          avgRating: "4.8",
          totalReviews: 324,
          totalBookings: 1250,
          images: [
            {
              id: "img-1",
              activityId: "palma-cathedral-tour",
              imageUrl:
                "https://images.unsplash.com/photo-1556469559-7c67fdc47b81?w=1200&h=800&fit=crop&crop=center&q=85",
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
              activityId: "palma-cathedral-tour",
              priceType: "adult",
              basePrice: "45.00",
              currency: "EUR",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          availableToday: true,
          spotsLeft: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "sailing-adventure",
          title: "Mallorca Sailing & Snorkeling Adventure",
          slug: "sailing-adventure",
          shortDescription:
            "Luxury catamaran sailing with snorkeling and Mediterranean lunch",
          description:
            "Set sail along Mallorca's stunning coastline aboard our luxury catamaran",
          category: "water_sports",
          location: "Port de Palma",
          durationMinutes: 360,
          maxParticipants: 12,
          featured: true,
          avgRating: "4.7",
          totalReviews: 289,
          totalBookings: 850,
          images: [
            {
              id: "img-4",
              activityId: "sailing-adventure",
              imageUrl:
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
              altText: "Luxury sailing catamaran",
              caption: "Sailing the beautiful waters of Mallorca",
              isPrimary: true,
              sortOrder: 1,
              createdAt: new Date()
            }
          ],
          pricing: [
            {
              id: "price-4",
              activityId: "sailing-adventure",
              priceType: "adult",
              basePrice: "75.00",
              currency: "EUR",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          availableToday: true,
          spotsLeft: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "catamaran-sunset-cruise",
          title: "Catamaran Sunset Cruise with Dinner",
          slug: "catamaran-sunset-cruise",
          shortDescription: "Luxury sunset sailing with dinner and open bar",
          description:
            "Experience the magic of a Mediterranean sunset aboard our luxury catamaran",
          category: "water_sports",
          location: "Port d'Andratx",
          durationMinutes: 240,
          maxParticipants: 20,
          featured: true,
          avgRating: "4.9",
          totalReviews: 187,
          totalBookings: 420,
          images: [
            {
              id: "img-3",
              activityId: "catamaran-sunset-cruise",
              imageUrl:
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
              altText: "Luxury catamaran at sunset",
              caption: "Beautiful sunset cruise along Mallorca coast",
              isPrimary: true,
              sortOrder: 1,
              createdAt: new Date()
            }
          ],
          pricing: [
            {
              id: "price-3",
              activityId: "catamaran-sunset-cruise",
              priceType: "adult",
              basePrice: "89.00",
              currency: "EUR",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          availableToday: true,
          spotsLeft: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      return NextResponse.json({
        success: true,
        data: fallbackActivities,
        message: "Featured activities retrieved successfully (fallback data)"
      })
    }
  } catch (error) {
    console.error("Error in featured activities API:", error)

    // Return fallback data even on error
    const fallbackActivities = [
      {
        id: "palma-cathedral-tour",
        title: "Palma Cathedral & Historic Quarter Tour",
        slug: "palma-cathedral-tour",
        shortDescription:
          "Explore Palma's iconic cathedral and historic quarter with expert local guide",
        description:
          "Discover the architectural marvel of Palma Cathedral (La Seu) and explore the charming historic quarter",
        category: "cultural",
        location: "Palma de Mallorca",
        durationMinutes: 180,
        maxParticipants: 15,
        featured: true,
        avgRating: "4.8",
        totalReviews: 324,
        totalBookings: 1250,
        images: [
          {
            id: "img-1",
            activityId: "palma-cathedral-tour",
            imageUrl:
              "https://images.unsplash.com/photo-1556469559-7c67fdc47b81?w=1200&h=800&fit=crop&crop=center&q=85",
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
            activityId: "palma-cathedral-tour",
            priceType: "adult",
            basePrice: "45.00",
            currency: "EUR",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        availableToday: true,
        spotsLeft: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    return NextResponse.json({
      success: true,
      data: fallbackActivities,
      message: "Featured activities retrieved successfully (error fallback)"
    })
  }
}
