// Safe Supabase client initialization that handles build-time environment
import { createClient } from "@supabase/supabase-js"

// Check if we're in a build environment
const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  (process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME)

// Use dummy values during build if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"

// Create a minimal client configuration for build time
const buildTimeConfig = {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      "X-Build-Time": "true"
    }
  },
  realtime: {
    params: {
      eventsPerSecond: -1
    }
  }
}

// Export different clients based on environment
export const supabase = isBuildTime
  ? createClient(supabaseUrl, supabaseAnonKey, buildTimeConfig)
  : createClient(supabaseUrl, supabaseAnonKey)

export const supabaseServerClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  buildTimeConfig
)
