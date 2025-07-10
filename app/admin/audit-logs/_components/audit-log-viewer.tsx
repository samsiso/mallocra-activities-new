"use client"

import { useState } from "react"
import {
  AuditLogEntry,
  getAuditLogsAction,
  exportAuditLogsAction
} from "@/actions/db/audit-log-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface AuditLogViewerProps {
  initialLogs: AuditLogEntry[]
  totalCount: number
}

export default function AuditLogViewer({
  initialLogs,
  totalCount
}: AuditLogViewerProps) {
  const [logs, setLogs] = useState(initialLogs)
  const [total, setTotal] = useState(totalCount)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const pageSize = 50
  const totalPages = Math.ceil(total / pageSize)

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      critical: {
        className: "bg-red-900 text-red-200 border-red-700",
        label: "Critical"
      },
      error: {
        className: "bg-orange-900 text-orange-200 border-orange-700",
        label: "Error"
      },
      warning: {
        className: "bg-yellow-900 text-yellow-200 border-yellow-700",
        label: "Warning"
      },
      info: {
        className: "bg-blue-900 text-blue-200 border-blue-700",
        label: "Info"
      }
    }
    const variant = variants[severity] || variants.info
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, string> = {
      auth: "bg-purple-900 text-purple-200 border-purple-700",
      admin: "bg-pink-900 text-pink-200 border-pink-700",
      booking: "bg-green-900 text-green-200 border-green-700",
      activity: "bg-cyan-900 text-cyan-200 border-cyan-700",
      review: "bg-indigo-900 text-indigo-200 border-indigo-700",
      payment: "bg-yellow-900 text-yellow-200 border-yellow-700",
      settings: "bg-gray-700 text-gray-200 border-gray-600",
      user: "bg-blue-900 text-blue-200 border-blue-700"
    }
    return (
      <Badge variant="outline" className={variants[category] || variants.user}>
        {category}
      </Badge>
    )
  }

  const fetchLogs = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await getAuditLogsAction({
        search: searchQuery,
        category: selectedCategory,
        severity: selectedSeverity,
        startDate: dateRange.start,
        endDate: dateRange.end,
        limit: pageSize,
        offset: (page - 1) * pageSize
      })

      if (result.isSuccess && result.data) {
        setLogs(result.data.logs)
        setTotal(result.data.total)
        setCurrentPage(page)
      }
    } catch (error) {
      toast.error("Failed to fetch audit logs")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await exportAuditLogsAction({
        search: searchQuery,
        category: selectedCategory,
        severity: selectedSeverity,
        startDate: dateRange.start,
        endDate: dateRange.end
      })

      if (result.isSuccess && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success("Audit logs exported successfully")
      }
    } catch (error) {
      toast.error("Failed to export audit logs")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by action, resource, or user..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-gray-700 pl-10 text-white"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-gray-700 text-white lg:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="admin">Administrative</SelectItem>
              <SelectItem value="booking">Bookings</SelectItem>
              <SelectItem value="activity">Activities</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-full bg-gray-700 text-white lg:w-48">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => fetchLogs(1)}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : (
              <Filter className="mr-2 size-4" />
            )}
            Apply Filters
          </Button>

          <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="border-gray-600 bg-gray-700 hover:bg-gray-600"
          >
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-800/50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                      {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="text-white">
                          {log.userName || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="text-gray-300">{log.resource}</div>
                        {log.resourceId && (
                          <div className="text-xs text-gray-500">
                            ID: {log.resourceId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getCategoryBadge(log.category)}
                    </td>
                    <td className="px-4 py-3">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            // Show details in a modal or expand inline
                            console.log("Details:", log.details)
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, total)} of {total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="border-gray-600 bg-gray-700 hover:bg-gray-600"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage - 2 + i
                if (page < 1 || page > totalPages) return null
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => fetchLogs(page)}
                    disabled={loading}
                    className={
                      page === currentPage
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                    }
                  >
                    {page}
                  </Button>
                )
              }).filter(Boolean)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="border-gray-600 bg-gray-700 hover:bg-gray-600"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
