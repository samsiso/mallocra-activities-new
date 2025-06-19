"use client"

import { Snowflake, Sun, Leaf, Flower } from "lucide-react"

const seasonalContent = [
  {
    season: "Spring",
    months: "Mar - May",
    icon: Flower,
    gradient: "from-green-400 to-blue-400",
    bgColor: "bg-green-500/10",
    highlights: [
      "Perfect hiking weather",
      "Wildflowers in bloom",
      "Fewer crowds",
      "Mild temperatures"
    ],
    temperature: "15-22°C",
    description:
      "Experience Mallorca's natural beauty as the island awakens from winter"
  },
  {
    season: "Summer",
    months: "Jun - Aug",
    icon: Sun,
    gradient: "from-yellow-400 to-orange-400",
    bgColor: "bg-yellow-500/10",
    highlights: [
      "Beach season",
      "Water sports",
      "Festivals & events",
      "Vibrant nightlife"
    ],
    temperature: "22-30°C",
    description:
      "Peak season for beaches, water activities, and bustling coastal towns"
  },
  {
    season: "Autumn",
    months: "Sep - Nov",
    icon: Leaf,
    gradient: "from-orange-400 to-red-400",
    bgColor: "bg-orange-500/10",
    highlights: [
      "Wine harvest season",
      "Perfect weather",
      "Cultural events",
      "Local festivals"
    ],
    temperature: "18-25°C",
    description:
      "Ideal weather with harvest festivals and cultural celebrations"
  },
  {
    season: "Winter",
    months: "Dec - Feb",
    icon: Snowflake,
    gradient: "from-blue-400 to-purple-400",
    bgColor: "bg-blue-500/10",
    highlights: [
      "Peaceful atmosphere",
      "Lower prices",
      "Mountain hiking",
      "Local culture"
    ],
    temperature: "10-16°C",
    description:
      "Quiet season perfect for cultural immersion and mountain adventures"
  }
]

export default function SeasonalContentSection() {
  return (
    <section className="my-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Mallorca Through the Seasons
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          Each season offers unique experiences - from spring wildflowers to
          summer beaches, autumn harvests to peaceful winter escapes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {seasonalContent.map(season => {
          const IconComponent = season.icon
          return (
            <div
              key={season.season}
              className={`group relative overflow-hidden rounded-2xl ${season.bgColor} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <div className="relative z-10">
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${season.gradient} p-3`}
                >
                  <IconComponent className="size-6 text-white" />
                </div>

                <div className="mb-4">
                  <h3 className="mb-1 text-2xl font-bold text-white">
                    {season.season}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {season.months} • {season.temperature}
                  </p>
                </div>

                <p className="mb-4 text-sm text-gray-300">
                  {season.description}
                </p>

                <div className="space-y-2">
                  {season.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-200"
                    >
                      <div
                        className={`mr-2 size-1.5 rounded-full bg-gradient-to-r ${season.gradient}`}
                      />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${season.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/blog/tag/seasonal-guide"
          className="inline-flex items-center rounded-full bg-white/10 px-8 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          View Seasonal Guides
        </a>
      </div>
    </section>
  )
}
