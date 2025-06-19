"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  Edit,
  Save,
  Calendar,
  User,
  Type,
  FileText,
  ToggleLeft,
  Hash,
  Lock
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface Setting {
  id: string
  category: string
  name: string
  value: string
  type: "text" | "number" | "boolean" | "password" | "file"
  description: string
  lastModified: string
  modifiedBy: string
}

interface SettingsManagementProps {
  initialData: Setting[]
}

export default function SettingsManagement({
  initialData
}: SettingsManagementProps) {
  const [settings, setSettings] = useState<Setting[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const filteredSettings = settings.filter(setting => {
    const matchesSearch =
      setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || setting.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="size-4 text-blue-500" />
      case "number":
        return <Hash className="size-4 text-green-500" />
      case "boolean":
        return <ToggleLeft className="size-4 text-purple-500" />
      case "password":
        return <Lock className="size-4 text-red-500" />
      case "file":
        return <FileText className="size-4 text-orange-500" />
      default:
        return <Type className="size-4 text-gray-500" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      General: "bg-blue-600",
      Notifications: "bg-green-600",
      Bookings: "bg-purple-600",
      Payments: "bg-orange-600",
      Security: "bg-red-600"
    }
    return (
      <Badge
        className={`${colors[category as keyof typeof colors] || "bg-gray-600"} text-white`}
      >
        {category}
      </Badge>
    )
  }

  const handleEdit = (setting: Setting) => {
    setEditingId(setting.id)
    setEditValue(setting.value)
  }

  const handleSave = (settingId: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? {
              ...setting,
              value: editValue,
              lastModified: new Date().toISOString(),
              modifiedBy: "Current User"
            }
          : setting
      )
    )
    setEditingId(null)
    setEditValue("")
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleBooleanToggle = (settingId: string, currentValue: string) => {
    const newValue = currentValue === "true" ? "false" : "true"
    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? {
              ...setting,
              value: newValue,
              lastModified: new Date().toISOString(),
              modifiedBy: "Current User"
            }
          : setting
      )
    )
  }

  const renderValueInput = (setting: Setting) => {
    if (editingId === setting.id) {
      switch (setting.type) {
        case "boolean":
          return (
            <div className="flex items-center space-x-2">
              <Switch
                checked={editValue === "true"}
                onCheckedChange={checked =>
                  setEditValue(checked ? "true" : "false")
                }
              />
              <span className="text-white">
                {editValue === "true" ? "Enabled" : "Disabled"}
              </span>
            </div>
          )
        case "password":
          return (
            <Input
              type="password"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="border-gray-600 bg-gray-700 text-white"
              placeholder="Enter new password"
            />
          )
        default:
          return (
            <Input
              type={setting.type === "number" ? "number" : "text"}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="border-gray-600 bg-gray-700 text-white"
            />
          )
      }
    }

    // Display mode
    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={setting.value === "true"}
              onCheckedChange={() =>
                handleBooleanToggle(setting.id, setting.value)
              }
            />
            <span className="text-white">
              {setting.value === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        )
      case "password":
        return (
          <span className="font-mono text-gray-400">
            {"*".repeat(setting.value.length)}
          </span>
        )
      default:
        return <span className="font-medium text-white">{setting.value}</span>
    }
  }

  const categories = Array.from(
    new Set(settings.map(setting => setting.category))
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white"
          />
        </div>

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
        <span className="font-medium">{filteredSettings.length}</span>
        <span className="ml-1 text-gray-400">
          setting{filteredSettings.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredSettings.map(setting => (
          <Card key={setting.id} className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(setting.type)}
                    <CardTitle className="text-white">{setting.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryBadge(setting.category)}
                    <span className="text-xs text-gray-400">
                      ID: {setting.id}
                    </span>
                  </div>
                </div>
                {editingId === setting.id ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(setting.id)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Save className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(setting)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="size-3" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">{setting.description}</p>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Value:
                </label>
                {renderValueInput(setting)}
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="size-3" />
                  <span>Modified: {formatDate(setting.lastModified)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="size-3" />
                  <span>By: {setting.modifiedBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSettings.length === 0 && (
        <div className="py-12 text-center">
          <Type className="mx-auto mb-4 size-12 text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-white">
            No settings found
          </h3>
          <p className="text-gray-400">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No settings configured yet"}
          </p>
        </div>
      )}
    </div>
  )
}
