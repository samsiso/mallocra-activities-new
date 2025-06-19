"use client"

/*
<ai_context>
Activity location map component for activity detail pages.
Shows the meeting point location and provides directions.
Now connected to activities database.
</ai_context>
*/

import { MapPin, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityWithDetails } from "@/actions/db/activities-actions"

interface ActivityLocationMapProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

export default function ActivityLocationMap({
  latitude,
  longitude,
  title,
  address
}: ActivityLocationMapProps) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="size-5 text-orange-500" />
          Meeting Point
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-gray-300">Meeting Point: {title}</p>
          <p className="text-sm text-gray-400">{address}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="size-4" />
            <span>Arrive 15 minutes early</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Navigation className="mr-2 size-4" />
            Get Directions
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <MapPin className="mr-2 size-4" />
            View on Map
          </Button>
        </div>

        {/* Placeholder for map */}
        <div className="flex h-48 items-center justify-center rounded-lg bg-gray-700">
          <p className="text-sm text-gray-400">Interactive map coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
