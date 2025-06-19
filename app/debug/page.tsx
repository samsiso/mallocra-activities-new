"use client"

import { useState } from "react"
import { getActivitiesSupabaseAction } from "@/actions/db/activities-actions"

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const result = await getActivitiesSupabaseAction({
        limit: 10
      })
      setResult(result)
      console.log("Debug result:", result)
    } catch (error) {
      console.error("Debug error:", error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCategory = async (category: string) => {
    setLoading(true)
    try {
      const result = await getActivitiesSupabaseAction({
        category,
        limit: 10
      })
      setResult(result)
      console.log(`Debug result for category ${category}:`, result)
    } catch (error) {
      console.error("Debug error:", error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl text-white">
        <h1 className="mb-8 text-4xl font-bold">Debug Activities Data</h1>

        <div className="mb-8 space-x-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test All Activities"}
          </button>

          <button
            onClick={() => testCategory("water_sports")}
            disabled={loading}
            className="rounded bg-green-600 px-4 py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Test Water Sports
          </button>

          <button
            onClick={() => testCategory("land_adventures")}
            disabled={loading}
            className="rounded bg-yellow-600 px-4 py-2 font-semibold hover:bg-yellow-700 disabled:opacity-50"
          >
            Test Land Adventures
          </button>
        </div>

        {result && (
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Result:</h2>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
