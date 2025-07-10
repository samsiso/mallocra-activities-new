"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink } from "lucide-react"

export default function ViewImageKitPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [testUrl, setTestUrl] = useState("")

  // Common ImageKit patterns
  const commonPaths = [
    "/activities/",
    "/activity-images/",
    "/images/",
    "/uploads/",
    "/"
  ]

  const checkImageUrl = (url: string) => {
    const img = new Image()
    img.onload = () => {
      setImageUrls(prev => [...prev, url])
    }
    img.onerror = () => {
      console.log("Failed to load:", url)
    }
    img.src = url
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const tryCommonPaths = () => {
    // Try some common image names
    const commonNames = [
      "beach-activity",
      "sailing",
      "hiking",
      "diving",
      "tour",
      "mallorca",
      "activity-1",
      "image-1",
      "IMG_001"
    ]

    commonPaths.forEach(path => {
      commonNames.forEach(name => {
        const extensions = [".jpg", ".jpeg", ".png", ".webp"]
        extensions.forEach(ext => {
          const url = `https://ik.imagekit.io/s8hw8aygd${path}${name}${ext}`
          checkImageUrl(url)
        })
      })
    })
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">ImageKit Images Viewer</h1>

      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold">Test Specific URL</h2>
        <div className="flex gap-2">
          <Input
            value={testUrl}
            onChange={e => setTestUrl(e.target.value)}
            placeholder="https://ik.imagekit.io/s8hw8aygd/your-image.jpg"
            className="flex-1"
          />
          <Button onClick={() => checkImageUrl(testUrl)}>Test URL</Button>
        </div>

        <div className="mt-4">
          <Button onClick={tryCommonPaths} variant="outline">
            Scan Common Paths
          </Button>
        </div>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">How to find your images:</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600">
          <li>Go to ImageKit dashboard</li>
          <li>Click on any uploaded image</li>
          <li>Copy the URL from the sidebar</li>
          <li>Paste it in the test box above</li>
        </ol>
      </div>

      {imageUrls.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Found Images</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="group relative">
                <img
                  src={url}
                  alt=""
                  className="h-40 w-full rounded object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyUrl(url)}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(url, "_blank")}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="mb-2 font-semibold">Image URLs:</h4>
            <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-xs">
              {imageUrls.join("\n")}
            </pre>
          </div>
        </Card>
      )}
    </div>
  )
}
