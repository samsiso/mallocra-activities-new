#!/bin/bash

# Quick MCP Setup - One-command setup for all Claude startup methods
# Usage: ./quick-mcp-setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[Quick Setup]${NC} $1"
}

info() {
    echo -e "${BLUE}[Info]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

main() {
    log "🚀 Starting Quick MCP Setup for All Claude Methods..."
    
    # Step 1: Initialize global configuration
    info "Step 1: Initializing global MCP configuration..."
    "$SCRIPT_DIR/global-mcp-manager.sh" init
    
    # Step 2: Auto-add current project
    info "Step 2: Auto-detecting current project..."
    "$SCRIPT_DIR/global-mcp-manager.sh" auto-add
    
    # Step 3: Set up global configuration
    info "Step 3: Setting up global MCP configuration..."
    "$SCRIPT_DIR/global-mcp-manager.sh" setup-global
    
    # Step 4: Load all MCP servers
    info "Step 4: Loading all MCP servers..."
    "$SCRIPT_DIR/global-mcp-manager.sh" load-all
    
    # Step 5: Set up shell aliases
    info "Step 5: Setting up shell aliases..."
    "$SCRIPT_DIR/claude-startup-wrapper.sh" --help > /dev/null 2>&1 || true
    
    # Step 6: Show status
    info "Step 6: Checking configuration status..."
    "$SCRIPT_DIR/global-mcp-manager.sh" status
    
    log "✅ Quick MCP Setup Complete!"
    echo ""
    echo "🎉 Your MCP servers are now configured to work with:"
    echo "   • claude"
    echo "   • claude --dangerously-skip-permissions"
    echo "   • claude --mcp-config <file>"
    echo "   • Any other Claude startup method"
    echo ""
    echo "📋 Available Commands:"
    echo "   • ./scripts/global-mcp-manager.sh list-projects"
    echo "   • ./scripts/global-mcp-manager.sh add-project <name> <url> <anon> <service>"
    echo "   • ./scripts/global-mcp-manager.sh status"
    echo ""
    echo "🔄 To add more projects:"
    echo "   ./scripts/global-mcp-manager.sh add-project \"my-new-project\" \"https://xyz.supabase.co\" \"anon_key\" \"service_key\""
    echo ""
    echo "🚀 Ready to use! Restart Claude Code to see the MCP tools."
}

main "$@"