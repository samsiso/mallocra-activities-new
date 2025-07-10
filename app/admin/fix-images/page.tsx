"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { updateAllActivityImages } from "@/actions/db/update-activity-images"

export default function FixImagesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleUpdateImages = async () => {
    setLoading(true)
    try {
      const result = await updateAllActivityImages()
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: "Failed to update images" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Fix Activity Images</h1>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Update All Activity Images
        </h2>
        <p className="mb-6 text-gray-600">
          This will update all activities with the proper uploaded images:
        </p>

        <ul className="mb-6 space-y-2 text-sm">
          <li>
            • Quad Bikes → Quad1.webp, Quad2.webp, Quad-3.webp, Quad-4.webp
          </li>
          <li>
            • Formula Racing → Forumal Tour 1.webp, forumla tour 2.webp, etc.
          </li>
          <li>• Jet Skiing → Jet-ski-2.webp, Jet-ski-3.webp, etc.</li>
          <li>
            • Boat Activities → boatwhiteparty1.webp, Heatwave-boat-4-1.webp,
            etc.
          </li>
        </ul>

        <Button
          onClick={handleUpdateImages}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Updating Images..." : "Update All Activity Images"}
        </Button>

        {result && (
          <div
            className={`mt-6 rounded p-4 ${result.success ? "bg-green-100" : "bg-red-100"}`}
          >
            {result.success ? (
              <div>
                <h3 className="font-semibold text-green-800">✅ Success!</h3>
                <p className="text-green-700">
                  Updated {result.updated} activities, skipped {result.skipped}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-red-800">❌ Error</h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
