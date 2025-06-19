"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, CheckSquare, Square, Eye, Edit, Mail, Ban } from "lucide-react"
import Link from "next/link"
import SortableTable, { SortableColumn } from "../../_components/sortable-table"
import CSVExport from "../../_components/csv-export"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  status: string
  role: string
  totalBookings: number
  totalSpent: number
  lastLogin: Date
  joinDate: Date
  createdAt: Date
  updatedAt: Date
}

interface UsersManagementProps {
  initialUsers?: any[]
}

export default function UsersManagement({
  initialUsers = []
}: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(!initialUsers.length)

  // Load and format users
  useEffect(() => {
    if (initialUsers.length > 0) {
      formatUsers(initialUsers)
    } else {
      loadUsers()
    }
  }, [initialUsers])

  const formatUsers = (rawUsers: any[]) => {
    const formatted: User[] = rawUsers.map(user => ({
      id: user.id,
      email: user.email || user.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      fullName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Unknown User",
      avatar: user.avatar || user.imageUrl,
      status: user.status || "active",
      role: user.role || "customer",
      totalBookings: user.totalBookings || 0,
      totalSpent: parseFloat(user.totalSpent?.toString()) || 0,
      lastLogin: new Date(
        user.lastLogin || user.lastSignInAt || user.createdAt
      ),
      joinDate: new Date(user.createdAt),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt || user.createdAt)
    }))
    setUsers(formatted)
    setIsLoading(false)
  }

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // Call the users API endpoint
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")

      const data = await response.json()
      formatUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
      // Fallback to mock data if API fails
      const mockUsers = [
        {
          id: "1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          status: "active",
          role: "customer",
          totalBookings: 5,
          totalSpent: 850,
          lastLogin: new Date("2024-01-24"),
          joinDate: new Date("2023-06-15"),
          createdAt: new Date("2023-06-15"),
          updatedAt: new Date("2024-01-24")
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          fullName: "Jane Smith",
          status: "active",
          role: "premium",
          totalBookings: 12,
          totalSpent: 2340,
          lastLogin: new Date("2024-01-25"),
          joinDate: new Date("2023-03-10"),
          createdAt: new Date("2023-03-10"),
          updatedAt: new Date("2024-01-25")
        },
        {
          id: "3",
          email: "admin@mallocra.com",
          firstName: "Admin",
          lastName: "User",
          fullName: "Admin User",
          status: "active",
          role: "admin",
          totalBookings: 0,
          totalSpent: 0,
          lastLogin: new Date("2024-01-25"),
          joinDate: new Date("2023-01-01"),
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2024-01-25")
        }
      ]
      setUsers(mockUsers)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    return filtered
  }, [users, searchQuery, statusFilter, roleFilter])

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Bulk actions
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedUsers.length === 0) return

    try {
      // In real implementation, this would call the API
      setUsers(prev =>
        prev.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, status: newStatus }
            : user
        )
      )
      setSelectedUsers([])
    } catch (error) {
      console.error("Error updating users:", error)
    }
  }

  // Table columns configuration
  const columns: SortableColumn[] = [
    {
      key: "select",
      label: "",
      sortable: false,
      width: "w-12",
      render: (_, user) => (
        <button
          onClick={() => handleSelectUser(user.id)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {selectedUsers.includes(user.id) ? (
            <CheckSquare className="size-4 text-orange-500" />
          ) : (
            <Square className="size-4" />
          )}
        </button>
      )
    },
    {
      key: "fullName",
      label: "User",
      sortable: true,
      render: (name, user) => (
        <div className="flex items-center space-x-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={name}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-600">
              <span className="text-sm font-medium text-white">
                {name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-white">{name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: role => {
        const roleStyles = {
          admin: "bg-red-600 text-red-100",
          premium: "bg-yellow-600 text-yellow-100",
          customer: "bg-blue-600 text-blue-100",
          moderator: "bg-purple-600 text-purple-100"
        }
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs ${roleStyles[role as keyof typeof roleStyles] || "bg-gray-600 text-gray-100"}`}
          >
            {role}
          </span>
        )
      }
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: status => {
        const statusStyles = {
          active: "bg-green-600 text-green-100",
          inactive: "bg-gray-600 text-gray-100",
          suspended: "bg-red-600 text-red-100",
          pending: "bg-yellow-600 text-yellow-100"
        }
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-600 text-gray-100"}`}
          >
            {status}
          </span>
        )
      }
    },
    {
      key: "totalBookings",
      label: "Bookings",
      sortable: true,
      render: bookings => (
        <span className="text-gray-300">{bookings} bookings</span>
      )
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: amount => (
        <span className="font-medium text-green-400">
          €{amount.toLocaleString()}
        </span>
      )
    },
    {
      key: "lastLogin",
      label: "Last Login",
      sortable: true,
      render: date => {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - new Date(date).getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "Today"
        if (diffDays === 2) return "Yesterday"
        if (diffDays <= 7) return `${diffDays} days ago`
        return new Date(date).toLocaleDateString()
      }
    },
    {
      key: "joinDate",
      label: "Join Date",
      sortable: true,
      render: date => new Date(date).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      width: "w-32",
      render: (_, user) => (
        <div className="flex items-center space-x-1">
          <Link
            href={`/admin/users/${user.id}`}
            className="p-1 text-gray-400 transition-colors hover:text-blue-400"
            title="View Profile"
          >
            <Eye className="size-4" />
          </Link>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-green-400"
            title="Edit User"
          >
            <Edit className="size-4" />
          </button>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-purple-400"
            title="Send Email"
          >
            <Mail className="size-4" />
          </button>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-red-400"
            title="Suspend User"
          >
            <Ban className="size-4" />
          </button>
        </div>
      )
    }
  ]

  if (isLoading) {
    return (
      <div className="rounded-lg bg-gray-800 p-8 text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <p className="text-gray-400">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          {/* Role Filter */}
          <select
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="premium">Premium</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>

          {/* Export */}
          <CSVExport />
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
            <span className="text-sm text-white">
              {selectedUsers.length} users selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange("active")}
                className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusChange("suspended")}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
              >
                Suspend
              </button>
              <button
                onClick={() => console.log("Send emails to selected users")}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Email Users
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </p>

        {/* Select All */}
        <button
          onClick={handleSelectAll}
          className="flex items-center space-x-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          {selectedUsers.length === filteredUsers.length ? (
            <CheckSquare className="size-4 text-orange-500" />
          ) : (
            <Square className="size-4" />
          )}
          <span>Select All</span>
        </button>
      </div>

      {/* Users Table */}
      <SortableTable
        columns={columns}
        data={filteredUsers}
        defaultSort={{ key: "lastLogin", direction: "desc" }}
        onRowClick={user => console.log("Row clicked:", user)}
        rowClassName={user =>
          selectedUsers.includes(user.id)
            ? "bg-gray-750 border-l-4 border-orange-500"
            : ""
        }
      />
    </div>
  )
}
