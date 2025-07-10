"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

// Your ImageKit boat image
const BOAT_IMAGE_URL = "https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?updatedAt=1751645631722"

// Optimized versions
const BOAT_IMAGE_MOBILE = "https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?tr=w-640,q-80,f-auto"
const BOAT_IMAGE_DESKTOP = "https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?tr=w-1200,q-85,f-auto"
const BOAT_IMAGE_THUMBNAIL = "https://ik.imagekit.io/s8hw8aygd/Activites/WhatsApp%20Image%202025-06-15%20at%2021.17.51.jpeg?tr=w-400,h-300,c-fill,q-80,f-auto"

export async function updateBoatActivitiesWithRealImages() {
  try {
    console.log("🚤 Updating boat activities with real ImageKit images...")

    // Find all boat-related activities
    const { data: boatActivities, error: fetchError } = await supabaseAdminClient
      .from("activities")
      .select("id, name, slug")
      .or(
        "slug.eq.boat-tour-mallorca," +
        "slug.eq.boat-rental-option-1," +
        "slug.eq.boat-rental-option-2," +
        "slug.eq.boat-rental-option-3," +
        "slug.eq.white-party-boat," +
        "name.ilike.%boat%," +
        "name.ilike.%sailing%," +
        "name.ilike.%yacht%"
      )

    if (fetchError) {
      console.error("❌ Error fetching boat activities:", fetchError)
      return { success: false, error: fetchError.message }
    }

    console.log(`📊 Found ${boatActivities?.length || 0} boat activities to update`)

    // Update the image_url for all boat activities
    const updatePromises = boatActivities?.map(async (activity) => {
      const { error: updateError } = await supabaseAdminClient
        .from("activities")
        .update({ 
          image_url: BOAT_IMAGE_URL,
          // You could also add these as JSON in a metadata field
          images: {
            original: BOAT_IMAGE_URL,
            mobile: BOAT_IMAGE_MOBILE,
            desktop: BOAT_IMAGE_DESKTOP,
            thumbnail: BOAT_IMAGE_THUMBNAIL
          }
        })
        .eq("id", activity.id)

      if (updateError) {
        console.error(`❌ Error updating ${activity.name}:`, updateError)
        return { id: activity.id, name: activity.name, error: updateError.message }
      }

      console.log(`✅ Updated ${activity.name} with ImageKit image`)
      return { id: activity.id, name: activity.name, success: true }
    }) || []

    const results = await Promise.all(updatePromises)
    
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => r.error).length

    console.log(`
🎯 Update Complete:
✅ Successfully updated: ${successful} activities
❌ Failed: ${failed} activities
    `)

    return { 
      success: true, 
      message: `Updated ${successful} boat activities with real images`,
      results 
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

// Function to update a specific activity with a custom image
export async function updateActivityImage(
  activitySlug: string, 
  imageUrl: string
) {
  try {
    const { error } = await supabaseAdminClient
      .from("activities")
      .update({ 
        image_url: imageUrl,
        images: {
          original: imageUrl,
          mobile: `${imageUrl}?tr=w-640,q-80,f-auto`,
          desktop: `${imageUrl}?tr=w-1200,q-85,f-auto`,
          thumbnail: `${imageUrl}?tr=w-400,h-300,c-fill,q-80,f-auto`
        }
      })
      .eq("slug", activitySlug)

    if (error) throw error

    return { success: true, message: `Updated ${activitySlug} with new image` }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}