/*
<ai_context>
Activities and inventory management schema for the Mallorca Activities platform.
Handles activity listings, pricing, availability, and real-time inventory management.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  boolean,
  date,
  time
} from "drizzle-orm/pg-core"
import { operatorsTable } from "./users-schema"

// Activity category enumeration based on our research
export const activityCategoryEnum = pgEnum("activity_category", [
  "water_sports",
  "land_adventures",
  "cultural",
  "nightlife",
  "family_fun"
])

// Activity status enumeration
export const activityStatusEnum = pgEnum("activity_status", [
  "active",
  "inactive",
  "draft",
  "suspended"
])

// Availability status enumeration
export const availabilityStatusEnum = pgEnum("availability_status", [
  "available",
  "limited",
  "full",
  "cancelled"
])

// Weather status enumeration
export const weatherStatusEnum = pgEnum("weather_status", [
  "good",
  "marginal",
  "cancelled"
])

// Price type enumeration
export const priceTypeEnum = pgEnum("price_type", [
  "adult",
  "child",
  "senior",
  "group",
  "family"
])

// Main activities table
export const activitiesTable = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  operatorId: uuid("operator_id")
    .references(() => operatorsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(), // SEO-friendly URL slug
  description: text("description"), // Rich text description
  shortDescription: text("short_description"), // For card displays
  category: activityCategoryEnum("category").notNull(),
  location: text("location").notNull(), // Main location (Palma, Alcúdia, etc.)
  meetingPoint: text("meeting_point"), // Specific meeting location
  latitude: decimal("latitude", { precision: 10, scale: 8 }), // Geographic latitude
  longitude: decimal("longitude", { precision: 11, scale: 8 }), // Geographic longitude
  durationMinutes: integer("duration_minutes").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  minParticipants: integer("min_participants").default(1),
  minAge: integer("min_age"),
  maxAge: integer("max_age"),
  includedItems: text("included_items").array(), // What's included
  excludedItems: text("excluded_items").array(), // What's not included
  whatToBring: text("what_to_bring").array(), // What customers should bring
  cancellationPolicy: text("cancellation_policy"),
  safetyRequirements: text("safety_requirements"),
  weatherDependent: boolean("weather_dependent").default(false),
  instantConfirmation: boolean("instant_confirmation").default(true),
  status: activityStatusEnum("status").notNull().default("draft"),
  featured: boolean("featured").default(false), // For homepage display
  avgRating: decimal("avg_rating").default("0"), // Calculated average rating
  totalReviews: integer("total_reviews").default(0), // Total number of reviews
  totalBookings: integer("total_bookings").default(0), // Total bookings count
  videoUrl: text("video_url"), // URL to activity video (Cloudinary)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Activity images table
export const activityImagesTable = pgTable("activity_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false), // Main image for cards
  sortOrder: integer("sort_order").default(0), // Display order
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// Activity pricing table - supports different price types and seasonal pricing
export const activityPricingTable = pgTable("activity_pricing", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "cascade" })
    .notNull(),
  priceType: priceTypeEnum("price_type").notNull(),
  basePrice: decimal("base_price").notNull(), // Base price in EUR
  seasonalMultiplier: decimal("seasonal_multiplier").default("1.0"), // Peak season multiplier
  currency: text("currency").default("EUR"),
  validFrom: date("valid_from"), // Start date for this pricing
  validUntil: date("valid_until"), // End date for this pricing
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Activity availability table - handles real-time availability
export const activityAvailabilityTable = pgTable("activity_availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  timeSlot: time("time_slot"), // Specific time slot (e.g., 10:00, 14:00)
  maxCapacity: integer("max_capacity").notNull(),
  availableSpots: integer("available_spots").notNull(),
  priceOverride: decimal("price_override"), // Override base pricing for this slot
  status: availabilityStatusEnum("status").notNull().default("available"),
  weatherStatus: weatherStatusEnum("weather_status").default("good"),
  notes: text("notes"), // Internal notes for operators
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Activity add-ons/extras table
export const activityAddOnsTable = pgTable("activity_add_ons", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "Professional Photos", "Equipment Rental"
  description: text("description"),
  price: decimal("price").notNull(),
  currency: text("currency").default("EUR"),
  isRequired: boolean("is_required").default(false),
  isAvailable: boolean("is_available").default(true),
  maxQuantity: integer("max_quantity").default(1), // Max quantity per booking
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Type exports for the schemas
export type InsertActivity = typeof activitiesTable.$inferInsert
export type SelectActivity = typeof activitiesTable.$inferSelect

export type InsertActivityImage = typeof activityImagesTable.$inferInsert
export type SelectActivityImage = typeof activityImagesTable.$inferSelect

export type InsertActivityPricing = typeof activityPricingTable.$inferInsert
export type SelectActivityPricing = typeof activityPricingTable.$inferSelect

export type InsertActivityAvailability =
  typeof activityAvailabilityTable.$inferInsert
export type SelectActivityAvailability =
  typeof activityAvailabilityTable.$inferSelect

export type InsertActivityAddOn = typeof activityAddOnsTable.$inferInsert
export type SelectActivityAddOn = typeof activityAddOnsTable.$inferSelect
