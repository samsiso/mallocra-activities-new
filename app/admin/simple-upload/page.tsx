"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"

export default function SimpleUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("activity-images")
        .upload(fileName, file)

      if (!error && data) {
        const {
          data: { publicUrl }
        } = supabase.storage.from("activity-images").getPublicUrl(fileName)

        setImages(prev => [...prev, publicUrl])
      }
    }

    setUploading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Simple Supabase Upload</h1>

      <Card className="mb-8 p-6">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400">
            <Upload className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload images</p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </label>
      </Card>

      {uploading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="size-8 animate-spin" />
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt=""
              className="h-48 w-full rounded object-cover"
            />
          ))}
        </div>
      )}
    </div>
  )
}
