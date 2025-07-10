/*
<ai_context>
System settings schema for the Mallorca Activities platform.
Handles configuration settings, feature flags, and system parameters.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer
} from "drizzle-orm/pg-core"

// Settings category enumeration
export const settingsCategoryEnum = pgEnum("settings_category", [
  "general",
  "seo",
  "email",
  "payment",
  "booking",
  "appearance",
  "integration",
  "security",
  "performance"
])

// Settings type enumeration
export const settingsTypeEnum = pgEnum("settings_type", [
  "text",
  "number",
  "boolean",
  "json",
  "select",
  "multiselect",
  "color",
  "date",
  "time"
])

// System settings table
export const systemSettingsTable = pgTable("system_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  type: settingsTypeEnum("type").notNull(),
  category: settingsCategoryEnum("category").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  options: jsonb("options"), // For select/multiselect types
  validation: jsonb("validation"), // Validation rules
  isPublic: boolean("is_public").default(false), // Can be exposed to frontend
  isEditable: boolean("is_editable").default(true), // Can be edited by admin
  sortOrder: integer("sort_order").default(0),
  updatedBy: text("updated_by"), // User ID who last updated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Feature flags table
export const featureFlagsTable = pgTable("feature_flags", {
  key: text("key").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  description: text("description"),
  rolloutPercentage: integer("rollout_percentage").default(100), // For gradual rollouts
  targetUsers: text("target_users").array(), // Specific user IDs
  metadata: jsonb("metadata"), // Additional configuration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Email templates table
export const emailTemplatesTable = pgTable("email_templates", {
  key: text("key").primaryKey(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  variables: text("variables").array(), // Available template variables
  isActive: boolean("is_active").default(true),
  category: text("category"), // booking, marketing, system
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Audit log for settings changes
export const settingsAuditLogTable = pgTable("settings_audit_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  settingKey: text("setting_key").notNull(),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  changedBy: text("changed_by").notNull(), // User ID
  changeType: text("change_type").notNull(), // create, update, delete
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// Type exports
export type InsertSystemSettings = typeof systemSettingsTable.$inferInsert
export type SelectSystemSettings = typeof systemSettingsTable.$inferSelect

export type InsertFeatureFlags = typeof featureFlagsTable.$inferInsert
export type SelectFeatureFlags = typeof featureFlagsTable.$inferSelect

export type InsertEmailTemplates = typeof emailTemplatesTable.$inferInsert
export type SelectEmailTemplates = typeof emailTemplatesTable.$inferSelect

export type InsertSettingsAuditLog = typeof settingsAuditLogTable.$inferInsert
export type SelectSettingsAuditLog = typeof settingsAuditLogTable.$inferSelect
