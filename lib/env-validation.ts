/**
 * Environment variable validation
 * This ensures all required environment variables are present
 * and prevents runtime errors on Vercel
 */

const requiredEnvVars = {
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Google Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,

  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

  // ImageKit
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
} as const

type RequiredEnvVars = typeof requiredEnvVars

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv(): void {
  const missingVars: string[] = []

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key)
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables:\n${missingVars.join("\n")}`
    console.error("❌ Environment validation failed!")
    console.error(errorMessage)

    // In development, log a warning but don't crash
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Continuing in development mode despite missing env vars"
      )
    } else {
      // In production, throw an error to prevent deployment
      throw new Error(errorMessage)
    }
  }
}

/**
 * Type-safe environment variable access
 */
export const env = {
  // Clerk
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  clerkSecretKey: process.env.CLERK_SECRET_KEY!,

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Google Maps
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,

  // Cloudinary
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,

  // ImageKit
  imagekitPublicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  imagekitUrlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
} as const

// Validate environment variables on module load
// This will catch issues early in the build process
if (typeof window === "undefined") {
  validateEnv()
}
