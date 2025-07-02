"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

export async function getBookingByIdServerAction(bookingId: string) {
  try {
    const { data: booking, error } = await supabaseAdminClient
      .from('bookings')
      .select(`
        *,
        activities:activity_id (
          id,
          title,
          location,
          duration_minutes
        )
      `)
      .eq('id', bookingId)
      .single()

    if (error) {
      console.error("Error fetching booking:", error)
      return {
        isSuccess: false,
        message: "Booking not found",
        data: null
      }
    }

    return {
      isSuccess: true,
      message: "Booking found",
      data: booking
    }
  } catch (error) {
    console.error("Server action error:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch booking",
      data: null
    }
  }
}