"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle } from "lucide-react"

export default function TestImageKitUrlPage() {
  const [copied, setCopied] = useState(false)

  // Based on your dashboard URL, the image ID is: 6867fdbf5c7cd75eb8480dbd
  // Let's try common URL patterns
  const possibleUrls = [
    `https://ik.imagekit.io/s8hw8aygd/6867fdbf5c7cd75eb8480dbd`,
    `https://ik.imagekit.io/s8hw8aygd/6867fdbf5c7cd75eb8480dbd.jpg`,
    `https://ik.imagekit.io/s8hw8aygd/6867fdbf5c7cd75eb8480dbd.png`,
    `https://ik.imagekit.io/s8hw8aygd/6867fdbf5c7cd75eb8480dbd.webp`,
    `https://ik.imagekit.io/s8hw8aygd/media/6867fdbf5c7cd75eb8480dbd`,
    `https://ik.imagekit.io/s8hw8aygd/files/6867fdbf5c7cd75eb8480dbd`
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Find Your ImageKit Image URL</h1>

      <Alert className="mb-8">
        <AlertDescription className="space-y-4">
          <p className="font-semibold">
            📸 How to get the actual image URL from ImageKit:
          </p>
          <ol className="ml-4 list-inside list-decimal space-y-2">
            <li>In your ImageKit dashboard, click on the image</li>
            <li>Look at the right sidebar</li>
            <li>
              Find the <strong>"URL"</strong> section (not the dashboard URL)
            </li>
            <li>
              Copy that URL - it should start with:{" "}
              <code className="rounded bg-gray-100 px-2 py-1">
                https://ik.imagekit.io/s8hw8aygd/...
              </code>
            </li>
          </ol>

          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="mb-2 text-sm font-medium">
              🔍 Look for these fields in the sidebar:
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                • <strong>File URL</strong> (this is what we need!)
              </li>
              <li>
                • <strong>File Path</strong>
              </li>
              <li>
                • <strong>File ID</strong>: 6867fdbf5c7cd75eb8480dbd
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold">Testing Possible URLs</h2>
        <p className="mb-4 text-sm text-gray-600">
          Based on your dashboard link, trying these URLs:
        </p>

        <div className="space-y-4">
          {possibleUrls.map((url, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <code className="flex-1 break-all text-xs">{url}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(url)}
                  className="ml-2"
                >
                  {copied ? (
                    <CheckCircle className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              <div className="mt-2">
                <img
                  src={url}
                  alt={`Test ${index + 1}`}
                  className="h-48 w-full max-w-md rounded border object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const errorDiv = document.getElementById(`error-${index}`)
                    if (errorDiv) errorDiv.style.display = "block"
                  }}
                  onLoad={e => {
                    const target = e.target as HTMLImageElement
                    const successDiv = document.getElementById(
                      `success-${index}`
                    )
                    if (successDiv) successDiv.style.display = "block"
                  }}
                />
                <div
                  id={`error-${index}`}
                  className="mt-2 hidden text-sm text-red-500"
                >
                  ❌ This URL format doesn't work
                </div>
                <div
                  id={`success-${index}`}
                  className="mt-2 hidden text-sm text-green-500"
                >
                  ✅ This URL works! Copy it above.
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-yellow-50 p-6">
        <h3 className="mb-2 font-semibold">💡 Quick Tip</h3>
        <p className="text-sm">
          In the ImageKit dashboard, the actual image URL is usually shown as:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            • <strong>File URL</strong> or <strong>URL</strong>
          </li>
          <li>
            • <strong>Direct URL</strong>
          </li>
          <li>
            • <strong>Original URL</strong>
          </li>
        </ul>
        <p className="mt-3 text-sm">
          It's different from the dashboard/detail page URL you shared.
        </p>
      </Card>
    </div>
  )
}
