"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  FolderIcon,
  TagIcon,
  ImageIcon,
  VideoIcon,
  UploadIcon,
  CheckCircle,
  AlertCircle,
  Play
} from "lucide-react"
import {
  getActivitiesForAssignmentAction,
  assignMediaToActivityAction
} from "@/actions/db/media-actions"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  url: string
  activityName: string
}

interface MediaOrganizationProps {
  mediaFiles: MediaFile[]
}

interface Activity {
  id: string
  title: string
}

// Video Preview Component for Organization
function VideoPreview({
  url,
  name,
  isSmall = true
}: {
  url: string
  name: string
  isSmall?: boolean
}) {
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
        <VideoIcon className={`mb-1 ${isSmall ? "size-4" : "size-8"}`} />
        <span className={`text-center ${isSmall ? "text-xs" : "text-sm"}`}>
          Video unavailable
        </span>
      </div>
    )
  }

  return (
    <div className="relative size-full overflow-hidden rounded-lg bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center text-gray-400">
            <div
              className={`mb-1 animate-spin rounded-full border-2 border-orange-500 border-t-transparent ${isSmall ? "size-4" : "size-6"}`}
            />
            <span className={isSmall ? "text-xs" : "text-sm"}>Loading...</span>
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
        poster=""
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
        <Play
          className={`text-white drop-shadow-lg ${isSmall ? "size-4" : "size-6"}`}
        />
      </div>
    </div>
  )
}

export default function MediaOrganization({
  mediaFiles
}: MediaOrganizationProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [newActivityName, setNewActivityName] = useState("")
  const [newTags, setNewTags] = useState("")
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const { toast } = useToast()

  // Suggested categories based on file names and types
  const suggestedCategories = [
    "Beach Activities",
    "Mountain Adventures",
    "Water Sports",
    "Cultural Tours",
    "Wildlife Excursions",
    "Food & Wine",
    "Photography Tours",
    "Adventure Sports",
    "Family Activities",
    "Romantic Experiences"
  ]

  const unassignedFiles = mediaFiles.filter(
    file =>
      file.activityName === "Unassigned Media" ||
      file.activityName === "root media"
  )

  // Load activities on component mount
  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true)
      try {
        const result = await getActivitiesForAssignmentAction()
        if (result.isSuccess) {
          setActivities(result.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load activities",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error loading activities:", error)
        toast({
          title: "Error",
          description: "Failed to load activities",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [toast])

  const handleBulkAssign = async () => {
    if (!newActivityName || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select files and choose an activity",
        variant: "destructive"
      })
      return
    }

    setIsAssigning(true)
    try {
      // Find the selected activity
      const selectedActivity = activities.find(a => a.title === newActivityName)
      const activityId = selectedActivity?.id || "custom"

      // Parse tags
      const tags = newTags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)

      const result = await assignMediaToActivityAction(
        selectedFiles,
        activityId,
        tags
      )

      if (result.isSuccess) {
        toast({
          title: "Success",
          description: `Successfully assigned ${result.data.assigned} file(s) to ${newActivityName}`,
          variant: "default"
        })

        // Reset form
        setSelectedFiles([])
        setNewActivityName("")
        setNewTags("")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error assigning media:", error)
      toast({
        title: "Error",
        description: "Failed to assign media to activity",
        variant: "destructive"
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const selectAllFiles = () => {
    setSelectedFiles(unassignedFiles.map(file => file.id))
  }

  const clearSelection = () => {
    setSelectedFiles([])
  }

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <FolderIcon className="size-5" />
            Media Organization
          </CardTitle>
          <p className="text-gray-400">
            Organize your {unassignedFiles.length} unassigned media files into
            activities and add relevant tags
          </p>
        </CardHeader>
      </Card>

      {/* Quick Selection Actions */}
      {unassignedFiles.length > 0 && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllFiles}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Select All ({unassignedFiles.length})
          </Button>
          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Clear Selection
            </Button>
          )}
          <div className="text-sm text-gray-400">
            {selectedFiles.length} of {unassignedFiles.length} files selected
          </div>
        </div>
      )}

      {/* Bulk Assignment Tool */}
      {selectedFiles.length > 0 && (
        <Card className="border-orange-500/30 bg-gray-800">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500">
                <TagIcon className="size-4" />
                <span className="font-medium">
                  Assign {selectedFiles.length} selected file
                  {selectedFiles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Activity/Category
                  </label>
                  <Select
                    value={newActivityName}
                    onValueChange={setNewActivityName}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                      <SelectValue
                        placeholder={
                          isLoading
                            ? "Loading activities..."
                            : "Choose or create activity"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="border-gray-600 bg-gray-700">
                      {/* Real Activities from Database */}
                      {activities.length > 0 && (
                        <>
                          <SelectItem
                            value=""
                            disabled
                            className="font-medium text-gray-500"
                          >
                            — Existing Activities —
                          </SelectItem>
                          {activities.map(activity => (
                            <SelectItem
                              key={activity.id}
                              value={activity.title}
                            >
                              {activity.title}
                            </SelectItem>
                          ))}
                        </>
                      )}

                      {/* Suggested Categories */}
                      <SelectItem
                        value=""
                        disabled
                        className="font-medium text-gray-500"
                      >
                        — Suggested Categories —
                      </SelectItem>
                      {suggestedCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or type custom activity name"
                    value={newActivityName}
                    onChange={e => setNewActivityName(e.target.value)}
                    className="mt-2 border-gray-600 bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <Input
                    placeholder="beach, adventure, family, etc."
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className="border-gray-600 bg-gray-700 text-white"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleBulkAssign}
                    disabled={
                      !newActivityName ||
                      selectedFiles.length === 0 ||
                      isAssigning
                    }
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                  >
                    {isAssigning ? (
                      <>
                        <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 size-4" />
                        Assign to Activity
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unassigned Files Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Unassigned Media ({unassignedFiles.length} files)
        </h3>

        {unassignedFiles.length === 0 ? (
          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400">
                <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
                <p className="text-lg font-medium">
                  All media files have been organized!
                </p>
                <p className="text-sm">
                  Every file has been assigned to an activity.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {unassignedFiles.map(file => (
              <Card
                key={file.id}
                className={`cursor-pointer border-gray-700 bg-gray-800 transition-all hover:border-gray-600 ${
                  selectedFiles.includes(file.id)
                    ? "ring-2 ring-orange-500"
                    : ""
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <CardContent className="p-3">
                  {/* Media Preview */}
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-900">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="size-full object-cover"
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%23D1D5DB' text-anchor='middle' dy='0.3em'%3EError%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    ) : (
                      <VideoPreview
                        url={file.url}
                        name={file.name}
                        isSmall={true}
                      />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className={`w-full justify-center text-xs ${
                        file.type === "image"
                          ? "border-blue-500 text-blue-400"
                          : "border-purple-500 text-purple-400"
                      }`}
                    >
                      {file.type === "image" ? (
                        <ImageIcon className="mr-1 size-3" />
                      ) : (
                        <VideoIcon className="mr-1 size-3" />
                      )}
                      {file.type.toUpperCase()}
                    </Badge>

                    <h4
                      className="truncate text-xs font-medium text-white"
                      title={file.name}
                    >
                      {file.name}
                    </h4>

                    {selectedFiles.includes(file.id) && (
                      <div className="flex items-center justify-center text-orange-500">
                        <CheckCircle className="size-4" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
