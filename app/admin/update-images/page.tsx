"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, Boat, Image as ImageIcon } from "lucide-react"
import { updateBoatActivitiesWithRealImages } from "@/actions/db/update-boat-activities-images"

export default function UpdateImagesPage() {
  const [updating, setUpdating] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleUpdateBoatImages = async () => {
    setUpdating(true)
    setResult(null)

    try {
      const res = await updateBoatActivitiesWithRealImages()
      setResult(res)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to update images"
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Update Activity Images</h1>

      <Alert className="mb-8">
        <AlertDescription>
          <p className="mb-2 font-semibold">🖼️ Found Your ImageKit Image!</p>
          <p>
            We found your "SUNCHASERS" boat rental image. This professional
            promotional image will be applied to all boat-related activities.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Boat Activities Update */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Boat className="size-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Boat Activities</h2>
          </div>

          <div className="mb-4">
            <p className="mb-3 text-sm text-gray-600">
              Update these activities with your ImageKit boat image:
            </p>
            <ul className="ml-4 space-y-1 text-sm">
              <li>• Boat Tour Mallorca</li>
              <li>• Boat Rental Option 1</li>
              <li>• Boat Rental Option 2</li>
              <li>• Boat Rental Option 3</li>
              <li>• White Party Boat</li>
              <li>• Any other boat/sailing/yacht activities</li>
            </ul>
          </div>

          <div className="mb-4 rounded-lg border bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium">Preview:</p>
            <img
              src="https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?tr=w-400,h-300,c-fill,q-80,f-auto"
              alt="SUNCHASERS Boat"
              className="w-full max-w-sm rounded"
            />
          </div>

          <Button
            onClick={handleUpdateBoatImages}
            disabled={updating}
            className="w-full"
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Updating boat activities...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 size-4" />
                Update All Boat Activities
              </>
            )}
          </Button>

          {result && (
            <div
              className={`mt-4 rounded p-4 ${result.success ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle className="size-5 text-green-600" />
                    <span className="text-green-800">{result.message}</span>
                  </>
                ) : (
                  <span className="text-red-800">Error: {result.error}</span>
                )}
              </div>

              {result.results && (
                <div className="mt-3 text-sm">
                  <p className="mb-1 font-medium">Details:</p>
                  <ul className="space-y-1">
                    {result.results.map((r: any, i: number) => (
                      <li
                        key={i}
                        className={
                          r.success ? "text-green-700" : "text-red-700"
                        }
                      >
                        {r.success ? "✅" : "❌"} {r.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Future: Other Activity Categories */}
        <Card className="p-6 opacity-50">
          <div className="mb-4 flex items-center gap-3">
            <ImageIcon className="size-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600">
              Other Activities
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Upload more images to ImageKit for: • Quad biking activities •
            Formula tours • Jet ski rentals • Other adventures
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <Alert>
          <AlertDescription>
            <p className="mb-2 font-medium">💡 Next Steps:</p>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              <li>Check the activities page to see the updated images</li>
              <li>Upload more activity-specific images to ImageKit</li>
              <li>Use descriptive filenames for easy matching</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
