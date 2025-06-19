"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadMediaAction } from "@/actions/db/media-actions"
import { SelectMedia } from "@/db/schema/media-schema"
import { OptimizedImage } from "./optimized-image"
import { OptimizedVideo } from "./optimized-video"

interface MediaUploadProps {
  onUploadComplete?: (media: SelectMedia) => void
  className?: string
  maxSize?: number // in MB
  accept?: string
  activityId?: string
  buttonText?: string
}

export function MediaUpload({
  onUploadComplete,
  className,
  maxSize = 10, // 10MB default
  accept = "image/*,video/*",
  activityId,
  buttonText = "Upload Media"
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    // Set preview
    const fileUrl = URL.createObjectURL(file)
    setPreview(fileUrl)
    setFileType(file.type.startsWith("image/") ? "image" : "video")

    // Upload file
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadMediaAction(file, activityId)

      if (result.isSuccess && result.data) {
        onUploadComplete?.(result.data)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const clearPreview = () => {
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview && (
        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-gray-700 border-t-orange-500" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="size-4" />
              <span>{buttonText}</span>
            </div>
          )}
        </Button>
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

      {preview && (
        <div className="relative mt-4 overflow-hidden rounded-md border border-gray-700">
          <button
            onClick={clearPreview}
            className="absolute right-2 top-2 z-10 rounded-full bg-gray-900/70 p-1"
          >
            <X className="size-4 text-white" />
          </button>

          {fileType === "image" && (
            <OptimizedImage
              src={preview}
              alt="Uploaded image"
              width={300}
              height={200}
              className="rounded-md"
            />
          )}

          {fileType === "video" && (
            <OptimizedVideo
              src={preview}
              width={300}
              height={200}
              controls
              className="rounded-md"
            />
          )}
        </div>
      )}
    </div>
  )
}
