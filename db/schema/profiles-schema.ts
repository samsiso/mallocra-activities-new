/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

// Role enum for access control
export const roleEnum = pgEnum("role", ["user", "admin"])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membershipEnum("membership").notNull().default("free"),
  // Access control role
  role: roleEnum("role").notNull().default("user"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect
