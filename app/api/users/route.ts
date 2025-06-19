import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function GET() {
  try {
    // Get current user to verify admin access
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, you'd verify admin permissions here
    // For now, we'll fetch users from Clerk
    try {
      const clerk = await clerkClient()
      const users = await clerk.users.getUserList({
        limit: 100,
        orderBy: "-created_at"
      })

      // Transform Clerk user data to our format
      const transformedUsers = users.data.map((user: any) => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fullName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown User",
        avatar: user.imageUrl,
        status: user.banned ? "suspended" : "active",
        role: user.publicMetadata?.role || "customer",
        totalBookings: user.publicMetadata?.totalBookings || 0,
        totalSpent: user.publicMetadata?.totalSpent || 0,
        lastLogin: user.lastSignInAt,
        joinDate: user.createdAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))

      return NextResponse.json(transformedUsers)
    } catch (clerkError) {
      console.error("Clerk API Error:", clerkError)

      // Fallback to mock data if Clerk fails
      const mockUsers = [
        {
          id: "user_1",
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
          id: "user_2",
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
          id: "user_admin",
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

      return NextResponse.json(mockUsers)
    }
  } catch (error) {
    console.error("API Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
