"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import {
  getUserBookingsAction,
  getBookingByReferenceAction
} from "@/actions/db/bookings-actions"
import { syncClerkUserAction } from "@/actions/db/users-actions"
import BookingsContent from "./bookings-content"
import { Loader2 } from "lucide-react"

export default function ClerkBookingsContent() {
  const { user, isLoaded } = useUser()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Fetch user data when user is loaded
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && user) {
        try {
          // Sync user profile
          const profileResult = await syncClerkUserAction({
            id: user.id,
            emailAddresses: user.emailAddresses || [],
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumbers: user.phoneNumbers || []
          })

          if (profileResult.isSuccess) {
            setUserProfile(profileResult.data)

            // Fetch user bookings
            const bookingsResult = await getUserBookingsAction(
              profileResult.data.id
            )
            if (bookingsResult.isSuccess) {
              setBookings(bookingsResult.data)
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
      setLoading(false)
    }

    fetchUserData()
  }, [isLoaded, user])

  // Show loading state
  if (loading || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin" />
          <p className="text-xl">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <BookingsContent
      user={user}
      userLoaded={isLoaded}
      bookings={bookings}
      userProfile={userProfile}
    />
  )
}
