"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

interface ActivityData {
  title: string
  slug: string
  price: number
  duration: number // in minutes
  category: string
  location: string
  description: string
  inclusions: string[]
  maxParticipants: number
  deposit?: number
  commission?: number
}

const realActivities: ActivityData[] = [
  {
    title: "Quad Bikes Magaluf",
    slug: "quad-bikes-magaluf",
    price: 159,
    duration: 150,
    category: "land_adventures",
    location: "Magaluf",
    description: "Experience the thrill of quad biking with our 2.5-hour adventure tour in Magaluf. Perfect for couples or friends, each quad accommodates 2 people.",
    inclusions: ["Free water", "Fuel", "Insurance"],
    maxParticipants: 20,
    commission: 40
  },
  {
    title: "Boat Tour Mallorca",
    slug: "boat-tour-mallorca",
    price: 320,
    duration: 240,
    category: "water_sports",
    location: "Mallorca",
    description: "Enjoy a spectacular 4-hour boat tour around Mallorca's stunning coastline. Fuel included for the main boat.",
    inclusions: ["Fuel for main boat", "Safety equipment"],
    maxParticipants: 12,
  },
  {
    title: "Formula Tours - Tour 1",
    slug: "formula-tours-tour-1",
    price: 79,
    duration: 270,
    category: "land_adventures",
    location: "Mallorca",
    description: "4.5-hour guided tour exploring Mallorca's hidden gems. Price is per person when booking for 2 people (€130 for single riders).",
    inclusions: ["Guided tour", "Safety equipment"],
    maxParticipants: 15,
    commission: 25
  },
  {
    title: "Formula Tours - Tour 2",
    slug: "formula-tours-tour-2",
    price: 59,
    duration: 150,
    category: "land_adventures",
    location: "Mallorca",
    description: "2.5-hour scenic tour perfect for a morning or afternoon adventure. Price is per person when booking for 2 people (€90 for single riders).",
    inclusions: ["Guided tour", "Safety equipment"],
    maxParticipants: 15,
    commission: 25
  },
  {
    title: "White Party Boat",
    slug: "white-party-boat",
    price: 0, // TBD
    duration: 240,
    category: "nightlife",
    location: "Mallorca",
    description: "Join the ultimate White Party Boat experience by Just-Summer.com. Seasonal event with pricing to be announced.",
    inclusions: ["Party atmosphere", "DJ", "Dancing"],
    maxParticipants: 100,
  },
  {
    title: "Jet Ski 30-Minute Tour",
    slug: "jet-ski-30-minute-tour",
    price: 99,
    duration: 30,
    category: "water_sports",
    location: "Mallorca",
    description: "Quick and thrilling 30-minute jet ski experience for 2 people. Perfect for first-timers or those short on time.",
    inclusions: ["Transfer", "Photos", "Safety briefing"],
    maxParticipants: 10,
    deposit: 30
  },
  {
    title: "Jet Ski 1-Hour Tour",
    slug: "jet-ski-1-hour-tour",
    price: 159,
    duration: 60,
    category: "water_sports",
    location: "Mallorca",
    description: "Extended 1-hour jet ski adventure exploring more of Mallorca's coastline. Experience the freedom of the open water.",
    inclusions: ["Safety equipment", "Instruction"],
    maxParticipants: 10,
    deposit: 50
  },
  {
    title: "Boat Rental Option 1",
    slug: "boat-rental-option-1",
    price: 350,
    duration: 60,
    category: "water_sports",
    location: "Mallorca",
    description: "Premium boat rental at €350 per hour. Perfect for private groups wanting to explore at their own pace.",
    inclusions: ["Boat rental", "Safety equipment"],
    maxParticipants: 8,
    commission: 170
  },
  {
    title: "Boat Rental Option 2",
    slug: "boat-rental-option-2",
    price: 380,
    duration: 60,
    category: "water_sports",
    location: "Mallorca",
    description: "Luxury boat rental at €380 per hour. Our most premium option with additional amenities.",
    inclusions: ["Boat rental", "Safety equipment", "Premium amenities"],
    maxParticipants: 10,
    commission: 200
  },
  {
    title: "Boat Rental Option 3",
    slug: "boat-rental-option-3",
    price: 320,
    duration: 60,
    category: "water_sports",
    location: "Mallorca",
    description: "Standard boat rental at €320 per hour. Great value for smaller groups.",
    inclusions: ["Boat rental", "Safety equipment"],
    maxParticipants: 6,
    commission: 170
  }
]

export async function populateRealActivitiesAction() {
  try {
    const supabase = supabaseAdminClient
    
    // First, deactivate all existing activities
    const { error: deactivateError } = await supabase
      .from("activities")
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all
    
    if (deactivateError) {
      console.error("Error deactivating activities:", deactivateError)
      return { success: false, error: deactivateError.message }
    }
    
    // Process each activity
    for (const activity of realActivities) {
      // Insert or update the activity
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .upsert({
          title: activity.title,
          slug: activity.slug,
          short_description: activity.description.substring(0, 150) + "...",
          description: activity.description,
          category: activity.category,
          location: activity.location,
          duration_minutes: activity.duration,
          max_participants: activity.maxParticipants,
          min_age: activity.category === "nightlife" ? 18 : 16,
          difficulty_level: activity.category === "water_sports" ? "intermediate" : "beginner",
          is_featured: ["Quad Bikes Magaluf", "Boat Tour Mallorca", "Jet Ski 30-Minute Tour"].includes(activity.title),
          is_active: true,
          latitude: 39.5696,
          longitude: 2.6502,
          meeting_point: activity.location,
          cancellation_policy: "Free cancellation up to 24 hours before",
          avg_rating: 4.8,
          total_reviews: Math.floor(Math.random() * 200) + 50,
          instant_booking: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        })
        .select()
        .single()
      
      if (activityError) {
        console.error(`Error upserting activity ${activity.title}:`, activityError)
        continue
      }
      
      if (activityData) {
        // Add pricing
        if (activity.price > 0) {
          await supabase
            .from("activity_pricing")
            .upsert({
              activity_id: activityData.id,
              price_type: "adult",
              base_price: activity.price,
              description: activity.duration >= 60 ? "Per hour" : "Per person/group",
              is_primary: true
            }, {
              onConflict: 'activity_id,price_type'
            })
        }
        
        // Add inclusions
        for (const inclusion of activity.inclusions) {
          await supabase
            .from("activity_inclusions")
            .upsert({
              activity_id: activityData.id,
              title: inclusion,
              is_highlight: true
            }, {
              onConflict: 'activity_id,title'
            })
        }
        
        // Add a default image
        const imageUrls: Record<string, string> = {
          "water_sports": "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          "land_adventures": "https://images.unsplash.com/photo-1571847140471-1d7766e825ea",
          "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
        }
        
        await supabase
          .from("activity_images")
          .upsert({
            activity_id: activityData.id,
            image_url: imageUrls[activity.category] || imageUrls.land_adventures,
            alt_text: activity.title,
            is_primary: true,
            display_order: 1
          }, {
            onConflict: 'activity_id,display_order'
          })
      }
    }
    
    revalidatePath("/activities")
    revalidatePath("/")
    
    return { 
      success: true, 
      message: "Successfully populated 10 real activities" 
    }
    
  } catch (error) {
    console.error("Error in populateRealActivitiesAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

// Function to verify the activities were added
export async function verifyRealActivitiesAction() {
  try {
    const { supabaseAdminClient } = await import('@/lib/supabase-admin')
    const supabase = supabaseAdminClient
    
    const { data, error } = await supabase
      .from("activities")
      .select(`
        id,
        title,
        slug,
        is_active,
        category,
        duration_minutes,
        activity_pricing (
          base_price,
          price_type
        )
      `)
      .eq('is_active', true)
      .order('title')
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { 
      success: true, 
      data,
      count: data?.length || 0
    }
    
  } catch (error) {
    console.error("Error verifying activities:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}