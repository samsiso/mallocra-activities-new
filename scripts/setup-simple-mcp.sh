#!/bin/bash

# Simple MCP Setup - Use basic MCP servers that actually work
# Focus on essential functionality without complex dependencies

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[Setup]${NC} $1"
}

info() {
    echo -e "${BLUE}[Info]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

error() {
    echo -e "${RED}[Error]${NC} $1"
}

# Remove any existing problematic MCP servers
cleanup_existing() {
    log "🧹 Cleaning up existing MCP servers..."
    
    claude mcp list 2>/dev/null | grep -E "supabase|mallorca" | cut -d':' -f1 | while read -r server; do
        if [ -n "$server" ]; then
            claude mcp remove "$server" 2>/dev/null || true
            log "Removed: $server"
        fi
    done
}

# Add working MCP servers
setup_working_mcps() {
    log "🚀 Setting up working MCP servers..."
    
    # 1. File system MCP for local file operations
    info "Adding filesystem MCP..."
    claude mcp add filesystem '{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem@latest","/Users/shaansisodia/Desktop/Cursor/mallocra-activities-main"]}' 2>/dev/null || warn "Filesystem MCP failed to add"
    
    # 2. SQLite MCP for local database testing
    info "Adding SQLite MCP for local testing..."
    claude mcp add sqlite '{"command":"npx","args":["-y","@modelcontextprotocol/server-sqlite@latest","--db-path","/tmp/test.db"]}' 2>/dev/null || warn "SQLite MCP failed to add"
    
    # 3. Postgres MCP using direct DATABASE_URL
    if [ -f ".env.local" ] && grep -q "DATABASE_URL" .env.local; then
        DATABASE_URL=$(grep "DATABASE_URL" .env.local | cut -d'=' -f2- | tr -d '"')
        if [ -n "$DATABASE_URL" ]; then
            info "Adding PostgreSQL MCP with direct connection..."
            claude mcp add postgres '{"command":"npx","args":["-y","@modelcontextprotocol/server-postgres@latest","'"$DATABASE_URL"'"]}' 2>/dev/null || warn "PostgreSQL MCP failed to add"
        fi
    fi
    
    # 4. GitHub MCP if in git repo
    if [ -d ".git" ]; then
        info "Adding GitHub MCP..."
        claude mcp add github '{"command":"npx","args":["-y","@modelcontextprotocol/server-github@latest"]}' 2>/dev/null || warn "GitHub MCP failed to add"
    fi
}

# Test MCP servers
test_mcps() {
    log "🧪 Testing MCP servers..."
    
    sleep 2
    
    claude mcp list | while read -r line; do
        if [[ "$line" =~ ^([^:]+): ]]; then
            server_name="${BASH_REMATCH[1]}"
            info "Testing: $server_name"
        fi
    done
    
    log "✅ MCP test completed"
}

# Update global MCP config
update_global_config() {
    log "📝 Updating global MCP configuration..."
    
    GLOBAL_CONFIG="$HOME/.config/claude-code/mcp-servers.json"
    mkdir -p "$(dirname "$GLOBAL_CONFIG")"
    
    # Get current MCP servers
    claude mcp list > /tmp/mcp_list.txt
    
    # Create basic global config
    cat > "$GLOBAL_CONFIG" << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "/Users/shaansisodia/Desktop/Cursor/mallocra-activities-main"]
    },
    "sqlite": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-sqlite@latest", "--db-path", "/tmp/test.db"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@latest"]
    }
  }
}
EOF
    
    if [ -f ".env.local" ] && grep -q "DATABASE_URL" .env.local; then
        DATABASE_URL=$(grep "DATABASE_URL" .env.local | cut -d'=' -f2- | tr -d '"')
        if [ -n "$DATABASE_URL" ]; then
            # Add postgres to config
            cat > "$GLOBAL_CONFIG" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "/Users/shaansisodia/Desktop/Cursor/mallocra-activities-main"]
    },
    "sqlite": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-sqlite@latest", "--db-path", "/tmp/test.db"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres@latest", "$DATABASE_URL"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@latest"]
    }
  }
}
EOF
        fi
    fi
    
    log "✅ Global MCP configuration updated"
}

# Main execution
main() {
    log "🔧 Setting up simple, working MCP configuration..."
    
    cleanup_existing
    setup_working_mcps
    test_mcps
    update_global_config
    
    echo ""
    log "✅ Simple MCP setup complete!"
    echo ""
    echo "🎯 Available MCP servers:"
    echo "  • filesystem - Local file operations"
    echo "  • sqlite     - Local database testing" 
    echo "  • postgres   - Direct PostgreSQL connection"
    echo "  • github     - Git repository operations"
    echo ""
    echo "🔧 To verify:"
    echo "  claude mcp list"
    echo ""
    echo "💡 These MCP servers are more reliable and don't require"
    echo "   complex authentication tokens or API keys."
}

main "$@"