# MCP Server Integration with Vercel

This document explains how to use the Mallorca Activities MCP server deployed on Vercel with Claude Code.

## Overview

We've created a custom MCP (Model Context Protocol) server that provides direct access to the Mallorca Activities database and functionality. This allows Claude Code to:

- Query activities and bookings
- Check availability
- Get platform statistics
- Create test bookings (with admin authentication)

## Available Tools

### 1. `get_activity`
Retrieves details for a specific activity by ID or slug.

**Parameters:**
- `identifier` (string): Activity ID or slug

**Example:**
```
get_activity(identifier: "kayaking-adventure")
```

### 2. `list_activities`
Lists all activities with optional filtering.

**Parameters:**
- `category` (string, optional): Filter by category
- `limit` (number, optional): Number of results to return (1-100, default: 10)

**Example:**
```
list_activities(category: "water-sports", limit: 20)
```

### 3. `get_booking`
Retrieves booking details by booking ID.

**Parameters:**
- `bookingId` (string): Booking ID

**Example:**
```
get_booking(bookingId: "booking_123456")
```

### 4. `check_availability`
Checks availability for an activity on a specific date.

**Parameters:**
- `activityId` (string): Activity ID
- `date` (string): Date in YYYY-MM-DD format
- `participants` (number): Number of participants

**Example:**
```
check_availability(activityId: "act_123", date: "2025-02-15", participants: 4)
```

### 5. `get_stats`
Retrieves platform statistics.

**Parameters:** None

**Example:**
```
get_stats()
```

### 6. `create_test_booking` (Admin Only)
Creates a test booking for development purposes.

**Parameters:**
- `activityId` (string): Activity ID
- `userId` (string): User ID
- `date` (string): Date in YYYY-MM-DD format
- `participants` (number): Number of participants

**Requires:** Admin scope (`admin:write`)

## Configuration

### For Claude Code

1. **Local Development**
   Add to `.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "mallorca-activities": {
         "url": "http://localhost:3004/api/mcp",
         "headers": {
           "Authorization": "Bearer mcp_dev_key_2025_mallorca_activities"
         }
       }
     }
   }
   ```

2. **Production (Vercel)**
   Add to `.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "mallorca-activities": {
         "url": "https://your-app.vercel.app/api/mcp",
         "headers": {
           "Authorization": "Bearer your-production-token"
         }
       }
     }
   }
   ```

### Environment Variables

Add to `.env.local`:
```env
# MCP Server Configuration
MCP_API_KEY=your_secure_api_key_here
```

## Authentication

The MCP server supports two authentication modes:

1. **Development Mode**: Uses a simple API key defined in `MCP_API_KEY` environment variable
2. **Production Mode**: Can integrate with Clerk or other auth providers

### Scopes

- `read:activities` - Read activity data
- `read:bookings` - Read booking data
- `read:stats` - Read platform statistics
- `admin:write` - Create test bookings and perform admin operations

## API Endpoints

- **MCP Server**: `/api/mcp` or `/api/[transport]` (supports both SSE and POST)
- **OAuth Metadata**: `/.well-known/oauth-protected-resource`

## Testing

### Using MCP Inspector

```bash
# Install and run the inspector
npx @modelcontextprotocol/inspector@latest http://localhost:3004

# Open browser at http://127.0.0.1:6274
# Select "Streamable HTTP" transport
# Enter URL: http://localhost:3004/api/mcp
# Add Authorization header: Bearer mcp_dev_key_2025_mallorca_activities
```

### Using Claude Code

1. Ensure the server is running (`npm run dev`)
2. Configure `.cursor/mcp.json` as shown above
3. Restart Claude Code
4. Use the tools in your prompts:
   ```
   Can you check availability for activity "kayaking-adventure" on 2025-02-15 for 4 people?
   ```

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: Add MCP server for Claude Code integration"
   git push
   ```

2. **Set Environment Variables on Vercel**
   - Go to your Vercel project settings
   - Add `MCP_API_KEY` with a secure value
   - Add all other required environment variables

3. **Deploy**
   - Vercel will automatically deploy on push
   - Your MCP server will be available at `https://your-app.vercel.app/api/mcp`

## Security Considerations

1. **API Key**: Use a strong, unique API key in production
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Scopes**: Implement proper scope checking for sensitive operations
5. **CORS**: The MCP handler includes CORS support for the metadata endpoint

## Benefits of Vercel Deployment

- **Fluid Compute**: Optimized for irregular MCP usage patterns
- **Dynamic Scaling**: Handles bursts of requests efficiently
- **Cost Effective**: Pay only for actual compute usage
- **Global CDN**: Fast response times worldwide
- **Automatic HTTPS**: Secure by default

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Check that the Authorization header is correctly set
   - Verify the MCP_API_KEY matches in both server and client

2. **"Tool not found" Error**
   - Ensure the MCP server is running
   - Check the URL is correct in the configuration

3. **Connection Refused**
   - Verify the server is running on the expected port
   - Check firewall settings for local development

### Debug Mode

Set `DEBUG=mcp:*` environment variable to see detailed MCP logs:
```bash
DEBUG=mcp:* npm run dev
```

## Next Steps

1. Customize the tools based on your specific needs
2. Implement production-grade authentication
3. Add more tools for other platform features
4. Set up monitoring and logging for the MCP server
5. Consider adding caching for frequently accessed data