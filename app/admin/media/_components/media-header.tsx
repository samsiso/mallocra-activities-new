"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Upload,
  Image,
  Video,
  HardDrive,
  TrendingUp,
  Clock
} from "lucide-react"

interface MediaStats {
  totalFiles: number
  totalSize: string
  images: number
  videos: number
  recentUploads: number
  storageUsed: number
}

interface MediaHeaderProps {
  stats: MediaStats
}

export default function MediaHeader({ stats }: MediaHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>Admin</span>
        <span>/</span>
        <span className="text-orange-500">Media Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Management</h1>
          <p className="mt-1 text-gray-400">
            Manage images, videos, and media assets for activities
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-orange-600 text-white hover:bg-orange-700">
            <Upload className="mr-2 size-4" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Files
            </CardTitle>
            <HardDrive className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalFiles.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalSize} total size
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Images
            </CardTitle>
            <Image className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.images.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((stats.images / stats.totalFiles) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Videos
            </CardTitle>
            <Video className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.videos.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((stats.videos / stats.totalFiles) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Recent Uploads
            </CardTitle>
            <Clock className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.recentUploads}
            </div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Storage Used
            </CardTitle>
            <TrendingUp className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.storageUsed}%
            </div>
            <p className="text-xs text-gray-500">Of 10GB limit</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Size
            </CardTitle>
            <HardDrive className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalSize}
            </div>
            <p className="text-xs text-gray-500">Across all files</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
