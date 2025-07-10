#!/bin/bash

# Global MCP Manager for Multiple Supabase Projects
# Supports all Claude Code startup methods and multi-project configurations

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
GLOBAL_MCP_CONFIG_DIR="$HOME/.config/claude-code"
GLOBAL_MCP_CONFIG="$GLOBAL_MCP_CONFIG_DIR/mcp-servers.json"
PROJECTS_CONFIG="$GLOBAL_MCP_CONFIG_DIR/projects.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Initialize global MCP configuration
init_global_config() {
    log "Initializing global MCP configuration..."
    
    # Create directories
    mkdir -p "$GLOBAL_MCP_CONFIG_DIR"
    
    # Create base MCP servers config if it doesn't exist
    if [ ! -f "$GLOBAL_MCP_CONFIG" ]; then
        cat > "$GLOBAL_MCP_CONFIG" << 'EOF'
{
  "mcpServers": {}
}
EOF
        log "Created global MCP configuration at $GLOBAL_MCP_CONFIG"
    fi
    
    # Create projects config if it doesn't exist
    if [ ! -f "$PROJECTS_CONFIG" ]; then
        cat > "$PROJECTS_CONFIG" << 'EOF'
{
  "projects": {}
}
EOF
        log "Created projects configuration at $PROJECTS_CONFIG"
    fi
}

# Add a new Supabase project
add_project() {
    local project_name="$1"
    local supabase_url="$2"
    local anon_key="$3"
    local service_key="$4"
    
    if [ -z "$project_name" ] || [ -z "$supabase_url" ] || [ -z "$anon_key" ] || [ -z "$service_key" ]; then
        error "Usage: $0 add-project <name> <supabase_url> <anon_key> <service_key>"
        return 1
    fi
    
    log "Adding project: $project_name"
    
    # Add project to projects config
    cat > "/tmp/projects_update.json" << EOF
{
  "projects": {
    "$project_name": {
      "supabase_url": "$supabase_url",
      "anon_key": "$anon_key",
      "service_key": "$service_key",
      "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    }
  }
}
EOF
    
    # Merge with existing projects
    if command -v jq &> /dev/null; then
        jq -s '.[0].projects * .[1].projects | {projects: .}' "$PROJECTS_CONFIG" "/tmp/projects_update.json" > "/tmp/projects_merged.json"
        mv "/tmp/projects_merged.json" "$PROJECTS_CONFIG"
    else
        # Fallback without jq
        cp "/tmp/projects_update.json" "$PROJECTS_CONFIG"
        warn "jq not found, only one project will be stored. Install jq for multi-project support."
    fi
    
    # Add MCP server configuration
    local mcp_server_name="supabase-$project_name"
    
    cat > "/tmp/mcp_server.json" << EOF
{
  "mcpServers": {
    "$mcp_server_name": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--url",
        "$supabase_url",
        "--anon-key",
        "$anon_key",
        "--service-role-key",
        "$service_key"
      ]
    }
  }
}
EOF
    
    # Merge with existing MCP servers
    if command -v jq &> /dev/null; then
        jq -s '.[0].mcpServers * .[1].mcpServers | {mcpServers: .}' "$GLOBAL_MCP_CONFIG" "/tmp/mcp_server.json" > "/tmp/mcp_merged.json"
        mv "/tmp/mcp_merged.json" "$GLOBAL_MCP_CONFIG"
    else
        # Fallback without jq
        cp "/tmp/mcp_server.json" "$GLOBAL_MCP_CONFIG"
        warn "jq not found, only one MCP server will be stored. Install jq for multi-project support."
    fi
    
    # Register with Claude Code
    claude mcp add "$mcp_server_name" "{
        \"command\": \"npx\",
        \"args\": [
            \"-y\",
            \"@supabase/mcp-server-supabase@latest\",
            \"--url\",
            \"$supabase_url\",
            \"--anon-key\",
            \"$anon_key\",
            \"--service-role-key\",
            \"$service_key\"
        ]
    }" 2>/dev/null || warn "Failed to register with Claude Code (this is normal if Claude is not running)"
    
    # Clean up temp files
    rm -f "/tmp/projects_update.json" "/tmp/mcp_server.json" "/tmp/mcp_merged.json" "/tmp/projects_merged.json"
    
    log "✅ Project '$project_name' added successfully!"
    log "MCP server name: $mcp_server_name"
}

# Set up global MCP configuration for all Claude startup methods
setup_global_mcp() {
    log "Setting up global MCP configuration for all Claude startup methods..."
    
    # Create global Claude config directory
    mkdir -p "$HOME/.config/claude-code"
    
    # Copy global MCP config to Claude config directory
    cp "$GLOBAL_MCP_CONFIG" "$HOME/.config/claude-code/mcp-servers.json"
    
    # Create startup script that Claude can source
    cat > "$HOME/.config/claude-code/startup.sh" << 'EOF'
#!/bin/bash
# Claude Code MCP Startup Script
# This script is sourced by Claude Code on startup

GLOBAL_MCP_CONFIG_DIR="$HOME/.config/claude-code"
GLOBAL_MCP_CONFIG="$GLOBAL_MCP_CONFIG_DIR/mcp-servers.json"

if [ -f "$GLOBAL_MCP_CONFIG" ]; then
    export CLAUDE_MCP_CONFIG_FILE="$GLOBAL_MCP_CONFIG"
fi
EOF
    
    chmod +x "$HOME/.config/claude-code/startup.sh"
    
    # Set Claude Code to use the global MCP config
    claude config set -g mcpConfigFile "$GLOBAL_MCP_CONFIG" 2>/dev/null || true
    
    # Create project-specific configs for compatibility
    create_project_configs
    
    log "✅ Global MCP configuration set up successfully!"
}

# Create project-specific configs for compatibility
create_project_configs() {
    log "Creating project-specific MCP configurations..."
    
    # Create configs in current project
    cp "$GLOBAL_MCP_CONFIG" "$PROJECT_ROOT/.claude.json"
    
    # Create .cursor directory if it doesn't exist
    mkdir -p "$PROJECT_ROOT/.cursor"
    cp "$GLOBAL_MCP_CONFIG" "$PROJECT_ROOT/.cursor/mcp.json"
    
    # Create .mcp.json for additional compatibility
    cp "$GLOBAL_MCP_CONFIG" "$PROJECT_ROOT/.mcp.json"
    
    log "✅ Project-specific configurations created"
}

# Load all MCP servers from global config
load_all_mcp_servers() {
    log "Loading all MCP servers from global configuration..."
    
    if [ ! -f "$GLOBAL_MCP_CONFIG" ]; then
        error "Global MCP configuration not found. Run 'init' first."
        return 1
    fi
    
    # Clear existing MCP servers
    claude mcp list 2>/dev/null | grep -E "^[a-zA-Z]" | while read -r server_name _; do
        claude mcp remove "$server_name" 2>/dev/null || true
    done
    
    # Load servers from global config
    if command -v jq &> /dev/null; then
        jq -r '.mcpServers | keys[]' "$GLOBAL_MCP_CONFIG" | while read -r server_name; do
            server_config=$(jq -c ".mcpServers[\"$server_name\"]" "$GLOBAL_MCP_CONFIG")
            log "Loading MCP server: $server_name"
            claude mcp add "$server_name" "$server_config" 2>/dev/null || warn "Failed to load $server_name"
        done
    else
        warn "jq not found. Please install jq for full functionality."
    fi
    
    log "✅ All MCP servers loaded successfully!"
}

# List all projects
list_projects() {
    log "Configured Projects:"
    echo "===================="
    
    if [ -f "$PROJECTS_CONFIG" ]; then
        if command -v jq &> /dev/null; then
            jq -r '.projects | keys[]' "$PROJECTS_CONFIG" | while read -r project_name; do
                url=$(jq -r ".projects[\"$project_name\"].supabase_url" "$PROJECTS_CONFIG")
                created=$(jq -r ".projects[\"$project_name\"].created_at" "$PROJECTS_CONFIG")
                echo "  📊 $project_name"
                echo "     URL: $url"
                echo "     Created: $created"
                echo "     MCP Server: supabase-$project_name"
                echo ""
            done
        else
            cat "$PROJECTS_CONFIG" | sed 's/^/  /'
        fi
    else
        echo "  No projects configured yet."
    fi
}

# List all MCP servers
list_mcp_servers() {
    log "Configured MCP Servers:"
    echo "======================="
    
    if [ -f "$GLOBAL_MCP_CONFIG" ]; then
        if command -v jq &> /dev/null; then
            jq -r '.mcpServers | keys[]' "$GLOBAL_MCP_CONFIG" | while read -r server_name; do
                echo "  🚀 $server_name"
                jq -r ".mcpServers[\"$server_name\"] | \"     Command: \" + .command + \" \" + (.args | join(\" \"))" "$GLOBAL_MCP_CONFIG" | head -c 100
                echo "..."
                echo ""
            done
        else
            cat "$GLOBAL_MCP_CONFIG" | sed 's/^/  /'
        fi
    else
        echo "  No MCP servers configured yet."
    fi
}

# Remove a project
remove_project() {
    local project_name="$1"
    
    if [ -z "$project_name" ]; then
        error "Usage: $0 remove-project <name>"
        return 1
    fi
    
    log "Removing project: $project_name"
    
    # Remove from projects config
    if command -v jq &> /dev/null; then
        jq "del(.projects[\"$project_name\"])" "$PROJECTS_CONFIG" > "/tmp/projects_updated.json"
        mv "/tmp/projects_updated.json" "$PROJECTS_CONFIG"
    fi
    
    # Remove MCP server
    local mcp_server_name="supabase-$project_name"
    if command -v jq &> /dev/null; then
        jq "del(.mcpServers[\"$mcp_server_name\"])" "$GLOBAL_MCP_CONFIG" > "/tmp/mcp_updated.json"
        mv "/tmp/mcp_updated.json" "$GLOBAL_MCP_CONFIG"
    fi
    
    # Remove from Claude Code
    claude mcp remove "$mcp_server_name" 2>/dev/null || true
    
    log "✅ Project '$project_name' removed successfully!"
}

# Auto-detect and add current project
auto_add_current_project() {
    local project_name="${1:-$(basename "$PROJECT_ROOT")}"
    
    log "Auto-detecting project configuration for: $project_name"
    
    # Check for .env.local file
    if [ -f "$PROJECT_ROOT/.env.local" ]; then
        source "$PROJECT_ROOT/.env.local"
        
        local supabase_url="${NEXT_PUBLIC_SUPABASE_URL:-$SUPABASE_URL}"
        local anon_key="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-$SUPABASE_ANON_KEY}"
        local service_key="${SUPABASE_SERVICE_ROLE_KEY:-$SUPABASE_SERVICE_KEY}"
        
        if [ -n "$supabase_url" ] && [ -n "$anon_key" ] && [ -n "$service_key" ]; then
            log "Found Supabase configuration in .env.local"
            add_project "$project_name" "$supabase_url" "$anon_key" "$service_key"
        else
            error "Incomplete Supabase configuration in .env.local"
            error "Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
        fi
    else
        error "No .env.local file found in project root"
    fi
}

# Show help
show_help() {
    cat << EOF
Global MCP Manager for Multiple Supabase Projects

Usage: $0 <command> [options]

Commands:
  init                                    Initialize global MCP configuration
  add-project <name> <url> <anon> <key>   Add a new Supabase project
  remove-project <name>                   Remove a project
  auto-add [name]                         Auto-detect and add current project
  list-projects                           List all configured projects
  list-servers                            List all MCP servers
  setup-global                            Set up global MCP for all Claude methods
  load-all                                Load all MCP servers into Claude
  status                                  Show configuration status

Examples:
  $0 init
  $0 auto-add mallorca-activities
  $0 add-project "my-app" "https://xyz.supabase.co" "anon_key" "service_key"
  $0 setup-global
  $0 list-projects

Global Configuration:
  Config Directory: $GLOBAL_MCP_CONFIG_DIR
  MCP Servers: $GLOBAL_MCP_CONFIG
  Projects: $PROJECTS_CONFIG

This script ensures MCP servers work with:
  - claude
  - claude --dangerously-skip-permissions
  - claude --mcp-config <file>
  - Any other Claude startup method
EOF
}

# Show status
show_status() {
    log "Global MCP Configuration Status"
    echo "==============================="
    
    echo "📁 Configuration Directory: $GLOBAL_MCP_CONFIG_DIR"
    if [ -d "$GLOBAL_MCP_CONFIG_DIR" ]; then
        echo "   ✅ Exists"
    else
        echo "   ❌ Not found"
    fi
    
    echo "📄 MCP Servers Config: $GLOBAL_MCP_CONFIG"
    if [ -f "$GLOBAL_MCP_CONFIG" ]; then
        echo "   ✅ Exists"
        if command -v jq &> /dev/null; then
            server_count=$(jq '.mcpServers | length' "$GLOBAL_MCP_CONFIG")
            echo "   📊 Configured servers: $server_count"
        fi
    else
        echo "   ❌ Not found"
    fi
    
    echo "📄 Projects Config: $PROJECTS_CONFIG"
    if [ -f "$PROJECTS_CONFIG" ]; then
        echo "   ✅ Exists"
        if command -v jq &> /dev/null; then
            project_count=$(jq '.projects | length' "$PROJECTS_CONFIG")
            echo "   📊 Configured projects: $project_count"
        fi
    else
        echo "   ❌ Not found"
    fi
    
    echo "🔧 Claude Code MCP Status:"
    if claude mcp list &>/dev/null; then
        echo "   ✅ Claude Code accessible"
        server_count=$(claude mcp list 2>/dev/null | grep -c "^[a-zA-Z]" || echo "0")
        echo "   📊 Active MCP servers: $server_count"
    else
        echo "   ❌ Claude Code not accessible"
    fi
    
    echo "🔨 Dependencies:"
    if command -v jq &> /dev/null; then
        echo "   ✅ jq available"
    else
        echo "   ⚠️  jq not found (install for full functionality)"
    fi
}

# Main execution
main() {
    case "${1:-help}" in
        "init")
            init_global_config
            ;;
        "add-project")
            shift
            add_project "$@"
            ;;
        "remove-project")
            shift
            remove_project "$@"
            ;;
        "auto-add")
            shift
            auto_add_current_project "$@"
            ;;
        "list-projects")
            list_projects
            ;;
        "list-servers")
            list_mcp_servers
            ;;
        "setup-global")
            setup_global_mcp
            ;;
        "load-all")
            load_all_mcp_servers
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"