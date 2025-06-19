import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer
} from "drizzle-orm/pg-core"

// Blog post status enum
export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived"
])

// Blog category enum - updated to match actual database enum values
export const blogCategoryEnum = pgEnum("blog_category", [
  "guide",
  "tips",
  "destination",
  "activity",
  "event"
])

// Tags table
export const blogTagsTable = pgTable("blog_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Updated Blogs table to match actual database structure
export const blogsTable = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  authorId: text("author_id").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featuredImageUrl: text("featured_image_url"),
  status: blogStatusEnum("status").default("draft").notNull(),
  category: blogCategoryEnum("category").default("guide").notNull(),
  readTimeMinutes: integer("read_time_minutes"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  // New columns added to match code expectations
  summary: text("summary"),
  imageUrl: text("image_url"),
  author: text("author"),
  authorImageUrl: text("author_image_url"),
  publishedAt: timestamp("published_at"),
  canonicalUrl: text("canonical_url")
})

// Blog to tag relation table
export const blogToTagTable = pgTable("blog_to_tag", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .references(() => blogsTable.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => blogTagsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// Related blogs table
export const relatedBlogsTable = pgTable("related_blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .references(() => blogsTable.id, { onDelete: "cascade" })
    .notNull(),
  relatedBlogId: uuid("related_blog_id")
    .references(() => blogsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export type InsertBlog = typeof blogsTable.$inferInsert
export type SelectBlog = typeof blogsTable.$inferSelect

export type InsertBlogTag = typeof blogTagsTable.$inferInsert
export type SelectBlogTag = typeof blogTagsTable.$inferSelect

export type InsertBlogToTag = typeof blogToTagTable.$inferInsert
export type SelectBlogToTag = typeof blogToTagTable.$inferSelect

export type InsertRelatedBlog = typeof relatedBlogsTable.$inferInsert
export type SelectRelatedBlog = typeof relatedBlogsTable.$inferSelect
