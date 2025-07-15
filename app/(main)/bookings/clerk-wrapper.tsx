"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

interface ClerkWrapperProps {
  children: ReactNode
}

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  // Check if we're in a browser environment and if ClerkProvider is needed
  const needsClerkProvider =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (needsClerkProvider) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        {children}
      </ClerkProvider>
    )
  }

  return <>{children}</>
}
