"use server"

import { NextResponse } from "next/server"
import { getHeroVideosAction } from "@/actions/db/media-actions"

export async function GET() {
  try {
    const result = await getHeroVideosAction()

    if (!result.isSuccess) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      videos: result.data,
      count: result.data.length
    })
  } catch (error) {
    console.error("Error fetching hero videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}
