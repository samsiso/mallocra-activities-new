/*
<ai_context>
Blog management schema for the Mallorca Activities platform.
Handles blog posts, categories, tags, and SEO metadata.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb
} from "drizzle-orm/pg-core"
import { usersProfilesTable } from "./users-schema"

// Blog post status enumeration
export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "scheduled",
  "archived"
])

// Blog posts table
export const blogPostsTable = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"), // Short description for cards
  content: text("content").notNull(), // Rich text content
  featuredImage: text("featured_image"), // ImageKit URL
  authorId: uuid("author_id").references(() => usersProfilesTable.id, {
    onDelete: "set null"
  }),
  status: blogStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"), // For scheduled posts
  views: integer("views").default(0),
  readingTime: integer("reading_time"), // In minutes

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords").array(),

  // Additional metadata
  tags: text("tags").array(),
  category: text("category"), // e.g., "Activities", "Travel Tips", "Local Culture"

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Blog categories table
export const blogCategoriesTable = pgTable("blog_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Lucide icon name
  color: text("color"), // Hex color code
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// Blog settings table (for managing blog configuration)
export const blogSettingsTable = pgTable("blog_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Type exports
export type InsertBlogPost = typeof blogPostsTable.$inferInsert
export type SelectBlogPost = typeof blogPostsTable.$inferSelect

export type InsertBlogCategory = typeof blogCategoriesTable.$inferInsert
export type SelectBlogCategory = typeof blogCategoriesTable.$inferSelect

export type InsertBlogSettings = typeof blogSettingsTable.$inferInsert
export type SelectBlogSettings = typeof blogSettingsTable.$inferSelect
