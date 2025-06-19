"use client"

/*
<ai_context>
Clerk-specific user identification component for PostHog.
This file is only loaded when Clerk is available.
</ai_context>
*/

import { useUser } from "@clerk/nextjs"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

export function ClerkUserIdentifyComponent() {
  const { user } = useUser()
  const posthog = usePostHog()

  useEffect(() => {
    if (user && posthog) {
      posthog.identify(user.id, {
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      })
    }
  }, [user, posthog])

  return null
}
