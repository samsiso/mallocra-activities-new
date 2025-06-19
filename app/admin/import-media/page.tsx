"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { importMediaFromUrlAction } from "@/actions/db/media-actions"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCheck, Link2, Upload } from "lucide-react"
import { SelectMedia } from "@/db/schema"

export default function ImportMediaPage() {
  const [urls, setUrls] = useState("")
  const [cloudinaryIds, setCloudinaryIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imported, setImported] = useState<SelectMedia[]>([])

  const handleBulkImport = async () => {
    setIsLoading(true)
    setError(null)

    const urlList = urls
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0)

    if (urlList.length === 0) {
      setError("Please enter at least one URL")
      setIsLoading(false)
      return
    }

    const results: SelectMedia[] = []

    for (const url of urlList) {
      try {
        const result = await importMediaFromUrlAction(url)

        if (result.isSuccess && result.data) {
          results.push(result.data)
        } else {
          console.error(`Failed to import ${url}: ${result.message}`)
        }
      } catch (err) {
        console.error(`Error importing ${url}:`, err)
      }
    }

    setImported(results)
    setCloudinaryIds(results.map(item => item.cloudinaryId))
    setIsLoading(false)

    if (results.length > 0) {
      setUrls("")
    } else {
      setError(
        "Failed to import any media. Please check the URLs and try again."
      )
    }
  }

  const copyCloudinaryIds = () => {
    navigator.clipboard.writeText(cloudinaryIds.join("\n"))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Import Media from URLs</h1>
        <p className="text-gray-500">
          Bulk import videos and images from Pixabay, Unsplash, or other sources
        </p>
      </div>

      <div className="rounded-xl border p-6 shadow-sm">
        <div className="mb-6">
          <label className="mb-2 block font-medium">
            Enter URLs (one per line)
          </label>
          <Textarea
            value={urls}
            onChange={e => setUrls(e.target.value)}
            placeholder="https://pixabay.com/videos/example-video-1.mp4&#10;https://pixabay.com/videos/example-video-2.mp4"
            className="min-h-32"
          />
        </div>

        <Button
          onClick={handleBulkImport}
          disabled={isLoading || !urls}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span>Importing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="size-4" />
              <span>Import Media</span>
            </div>
          )}
        </Button>

        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

        {imported.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Imported Media</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={copyCloudinaryIds}
                className="flex items-center gap-2"
              >
                <ClipboardCheck className="size-4" />
                Copy Cloudinary IDs
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {imported.map(media => (
                <div
                  key={media.id}
                  className="overflow-hidden rounded-lg border bg-gray-50"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.secureUrl}
                      alt="Imported image"
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.secureUrl}
                      className="aspect-video w-full object-cover"
                      controls
                      muted
                    />
                  )}

                  <div className="p-3">
                    <div className="mb-1 text-xs font-medium text-gray-500">
                      Cloudinary ID:
                    </div>
                    <div className="mb-2 truncate font-mono text-sm">
                      {media.cloudinaryId}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {media.type}
                      </div>
                      <a
                        href={media.secureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:underline"
                      >
                        <Link2 className="mr-1 size-3" />
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-lg font-medium">How to Use</h3>
              <p className="text-sm text-gray-600">
                Copy the Cloudinary IDs and update the <code>heroVideos</code>{" "}
                array in <code>app/(marketing)/page.tsx</code> with these IDs.
              </p>
              <div className="mt-4 rounded-md bg-gray-100 p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {`const heroVideos = [
  {
    cloudinaryId: "${cloudinaryIds[0] || "your_cloudinary_id_1"}",
    title: "Video title 1"
  },
  {
    cloudinaryId: "${cloudinaryIds[1] || "your_cloudinary_id_2"}",
    title: "Video title 2"
  },
  // Add more videos as needed
]`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
