"use client"

/*
<ai_context>
User avatar and menu component for the sidebar navigation.
Safe version that works without Clerk environment variables.
</ai_context>
*/

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function NavUser() {
  // Check if Clerk is available at build time
  const isClerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!isClerkAvailable) {
    return (
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">?</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Guest</span>
          <span className="truncate text-xs">Auth not configured</span>
        </div>
      </div>
    )
  }

  // If we get here, Clerk should be available, so we can safely import the Clerk component
  try {
    const ClerkNavUserComponent =
      require("./nav-user-clerk").ClerkNavUserComponent
    return <ClerkNavUserComponent />
  } catch (error) {
    console.warn("Failed to load Clerk nav user component:", error)
    return (
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">?</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Guest</span>
          <span className="truncate text-xs">Failed to load auth</span>
        </div>
      </div>
    )
  }
}
