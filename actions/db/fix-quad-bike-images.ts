"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

// Placeholder quad bike image until you upload real ones  
const QUAD_BIKE_PLACEHOLDER = "https://images.unsplash.com/photo-1558618047-3c8f8b4c2bb8?q=80&w=2000&auto=format&fit=crop"

export async function fixQuadBikeImages() {
  try {
    console.log("🏍️ Fixing quad bike activity images...")

    // Find all quad bike activities
    const { data: quadActivities, error: fetchError } = await supabaseAdminClient
      .from("activities")
      .select("id, title, slug")
      .or("title.ilike.%quad%,slug.ilike.%quad%")

    if (fetchError) throw fetchError

    console.log(`Found ${quadActivities?.length || 0} quad bike activities`)

    // Add images for activities that don't have any
    for (const activity of quadActivities || []) {
      // Check if activity has any images
      const { data: existingImages } = await supabaseAdminClient
        .from("activity_images")
        .select("id")
        .eq("activity_id", activity.id)
        .limit(1)

      if (!existingImages || existingImages.length === 0) {
        // Add placeholder image
        const { error: insertError } = await supabaseAdminClient
          .from("activity_images")
          .insert({
            activity_id: activity.id,
            image_url: QUAD_BIKE_PLACEHOLDER,
            alt_text: "Quad Biking Adventure in Mallorca",
            caption: "Experience the thrill of quad biking through Mallorca's terrain",
            is_primary: true,
            sort_order: 0
          })

        if (insertError) {
          console.error(`Error adding image for ${activity.title}:`, insertError)
        } else {
          console.log(`✅ Added placeholder image for: ${activity.title}`)
        }
      } else {
        console.log(`ℹ️ ${activity.title} already has images`)
      }
    }

    return { success: true, message: "Quad bike images fixed" }
  } catch (error) {
    console.error("Error fixing quad bike images:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}