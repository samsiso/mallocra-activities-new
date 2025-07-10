import { auth, currentUser } from "@clerk/nextjs/server"
import { supabaseAdminClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Debugging current authenticated user...")

    // Get Clerk auth info
    const { userId: clerkUserId } = await auth()
    const user = await currentUser()

    console.log("Current Clerk User ID:", clerkUserId)
    console.log(
      "Current Clerk User:",
      user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddresses: user.emailAddresses?.map(e => e.emailAddress)
          }
        : null
    )

    if (!clerkUserId) {
      return NextResponse.json({
        error: "User not authenticated",
        authenticated: false
      })
    }

    // Check if user profile exists in Supabase
    const { data: userProfile, error: profileError } = await supabaseAdminClient
      .from("users_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .single()

    console.log("User profile from DB:", userProfile)
    console.log("Profile error:", profileError)

    // Get ALL bookings to see what's available
    const { data: allBookings, error: allBookingsError } =
      await supabaseAdminClient.from("bookings").select("*").limit(10)

    console.log("All bookings in DB:", allBookings)

    let userBookings = null
    if (userProfile) {
      // Check for bookings with this user's profile ID
      const { data: bookings, error: bookingsError } = await supabaseAdminClient
        .from("bookings")
        .select("*")
        .eq("customer_id", userProfile.id)

      console.log("User specific bookings:", bookings)
      console.log("User bookings error:", bookingsError)

      userBookings = bookings
    }

    const result = {
      timestamp: new Date().toISOString(),
      authenticated: true,
      clerk: {
        userId: clerkUserId,
        email: user?.emailAddresses?.[0]?.emailAddress || null,
        firstName: user?.firstName || null,
        lastName: user?.lastName || null
      },
      supabase: {
        userProfile,
        profileError: profileError?.message || null,
        userBookings,
        userBookingsCount: userBookings?.length || 0
      },
      debug: {
        allBookingsCount: allBookings?.length || 0,
        sampleBooking: allBookings?.[0] || null
      }
    }

    console.log(
      "🔍 Current user debug result:",
      JSON.stringify(result, null, 2)
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 Current user debug failed:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        authenticated: false
      },
      { status: 500 }
    )
  }
}
