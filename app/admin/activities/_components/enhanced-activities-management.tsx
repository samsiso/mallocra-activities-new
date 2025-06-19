"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Plus,
  MapPin,
  Clock,
  Users,
  Star,
  Euro,
  MoreVertical,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  getActivitiesAction,
  deleteActivityAction,
  updateActivityAction
} from "@/actions/db/activities-actions"
import { ActivityWithDetails } from "@/actions/db/activities-actions"

interface EnhancedActivitiesManagementProps {
  initialActivities?: ActivityWithDetails[]
}

export default function EnhancedActivitiesManagement({
  initialActivities = []
}: EnhancedActivitiesManagementProps) {
  const [activities, setActivities] =
    useState<ActivityWithDetails[]>(initialActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(!initialActivities.length)

  // Load activities from Supabase
  useEffect(() => {
    if (!initialActivities.length) {
      loadActivities()
    }
  }, [initialActivities.length])

  const loadActivities = async () => {
    setIsLoading(true)
    try {
      const response = await getActivitiesAction({ limit: 100 })
      if (response.isSuccess) {
        setActivities(response.data)
      } else {
        // Fallback to mock data if Supabase fails
        console.warn("Supabase unavailable, using mock data")
        setActivities(getMockActivities())
      }
    } catch (error) {
      console.error("Error loading activities:", error)
      // Fallback to mock data if connection fails
      console.warn("Using mock data due to connection error")
      setActivities(getMockActivities())
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities

    if (searchQuery) {
      filtered = filtered.filter(
        activity =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.shortDescription
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          activity.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(activity => activity.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        activity => activity.category === categoryFilter
      )
    }

    return filtered
  }, [activities, searchQuery, statusFilter, categoryFilter])

  // Handle operations
  const handleDelete = async (activityId: string) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return

    try {
      const response = await deleteActivityAction(activityId)
      if (response.isSuccess) {
        setActivities(prev => prev.filter(a => a.id !== activityId))
        alert("Activity deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting activity:", error)
      alert("Error deleting activity")
    }
  }

  const handleStatusToggle = async (
    activityId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    try {
      const response = await updateActivityAction(activityId, {
        status: newStatus as any
      })
      if (response.isSuccess) {
        setActivities(prev =>
          prev.map(a =>
            a.id === activityId ? { ...a, status: newStatus as any } : a
          )
        )
        alert(`Activity ${newStatus} successfully`)
      }
    } catch (error) {
      console.error("Error updating activity:", error)
      alert("Error updating activity")
    }
  }

  // Helper functions
  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-600",
      inactive: "bg-red-600",
      draft: "bg-yellow-600",
      suspended: "bg-gray-600"
    }
    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const names = {
      water_sports: "Water Sports",
      land_adventures: "Land Adventures",
      cultural: "Cultural",
      nightlife: "Nightlife",
      family_fun: "Family Fun"
    }

    return (
      <Badge variant="outline" className="border-blue-500 text-blue-400">
        {names[category as keyof typeof names] || category}
      </Badge>
    )
  }

  const formatPrice = (pricing: any[]) => {
    if (!pricing?.length) return "No pricing"
    const adultPrice = pricing.find(p => p.priceType === "adult")
    return adultPrice
      ? `€${parseFloat(adultPrice.basePrice).toFixed(0)}`
      : "Price TBD"
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}min`
  }

  // Mock data fallback
  const getMockActivities = (): ActivityWithDetails[] => [
    {
      id: "mock-1",
      operatorId: "op-1",
      title: "Jet Ski Adventure",
      slug: "jet-ski-adventure",
      shortDescription: "Thrilling jet ski experience along Mallorca's coast",
      description:
        "Experience the thrill of jet skiing along the beautiful coastline of Mallorca.",
      category: "water_sports",
      location: "Palma de Mallorca",
      meetingPoint: "Marina Port de Palma",
      latitude: null,
      longitude: null,
      durationMinutes: 120,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 16,
      maxAge: null,
      includedItems: ["Jet ski", "Safety equipment", "Brief instruction"],
      excludedItems: ["Transport", "Food"],
      whatToBring: ["Swimwear", "Sunscreen", "Water"],
      cancellationPolicy: "Free cancellation up to 24 hours before",
      safetyRequirements: "Must be able to swim",
      weatherDependent: true,
      instantConfirmation: true,
      featured: true,
      status: "active",
      avgRating: "4.8",
      totalReviews: 156,
      totalBookings: 234,
      videoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-1",
          activityId: "mock-1",
          imageUrl:
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
          altText: "Jet ski on clear water",
          caption: null,
          isPrimary: true,
          sortOrder: 0,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-1",
          activityId: "mock-1",
          priceType: "adult",
          basePrice: "89.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: "mock-2",
      operatorId: "op-1",
      title: "Mallorca Cultural Tour",
      slug: "mallorca-cultural-tour",
      shortDescription: "Explore Mallorca's rich history and culture",
      description:
        "Discover the rich history and culture of Mallorca with our guided tour.",
      category: "cultural",
      location: "Palma de Mallorca",
      meetingPoint: "Cathedral of Palma",
      latitude: null,
      longitude: null,
      durationMinutes: 240,
      maxParticipants: 15,
      minParticipants: 4,
      minAge: null,
      maxAge: null,
      includedItems: ["Professional guide", "Entry tickets", "Transport"],
      excludedItems: ["Lunch", "Personal expenses"],
      whatToBring: ["Comfortable shoes", "Camera"],
      cancellationPolicy: "Free cancellation up to 48 hours before",
      safetyRequirements: "Moderate walking required",
      weatherDependent: false,
      instantConfirmation: true,
      featured: false,
      status: "active",
      avgRating: "4.6",
      totalReviews: 89,
      totalBookings: 145,
      videoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [
        {
          id: "img-2",
          activityId: "mock-2",
          imageUrl:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
          altText: "Cathedral of Palma",
          caption: null,
          isPrimary: true,
          sortOrder: 0,
          createdAt: new Date()
        }
      ],
      pricing: [
        {
          id: "price-2",
          activityId: "mock-2",
          priceType: "adult",
          basePrice: "45.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: "mock-3",
      operatorId: "op-1",
      title: "Family Beach Day",
      slug: "family-beach-day",
      shortDescription: "Perfect beach day for families with kids",
      description:
        "Enjoy a perfect family beach day with activities for all ages.",
      category: "family_fun",
      location: "Alcúdia",
      meetingPoint: "Alcúdia Beach",
      latitude: null,
      longitude: null,
      durationMinutes: 360,
      maxParticipants: 20,
      minParticipants: 6,
      minAge: 3,
      maxAge: null,
      includedItems: ["Beach equipment", "Games", "Snacks"],
      excludedItems: ["Lunch", "Transport"],
      whatToBring: ["Swimwear", "Sunscreen", "Towels"],
      cancellationPolicy: "Free cancellation up to 24 hours before",
      safetyRequirements: "Children must be supervised",
      weatherDependent: true,
      instantConfirmation: true,
      featured: false,
      status: "draft",
      avgRating: "4.9",
      totalReviews: 67,
      totalBookings: 78,
      videoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
      pricing: [
        {
          id: "price-3",
          activityId: "mock-3",
          priceType: "adult",
          basePrice: "25.00",
          seasonalMultiplier: "1.0",
          currency: "EUR",
          validFrom: null,
          validUntil: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse border-gray-700 bg-gray-800">
            <div className="aspect-video rounded-t-lg bg-gray-700"></div>
            <CardContent className="space-y-3 p-4">
              <div className="h-4 rounded bg-gray-700"></div>
              <div className="h-3 w-3/4 rounded bg-gray-700"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card className="border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border-gray-600 bg-gray-700 pl-10 text-white"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gray-600 bg-gray-700 text-white">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 border-gray-600 bg-gray-700 text-white">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="water_sports">Water Sports</SelectItem>
                  <SelectItem value="land_adventures">
                    Land Adventures
                  </SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="family_fun">Family Fun</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  const csvRows: string[] = []
                  const headers = [
                    "ID",
                    "Title",
                    "Category",
                    "Location",
                    "Status",
                    "Price (adult)",
                    "Duration (min)",
                    "Rating"
                  ]
                  csvRows.push(headers.join(","))

                  filteredActivities.forEach(a => {
                    const adultPrice =
                      a.pricing?.find(p => p.priceType === "adult")
                        ?.basePrice || ""
                    csvRows.push(
                      [
                        a.id,
                        `"${a.title}"`,
                        a.category,
                        a.location,
                        a.status,
                        adultPrice,
                        a.durationMinutes,
                        a.avgRating || ""
                      ].join(",")
                    )
                  })

                  const blob = new Blob([csvRows.join("\n")], {
                    type: "text/csv;charset=utf-8;"
                  })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.href = url
                  link.setAttribute("download", `activities-${Date.now()}.csv`)
                  document.body.appendChild(link)
                  link.click()
                  link.parentNode?.removeChild(link)
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="mr-2 size-4" />
                Export CSV
              </Button>

              <Button
                onClick={() => {
                  window.location.href = "/admin/activities/create"
                }}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                <Plus className="mr-2 size-4" />
                New Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {filteredActivities.length} of {activities.length}{" "}
            activities
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredActivities.map(activity => (
            <Card
              key={activity.id}
              className="border-gray-700 bg-gray-800 transition-all hover:border-gray-600"
            >
              <CardHeader className="relative p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-900">
                  {activity.images && activity.images.length > 0 ? (
                    <img
                      src={
                        activity.images.find(img => img.isPrimary)?.imageUrl ||
                        activity.images[0].imageUrl
                      }
                      alt={activity.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {activity.featured && (
                    <div className="absolute right-2 top-2">
                      <Badge className="bg-orange-600 text-white">
                        <Star className="mr-1 size-3" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3
                      className="truncate text-lg font-semibold text-white"
                      title={activity.title}
                    >
                      {activity.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      {getCategoryBadge(activity.category)}
                      <span className="text-sm text-gray-400">
                        ID: {activity.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="mr-1 size-4" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="mr-1 size-4" />
                        <span>{formatDuration(activity.durationMinutes)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 size-4" />
                        <span>Max {activity.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center font-semibold text-green-400">
                      <Euro className="mr-1 size-4" />
                      <span>{formatPrice(activity.pricing)}</span>
                    </div>
                    {activity.avgRating &&
                      parseFloat(activity.avgRating) > 0 && (
                        <div className="flex items-center text-sm text-yellow-400">
                          <Star className="mr-1 size-4 fill-current" />
                          <span>
                            {parseFloat(activity.avgRating).toFixed(1)}
                          </span>
                          <span className="ml-1 text-gray-400">
                            ({activity.totalReviews})
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-700 pt-2">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`/activities/${activity.slug}`, "_blank")
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        title="View Activity"
                      >
                        <Eye className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.location.href = `/admin/activities/${activity.id}/edit`
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        title="Edit Activity"
                      >
                        <Edit className="size-3" />
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <MoreVertical className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-gray-700 bg-gray-800">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusToggle(activity.id, activity.status)
                          }
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          {activity.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(activity.id)}
                          className="text-red-400 hover:bg-gray-700"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && !isLoading && (
          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-700">
                  <MapPin className="size-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium text-white">
                    No activities found
                  </h3>
                  <p className="text-gray-400">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Create your first activity to get started"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
