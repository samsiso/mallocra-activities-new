"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react"
import { SupabaseStorage } from "@/lib/supabase-storage"

export default function UploadImagesPage() {
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const newResults = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const result = await SupabaseStorage.uploadImage(file, "activities")
        newResults.push({
          name: file.name,
          success: true,
          url: result.url
        })
      } catch (error) {
        newResults.push({
          name: file.name,
          success: false,
          error: error instanceof Error ? error.message : "Upload failed"
        })
      }
    }

    setResults(newResults)
    setUploading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Upload Images to Supabase</h1>
      <p className="mb-8 text-gray-600">
        Free storage with your existing Supabase account - no Cloudinary needed!
      </p>

      <Card className="mb-8 p-6">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Upload className="mx-auto mb-4 size-12 text-gray-400" />
          <p className="mb-4 text-sm text-gray-600">
            Click to select images or drag and drop
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              disabled={uploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Select Images"
                )}
              </span>
            </Button>
          </label>
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Upload Results</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded p-3 ${
                  result.success ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : (
                    <XCircle className="size-5 text-red-600" />
                  )}
                  <span className="text-sm">{result.name}</span>
                </div>
                {result.success && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
