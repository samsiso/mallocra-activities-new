"use client"

import { useEffect, useState } from "react"
import GoogleMap from "@/components/ui/google-map"

export default function TestMapPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null)
    console.log(
      "API Key available:",
      !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    )
    console.log(
      "API Key (first 10 chars):",
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10)
    )
  }, [])

  return (
    <div className="min-h-screen bg-rose-400 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Google Maps Test</h1>

        <div className="mb-6 rounded-lg bg-gray-800 p-4">
          <h2 className="mb-2 text-xl text-white">Debug Info:</h2>
          <p className="text-green-400">
            API Key Available: {apiKey ? "Yes" : "No"}
          </p>
          {apiKey && (
            <p className="text-blue-400">
              API Key (first 10 chars): {apiKey.substring(0, 10)}...
            </p>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl text-white">
              Test Map 1 - Palma Bay Marina
            </h2>
            <GoogleMap
              latitude={39.5696}
              longitude={2.6502}
              address="Palma Bay Marina, Dock 15"
              markerTitle="Palma Bay Marina"
              height="400px"
              zoom={15}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl text-white">
              Test Map 2 - Default Location
            </h2>
            <GoogleMap
              address="Palma, Mallorca, Spain"
              markerTitle="Mallorca Activity Location"
              height="400px"
              zoom={12}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
