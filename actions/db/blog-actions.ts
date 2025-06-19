"use server"

import { ActionState } from "@/types"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content?: string
  excerpt: string
  status: "published" | "draft" | "scheduled"
  author: string
  authorId: string
  publishedAt: string | null
  scheduledFor?: string | null
  views: number
  category: string
  tags: string[]
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
  readingTime: number // in minutes
  createdAt: string
  updatedAt: string
}

export interface BlogStats {
  totalPosts: number
  published: number
  drafts: number
  scheduled: number
  totalViews: number
  thisMonth: number
  avgViews: number
  topCategory: string
  popularTags: Array<{
    tag: string
    count: number
  }>
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  postCount: number
  description?: string
}

export interface BlogAuthor {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  postCount: number
  totalViews: number
}

export async function getBlogStatsAction(): Promise<ActionState<BlogStats>> {
  try {
    const stats: BlogStats = {
      totalPosts: 47,
      published: 42,
      drafts: 4,
      scheduled: 1,
      totalViews: 28947,
      thisMonth: 12,
      avgViews: 616,
      topCategory: "Adventure",
      popularTags: [
        { tag: "hiking", count: 18 },
        { tag: "adventure", count: 15 },
        { tag: "mallorca", count: 12 },
        { tag: "safety", count: 9 },
        { tag: "water-sports", count: 8 },
        { tag: "cultural", count: 6 }
      ]
    }

    return {
      isSuccess: true,
      message: "Blog stats retrieved successfully",
      data: stats
    }
  } catch (error) {
    console.error("Error getting blog stats:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get blog stats" 
    }
  }
}

export async function getBlogPostsAction(
  status?: "published" | "draft" | "scheduled",
  limit: number = 20
): Promise<ActionState<BlogPost[]>> {
  try {
    const allPosts: BlogPost[] = [
      {
        id: "blog-1",
        title: "Top 10 Adventure Activities in Mallorca",
        slug: "top-10-adventure-activities-mallorca",
        excerpt: "Discover the most thrilling outdoor activities Mallorca has to offer, from coasteering to mountain hiking...",
        status: "published",
        author: "Sarah O'Connor",
        authorId: "author-1",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 2847,
        category: "Adventure",
        tags: ["hiking", "adventure", "mallorca", "coasteering"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/adventure-activities.jpg",
        seoTitle: "Top 10 Adventure Activities in Mallorca | Ultimate Guide",
        seoDescription: "Explore the best adventure activities in Mallorca with our comprehensive guide. From coasteering to hiking, discover your next thrill.",
        readingTime: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "blog-2",
        title: "Safety Tips for Mountain Hiking in Serra de Tramuntana",
        slug: "safety-tips-mountain-hiking-serra-tramuntana",
        excerpt: "Essential safety guidelines for a successful mountain hiking experience in Mallorca's UNESCO World Heritage site...",
        status: "published",
        author: "Mike Johnson",
        authorId: "author-2",
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 1892,
        category: "Safety",
        tags: ["hiking", "safety", "serra-tramuntana", "mountains"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/hiking-safety.jpg",
        seoTitle: "Mountain Hiking Safety Tips | Serra de Tramuntana Guide",
        seoDescription: "Stay safe while hiking in Serra de Tramuntana with our expert safety tips and guidelines for mountain adventures.",
        readingTime: 6,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "blog-3",
        title: "Best Kayaking Spots for Beginners in Mallorca",
        slug: "best-kayaking-spots-beginners-mallorca",
        excerpt: "A comprehensive guide to the most beginner-friendly kayaking locations around the island...",
        status: "draft",
        author: "Emma Walsh",
        authorId: "author-3",
        publishedAt: null,
        views: 0,
        category: "Water Sports",
        tags: ["kayaking", "beginners", "water-sports", "mallorca"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/kayaking-beginners.jpg",
        seoTitle: "Best Beginner Kayaking Spots in Mallorca | Complete Guide",
        seoDescription: "Find the perfect kayaking spots for beginners in Mallorca with our detailed guide to calm waters and scenic routes.",
        readingTime: 7,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "blog-4",
        title: "Cultural Heritage Sites You Must Visit in Palma",
        slug: "cultural-heritage-sites-palma-mallorca",
        excerpt: "Explore the rich history and stunning architecture of Palma's most significant cultural landmarks...",
        status: "published",
        author: "Carlos Rodriguez",
        authorId: "author-4",
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        views: 1456,
        category: "Cultural",
        tags: ["cultural", "palma", "heritage", "architecture"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/palma-heritage.jpg",
        seoTitle: "Cultural Heritage Sites in Palma | Historical Landmarks Guide",
        seoDescription: "Discover Palma's most important cultural heritage sites and historical landmarks with our comprehensive guide.",
        readingTime: 9,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "blog-5",
        title: "Sustainable Tourism: Protecting Mallorca's Natural Beauty",
        slug: "sustainable-tourism-protecting-mallorca-environment",
        excerpt: "Learn how to be a responsible tourist and help preserve Mallorca's stunning natural environment for future generations...",
        status: "scheduled",
        author: "Sarah O'Connor",
        authorId: "author-1",
        publishedAt: null,
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        views: 0,
        category: "Environment",
        tags: ["sustainability", "environment", "responsible-tourism", "mallorca"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/sustainable-tourism.jpg",
        seoTitle: "Sustainable Tourism in Mallorca | Eco-Friendly Travel Guide",
        seoDescription: "Discover how to travel sustainably in Mallorca and protect the island's natural beauty with our eco-friendly tourism guide.",
        readingTime: 5,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Filter by status if specified
    let filteredPosts = allPosts
    if (status) {
      filteredPosts = allPosts.filter(post => post.status === status)
    }

    // Apply limit
    const limitedPosts = filteredPosts.slice(0, limit)

    return {
      isSuccess: true,
      message: `Retrieved ${limitedPosts.length} blog posts`,
      data: limitedPosts
    }
  } catch (error) {
    console.error("Error getting blog posts:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get blog posts" 
    }
  }
}

export async function getBlogCategoriesAction(): Promise<ActionState<BlogCategory[]>> {
  try {
    const categories: BlogCategory[] = [
      {
        id: "cat-1",
        name: "Adventure",
        slug: "adventure",
        postCount: 15,
        description: "Thrilling outdoor activities and extreme sports"
      },
      {
        id: "cat-2",
        name: "Safety",
        slug: "safety",
        postCount: 9,
        description: "Safety tips and guidelines for outdoor activities"
      },
      {
        id: "cat-3",
        name: "Water Sports",
        slug: "water-sports",
        postCount: 8,
        description: "Kayaking, sailing, and other water-based activities"
      },
      {
        id: "cat-4",
        name: "Cultural",
        slug: "cultural",
        postCount: 6,
        description: "Cultural tours, heritage sites, and local traditions"
      },
      {
        id: "cat-5",
        name: "Environment",
        slug: "environment",
        postCount: 4,
        description: "Sustainable tourism and environmental conservation"
      },
      {
        id: "cat-6",
        name: "Travel Tips",
        slug: "travel-tips",
        postCount: 5,
        description: "Practical advice for visiting Mallorca"
      }
    ]

    return {
      isSuccess: true,
      message: "Blog categories retrieved successfully",
      data: categories
    }
  } catch (error) {
    console.error("Error getting blog categories:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get blog categories" 
    }
  }
}

export async function getBlogAuthorsAction(): Promise<ActionState<BlogAuthor[]>> {
  try {
    const authors: BlogAuthor[] = [
      {
        id: "author-1",
        name: "Sarah O'Connor",
        email: "sarah@mallocra-activities.com",
        avatar: "https://res.cloudinary.com/demo/image/upload/v1234567890/authors/sarah.jpg",
        bio: "Adventure enthusiast and outdoor activity expert with 10+ years of experience in Mallorca.",
        postCount: 18,
        totalViews: 12847
      },
      {
        id: "author-2",
        name: "Mike Johnson",
        email: "mike@mallocra-activities.com",
        avatar: "https://res.cloudinary.com/demo/image/upload/v1234567890/authors/mike.jpg",
        bio: "Safety instructor and mountain guide specializing in Serra de Tramuntana hiking.",
        postCount: 12,
        totalViews: 8934
      },
      {
        id: "author-3",
        name: "Emma Walsh",
        email: "emma@mallocra-activities.com",
        avatar: "https://res.cloudinary.com/demo/image/upload/v1234567890/authors/emma.jpg",
        bio: "Water sports instructor and marine conservation advocate.",
        postCount: 9,
        totalViews: 5623
      },
      {
        id: "author-4",
        name: "Carlos Rodriguez",
        email: "carlos@mallocra-activities.com",
        avatar: "https://res.cloudinary.com/demo/image/upload/v1234567890/authors/carlos.jpg",
        bio: "Local historian and cultural tour guide with deep knowledge of Mallorca's heritage.",
        postCount: 8,
        totalViews: 4892
      }
    ]

    return {
      isSuccess: true,
      message: "Blog authors retrieved successfully",
      data: authors
    }
  } catch (error) {
    console.error("Error getting blog authors:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get blog authors" 
    }
  }
}

export async function createBlogPostAction(post: Omit<BlogPost, "id" | "views" | "createdAt" | "updatedAt">): Promise<ActionState<BlogPost>> {
  try {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return {
      isSuccess: true,
      message: "Blog post created successfully",
      data: newPost
    }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { 
      isSuccess: false, 
      message: "Failed to create blog post" 
    }
  }
}

export async function updateBlogPostAction(
  postId: string,
  updates: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<ActionState<BlogPost>> {
  try {
    const { data: posts } = await getBlogPostsAction()
    
    if (!posts) {
      throw new Error("No blog posts available")
    }

    const post = posts.find(p => p.id === postId)
    
    if (!post) {
      throw new Error("Blog post not found")
    }

    const updatedPost: BlogPost = {
      ...post,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return {
      isSuccess: true,
      message: "Blog post updated successfully",
      data: updatedPost
    }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { 
      isSuccess: false, 
      message: "Failed to update blog post" 
    }
  }
}

export async function deleteBlogPostAction(postId: string): Promise<ActionState<void>> {
  try {
    // In a real implementation, this would delete from database
    console.log(`Deleting blog post: ${postId}`)
    
    return {
      isSuccess: true,
      message: "Blog post deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { 
      isSuccess: false, 
      message: "Failed to delete blog post" 
    }
  }
} 