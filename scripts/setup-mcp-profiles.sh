#!/bin/bash

# Setup different MCP profiles for different browsers/sessions
echo "🔧 Setting up MCP profiles..."

# Kill all existing MCPs first
pkill -f "supabase-mcp"
sleep 2

# Profile 1: Chrome
echo "Starting MCP for Chrome (port 3001)..."
MCP_PORT=3001 MCP_PROFILE=chrome npm exec @smithery/cli@latest run @supabase-community/supabase-mcp &

# Profile 2: Safari  
echo "Starting MCP for Safari (port 3002)..."
MCP_PORT=3002 MCP_PROFILE=safari npm exec @smithery/cli@latest run @supabase-community/supabase-mcp &

# Profile 3: Firefox
echo "Starting MCP for Firefox (port 3003)..."
MCP_PORT=3003 MCP_PROFILE=firefox npm exec @smithery/cli@latest run @supabase-community/supabase-mcp &

echo "✅ All MCP profiles started!"
echo "Use different ports for different browsers"