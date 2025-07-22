import { auth, currentUser } from "@clerk/nextjs/server"
import { getUserBookingsAction } from "@/actions/db/bookings-actions"
import { syncClerkUserAction } from "@/actions/db/users-actions"
import ClientBookingsComponent from "./client-bookings-component"

// Prevent static generation since we need user auth
export const dynamic = "force-dynamic"

export default async function BookingsPage() {
  const { userId } = await auth()
  const user = await currentUser()

  // Server-side auth check
  if (!userId || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-amber-900 to-rose-800">
        <section className="relative flex min-h-screen items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 size-80 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative text-center">
            <div className="rounded-xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 text-6xl">🔐</div>
              <h1 className="mb-4 text-3xl font-bold text-white">
                Sign In Required
              </h1>
              <p className="mb-6 text-white/70">
                Please sign in to view and manage your bookings
              </p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:from-yellow-300 hover:to-amber-400"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Server-side data fetching
  let userProfile = null
  let bookings: any[] = []

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
      userProfile = profileResult.data

      // Fetch user bookings
      const bookingsResult = await getUserBookingsAction(profileResult.data.id)
      if (bookingsResult.isSuccess) {
        bookings = bookingsResult.data
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    // Continue with empty data - client component will handle the error state
  }

  // Pass server-fetched data to client component
  return (
    <ClientBookingsComponent
      userId={userId}
      userProfile={userProfile}
      initialBookings={bookings}
      userData={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses
      }}
    />
  )
}
