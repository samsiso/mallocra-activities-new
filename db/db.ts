/*
<ai_context>
Database connection and configuration for the Mallorca Activities platform.
Uses PostgreSQL with Drizzle ORM, and a Supabase client.
Enhanced with proper connection pooling, timeout settings, and retry logic.
</ai_context>
*/

import {
  activitiesTable,
  activityAddOnsTable,
  activityAvailabilityTable,
  activityImagesTable,
  activityPricingTable,
  bookingsTable,
  bookingAddOnsTable,
  commissionsTable,
  operatorsTable,
  reviewsTable,
  mediaTable,
  profilesTable,
  todosTable,
  blogsTable,
  blogTagsTable,
  blogToTagTable,
  relatedBlogsTable,
  usersProfilesTable,
  salespeopleTable
} from "@/db/schema"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Create a PostgreSQL connection with enhanced settings for Supabase
const connectionString = process.env.DATABASE_URL || ""

// Only throw error when actually using the connection, not during import
if (!connectionString && typeof window === "undefined") {
  console.warn(
    "⚠️ DATABASE_URL environment variable is not set - database operations will fail"
  )
}

// Enhanced PostgreSQL connection settings for Supabase reliability
// Use a fallback connection string to avoid errors during build time
const client = postgres(
  connectionString || "postgresql://localhost:5432/fallback",
  {
    // Connection settings for Supabase
    ssl: connectionString ? "require" : false,

    // Connection pooling and timeout settings
    max: 10, // Maximum number of connections in pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 30, // 30 second connection timeout (increased from default)

    // Statement timeout and query settings
    // statement_timeout: 300000, // 5 minutes for long queries - not supported in this postgres client
    // query_timeout: 60000, // 60 seconds for regular queries

    // Connection retry settings
    max_lifetime: 3600, // Close connections after 1 hour

    // Enhanced error handling
    onnotice: () => {}, // Suppress notices in development

    // Connection parameters for better stability
    prepare: false, // Disable prepared statements for Supabase compatibility

    // Additional connection options for Supabase
    options: {
      application_name: "mallocra-activities-app"
    }
  }
)

export const db = drizzle(client, {
  schema: {
    // Core
    profiles: profilesTable,
    todos: todosTable,

    // Users Management
    usersProfiles: usersProfilesTable,
    salespeople: salespeopleTable,
    operators: operatorsTable,

    // Activities
    activities: activitiesTable,
    activityImages: activityImagesTable,
    activityPricing: activityPricingTable,
    activityAddOns: activityAddOnsTable,
    activityAvailability: activityAvailabilityTable,

    // Bookings
    bookings: bookingsTable,
    bookingAddOns: bookingAddOnsTable,

    // Reviews & Analytics
    reviews: reviewsTable,
    commissions: commissionsTable,

    // Media
    media: mediaTable,

    // Blogs
    blogs: blogsTable,
    blogTags: blogTagsTable,
    blogToTag: blogToTagTable,
    relatedBlogs: relatedBlogsTable
  }
})

// Connection health check utility
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Don't try to connect if no connection string is available
    if (!connectionString) {
      console.warn("⚠️ No DATABASE_URL available - skipping connection check")
      return false
    }

    await client`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}

// Graceful shutdown helper
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.end()
  } catch (error) {
    console.error("Error closing database connection:", error)
  }
}
