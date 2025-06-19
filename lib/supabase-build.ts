// Build-safe Supabase client for server-side rendering and builds
// This client is completely stripped of browser dependencies

// Polyfills temporarily disabled to fix deployment
// import "./build-polyfills"

import { createClient } from "@supabase/supabase-js"

// Use dummy values during build if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Build-safe Supabase client with all real-time features disabled
export const supabaseBuildSafe = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: "implicit"
  },
  realtime: {
    params: {
      eventsPerSecond: -1
    },
    heartbeatIntervalMs: 0,
    reconnectAfterMs: () => -1
  },
  db: {
    schema: "public"
  },
  global: {
    headers: {
      "x-client-info": "supabase-js-build-safe"
    }
  }
})

// Admin client for server operations
export const supabaseBuildSafeAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: "implicit"
      },
      realtime: {
        params: {
          eventsPerSecond: -1
        },
        heartbeatIntervalMs: 0,
        reconnectAfterMs: () => -1
      },
      db: {
        schema: "public"
      },
      global: {
        headers: {
          "x-client-info": "supabase-js-build-safe-admin"
        }
      }
    })
  : supabaseBuildSafe

export default supabaseBuildSafe
