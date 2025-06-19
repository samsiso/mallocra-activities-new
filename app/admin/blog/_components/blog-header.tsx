"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Eye, Calendar, TrendingUp, Users } from "lucide-react"

interface BlogStats {
  totalPosts: number
  published: number
  drafts: number
  totalViews: number
  thisMonth: number
  avgViews: number
}

interface BlogHeaderProps {
  stats: BlogStats
}

export default function BlogHeader({ stats }: BlogHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>Admin</span>
        <span>/</span>
        <span className="text-orange-500">Blog Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="mt-1 text-gray-400">
            Create, edit, and manage blog posts and content
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-orange-600 text-white hover:bg-orange-700">
            <Plus className="mr-2 size-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Posts
            </CardTitle>
            <FileText className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalPosts}
            </div>
            <p className="text-xs text-gray-500">All blog posts</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Published
            </CardTitle>
            <Eye className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.published}
            </div>
            <p className="text-xs text-gray-500">Live on website</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Drafts
            </CardTitle>
            <FileText className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.drafts}</div>
            <p className="text-xs text-gray-500">Work in progress</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Views
            </CardTitle>
            <Users className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">All time views</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              This Month
            </CardTitle>
            <Calendar className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.thisMonth}
            </div>
            <p className="text-xs text-gray-500">Posts published</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Views
            </CardTitle>
            <TrendingUp className="size-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.avgViews}
            </div>
            <p className="text-xs text-gray-500">Per post</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
