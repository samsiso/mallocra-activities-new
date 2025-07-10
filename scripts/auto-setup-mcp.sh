#!/bin/bash

# Auto-setup MCP for Mallorca Activities Platform
# This script ensures MCP servers are always available when Claude Code starts

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MCP_CONFIG_FILE="$PROJECT_ROOT/.claude.json"

# Environment variables from .env.local
if [ -f "$PROJECT_ROOT/.env.local" ]; then
    source "$PROJECT_ROOT/.env.local"
fi

# Required environment variables
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://tskawjnjmiltzoypdnsl.supabase.co}"
SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDEwNDAsImV4cCI6MjA2NDYxNzA0MH0.3KAR1QM0ZGX6hB9lXE2hZ-5y9xdWIYYNgAo6GCbWlSk}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA0MTA0MCwiZXhwIjoyMDY0NjE3MDQwfQ.HY91_ZAp7gpeI8B-2oRaV_-rKo1fhC_G601EPY-p0bI}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to create MCP configuration
create_mcp_config() {
    log "Creating MCP configuration files..."
    
    # Create .claude.json for Claude Code
    cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--url",
        "$SUPABASE_URL",
        "--anon-key",
        "$SUPABASE_ANON_KEY",
        "--service-role-key",
        "$SUPABASE_SERVICE_KEY"
      ]
    }
  }
}
EOF
    
    # Create .cursor/mcp.json for Cursor compatibility
    mkdir -p "$PROJECT_ROOT/.cursor"
    cp "$MCP_CONFIG_FILE" "$PROJECT_ROOT/.cursor/mcp.json"
    
    # Create .mcp.json for additional compatibility
    cp "$MCP_CONFIG_FILE" "$PROJECT_ROOT/.mcp.json"
    
    log "✅ MCP configuration files created successfully"
}

# Function to add MCP server to Claude Code
add_mcp_to_claude() {
    log "Adding MCP server to Claude Code..."
    
    # Remove existing MCP server if it exists
    claude mcp remove supabase-mcp 2>/dev/null || true
    
    # Add new MCP server
    claude mcp add supabase-mcp "{
        \"command\": \"npx\",
        \"args\": [
            \"-y\",
            \"@supabase/mcp-server-supabase@latest\",
            \"--url\",
            \"$SUPABASE_URL\",
            \"--anon-key\",
            \"$SUPABASE_ANON_KEY\",
            \"--service-role-key\",
            \"$SUPABASE_SERVICE_KEY\"
        ]
    }"
    
    log "✅ MCP server added to Claude Code"
}

# Function to verify MCP setup
verify_mcp_setup() {
    log "Verifying MCP setup..."
    
    # Check if configuration files exist
    for config_file in ".claude.json" ".cursor/mcp.json" ".mcp.json"; do
        if [ -f "$PROJECT_ROOT/$config_file" ]; then
            log "✅ $config_file exists"
        else
            log "❌ $config_file missing"
            return 1
        fi
    done
    
    # Check if MCP server is registered with Claude Code
    if claude mcp list | grep -q "supabase-mcp"; then
        log "✅ MCP server registered with Claude Code"
    else
        log "❌ MCP server not registered with Claude Code"
        return 1
    fi
    
    log "✅ MCP setup verified successfully"
    return 0
}

# Function to create startup script
create_startup_script() {
    log "Creating startup script..."
    
    cat > "$PROJECT_ROOT/scripts/mcp-startup.sh" << 'EOF'
#!/bin/bash
# MCP Startup Script - Run this when starting development

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Setting up MCP servers for development..."
./auto-setup-mcp.sh

echo "📊 MCP Status:"
./mcp-manager.sh status

echo "✅ MCP setup complete! You can now use Supabase MCP tools."
EOF
    
    chmod +x "$PROJECT_ROOT/scripts/mcp-startup.sh"
    log "✅ Startup script created at scripts/mcp-startup.sh"
}

# Main execution
main() {
    log "🚀 Starting MCP auto-setup..."
    
    # Step 1: Create configuration files
    create_mcp_config
    
    # Step 2: Add MCP server to Claude Code
    add_mcp_to_claude
    
    # Step 3: Verify setup
    if verify_mcp_setup; then
        log "✅ MCP auto-setup completed successfully!"
    else
        log "❌ MCP setup verification failed"
        exit 1
    fi
    
    # Step 4: Create startup script for convenience
    create_startup_script
    
    log "🎉 MCP is now configured to auto-load when Claude Code starts!"
    log "💡 Tip: Run 'scripts/mcp-startup.sh' anytime to ensure MCP is ready"
}

# Run main function
main "$@"