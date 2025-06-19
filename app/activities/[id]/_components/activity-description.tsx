"use client"

/*
<ai_context>
Enhanced Activity Description - Dark Glassmorphism Theme
Features expandable sections with improved visual hierarchy and modern design.
Matches the new activity detail page design system with proper content organization.
</ai_context>
*/

import { useState } from "react"
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Calendar,
  Star,
  Globe,
  Users,
  Shield,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ActivityWithDetails } from "@/actions/db/activities-actions"

interface ActivityDescriptionProps {
  activity: ActivityWithDetails
}

// Enhanced glassmorphism card component
function GlassmorphismCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default function ActivityDescription({
  activity
}: ActivityDescriptionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "highlights"
  )

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Transform database data to match expected interface
  const sections = [
    {
      id: "highlights",
      title: "Activity Highlights",
      items: [
        "Skip-the-line access to Palma Cathedral",
        "Expert art historian guide",
        "Explore Gothic and Renaissance architecture",
        "Learn about 700 years of history",
        "Small group experience (max 25 people)"
      ],
      icon: Star,
      color: "text-yellow-400"
    },
    {
      id: "bring",
      title: "What to Bring",
      items: activity.whatToBring || [
        "Valid driving license",
        "Closed-toe shoes",
        "Long pants",
        "Sunglasses",
        "Sunscreen",
        "Camera"
      ],
      icon: Info,
      color: "text-blue-400"
    },
    {
      id: "requirements",
      title: "Important Information",
      items: [
        `Minimum age: ${activity.minAge} years`,
        `Maximum participants: ${activity.maxParticipants}`,
        "Not suitable for mobility impaired",
        "Cathedral dress code applies",
        "Tour operates in English and Spanish"
      ],
      icon: Shield,
      color: "text-green-400"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Main Description */}
      <GlassmorphismCard>
        <h2 className="mb-6 text-2xl font-bold text-white">
          About This Experience
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-white/80">
            {activity.description ||
              "Discover the magnificent Palma Cathedral, one of the finest examples of Gothic architecture in Europe. This guided tour takes you through centuries of history, from its construction beginning in 1229 to the modern art installations by renowned artists. Explore the soaring nave, intricate stone work, and learn about the cathedral's role in Mallorcan culture and history."}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
              <Clock className="size-5 text-yellow-400" />
              <div>
                <p className="font-medium text-white">
                  {Math.floor(activity.durationMinutes / 60)}h Duration
                </p>
                <p className="text-sm text-white/60">Guided experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
              <Users className="size-5 text-yellow-400" />
              <div>
                <p className="font-medium text-white">Small Groups</p>
                <p className="text-sm text-white/60">
                  Max {activity.maxParticipants} people
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
              <Globe className="size-5 text-yellow-400" />
              <div>
                <p className="font-medium text-white">Multi-language</p>
                <p className="text-sm text-white/60">English, Spanish</p>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {sections.map(section => (
          <GlassmorphismCard key={section.id} className="overflow-hidden p-0">
            <button
              className="flex w-full items-center justify-between p-6 text-left transition-all hover:bg-white/5"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon className={`size-6 ${section.color}`} />
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>
                <Badge className="border-white/30 bg-white/20 text-white/80">
                  {section.items.length}
                </Badge>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="size-5 text-white/60" />
              ) : (
                <ChevronDown className="size-5 text-white/60" />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="border-t border-white/10 px-6 pb-6">
                <ul className="mt-4 space-y-3">
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-white/80"
                    >
                      {section.id === "excluded" ? (
                        <X className="mt-0.5 size-4 shrink-0 text-red-400" />
                      ) : (
                        <Check className="mt-0.5 size-4 shrink-0 text-green-400" />
                      )}
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </GlassmorphismCard>
        ))}
      </div>

      {/* Meeting Point & Logistics */}
      <GlassmorphismCard>
        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
          <MapPin className="size-6 text-yellow-400" />
          Meeting Point & Logistics
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-black/20 p-4">
            <MapPin className="mt-1 size-5 shrink-0 text-yellow-400" />
            <div className="flex-1">
              <h4 className="mb-1 font-medium text-white">
                Plaça de la Seu, 07001 Palma
              </h4>
              <p className="mb-2 text-white/70">
                Meet at the main entrance of Palma Cathedral
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
                  <Clock className="mr-1 size-3" />
                  Arrive 15 min early
                </Badge>
                <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-400">
                  <MapPin className="mr-1 size-3" />
                  Easy to find
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h4 className="mb-2 font-medium text-white">
                🚇 Public Transport
              </h4>
              <p className="text-sm text-white/70">
                Bus lines 3, 20, 25 to Plaza de la Reina
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h4 className="mb-2 font-medium text-white">🚗 Parking</h4>
              <p className="text-sm text-white/70">
                Parc de la Mar underground parking nearby
              </p>
            </div>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Policies */}
      <GlassmorphismCard>
        <h3 className="mb-6 text-xl font-semibold text-white">
          Booking Policies
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <Calendar className="size-5 text-green-400" />
              Cancellation Policy
            </h4>
            <p className="text-sm leading-relaxed text-white/80">
              Free cancellation up to 24 hours before the activity starts.
              Cancel via email or phone for full refund.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <Shield className="size-5 text-blue-400" />
              Weather Policy
            </h4>
            <p className="text-sm leading-relaxed text-white/80">
              Tour operates in all weather conditions. Indoor cathedral tour
              continues regardless of weather.
            </p>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  )
}
