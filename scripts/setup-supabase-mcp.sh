#!/bin/bash

# Supabase MCP Setup Script
# This script ensures Supabase MCP is always available for Claude Code

echo "🚀 Setting up Supabase MCP for Claude Code..."

# Master access token
SUPABASE_TOKEN="sbp_0b12301cb9ef04c534aab1175757221efa3b2763"

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Please install it first."
    exit 1
fi

# Remove any existing supabase servers to avoid conflicts
echo "🧹 Cleaning up existing configurations..."
claude mcp remove supabase -s local 2>/dev/null || true
claude mcp remove supabase-master -s local 2>/dev/null || true

# Add the master Supabase MCP server with correct configuration format
echo "✅ Adding Supabase MCP server..."
claude mcp add supabase "{
  \"command\": \"npx\",
  \"args\": [
    \"-y\",
    \"@supabase/mcp-server-supabase@latest\",
    \"--read-only\",
    \"--project-ref=tskawjnjmiltzoypdnsl\"
  ],
  \"env\": {
    \"SUPABASE_ACCESS_TOKEN\": \"$SUPABASE_TOKEN\"
  }
}"

# Verify installation
echo "🔍 Verifying installation..."
if claude mcp list | grep -q "supabase"; then
    echo "✅ Supabase MCP server configured successfully!"
    echo ""
    echo "📋 Available in:"
    echo "  - This project (via .mcp.json)"
    echo "  - Local Claude Code config"
    echo ""
    echo "🔧 To use in other projects:"
    echo "  1. Copy .mcp.json to the project root"
    echo "  2. Or run this script in that project"
    echo ""
    echo "🎯 Restart Claude Code to activate the MCP server"
else
    echo "❌ Setup failed. Please check your configuration."
    exit 1
fi