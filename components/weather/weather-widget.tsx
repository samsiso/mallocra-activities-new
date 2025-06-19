"use client"

import { useState, useEffect } from "react"
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  WeatherData,
  ActivityWeatherSuitability
} from "@/actions/weather/weather-actions"

interface WeatherWidgetProps {
  location: string
  activityType?: string
  isWeatherDependent?: boolean
  className?: string
  showSuitability?: boolean
}

export default function WeatherWidget({
  location,
  activityType = "adventure",
  isWeatherDependent = true,
  className,
  showSuitability = true
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [suitability, setSuitability] =
    useState<ActivityWeatherSuitability | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeatherData()
  }, [location, activityType, isWeatherDependent])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch weather data
      const weatherResponse = await fetch("/api/weather/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location })
      })

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherResult = await weatherResponse.json()
      if (weatherResult.isSuccess) {
        setWeather(weatherResult.data)

        // Fetch suitability assessment if needed
        if (showSuitability) {
          const suitabilityResponse = await fetch("/api/weather/suitability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location,
              activityType,
              isWeatherDependent
            })
          })

          if (suitabilityResponse.ok) {
            const suitabilityResult = await suitabilityResponse.json()
            if (suitabilityResult.isSuccess) {
              setSuitability(suitabilityResult.data)
            }
          }
        }
      } else {
        setError(weatherResult.message)
      }
    } catch (err) {
      setError("Failed to load weather information")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string, iconCode: string) => {
    if (condition === "excellent" || iconCode.includes("01")) {
      return <Sun className="size-8 text-yellow-400" />
    } else if (
      condition === "poor" ||
      iconCode.includes("09") ||
      iconCode.includes("10")
    ) {
      return <CloudRain className="size-8 text-blue-400" />
    } else {
      return <Cloud className="size-8 text-gray-400" />
    }
  }

  const getConditionColor = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "excellent":
        return "text-green-400 bg-green-400/20"
      case "good":
        return "text-blue-400 bg-blue-400/20"
      case "fair":
        return "text-yellow-400 bg-yellow-400/20"
      case "poor":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-400/20 border-green-400/30"
    if (score >= 60) return "text-blue-400 bg-blue-400/20 border-blue-400/30"
    if (score >= 40)
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
    return "text-red-400 bg-red-400/20 border-red-400/30"
  }

  if (loading) {
    return (
      <Card className={cn("border-gray-700 bg-gray-900/50 p-4", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-700"></div>
          <div className="h-8 w-1/2 rounded bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-3 rounded bg-gray-700"></div>
            <div className="h-3 w-5/6 rounded bg-gray-700"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className={cn("border-gray-700 bg-gray-900/50 p-4", className)}>
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="size-5" />
          <span className="text-sm">{error || "Weather data unavailable"}</span>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-gray-700 bg-gray-900/50",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition, weather.icon)}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {weather.temperature}°C
              </h3>
              <p className="text-sm capitalize text-gray-300">
                {weather.description}
              </p>
            </div>
          </div>

          <Badge
            className={cn("capitalize", getConditionColor(weather.condition))}
          >
            {weather.condition}
          </Badge>
        </div>
      </div>

      {/* Weather Details */}
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Wind className="size-4 text-blue-400" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Droplets className="size-4 text-blue-400" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Eye className="size-4 text-blue-400" />
            <span>{weather.visibility} km</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Thermometer className="size-4 text-blue-400" />
            <span>Feels like {weather.temperature}°C</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
          <p className="text-sm text-gray-300">{weather.recommendation}</p>
        </div>

        {/* Activity Suitability */}
        {showSuitability && suitability && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                Activity Suitability
              </span>
              <Badge className={getSuitabilityColor(suitability.score)}>
                {suitability.score}/100
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">{suitability.reason}</p>

              {suitability.recommendations.length > 0 && (
                <div className="space-y-1">
                  {suitability.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-400" />
                      <p className="text-xs text-gray-400">{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
