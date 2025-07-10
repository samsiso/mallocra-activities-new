import { NextResponse } from "next/server"
import { seedClientActivitiesAction } from "@/actions/db/seed-client-activities-actions"

export async function POST() {
  try {
    console.log("🚀 Starting client activities seeding...")
    const result = await seedClientActivitiesAction()

    console.log("✅ Seeding completed:", result)

    return NextResponse.json({
      success: result.isSuccess,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to seed activities"
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to seed client activities",
    activities: [
      "Quad Bikes Magaluf",
      "Boat Tour Mallorca",
      "Formula Tours - Tour 1",
      "Formula Tours - Tour 2",
      "White Party Boat",
      "Jet Ski 30-Minute Tour",
      "Jet Ski 1-Hour Tour",
      "Boat Rental Option 1",
      "Boat Rental Option 2",
      "Boat Rental Option 3"
    ]
  })
}
