"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function QuickImportPage() {
  const [urls, setUrls] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleImport = async () => {
    setLoading(true)
    const urlList = urls.split("\n").filter(url => url.trim())

    try {
      // Import each URL
      for (const url of urlList) {
        const response = await fetch("/api/import-from-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, folder: "activities" })
        })

        const result = await response.json()
        setResults(prev => [...prev, result])
      }
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Quick Image Import</h1>

      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">Import Images from URLs</h2>
        <p className="mb-4 text-sm text-gray-600">
          Paste image URLs (one per line) from JustSummers or any other source
        </p>

        <textarea
          value={urls}
          onChange={e => setUrls(e.target.value)}
          placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg"
          className="mb-4 h-40 w-full rounded-md border p-3"
        />

        <Button
          onClick={handleImport}
          disabled={loading || !urls.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Images"
          )}
        </Button>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Import Results</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="rounded bg-gray-50 p-3">
                {result.success ? (
                  <div className="text-green-600">
                    ✅ Imported: {result.publicId}
                  </div>
                ) : (
                  <div className="text-red-600">❌ Failed: {result.error}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
