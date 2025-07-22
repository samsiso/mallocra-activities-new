#!/bin/bash

echo "Testing MCP Server on Vercel..."
echo "================================"

# Test OAuth metadata endpoint
echo -e "\n1. Testing OAuth metadata endpoint:"
curl -s https://mallocra-activities-main.vercel.app/.well-known/oauth-protected-resource | jq . 2>/dev/null || echo "❌ Not ready yet"

# Test MCP server health
echo -e "\n2. Testing MCP server (list activities):"
curl -s -X POST https://mallocra-activities-main.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mcp_dev_key_2025_mallorca_activities" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }' | jq . 2>/dev/null || echo "❌ Not ready yet"

echo -e "\n================================"
echo "If you see JSON responses above, your MCP server is ready!"
echo "If not, wait a minute and try again."