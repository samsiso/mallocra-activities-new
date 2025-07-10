#!/bin/bash

# Claude Startup Wrapper - Ensures MCP servers are loaded with any Claude startup method
# This script wraps the claude command to auto-load MCP configurations

set -e

# Configuration
GLOBAL_MCP_CONFIG_DIR="$HOME/.config/claude-code"
GLOBAL_MCP_CONFIG="$GLOBAL_MCP_CONFIG_DIR/mcp-servers.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[MCP Wrapper]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[MCP Wrapper]${NC} $1"
}

# Function to ensure MCP servers are loaded
ensure_mcp_loaded() {
    if [ -f "$GLOBAL_MCP_CONFIG" ]; then
        log "Loading MCP servers from global configuration..."
        
        # Load servers if jq is available
        if command -v jq &> /dev/null; then
            jq -r '.mcpServers | keys[]' "$GLOBAL_MCP_CONFIG" | while read -r server_name; do
                # Check if server is already loaded
                if ! claude mcp list 2>/dev/null | grep -q "^$server_name"; then
                    server_config=$(jq -c ".mcpServers[\"$server_name\"]" "$GLOBAL_MCP_CONFIG")
                    claude mcp add "$server_name" "$server_config" 2>/dev/null || warn "Failed to load $server_name"
                fi
            done
        fi
    else
        warn "No global MCP configuration found at $GLOBAL_MCP_CONFIG"
    fi
}

# Function to create a startup script that Claude can use
create_startup_profile() {
    cat > "$HOME/.claude-startup" << 'EOF'
#!/bin/bash
# Claude Code Startup Profile

# Load MCP servers if global config exists
GLOBAL_MCP_CONFIG="$HOME/.config/claude-code/mcp-servers.json"
if [ -f "$GLOBAL_MCP_CONFIG" ]; then
    export CLAUDE_MCP_CONFIG_FILE="$GLOBAL_MCP_CONFIG"
fi

# Load project-specific MCP config if available
if [ -f ".claude.json" ]; then
    export CLAUDE_LOCAL_MCP_CONFIG=".claude.json"
fi
EOF
    chmod +x "$HOME/.claude-startup"
}

# Function to set up shell aliases
setup_shell_aliases() {
    local shell_config=""
    
    # Detect shell and set appropriate config file
    if [ -n "$ZSH_VERSION" ]; then
        shell_config="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        shell_config="$HOME/.bashrc"
    else
        shell_config="$HOME/.profile"
    fi
    
    # Add alias if not already present
    if [ -f "$shell_config" ] && ! grep -q "claude-mcp-wrapper" "$shell_config"; then
        cat >> "$shell_config" << EOF

# Claude MCP Wrapper - Auto-loads MCP servers
alias claude-mcp='$SCRIPT_DIR/claude-startup-wrapper.sh'
alias claude-safe='$SCRIPT_DIR/claude-startup-wrapper.sh --dangerously-skip-permissions'
EOF
        log "Added Claude MCP aliases to $shell_config"
        warn "Run 'source $shell_config' or restart your terminal to use the new aliases"
    fi
}

# Main wrapper function
run_claude_with_mcp() {
    # Ensure MCP servers are loaded
    ensure_mcp_loaded
    
    # Create startup profile
    create_startup_profile
    
    # Check if we should use global MCP config
    local claude_args=("$@")
    local use_global_config=true
    
    # Check if user provided their own MCP config
    for arg in "$@"; do
        if [[ "$arg" == "--mcp-config" ]]; then
            use_global_config=false
            break
        fi
    done
    
    # Add global MCP config if not provided and file exists
    if [ "$use_global_config" = true ] && [ -f "$GLOBAL_MCP_CONFIG" ]; then
        claude_args+=("--mcp-config" "$GLOBAL_MCP_CONFIG")
    fi
    
    # Run Claude with the modified arguments
    log "Starting Claude Code with MCP servers..."
    exec claude "${claude_args[@]}"
}

# If script is called directly, run the wrapper
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    # Set up aliases on first run
    setup_shell_aliases
    
    # Run Claude with MCP
    run_claude_with_mcp "$@"
fi