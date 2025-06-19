"use client"

import { useState, useEffect } from "react"
import { X, Save, Upload, Plus, Trash2, Image as ImageIcon } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  createActivityAction,
  updateActivityAction
} from "@/actions/db/activities-actions"
import { ActivityWithDetails } from "@/actions/db/activities-actions"
import { InsertActivity } from "@/db/schema/activities-schema"

interface ActivityFormModalProps {
  show: boolean
  onClose: () => void
  activity?: ActivityWithDetails | null
  onSave: (activity: ActivityWithDetails) => void
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

export default function ActivityFormModal({
  show,
  onClose,
  activity,
  onSave
}: ActivityFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    shortDescription: "",
    description: "",
    category: "water_sports",
    location: "",
    meetingPoint: "",
    durationMinutes: 120,
    maxParticipants: 8,
    minParticipants: 1,
    minAge: null,
    maxAge: null,
    includedItems: [],
    excludedItems: [],
    whatToBring: [],
    cancellationPolicy: "",
    safetyRequirements: "",
    weatherDependent: false,
    instantConfirmation: true,
    featured: false,
    status: "draft",
    videoUrl: ""
  })

  const [includedItemInput, setIncludedItemInput] = useState("")
  const [excludedItemInput, setExcludedItemInput] = useState("")
  const [whatToBringInput, setWhatToBringInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || "",
        shortDescription: activity.shortDescription || "",
        description: activity.description || "",
        category: activity.category || "water_sports",
        location: activity.location || "",
        meetingPoint: activity.meetingPoint || "",
        durationMinutes: activity.durationMinutes || 120,
        maxParticipants: activity.maxParticipants || 8,
        minParticipants: activity.minParticipants || 1,
        minAge: activity.minAge,
        maxAge: activity.maxAge,
        includedItems: activity.includedItems || [],
        excludedItems: activity.excludedItems || [],
        whatToBring: activity.whatToBring || [],
        cancellationPolicy: activity.cancellationPolicy || "",
        safetyRequirements: activity.safetyRequirements || "",
        weatherDependent: activity.weatherDependent || false,
        instantConfirmation: activity.instantConfirmation !== false,
        featured: activity.featured || false,
        status: activity.status || "draft",
        videoUrl: activity.videoUrl || ""
      })
    } else {
      // Reset form for new activity
      setFormData({
        title: "",
        shortDescription: "",
        description: "",
        category: "water_sports",
        location: "",
        meetingPoint: "",
        durationMinutes: 120,
        maxParticipants: 8,
        minParticipants: 1,
        minAge: null,
        maxAge: null,
        includedItems: [],
        excludedItems: [],
        whatToBring: [],
        cancellationPolicy: "",
        safetyRequirements: "",
        weatherDependent: false,
        instantConfirmation: true,
        featured: false,
        status: "draft",
        videoUrl: ""
      })
    }
    setErrors({})
    setIncludedItemInput("")
    setExcludedItemInput("")
    setWhatToBringInput("")
  }, [activity])

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
      const activityData: InsertActivity = {
        operatorId: "temp-operator-id", // This should come from the logged-in user
        title: formData.title,
        slug: formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category as any,
        location: formData.location,
        meetingPoint: formData.meetingPoint || null,
        durationMinutes: formData.durationMinutes,
        maxParticipants: formData.maxParticipants,
        minParticipants: formData.minParticipants,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        includedItems: formData.includedItems,
        excludedItems: formData.excludedItems,
        whatToBring: formData.whatToBring,
        cancellationPolicy: formData.cancellationPolicy || null,
        safetyRequirements: formData.safetyRequirements || null,
        weatherDependent: formData.weatherDependent,
        instantConfirmation: formData.instantConfirmation,
        featured: formData.featured,
        status: formData.status as any,
        videoUrl: formData.videoUrl || null
      }

      let response
      if (activity) {
        // Update existing activity
        response = await updateActivityAction(activity.id, activityData)
      } else {
        // Create new activity
        response = await createActivityAction(activityData)
      }

      if (response.isSuccess) {
        // Transform the response to include the required fields
        const savedActivity: ActivityWithDetails = {
          ...response.data,
          images: activity?.images || [],
          pricing: activity?.pricing || []
        }
        onSave(savedActivity)
      } else {
        setErrors({ general: response.message })
      }
    } catch (error) {
      console.error("Error saving activity:", error)
      setErrors({ general: "Failed to save activity" })
    } finally {
      setIsLoading(false)
    }
  }

  // Array management helpers
  const addItem = (
    array: string[],
    item: string,
    setter: (items: string[]) => void
  ) => {
    if (item.trim() && !array.includes(item.trim())) {
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

  const categories = [
    { value: "water_sports", label: "Water Sports" },
    { value: "land_adventures", label: "Land Adventures" },
    { value: "cultural", label: "Cultural" },
    { value: "nightlife", label: "Nightlife" },
    { value: "family_fun", label: "Family Fun" }
  ]

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" }
  ]

  if (!show) return null

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="h-[95vh] max-h-[95vh] max-w-5xl border-gray-700 bg-gray-900 p-0 text-white">
        <div className="flex h-full flex-col">
          {/* Fixed Header */}
          <DialogHeader className="shrink-0 border-b border-gray-700 bg-gray-900 px-6 py-4">
            <DialogTitle className="text-xl font-bold text-orange-500">
              {activity ? "Edit Activity" : "Create New Activity"}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="rounded-lg border border-red-600 bg-red-600/20 p-3 text-sm text-red-400">
                    {errors.general}
                  </div>
                )}

                {/* Basic Information */}
                <Card className="border-gray-700 bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">
                          Title *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={e =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Activity title..."
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.title}
                          </p>
                        )}
                      </div>

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
                          <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-gray-700 bg-gray-800">
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="shortDescription"
                        className="text-gray-300"
                      >
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
                        className="resize-none border-gray-600 bg-gray-700 text-white"
                        placeholder="Brief description for cards and previews..."
                        rows={2}
                      />
                      {errors.shortDescription && (
                        <p className="mt-1 text-sm text-red-400">
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
                          setFormData({
                            ...formData,
                            description: e.target.value
                          })
                        }
                        className="resize-none border-gray-600 bg-gray-700 text-white"
                        placeholder="Detailed description of the activity..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location & Logistics */}
                <Card className="border-gray-700 bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Location & Logistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <Label htmlFor="location" className="text-gray-300">
                          Location *
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              location: e.target.value
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="e.g., Palma de Mallorca"
                        />
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="meetingPoint" className="text-gray-300">
                          Meeting Point
                        </Label>
                        <Input
                          id="meetingPoint"
                          value={formData.meetingPoint}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              meetingPoint: e.target.value
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Specific meeting location..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      <div>
                        <Label htmlFor="duration" className="text-gray-300">
                          Duration (minutes) *
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.durationMinutes}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              durationMinutes: parseInt(e.target.value) || 0
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          min="15"
                        />
                        {errors.durationMinutes && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.durationMinutes}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="maxParticipants"
                          className="text-gray-300"
                        >
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
                          className="border-gray-600 bg-gray-700 text-white"
                          min="1"
                        />
                        {errors.maxParticipants && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.maxParticipants}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="minAge" className="text-gray-300">
                          Min Age
                        </Label>
                        <Input
                          id="minAge"
                          type="number"
                          value={formData.minAge || ""}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              minAge: e.target.value
                                ? parseInt(e.target.value)
                                : null
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          min="0"
                          placeholder="No limit"
                        />
                        {errors.minAge && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.minAge}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="maxAge" className="text-gray-300">
                          Max Age
                        </Label>
                        <Input
                          id="maxAge"
                          type="number"
                          value={formData.maxAge || ""}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              maxAge: e.target.value
                                ? parseInt(e.target.value)
                                : null
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          min="0"
                          placeholder="No limit"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items & Requirements */}
                <Card className="border-gray-700 bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Items & Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Included Items */}
                    <div>
                      <Label className="text-gray-300">What's Included</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          value={includedItemInput}
                          onChange={e => setIncludedItemInput(e.target.value)}
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Add included item..."
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addItem(
                                formData.includedItems,
                                includedItemInput,
                                items =>
                                  setFormData({
                                    ...formData,
                                    includedItems: items
                                  })
                              )
                              setIncludedItemInput("")
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addItem(
                              formData.includedItems,
                              includedItemInput,
                              items =>
                                setFormData({
                                  ...formData,
                                  includedItems: items
                                })
                            )
                            setIncludedItemInput("")
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.includedItems.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-green-600 bg-green-600/20 text-green-400"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  formData.includedItems,
                                  index,
                                  items =>
                                    setFormData({
                                      ...formData,
                                      includedItems: items
                                    })
                                )
                              }
                              className="ml-2 hover:text-green-200"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Excluded Items */}
                    <div>
                      <Label className="text-gray-300">Not Included</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          value={excludedItemInput}
                          onChange={e => setExcludedItemInput(e.target.value)}
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Add excluded item..."
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addItem(
                                formData.excludedItems,
                                excludedItemInput,
                                items =>
                                  setFormData({
                                    ...formData,
                                    excludedItems: items
                                  })
                              )
                              setExcludedItemInput("")
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addItem(
                              formData.excludedItems,
                              excludedItemInput,
                              items =>
                                setFormData({
                                  ...formData,
                                  excludedItems: items
                                })
                            )
                            setExcludedItemInput("")
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.excludedItems.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-red-600 bg-red-600/20 text-red-400"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  formData.excludedItems,
                                  index,
                                  items =>
                                    setFormData({
                                      ...formData,
                                      excludedItems: items
                                    })
                                )
                              }
                              className="ml-2 hover:text-red-200"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* What to Bring */}
                    <div>
                      <Label className="text-gray-300">What to Bring</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          value={whatToBringInput}
                          onChange={e => setWhatToBringInput(e.target.value)}
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Add item to bring..."
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addItem(
                                formData.whatToBring,
                                whatToBringInput,
                                items =>
                                  setFormData({
                                    ...formData,
                                    whatToBring: items
                                  })
                              )
                              setWhatToBringInput("")
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addItem(
                              formData.whatToBring,
                              whatToBringInput,
                              items =>
                                setFormData({ ...formData, whatToBring: items })
                            )
                            setWhatToBringInput("")
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.whatToBring.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-blue-600 bg-blue-600/20 text-blue-400"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(formData.whatToBring, index, items =>
                                  setFormData({
                                    ...formData,
                                    whatToBring: items
                                  })
                                )
                              }
                              className="ml-2 hover:text-blue-200"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Policies & Requirements */}
                <Card className="border-gray-700 bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Policies & Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="cancellationPolicy"
                        className="text-gray-300"
                      >
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
                        className="border-gray-600 bg-gray-700 text-white"
                        placeholder="Describe cancellation terms..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="safetyRequirements"
                        className="text-gray-300"
                      >
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
                        className="border-gray-600 bg-gray-700 text-white"
                        placeholder="Safety requirements and restrictions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card className="border-gray-700 bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-gray-700 bg-gray-800">
                            {statuses.map(status => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="videoUrl" className="text-gray-300">
                          Video URL
                        </Label>
                        <Input
                          id="videoUrl"
                          value={formData.videoUrl}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              videoUrl: e.target.value
                            })
                          }
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weatherDependent"
                          checked={formData.weatherDependent}
                          onCheckedChange={checked =>
                            setFormData({
                              ...formData,
                              weatherDependent: !!checked
                            })
                          }
                        />
                        <Label
                          htmlFor="weatherDependent"
                          className="text-gray-300"
                        >
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
                              instantConfirmation: !!checked
                            })
                          }
                        />
                        <Label
                          htmlFor="instantConfirmation"
                          className="text-gray-300"
                        >
                          Instant Confirmation
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={checked =>
                            setFormData({ ...formData, featured: !!checked })
                          }
                        />
                        <Label htmlFor="featured" className="text-gray-300">
                          Featured Activity
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 border-t border-gray-700 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-600 text-white hover:bg-orange-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        {activity ? "Update Activity" : "Create Activity"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
