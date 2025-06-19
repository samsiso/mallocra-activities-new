import { getWeatherForLocationAction } from "@/actions/weather/weather-actions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json()

    if (!location) {
      return NextResponse.json(
        { isSuccess: false, message: "Location is required" },
        { status: 400 }
      )
    }

    const result = await getWeatherForLocationAction(location)

    return NextResponse.json(result, {
      status: result.isSuccess ? 200 : 500
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { isSuccess: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
