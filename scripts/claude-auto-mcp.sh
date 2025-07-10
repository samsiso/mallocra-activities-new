#!/bin/bash

# Claude Auto-MCP Wrapper
# This script replaces the claude command to always load MCP servers first

GLOBAL_MCP_CONFIG="$HOME/.config/claude-code/mcp-servers.json"

# Function to load MCP servers
load_mcp_servers() {
    if [ -f "$GLOBAL_MCP_CONFIG" ] && command -v jq &> /dev/null; then
        # Load all MCP servers from global config
        jq -r '.mcpServers | keys[]' "$GLOBAL_MCP_CONFIG" | while read -r server_name; do
            # Check if server is already loaded
            if ! claude mcp list 2>/dev/null | grep -q "^$server_name"; then
                server_config=$(jq -c ".mcpServers[\"$server_name\"]" "$GLOBAL_MCP_CONFIG")
                claude mcp add "$server_name" "$server_config" 2>/dev/null || true
            fi
        done
    fi
}

# Load MCP servers before running Claude
load_mcp_servers

# Run the original claude command with all arguments
exec /opt/homebrew/bin/claude "$@"