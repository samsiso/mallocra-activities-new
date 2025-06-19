# Blog System for We Are Excursions

This document provides an overview of the blog system implemented for the We Are Excursions website.

## Features

- **Blog posts** with rich content, categories, and tags
- **SEO optimization** with meta titles, descriptions, and canonical URLs
- **Featured posts** highlighting important content
- **View tracking** to see popular content
- **Related posts** connections between similar content
- **Tag system** for organizing and browsing content
- **Responsive design** for all device sizes

## Database Structure

The blog system uses the following database tables:

1. **blogs** - Main table for storing blog posts with the following fields:
   - id (UUID)
   - title (TEXT)
   - slug (TEXT, unique)
   - summary (TEXT)
   - content (TEXT)
   - image_url (TEXT)
   - status (ENUM: draft, published, archived)
   - category (ENUM: travel_guide, activity_spotlight, local_culture, tips_and_tricks, seasonal_guide)
   - author (TEXT)
   - author_image_url (TEXT)
   - meta_title (TEXT)
   - meta_description (TEXT)
   - canonical_url (TEXT)
   - view_count (INTEGER)
   - is_featured (BOOLEAN)
   - published_at (TIMESTAMP)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **blog_tags** - Table for storing blog tags:
   - id (UUID)
   - name (TEXT)
   - slug (TEXT, unique)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **blog_to_tag** - Mapping table connecting blogs to tags:
   - blog_id (UUID, foreign key)
   - tag_id (UUID, foreign key)
   - created_at (TIMESTAMP)

4. **related_blogs** - Table for connecting related blog posts:
   - blog_id (UUID, foreign key)
   - related_blog_id (UUID, foreign key)
   - created_at (TIMESTAMP)

## Pages and Routes

- **/blog** - Main blog listing page showing featured and latest articles
- **/blog/[slug]** - Individual blog post page
- **/blog/tag/[slug]** - Page showing all blog posts with a specific tag
- **/blog/tags** - Page listing all available tags
- **/blog-setup** - Admin page for setting up the blog system

## Components

The blog system consists of the following key components:

- **BlogCard** - Card component for displaying blog posts in a grid
- **FeaturedBlogCard** - Larger card for featured blog posts
- **BlogPageHeader** - Header component for the blog section
- **BlogListSkeleton** - Loading skeleton for blog lists

## Server Actions

The following server actions are available for blog functionality:

- **createBlogAction** - Create a new blog post
- **getBlogBySlugAction** - Get a blog post by its slug
- **getBlogsAction** - Get a list of blog posts with filtering options
- **updateBlogAction** - Update an existing blog post
- **deleteBlogAction** - Delete a blog post
- **getTagsAction** - Get all blog tags
- **getBlogTagsAction** - Get tags for a specific blog post
- **getBlogsByTagAction** - Get blog posts by tag
- **getRelatedBlogsAction** - Get related blog posts
- **searchBlogsAction** - Search for blog posts

## Setup Instructions

To set up the blog system:

1. Run the migrations to create the database tables:
   - Navigate to `/blog-setup` in your browser
   - Select your Supabase project
   - Click "Run Blog Setup"

2. Add blog posts and tags using the server actions

## Security

The blog system uses Row Level Security (RLS) policies:

- Public can read published blog posts and all tags
- Authenticated users can manage blog posts, tags, and relationships

## Next Steps

- Create an admin interface for managing blog posts
- Implement a WYSIWYG editor for blog content
- Add pagination for blog listings
- Implement a search function
- Add RSS feed generation 