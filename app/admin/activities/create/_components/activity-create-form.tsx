"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { createActivityAction } from "@/actions/db/activities-actions"
import { InsertActivity } from "@/db/schema/activities-schema"

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
  cancellationPolicy: string
  safetyRequirements: string
  weatherDependent: boolean
  instantConfirmation: boolean
  featured: boolean
  status: string
  videoUrl: string
}

export default function ActivityCreateForm() {
  const router = useRouter()

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
    cancellationPolicy: "",
    safetyRequirements: "",
    weatherDependent: false,
    instantConfirmation: true,
    featured: false,
    status: "draft",
    videoUrl: ""
  })

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
      const createData: InsertActivity = {
        operatorId: "default-operator", // TODO: Get from auth context
        title: formData.title.trim(),
        slug: formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
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
        includedItems: [],
        excludedItems: [],
        whatToBring: [],
        cancellationPolicy: formData.cancellationPolicy.trim(),
        safetyRequirements: formData.safetyRequirements.trim(),
        weatherDependent: formData.weatherDependent,
        instantConfirmation: formData.instantConfirmation,
        featured: formData.featured,
        status: formData.status as any,
        videoUrl: formData.videoUrl.trim() || null
      }

      const response = await createActivityAction(createData)

      if (response.isSuccess) {
        alert("Activity created successfully")
        router.push("/admin/activities")
      } else {
        alert("Failed to create activity")
      }
    } catch (error) {
      console.error("Error creating activity:", error)
      alert("Error creating activity")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header with actions */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Create New Activity</h2>
          <p className="text-gray-400">
            Fill in the details for your new activity
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
            {isLoading ? "Creating..." : "Create Activity"}
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
              </div>

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
          </Card>
        </div>

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
        </div>
      </div>
    </form>
  )
}
