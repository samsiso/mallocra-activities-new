"use client"

/*
<ai_context>
Admin seeding page for populating the activities database.
This page provides buttons to seed and clear activities data for development/testing.
</ai_context>
*/

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  seedActivitiesAction,
  clearActivitiesAction
} from "@/actions/db/seed-activities-actions"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  const handleSeedActivities = async () => {
    setLoading(true)
    setMessage("")

    try {
      const result = await seedActivitiesAction()
      setMessage(result.message)
      setIsSuccess(result.isSuccess)
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleClearActivities = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all activities data? This cannot be undone."
      )
    ) {
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const result = await clearActivitiesAction()
      setMessage(result.message)
      setIsSuccess(result.isSuccess)
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Activities Database Seeding</h1>
        <p className="text-gray-600">
          Populate the activities database with sample data for development and
          testing.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Seed Activities Data</h2>
            <p className="mb-4 text-sm text-gray-600">
              This will populate the database with 8 sample activities including
              images, pricing, and availability data.
            </p>
            <Button
              onClick={handleSeedActivities}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Seeding..." : "Seed Activities Database"}
            </Button>
          </div>

          <hr />

          <div>
            <h2 className="mb-2 text-xl font-semibold">
              Clear Activities Data
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              This will remove all activities data from the database. Use with
              caution!
            </p>
            <Button
              onClick={handleClearActivities}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? "Clearing..." : "Clear All Activities"}
            </Button>
          </div>

          {message && (
            <div className="mt-6">
              <Badge
                variant={isSuccess ? "default" : "destructive"}
                className="mb-2"
              >
                {isSuccess ? "Success" : "Error"}
              </Badge>
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          After seeding, you can test the activities pages:
        </p>
        <div className="mt-2 space-x-4">
          <a href="/activities" className="text-blue-600 hover:underline">
            View Activities List
          </a>
          <a
            href="/activities/quad-bike-adventure"
            className="text-blue-600 hover:underline"
          >
            View Quad Bike Activity
          </a>
        </div>
      </div>
    </div>
  )
}
