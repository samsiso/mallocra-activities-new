import ImageKit from "imagekit"

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
})

export interface ImageKitMetadata {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  size: number
  filePath: string
}

/**
 * ImageKit Service for easy image management
 * Better UI than Cloudinary for image uploads
 */
export const ImageKitService = {
  /**
   * Get optimized image URL
   */
  getOptimizedUrl(
    filePath: string,
    transformations?: Array<{
      width?: number
      height?: number
      quality?: number
      format?: "auto" | "webp" | "jpg" | "png"
    }>
  ): string {
    return imagekit.url({
      path: filePath,
      transformation: transformations
    })
  },

  /**
   * Upload image from file
   */
  async uploadFile(
    file: File,
    fileName: string,
    folder: string = "/activities"
  ): Promise<ImageKitMetadata> {
    const base64 = await fileToBase64(file)

    const response = await imagekit.upload({
      file: base64,
      fileName: fileName,
      folder: folder
    })

    return {
      fileId: response.fileId,
      name: response.name,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl || response.url,
      width: response.width || 0,
      height: response.height || 0,
      size: response.size,
      filePath: response.filePath
    }
  },

  /**
   * Get upload widget configuration
   * This creates a nice UI for uploading images
   */
  getUploadWidgetConfig() {
    return {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      authenticator: async () => {
        const response = await fetch("/api/imagekit-auth")
        return await response.json()
      }
    }
  }
}

// Helper function
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
