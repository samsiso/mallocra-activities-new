import { createClient } from "@supabase/supabase-js"

// Use dummy values during build if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co"
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-role-key"

// Admin client for server-side operations with elevated permissions
export const supabaseAdminClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    realtime: {
      params: {
        eventsPerSecond: -1 // Disable realtime for admin operations
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Export for compatibility
export default supabaseAdminClient
