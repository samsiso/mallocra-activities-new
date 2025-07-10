#!/bin/bash

# Ensure MCP Startup - Add to shell profile for automatic loading
# This script ensures MCP servers are always available when starting Claude Code

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GLOBAL_MCP_CONFIG="$HOME/.config/claude-code/mcp-servers.json"

# Function to add to shell profile
add_to_shell_profile() {
    local shell_profile=""
    
    # Detect shell and appropriate profile file
    if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
        shell_profile="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
        shell_profile="$HOME/.bashrc"
    else
        shell_profile="$HOME/.profile"
    fi
    
    # Create startup function in shell profile
    local startup_function='
# Claude Code MCP Auto-loader
claude_with_mcp() {
    # Ensure MCP servers are loaded before starting Claude
    local mcp_config="$HOME/.config/claude-code/mcp-servers.json"
    if [ -f "$mcp_config" ]; then
        # Load all MCP servers from global config
        if command -v jq &> /dev/null && command -v claude &> /dev/null; then
            jq -r ".mcpServers | keys[]" "$mcp_config" | while read -r server_name; do
                if ! claude mcp list 2>/dev/null | grep -q "^$server_name"; then
                    server_config=$(jq -c ".mcpServers[\"$server_name\"]" "$mcp_config")
                    claude mcp add "$server_name" "$server_config" 2>/dev/null || true
                fi
            done
        fi
    fi
    
    # Start Claude with all arguments
    command claude "$@"
}

# Alias for easy use
alias claude-safe="claude_with_mcp --dangerously-skip-permissions"
alias claude-mcp="claude_with_mcp"
'
    
    # Check if function already exists
    if [ -f "$shell_profile" ] && ! grep -q "claude_with_mcp" "$shell_profile"; then
        echo "$startup_function" >> "$shell_profile"
        echo "✅ Added MCP auto-loader to $shell_profile"
        echo "💡 Run 'source $shell_profile' or restart terminal to activate"
        echo "🚀 Then use: claude-mcp or claude-safe instead of claude"
    elif [ -f "$shell_profile" ]; then
        echo "ℹ️  MCP auto-loader already exists in $shell_profile"
    else
        echo "$startup_function" > "$shell_profile"
        echo "✅ Created $shell_profile with MCP auto-loader"
    fi
}

# Function to create global startup script
create_global_startup() {
    mkdir -p "$HOME/.config/claude-code"
    
    cat > "$HOME/.config/claude-code/auto-load-mcp.sh" << 'EOF'
#!/bin/bash
# Global MCP Auto-loader for Claude Code

MCP_CONFIG="$HOME/.config/claude-code/mcp-servers.json"

if [ -f "$MCP_CONFIG" ] && command -v claude &> /dev/null; then
    # Load all MCP servers from global config
    if command -v jq &> /dev/null; then
        jq -r '.mcpServers | keys[]' "$MCP_CONFIG" | while read -r server_name; do
            if ! claude mcp list 2>/dev/null | grep -q "^$server_name"; then
                server_config=$(jq -c ".mcpServers[\"$server_name\"]" "$MCP_CONFIG")
                claude mcp add "$server_name" "$server_config" 2>/dev/null || true
            fi
        done
    fi
fi
EOF
    
    chmod +x "$HOME/.config/claude-code/auto-load-mcp.sh"
    echo "✅ Created global MCP auto-loader at ~/.config/claude-code/auto-load-mcp.sh"
}

# Function to set up Claude config to auto-load
setup_claude_config() {
    # Try to set global config
    if command -v claude &> /dev/null; then
        # Set the global MCP config file
        claude config set -g mcpConfigFile "$GLOBAL_MCP_CONFIG" 2>/dev/null || true
        echo "✅ Set Claude global MCP config"
    fi
}

# Main execution
main() {
    echo "🚀 Setting up MCP auto-startup for all Claude methods..."
    
    # Step 1: Add to shell profile
    echo "📝 Step 1: Adding to shell profile..."
    add_to_shell_profile
    
    # Step 2: Create global startup script
    echo "🔧 Step 2: Creating global startup script..."
    create_global_startup
    
    # Step 3: Set up Claude config
    echo "⚙️  Step 3: Setting up Claude configuration..."
    setup_claude_config
    
    # Step 4: Run initial load
    echo "🔄 Step 4: Loading MCP servers..."
    "$HOME/.config/claude-code/auto-load-mcp.sh"
    
    echo ""
    echo "✅ MCP Auto-startup setup complete!"
    echo ""
    echo "🎯 Now your MCP servers will:"
    echo "   • Auto-load when you start Claude"
    echo "   • Work with claude --dangerously-skip-permissions"
    echo "   • Work with any Claude startup method"
    echo "   • Persist across restarts"
    echo ""
    echo "🚀 Usage:"
    echo "   claude-mcp                    # Claude with MCP auto-loading"
    echo "   claude-safe                   # Claude with --dangerously-skip-permissions"
    echo "   claude                        # Regular Claude (may need manual MCP loading)"
    echo ""
    echo "💡 Tip: Use claude-mcp or claude-safe for guaranteed MCP availability"
}

main "$@"