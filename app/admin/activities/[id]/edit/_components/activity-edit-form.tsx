"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  updateActivitySupabaseAction,
  ActivityWithDetails
} from "@/actions/supabase-activities-actions"

interface ActivityEditFormProps {
  activity: ActivityWithDetails
}

interface FormData {
  title: string
  shortDescription: string
  description: string
  category: string
  location: string
  meetingPoint: string
  durationMinutes: number
  maxParticipants: number
  minParticipants: number
  minAge: number | null
  maxAge: number | null
  includedItems: string[]
  excludedItems: string[]
  whatToBring: string[]
  cancellationPolicy: string
  safetyRequirements: string
  weatherDependent: boolean
  instantConfirmation: boolean
  featured: boolean
  status: string
  videoUrl: string
}

export default function ActivityEditForm({ activity }: ActivityEditFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    title: activity.title || "",
    shortDescription: activity.short_description || "",
    description: activity.description || "",
    category: activity.category || "water_sports",
    location: activity.location || "",
    meetingPoint: activity.meeting_point || "",
    durationMinutes: activity.duration_minutes || 120,
    maxParticipants: activity.max_participants || 8,
    minParticipants: activity.min_participants || 1,
    minAge: activity.min_age,
    maxAge: activity.max_age,
    includedItems: activity.included_items || [],
    excludedItems: activity.excluded_items || [],
    whatToBring: activity.what_to_bring || [],
    cancellationPolicy: activity.cancellation_policy || "",
    safetyRequirements: activity.safety_requirements || "",
    weatherDependent: activity.weather_dependent || false,
    instantConfirmation: activity.instant_confirmation !== false,
    featured: activity.featured || false,
    status: activity.status || "draft",
    videoUrl: activity.video_url || ""
  })

  const [includedItemInput, setIncludedItemInput] = useState("")
  const [excludedItemInput, setExcludedItemInput] = useState("")
  const [whatToBringInput, setWhatToBringInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (formData.durationMinutes <= 0) {
      newErrors.durationMinutes = "Duration must be greater than 0"
    }
    if (formData.maxParticipants <= 0) {
      newErrors.maxParticipants = "Max participants must be greater than 0"
    }
    if (formData.minParticipants > formData.maxParticipants) {
      newErrors.minParticipants =
        "Min participants cannot exceed max participants"
    }
    if (
      formData.minAge &&
      formData.maxAge &&
      formData.minAge > formData.maxAge
    ) {
      newErrors.minAge = "Min age cannot exceed max age"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Send camelCase data - the updateActivitySupabaseAction will handle the mapping
      const updateData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category as any,
        location: formData.location.trim(),
        meetingPoint: formData.meetingPoint.trim(),
        durationMinutes: formData.durationMinutes,
        maxParticipants: formData.maxParticipants,
        minParticipants: formData.minParticipants,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        includedItems: formData.includedItems,
        excludedItems: formData.excludedItems,
        whatToBring: formData.whatToBring,
        cancellationPolicy: formData.cancellationPolicy.trim(),
        safetyRequirements: formData.safetyRequirements.trim(),
        weatherDependent: formData.weatherDependent,
        instantConfirmation: formData.instantConfirmation,
        featured: formData.featured,
        status: formData.status as any,
        videoUrl: formData.videoUrl.trim() || null
      }

      const response = await updateActivitySupabaseAction(
        activity.id,
        updateData
      )

      if (response.isSuccess) {
        alert("Activity updated successfully")
        router.push("/admin/activities")
      } else {
        alert("Failed to update activity")
      }
    } catch (error) {
      console.error("Error updating activity:", error)
      alert("Error updating activity")
    } finally {
      setIsLoading(false)
    }
  } // Helper functions for managing lists
  const addItem = (
    array: string[],
    item: string,
    setter: (items: string[]) => void
  ) => {
    if (item.trim()) {
      setter([...array, item.trim()])
    }
  }

  const removeItem = (
    array: string[],
    index: number,
    setter: (items: string[]) => void
  ) => {
    setter(array.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header with actions */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Edit Activity Details
          </h2>
          <p className="text-gray-400">
            Update the information for this activity
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/activities")}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Activities
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Save className="mr-2 size-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - 2/3 width */}
        <div className="space-y-8 lg:col-span-2">
          {/* Basic Information */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Activity Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Enter activity title"
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title}</p>
                )}
              </div>{" "}
              <div>
                <Label htmlFor="shortDescription" className="text-gray-300">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value
                    })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Brief description for listings"
                  rows={3}
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-400">
                    {errors.shortDescription}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Full Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Detailed activity description"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="border-gray-600 bg-gray-900 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-600 bg-gray-800">
                      <SelectItem value="water_sports">Water Sports</SelectItem>
                      <SelectItem value="land_adventures">
                        Land Adventures
                      </SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="nightlife">Nightlife</SelectItem>
                      <SelectItem value="family_fun">Family Fun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-300">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={value =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="border-gray-600 bg-gray-900 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-600 bg-gray-800">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Location Information */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Location & Meeting Point
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-gray-300">
                  Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="e.g., Palma de Mallorca"
                />
                {errors.location && (
                  <p className="text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div>
                <Label htmlFor="meetingPoint" className="text-gray-300">
                  Meeting Point
                </Label>
                <Textarea
                  id="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={e =>
                    setFormData({ ...formData, meetingPoint: e.target.value })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Detailed meeting point instructions"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          {/* Activity Details */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Activity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="durationMinutes" className="text-gray-300">
                    Duration (minutes) *
                  </Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    value={formData.durationMinutes}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        durationMinutes: parseInt(e.target.value) || 0
                      })
                    }
                    className="border-gray-600 bg-gray-900 text-white"
                    min="0"
                  />
                  {errors.durationMinutes && (
                    <p className="text-sm text-red-400">
                      {errors.durationMinutes}
                    </p>
                  )}
                </div>{" "}
                <div>
                  <Label htmlFor="minParticipants" className="text-gray-300">
                    Min Participants *
                  </Label>
                  <Input
                    id="minParticipants"
                    type="number"
                    value={formData.minParticipants}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        minParticipants: parseInt(e.target.value) || 0
                      })
                    }
                    className="border-gray-600 bg-gray-900 text-white"
                    min="1"
                  />
                  {errors.minParticipants && (
                    <p className="text-sm text-red-400">
                      {errors.minParticipants}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="maxParticipants" className="text-gray-300">
                    Max Participants *
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxParticipants: parseInt(e.target.value) || 0
                      })
                    }
                    className="border-gray-600 bg-gray-900 text-white"
                    min="1"
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-400">
                      {errors.maxParticipants}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="minAge" className="text-gray-300">
                    Minimum Age
                  </Label>
                  <Input
                    id="minAge"
                    type="number"
                    value={formData.minAge || ""}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        minAge: e.target.value ? parseInt(e.target.value) : null
                      })
                    }
                    className="border-gray-600 bg-gray-900 text-white"
                    placeholder="No minimum"
                  />
                  {errors.minAge && (
                    <p className="text-sm text-red-400">{errors.minAge}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxAge" className="text-gray-300">
                    Maximum Age
                  </Label>
                  <Input
                    id="maxAge"
                    type="number"
                    value={formData.maxAge || ""}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxAge: e.target.value ? parseInt(e.target.value) : null
                      })
                    }
                    className="border-gray-600 bg-gray-900 text-white"
                    placeholder="No maximum"
                  />
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Included/Excluded Items */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">
                What's Included & Excluded
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Included Items */}
              <div>
                <Label className="mb-3 block text-gray-300">
                  What's Included
                </Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={includedItemInput}
                      onChange={e => setIncludedItemInput(e.target.value)}
                      placeholder="Add item that's included"
                      className="border-gray-600 bg-gray-900 text-white"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addItem(
                            formData.includedItems,
                            includedItemInput,
                            items => {
                              setFormData({ ...formData, includedItems: items })
                              setIncludedItemInput("")
                            }
                          )
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addItem(
                          formData.includedItems,
                          includedItemInput,
                          items => {
                            setFormData({ ...formData, includedItems: items })
                            setIncludedItemInput("")
                          }
                        )
                      }
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.includedItems.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-900 text-green-100 hover:bg-green-800"
                      >
                        {item}
                        <X
                          className="ml-1 size-3 cursor-pointer"
                          onClick={() =>
                            removeItem(formData.includedItems, index, items =>
                              setFormData({ ...formData, includedItems: items })
                            )
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>{" "}
              {/* Excluded Items */}
              <div>
                <Label className="mb-3 block text-gray-300">
                  What's NOT Included
                </Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={excludedItemInput}
                      onChange={e => setExcludedItemInput(e.target.value)}
                      placeholder="Add item that's not included"
                      className="border-gray-600 bg-gray-900 text-white"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addItem(
                            formData.excludedItems,
                            excludedItemInput,
                            items => {
                              setFormData({ ...formData, excludedItems: items })
                              setExcludedItemInput("")
                            }
                          )
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addItem(
                          formData.excludedItems,
                          excludedItemInput,
                          items => {
                            setFormData({ ...formData, excludedItems: items })
                            setExcludedItemInput("")
                          }
                        )
                      }
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excludedItems.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-red-900 text-red-100 hover:bg-red-800"
                      >
                        {item}
                        <X
                          className="ml-1 size-3 cursor-pointer"
                          onClick={() =>
                            removeItem(formData.excludedItems, index, items =>
                              setFormData({ ...formData, excludedItems: items })
                            )
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>{" "}
              {/* What to Bring */}
              <div>
                <Label className="mb-3 block text-gray-300">
                  What Participants Should Bring
                </Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={whatToBringInput}
                      onChange={e => setWhatToBringInput(e.target.value)}
                      placeholder="Add item participants should bring"
                      className="border-gray-600 bg-gray-900 text-white"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addItem(
                            formData.whatToBring,
                            whatToBringInput,
                            items => {
                              setFormData({ ...formData, whatToBring: items })
                              setWhatToBringInput("")
                            }
                          )
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addItem(
                          formData.whatToBring,
                          whatToBringInput,
                          items => {
                            setFormData({ ...formData, whatToBring: items })
                            setWhatToBringInput("")
                          }
                        )
                      }
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.whatToBring.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-900 text-blue-100 hover:bg-blue-800"
                      >
                        {item}
                        <X
                          className="ml-1 size-3 cursor-pointer"
                          onClick={() =>
                            removeItem(formData.whatToBring, index, items =>
                              setFormData({ ...formData, whatToBring: items })
                            )
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Settings */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, featured: checked as boolean })
                  }
                />
                <Label htmlFor="featured" className="text-gray-300">
                  Featured Activity
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weatherDependent"
                  checked={formData.weatherDependent}
                  onCheckedChange={checked =>
                    setFormData({
                      ...formData,
                      weatherDependent: checked as boolean
                    })
                  }
                />
                <Label htmlFor="weatherDependent" className="text-gray-300">
                  Weather Dependent
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instantConfirmation"
                  checked={formData.instantConfirmation}
                  onCheckedChange={checked =>
                    setFormData({
                      ...formData,
                      instantConfirmation: checked as boolean
                    })
                  }
                />
                <Label htmlFor="instantConfirmation" className="text-gray-300">
                  Instant Confirmation
                </Label>
              </div>
            </CardContent>
          </Card>
          {/* Policies & Safety */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Policies & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cancellationPolicy" className="text-gray-300">
                  Cancellation Policy
                </Label>
                <Textarea
                  id="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      cancellationPolicy: e.target.value
                    })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Describe cancellation terms"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="safetyRequirements" className="text-gray-300">
                  Safety Requirements
                </Label>
                <Textarea
                  id="safetyRequirements"
                  value={formData.safetyRequirements}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      safetyRequirements: e.target.value
                    })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="Important safety information"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>{" "}
          {/* Media */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-500">Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="videoUrl" className="text-gray-300">
                  Video URL
                </Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={e =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="border-gray-600 bg-gray-900 text-white"
                  placeholder="YouTube, Vimeo, or direct video URL"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions - Sticky */}
      <div className="sticky bottom-0 -mx-6 -mb-8 border-t border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Last updated: {new Date(activity.updated_at).toLocaleDateString()}
          </p>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/activities")}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              <Save className="mr-2 size-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
