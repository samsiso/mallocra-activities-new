"use server"

/*
<ai_context>
Seed client activities - Creates the 10 confirmed activities from the client
Based on the actual activities they want to display on their platform.
</ai_context>
*/

import { supabaseServerClient as supabase } from "@/lib/supabase-server"
import { ActionState } from "@/types"

// The 10 confirmed client activities
const CLIENT_ACTIVITIES = [
  {
    title: "Quad Bikes Magaluf",
    slug: "quad-bikes-magaluf",
    short_description: "2.5-hour quad bike tour in Magaluf for 2 people per quad",
    description: "Experience the thrill of quad biking in Magaluf with our 2.5-hour tour. Perfect for adventure seekers! This tour accommodates 2 people per quad for just €159, including free water, fuel, and insurance. Navigate through scenic routes and enjoy the beautiful landscapes of Mallorca.",
    category: "land_adventures",
    location: "Magaluf",
    meeting_point: "Quad Adventure Base, Magaluf",
    duration_minutes: 150,
    max_participants: 20,
    min_participants: 2,
    min_age: 18,
    included_items: ["Free water", "Fuel", "Insurance", "Safety equipment"],
    excluded_items: ["Hotel pickup/drop-off", "Personal expenses"],
    what_to_bring: ["Valid driving license", "Closed-toe shoes", "Sun protection"],
    cancellation_policy: "Free cancellation up to 24 hours before the tour",
    safety_requirements: "Valid driving license required. Safety briefing provided.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 159.00,
    commission: 40.00,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Quad bikes ready for adventure in Magaluf"
  },
  {
    title: "Boat Tour Mallorca",
    slug: "boat-tour-mallorca",
    short_description: "4-hour boat tour with fuel included for the main boat",
    description: "Enjoy a spectacular 4-hour boat tour around the beautiful coastline of Mallorca. Our tour includes fuel for the main boat and offers breathtaking views of the Mediterranean. Perfect for families and groups looking for a relaxing day on the water.",
    category: "water_sports",
    location: "Port de Palma",
    meeting_point: "Marina Port de Palma, Pier 5",
    duration_minutes: 240,
    max_participants: 12,
    min_participants: 4,
    min_age: 6,
    included_items: ["Fuel for main boat", "Professional crew", "Safety equipment", "Light refreshments"],
    excluded_items: ["Hotel transfers", "Additional fuel for other boats", "Meals"],
    what_to_bring: ["Swimwear", "Sunscreen", "Towel", "Camera"],
    cancellation_policy: "Free cancellation up to 24 hours before departure",
    safety_requirements: "Life jackets provided. Swimming ability recommended.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 320.00,
    commission: 80.00,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Beautiful boat tour along Mallorca coastline"
  },
  {
    title: "Formula Tours - Tour 1",
    slug: "formula-tours-tour-1",
    short_description: "4.5-hour Formula tour, €79 per person for 2 people or €130 for 1 person",
    description: "Experience the ultimate Formula Tours adventure with our comprehensive 4.5-hour Tour 1. Discover the most spectacular routes of Mallorca with professional guidance. Pricing: €79 per person when booking for 2 people, or €130 for solo travelers.",
    category: "land_adventures",
    location: "Mallorca",
    meeting_point: "Formula Tours Base (location to be confirmed)",
    duration_minutes: 270,
    max_participants: 8,
    min_participants: 1,
    min_age: 16,
    included_items: ["Professional guide", "Route planning", "Safety equipment", "Digital map"],
    excluded_items: ["Hotel transfers", "Meals", "Personal expenses"],
    what_to_bring: ["Comfortable clothing", "Sun protection", "Water bottle", "Camera"],
    cancellation_policy: "Free cancellation up to 24 hours before the tour",
    safety_requirements: "Basic fitness level required. Safety briefing provided.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 79.00,
    commission_percentage: 25,
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Formula Tours scenic route in Mallorca"
  },
  {
    title: "Formula Tours - Tour 2",
    slug: "formula-tours-tour-2",
    short_description: "2.5-hour Formula tour, €59 per person for 2 people or €90 for 1 person",
    description: "Join our exciting 2.5-hour Formula Tours - Tour 2 for a condensed but thrilling experience of Mallorca's best routes. Perfect for those with limited time. Pricing: €59 per person when booking for 2 people, or €90 for solo travelers.",
    category: "land_adventures",
    location: "Mallorca",
    meeting_point: "Formula Tours Base (location to be confirmed)",
    duration_minutes: 150,
    max_participants: 8,
    min_participants: 1,
    min_age: 16,
    included_items: ["Professional guide", "Route planning", "Safety equipment", "Digital map"],
    excluded_items: ["Hotel transfers", "Meals", "Personal expenses"],
    what_to_bring: ["Comfortable clothing", "Sun protection", "Water bottle", "Camera"],
    cancellation_policy: "Free cancellation up to 24 hours before the tour",
    safety_requirements: "Basic fitness level required. Safety briefing provided.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 59.00,
    commission_percentage: 25,
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Formula Tours adventure in Mallorca countryside"
  },
  {
    title: "White Party Boat",
    slug: "white-party-boat",
    short_description: "Seasonal party boat event by Just-Summer.com",
    description: "Join the ultimate White Party Boat experience! This seasonal event by Just-Summer.com offers an unforgettable party atmosphere on the beautiful waters of Mallorca. Dance, socialize, and enjoy spectacular views while wearing your best white outfit.",
    category: "nightlife",
    location: "Port de Palma",
    meeting_point: "Marina Port de Palma (specific pier to be confirmed)",
    duration_minutes: 300,
    max_participants: 50,
    min_participants: 20,
    min_age: 18,
    included_items: ["DJ and music", "Basic refreshments", "Party atmosphere", "Beautiful ocean views"],
    excluded_items: ["Hotel transfers", "Alcoholic beverages", "Premium services"],
    what_to_bring: ["White clothing (required)", "Sunscreen", "ID document", "Camera"],
    cancellation_policy: "Cancellation policy varies by season - contact for details",
    safety_requirements: "18+ only. Valid ID required. Weather dependent.",
    weather_dependent: true,
    instant_confirmation: false,
    status: "active",
    featured: true,
    base_price: 0.00, // TBD
    commission: 0.00,
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "White party boat celebration on Mediterranean waters"
  },
  {
    title: "Jet Ski 30-Minute Tour",
    slug: "jet-ski-30-minute-tour",
    short_description: "30-minute jet ski experience for 2 people with transfer and photos",
    description: "Feel the adrenaline rush with our 30-minute jet ski tour for 2 people. Includes convenient transfers and professional photos to capture your adventure. Perfect for those seeking a quick thrill on the crystal-clear waters of Mallorca.",
    category: "water_sports",
    location: "Palma Bay",
    meeting_point: "Jet Ski Center, Marina Palma",
    duration_minutes: 30,
    max_participants: 2,
    min_participants: 2,
    min_age: 16,
    included_items: ["Jet ski rental", "Transfer service", "Professional photos", "Safety equipment", "Brief instruction"],
    excluded_items: ["Hotel pickup from distant locations", "Additional photos", "Insurance beyond basic"],
    what_to_bring: ["Swimming attire", "Towel", "Sunscreen", "Valid ID"],
    cancellation_policy: "Free cancellation up to 24 hours before departure",
    safety_requirements: "Swimming ability required. Safety briefing mandatory.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 99.00,
    deposit: 30.00,
    image_url: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Exciting jet ski adventure in crystal clear waters"
  },
  {
    title: "Jet Ski 1-Hour Tour",
    slug: "jet-ski-1-hour-tour",
    short_description: "Extended 1-hour jet ski experience",
    description: "Extend your jet ski adventure with our comprehensive 1-hour tour. Perfect for those who want more time to explore the beautiful coastline and enjoy the thrill of personal watercraft. Includes all safety equipment and professional guidance.",
    category: "water_sports",
    location: "Palma Bay",
    meeting_point: "Jet Ski Center, Marina Palma",
    duration_minutes: 60,
    max_participants: 2,
    min_participants: 1,
    min_age: 16,
    included_items: ["Jet ski rental", "Safety equipment", "Professional instruction", "Coastal tour guidance"],
    excluded_items: ["Hotel transfers", "Photos (available separately)", "Insurance beyond basic"],
    what_to_bring: ["Swimming attire", "Towel", "Sunscreen", "Valid ID"],
    cancellation_policy: "Free cancellation up to 24 hours before departure",
    safety_requirements: "Swimming ability required. Safety briefing mandatory.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: true,
    base_price: 159.00,
    deposit: 50.00,
    image_url: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Extended jet ski tour experience"
  },
  {
    title: "Boat Rental Option 1",
    slug: "boat-rental-option-1",
    short_description: "Premium boat rental at €350 per hour",
    description: "Rent our premium boat for €350 per hour and enjoy the freedom to explore Mallorca's coastline at your own pace. Perfect for families and groups seeking a private boat experience with professional service and quality amenities.",
    category: "water_sports",
    location: "Port de Palma",
    meeting_point: "Marina Port de Palma, Berth A-12",
    duration_minutes: 60, // hourly rental
    max_participants: 8,
    min_participants: 2,
    min_age: 6,
    included_items: ["Premium boat rental", "Basic safety equipment", "Fuel for standard usage", "Port fees"],
    excluded_items: ["Captain (optional extra)", "Additional fuel", "Catering", "Water sports equipment"],
    what_to_bring: ["Valid ID", "Swimming attire", "Sunscreen", "Food and drinks"],
    cancellation_policy: "Free cancellation up to 24 hours before rental",
    safety_requirements: "Boat license required or captain hire mandatory.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: false,
    base_price: 350.00,
    commission: 170.00,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Premium boat rental ready for charter"
  },
  {
    title: "Boat Rental Option 2",
    slug: "boat-rental-option-2",
    short_description: "Luxury boat rental at €380 per hour",
    description: "Experience luxury on the water with our premium boat rental at €380 per hour. This high-end option features superior amenities and comfort for discerning guests who want the best maritime experience around Mallorca.",
    category: "water_sports",
    location: "Port de Palma",
    meeting_point: "Marina Port de Palma, Berth B-8",
    duration_minutes: 60, // hourly rental
    max_participants: 10,
    min_participants: 2,
    min_age: 6,
    included_items: ["Luxury boat rental", "Premium safety equipment", "Fuel for standard usage", "Port fees", "Welcome refreshments"],
    excluded_items: ["Captain (optional extra)", "Additional fuel", "Full catering", "Water sports equipment"],
    what_to_bring: ["Valid ID", "Swimming attire", "Sunscreen", "Personal items"],
    cancellation_policy: "Free cancellation up to 24 hours before rental",
    safety_requirements: "Boat license required or captain hire mandatory.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: false,
    base_price: 380.00,
    commission: 200.00,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Luxury boat rental with premium amenities"
  },
  {
    title: "Boat Rental Option 3",
    slug: "boat-rental-option-3",
    short_description: "Standard boat rental at €320 per hour",
    description: "Affordable boat rental option at €320 per hour. Perfect for budget-conscious groups who still want to enjoy a quality boat experience. Includes all essential amenities for a safe and enjoyable day on the water around Mallorca.",
    category: "water_sports",
    location: "Port de Palma",
    meeting_point: "Marina Port de Palma, Berth C-15",
    duration_minutes: 60, // hourly rental
    max_participants: 6,
    min_participants: 2,
    min_age: 8,
    included_items: ["Standard boat rental", "Safety equipment", "Basic fuel allowance", "Port fees"],
    excluded_items: ["Captain (optional extra)", "Excess fuel", "Catering", "Premium amenities"],
    what_to_bring: ["Valid ID", "Swimming attire", "Sunscreen", "Food and drinks"],
    cancellation_policy: "Free cancellation up to 24 hours before rental",
    safety_requirements: "Boat license required or captain hire mandatory.",
    weather_dependent: true,
    instant_confirmation: true,
    status: "active",
    featured: false,
    base_price: 320.00,
    commission: 170.00,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&q=85",
    alt_text: "Standard boat rental for budget-conscious adventurers"
  }
]

export async function seedClientActivitiesAction(): Promise<ActionState<any>> {
  try {
    console.log("🌱 Starting to seed client activities to Supabase...")

    // First, clear existing activities to ensure clean slate
    const { error: deleteError } = await supabase
      .from('activities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all except non-existent ID

    if (deleteError) {
      console.warn("Could not clear existing activities:", deleteError.message)
    }

    // Clear existing images and pricing
    const { error: deleteImagesError } = await supabase
      .from('activity_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    const { error: deletePricingError } = await supabase
      .from('activity_pricing')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteImagesError) console.warn("Could not clear images:", deleteImagesError.message)
    if (deletePricingError) console.warn("Could not clear pricing:", deletePricingError.message)

    let successCount = 0
    let errors: string[] = []

    for (const activityData of CLIENT_ACTIVITIES) {
      try {
        // Insert main activity
        const { data: activity, error: activityError } = await supabase
          .from('activities')
          .insert({
            title: activityData.title,
            slug: activityData.slug,
            short_description: activityData.short_description,
            description: activityData.description,
            category: activityData.category,
            location: activityData.location,
            meeting_point: activityData.meeting_point,
            duration_minutes: activityData.duration_minutes,
            max_participants: activityData.max_participants,
            min_participants: activityData.min_participants,
            min_age: activityData.min_age,
            included_items: activityData.included_items,
            excluded_items: activityData.excluded_items,
            what_to_bring: activityData.what_to_bring,
            cancellation_policy: activityData.cancellation_policy,
            safety_requirements: activityData.safety_requirements,
            weather_dependent: activityData.weather_dependent,
            instant_confirmation: activityData.instant_confirmation,
            status: activityData.status,
            featured: activityData.featured,
            avg_rating: Math.random() * 0.5 + 4.5, // Random rating between 4.5-5.0
            total_reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
            total_bookings: Math.floor(Math.random() * 500) + 100 // Random bookings 100-600
          })
          .select()
          .single()

        if (activityError) {
          errors.push(`Activity ${activityData.title}: ${activityError.message}`)
          continue
        }

        // Insert activity image
        const { error: imageError } = await supabase
          .from('activity_images')
          .insert({
            activity_id: activity.id,
            image_url: activityData.image_url,
            alt_text: activityData.alt_text,
            is_primary: true,
            sort_order: 1
          })

        if (imageError) {
          errors.push(`Image for ${activityData.title}: ${imageError.message}`)
        }

        // Insert activity pricing
        const { error: pricingError } = await supabase
          .from('activity_pricing')
          .insert({
            activity_id: activity.id,
            price_type: 'adult',
            base_price: activityData.base_price,
            currency: 'EUR',
            is_active: true
          })

        if (pricingError) {
          errors.push(`Pricing for ${activityData.title}: ${pricingError.message}`)
        }

        successCount++
        console.log(`✅ Successfully created: ${activityData.title}`)

      } catch (error) {
        errors.push(`Failed to create ${activityData.title}: ${error}`)
        console.error(`❌ Error creating ${activityData.title}:`, error)
      }
    }

    return {
      isSuccess: true,
      message: `Successfully created ${successCount} activities. ${errors.length > 0 ? `Errors: ${errors.join(', ')}` : ''}`,
      data: {
        created: successCount,
        total: CLIENT_ACTIVITIES.length,
        errors: errors
      }
    }

  } catch (error) {
    console.error("Error seeding client activities:", error)
    return {
      isSuccess: false,
      message: "Failed to seed client activities"
    }
  }
}