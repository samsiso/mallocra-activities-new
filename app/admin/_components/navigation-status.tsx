"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Shield } from "lucide-react"

const adminPages = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Activities", path: "/admin/activities" },
  { name: "Bookings", path: "/admin/bookings" },
  { name: "Users", path: "/admin/users" },
  { name: "Analytics", path: "/admin/analytics" },
  { name: "Media", path: "/admin/media" },
  { name: "Blog", path: "/admin/blog" },
  { name: "Payments", path: "/admin/payments" },
  { name: "Settings", path: "/admin/settings" }
]

interface PageStatus {
  name: string
  path: string
  status: "loading" | "success" | "protected" | "error"
  statusCode?: number
}

export default function NavigationStatus() {
  const [pageStatuses, setPageStatuses] = useState<PageStatus[]>(
    adminPages.map(page => ({ ...page, status: "loading" as const }))
  )

  useEffect(() => {
    checkAllPages()
  }, [])

  const checkAllPages = async () => {
    const promises = adminPages.map(async page => {
      try {
        // Use GET request instead of HEAD to avoid issues with redirects
        const response = await fetch(page.path, {
          method: "GET",
          redirect: "manual" // Don't follow redirects automatically
        })

        // 307 redirects indicate protected pages (expected behavior)
        if (response.status === 307 || response.status === 302) {
          return {
            ...page,
            status: "protected" as const,
            statusCode: response.status
          }
        }

        // 200 indicates accessible page
        if (response.status === 200) {
          return {
            ...page,
            status: "success" as const,
            statusCode: response.status
          }
        }

        // Other status codes are errors
        return {
          ...page,
          status: "error" as const,
          statusCode: response.status
        }
      } catch (error) {
        // Network errors
        return {
          ...page,
          status: "error" as const,
          statusCode: 0
        }
      }
    })

    const results = await Promise.all(promises)
    setPageStatuses(results)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="size-4 text-green-500" />
      case "protected":
        return <Shield className="size-4 text-blue-500" />
      case "error":
        return <XCircle className="size-4 text-red-500" />
      case "loading":
        return <Clock className="size-4 animate-spin text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string, statusCode?: number) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600 text-white">Accessible</Badge>
      case "protected":
        return (
          <Badge className="bg-blue-600 text-white">Protected (Auth)</Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-600 text-white">
            {statusCode === 0 ? "Network Error" : `Error ${statusCode}`}
          </Badge>
        )
      case "loading":
        return <Badge className="bg-yellow-600 text-white">Checking...</Badge>
    }
  }

  const workingCount = pageStatuses.filter(
    p => p.status === "success" || p.status === "protected"
  ).length
  const totalCount = pageStatuses.length

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-500">
          Admin Navigation Status
          <Badge
            variant="outline"
            className="border-orange-400 text-orange-400"
          >
            {workingCount}/{totalCount} Working
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pageStatuses.map(page => (
            <div
              key={page.path}
              className="flex items-center justify-between rounded-lg bg-gray-700 p-3"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(page.status)}
                <span className="font-medium text-white">{page.name}</span>
                <code className="rounded bg-gray-600 px-2 py-1 text-sm text-gray-400">
                  {page.path}
                </code>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(page.status, page.statusCode)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(page.path, "_blank")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-600 pt-4">
          <div className="mb-3 text-sm text-gray-400">
            <strong>Status Guide:</strong> Protected pages are normal for
            authenticated admin routes.
          </div>
          <Button
            onClick={checkAllPages}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Recheck All Pages
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
