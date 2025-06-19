// Polyfills temporarily disabled to fix deployment
// import "./polyfills"

import { createClient } from "@supabase/supabase-js"

// Use dummy values during build if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key"

// Client-side Supabase client (with realtime features)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

// Server-side Supabase client (without realtime to avoid 'self is not defined' errors)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: -1 // Disable realtime
    }
  },
  auth: {
    persistSession: false // Don't persist sessions on server
  }
})

// Service role client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    realtime: {
      params: {
        eventsPerSecond: -1 // Disable realtime
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
