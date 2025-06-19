"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import SortableTable from "@/app/admin/_components/sortable-table"

interface BlogPost {
  id: string
  title: string
  slug: string
  status: "published" | "draft"
  author: string
  publishedAt: string | null
  views: number
  category: string
  tags: string[]
  excerpt: string
}

interface BlogManagementProps {
  initialData: BlogPost[]
}

export default function BlogManagement({ initialData }: BlogManagementProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600 text-white">Published</Badge>
      case "draft":
        return <Badge className="bg-yellow-600 text-white">Draft</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const handleEdit = (postId: string) => {
    console.log("Edit post:", postId)
    // Navigate to edit page
  }

  const handleDelete = (postId: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== postId))
  }

  const handlePublish = (postId: string) => {
    setBlogPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              status: "published" as const,
              publishedAt: new Date().toISOString()
            }
          : post
      )
    )
  }

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (_: any, post: BlogPost) => (
        <div className="space-y-1">
          <div className="font-medium text-white">{post.title}</div>
          <div className="max-w-md truncate text-sm text-gray-400">
            {post.excerpt}
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>/{post.slug}</span>
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_: any, post: BlogPost) => getStatusBadge(post.status)
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      render: (_: any, post: BlogPost) => (
        <div className="flex items-center space-x-2">
          <User className="size-4 text-gray-400" />
          <span className="text-white">{post.author}</span>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (_: any, post: BlogPost) => (
        <Badge variant="outline" className="border-orange-500 text-orange-400">
          {post.category}
        </Badge>
      )
    },
    {
      key: "publishedAt",
      label: "Published",
      sortable: true,
      render: (_: any, post: BlogPost) => (
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="size-4 text-gray-400" />
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      )
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      render: (_: any, post: BlogPost) => (
        <div className="flex items-center space-x-2">
          <Eye className="size-4 text-gray-400" />
          <span className="text-white">
            {(post.views || 0).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: "tags",
      label: "Tags",
      sortable: false,
      render: (_: any, post: BlogPost) => (
        <div className="flex flex-wrap gap-1">
          {(post.tags || []).slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-gray-600 text-xs text-gray-400"
            >
              <Tag className="mr-1 size-3" />
              {tag}
            </Badge>
          ))}
          {(post.tags || []).length > 2 && (
            <Badge
              variant="outline"
              className="border-gray-600 text-xs text-gray-400"
            >
              +{(post.tags || []).length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, post: BlogPost) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(post.id)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Edit className="size-3" />
          </Button>
          {(post?.status || "draft") === "draft" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePublish(post.id)}
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            >
              <Eye className="size-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(post.id)}
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )
    }
  ]

  const categories = Array.from(new Set(blogPosts.map(post => post.category)))

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search posts, authors, categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-white">
        <span className="font-medium">{filteredPosts.length}</span>
        <span className="ml-1 text-gray-400">
          post{filteredPosts.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Posts Table */}
      <SortableTable
        data={filteredPosts}
        columns={columns}
        className="border-gray-700 bg-gray-800"
      />

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-12 text-center">
          <Eye className="mx-auto mb-4 size-12 text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-white">
            No blog posts found
          </h3>
          <p className="text-gray-400">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first blog post to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
