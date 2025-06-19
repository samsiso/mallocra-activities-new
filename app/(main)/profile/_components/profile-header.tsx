"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Calendar,
  Star,
  MapPin,
  Award,
  Edit3,
  Camera,
  Shield
} from "lucide-react"
import { SelectProfile } from "@/db/schema"
import { motion } from "framer-motion"

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

interface ProfileHeaderProps {
  userId: string
  profile: SelectProfile | null
}

export default function ProfileHeader({ userId, profile }: ProfileHeaderProps) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)

  // Mock user data from Clerk (in real app, get from useUser)
  const mockUser = {
    firstName: "Alex",
    lastName: "Rodriguez",
    email: "alex.rodriguez@email.com",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-03-15"
  }

  // Mock stats
  const mockStats = {
    totalBookings: 12,
    completedActivities: 9,
    averageRating: 4.8,
    favoriteLocation: "Palma Bay",
    memberSince: "March 2024"
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const getMembershipBadge = (membership: string) => {
    switch (membership) {
      case "pro":
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black">
            <Award className="mr-1 size-3" />
            Pro Member
          </Badge>
        )
      default:
        return (
          <Badge className="border-white/30 bg-white/20 text-white">
            <Shield className="mr-1 size-3" />
            Free Member
          </Badge>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <GlassCard className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-500/5" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* User Info */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="size-24 border-4 border-white/30">
                <AvatarImage src={mockUser.imageUrl} />
                <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-amber-500 text-2xl font-bold text-black">
                  {getInitials(mockUser.firstName, mockUser.lastName)}
                </AvatarFallback>
              </Avatar>

              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 size-8 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setIsEditingAvatar(true)}
              >
                <Camera className="size-4" />
              </Button>
            </div>

            {/* User Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">
                  {mockUser.firstName} {mockUser.lastName}
                </h1>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-white hover:bg-white/10"
                >
                  <Edit3 className="size-4" />
                </Button>
              </div>

              <p className="text-white/70">{mockUser.email}</p>

              <div className="flex flex-wrap items-center gap-3">
                {profile && getMembershipBadge(profile.membership)}
                <div className="flex items-center gap-1 text-white/70">
                  <Calendar className="size-4" />
                  <span className="text-sm">
                    Member since {mockStats.memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-black hover:from-yellow-500 hover:to-amber-600">
              <Edit3 className="mr-2 size-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 border-t border-white/20 pt-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {mockStats.totalBookings}
            </div>
            <div className="text-sm text-white/70">Total Bookings</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {mockStats.completedActivities}
            </div>
            <div className="text-sm text-white/70">Activities Completed</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold text-yellow-400">
                {mockStats.averageRating}
              </span>
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm text-white/70">Average Rating Given</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white">
              <MapPin className="size-4" />
              <span className="text-sm font-medium">
                {mockStats.favoriteLocation}
              </span>
            </div>
            <div className="text-sm text-white/70">Favorite Location</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
