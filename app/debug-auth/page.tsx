"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function DebugAuthPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (isLoaded) {
      const info = {
        isSignedIn,
        userId: user?.id || null,
        email: user?.emailAddresses?.[0]?.emailAddress || null,
        firstName: user?.firstName || null,
        lastName: user?.lastName || null,
        fullUserObject: user
          ? {
              id: user.id,
              emailAddresses: user.emailAddresses?.map(e => e.emailAddress),
              phoneNumbers: user.phoneNumbers?.map(p => p.phoneNumber),
              firstName: user.firstName,
              lastName: user.lastName
            }
          : null
      }
      setDebugInfo(info)
      console.log("🔍 Client-side auth debug:", info)
    }
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded) {
    return <div className="p-8">Loading auth state...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">🔍 Auth Debug Page</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Is Signed In:</strong> {isSignedIn ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Is Loaded:</strong> {isLoaded ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>User ID:</strong> {user?.id || "None"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {user?.emailAddresses?.[0]?.emailAddress || "None"}
            </p>
            <p>
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>

        {debugInfo && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Full Debug Info</h2>
            <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 space-x-4">
          {!isSignedIn ? (
            <a
              href="/sign-in"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Go to Sign In
            </a>
          ) : (
            <a
              href="/bookings"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Go to My Bookings
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
