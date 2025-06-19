"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { importMediaFromUrlAction } from "@/actions/db/media-actions"
import { SelectMedia } from "@/db/schema/media-schema"
import { Link2 } from "lucide-react"

interface MediaImportProps {
  onImportComplete?: (media: SelectMedia) => void
  activityId?: string
  className?: string
  buttonText?: string
}

export function MediaImport({
  onImportComplete,
  activityId,
  className,
  buttonText = "Import Media"
}: MediaImportProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await importMediaFromUrlAction(url, title, activityId)

      if (result.isSuccess && result.data) {
        onImportComplete?.(result.data)
        setUrl("")
        setTitle("")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Import failed. Please check the URL and try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Input
            type="url"
            placeholder="Enter media URL (Pixabay, Unsplash, etc.)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="border-gray-700 bg-gray-800 text-white"
            required
          />
        </div>

        <div>
          <Input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !url}
          className="w-full bg-gray-800 text-white hover:bg-gray-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-gray-700 border-t-orange-500" />
              <span>Importing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link2 className="size-4" />
              <span>{buttonText}</span>
            </div>
          )}
        </Button>

        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </div>
    </form>
  )
}
