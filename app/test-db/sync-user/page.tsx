"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Prevent static generation of this page to avoid Clerk context issues
export const dynamic = "force-dynamic"
export const runtime = "edge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  syncClerkUserAction,
  getCurrentUserProfileAction
} from "@/actions/db/users-actions"

// Create a client-only component for the actual content
const SyncUserContent = dynamic(() => import("./sync-user-content"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-xl text-white">🔄 Loading...</div>
    </div>
  )
})

export default function SyncUserTestPage() {
  return <SyncUserContent />
}
