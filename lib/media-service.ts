import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export interface MediaMetadata {
  publicId: string
  url: string
  secureUrl: string
  format: string
  width: number
  height: number
  resourceType: "image" | "video"
  createdAt: string
}

/**
 * Media Service for handling external image and video storage
 * Uses Cloudinary to avoid consuming Supabase storage limits
 */
export const MediaService = {
  /**
   * Upload a file to Cloudinary
   * @param file File to upload
   * @param folder Folder path in Cloudinary
   * @returns Promise with media metadata
   */
  async uploadMedia(
    file: File,
    folder: string = "activities"
  ): Promise<MediaMetadata> {
    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file)

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          base64Data as string,
          {
            folder,
            resource_type: getResourceType(file.type)
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
      })

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
        createdAt: result.created_at
      }
    } catch (error) {
      console.error("Error uploading media to Cloudinary:", error)
      throw new Error("Failed to upload media")
    }
  },

  /**
   * Fetch media from an external URL and upload to Cloudinary
   * @param url External URL to fetch from
   * @param folder Folder path in Cloudinary
   * @returns Promise with media metadata
   */
  async fetchFromUrl(
    url: string,
    folder: string = "activities"
  ): Promise<MediaMetadata> {
    try {
      // Upload to Cloudinary from URL
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          url,
          {
            folder,
            fetch_format: "auto"
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
      })

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
        createdAt: result.created_at
      }
    } catch (error) {
      console.error("Error fetching media from URL:", error)
      throw new Error("Failed to fetch media from URL")
    }
  },

  /**
   * Get optimized image URL with transformations
   * @param publicId Cloudinary public ID
   * @param options Transformation options
   * @returns Optimized image URL
   */
  getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: "auto" | "webp" | "jpg" | "png"
    } = {}
  ): string {
    const { width, height, quality = 80, format = "auto" } = options

    let transformation = `q_${quality},f_${format}`
    if (width) transformation += `,w_${width}`
    if (height) transformation += `,h_${height}`

    return cloudinary.url(publicId, {
      transformation: [{ raw_transformation: transformation }],
      secure: true
    })
  },

  /**
   * Get video URL with transformations
   * @param publicId Cloudinary public ID
   * @param options Transformation options
   * @returns Optimized video URL
   */
  getOptimizedVideoUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      quality?: "auto" | "low" | "medium" | "high"
      format?: "mp4" | "webm"
    } = {}
  ): string {
    const { width, height, quality = "auto", format = "mp4" } = options

    let transformation = `q_${quality},f_${format}`
    if (width) transformation += `,w_${width}`
    if (height) transformation += `,h_${height}`

    return cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [{ raw_transformation: transformation }],
      secure: true
    })
  },

  /**
   * Delete media from Cloudinary
   * @param publicId Cloudinary public ID
   * @param resourceType Resource type (image or video)
   * @returns Promise with deletion result
   */
  async deleteMedia(
    publicId: string,
    resourceType: "image" | "video" = "image"
  ): Promise<boolean> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.destroy(
          publicId,
          { resource_type: resourceType },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
      })

      return result.result === "ok"
    } catch (error) {
      console.error("Error deleting media from Cloudinary:", error)
      throw new Error("Failed to delete media")
    }
  }
}

// Utility functions
function getResourceType(mimeType: string): "image" | "video" | "auto" {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  return "auto"
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
