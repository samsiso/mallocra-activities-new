// Polyfills temporarily disabled to fix deployment
// import "./polyfills"

// Server-only Supabase client without realtime dependencies
import { createClient } from "@supabase/supabase-js"

// Use dummy values during build if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-key"

// Server-side Supabase client for API routes
export const supabaseServerClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  // Completely disable all real-time features
  realtime: {
    params: {
      eventsPerSecond: -1
    }
  }
})

// Admin client for database operations requiring elevated permissions
export const supabaseAdminClient = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    // Completely disable all real-time features
    realtime: {
      params: {
        eventsPerSecond: -1
      }
    }
  }
)
