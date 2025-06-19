"use client"

/*
<ai_context>
Booking Analytics Component - Personal booking statistics and insights
Features beautiful charts, spending analysis, activity preferences, and travel patterns.
Dark glassmorphism theme with interactive data visualization.
</ai_context>
*/

import { useState } from "react"
import {
  Calendar,
  TrendingUp,
  Award,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Users,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Globe,
  Compass
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

// Stat card component
function StatCard({
  icon: Icon,
  title,
  value,
  change,
  changeType = "neutral",
  subtitle
}: {
  icon: any
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  subtitle?: string
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 p-2">
            <Icon className="size-5 text-black" />
          </div>
          <div>
            <p className="text-sm text-white/70">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div
            className={cn(
              "text-sm font-medium",
              changeType === "positive"
                ? "text-green-400"
                : changeType === "negative"
                  ? "text-red-400"
                  : "text-white/70"
            )}
          >
            {change}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// Progress ring component
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  children
}: {
  progress: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Mock analytics data
const mockAnalytics = {
  totalBookings: 24,
  totalSpent: 2840,
  favoriteCategory: "Water Sports",
  averageRating: 4.8,
  companionsTotal: 47,
  countriesVisited: 1,
  yearlyGoal: 30,
  monthlySpending: [
    { month: "Jan", amount: 320 },
    { month: "Feb", amount: 280 },
    { month: "Mar", amount: 450 },
    { month: "Apr", amount: 380 },
    { month: "May", amount: 620 },
    { month: "Jun", amount: 590 },
    { month: "Jul", amount: 200 }
  ],
  categoriesBreakdown: [
    {
      category: "Water Sports",
      count: 8,
      percentage: 33,
      color: "bg-blue-500"
    },
    {
      category: "Cultural Tours",
      count: 6,
      percentage: 25,
      color: "bg-purple-500"
    },
    {
      category: "Food & Wine",
      count: 5,
      percentage: 21,
      color: "bg-green-500"
    },
    {
      category: "Land Adventures",
      count: 3,
      percentage: 13,
      color: "bg-orange-500"
    },
    { category: "Wellness", count: 2, percentage: 8, color: "bg-pink-500" }
  ],
  recentAchievements: [
    {
      title: "Adventure Seeker",
      description: "Completed 10 land activities",
      icon: "🏔️",
      unlocked: true
    },
    {
      title: "Foodie Explorer",
      description: "Tried 5 culinary experiences",
      icon: "🍷",
      unlocked: true
    },
    {
      title: "Cultural Enthusiast",
      description: "Visited 5 cultural sites",
      icon: "🏛️",
      unlocked: true
    },
    {
      title: "Water Sports Pro",
      description: "Complete 15 water activities",
      icon: "🏄‍♂️",
      unlocked: false
    },
    {
      title: "Local Expert",
      description: "Get 5-star reviews on 10 activities",
      icon: "⭐",
      unlocked: false
    }
  ],
  upcomingBookings: 3,
  completedBookings: 21,
  cancelledBookings: 0
}

export default function BookingAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")

  const progressToGoal =
    (mockAnalytics.totalBookings / mockAnalytics.yearlyGoal) * 100
  const avgMonthlySpending =
    mockAnalytics.monthlySpending.reduce(
      (acc, month) => acc + month.amount,
      0
    ) / mockAnalytics.monthlySpending.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Your Travel Analytics
        </h2>
        <p className="text-white/70">
          Insights into your Mallorca adventure journey
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "spending", label: "Spending", icon: DollarSign },
          { id: "preferences", label: "Preferences", icon: Heart },
          { id: "achievements", label: "Achievements", icon: Award }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Icon className="mr-2 size-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Calendar}
              title="Total Bookings"
              value={mockAnalytics.totalBookings}
              change="+3 this month"
              changeType="positive"
            />
            <StatCard
              icon={DollarSign}
              title="Total Spent"
              value={`€${mockAnalytics.totalSpent.toLocaleString()}`}
              change="+€420 this month"
              changeType="positive"
            />
            <StatCard
              icon={Star}
              title="Average Rating"
              value={mockAnalytics.averageRating}
              subtitle="Given by you"
            />
            <StatCard
              icon={Users}
              title="Travel Companions"
              value={mockAnalytics.companionsTotal}
              subtitle="People you've brought"
            />
          </div>

          {/* Progress to Goal */}
          <GlassCard>
            <h3 className="mb-4 text-xl font-bold text-white">
              2025 Adventure Goal
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Progress</span>
                <span className="text-white">
                  {mockAnalytics.totalBookings}/{mockAnalytics.yearlyGoal}{" "}
                  activities
                </span>
              </div>
              <Progress value={progressToGoal} className="h-3" />
              <p className="text-white/70">
                You're {Math.round(progressToGoal)}% of the way to your yearly
                goal!
              </p>
            </div>
          </GlassCard>

          {/* Quick Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <GlassCard className="text-center">
              <Activity className="mx-auto mb-3 size-8 text-yellow-400" />
              <h3 className="mb-1 text-lg font-bold text-white">
                Most Active Month
              </h3>
              <p className="text-white/70">May 2025</p>
              <p className="text-sm text-white/60">4 activities completed</p>
            </GlassCard>

            <GlassCard className="text-center">
              <MapPin className="mx-auto mb-3 size-8 text-yellow-400" />
              <h3 className="mb-1 text-lg font-bold text-white">
                Favorite Category
              </h3>
              <p className="text-white/70">{mockAnalytics.favoriteCategory}</p>
              <p className="text-sm text-white/60">33% of your bookings</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Globe className="mx-auto mb-3 size-8 text-yellow-400" />
              <h3 className="mb-1 text-lg font-bold text-white">
                Travel Style
              </h3>
              <p className="text-white/70">Adventure Seeker</p>
              <p className="text-sm text-white/60">
                Loves variety & new experiences
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Spending Tab */}
      {activeTab === "spending" && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              icon={TrendingUp}
              title="Average per Activity"
              value={`€${Math.round(mockAnalytics.totalSpent / mockAnalytics.totalBookings)}`}
              change="+€12 vs last month"
              changeType="positive"
            />
            <StatCard
              icon={Calendar}
              title="Monthly Average"
              value={`€${Math.round(avgMonthlySpending)}`}
              subtitle="Based on 7 months"
            />
            <StatCard
              icon={Target}
              title="Budget Efficiency"
              value="94%"
              change="Excellent"
              changeType="positive"
            />
          </div>

          <GlassCard>
            <h3 className="mb-6 text-xl font-bold text-white">
              Monthly Spending Trend
            </h3>
            <div className="space-y-4">
              {mockAnalytics.monthlySpending.map(month => {
                const percentage = (month.amount / 700) * 100
                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{month.month} 2025</span>
                      <span className="font-medium text-white">
                        €{month.amount}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-8">
          <GlassCard>
            <h3 className="mb-6 text-xl font-bold text-white">
              Activity Categories
            </h3>
            <div className="space-y-4">
              {mockAnalytics.categoriesBreakdown.map(category => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-3 rounded-full ${category.color}`}
                      />
                      <span className="font-medium text-white">
                        {category.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">
                        {category.count}
                      </span>
                      <span className="ml-2 text-sm text-white/60">
                        ({category.percentage}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-8">
          <GlassCard>
            <h3 className="mb-6 text-xl font-bold text-white">
              Community Standing
            </h3>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 p-4">
                <Award className="size-6 text-yellow-400" />
                <div>
                  <p className="text-lg font-bold text-yellow-400">Top 15%</p>
                  <p className="text-sm text-white/70">
                    Most active travelers this year
                  </p>
                </div>
              </div>
              <p className="mt-4 text-white/60">
                You're more adventurous than 85% of Mallorca travelers!
              </p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
