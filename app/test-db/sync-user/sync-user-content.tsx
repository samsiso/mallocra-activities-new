"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  syncClerkUserAction,
  getCurrentUserProfileAction
} from "@/actions/db/users-actions"

export default function SyncUserContent() {
  const { user, isLoaded } = useUser()
  const [syncing, setSyncing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [syncResult, setSyncResult] = useState<string>("")
  const [checking, setChecking] = useState(false)

  const handleSyncUser = async () => {
    if (!user) return

    setSyncing(true)
    setSyncResult("🔄 Syncing user to Supabase...")

    try {
      const result = await syncClerkUserAction({
        id: user.id,
        emailAddresses: user.emailAddresses || [],
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumbers: user.phoneNumbers || []
      })

      setSyncResult(
        result.isSuccess
          ? "✅ User synced successfully!"
          : `❌ Error: ${result.message}`
      )

      if (result.isSuccess) {
        // Auto-check profile after successful sync
        setTimeout(() => {
          checkUserProfile()
        }, 1000)
      }
    } catch (error) {
      setSyncResult(`❌ Error: ${error}`)
    }
    setSyncing(false)
  }

  const checkUserProfile = async () => {
    if (!user) return

    setChecking(true)
    try {
      const result = await getCurrentUserProfileAction(user.id)
      setProfile(result.isSuccess ? result.data : null)

      if (!result.isSuccess) {
        setSyncResult(prev => prev + "\n⚠️ Profile not found in Supabase yet")
      }
    } catch (error) {
      console.error("Error checking profile:", error)
      setSyncResult(prev => prev + "\n❌ Error checking profile")
    }
    setChecking(false)
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-xl text-white">🔄 Loading Clerk...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Card className="w-full max-w-md border-gray-700 bg-gray-800">
          <CardContent className="p-6 text-center">
            <h2 className="mb-4 text-xl font-bold text-white">
              🔐 Login Required
            </h2>
            <p className="mb-4 text-gray-300">
              Please log in to test the sync functionality
            </p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              🔄 Clerk ↔ Supabase Sync Test
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Current User Info */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              👤 Current Clerk User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-gray-300 md:grid-cols-2">
              <div>
                <p>
                  <strong className="text-orange-400">ID:</strong> {user.id}
                </p>
                <p>
                  <strong className="text-orange-400">Email:</strong>{" "}
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <div>
                <p>
                  <strong className="text-orange-400">Name:</strong>{" "}
                  {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong className="text-orange-400">Phone:</strong>{" "}
                  {user.primaryPhoneNumber?.phoneNumber || "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Actions */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">⚡ Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleSyncUser}
                disabled={syncing}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {syncing ? "🔄 Syncing..." : "🔄 Sync to Supabase"}
              </Button>

              <Button
                onClick={checkUserProfile}
                disabled={checking}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-700"
              >
                {checking ? "🔍 Checking..." : "📊 Check Supabase Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {syncResult && (
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">📋 Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gray-900 p-4">
                <pre className="whitespace-pre-wrap text-gray-300">
                  {syncResult}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supabase Profile */}
        {profile && (
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                🗄️ Supabase Profile Found!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="grid grid-cols-1 gap-4 text-gray-300 md:grid-cols-2">
                  <div>
                    <p>
                      <strong className="text-green-400">Profile ID:</strong>{" "}
                      {profile.id}
                    </p>
                    <p>
                      <strong className="text-green-400">Clerk User ID:</strong>{" "}
                      {profile.clerkUserId}
                    </p>
                    <p>
                      <strong className="text-green-400">Email:</strong>{" "}
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="text-green-400">Name:</strong>{" "}
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p>
                      <strong className="text-green-400">Role:</strong>{" "}
                      {profile.role}
                    </p>
                    <p>
                      <strong className="text-green-400">Created:</strong>{" "}
                      {new Date(profile.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">📚 Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-300">
              <p>1. ✅ Test manual sync (click "Sync to Supabase" above)</p>
              <p>
                2. 🔗 Configure webhook in Clerk Dashboard for automatic sync
              </p>
              <p>3. 🧪 Test with new user registration</p>
              <p>4. 🚀 Deploy to production</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
