"use client"

/*
<ai_context>
Identifies the user for PostHog analytics using Clerk user data.
Safe version that works without Clerk environment variables.
</ai_context>
*/

export function PostHogUserIdentify() {
  // Check if Clerk is available at build time
  const isClerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If Clerk is not available, return null
  if (!isClerkAvailable) {
    return null
  }

  // If we get here, Clerk should be available, so we can safely import it
  try {
    // Dynamic component that uses Clerk
    const ClerkUserIdentifyComponent =
      require("./posthog-user-identity-clerk").ClerkUserIdentifyComponent
    return <ClerkUserIdentifyComponent />
  } catch (error) {
    console.warn("Failed to load Clerk user identification:", error)
    return null
  }
}
