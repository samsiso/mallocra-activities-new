/*
<ai_context>
Audit logging schema for tracking all administrative and user actions
in the Mallorca Activities platform for security and compliance.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  index
} from "drizzle-orm/pg-core"

// Audit log severity levels
export const auditSeverityEnum = pgEnum("audit_severity", [
  "info", // Normal operations
  "warning", // Unusual but not problematic
  "error", // Errors that were handled
  "critical" // Security or critical issues
])

// Audit log categories
export const auditCategoryEnum = pgEnum("audit_category", [
  "auth", // Authentication events
  "admin", // Administrative actions
  "booking", // Booking operations
  "activity", // Activity management
  "review", // Review operations
  "payment", // Payment transactions
  "settings", // Settings changes
  "user" // User account changes
])

// Main audit log table
export const auditLogsTable = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // User information
    userId: text("user_id").notNull(), // Clerk user ID
    userEmail: text("user_email"),
    userName: text("user_name"),

    // Action details
    action: text("action").notNull(), // e.g., "UPDATE_ACTIVITY", "DELETE_BOOKING"
    resource: text("resource").notNull(), // e.g., "activity", "booking", "user"
    resourceId: text("resource_id"), // ID of the affected resource

    // Additional context
    details: jsonb("details"), // Any additional data about the action
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    // Categorization
    severity: auditSeverityEnum("severity").notNull().default("info"),
    category: auditCategoryEnum("category").notNull(),

    // Timestamp
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  table => ({
    // Indexes for common queries
    userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    resourceIdx: index("audit_logs_resource_idx").on(table.resource),
    categoryIdx: index("audit_logs_category_idx").on(table.category),
    severityIdx: index("audit_logs_severity_idx").on(table.severity),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
    resourceIdIdx: index("audit_logs_resource_id_idx").on(table.resourceId)
  })
)

// Type exports
export type InsertAuditLog = typeof auditLogsTable.$inferInsert
export type SelectAuditLog = typeof auditLogsTable.$inferSelect
