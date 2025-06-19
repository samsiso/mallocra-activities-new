"use server"

import { supabaseServerClient } from "@/lib/supabase-server"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"

// Use the dedicated server-only client
const supabase = supabaseServerClient

// Types for user_profiles table
export interface UserProfile {
  id: string
  clerk_user_id: string
  user_type: 'customer' | 'salesperson' | 'operator' | 'admin'
  first_name?: string | null
  last_name?: string | null
  email: string
  phone?: string | null
  preferred_language?: string | null
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  created_at: string
  updated_at: string
}

export interface UserWithDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  userType: "customer" | "operator" | "admin"
  status: "active" | "inactive" | "suspended"
  joinedAt: string
  lastActive?: string
  totalBookings: number
  totalSpent: number
  averageRating?: number
  preferredLanguage?: string
  location?: string
  dateOfBirth?: string
  emergencyContact?: string
  marketingConsent: boolean
  createdAt: string
  updatedAt: string
}

export interface UsersStats {
  total: number
  active: number
  inactive: number
  suspended: number
  customers: number
  operators: number
  admins: number
  premium: number
  newThisMonth: number
  totalBookings: number
  averageSpending: number
}

export async function updateUserProfileAction(
  clerkUserId: string,
  data: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    preferredLanguage?: string
  }
): Promise<ActionState<UserProfile>> {
  try {
    const { data: updatedUser, error } = await supabase
      .from('users_profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        preferred_language: data.preferredLanguage,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single()

    if (error) {
      console.error("Update user profile error:", error)
      return { isSuccess: false, message: `Failed to update user profile: ${error.message}` }
    }

    if (!updatedUser) {
      return { isSuccess: false, message: "User profile not found" }
    }

    return {
      isSuccess: true,
      message: "User profile updated successfully",
      data: updatedUser
    }
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    return { isSuccess: false, message: `Failed to update user profile: ${error.message}` }
  }
}

export async function syncClerkUserAction(clerkUser: {
  id: string
  emailAddresses: Array<{ emailAddress?: string; email_address?: string }>
  firstName?: string | null
  lastName?: string | null
  phoneNumbers?: Array<{ phoneNumber?: string; phone_number?: string }>
}): Promise<ActionState<UserProfile>> {
  try {
    console.log("Syncing Clerk user:", clerkUser.id)
    console.log("Email addresses received:", JSON.stringify(clerkUser.emailAddresses, null, 2))

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUser.id)
      .single()

    console.log("Existing user check:", { existingUser, selectError })

    // Try different possible email field names from Clerk
    let extractedEmail = ""
    if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
      const emailObj = clerkUser.emailAddresses[0]
      extractedEmail = emailObj.emailAddress || 
                      emailObj.email_address || 
                      ""
      console.log("Email extraction - emailObj:", emailObj, "extracted:", extractedEmail)
    }

    // Try different possible phone field names from Clerk
    let extractedPhone = ""
    if (clerkUser.phoneNumbers && clerkUser.phoneNumbers.length > 0) {
      const phoneObj = clerkUser.phoneNumbers[0]
      extractedPhone = phoneObj.phoneNumber || 
                      phoneObj.phone_number || 
                      ""
      console.log("Phone extraction - phoneObj:", phoneObj, "extracted:", extractedPhone)
    }

    const userData = {
      clerk_user_id: clerkUser.id,
      email: extractedEmail,
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      phone: extractedPhone,
      user_type: 'customer' as const,
      status: 'active' as const,
      preferred_language: 'en'
    }

    console.log("Final userData to save:", userData)

    if (existingUser && !selectError) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users_profiles')
        .update({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', clerkUser.id)
        .select()
        .single()

      if (updateError) {
        console.error("Update error:", updateError)
        return { isSuccess: false, message: `Failed to update user: ${updateError.message}` }
      }

      console.log("User updated successfully:", updatedUser)
      return {
        isSuccess: true,
        message: "User profile synced successfully",
        data: updatedUser
      }
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users_profiles')
        .insert(userData)
        .select()
        .single()

      if (insertError) {
        console.error("Insert error:", insertError)
        return { isSuccess: false, message: `Failed to create user: ${insertError.message}` }
      }

      console.log("User created successfully:", newUser)
      return {
        isSuccess: true,
        message: "User profile created and synced successfully",
        data: newUser
      }
    }
  } catch (error: any) {
    console.error("Error syncing Clerk user:", error)
    return { isSuccess: false, message: `Failed to sync user profile: ${error.message}` }
  }
}

export async function deleteUserProfileAction(
  clerkUserId: string
): Promise<ActionState<void>> {
  try {
    const { error } = await supabase
      .from('users_profiles')
      .delete()
      .eq('clerk_user_id', clerkUserId)
    
    if (error) {
      console.error("Delete error:", error)
      return { isSuccess: false, message: `Failed to delete user: ${error.message}` }
    }

    return {
      isSuccess: true,
      message: "User profile deleted successfully",
      data: undefined
    }
  } catch (error: any) {
    console.error("Error deleting user profile:", error)
    return { isSuccess: false, message: `Failed to delete user profile: ${error.message}` }
  }
}

export async function getCurrentUserProfileAction(): Promise<ActionState<UserProfile | null>> {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return {
        isSuccess: true,
        message: "No authenticated user",
        data: null
      }
    }

    const { data: userProfile, error } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Get current user error:", error)
      return { isSuccess: false, message: `Failed to get current user profile: ${error.message}` }
    }

    return {
      isSuccess: true,
      message: "Current user profile retrieved successfully",
      data: userProfile || null
    }
  } catch (error: any) {
    console.error("Error getting current user profile:", error)
    return { isSuccess: false, message: `Failed to get current user profile: ${error.message}` }
  }
}

export async function getUsersForAdminAction(): Promise<ActionState<UserWithDetails[]>> {
  try {
    // First fetch all users from the users_profiles table
    const { data: userProfiles, error: profilesError } = await supabase
      .from('users_profiles')
      .select(`
        id,
        clerk_user_id,
        user_type,
        first_name,
        last_name,
        email,
        phone,
        preferred_language,
        status,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError)
      return { isSuccess: false, message: "Failed to fetch user profiles" }
    }

    if (!userProfiles || userProfiles.length === 0) {
      return {
        isSuccess: true,
        message: "No users found",
        data: []
      }
    }

    // Then fetch booking stats for each user
    const { data: bookingStats, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        customer_id,
        total_amount,
        status,
        created_at
      `)
      .eq('status', 'completed') // Only count completed bookings

    if (bookingsError) {
      console.error("Error fetching booking stats:", bookingsError)
      // Continue without booking stats rather than failing completely
    }

    // Create a map of user booking statistics
    const userBookingStats = new Map()
    if (bookingStats) {
      bookingStats.forEach(booking => {
        const customerId = booking.customer_id
        if (!userBookingStats.has(customerId)) {
          userBookingStats.set(customerId, {
            totalBookings: 0,
            totalSpent: 0,
            lastActive: null
          })
        }
        
        const stats = userBookingStats.get(customerId)
        stats.totalBookings += 1
        stats.totalSpent += parseFloat(booking.total_amount || '0')
        
        const bookingDate = new Date(booking.created_at)
        if (!stats.lastActive || bookingDate > new Date(stats.lastActive)) {
          stats.lastActive = booking.created_at
        }
      })
    }

    // Transform to UserWithDetails format
    const users: UserWithDetails[] = userProfiles.map(profile => {
      const stats = userBookingStats.get(profile.id) || {
        totalBookings: 0,
        totalSpent: 0,
        lastActive: null
      }

      return {
        id: profile.id,
        firstName: profile.first_name || 'N/A',
        lastName: profile.last_name || 'N/A',
        email: profile.email,
        phone: profile.phone || undefined,
        userType: profile.user_type as "customer" | "operator" | "admin",
        status: profile.status as "active" | "inactive" | "suspended",
        joinedAt: profile.created_at,
        lastActive: stats.lastActive || undefined,
        totalBookings: stats.totalBookings,
        totalSpent: stats.totalSpent,
        averageRating: undefined, // Would need to calculate from reviews table
        preferredLanguage: profile.preferred_language || 'en',
        location: undefined, // Not stored in current schema
        dateOfBirth: undefined, // Not stored in current schema
        emergencyContact: undefined, // Not stored in current schema
        marketingConsent: false, // Default value, not stored in current schema
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    })

    return {
      isSuccess: true,
      message: "Users retrieved successfully",
      data: users
    }
  } catch (error) {
    console.error("Error getting users for admin:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get users" 
    }
  }
}

export async function getUsersStatsAction(): Promise<ActionState<UsersStats>> {
  try {
    const { data: users } = await getUsersForAdminAction()
    
    if (!users) {
      throw new Error("No users data available")
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const stats: UsersStats = {
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      inactive: users.filter(u => u.status === "inactive").length,
      suspended: users.filter(u => u.status === "suspended").length,
      customers: users.filter(u => u.userType === "customer").length,
      operators: users.filter(u => u.userType === "operator").length,
      admins: users.filter(u => u.userType === "admin").length,
      premium: users.filter(u => u.userType === "customer" && u.totalSpent > 500).length,
      newThisMonth: users.filter(u => u.joinedAt >= thirtyDaysAgo).length,
      totalBookings: users.reduce((sum, u) => sum + u.totalBookings, 0),
      averageSpending: users.length > 0 
        ? users.filter(u => u.userType === "customer").reduce((sum, u) => sum + u.totalSpent, 0) / 
          Math.max(1, users.filter(u => u.userType === "customer").length)
        : 0
    }

    return {
      isSuccess: true,
      message: "User stats retrieved successfully",
      data: stats
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get user stats" 
    }
  }
}

export async function updateUserStatusAction(
  userId: string,
  status: UserWithDetails["status"]
): Promise<ActionState<UserWithDetails>> {
  try {
    // First update the user status in the database
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users_profiles')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating user status:", updateError)
      return { isSuccess: false, message: `Failed to update user status: ${updateError.message}` }
    }

    if (!updatedProfile) {
      return { isSuccess: false, message: "User not found" }
    }

    // Get booking stats for this user
    const { data: bookingStats, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        total_amount,
        created_at
      `)
      .eq('customer_id', userId)
      .eq('status', 'completed')

    let totalBookings = 0
    let totalSpent = 0
    let lastActive = null

    if (!bookingsError && bookingStats) {
      totalBookings = bookingStats.length
      totalSpent = bookingStats.reduce((sum, booking) => sum + parseFloat(booking.total_amount || '0'), 0)
      
      if (bookingStats.length > 0) {
        const sortedBookings = bookingStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        lastActive = sortedBookings[0].created_at
      }
    }

    // Transform to UserWithDetails format
    const updatedUser: UserWithDetails = {
      id: updatedProfile.id,
      firstName: updatedProfile.first_name || 'N/A',
      lastName: updatedProfile.last_name || 'N/A',
      email: updatedProfile.email,
      phone: updatedProfile.phone || undefined,
      userType: updatedProfile.user_type as "customer" | "operator" | "admin",
      status: updatedProfile.status as "active" | "inactive" | "suspended",
      joinedAt: updatedProfile.created_at,
      lastActive: lastActive || undefined,
      totalBookings: totalBookings,
      totalSpent: totalSpent,
      averageRating: undefined,
      preferredLanguage: updatedProfile.preferred_language || 'en',
      location: undefined,
      dateOfBirth: undefined,
      emergencyContact: undefined,
      marketingConsent: false,
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at
    }

    return {
      isSuccess: true,
      message: `User status updated to ${status}`,
      data: updatedUser
    }
  } catch (error) {
    console.error("Error updating user status:", error)
    return { 
      isSuccess: false, 
      message: "Failed to update user status" 
    }
  }
}

export async function getUserByIdAction(userId: string): Promise<ActionState<UserWithDetails>> {
  try {
    // First fetch the user profile from the database
    const { data: userProfile, error: profileError } = await supabase
      .from('users_profiles')
      .select(`
        id,
        clerk_user_id,
        user_type,
        first_name,
        last_name,
        email,
        phone,
        preferred_language,
        status,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return { isSuccess: false, message: "Failed to fetch user profile" }
    }

    if (!userProfile) {
      return { isSuccess: false, message: "User not found" }
    }

    // Get booking stats for this user
    const { data: bookingStats, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        total_amount,
        created_at
      `)
      .eq('customer_id', userId)
      .eq('status', 'completed')

    let totalBookings = 0
    let totalSpent = 0
    let lastActive = null

    if (!bookingsError && bookingStats) {
      totalBookings = bookingStats.length
      totalSpent = bookingStats.reduce((sum, booking) => sum + parseFloat(booking.total_amount || '0'), 0)
      
      if (bookingStats.length > 0) {
        const sortedBookings = bookingStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        lastActive = sortedBookings[0].created_at
      }
    }

    // Transform to UserWithDetails format
    const user: UserWithDetails = {
      id: userProfile.id,
      firstName: userProfile.first_name || 'N/A',
      lastName: userProfile.last_name || 'N/A',
      email: userProfile.email,
      phone: userProfile.phone || undefined,
      userType: userProfile.user_type as "customer" | "operator" | "admin",
      status: userProfile.status as "active" | "inactive" | "suspended",
      joinedAt: userProfile.created_at,
      lastActive: lastActive || undefined,
      totalBookings: totalBookings,
      totalSpent: totalSpent,
      averageRating: undefined,
      preferredLanguage: userProfile.preferred_language || 'en',
      location: undefined,
      dateOfBirth: undefined,
      emergencyContact: undefined,
      marketingConsent: false,
      createdAt: userProfile.created_at,
      updatedAt: userProfile.updated_at
    }

    return {
      isSuccess: true,
      message: "User retrieved successfully",
      data: user
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get user" 
    }
  }
}