#!/bin/bash

# Setup Claude Alias - Make claude command auto-load MCP servers
# This creates an alias that automatically loads MCP servers before running Claude

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_WRAPPER="$SCRIPT_DIR/claude-auto-mcp.sh"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Function to add alias to shell profile
add_claude_alias() {
    local shell_config=""
    
    # Detect shell and set appropriate config file
    if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
        shell_config="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
        shell_config="$HOME/.bashrc"
    else
        shell_config="$HOME/.profile"
    fi
    
    # Create the alias content
    local alias_content="
# Claude Auto-MCP Alias - Always loads MCP servers before running Claude
alias claude='$CLAUDE_WRAPPER'
"
    
    # Add alias if not already present
    if [ -f "$shell_config" ]; then
        if ! grep -q "claude-auto-mcp.sh" "$shell_config"; then
            echo "$alias_content" >> "$shell_config"
            log "✅ Added Claude auto-MCP alias to $shell_config"
            info "The 'claude' command will now auto-load MCP servers"
        else
            log "ℹ️  Claude auto-MCP alias already exists in $shell_config"
        fi
    else
        echo "$alias_content" > "$shell_config"
        log "✅ Created $shell_config with Claude auto-MCP alias"
    fi
    
    return 0
}

# Function to create a symlink approach (alternative method)
create_symlink_approach() {
    # Create a local bin directory
    mkdir -p "$HOME/.local/bin"
    
    # Copy the wrapper to local bin
    cp "$CLAUDE_WRAPPER" "$HOME/.local/bin/claude"
    chmod +x "$HOME/.local/bin/claude"
    
    # Add to PATH if not already there
    local shell_config=""
    if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
        shell_config="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
        shell_config="$HOME/.bashrc"
    else
        shell_config="$HOME/.profile"
    fi
    
    # Add PATH modification if needed
    if [ -f "$shell_config" ] && ! grep -q 'PATH.*\.local/bin' "$shell_config"; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$shell_config"
        log "✅ Added ~/.local/bin to PATH in $shell_config"
    fi
    
    log "✅ Created claude wrapper in ~/.local/bin/claude"
}

# Function to test the setup
test_setup() {
    log "🧪 Testing Claude auto-MCP setup..."
    
    # First reload MCP servers
    "$SCRIPT_DIR/global-mcp-manager.sh" load-all 2>/dev/null || true
    
    # Test if wrapper script works
    if [ -x "$CLAUDE_WRAPPER" ]; then
        log "✅ Claude wrapper script is executable"
    else
        warn "⚠️  Claude wrapper script not found or not executable"
        return 1
    fi
    
    # Test if MCP config exists
    if [ -f "$HOME/.config/claude-code/mcp-servers.json" ]; then
        log "✅ Global MCP configuration exists"
    else
        warn "⚠️  Global MCP configuration missing"
        return 1
    fi
    
    log "✅ Setup test completed successfully"
}

# Main execution
main() {
    log "🚀 Setting up Claude command to auto-load MCP servers..."
    
    info "This will make the 'claude' command automatically load MCP servers"
    info "You can choose between alias or symlink approach"
    
    echo ""
    echo "Choose setup method:"
    echo "1) Alias approach (recommended)"
    echo "2) Symlink approach (alternative)"
    echo "3) Both approaches"
    echo ""
    
    read -p "Enter choice (1-3) [default: 1]: " choice
    choice=${choice:-1}
    
    case $choice in
        1)
            log "Setting up alias approach..."
            add_claude_alias
            ;;
        2)
            log "Setting up symlink approach..."
            create_symlink_approach
            ;;
        3)
            log "Setting up both approaches..."
            add_claude_alias
            create_symlink_approach
            ;;
        *)
            log "Invalid choice, using alias approach..."
            add_claude_alias
            ;;
    esac
    
    echo ""
    test_setup
    
    echo ""
    log "✅ Claude auto-MCP setup complete!"
    echo ""
    echo "🎯 How to use:"
    echo "   1. Restart your terminal or run: source ~/.zshrc"
    echo "   2. Use 'claude' command normally - MCP servers will auto-load"
    echo "   3. Works with: claude, claude --dangerously-skip-permissions, etc."
    echo ""
    echo "🔧 To verify it's working:"
    echo "   claude mcp list    # Should show your MCP servers"
    echo ""
    echo "🚀 Now when you run 'claude', it will:"
    echo "   • Check for MCP servers"
    echo "   • Load them if missing"
    echo "   • Start Claude normally"
}

# Check if running interactively or with arguments
if [ $# -eq 0 ]; then
    main
else
    case "$1" in
        "alias")
            add_claude_alias
            ;;
        "symlink")
            create_symlink_approach
            ;;
        "test")
            test_setup
            ;;
        *)
            echo "Usage: $0 [alias|symlink|test]"
            echo ""
            echo "Commands:"
            echo "  alias   - Set up alias approach only"
            echo "  symlink - Set up symlink approach only"
            echo "  test    - Test the current setup"
            echo "  (no args) - Interactive setup"
            ;;
    esac
fi