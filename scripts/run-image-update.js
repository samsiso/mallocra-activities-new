const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ACTIVITY_IMAGE_MAP = {
  // Quad Bikes (exact database names)
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
  
  // Formula Racing (exact database names)
  "Formula Racing Experience": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Forumal%20Tour%201.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/forumla%20tour%202.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forumila%20tour%202.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forunula%20ytour%204.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/forunula%20tour%205.webp"
    ]
  },
  
  // Jet Skiing (exact database names)
  "Jet Ski Adventure Tour": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-2.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-3.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-4.webp", 
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-5.webp"
    ]
  },
  "Bladerunner Jet Ski Adventure": {
    primary: "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-3.webp",
    additional: [
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-2.webp",
      "https://ik.imagekit.io/s8hw8aygd/Activites/Jet-ski-4.webp"
    ]
  },
  
  // Boat Activities (exact database names)
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

async function updateActivityImages() {
  try {
    console.log("🖼️ Starting activity image updates...")
    
    // Get all activities
    const { data: activities, error: fetchError } = await supabase
      .from("activities")
      .select("id, title")
    
    if (fetchError) throw fetchError
    
    let updated = 0
    let skipped = 0
    
    for (const activity of activities || []) {
      const imageConfig = ACTIVITY_IMAGE_MAP[activity.title]
      
      if (!imageConfig) {
        console.log(`⏭️ Skipping ${activity.title} - no image config`)
        skipped++
        continue
      }
      
      // Delete existing images
      await supabase
        .from("activity_images")
        .delete()
        .eq("activity_id", activity.id)
      
      // Add primary image
      const { error: primaryError } = await supabase
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
        await supabase
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
    
  } catch (error) {
    console.error("❌ Error updating activity images:", error)
  }
}

updateActivityImages()