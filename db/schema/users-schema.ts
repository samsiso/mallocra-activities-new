/*
<ai_context>
Comprehensive user management schema for the Mallorca Activities platform.
Supports customers, salespeople, operators, and admins with proper role-based access.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  decimal
} from "drizzle-orm/pg-core"

// User type enumeration
export const userTypeEnum = pgEnum("user_type", [
  "customer",
  "salesperson",
  "operator",
  "admin"
])

// User status enumeration
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
  "pending"
])

// Extended user profiles table (extends Clerk authentication)
export const usersProfilesTable = pgTable("users_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  userType: userTypeEnum("user_type").notNull().default("customer"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("en"),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Salespeople extended information
export const salespeopleTable = pgTable("salespeople", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersProfilesTable.id, { onDelete: "cascade" })
    .notNull(),
  commissionRate: decimal("commission_rate").default("0.15"), // 15% default commission
  territory: text("territory"), // Geographic area assigned
  monthlyTarget: decimal("monthly_target"),
  totalSales: decimal("total_sales").default("0"),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Operators (activity providers) extended information
export const operatorsTable = pgTable("operators", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersProfilesTable.id, { onDelete: "cascade" })
    .notNull(),
  businessName: text("business_name").notNull(),
  licenseNumber: text("license_number"),
  insuranceNumber: text("insurance_number"),
  commissionRate: decimal("commission_rate").default("0.15"), // 15% platform commission
  businessAddress: text("business_address"),
  businessPhone: text("business_phone"),
  businessEmail: text("business_email"),
  status: userStatusEnum("status").notNull().default("pending"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Type exports for the schemas
export type InsertUserProfile = typeof usersProfilesTable.$inferInsert
export type SelectUserProfile = typeof usersProfilesTable.$inferSelect

export type InsertSalesperson = typeof salespeopleTable.$inferInsert
export type SelectSalesperson = typeof salespeopleTable.$inferSelect

export type InsertOperator = typeof operatorsTable.$inferInsert
export type SelectOperator = typeof operatorsTable.$inferSelect
