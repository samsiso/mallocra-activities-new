/*
<ai_context>
This client page provides the signup form from Clerk.
Simplified version without theme context issues.
</ai_context>
*/

"use client"

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        baseTheme: dark
      }}
    />
  )
}
