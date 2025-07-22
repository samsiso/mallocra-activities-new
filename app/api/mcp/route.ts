import { z } from "zod"
import { createMcpHandler } from "mcp-handler"
import { supabaseAdminClient } from "@/lib/supabase-admin"

// Create MCP handler for Mallorca Activities tools
const handler = createMcpHandler(
  server => {
    // Tool: Get activity details
    server.tool(
      "get_activity",
      "Retrieves details for a specific activity by ID or slug",
      {
        identifier: z.string().describe("Activity ID or slug")
      },
      async ({ identifier }) => {
        try {
          const query = supabaseAdminClient
            .from("activities")
            .select("*")
            .or(`id.eq.${identifier},slug.eq.${identifier}`)
            .single()

          const { data, error } = await query

          if (error) {
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }]
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          }
        }
      }
    )

    // Tool: List activities
    server.tool(
      "list_activities",
      "Lists all activities with optional filtering",
      {
        category: z.string().optional().describe("Filter by category"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(10)
          .describe("Number of results to return")
      },
      async ({ category, limit }) => {
        try {
          let query = supabaseAdminClient
            .from("activities")
            .select("id, title, slug, price, currency, category")
            .limit(limit)

          if (category) {
            query = query.eq("category", category)
          }

          const { data, error } = await query

          if (error) {
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }]
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          }
        }
      }
    )

    // Tool: Get booking details
    server.tool(
      "get_booking",
      "Retrieves booking details by booking ID",
      {
        bookingId: z.string().describe("Booking ID")
      },
      async ({ bookingId }) => {
        try {
          const { data, error } = await supabaseAdminClient
            .from("bookings")
            .select(
              `
              *,
              activities (
                id,
                title,
                slug
              ),
              profiles (
                id,
                email,
                first_name,
                last_name
              )
            `
            )
            .eq("id", bookingId)
            .single()

          if (error) {
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }]
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          }
        }
      }
    )

    // Tool: Check availability
    server.tool(
      "check_availability",
      "Checks availability for an activity on a specific date",
      {
        activityId: z.string().describe("Activity ID"),
        date: z.string().describe("Date in YYYY-MM-DD format"),
        participants: z.number().int().min(1).describe("Number of participants")
      },
      async ({ activityId, date, participants }) => {
        try {
          // First get activity capacity
          const { data: activity, error: activityError } =
            await supabaseAdminClient
              .from("activities")
              .select("max_capacity")
              .eq("id", activityId)
              .single()

          if (activityError) {
            return {
              content: [
                { type: "text", text: `Error: ${activityError.message}` }
              ]
            }
          }

          // Then check existing bookings for that date
          const { data: bookings, error: bookingError } =
            await supabaseAdminClient
              .from("bookings")
              .select("participants")
              .eq("activity_id", activityId)
              .eq("date", date)
              .in("status", ["confirmed", "pending"])

          if (bookingError) {
            return {
              content: [
                { type: "text", text: `Error: ${bookingError.message}` }
              ]
            }
          }

          const totalBooked =
            bookings?.reduce((sum, booking) => sum + booking.participants, 0) ||
            0
          const availableSpots = activity.max_capacity - totalBooked
          const isAvailable = availableSpots >= participants

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    activityId,
                    date,
                    maxCapacity: activity.max_capacity,
                    totalBooked,
                    availableSpots,
                    requestedParticipants: participants,
                    isAvailable
                  },
                  null,
                  2
                )
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          }
        }
      }
    )

    // Tool: Get database stats
    server.tool(
      "get_stats",
      "Retrieves statistics about the platform",
      {},
      async () => {
        try {
          const [activities, bookings, users, reviews] = await Promise.all([
            supabaseAdminClient
              .from("activities")
              .select("id", { count: "exact" }),
            supabaseAdminClient
              .from("bookings")
              .select("id", { count: "exact" }),
            supabaseAdminClient
              .from("profiles")
              .select("id", { count: "exact" }),
            supabaseAdminClient.from("reviews").select("id", { count: "exact" })
          ])

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    activities: activities.count || 0,
                    bookings: bookings.count || 0,
                    users: users.count || 0,
                    reviews: reviews.count || 0
                  },
                  null,
                  2
                )
              }
            ]
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          }
        }
      }
    )
  },
  {},
  { basePath: "/api" }
)

export { handler as GET, handler as POST, handler as DELETE }
