import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"])

export const mediaTable = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),

  // External storage metadata (Cloudinary)
  cloudinaryId: text("cloudinary_id").notNull(),
  publicUrl: text("public_url").notNull(),
  secureUrl: text("secure_url").notNull(),

  // Media information
  type: mediaTypeEnum("type").notNull(),
  format: text("format").notNull(),
  width: text("width").notNull(),
  height: text("height").notNull(),

  // Association metadata
  activityId: uuid("activity_id"), // Optional link to an activity

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertMedia = typeof mediaTable.$inferInsert
export type SelectMedia = typeof mediaTable.$inferSelect
