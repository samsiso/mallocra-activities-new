"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  populateRealActivitiesAction,
  verifyRealActivitiesAction
} from "@/actions/db/populate-real-activities"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function PopulateActivitiesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [verifyResult, setVerifyResult] = useState<any>(null)

  const handlePopulate = async () => {
    setLoading(true)
    setResult(null)
    setVerifyResult(null)

    try {
      const res = await populateRealActivitiesAction()
      setResult(res)

      // Auto-verify after population
      if (res.success) {
        const verifyRes = await verifyRealActivitiesAction()
        setVerifyResult(verifyRes)
      }
    } catch (error) {
      setResult({ success: false, error: "Failed to populate activities" })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      const res = await verifyRealActivitiesAction()
      setVerifyResult(res)
    } catch (error) {
      setVerifyResult({ success: false, error: "Failed to verify activities" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-pink-800 to-rose-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Populate Real Activities
        </h1>

        <Card className="mb-6 border-white/20 bg-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">10 Activities to Add</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-white/80">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Quad Bikes Magaluf - €159 (2.5 hours)</li>
              <li>Boat Tour Mallorca - €320 (4 hours)</li>
              <li>Formula Tours - Tour 1 - €79 pp (4.5 hours)</li>
              <li>Formula Tours - Tour 2 - €59 pp (2.5 hours)</li>
              <li>White Party Boat - Seasonal pricing</li>
              <li>Jet Ski 30-Minute Tour - €99</li>
              <li>Jet Ski 1-Hour Tour - €159</li>
              <li>Boat Rental Option 1 - €350/hour</li>
              <li>Boat Rental Option 2 - €380/hour</li>
              <li>Boat Rental Option 3 - €320/hour</li>
            </ol>
          </CardContent>
        </Card>

        <div className="mb-6 flex gap-4">
          <Button
            onClick={handlePopulate}
            disabled={loading}
            className="bg-pink-500 text-white hover:bg-pink-600"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Populating...
              </>
            ) : (
              "Populate Activities"
            )}
          </Button>

          <Button
            onClick={handleVerify}
            disabled={loading}
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            size="lg"
          >
            Verify Activities
          </Button>
        </div>

        {result && (
          <Card
            className={`mb-6 border-white/20 backdrop-blur-xl ${
              result.success ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-white">
                {result.success ? (
                  <>
                    <CheckCircle className="size-5" />
                    <span>
                      {result.message || "Activities populated successfully!"}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-5" />
                    <span>Error: {result.error}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {verifyResult && (
          <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Active Activities ({verifyResult.count || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verifyResult.success && verifyResult.data ? (
                <div className="space-y-2">
                  {verifyResult.data.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="rounded border border-white/20 bg-white/10 p-3 text-white"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-white/70">
                            {activity.category} • {activity.duration_minutes}{" "}
                            minutes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            €
                            {activity.activity_pricing?.[0]?.base_price ||
                              "TBD"}
                          </p>
                          <p className="text-xs text-white/70">
                            {activity.is_active ? "✓ Active" : "✗ Inactive"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No data or error occurred</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
