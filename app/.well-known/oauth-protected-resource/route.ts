import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler
} from "mcp-handler"

// OAuth metadata handler for MCP server
const handler = protectedResourceHandler({
  // For development, we'll use a simple token-based auth
  // In production, replace with your actual authorization server
  authServerUrls: [
    process.env.NODE_ENV === "production"
      ? "https://your-auth-server.com" // Replace with your production auth server
      : "https://mallorca-activities.vercel.app" // Development/staging
  ],
  // Additional metadata
  resource: "https://mallorca-activities.vercel.app/api/mcp",
  scopes_supported: [
    "read:activities",
    "read:bookings",
    "read:stats",
    "admin:write"
  ],
  bearer_methods_supported: ["header"]
})

export { handler as GET, metadataCorsOptionsRequestHandler as OPTIONS }
