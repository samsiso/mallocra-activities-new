"use client"

import { motion } from "framer-motion"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "windy"
  humidity: number
  windSpeed: number
  forecast?: string
  warning?: string
}

export interface WeatherWidgetProps {
  weather: WeatherData
  activityType?: "outdoor" | "indoor" | "water"
  compact?: boolean
  className?: string
}

export function WeatherWidget({
  weather,
  activityType = "outdoor",
  compact = false,
  className
}: WeatherWidgetProps) {
  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    windy: Wind
  }

  const WeatherIcon = weatherIcons[weather.condition]

  const getWeatherSuitability = () => {
    if (activityType === "indoor") return "excellent"

    if (weather.condition === "rainy") {
      return activityType === "water" ? "good" : "poor"
    }

    if (weather.condition === "windy" && weather.windSpeed > 30) {
      return "moderate"
    }

    if (weather.condition === "sunny" && weather.temperature > 30) {
      return activityType === "water" ? "excellent" : "moderate"
    }

    return "good"
  }

  const suitability = getWeatherSuitability()
  const suitabilityConfig = {
    excellent: {
      color: "text-green-400",
      bg: "bg-green-400/10",
      label: "Perfect conditions"
    },
    good: {
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      label: "Good conditions"
    },
    moderate: {
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      label: "Fair conditions"
    },
    poor: { color: "text-red-400", bg: "bg-red-400/10", label: "Check weather" }
  }

  const config = suitabilityConfig[suitability]

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5",
          config.bg,
          className
        )}
      >
        <WeatherIcon className={cn("size-4", config.color)} />
        <span className="text-sm font-medium text-white">
          {weather.temperature}°C
        </span>
        <span className={cn("text-xs", config.color)}>{config.label}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-white">Weather Conditions</h4>
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: weather.condition === "windy" ? [0, 10, -10, 0] : 0,
              scale: weather.condition === "sunny" ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <WeatherIcon className={cn("size-12", config.color)} />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-white">
              {weather.temperature}°C
            </p>
            <p className="text-sm capitalize text-white/60">
              {weather.condition}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="size-4 text-blue-400" />
            <span className="text-white/80">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="size-4 text-white/60" />
            <span className="text-white/80">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Forecast */}
      {weather.forecast && (
        <p className="mt-3 text-sm text-white/60">{weather.forecast}</p>
      )}

      {/* Warning */}
      {weather.warning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-400/10 p-3"
        >
          <AlertTriangle className="size-4 shrink-0 text-yellow-400" />
          <p className="text-xs text-white/80">{weather.warning}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// Simplified weather badge
export function WeatherBadge({
  temperature,
  condition,
  className
}: {
  temperature: number
  condition: WeatherData["condition"]
  className?: string
}) {
  const icons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    windy: Wind
  }

  const Icon = icons[condition]

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon className="size-4 text-white/60" />
      <span className="text-sm font-medium text-white">{temperature}°C</span>
    </div>
  )
}
