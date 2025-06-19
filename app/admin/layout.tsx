"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // TEMPORARY: Skip authentication in development (when NODE_ENV is not 'production')
  if (process.env.NODE_ENV === "production") {
    const { userId } = await auth()

    // Redirect to login if not authenticated
    if (!userId) {
      redirect("/login")
    }

    // In a real app, you'd check if the user has admin privileges
    // For now, we'll allow any authenticated user to access admin
    // You can add role-based access control here later
  }

  return <>{children}</>
}
