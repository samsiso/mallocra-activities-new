/*
<ai_context>
WeatherWidget component extracted from landing page.
Provides live weather information display with condition icons.
Positioned as a floating widget in the UI.
</ai_context>
*/

"use client"

import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: "sunny" | "partly-cloudy" | "rainy"
  humidity: number
  windSpeed: number
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: "sunny" | "partly-cloudy" | "rainy"
  }>
}

interface WeatherWidgetProps {
  weatherData: WeatherData
}

export function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="size-6 text-yellow-400" />
      case "partly-cloudy":
        return <Cloud className="size-6 text-gray-400" />
      case "rainy":
        return <CloudRain className="size-6 text-blue-400" />
      default:
        return <Sun className="size-6 text-yellow-400" />
    }
  }

  return (
    <div className="fixed-widget-container bottom-4 left-4 z-30 max-w-sm">
      <div className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:bg-gray-900/90">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weatherData.condition)}
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {weatherData.temperature}°C
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {weatherData.location}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-1">
            <Thermometer className="size-3 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">
              Humidity: {weatherData.humidity}%
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="size-3 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">
              Wind: {weatherData.windSpeed} km/h
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            3-Day Forecast
          </div>
          <div className="space-y-1">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {day.day}
                </span>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(day.condition)}
                  <span className="text-gray-900 dark:text-white">
                    {day.high}°/{day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
