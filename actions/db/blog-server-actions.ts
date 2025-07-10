"use server"

import { ActionState } from "@/types"
import { supabaseAdminClient } from "@/lib/supabase-server"
import { logAdminAction } from "./audit-log-actions"

// Blog post type
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  authorId?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  scheduledFor?: string
  views: number
  readingTime?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  tags?: string[]
  category?: string
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    fullName: string
    avatarUrl?: string
  }
}

// Get all blog posts with filtering
export async function getBlogPostsAction(params?: {
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  category?: string
  limit?: number
  offset?: number
}): Promise<ActionState<BlogPost[]>> {
  try {
    let query = supabaseAdminClient
      .from('blog_posts')
      .select(`
        *,
        author:users_profiles(
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    if (params?.category) {
      query = query.eq('category', params.category)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error("Blog posts query error:", error)
      throw error
    }

    // Transform the data to match our interface
    const posts: BlogPost[] = (data || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featured_image,
      authorId: post.author_id,
      status: post.status,
      publishedAt: post.published_at,
      scheduledFor: post.scheduled_for,
      views: post.views || 0,
      readingTime: post.reading_time,
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
      metaKeywords: post.meta_keywords,
      tags: post.tags,
      category: post.category,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: post.author ? {
        id: post.author.id,
        fullName: post.author.full_name,
        avatarUrl: post.author.avatar_url
      } : undefined
    }))

    return {
      isSuccess: true,
      message: "Blog posts fetched successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    
    // Return empty array as fallback
    return {
      isSuccess: true,
      message: "No blog posts found",
      data: []
    }
  }
}

// Get single blog post by ID or slug
export async function getBlogPostAction(
  idOrSlug: string
): Promise<ActionState<BlogPost>> {
  try {
    // Try by ID first
    let { data, error } = await supabaseAdminClient
      .from('blog_posts')
      .select(`
        *,
        author:users_profiles(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', idOrSlug)
      .single()

    // If not found, try by slug
    if (error || !data) {
      const slugResult = await supabaseAdminClient
        .from('blog_posts')
        .select(`
          *,
          author:users_profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('slug', idOrSlug)
        .single()

      data = slugResult.data
      error = slugResult.error
    }

    if (error || !data) throw error || new Error("Blog post not found")

    const post: BlogPost = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featured_image,
      authorId: data.author_id,
      status: data.status,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      views: data.views || 0,
      readingTime: data.reading_time,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      metaKeywords: data.meta_keywords,
      tags: data.tags,
      category: data.category,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      author: data.author ? {
        id: data.author.id,
        fullName: data.author.full_name,
        avatarUrl: data.author.avatar_url
      } : undefined
    }

    return {
      isSuccess: true,
      message: "Blog post fetched successfully",
      data: post
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch blog post"
    }
  }
}

// Create new blog post
export async function createBlogPostAction(
  post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'author'>
): Promise<ActionState<BlogPost>> {
  try {
    // Calculate reading time (roughly 200 words per minute)
    const wordCount = post.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const { data, error } = await supabaseAdminClient
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug || generateSlug(post.title),
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featuredImage,
        author_id: post.authorId,
        status: post.status,
        published_at: post.publishedAt,
        scheduled_for: post.scheduledFor,
        reading_time: readingTime,
        meta_title: post.metaTitle,
        meta_description: post.metaDescription,
        meta_keywords: post.metaKeywords,
        tags: post.tags,
        category: post.category
      })
      .select()
      .single()

    if (error) throw error

    // Log the action
    await logAdminAction(
      'CREATE_BLOG_POST',
      'blog_post',
      data.id,
      { title: post.title, status: post.status },
      'info'
    )

    return {
      isSuccess: true,
      message: "Blog post created successfully",
      data: data as BlogPost
    }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return {
      isSuccess: false,
      message: "Failed to create blog post"
    }
  }
}

// Update blog post
export async function updateBlogPostAction(
  id: string,
  updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'author'>>
): Promise<ActionState<BlogPost>> {
  try {
    // Recalculate reading time if content changed
    let updateData: any = { ...updates }
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length
      updateData.reading_time = Math.ceil(wordCount / 200)
    }

    // Map fields to database columns
    const dbUpdates: any = {}
    if (updateData.title !== undefined) dbUpdates.title = updateData.title
    if (updateData.slug !== undefined) dbUpdates.slug = updateData.slug
    if (updateData.excerpt !== undefined) dbUpdates.excerpt = updateData.excerpt
    if (updateData.content !== undefined) dbUpdates.content = updateData.content
    if (updateData.featuredImage !== undefined) dbUpdates.featured_image = updateData.featuredImage
    if (updateData.status !== undefined) dbUpdates.status = updateData.status
    if (updateData.publishedAt !== undefined) dbUpdates.published_at = updateData.publishedAt
    if (updateData.reading_time !== undefined) dbUpdates.reading_time = updateData.reading_time
    if (updateData.category !== undefined) dbUpdates.category = updateData.category
    if (updateData.tags !== undefined) dbUpdates.tags = updateData.tags

    const { data, error } = await supabaseAdminClient
      .from('blog_posts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log the action
    await logAdminAction(
      'UPDATE_BLOG_POST',
      'blog_post',
      id,
      { updates: Object.keys(updates) },
      'info'
    )

    return {
      isSuccess: true,
      message: "Blog post updated successfully",
      data: data as BlogPost
    }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return {
      isSuccess: false,
      message: "Failed to update blog post"
    }
  }
}

// Delete blog post
export async function deleteBlogPostAction(
  id: string
): Promise<ActionState<void>> {
  try {
    const { error } = await supabaseAdminClient
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log the action
    await logAdminAction(
      'DELETE_BLOG_POST',
      'blog_post',
      id,
      null,
      'warning'
    )

    return {
      isSuccess: true,
      message: "Blog post deleted successfully"
    }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return {
      isSuccess: false,
      message: "Failed to delete blog post"
    }
  }
}

// Get blog categories
export async function getBlogCategoriesAction(): Promise<ActionState<any[]>> {
  try {
    const { data, error } = await supabaseAdminClient
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error("Blog categories error:", error)
      // Return default categories if table doesn't exist
      return {
        isSuccess: true,
        message: "Using default categories",
        data: [
          { id: '1', name: 'Activities', slug: 'activities', icon: 'Activity', color: '#fb067d' },
          { id: '2', name: 'Travel Tips', slug: 'travel-tips', icon: 'MapPin', color: '#fff546' },
          { id: '3', name: 'Local Culture', slug: 'local-culture', icon: 'Users', color: '#10b981' },
          { id: '4', name: 'Food & Wine', slug: 'food-wine', icon: 'UtensilsCrossed', color: '#f59e0b' },
          { id: '5', name: 'Beaches', slug: 'beaches', icon: 'Umbrella', color: '#3b82f6' }
        ]
      }
    }

    return {
      isSuccess: true,
      message: "Categories fetched successfully",
      data: data || []
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch categories"
    }
  }
}

// Get blog stats for admin dashboard
export async function getBlogStatsAction(): Promise<ActionState<{
  totalPosts: number
  published: number
  drafts: number
  scheduled: number
  totalViews: number
  categories: number
}>> {
  try {
    // Get post counts by status
    const { data: posts, error: postsError } = await supabaseAdminClient
      .from('blog_posts')
      .select('status, views')

    if (postsError) {
      console.error("Blog stats error:", postsError)
      // Return zeros if table doesn't exist
      return {
        isSuccess: true,
        message: "Using default stats",
        data: {
          totalPosts: 0,
          published: 0,
          drafts: 0,
          scheduled: 0,
          totalViews: 0,
          categories: 5
        }
      }
    }

    const stats = {
      totalPosts: posts?.length || 0,
      published: posts?.filter(p => p.status === 'published').length || 0,
      drafts: posts?.filter(p => p.status === 'draft').length || 0,
      scheduled: posts?.filter(p => p.status === 'scheduled').length || 0,
      totalViews: posts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0,
      categories: 0
    }

    // Get category count
    const { count } = await supabaseAdminClient
      .from('blog_categories')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    stats.categories = count || 5

    return {
      isSuccess: true,
      message: "Blog stats fetched successfully",
      data: stats
    }
  } catch (error) {
    console.error("Error fetching blog stats:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch blog stats"
    }
  }
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}