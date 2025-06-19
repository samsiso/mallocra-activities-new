"use server"

/*
<ai_context>
User Profile Page - Complete profile management dashboard
Features user information, booking stats, preferences, and account settings.
Dark glassmorphism theme with modern UI components.
</ai_context>
*/

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import UserProfileManager from "@/components/user-profile-manager"
import { getCurrentUserProfileAction } from "@/actions/db/users-actions"
import { Loader2 } from "lucide-react"

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">User Profile</h1>
          <p className="text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  )
}

async function ProfileContent() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  // Fetch initial profile data
  const profileResult = await getCurrentUserProfileAction()
  const initialProfile = profileResult.isSuccess ? profileResult.data : null

  return (
    <UserProfileManager
      initialProfile={initialProfile}
      className="mx-auto max-w-2xl"
    />
  )
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="mb-4 flex items-center space-x-3">
          <div className="size-6 rounded bg-gray-600" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-600" />
            <div className="h-3 w-48 rounded bg-gray-700" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full rounded bg-gray-700" />
          <div className="h-3 w-3/4 rounded bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-700" />
        </div>
      </div>

      <div className="animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-gray-600" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-10 w-full rounded bg-gray-700" />
            <div className="h-10 w-full rounded bg-gray-700" />
          </div>
          <div className="h-10 w-full rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-600" />
        </div>
      </div>
    </div>
  )
}
