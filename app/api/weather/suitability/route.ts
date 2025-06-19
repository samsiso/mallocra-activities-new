import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { location, activityType, isWeatherDependent } = await request.json()

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      )
    }

    // First get current weather data
    const weatherResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/weather/current`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location })
      }
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherResult = await weatherResponse.json()
    if (!weatherResult.isSuccess) {
      throw new Error(weatherResult.message)
    }

    const weather = weatherResult.data

    // Calculate suitability score based on activity type and weather
    let score = 50 // Base score
    let reason = "Weather conditions are acceptable for this activity."
    let recommendations: string[] = []

    if (!isWeatherDependent) {
      score = 85
      reason = "This indoor activity is not affected by weather conditions."
      return NextResponse.json({
        isSuccess: true,
        data: {
          suitable: true,
          score,
          reason,
          recommendations: ["Perfect for any weather conditions!"]
        }
      })
    }

    // Temperature scoring
    if (weather.temperature >= 18 && weather.temperature <= 28) {
      score += 20
    } else if (weather.temperature >= 15 && weather.temperature <= 32) {
      score += 10
    } else if (weather.temperature < 10 || weather.temperature > 35) {
      score -= 20
      recommendations.push("Dress appropriately for extreme temperatures")
    }

    // Wind scoring
    if (weather.windSpeed <= 15) {
      score += 15
    } else if (weather.windSpeed <= 25) {
      score += 5
    } else {
      score -= 15
      recommendations.push("Strong winds may affect outdoor activities")
    }

    // Visibility scoring
    if (weather.visibility >= 10) {
      score += 10
    } else if (weather.visibility >= 5) {
      score += 5
    } else {
      score -= 10
      recommendations.push("Limited visibility may impact experience")
    }

    // Activity-specific adjustments
    switch (activityType) {
      case "water_sports":
        if (weather.temperature < 20) {
          score -= 10
          recommendations.push(
            "Water temperature may be cold - consider wetsuit"
          )
        }
        if (weather.windSpeed > 20) {
          score -= 15
          recommendations.push("High winds not ideal for water activities")
        }
        break

      case "outdoor_adventure":
        if (weather.description.includes("rain")) {
          score -= 20
          recommendations.push("Rain may make trails slippery and unsafe")
        }
        if (weather.temperature > 30) {
          score -= 10
          recommendations.push("Bring extra water and sun protection")
        }
        break

      case "nature_tours":
        if (weather.visibility < 8) {
          score -= 15
          recommendations.push("Poor visibility may limit scenic views")
        }
        if (weather.description.includes("clear")) {
          score += 10
        }
        break

      case "cultural":
      case "food_experiences":
        // Less weather dependent
        score += 10
        break
    }

    // Weather condition scoring
    if (
      weather.description.includes("clear") ||
      weather.description.includes("sunny")
    ) {
      score += 15
      reason = "Excellent clear weather conditions for outdoor activities."
    } else if (weather.description.includes("partly")) {
      score += 10
      reason = "Good weather with some clouds."
    } else if (weather.description.includes("overcast")) {
      reason = "Overcast conditions but suitable for most activities."
    } else if (weather.description.includes("rain")) {
      score -= 25
      reason = "Rainy conditions may affect outdoor activities."
      recommendations.push("Consider rescheduling or indoor alternatives")
    } else if (weather.description.includes("storm")) {
      score -= 40
      reason = "Severe weather conditions not suitable for outdoor activities."
      recommendations.push("Activity may be cancelled for safety reasons")
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score))

    // Determine overall suitability
    const suitable = score >= 40

    if (score >= 80) {
      reason = "Excellent weather conditions for this activity!"
    } else if (score >= 60) {
      reason = "Good weather conditions for this activity."
    } else if (score >= 40) {
      reason =
        "Fair weather conditions - activity can proceed with precautions."
    } else {
      reason = "Poor weather conditions - consider rescheduling."
    }

    // Add general recommendations based on score
    if (score < 60) {
      recommendations.push("Check weather forecast before departure")
      recommendations.push("Bring appropriate clothing for conditions")
    }

    if (weather.temperature > 25) {
      recommendations.push("Bring sun protection and water")
    }

    if (weather.temperature < 15) {
      recommendations.push("Dress warmly in layers")
    }

    return NextResponse.json({
      isSuccess: true,
      message: "Weather suitability calculated successfully",
      data: {
        suitable,
        score,
        reason,
        recommendations:
          recommendations.length > 0
            ? recommendations
            : ["Enjoy your activity!"]
      }
    })
  } catch (error) {
    console.error("Weather suitability error:", error)

    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to calculate weather suitability",
        data: null
      },
      { status: 500 }
    )
  }
}
