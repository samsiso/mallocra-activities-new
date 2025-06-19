"use server"

import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dfqvslgiy",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "image" or "video" or null for both
    const folder = searchParams.get("folder")
    const limit = parseInt(searchParams.get("limit") || "50")

    // Check if we have API credentials
    const hasApiCredentials = !!(
      process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
    )

    if (hasApiCredentials) {
      // Use full API if credentials are available
      const testResult = await cloudinary.api.ping()
      console.log("Cloudinary connection test:", testResult)

      // Build search expression
      let expression = "resource_type:image OR resource_type:video"

      if (type === "image") {
        expression = "resource_type:image"
      } else if (type === "video") {
        expression = "resource_type:video"
      }

      if (folder) {
        expression += ` AND folder:${folder}`
      }

      // Search for media files in Cloudinary
      const result = await cloudinary.search
        .expression(expression)
        .max_results(limit)
        .with_field("tags")
        .with_field("context")
        .execute()

      const mediaFiles = result.resources.map((resource: any) => {
        const isVideo = resource.resource_type === "video"
        const fileName =
          resource.public_id.split("/").pop() || resource.public_id
        const folder = resource.public_id.includes("/")
          ? resource.public_id.split("/")[0]
          : "root"

        return {
          id: resource.public_id,
          name: `${fileName}.${resource.format}`,
          type: isVideo ? "video" : "image",
          size: formatFileSize(resource.bytes || 0),
          sizeBytes: resource.bytes || 0,
          url: resource.secure_url,
          thumbnailUrl: isVideo
            ? `${resource.secure_url.replace(/\.[^/.]+$/, ".jpg")}` // Video thumbnail
            : resource.secure_url.replace(
                "/upload/",
                "/upload/c_thumb,w_300,h_200/"
              ),
          uploadedAt: resource.created_at,
          activityId: resource.context?.activity_id || undefined,
          activityName: resource.context?.activity_name || `${folder} media`,
          tags: resource.tags || [],
          isPublic: resource.access_mode !== "authenticated",
          cloudinaryId: resource.public_id,
          width: resource.width,
          height: resource.height,
          format: resource.format
        }
      })

      return NextResponse.json({
        success: true,
        count: mediaFiles.length,
        data: mediaFiles,
        connectionTest: testResult,
        source: "cloudinary_api"
      })
    } else {
      // Use known videos as fallback
      const cloudName = "dfqvslgiy"
      const knownVideoIds = [
        "lcwtw5eus5cvbcddrpqh",
        "rjuszbicymgknucnikjy",
        "gezph6p3putc1ljotgcp",
        "z93bie9boj1omghtlje2",
        "gfayerv3n0kf23m7tryo"
      ]

      let mediaFiles = knownVideoIds.map((id, index) => ({
        id,
        name: `mallorca-video-${index + 1}.mp4`,
        type: "video" as const,
        size: "25-45 MB",
        sizeBytes: 35000000, // Estimated
        url: `https://res.cloudinary.com/${cloudName}/video/upload/${id}.mp4`,
        thumbnailUrl: `https://res.cloudinary.com/${cloudName}/video/upload/${id}.jpg`,
        uploadedAt: new Date(
          Date.now() - (index + 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
        activityId: `activity-${index + 1}`,
        activityName: `Mallorca Activity ${index + 1}`,
        tags: ["mallorca", "activity", "video", "hero"],
        isPublic: true,
        cloudinaryId: id,
        width: 1920,
        height: 1080,
        format: "mp4"
      }))

      // Filter by type if specified
      if (type === "image") {
        mediaFiles = [] // No images in our known set
      }

      return NextResponse.json({
        success: true,
        count: mediaFiles.length,
        data: mediaFiles.slice(0, limit),
        source: "known_videos",
        message:
          "Using known videos from your existing setup. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local for full access."
      })
    }
  } catch (error) {
    console.error("Error fetching media from Cloudinary:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch media from Cloudinary",
        details: error instanceof Error ? error.message : String(error),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "dfqvslgiy",
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      { status: 500 }
    )
  }
}

/**
 * Helper function to format file sizes
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
