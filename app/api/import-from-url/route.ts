import { NextResponse } from "next/server"
import { MediaService } from "@/lib/media-service"

export async function POST(request: Request) {
  try {
    const { url, folder } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      )
    }

    // Import the image from URL to Cloudinary
    const result = await MediaService.fetchFromUrl(url, folder)

    return NextResponse.json({
      success: true,
      publicId: result.publicId,
      secureUrl: result.secureUrl,
      metadata: result
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Import failed"
      },
      { status: 500 }
    )
  }
}
