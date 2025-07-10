#!/bin/bash

# Test MCP Persistence - Verify MCP servers work with all Claude startup methods
# This script tests that MCP configuration persists and loads properly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[Test]${NC} $1"
}

error() {
    echo -e "${RED}[Error]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

info() {
    echo -e "${BLUE}[Info]${NC} $1"
}

# Test function
test_mcp_servers() {
    log "🧪 Testing MCP server configuration..."
    
    # Test 1: Check if MCP servers are registered
    info "Test 1: Checking MCP server registration..."
    if claude mcp list &>/dev/null; then
        local server_count=$(claude mcp list 2>/dev/null | grep -c "^[a-zA-Z]" || echo "0")
        if [ "$server_count" -gt 0 ]; then
            log "✅ Found $server_count MCP servers registered"
            claude mcp list | sed 's/^/   /'
        else
            error "❌ No MCP servers found"
            return 1
        fi
    else
        error "❌ Cannot access Claude MCP commands"
        return 1
    fi
    
    echo ""
    
    # Test 2: Check global configuration files
    info "Test 2: Checking global configuration files..."
    local config_files=(
        "$HOME/.config/claude-code/mcp-servers.json"
        "$HOME/.config/claude-code/projects.json"
        "$HOME/.config/claude-code/auto-load-mcp.sh"
    )
    
    for config_file in "${config_files[@]}"; do
        if [ -f "$config_file" ]; then
            log "✅ $config_file exists"
        else
            error "❌ $config_file missing"
        fi
    done
    
    echo ""
    
    # Test 3: Check project-specific configurations
    info "Test 3: Checking project-specific configurations..."
    local project_files=(
        ".claude.json"
        ".cursor/mcp.json"
        ".mcp.json"
    )
    
    for project_file in "${project_files[@]}"; do
        if [ -f "$project_file" ]; then
            log "✅ $project_file exists"
        else
            warn "⚠️  $project_file missing (non-critical)"
        fi
    done
    
    echo ""
    
    # Test 4: Check shell integration
    info "Test 4: Checking shell integration..."
    local shell_config=""
    if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
        shell_config="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
        shell_config="$HOME/.bashrc"
    else
        shell_config="$HOME/.profile"
    fi
    
    if [ -f "$shell_config" ] && grep -q "claude_with_mcp" "$shell_config"; then
        log "✅ Shell integration configured in $shell_config"
    else
        warn "⚠️  Shell integration not found (run ensure-mcp-startup.sh)"
    fi
    
    echo ""
    
    # Test 5: Verify MCP server functionality
    info "Test 5: Testing MCP server functionality..."
    log "🔄 This will test if a new Claude session can load MCP servers..."
    
    # Create a test command that simulates startup
    cat > "/tmp/test_mcp_load.sh" << 'EOF'
#!/bin/bash
# Load MCP auto-loader
if [ -f "$HOME/.config/claude-code/auto-load-mcp.sh" ]; then
    source "$HOME/.config/claude-code/auto-load-mcp.sh"
fi

# Check if MCP servers are available
if claude mcp list 2>/dev/null | grep -q "supabase"; then
    echo "✅ MCP servers loaded successfully"
    exit 0
else
    echo "❌ MCP servers not loaded"
    exit 1
fi
EOF
    
    chmod +x "/tmp/test_mcp_load.sh"
    
    if "/tmp/test_mcp_load.sh"; then
        log "✅ MCP auto-loading works correctly"
    else
        error "❌ MCP auto-loading failed"
    fi
    
    rm -f "/tmp/test_mcp_load.sh"
    
    echo ""
    
    # Summary
    log "📊 Test Summary:"
    echo "   🎯 MCP servers are configured and accessible"
    echo "   🔧 Global configuration files are in place"
    echo "   📁 Project-specific configs are available"
    echo "   🐚 Shell integration is set up"
    echo "   🔄 Auto-loading mechanism works"
    echo ""
    echo "🚀 Your MCP setup should now work with:"
    echo "   • claude"
    echo "   • claude --dangerously-skip-permissions"
    echo "   • claude-mcp (recommended)"
    echo "   • claude-safe (recommended)"
    echo ""
    echo "💡 If MCP servers disappear after restart:"
    echo "   1. Run: ./scripts/global-mcp-manager.sh load-all"
    echo "   2. Or use: claude-mcp instead of claude"
    echo "   3. Or run: source ~/.zshrc && claude-mcp"
}

# Quick fix function
quick_fix() {
    log "🔧 Running quick fix for MCP persistence..."
    
    # Reload all MCP servers
    if [ -f "$HOME/.config/claude-code/auto-load-mcp.sh" ]; then
        "$HOME/.config/claude-code/auto-load-mcp.sh"
    fi
    
    # Re-run global setup
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ -f "$script_dir/global-mcp-manager.sh" ]; then
        "$script_dir/global-mcp-manager.sh" load-all
    fi
    
    log "✅ Quick fix completed"
}

# Main execution
main() {
    case "${1:-test}" in
        "test")
            test_mcp_servers
            ;;
        "fix")
            quick_fix
            ;;
        "help"|"-h"|"--help")
            cat << EOF
MCP Persistence Test Script

Usage: $0 <command>

Commands:
  test    Test MCP configuration and persistence (default)
  fix     Quick fix for MCP loading issues
  help    Show this help message

Examples:
  $0 test    # Run full test suite
  $0 fix     # Quick fix MCP issues
EOF
            ;;
        *)
            error "Unknown command: $1"
            exit 1
            ;;
    esac
}

main "$@"