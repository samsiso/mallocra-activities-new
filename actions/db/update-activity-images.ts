"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

// Map of activity titles to their proper uploaded images
const ACTIVITY_IMAGE_MAP = {
  // Quad Bikes
  "Quad Bikes Magaluf": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Quad1.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Quad2.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/Quad-3.webp", 
      "https://ik.imagekit.io/s8hw8aygd/Activites/Quad-4.webp"
    ]
  },
  "Quad Biking Mountain Adventure": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Quad2.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Quad1.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/Quad-3.webp"
    ]
  },
  
  // Formula Racing
  "Formula Racing Experience": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Forumal%20Tour%201.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/forumla%20tour%202.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forumila%20tour%202.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forunula%20ytour%204.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forunula%20tour%205.webp"
    ]
  },
  
  // Jet Skiing  
  "Jet Ski Adventure Tour": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-2.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-3.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-4.webp", 
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-5.webp"
    ]
  },
  
  // Boat Activities
  "White Party Boat": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty1.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty2.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty3.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty4.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty5.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty6.webp"
    ]
  },
  "Boat Tour Mallorca": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Heatwave-boat-4-1.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty2.webp"
    ]
  },
  "Private Boat Rental": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty2.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Heatwave-boat-4-1.webp"
    ]
  },
  "Sailing Adventure to Dragonera Island": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Heatwave-boat-4-1.webp",
    additional: []
  },
  "Alcúdia Bay Boat Trip & Snorkeling": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/boatwhiteparty1.webp",
    additional: []
  }
}

export async function updateAllActivityImages() {
  try {
    console.log("🖼️ Starting activity image updates...")
    
    // Get all activities
    const { data: activities, error: fetchError } = await supabaseAdminClient
      .from("activities")
      .select("id, title")
    
    if (fetchError) throw fetchError
    
    let updated = 0
    let skipped = 0
    
    for (const activity of activities || []) {
      const imageConfig = ACTIVITY_IMAGE_MAP[activity.title as keyof typeof ACTIVITY_IMAGE_MAP]
      
      if (!imageConfig) {
        console.log(`⏭️ Skipping ${activity.title} - no image config`)
        skipped++
        continue
      }
      
      // Delete existing images
      await supabaseAdminClient
        .from("activity_images")
        .delete()
        .eq("activity_id", activity.id)
      
      // Add primary image
      const { error: primaryError } = await supabaseAdminClient
        .from("activity_images")
        .insert({
          activity_id: activity.id,
          image_url: imageConfig.primary,
          alt_text: `${activity.title} - Main Image`,
          is_primary: true,
          sort_order: 0
        })
      
      if (primaryError) {
        console.error(`❌ Error adding primary image for ${activity.title}:`, primaryError)
        continue
      }
      
      // Add additional images
      for (let i = 0; i < imageConfig.additional.length; i++) {
        await supabaseAdminClient
          .from("activity_images")
          .insert({
            activity_id: activity.id,
            image_url: imageConfig.additional[i],
            alt_text: `${activity.title} - Image ${i + 2}`,
            is_primary: false,
            sort_order: i + 1
          })
      }
      
      console.log(`✅ Updated ${activity.title} with ${1 + imageConfig.additional.length} images`)
      updated++
    }
    
    console.log(`🎉 Image update complete! Updated: ${updated}, Skipped: ${skipped}`)
    return { success: true, updated, skipped }
    
  } catch (error) {
    console.error("❌ Error updating activity images:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}