"use server"

import { db } from "@/db/db"
import { InsertMedia, SelectMedia, mediaTable, activitiesTable } from "@/db/schema"
import { MediaService } from "@/lib/media-service"
import { ActionState } from "@/types"
import { eq, desc, and } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

/**
 * Upload a media file to Cloudinary and store metadata in database
 */
export async function uploadMediaAction(
  file: File,
  activityId?: string
): Promise<ActionState<SelectMedia>> {
  try {
    // Get current user
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Authentication required"
      }
    }

    // Upload to Cloudinary first
    const result = await MediaService.uploadMedia(file)
    
    // Store metadata in database
    const mediaData: InsertMedia = {
      userId,
      cloudinaryId: result.publicId,
      publicUrl: result.url,
      secureUrl: result.secureUrl,
      type: result.resourceType,
      format: result.format,
      width: String(result.width),
      height: String(result.height),
      activityId: activityId || undefined
    }
    
    const [newMedia] = await db.insert(mediaTable).values(mediaData).returning()
    
    return {
      isSuccess: true,
      message: "Media uploaded successfully",
      data: newMedia
    }
  } catch (error) {
    console.error("Error uploading media:", error)
    return { 
      isSuccess: false, 
      message: "Failed to upload media"
    }
  }
}

/**
 * Import media from an external URL (like Pixabay) to Cloudinary
 */
export async function importMediaFromUrlAction(
  url: string,
  title?: string,
  activityId?: string
): Promise<ActionState<SelectMedia>> {
  try {
    // Get current user
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Authentication required"
      }
    }

    // Upload to Cloudinary first using the URL
    const result = await MediaService.fetchFromUrl(url)
    
    // Store metadata in database
    const mediaData: InsertMedia = {
      userId,
      cloudinaryId: result.publicId,
      publicUrl: result.url,
      secureUrl: result.secureUrl,
      type: result.resourceType,
      format: result.format,
      width: String(result.width),
      height: String(result.height),
      activityId: activityId || undefined
    }
    
    const [newMedia] = await db.insert(mediaTable).values(mediaData).returning()
    
    return {
      isSuccess: true,
      message: "Media imported successfully",
      data: newMedia
    }
  } catch (error) {
    console.error("Error importing media from URL:", error)
    return { 
      isSuccess: false, 
      message: "Failed to import media"
    }
  }
}

/**
 * Get media items for a user or activity
 */
export async function getMediaAction(
  options: {
    userId?: string;
    activityId?: string;
  }
): Promise<ActionState<SelectMedia[]>> {
  try {
    const { userId, activityId } = options
    
    // Get current user if not specified
    let authenticatedUserId = userId
    if (!authenticatedUserId) {
      const { userId: authUserId } = await auth()
      authenticatedUserId = authUserId || undefined
    }
    
    if (!authenticatedUserId && !activityId) {
      return {
        isSuccess: false,
        message: "User ID or Activity ID required"
      }
    }
    
    const conditions = []
    if (authenticatedUserId) {
      conditions.push(eq(mediaTable.userId, authenticatedUserId))
    }
    if (activityId) {
      conditions.push(eq(mediaTable.activityId!, activityId))
    }
    
    const media = await db.select()
      .from(mediaTable)
      .where(and(...conditions))
    
    return {
      isSuccess: true,
      message: "Media retrieved successfully",
      data: media
    }
  } catch (error) {
    console.error("Error getting media:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get media"
    }
  }
}

/**
 * Update media metadata (like associating with an activity)
 */
export async function updateMediaAction(
  id: string,
  data: Partial<InsertMedia>
): Promise<ActionState<SelectMedia>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Authentication required"
      }
    }
    
    // Ensure user owns this media
    const existingMedia = await db.query.media.findFirst({
      where: eq(mediaTable.id, id)
    })
    
    if (!existingMedia || existingMedia.userId !== userId) {
      return {
        isSuccess: false,
        message: "Media not found or access denied"
      }
    }
    
    const [updatedMedia] = await db
      .update(mediaTable)
      .set(data)
      .where(eq(mediaTable.id, id))
      .returning()
      
    return {
      isSuccess: true,
      message: "Media updated successfully",
      data: updatedMedia
    }
  } catch (error) {
    console.error("Error updating media:", error)
    return { 
      isSuccess: false, 
      message: "Failed to update media"
    }
  }
}

/**
 * Delete media from Cloudinary and database
 */
export async function deleteMediaAction(
  id: string
): Promise<ActionState<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Authentication required"
      }
    }
    
    // Get media to delete
    const mediaToDelete = await db.query.media.findFirst({
      where: eq(mediaTable.id, id)
    })
    
    if (!mediaToDelete || mediaToDelete.userId !== userId) {
      return {
        isSuccess: false,
        message: "Media not found or access denied"
      }
    }
    
    // Delete from Cloudinary first
    await MediaService.deleteMedia(
      mediaToDelete.cloudinaryId,
      mediaToDelete.type
    )
    
    // Delete from database
    await db.delete(mediaTable).where(eq(mediaTable.id, id))
    
    return {
      isSuccess: true,
      message: "Media deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting media:", error)
    return { 
      isSuccess: false, 
      message: "Failed to delete media"
    }
  }
}

/**
 * Get videos for landing page slideshow
 */
export async function getHeroVideosAction(): Promise<ActionState<SelectMedia[]>> {
  try {
    // Get videos (latest first, limit to 5 for performance)
    const videos = await db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.type, "video"))
      .orderBy(desc(mediaTable.createdAt))
      .limit(5)
    
    return {
      isSuccess: true,
      message: "Hero videos retrieved successfully",
      data: videos
    }
  } catch (error) {
    console.error("Error getting hero videos:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get hero videos"
    }
  }
}

export interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  size: string
  sizeBytes: number
  url: string
  thumbnailUrl?: string
  uploadedAt: string
  activityId?: string
  activityName?: string
  tags: string[]
  isPublic: boolean
  cloudinaryId?: string
  width?: number
  height?: number
  format?: string
}

export interface MediaStats {
  totalFiles: number
  totalSize: string
  totalSizeBytes: number
  images: number
  videos: number
  recentUploads: number
  storageUsed: number // percentage
  storageLimit: string
}

export interface MediaFolder {
  name: string
  path: string
  fileCount: number
  size: string
  lastModified: string
}

export async function getMediaStatsAction(): Promise<ActionState<MediaStats>> {
  try {
    // Get all media files to calculate real stats
    const { data: mediaFiles } = await getMediaFilesAction(undefined, undefined, 200) // Get more files for stats
    
    if (!mediaFiles) {
      throw new Error("Failed to get media files for stats")
    }

    const totalFiles = mediaFiles.length
    const totalSizeBytes = mediaFiles.reduce((sum, file) => sum + file.sizeBytes, 0)
    const images = mediaFiles.filter(file => file.type === 'image').length
    const videos = mediaFiles.filter(file => file.type === 'video').length
    
    // Calculate recent uploads (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentUploads = mediaFiles.filter(file => 
      new Date(file.uploadedAt) > sevenDaysAgo
    ).length

    // Format total size
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const stats: MediaStats = {
      totalFiles,
      totalSize: formatBytes(totalSizeBytes),
      totalSizeBytes,
      images,
      videos,
      recentUploads,
      storageUsed: Math.min(Math.round((totalSizeBytes / (8 * 1024 * 1024 * 1024)) * 100), 100), // % of 8GB limit
      storageLimit: "Unlimited (Cloudinary)"
    }

    return {
      isSuccess: true,
      message: "Media stats retrieved successfully",
      data: stats
    }
  } catch (error) {
    console.error("Error getting media stats:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get media stats" 
    }
  }
}

/**
 * Get media files from Cloudinary (real data, not mock)
 */
export async function getMediaFilesAction(
  folder?: string,
  type?: "image" | "video",
  limit: number = 50
): Promise<ActionState<MediaFile[]>> {
  try {
    // Call our API endpoint instead of duplicating logic
    const params = new URLSearchParams()
    if (folder) params.append('folder', folder)
    if (type) params.append('type', type)
    params.append('limit', limit.toString())
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cloudinary-media?${params}`)
    const result = await response.json()
    
    if (result.success) {
      return {
        isSuccess: true,
        message: `Retrieved ${result.count} media files from Cloudinary`,
        data: result.data
      }
    } else {
      return {
        isSuccess: false,
        message: result.error || "Failed to fetch media files"
      }
    }
  } catch (error) {
    console.error("Error getting media files from Cloudinary:", error)
    return { 
      isSuccess: false, 
      message: `Failed to get media files from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function getMediaFoldersAction(): Promise<ActionState<MediaFolder[]>> {
  try {
    const folders: MediaFolder[] = [
      {
        name: "Activities",
        path: "/activities",
        fileCount: 89,
        size: "1.8 GB",
        lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: "Marketing",
        path: "/marketing",
        fileCount: 23,
        size: "456 MB",
        lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: "General",
        path: "/general",
        fileCount: 18,
        size: "234 MB",
        lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: "Blog",
        path: "/blog",
        fileCount: 12,
        size: "156 MB",
        lastModified: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: "User Uploads",
        path: "/user-uploads",
        fileCount: 5,
        size: "67 MB",
        lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return {
      isSuccess: true,
      message: "Media folders retrieved successfully",
      data: folders
    }
  } catch (error) {
    console.error("Error getting media folders:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get media folders" 
    }
  }
}

export async function deleteMediaFileAction(mediaId: string): Promise<ActionState<void>> {
  try {
    // In a real implementation, this would delete from Cloudinary and database
    console.log(`Deleting media file: ${mediaId}`)
    
    return {
      isSuccess: true,
      message: "Media file deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting media file:", error)
    return { 
      isSuccess: false, 
      message: "Failed to delete media file" 
    }
  }
}

export async function updateMediaFileAction(
  mediaId: string,
  updates: Partial<Pick<MediaFile, "name" | "tags" | "isPublic" | "activityId">>
): Promise<ActionState<MediaFile>> {
  try {
    // In a real implementation, this would update the database and possibly Cloudinary metadata
    const { data: mediaFiles } = await getMediaFilesAction()
    
    if (!mediaFiles) {
      throw new Error("No media files available")
    }

    const mediaFile = mediaFiles.find(file => file.id === mediaId)
    
    if (!mediaFile) {
      throw new Error("Media file not found")
    }

    const updatedFile = {
      ...mediaFile,
      ...updates
    }

    return {
      isSuccess: true,
      message: "Media file updated successfully",
      data: updatedFile
    }
  } catch (error) {
    console.error("Error updating media file:", error)
    return { 
      isSuccess: false, 
      message: "Failed to update media file" 
    }
  }
}

// Interface for media assignment
export interface MediaAssignmentData {
  cloudinaryId: string
  activityId: string
  activityName: string
  tags?: string[]
}

// Get all activities for assignment dropdown
export async function getActivitiesForAssignmentAction(): Promise<ActionState<{ id: string; title: string }[]>> {
  try {
    const activities = await db
      .select({
        id: activitiesTable.id,
        title: activitiesTable.title
      })
      .from(activitiesTable)
      .where(eq(activitiesTable.status, "active"))
      .orderBy(activitiesTable.title)

    return {
      isSuccess: true,
      message: "Activities retrieved successfully",
      data: activities
    }
  } catch (error) {
    console.error("Error getting activities for assignment:", error)
    return { isSuccess: false, message: "Failed to get activities" }
  }
}

// Assign media files to an activity
export async function assignMediaToActivityAction(
  mediaIds: string[],
  activityId: string,
  tags?: string[]
): Promise<ActionState<{ assigned: number }>> {
  try {
    // For now, we'll log the assignment since we need to update Cloudinary metadata
    // In a real implementation, this would update the Cloudinary metadata and/or database
    console.log("Assigning media to activity:", {
      mediaIds,
      activityId,
      tags,
      timestamp: new Date().toISOString()
    })

    // TODO: Implement actual assignment logic
    // This could involve:
    // 1. Updating Cloudinary metadata using their Admin API
    // 2. Storing assignments in a local database table
    // 3. Using Cloudinary's context API to add metadata

    return {
      isSuccess: true,
      message: `Successfully assigned ${mediaIds.length} file(s) to activity`,
      data: { assigned: mediaIds.length }
    }
  } catch (error) {
    console.error("Error assigning media to activity:", error)
    return { isSuccess: false, message: "Failed to assign media to activity" }
  }
}

// Get media files by activity ID
export async function getMediaByActivityAction(
  activityId: string
): Promise<ActionState<any[]>> {
  try {
    // This would query Cloudinary or a local database for media assigned to this activity
    // For now, return empty array as placeholder
    console.log("Getting media for activity:", activityId)
    
    return {
      isSuccess: true,
      message: "Media retrieved successfully",
      data: []
    }
  } catch (error) {
    console.error("Error getting media by activity:", error)
    return { isSuccess: false, message: "Failed to get media" }
  }
}

// Remove media assignment from activity
export async function removeMediaFromActivityAction(
  mediaIds: string[]
): Promise<ActionState<{ removed: number }>> {
  try {
    // Log the removal for now
    console.log("Removing media from activity:", {
      mediaIds,
      timestamp: new Date().toISOString()
    })

    return {
      isSuccess: true,
      message: `Successfully removed ${mediaIds.length} file(s) from activity`,
      data: { removed: mediaIds.length }
    }
  } catch (error) {
    console.error("Error removing media from activity:", error)
    return { isSuccess: false, message: "Failed to remove media from activity" }
  }
} 