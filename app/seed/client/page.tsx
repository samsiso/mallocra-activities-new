"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { seedClientActivitiesAction } from "@/actions/db/seed-client-activities-actions"

export default function SeedClientActivitiesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSeedClientActivities = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await seedClientActivitiesAction()
      setResult(res)
      console.log("Seed result:", res)
    } catch (error) {
      console.error("Error seeding client activities:", error)
      setResult({
        isSuccess: false,
        message: "Failed to seed client activities",
        error: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Seed Client Activities
          </h1>
          <p className="text-gray-300">
            Populate the database with the 10 specific client activities
          </p>
        </div>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              Client Activities Database Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-4 text-sm text-gray-300">
                This will populate the Supabase database with these 10
                activities:
              </p>
              <ul className="mb-4 space-y-1 text-sm text-gray-400">
                <li>• Quad Bikes Magaluf (€159)</li>
                <li>• Boat Tour Mallorca (€320)</li>
                <li>• Formula Tours - Tour 1 (€79)</li>
                <li>• Formula Tours - Tour 2 (€59)</li>
                <li>• White Party Boat (Seasonal)</li>
                <li>• Jet Ski 30-Minute Tour (€99)</li>
                <li>• Jet Ski 1-Hour Tour (€159)</li>
                <li>• Boat Rental Option 1 (€350/hr)</li>
                <li>• Boat Rental Option 2 (€380/hr)</li>
                <li>• Boat Rental Option 3 (€320/hr)</li>
              </ul>
              <Button
                onClick={handleSeedClientActivities}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Seeding Activities...
                  </>
                ) : (
                  "Seed Client Activities"
                )}
              </Button>
            </div>

            {result && (
              <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                <div className="mb-2 flex items-center gap-2">
                  {result.isSuccess ? (
                    <CheckCircle className="size-5 text-green-400" />
                  ) : (
                    <AlertCircle className="size-5 text-red-400" />
                  )}
                  <Badge
                    variant={result.isSuccess ? "default" : "destructive"}
                    className={result.isSuccess ? "bg-green-600" : "bg-red-600"}
                  >
                    {result.isSuccess ? "Success" : "Error"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{result.message}</p>
                {result.data && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>
                      Created: {result.data.created}/{result.data.total}
                    </p>
                    {result.data.errors && result.data.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-red-400">Errors:</p>
                        <ul className="ml-4 list-disc">
                          {result.data.errors.map(
                            (error: string, index: number) => (
                              <li key={index} className="text-red-300">
                                {error}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {result?.isSuccess && (
              <div className="rounded-lg border border-green-600 bg-green-900/20 p-4">
                <h3 className="mb-2 font-semibold text-green-400">
                  Next Steps:
                </h3>
                <ul className="space-y-1 text-sm text-green-300">
                  <li>
                    • Check the activities page:{" "}
                    <a href="/activities" className="underline">
                      /activities
                    </a>
                  </li>
                  <li>
                    • Verify admin dashboard:{" "}
                    <a href="/admin/activities" className="underline">
                      /admin/activities
                    </a>
                  </li>
                  <li>• Test individual activity pages</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
