import { NextResponse } from "next/server"

export async function GET() {
  // Only allow in development or with a specific query parameter
  const isDev = process.env.NODE_ENV === "development"

  // Get environment variables
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasMcpKey = !!process.env.MCP_API_KEY

  // Check key formats
  const clerkKeyInfo = clerkKey
    ? {
        length: clerkKey.length,
        prefix: clerkKey.substring(0, 10),
        suffix: clerkKey.substring(clerkKey.length - 4),
        startsWithPk: clerkKey.startsWith("pk_"),
        fullPrefix: clerkKey.substring(0, 20) + "..."
      }
    : null

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV,
    clerkKey: clerkKeyInfo,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : null,
    hasSupabaseServiceKey,
    hasMcpKey,
    timestamp: new Date().toISOString()
  })
}
