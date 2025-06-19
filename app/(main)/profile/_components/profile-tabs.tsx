"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Calendar,
  Heart,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Languages
} from "lucide-react"
import { SelectProfile } from "@/db/schema"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Glassmorphism card component
function GlassCard({
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

interface ProfileTabsProps {
  userId: string
  profile: SelectProfile | null
}

export default function ProfileTabs({ userId, profile }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("personal")

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <GlassCard className="p-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                    : "text-white hover:bg-white/10"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "personal" && <PersonalInfoTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "favorites" && <FavoritesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </motion.div>
    </div>
  )
}

function PersonalInfoTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">
          Personal Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              First Name
            </label>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-white">
              Alex
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Last Name
            </label>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-white">
              Rodriguez
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Email Address
            </label>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-white">
              alex.rodriguez@email.com
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Phone Number
            </label>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-white/70">
              +34 123 456 789
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white/70">
              Address
            </label>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-white/70">
              Palma de Mallorca, Spain
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
            Edit Information
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Verify Email
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}

function BookingsTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">Recent Bookings</h3>

        <div className="py-12 text-center">
          <Calendar className="mx-auto mb-4 size-16 text-white/30" />
          <h4 className="mb-2 text-lg font-bold text-white">
            No Recent Bookings
          </h4>
          <p className="mb-6 text-white/70">
            Your booking history will appear here once you start booking
            activities.
          </p>
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
            Browse Activities
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}

function FavoritesTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">
          Favorite Activities
        </h3>

        <div className="py-12 text-center">
          <Heart className="mx-auto mb-4 size-16 text-white/30" />
          <h4 className="mb-2 text-lg font-bold text-white">
            No Favorites Yet
          </h4>
          <p className="mb-6 text-white/70">
            Start adding activities to your favorites to see them here.
          </p>
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
            Explore Activities
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}

function SettingsTab() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  })

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">Account Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-yellow-400" />
              <div>
                <div className="font-medium text-white">Language</div>
                <div className="text-sm text-white/70">
                  Choose your preferred language
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white"
            >
              English
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-yellow-400" />
              <div>
                <div className="font-medium text-white">Location</div>
                <div className="text-sm text-white/70">
                  Update your location preferences
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white"
            >
              Mallorca
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="size-5 text-yellow-400" />
              ) : (
                <Sun className="size-5 text-yellow-400" />
              )}
              <div>
                <div className="font-medium text-white">Theme</div>
                <div className="text-sm text-white/70">
                  Choose light or dark mode
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Dark" : "Light"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Notification Settings */}
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-yellow-400" />
              <div>
                <div className="font-medium text-white">
                  Email Notifications
                </div>
                <div className="text-sm text-white/70">
                  Booking confirmations and updates
                </div>
              </div>
            </div>
            <Button
              variant={notifications.email ? "default" : "outline"}
              size="sm"
              className={
                notifications.email
                  ? "bg-green-600 text-white"
                  : "border-white/30 text-white"
              }
              onClick={() =>
                setNotifications(prev => ({ ...prev, email: !prev.email }))
              }
            >
              {notifications.email ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-yellow-400" />
              <div>
                <div className="font-medium text-white">SMS Notifications</div>
                <div className="text-sm text-white/70">
                  Important updates via text message
                </div>
              </div>
            </div>
            <Button
              variant={notifications.sms ? "default" : "outline"}
              size="sm"
              className={
                notifications.sms
                  ? "bg-green-600 text-white"
                  : "border-white/30 text-white"
              }
              onClick={() =>
                setNotifications(prev => ({ ...prev, sms: !prev.sms }))
              }
            >
              {notifications.sms ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-yellow-400" />
              <div>
                <div className="font-medium text-white">Push Notifications</div>
                <div className="text-sm text-white/70">
                  App notifications on your device
                </div>
              </div>
            </div>
            <Button
              variant={notifications.push ? "default" : "outline"}
              size="sm"
              className={
                notifications.push
                  ? "bg-green-600 text-white"
                  : "border-white/30 text-white"
              }
              onClick={() =>
                setNotifications(prev => ({ ...prev, push: !prev.push }))
              }
            >
              {notifications.push ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Privacy & Security */}
      <GlassCard>
        <h3 className="mb-6 text-xl font-bold text-white">
          Privacy & Security
        </h3>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
          >
            <Shield className="mr-3 size-5" />
            Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
          >
            <CreditCard className="mr-3 size-5" />
            Payment Methods
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
          >
            <Bell className="mr-3 size-5" />
            Privacy Settings
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
