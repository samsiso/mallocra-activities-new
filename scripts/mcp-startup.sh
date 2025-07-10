#!/bin/bash
# MCP Startup Script - Run this when starting development

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Setting up MCP servers for development..."
./auto-setup-mcp.sh

echo "📊 MCP Status:"
./mcp-manager.sh status

echo "✅ MCP setup complete! You can now use Supabase MCP tools."
