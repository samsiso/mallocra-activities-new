"use client"

import {
  Sun,
  Euro,
  Languages,
  Clock,
  Wifi,
  Phone,
  Car,
  Info
} from "lucide-react"

const quickTips = [
  {
    icon: Sun,
    title: "Best Time to Visit",
    content: "April-October for beaches, November-March for hiking",
    color: "text-yellow-400"
  },
  {
    icon: Euro,
    title: "Currency",
    content: "Euro (€) - Cards widely accepted",
    color: "text-green-400"
  },
  {
    icon: Languages,
    title: "Languages",
    content: "Spanish, Catalan, English widely spoken in tourist areas",
    color: "text-blue-400"
  },
  {
    icon: Clock,
    title: "Time Zone",
    content: "CET (UTC+1), Summer time UTC+2",
    color: "text-purple-400"
  },
  {
    icon: Wifi,
    title: "Internet",
    content: "Free WiFi in most hotels, cafes, and public areas",
    color: "text-cyan-400"
  },
  {
    icon: Phone,
    title: "Emergency",
    content: "112 for all emergencies, Tourist Police: 971 22 58 00",
    color: "text-red-400"
  },
  {
    icon: Car,
    title: "Getting Around",
    content: "Rental cars, buses, taxis - International license required",
    color: "text-orange-400"
  },
  {
    icon: Info,
    title: "Tourist Tax",
    content: "€1-4 per person/night depending on accommodation type",
    color: "text-rose-400"
  }
]

export default function TravelTipsWidget() {
  return (
    <section className="my-16">
      <div className="rounded-3xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Essential Travel Info
          </h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Quick tips and essential information to make your Mallorca trip
            smooth and enjoyable
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickTips.map((tip, index) => {
            const IconComponent = tip.icon
            return (
              <div
                key={index}
                className="rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <div className="mb-3 flex items-center">
                  <IconComponent className={`mr-2 size-5 ${tip.color}`} />
                  <h3 className="font-semibold text-white">{tip.title}</h3>
                </div>
                <p className="text-sm text-gray-300">{tip.content}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/contact"
            className="inline-flex items-center rounded-full bg-rose-500 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-600"
          >
            Need More Help? Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
