"use server"

import { supabaseAdminClient } from "@/lib/supabase-server"

export async function createBookingServerAction(bookingData: any) {
  try {
    // First, ensure the customer exists in users_profiles
    const { data: existingUser } = await supabaseAdminClient
      .from('users_profiles')
      .select('id')
      .eq('id', bookingData.customerId)
      .single()
    
    if (!existingUser) {
      // Create a guest user profile
      const { error: userError } = await supabaseAdminClient
        .from('users_profiles')
        .insert({
          id: bookingData.customerId,
          clerk_user_id: bookingData.customerId, // Use same ID for guest users
          email: bookingData.leadCustomerEmail,
          first_name: bookingData.leadCustomerName.split(' ')[0],
          last_name: bookingData.leadCustomerName.split(' ').slice(1).join(' ') || 'Guest',
          phone: bookingData.leadCustomerPhone
        })
      
      if (userError) {
        console.error("Error creating user profile:", userError)
        return {
          isSuccess: false,
          message: `Failed to create user: ${userError.message}`,
          data: null
        }
      }
    }
    
    const { data: booking, error } = await supabaseAdminClient
      .from('bookings')
      .insert({
        booking_reference: bookingData.bookingReference,
        activity_id: bookingData.activityId,
        customer_id: bookingData.customerId,
        booking_date: bookingData.bookingDate,
        booking_time: bookingData.bookingTime,
        adults: bookingData.adults,
        children: bookingData.children,
        seniors: bookingData.seniors,
        total_participants: bookingData.totalParticipants,
        subtotal: bookingData.subtotal,
        total_amount: bookingData.totalAmount,
        currency: bookingData.currency,
        lead_customer_name: bookingData.leadCustomerName,
        lead_customer_email: bookingData.leadCustomerEmail,
        lead_customer_phone: bookingData.leadCustomerPhone,
        special_requirements: bookingData.specialRequirements,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error("Booking creation error:", error)
      return {
        isSuccess: false,
        message: `Database error: ${error.message}`,
        data: null
      }
    }

    return {
      isSuccess: true,
      message: "Booking created successfully",
      data: booking
    }
  } catch (error) {
    console.error("Server action error:", error)
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null
    }
  }
}