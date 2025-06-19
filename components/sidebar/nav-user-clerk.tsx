"use client"

/*
<ai_context>
Clerk-specific nav user component.
This file is only loaded when Clerk is available.
</ai_context>
*/

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { UserButton, useUser } from "@clerk/nextjs"
import { ChevronsUpDown } from "lucide-react"

export function ClerkNavUserComponent() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">?</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Guest</span>
          <span className="truncate text-xs">Not signed in</span>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-start gap-2"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={user.imageUrl} alt={user.firstName || "User"} />
            <AvatarFallback className="rounded-lg">
              {user.firstName?.[0] ||
                user.emailAddresses?.[0]?.emailAddress?.[0] ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.emailAddresses?.[0]?.emailAddress || "User"}
            </span>
            <span className="truncate text-xs">
              {user.emailAddresses?.[0]?.emailAddress}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.imageUrl} alt={user.firstName || "User"} />
              <AvatarFallback className="rounded-lg">
                {user.firstName?.[0] ||
                  user.emailAddresses?.[0]?.emailAddress?.[0] ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.emailAddresses?.[0]?.emailAddress || "User"}
              </span>
              <span className="truncate text-xs">
                {user.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
