"use server"

import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function GET() {
  try {
    // First test the connection
    const testResult = await cloudinary.api.ping()
    console.log("Cloudinary connection test:", testResult)

    // Search for videos in your Cloudinary account
    const result = await cloudinary.search
      .expression("resource_type:video") // Only videos
      .max_results(10) // Limit to 10 videos
      .execute()

    const videos = result.resources.map((video: any) => ({
      publicId: video.public_id,
      secureUrl: video.secure_url,
      format: video.format,
      width: video.width,
      height: video.height,
      duration: video.duration,
      createdAt: video.created_at,
      folder: video.folder || "root"
    }))

    return NextResponse.json({
      success: true,
      count: videos.length,
      videos,
      connectionTest: testResult
    })
  } catch (error) {
    console.error("Error fetching videos from Cloudinary:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch videos from Cloudinary",
        details: error instanceof Error ? error.message : String(error),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      { status: 500 }
    )
  }
}
