import { supabaseAdminClient } from "./supabase-admin"

export interface StorageMetadata {
  id: string
  name: string
  url: string
  size: number
  type: string
  createdAt: string
}

/**
 * Supabase Storage Service - FREE with your existing plan!
 * No additional costs, uses your existing Supabase account
 */
export const SupabaseStorage = {
  /**
   * Upload image to Supabase Storage
   */
  async uploadImage(
    file: File,
    folder: string = "activities"
  ): Promise<StorageMetadata> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabaseAdminClient.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl }
    } = supabaseAdminClient.storage.from("images").getPublicUrl(filePath)

    return {
      id: data.path,
      name: file.name,
      url: publicUrl,
      size: file.size,
      type: file.type,
      createdAt: new Date().toISOString()
    }
  },

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(
    path: string,
    options?: {
      width?: number
      height?: number
      quality?: number
    }
  ): string {
    const {
      data: { publicUrl }
    } = supabaseAdminClient.storage.from("images").getPublicUrl(path)

    // Add transformation parameters
    const params = new URLSearchParams()
    if (options?.width) params.append("width", options.width.toString())
    if (options?.height) params.append("height", options.height.toString())
    if (options?.quality) params.append("quality", options.quality.toString())

    return params.toString() ? `${publicUrl}?${params}` : publicUrl
  },

  /**
   * Delete image from storage
   */
  async deleteImage(path: string): Promise<boolean> {
    const { error } = await supabaseAdminClient.storage
      .from("images")
      .remove([path])

    return !error
  },

  /**
   * List all images in a folder
   */
  async listImages(folder: string = "activities") {
    const { data, error } = await supabaseAdminClient.storage
      .from("images")
      .list(folder, {
        limit: 100,
        offset: 0
      })

    if (error) throw error

    return (
      data?.map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        updatedAt: file.updated_at
      })) || []
    )
  }
}
