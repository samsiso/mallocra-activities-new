/*
<ai_context>
Activities Page - Server Component Refactor
Converted from massive 842-line client component to server-side rendered page 
with proper data fetching and component separation for optimal performance.
Implements streaming, suspense boundaries, and modular architecture.
</ai_context>
*/

export const dynamic = "force-dynamic"

import { Suspense } from "react"
import {
  ActivitySearchParams,
  getActivitiesSupabaseAction
} from "@/actions/supabase-activities-actions"
import ActivitiesPageClient from "./_components/activities-page-client"
import ActivitiesLoading from "./_components/activities-loading"

// Server component for data fetching
async function ActivitiesDataFetcher({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams as per Next.js requirements
  const params = await searchParams

  // Extract search parameters
  const activityParams: ActivitySearchParams = {
    search: typeof params.search === "string" ? params.search : undefined,
    category:
      typeof params.category === "string" && params.category !== "all"
        ? params.category
        : undefined,
    location:
      typeof params.location === "string" && params.location !== "all"
        ? params.location
        : undefined,
    sortBy: (typeof params.sort === "string" ? params.sort : "featured") as any,
    limit: 50 // Increased limit for better UX
  }

  // Fetch activities on server-side
  const result = await getActivitiesSupabaseAction(activityParams)
  const activities = result.isSuccess ? result.data || [] : []

  return (
    <ActivitiesPageClient
      initialActivities={activities}
      initialSearchParams={activityParams}
    />
  )
}

// Main page component with Suspense
export default async function ActivitiesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ActivitiesLoading />}>
      <ActivitiesDataFetcher searchParams={searchParams} />
    </Suspense>
  )
}
