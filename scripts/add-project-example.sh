#!/bin/bash

# Example script for adding multiple Supabase projects
# Customize this script with your actual project details

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[Add Projects]${NC} $1"
}

info() {
    echo -e "${BLUE}[Info]${NC} $1"
}

main() {
    log "🚀 Adding example Supabase projects..."
    
    # Example: Production project
    info "Adding production project..."
    "$SCRIPT_DIR/global-mcp-manager.sh" add-project \
        "my-app-prod" \
        "https://your-prod-id.supabase.co" \
        "your_production_anon_key" \
        "your_production_service_key"
    
    # Example: Staging project
    info "Adding staging project..."
    "$SCRIPT_DIR/global-mcp-manager.sh" add-project \
        "my-app-staging" \
        "https://your-staging-id.supabase.co" \
        "your_staging_anon_key" \
        "your_staging_service_key"
    
    # Example: Development project
    info "Adding development project..."
    "$SCRIPT_DIR/global-mcp-manager.sh" add-project \
        "my-app-dev" \
        "https://your-dev-id.supabase.co" \
        "your_dev_anon_key" \
        "your_dev_service_key"
    
    log "✅ Example projects added!"
    
    # Show all projects
    info "Current projects:"
    "$SCRIPT_DIR/global-mcp-manager.sh" list-projects
    
    echo ""
    echo "🎉 All projects configured! Available MCP servers:"
    echo "   • supabase-my-app-prod"
    echo "   • supabase-my-app-staging"
    echo "   • supabase-my-app-dev"
    echo "   • supabase-mallorca-activities"
    echo ""
    echo "🔄 To use different projects, the MCP tools will be named:"
    echo "   • mcp__supabase__* (for all projects)"
    echo ""
    echo "📋 Manage projects with:"
    echo "   • ./scripts/global-mcp-manager.sh list-projects"
    echo "   • ./scripts/global-mcp-manager.sh remove-project <name>"
    echo "   • ./scripts/global-mcp-manager.sh add-project <name> <url> <anon> <service>"
}

# Show usage if no arguments
if [ $# -eq 0 ]; then
    cat << EOF
Example Project Setup Script

This script shows how to add multiple Supabase projects.

IMPORTANT: Edit this script with your actual project details before running!

To add a real project:
  ./scripts/global-mcp-manager.sh add-project "my-project" "https://xyz.supabase.co" "anon_key" "service_key"

To run this example (will fail with dummy data):
  ./scripts/add-project-example.sh run

EOF
    exit 0
fi

if [ "$1" = "run" ]; then
    main
else
    echo "Use '$0 run' to execute the example (will fail with dummy data)"
    echo "Edit the script with real project details first!"
fi