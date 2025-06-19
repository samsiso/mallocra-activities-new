import { NextResponse } from "next/server"
import { getBookingsAction } from "@/actions/db/bookings-actions"

export async function GET() {
  try {
    const response = await getBookingsAction()

    if (response.isSuccess) {
      return NextResponse.json(response.data)
    } else {
      return NextResponse.json({ error: response.message }, { status: 500 })
    }
  } catch (error) {
    console.error("API Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
