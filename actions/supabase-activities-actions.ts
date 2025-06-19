"use server"

import { supabaseServerClient } from '@/lib/supabase-server'

// Use the dedicated server-only client
const supabase = supabaseServerClient

export interface Activity {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  category: string
  location: string
  meeting_point: string | null
  duration_minutes: number
  max_participants: number
  min_participants: number | null
  min_age: number | null
  max_age: number | null
  included_items: string[] | null
  excluded_items: string[] | null
  what_to_bring: string[] | null
  cancellation_policy: string | null
  safety_requirements: string | null
  weather_dependent: boolean | null
  instant_confirmation: boolean | null
  status: string
  featured: boolean | null
  avg_rating: number | null
  total_reviews: number | null
  total_bookings: number | null
  created_at: string
  updated_at: string
  video_url: string | null
  latitude: number | null
  longitude: number | null
  operator_id: string
}

export interface ActivityImage {
  id: string
  activity_id: string
  image_url: string
  alt_text: string | null
  caption: string | null
  is_primary: boolean | null
  sort_order: number | null
  created_at: string
}

export interface ActivityPricing {
  id: string
  activity_id: string
  price_type: string
  base_price: number
  seasonal_multiplier: number | null
  currency: string | null
  valid_from: string | null
  valid_until: string | null
  is_active: boolean | null
  created_at: string
  updated_at: string
}

export interface ActivityWithDetails extends Activity {
  images: ActivityImage[]
  pricing: ActivityPricing[]
}

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }

// Get activity by ID for admin (any status)
export async function getActivityByIdSupabaseAction(
  id: string
): Promise<ActionState<ActivityWithDetails | null>> {
  try {
    console.log('Fetching activity with ID:', id)

    // Get activity basic info
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()

    if (activityError) {
      console.error('Error fetching activity:', activityError)
      return {
        isSuccess: false,
        message: `Activity not found: ${activityError.message}`
      }
    }

    if (!activity) {
      return {
        isSuccess: false,
        message: "Activity not found"
      }
    }

    // Get activity images
    const { data: images, error: imagesError } = await supabase
      .from('activity_images')
      .select('*')
      .eq('activity_id', id)
      .order('sort_order', { ascending: true })

    if (imagesError) {
      console.error('Error fetching images:', imagesError)
    }

    // Get activity pricing
    const { data: pricing, error: pricingError } = await supabase
      .from('activity_pricing')
      .select('*')
      .eq('activity_id', id)
      .eq('is_active', true)

    if (pricingError) {
      console.error('Error fetching pricing:', pricingError)
    }

    const activityWithDetails: ActivityWithDetails = {
      ...activity,
      images: images || [],
      pricing: pricing || []
    }

    return {
      isSuccess: true,
      message: "Activity retrieved successfully",
      data: activityWithDetails
    }
  } catch (error) {
    console.error("Error getting activity:", error)
    return { 
      isSuccess: false, 
      message: `Failed to get activity: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

// Get all activities for admin
export async function getActivitiesSupabaseAction(): Promise<ActionState<Activity[]>> {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching activities:', error)
      return {
        isSuccess: false,
        message: `Failed to fetch activities: ${error.message}`
      }
    }

    return {
      isSuccess: true,
      message: "Activities retrieved successfully",
      data: activities || []
    }
  } catch (error) {
    console.error("Error getting activities:", error)
    return { 
      isSuccess: false, 
      message: `Failed to get activities: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

// Update activity
export async function updateActivitySupabaseAction(
  id: string,
  updates: any // Accept any format and map to database format
): Promise<ActionState<Activity>> {
  try {
    // Map camelCase form data to snake_case database columns
    const dbUpdates: any = {}
    
    // Map all the fields from camelCase to snake_case
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.location !== undefined) dbUpdates.location = updates.location
    if (updates.meetingPoint !== undefined) dbUpdates.meeting_point = updates.meetingPoint
    if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes
    if (updates.maxParticipants !== undefined) dbUpdates.max_participants = updates.maxParticipants
    if (updates.minParticipants !== undefined) dbUpdates.min_participants = updates.minParticipants
    if (updates.minAge !== undefined) dbUpdates.min_age = updates.minAge
    if (updates.maxAge !== undefined) dbUpdates.max_age = updates.maxAge
    if (updates.includedItems !== undefined) dbUpdates.included_items = updates.includedItems
    if (updates.excludedItems !== undefined) dbUpdates.excluded_items = updates.excludedItems
    if (updates.whatToBring !== undefined) dbUpdates.what_to_bring = updates.whatToBring
    if (updates.cancellationPolicy !== undefined) dbUpdates.cancellation_policy = updates.cancellationPolicy
    if (updates.safetyRequirements !== undefined) dbUpdates.safety_requirements = updates.safetyRequirements
    if (updates.weatherDependent !== undefined) dbUpdates.weather_dependent = updates.weatherDependent
    if (updates.instantConfirmation !== undefined) dbUpdates.instant_confirmation = updates.instantConfirmation
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl

    // Always update the updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString()

    console.log('Updating activity with ID:', id)
    console.log('Update data:', dbUpdates)

    const { data: activities, error } = await supabase
      .from('activities')
      .update(dbUpdates)
      .eq('id', id)
      .select()

    console.log('Update result:', { activities, error })

    if (error) {
      console.error('Error updating activity:', error)
      return {
        isSuccess: false,
        message: `Failed to update activity: ${error.message}`
      }
    }

    if (!activities || activities.length === 0) {
      return {
        isSuccess: false,
        message: "Activity not found or no changes made"
      }
    }

    const activity = activities[0]

    return {
      isSuccess: true,
      message: "Activity updated successfully",
      data: activity
    }
  } catch (error) {
    console.error("Error updating activity:", error)
    return { 
      isSuccess: false, 
      message: `Failed to update activity: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

// Create activity
export async function createActivitySupabaseAction(
  activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>
): Promise<ActionState<Activity>> {
  try {
    const { data: newActivity, error } = await supabase
      .from('activities')
      .insert({
        ...activity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating activity:', error)
      return {
        isSuccess: false,
        message: `Failed to create activity: ${error.message}`
      }
    }

    return {
      isSuccess: true,
      message: "Activity created successfully",
      data: newActivity
    }
  } catch (error) {
    console.error("Error creating activity:", error)
    return { 
      isSuccess: false, 
      message: `Failed to create activity: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
} 