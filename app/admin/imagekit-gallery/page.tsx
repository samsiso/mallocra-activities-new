"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, ExternalLink, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

// Your ImageKit uploaded images
const IMAGEKIT_IMAGES = [
  "https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?updatedAt=1751645631722"
  // We'll discover more below
]

export default function ImageKitGalleryPage() {
  const [images, setImages] = useState<string[]>(IMAGEKIT_IMAGES)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")

  // Common WhatsApp image patterns
  const discoverMoreImages = () => {
    setLoading(true)
    const baseUrl = "https://ik.imagekit.io/s8hw8aygd/Activites/"
    const patterns = [
      // WhatsApp patterns
      "WhatsApp%20Image%202025-06-15%20at%2021.17.",
      "WhatsApp%20Image%202025-06-14%20at%20",
      "WhatsApp%20Image%202025-06-13%20at%20",
      "WhatsApp%20Image%202025-06-16%20at%20",
      "WhatsApp%20Image%202025-06-17%20at%20"
    ]

    const times = [
      "21.17",
      "21.18",
      "21.19",
      "21.20",
      "20.",
      "19.",
      "18.",
      "17."
    ]
    const numbers = ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]

    patterns.forEach(pattern => {
      times.forEach(time => {
        numbers.forEach(num => {
          const url = `${baseUrl}${pattern}${time}${num}.jpeg`
          const img = new Image()
          img.onload = () => {
            setImages(prev => {
              if (!prev.includes(url)) {
                return [...prev, url]
              }
              return prev
            })
          }
          img.src = url
        })
      })
    })

    setTimeout(() => setLoading(false), 3000)
  }

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const addCustomImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl])
      setNewImageUrl("")
    }
  }

  const generateOptimizedUrl = (url: string, width: number) => {
    // Add ImageKit transformations
    const baseUrl = url.split("?")[0]
    return `${baseUrl}?tr=w-${width},q-80,f-auto`
  }

  useEffect(() => {
    // Try to discover more images on load
    discoverMoreImages()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Your ImageKit Gallery</h1>

      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold">Add More Images</h2>
        <div className="mb-4 flex gap-2">
          <Input
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            placeholder="Paste another ImageKit URL here..."
            className="flex-1"
          />
          <Button onClick={addCustomImage}>Add</Button>
        </div>

        <Button
          onClick={discoverMoreImages}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Searching for more images...
            </>
          ) : (
            "Search for More WhatsApp Images"
          )}
        </Button>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          Found {images.length} Images
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((url, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={generateOptimizedUrl(url, 400)}
                  alt={`Activity ${index + 1}`}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Image {index + 1}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(url, index)}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(url, "_blank")}
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Original URL:</p>
                  <code className="block break-all rounded bg-gray-100 p-2 text-xs">
                    {url}
                  </code>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Optimized URLs:</p>
                  <div className="space-y-1">
                    <code className="block break-all rounded bg-blue-50 p-1 text-xs">
                      Mobile: {generateOptimizedUrl(url, 640)}
                    </code>
                    <code className="block break-all rounded bg-blue-50 p-1 text-xs">
                      Desktop: {generateOptimizedUrl(url, 1200)}
                    </code>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-gray-50 p-6">
        <h3 className="mb-3 font-semibold">How to Use These Images</h3>
        <div className="space-y-2 text-sm">
          <p>
            1. <strong>Copy the URL</strong> of the image you want to use
          </p>
          <p>
            2. <strong>Use in your activities</strong> when creating/editing
          </p>
          <p>
            3. <strong>Optimized versions</strong> are automatically generated
            with transformations
          </p>

          <div className="mt-4 rounded bg-white p-3">
            <p className="mb-2 font-medium">Example usage in code:</p>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              {`<img src="${generateOptimizedUrl(images[0] || "", 800)}" alt="Activity" />`}
            </code>
          </div>
        </div>
      </Card>
    </div>
  )
}
