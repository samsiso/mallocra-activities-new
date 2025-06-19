/*
<ai_context>
This client page provides the login form from Clerk.
Simplified version without theme context issues.
</ai_context>
*/

"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function LoginPage() {
  return (
    <SignIn
      appearance={{
        baseTheme: dark
      }}
    />
  )
}
