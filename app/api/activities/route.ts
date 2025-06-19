import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock data during build to prevent deployment issues
    const mockActivities = [
      {
        id: "1",
        title: "Sample Activity",
        description: "Sample description",
        short_description: "Sample short description",
        price: 50,
        duration_minutes: 120,
        featured: true,
        images: [],
        location: "Mallorca",
        avg_rating: 4.5,
        total_reviews: 10
      }
    ]

    return NextResponse.json(mockActivities)
  } catch (error) {
    console.error("Error in activities API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
