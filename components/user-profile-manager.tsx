"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Phone, Mail, Calendar } from "lucide-react"
import { toast } from "sonner"
import {
  getCurrentUserProfileAction,
  updateUserProfileAction,
  syncClerkUserAction
} from "@/actions/db/users-actions"
import type { UserProfile } from "@/actions/db/users-actions"

interface UserProfileManagerProps {
  initialProfile?: UserProfile | null
  className?: string
}

export default function UserProfileManager({
  initialProfile,
  className = ""
}: UserProfileManagerProps) {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(
    initialProfile || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    preferredLanguage: "en"
  })

  // Load user profile on component mount
  useEffect(() => {
    if (isLoaded && user && !profile) {
      loadUserProfile()
    }
  }, [isLoaded, user, profile])

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        preferredLanguage: profile.preferred_language || "en"
      })
    }
  }, [profile])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      const result = await getCurrentUserProfileAction()
      if (result.isSuccess) {
        setProfile(result.data)
      } else if (user) {
        // If no profile exists, create one from Clerk data
        await syncUserProfile()
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast.error("Failed to load user profile")
    } finally {
      setIsLoading(false)
    }
  }

  const syncUserProfile = async () => {
    if (!user) return

    setIsSyncing(true)
    try {
      const result = await syncClerkUserAction({
        id: user.id,
        emailAddresses: user.emailAddresses || [],
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumbers: user.phoneNumbers || []
      })

      if (result.isSuccess) {
        setProfile(result.data)
        toast.success("Profile synchronized successfully")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error syncing user profile:", error)
      toast.error("Failed to sync profile")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setIsLoading(true)
    try {
      const result = await updateUserProfileAction(user.id, {
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        phone: formData.phone || null,
        preferredLanguage: formData.preferredLanguage
      })

      if (result.isSuccess) {
        setProfile(result.data)
        toast.success("Profile updated successfully")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      customer: { label: "Customer", variant: "default" as const },
      salesperson: { label: "Salesperson", variant: "secondary" as const },
      operator: { label: "Operator", variant: "outline" as const },
      admin: { label: "Administrator", variant: "destructive" as const }
    }
    return (
      types[userType as keyof typeof types] || {
        label: userType,
        variant: "default" as const
      }
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="size-6 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card className={`border-gray-700 bg-gray-800 ${className}`}>
        <CardContent className="p-6">
          <p className="text-center text-gray-400">
            Please sign in to view your profile
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="size-6 text-orange-500" />
              <div>
                <CardTitle className="text-white">User Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account information
                </CardDescription>
              </div>
            </div>

            {profile && (
              <Badge variant={getUserTypeDisplay(profile.user_type).variant}>
                {getUserTypeDisplay(profile.user_type).label}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Clerk Account Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Mail className="size-4" />
            <span>{user.emailAddresses?.[0]?.emailAddress}</span>
          </div>

          {profile && (
            <>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="size-4" />
                <span>
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span
                  className={`size-2 rounded-full ${
                    profile.status === "active"
                      ? "bg-green-500"
                      : profile.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span>Status: {profile.status}</span>
              </div>
            </>
          )}

          {!profile && (
            <Button
              onClick={syncUserProfile}
              disabled={isSyncing}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Syncing Profile...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      {profile && (
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Profile Details</CardTitle>
            <CardDescription className="text-gray-400">
              Update your personal information
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={e =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="border-gray-600 bg-gray-700 text-white"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={e =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="border-gray-600 bg-gray-700 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">
                  <Phone className="mr-1 inline size-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  className="border-gray-600 bg-gray-700 text-white"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-gray-300">
                  Preferred Language
                </Label>
                <select
                  id="language"
                  value={formData.preferredLanguage}
                  onChange={e =>
                    handleInputChange("preferredLanguage", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
