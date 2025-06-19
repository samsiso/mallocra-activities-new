"use client"

import { useState, useEffect } from "react"
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Eye,
  Droplets,
  ThermometerSun,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  visibility: number
  condition: "excellent" | "good" | "fair" | "poor"
  recommendation: string
}

interface ActivityWeatherSuitability {
  suitable: boolean
  score: number
  reason: string
  recommendations: string[]
}

interface WeatherDisplayProps {
  location: string
  activityType: string
  isWeatherDependent?: boolean
  className?: string
}

export function WeatherDisplay({
  location,
  activityType,
  isWeatherDependent = true,
  className = ""
}: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [suitability, setSuitability] =
    useState<ActivityWeatherSuitability | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch current weather
        const weatherResponse = await fetch("/api/weather/current", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location })
        })

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const weatherResult = await weatherResponse.json()
        if (!weatherResult.isSuccess) {
          throw new Error(weatherResult.message)
        }

        setWeather(weatherResult.data)

        // Fetch activity suitability
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load weather")
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [location, activityType, isWeatherDependent])

  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      excellent: <Sun className="size-5 text-yellow-400" />,
      good: <Sun className="size-5 text-orange-400" />,
      fair: <Cloud className="size-5 text-gray-400" />,
      poor: <CloudRain className="size-5 text-blue-400" />
    }
    return iconMap[condition] || <Sun className="size-5 text-yellow-400" />
  }

  const getSuitabilityBadge = (suitable: boolean, score: number) => {
    if (score >= 80) {
      return (
        <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
          <CheckCircle className="mr-1 size-3" />
          Excellent
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
          <CheckCircle className="mr-1 size-3" />
          Good
        </Badge>
      )
    } else if (score >= 40) {
      return (
        <Badge className="border-orange-500/30 bg-orange-500/20 text-orange-400">
          <AlertTriangle className="mr-1 size-3" />
          Fair
        </Badge>
      )
    } else {
      return (
        <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
          <XCircle className="mr-1 size-3" />
          Poor
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <Card
        className={`border-white/20 bg-white/10 backdrop-blur-sm ${className}`}
      >
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto mb-2 size-8 animate-spin rounded-full border-b-2 border-orange-400" />
            <p className="text-sm text-white/70">Loading weather...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card
        className={`border-white/20 bg-white/10 backdrop-blur-sm ${className}`}
      >
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-yellow-400" />
            <p className="text-sm text-white/70">
              {error || "Weather data unavailable"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`border-white/20 bg-white/10 backdrop-blur-sm ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          {getWeatherIcon(weather.condition)}
          Weather in {location}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ThermometerSun className="size-4 text-orange-400" />
            <span className="text-sm text-white/70">Temperature</span>
            <span className="font-medium text-white">
              {weather.temperature}°C
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="size-4 text-blue-400" />
            <span className="text-sm text-white/70">Wind</span>
            <span className="font-medium text-white">
              {weather.windSpeed} km/h
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-cyan-400" />
            <span className="text-sm text-white/70">Humidity</span>
            <span className="font-medium text-white">{weather.humidity}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="size-4 text-purple-400" />
            <span className="text-sm text-white/70">Visibility</span>
            <span className="font-medium text-white">
              {weather.visibility} km
            </span>
          </div>
        </div>

        {/* Weather Description */}
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-sm capitalize text-white/80">
            {weather.description}
          </p>
          <p className="text-xs text-white/60">{weather.recommendation}</p>
        </div>

        {/* Activity Suitability */}
        {suitability && (
          <div className="border-t border-white/20 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Activity Suitability
              </span>
              {getSuitabilityBadge(suitability.suitable, suitability.score)}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-white/70">{suitability.reason}</p>

              {suitability.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-white/80">
                    Recommendations:
                  </p>
                  {suitability.recommendations.map((rec, index) => (
                    <p key={index} className="text-xs text-white/60">
                      • {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
