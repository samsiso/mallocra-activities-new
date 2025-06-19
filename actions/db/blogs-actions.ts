"use server"

import { db } from "@/db/db"
import { 
  InsertBlog, 
  SelectBlog, 
  blogsTable, 
  blogTagsTable,
  blogToTagTable,
  blogCategoryEnum,
  InsertBlogTag,
  SelectBlogTag,
  relatedBlogsTable,
  blogStatusEnum
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq, desc, and, like, count, asc, ne } from "drizzle-orm"

// Create Blog
export async function createBlogAction(
  blog: InsertBlog
): Promise<ActionState<SelectBlog>> {
  try {
    const [newBlog] = await db.insert(blogsTable).values(blog).returning()
    return {
      isSuccess: true,
      message: "Blog created successfully",
      data: newBlog
    }
  } catch (error) {
    console.error("Error creating blog:", error)
    return { isSuccess: false, message: "Failed to create blog" }
  }
}

// Get Blogs with pagination and filtering
export async function getBlogsAction(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: typeof blogCategoryEnum.enumValues[number],
  featured?: boolean
): Promise<ActionState<SelectBlog[]>> {
  try {
    const offset = (page - 1) * limit
    
    let conditions = []
    conditions.push(eq(blogsTable.status, "published"))
    
    if (search) {
      conditions.push(like(blogsTable.title, `%${search}%`))
    }
    
    if (category) {
      conditions.push(eq(blogsTable.category, category))
    }
    
    if (featured !== undefined) {
      conditions.push(eq(blogsTable.isFeatured, featured))
    }

    const blogs = await db
      .select()
      .from(blogsTable)
      .where(and(...conditions))
      .orderBy(desc(blogsTable.publishedAt), desc(blogsTable.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      isSuccess: true,
      message: "Blogs retrieved successfully",
      data: blogs
    }
  } catch (error) {
    console.error("Error getting blogs:", error)
    return { isSuccess: false, message: "Failed to get blogs" }
  }
}

// Get Blog by Slug
export async function getBlogBySlugAction(
  slug: string
): Promise<ActionState<SelectBlog>> {
  try {
    const blog = await db
      .select()
      .from(blogsTable)
      .where(and(
        eq(blogsTable.slug, slug),
        eq(blogsTable.status, "published")
      ))
      .limit(1)

    if (!blog || blog.length === 0) {
      return { isSuccess: false, message: "Blog not found" }
    }

    return {
      isSuccess: true,
      message: "Blog retrieved successfully",
      data: blog[0]
    }
  } catch (error) {
    console.error("Error getting blog:", error)
    return { isSuccess: false, message: "Failed to get blog" }
  }
}

// Update Blog
export async function updateBlogAction(
  id: string,
  data: Partial<InsertBlog>
): Promise<ActionState<SelectBlog>> {
  try {
    const [updatedBlog] = await db
      .update(blogsTable)
      .set(data)
      .where(eq(blogsTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Blog updated successfully",
      data: updatedBlog
    }
  } catch (error) {
    console.error("Error updating blog:", error)
    return { isSuccess: false, message: "Failed to update blog" }
  }
}

// Delete Blog
export async function deleteBlogAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(blogsTable).where(eq(blogsTable.id, id))
    return {
      isSuccess: true,
      message: "Blog deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting blog:", error)
    return { isSuccess: false, message: "Failed to delete blog" }
  }
}

// Get Blog Count for pagination
export async function getBlogCountAction(
  search?: string,
  category?: typeof blogCategoryEnum.enumValues[number],
  featured?: boolean
): Promise<ActionState<number>> {
  try {
    let conditions = []
    conditions.push(eq(blogsTable.status, "published"))
    
    if (search) {
      conditions.push(like(blogsTable.title, `%${search}%`))
    }
    
    if (category) {
      conditions.push(eq(blogsTable.category, category))
    }
    
    if (featured !== undefined) {
      conditions.push(eq(blogsTable.isFeatured, featured))
    }

    const [result] = await db
      .select({ count: count() })
      .from(blogsTable)
      .where(and(...conditions))

    return {
      isSuccess: true,
      message: "Blog count retrieved successfully",
      data: result.count
    }
  } catch (error) {
    console.error("Error getting blog count:", error)
    return { isSuccess: false, message: "Failed to get blog count" }
  }
}

// Tags Actions
export async function getTagsAction(): Promise<ActionState<SelectBlogTag[]>> {
  try {
    const tags = await db
      .select()
      .from(blogTagsTable)
      .orderBy(asc(blogTagsTable.name))

    return {
      isSuccess: true,
      message: "Tags retrieved successfully",
      data: tags
    }
  } catch (error) {
    console.error("Error getting tags:", error)
    return { isSuccess: false, message: "Failed to get tags" }
  }
}

export async function getBlogTagsAction(blogId: string): Promise<ActionState<SelectBlogTag[]>> {
  try {
    const blogTags = await db
      .select({
        id: blogTagsTable.id,
        name: blogTagsTable.name,
        createdAt: blogTagsTable.createdAt,
        updatedAt: blogTagsTable.updatedAt
      })
      .from(blogToTagTable)
      .innerJoin(blogTagsTable, eq(blogToTagTable.tagId, blogTagsTable.id))
      .where(eq(blogToTagTable.blogId, blogId))
      .orderBy(asc(blogTagsTable.name))

    return {
      isSuccess: true,
      message: "Blog tags retrieved successfully",
      data: blogTags
    }
  } catch (error) {
    console.error("Error getting blog tags:", error)
    return { isSuccess: false, message: "Failed to get blog tags" }
  }
}

export async function getBlogsByTagAction(
  tagName: string
): Promise<ActionState<SelectBlog[]>> {
  try {
    const tag = await db
      .select()
      .from(blogTagsTable)
      .where(eq(blogTagsTable.name, tagName))
      .limit(1)

    if (!tag || tag.length === 0) {
      return { isSuccess: false, message: "Tag not found" }
    }

    const rows = await db
      .select()
      .from(blogsTable)
      .innerJoin(blogToTagTable, eq(blogToTagTable.blogId, blogsTable.id))
      .where(and(
        eq(blogToTagTable.tagId, tag[0].id),
        eq(blogsTable.status, "published")
      ))
      .orderBy(desc(blogsTable.publishedAt), desc(blogsTable.createdAt))
    
    const blogs = rows.map(row => row.blogs)

    return {
      isSuccess: true,
      message: "Blogs retrieved successfully",
      data: blogs
    }
  } catch (error) {
    console.error("Error getting blogs by tag:", error)
    return { isSuccess: false, message: "Failed to get blogs by tag" }
  }
}

export async function getRelatedBlogsAction(
  blogId: string
): Promise<ActionState<SelectBlog[]>> {
  try {
    // Get current blog to find related blogs by category
    const currentBlog = await db
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.id, blogId))
      .limit(1)

    if (!currentBlog || currentBlog.length === 0) {
      return { isSuccess: false, message: "Blog not found" }
    }

    // Find related blogs in the same category, excluding the current blog
    const relatedBlogs = await db
      .select()
      .from(blogsTable)
      .where(and(
        eq(blogsTable.category, currentBlog[0].category),
        eq(blogsTable.status, "published"),
        ne(blogsTable.id, blogId) // Exclude current blog
      ))
      .orderBy(desc(blogsTable.publishedAt), desc(blogsTable.createdAt))
      .limit(3)

    return {
      isSuccess: true,
      message: "Related blogs retrieved successfully",
      data: relatedBlogs
    }
  } catch (error) {
    console.error("Error getting related blogs:", error)
    return { isSuccess: false, message: "Failed to get related blogs" }
  }
}

export async function getBlogCountByTagAction(
  tagName: string
): Promise<ActionState<number>> {
  try {
    const tag = await db
      .select()
      .from(blogTagsTable)
      .where(eq(blogTagsTable.name, tagName))
      .limit(1)

    if (!tag || tag.length === 0) {
      return { isSuccess: false, message: "Tag not found" }
    }

    const [result] = await db
      .select({ count: count() })
      .from(blogsTable)
      .innerJoin(blogToTagTable, eq(blogToTagTable.blogId, blogsTable.id))
      .where(and(
        eq(blogToTagTable.tagId, tag[0].id),
        eq(blogsTable.status, "published")
      ))

    return {
      isSuccess: true,
      message: "Blog count retrieved successfully",
      data: result.count
    }
  } catch (error) {
    console.error("Error getting blog count by tag:", error)
    return { isSuccess: false, message: "Failed to get blog count by tag" }
  }
}

 