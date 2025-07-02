import { NextResponse } from "next/server"
import {
  populateRealActivitiesAction,
  verifyRealActivitiesAction
} from "@/actions/db/populate-real-activities"

export async function POST() {
  try {
    const result = await populateRealActivitiesAction()

    if (result.success) {
      const verification = await verifyRealActivitiesAction()
      return NextResponse.json({
        success: true,
        message: result.message,
        activitiesCount: verification.count,
        activities: verification.data
      })
    }

    return NextResponse.json(result, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to populate activities" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await verifyRealActivitiesAction()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to verify activities" },
      { status: 500 }
    )
  }
}
