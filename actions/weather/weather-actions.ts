"use server"

import { ActionState } from "@/types"

export interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  uvIndex?: number
  visibility: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  recommendation: string
}

export interface ActivityWeatherSuitability {
  suitable: boolean
  score: number // 0-100
  reason: string
  recommendations: string[]
}

/**
 * Get current weather for Mallorca locations
 */
export async function getWeatherForLocationAction(
  location: string
): Promise<ActionState<WeatherData>> {
  try {
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY
    if (!API_KEY) {
      return {
        isSuccess: false,
        message: "Weather API key not configured"
      }
    }

    // Mallorca location mapping
    const locationMap: Record<string, string> = {
      'Palma': 'Palma,ES',
      'Alcúdia': 'Alcudia,ES', 
      'Pollença': 'Pollensa,ES',
      'Sóller': 'Soller,ES',
      'Valldemossa': 'Valldemossa,ES',
      'Deià': 'Deia,ES',
      'Puerto Pollensa': 'Port de Pollenca,ES',
      'Cala Millor': 'Cala Millor,ES',
      'Magaluf': 'Magaluf,ES'
    }

    const searchLocation = locationMap[location] || `${location},Mallorca,ES`
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${API_KEY}&units=metric`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    // Calculate weather condition based on multiple factors
    const getWeatherCondition = (weather: any): WeatherData['condition'] => {
      const temp = weather.main.temp
      const windSpeed = weather.wind.speed
      const visibility = weather.visibility / 1000 // Convert to km
      const weatherMain = weather.weather[0].main.toLowerCase()

      // Poor conditions
      if (weatherMain.includes('rain') || weatherMain.includes('storm') || 
          windSpeed > 15 || visibility < 5) {
        return 'poor'
      }
      
      // Fair conditions  
      if (weatherMain.includes('cloud') || windSpeed > 10 || temp < 15 || temp > 35) {
        return 'fair'
      }
      
      // Good conditions
      if (temp >= 15 && temp <= 30 && windSpeed <= 10) {
        return 'good'
      }
      
      // Excellent conditions
      if (temp >= 20 && temp <= 28 && windSpeed <= 7 && weatherMain === 'clear') {
        return 'excellent'
      }
      
      return 'good'
    }

    const condition = getWeatherCondition(data)
    
    const getRecommendation = (condition: WeatherData['condition']) => {
      switch (condition) {
        case 'excellent': return 'Perfect weather for outdoor activities!'
        case 'good': return 'Great conditions for most activities'
        case 'fair': return 'Suitable for some activities, check specific requirements' 
        case 'poor': return 'Consider indoor activities or postpone outdoor plans'
        default: return 'Check current conditions before booking'
      }
    }

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert to km
      condition,
      recommendation: getRecommendation(condition)
    }

    return {
      isSuccess: true,
      message: `Weather data retrieved for ${location}`,
      data: weatherData
    }

  } catch (error) {
    console.error("Error fetching weather:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch weather data"
    }
  }
}

/**
 * Assess activity suitability based on weather
 */
export async function assessActivityWeatherSuitabilityAction(
  location: string,
  activityType: string,
  isWeatherDependent: boolean
): Promise<ActionState<ActivityWeatherSuitability>> {
  try {
    if (!isWeatherDependent) {
      return {
        isSuccess: true,
        message: "Activity not weather dependent",
        data: {
          suitable: true,
          score: 100,
          reason: "This activity can proceed in all weather conditions",
          recommendations: ["Activity operates rain or shine"]
        }
      }
    }

    const weatherResult = await getWeatherForLocationAction(location)
    if (!weatherResult.isSuccess) {
      return {
        isSuccess: false,
        message: "Could not assess weather suitability"
      }
    }

    const weather = weatherResult.data
    
    // Activity-specific weather requirements
    const activityRequirements: Record<string, {
      minTemp: number
      maxTemp: number  
      maxWind: number
      allowRain: boolean
      minVisibility: number
    }> = {
      'water_sports': { minTemp: 18, maxTemp: 40, maxWind: 20, allowRain: false, minVisibility: 5 },
      'sailing': { minTemp: 15, maxTemp: 35, maxWind: 25, allowRain: false, minVisibility: 8 },
      'hiking': { minTemp: 10, maxTemp: 32, maxWind: 30, allowRain: false, minVisibility: 3 },
      'cultural': { minTemp: 5, maxTemp: 40, maxWind: 50, allowRain: true, minVisibility: 1 },
      'food_wine': { minTemp: 10, maxTemp: 35, maxWind: 40, allowRain: true, minVisibility: 2 },
      'adventure': { minTemp: 15, maxTemp: 35, maxWind: 25, allowRain: false, minVisibility: 5 },
      'family_fun': { minTemp: 16, maxTemp: 32, maxWind: 20, allowRain: false, minVisibility: 3 }
    }

    const requirements = activityRequirements[activityType.toLowerCase()] || 
                        activityRequirements['adventure'] // Default

    // Calculate suitability score
    let score = 100
    const issues: string[] = []
    const recommendations: string[] = []

    // Temperature check
    if (weather.temperature < requirements.minTemp) {
      score -= 30
      issues.push(`Temperature too low (${weather.temperature}°C)`)
      recommendations.push("Consider postponing until warmer weather")
    } else if (weather.temperature > requirements.maxTemp) {
      score -= 20
      issues.push(`Very hot weather (${weather.temperature}°C)`)
      recommendations.push("Bring extra water and sun protection")
    }

    // Wind check  
    if (weather.windSpeed > requirements.maxWind) {
      score -= 25
      issues.push(`Strong winds (${weather.windSpeed} km/h)`)
      recommendations.push("Activity may be modified due to wind conditions")
    }

    // Rain check
    if (weather.description.toLowerCase().includes('rain') && !requirements.allowRain) {
      score -= 40
      issues.push("Rain expected")
      recommendations.push("Consider rescheduling for better weather")
    }

    // Visibility check
    if (weather.visibility < requirements.minVisibility) {
      score -= 20
      issues.push(`Low visibility (${weather.visibility}km)`)
      recommendations.push("Reduced visibility may affect activity quality")
    }

    // Add positive recommendations based on good conditions
    if (score > 80) {
      recommendations.push("Excellent weather conditions expected!")
    } else if (score > 60) {
      recommendations.push("Good weather conditions for this activity")
    }

    const suitable = score >= 50 // Threshold for suitability
    const reason = suitable 
      ? issues.length > 0 
        ? `Suitable with minor considerations: ${issues.join(', ')}`
        : "Perfect weather conditions for this activity"
      : `Not recommended: ${issues.join(', ')}`

    return {
      isSuccess: true,
      message: "Weather suitability assessed",
      data: {
        suitable,
        score: Math.max(0, score),
        reason,
        recommendations
      }
    }

  } catch (error) {
    console.error("Error assessing weather suitability:", error)
    return {
      isSuccess: false,
      message: "Failed to assess weather suitability"
    }
  }
}

/**
 * Get 5-day weather forecast for activity planning
 */
export async function getWeatherForecastAction(
  location: string,
  days: number = 5
): Promise<ActionState<WeatherData[]>> {
  try {
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY
    if (!API_KEY) {
      return {
        isSuccess: false,
        message: "Weather API key not configured"
      }
    }

    const locationMap: Record<string, string> = {
      'Palma': 'Palma,ES',
      'Alcúdia': 'Alcudia,ES', 
      'Pollença': 'Pollensa,ES',
      'Sóller': 'Soller,ES',
      'Valldemossa': 'Valldemossa,ES'
    }

    const searchLocation = locationMap[location] || `${location},Mallorca,ES`
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchLocation}&appid=${API_KEY}&units=metric&cnt=${days * 8}`, // 8 forecasts per day (3hr intervals)
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    )

    if (!response.ok) {
      throw new Error(`Weather forecast API error: ${response.status}`)
    }

    const data = await response.json()

    // Process forecast data - take one forecast per day (noon time)
    const dailyForecasts: WeatherData[] = []
    const processedDays = new Set<string>()

    for (const forecast of data.list) {
      const date = new Date(forecast.dt * 1000)
      const dateKey = date.toDateString()
      
      // Take the forecast closest to noon for each day
      if (!processedDays.has(dateKey) && date.getHours() >= 11 && date.getHours() <= 13) {
        processedDays.add(dateKey)
        
        dailyForecasts.push({
          temperature: Math.round(forecast.main.temp),
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          humidity: forecast.main.humidity,
          windSpeed: Math.round(forecast.wind.speed * 3.6),
          visibility: 10, // Forecast doesn't include visibility, use default
          condition: 'good', // Simplified for forecast
          recommendation: `${Math.round(forecast.main.temp)}°C, ${forecast.weather[0].description}`
        })
      }
      
      if (dailyForecasts.length >= days) break
    }

    return {
      isSuccess: true,
      message: `${dailyForecasts.length}-day weather forecast retrieved`,
      data: dailyForecasts
    }

  } catch (error) {
    console.error("Error fetching weather forecast:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch weather forecast"
    }
  }
} 