"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

// Type for growth calculation result
export interface GrowthResult {
  current: number
  previous: number
  growth: number
  changeType: "increase" | "decrease" | "neutral"
}

/**
 * Calculate growth percentage between two periods
 * This is a pure utility function that doesn't need to be async
 */
function calculateGrowth(current: number, previous: number): GrowthResult {
  if (previous === 0) {
    // If previous is 0, any current value represents infinite growth
    return {
      current,
      previous,
      growth: current > 0 ? 100 : 0,
      changeType: current > 0 ? "increase" : "neutral"
    }
  }

  const growth = ((current - previous) / previous) * 100
  const changeType = growth > 0 ? "increase" : growth < 0 ? "decrease" : "neutral"

  return {
    current,
    previous,
    growth: Math.round(growth * 10) / 10, // Round to 1 decimal place
    changeType
  }
}

/**
 * Calculate monthly growth for activities
 */
export async function calculateActivitiesGrowth(): Promise<GrowthResult> {
  try {
    // Current month count
    const { data: currentData } = await supabaseAdminClient
      .from('activities')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    // Previous month count
    const { data: previousData } = await supabaseAdminClient
      .from('activities')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
      .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    const current = currentData?.length || 0
    const previous = previousData?.length || 0

    return calculateGrowth(current, previous)
  } catch (error) {
    console.error("Error calculating activities growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate monthly growth for users
 */
export async function calculateUsersGrowth(): Promise<GrowthResult> {
  try {
    // Current month count
    const { count: current } = await supabaseAdminClient
      .from('users_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    // Previous month count
    const { count: previous } = await supabaseAdminClient
      .from('users_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
      .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    return calculateGrowth(current || 0, previous || 0)
  } catch (error) {
    console.error("Error calculating users growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate monthly growth for reviews
 */
export async function calculateReviewsGrowth(): Promise<GrowthResult> {
  try {
    // Current month count
    const { count: current } = await supabaseAdminClient
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    // Previous month count
    const { count: previous } = await supabaseAdminClient
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
      .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    return calculateGrowth(current || 0, previous || 0)
  } catch (error) {
    console.error("Error calculating reviews growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate monthly growth for bookings
 */
export async function calculateBookingsGrowth(): Promise<GrowthResult> {
  try {
    // Current month count
    const { count: current } = await supabaseAdminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    // Previous month count
    const { count: previous } = await supabaseAdminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
      .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    return calculateGrowth(current || 0, previous || 0)
  } catch (error) {
    console.error("Error calculating bookings growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate weekly revenue growth
 */
export async function calculateWeeklyRevenueGrowth(): Promise<GrowthResult> {
  try {
    // Current week revenue
    const { data: currentWeek } = await supabaseAdminClient
      .from('bookings')
      .select('total_amount')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .in('status', ['confirmed', 'completed'])

    // Previous week revenue
    const { data: previousWeek } = await supabaseAdminClient
      .from('bookings')
      .select('total_amount')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .in('status', ['confirmed', 'completed'])

    const current = currentWeek?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
    const previous = previousWeek?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

    return calculateGrowth(current, previous)
  } catch (error) {
    console.error("Error calculating weekly revenue growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate monthly revenue growth
 */
export async function calculateMonthlyRevenueGrowth(): Promise<GrowthResult> {
  try {
    // Current month revenue
    const { data: currentMonth } = await supabaseAdminClient
      .from('bookings')
      .select('total_amount')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .in('status', ['confirmed', 'completed'])

    // Previous month revenue
    const { data: previousMonth } = await supabaseAdminClient
      .from('bookings')
      .select('total_amount')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
      .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .in('status', ['confirmed', 'completed'])

    const current = currentMonth?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
    const previous = previousMonth?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

    return calculateGrowth(current, previous)
  } catch (error) {
    console.error("Error calculating monthly revenue growth:", error)
    return { current: 0, previous: 0, growth: 0, changeType: "neutral" }
  }
}

/**
 * Calculate all growth metrics at once
 */
export async function calculateAllGrowthMetrics() {
  const [
    activitiesGrowth,
    usersGrowth,
    reviewsGrowth,
    bookingsGrowth,
    weeklyRevenueGrowth,
    monthlyRevenueGrowth
  ] = await Promise.all([
    calculateActivitiesGrowth(),
    calculateUsersGrowth(),
    calculateReviewsGrowth(),
    calculateBookingsGrowth(),
    calculateWeeklyRevenueGrowth(),
    calculateMonthlyRevenueGrowth()
  ])

  return {
    activities: activitiesGrowth,
    users: usersGrowth,
    reviews: reviewsGrowth,
    bookings: bookingsGrowth,
    weeklyRevenue: weeklyRevenueGrowth,
    monthlyRevenue: monthlyRevenueGrowth
  }
}