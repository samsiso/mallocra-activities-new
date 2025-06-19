"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Play,
  Volume2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  size: string
  url: string
  uploadedAt: string
  activityId: string
  activityName: string
}

interface MediaManagementProps {
  initialData: MediaFile[]
}

// Video Preview Component
function VideoPreview({ url, name }: { url: string; name: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoadStart = () => setIsLoading(true)
  const handleCanPlay = () => setIsLoading(false)
  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className="flex size-full flex-col items-center justify-center rounded-lg bg-gray-900 text-gray-400">
        <Video className="mb-2 size-8" />
        <span className="text-center text-xs">Video unavailable</span>
      </div>
    )
  }

  return (
    <div className="relative size-full overflow-hidden rounded-lg bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center text-gray-400">
            <div className="mb-2 size-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      )}
      <video
        src={url}
        className="size-full object-cover"
        muted
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        poster="" // Remove default poster to show first frame
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
        <Play className="size-8 text-white drop-shadow-lg" />
      </div>
    </div>
  )
}

export default function MediaManagement({ initialData }: MediaManagementProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.activityName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || file.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id))
    }
  }

  const handleBulkDelete = () => {
    setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const handleViewFile = (url: string) => {
    window.open(url, "_blank")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search media files..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
          <span className="text-white">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="mr-2 size-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-white">
          <span className="font-medium">{filteredFiles.length}</span>
          <span className="ml-1 text-gray-400">
            file{filteredFiles.length !== 1 ? "s" : ""} found
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {selectedFiles.length === filteredFiles.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFiles.map(file => (
          <Card
            key={file.id}
            className={`cursor-pointer border-gray-700 bg-gray-800 transition-colors hover:border-gray-600 ${
              selectedFiles.includes(file.id) ? "ring-2 ring-orange-500" : ""
            }`}
            onClick={() => handleSelectFile(file.id)}
          >
            <CardContent className="p-4">
              {/* Media Preview */}
              <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-900">
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="size-full object-cover"
                    onError={e => {
                      // Fallback for broken images
                      const target = e.target as HTMLImageElement
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23D1D5DB' text-anchor='middle' dy='0.3em'%3EImage Error%3C/text%3E%3C/svg%3E"
                    }}
                  />
                ) : (
                  <VideoPreview url={file.url} name={file.name} />
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="mr-2 flex-1 truncate font-medium text-white">
                    {file.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      file.type === "image"
                        ? "border-blue-500 text-blue-400"
                        : "border-purple-500 text-purple-400"
                    }`}
                  >
                    {file.type === "image" ? (
                      <ImageIcon className="mr-1 size-3" />
                    ) : (
                      <Video className="mr-1 size-3" />
                    )}
                    {file.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>{file.size}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>

                <div className="text-xs">
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300"
                  >
                    {file.activityName}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      handleViewFile(file.url)
                    }}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Eye className="mr-2 size-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      window.open(file.url, "_blank")
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-400">
            <ImageIcon className="mx-auto mb-4 size-12" />
            <p className="text-lg font-medium">No media files found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
