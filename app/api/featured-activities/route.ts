import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock featured activities during build
    const mockFeaturedActivities = [
      {
        id: "1",
        title: "Featured Activity 1",
        description: "Amazing featured activity",
        price: 75,
        duration: 180,
        featured: true,
        images: [],
        location: "Palma, Mallorca"
      }
    ]

    return NextResponse.json(mockFeaturedActivities)
  } catch (error) {
    console.error("Error in featured activities API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
