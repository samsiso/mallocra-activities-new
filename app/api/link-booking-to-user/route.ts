import { auth, currentUser } from "@clerk/nextjs/server"
import { supabaseAdminClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    const user = await currentUser()

    if (!clerkUserId || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("🔗 Linking booking to user:", clerkUserId)

    // First, ensure user profile exists
    const { data: existingProfile, error: profileCheckError } =
      await supabaseAdminClient
        .from("users_profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .single()

    let userProfile = existingProfile

    if (!existingProfile && profileCheckError?.code === "PGRST116") {
      // Create user profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabaseAdminClient
        .from("users_profiles")
        .insert({
          clerk_user_id: clerkUserId,
          email: user.emailAddresses?.[0]?.emailAddress || "",
          first_name: user.firstName || null,
          last_name: user.lastName || null,
          phone: user.phoneNumbers?.[0]?.phoneNumber || null,
          user_type: "customer",
          status: "active",
          preferred_language: "en"
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user profile:", createError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }

      userProfile = newProfile
      console.log("✅ Created new user profile:", userProfile)
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: "Could not create or find user profile" },
        { status: 500 }
      )
    }

    // Get the most recent booking that might belong to this user (by email match)
    const userEmail = user.emailAddresses?.[0]?.emailAddress
    if (!userEmail) {
      return NextResponse.json(
        { error: "No email found for user" },
        { status: 400 }
      )
    }

    const { data: unlinkedBookings, error: bookingsError } =
      await supabaseAdminClient
        .from("bookings")
        .select("*")
        .eq("lead_customer_email", userEmail)
        .neq("customer_id", userProfile.id)
        .order("created_at", { ascending: false })
        .limit(5)

    console.log(
      "🔍 Found unlinked bookings for email:",
      userEmail,
      unlinkedBookings
    )

    if (!unlinkedBookings || unlinkedBookings.length === 0) {
      return NextResponse.json({
        message: "No unlinked bookings found for your email",
        userProfile,
        userEmail
      })
    }

    // Link the bookings to this user profile
    const bookingIds = unlinkedBookings.map(b => b.id)
    const { data: updatedBookings, error: updateError } =
      await supabaseAdminClient
        .from("bookings")
        .update({ customer_id: userProfile.id })
        .in("id", bookingIds)
        .select()

    if (updateError) {
      console.error("Error linking bookings:", updateError)
      return NextResponse.json(
        { error: "Failed to link bookings" },
        { status: 500 }
      )
    }

    console.log("✅ Successfully linked bookings:", updatedBookings)

    return NextResponse.json({
      success: true,
      message: `Linked ${updatedBookings?.length || 0} bookings to your profile`,
      userProfile,
      linkedBookings: updatedBookings
    })
  } catch (error) {
    console.error("💥 Error linking booking to user:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
