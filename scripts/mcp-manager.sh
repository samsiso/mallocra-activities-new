#!/bin/bash

# MCP Manager Script for Mallorca Activities Platform
# Manages Supabase MCP server processes

set -e

# Configuration
MCP_SERVER_NAME="supabase-mcp-server"
NPX_PATH="/opt/homebrew/bin/npx"
SUPABASE_MCP_PACKAGE="@supabase/mcp-server-supabase@latest"
ACCESS_TOKEN="sbp_0b12301cb9ef04c534aab1175757221efa3b2763"

# Environment variables
export SUPABASE_URL="https://tskawjnjmiltzoypdnsl.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA0MTA0MCwiZXhwIjoyMDY0NjE3MDQwfQ.HY91_ZAp7gpeI8B-2oRaV_-rKo1fhC_G601EPY-p0bI"

# Functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

check_mcp_processes() {
    log "Checking for existing MCP processes..."
    if pgrep -f "mcp-server-supabase" > /dev/null; then
        log "Found existing MCP processes:"
        pgrep -f "mcp-server-supabase" | xargs ps -p
        return 0
    else
        log "No existing MCP processes found"
        return 1
    fi
}

kill_mcp_processes() {
    log "Killing existing MCP processes..."
    pkill -f "mcp-server-supabase" || log "No processes to kill"
    pkill -f "npx.*supabase" || log "No NPX processes to kill"
    sleep 2
    log "MCP processes killed"
}

test_mcp_server() {
    log "Testing MCP server installation..."
    if ! command -v "$NPX_PATH" &> /dev/null; then
        log "ERROR: npx not found at $NPX_PATH"
        return 1
    fi
    
    log "NPX found at: $NPX_PATH"
    
    # Test server version
    VERSION=$($NPX_PATH -y $SUPABASE_MCP_PACKAGE --version 2>/dev/null || echo "unknown")
    log "Supabase MCP Server version: $VERSION"
    
    return 0
}

start_mcp_server() {
    log "Starting MCP server..."
    log "Command: $NPX_PATH -y $SUPABASE_MCP_PACKAGE --access-token $ACCESS_TOKEN"
    
    # Start server in background
    nohup $NPX_PATH -y $SUPABASE_MCP_PACKAGE --access-token $ACCESS_TOKEN > /tmp/mcp-server.log 2>&1 &
    MCP_PID=$!
    
    log "MCP server started with PID: $MCP_PID"
    sleep 3
    
    # Check if process is still running
    if kill -0 $MCP_PID 2>/dev/null; then
        log "MCP server is running successfully"
        return 0
    else
        log "ERROR: MCP server failed to start"
        log "Check logs at /tmp/mcp-server.log"
        return 1
    fi
}

show_status() {
    log "MCP Server Status:"
    echo "===================="
    
    if check_mcp_processes; then
        log "✅ MCP server is running"
    else
        log "❌ MCP server is not running"
    fi
    
    echo ""
    log "Configuration files:"
    for config_file in ".claude.json" ".cursor/mcp.json" ".mcp.json"; do
        if [ -f "$config_file" ]; then
            log "✅ $config_file exists"
        else
            log "❌ $config_file missing"
        fi
    done
    
    echo ""
    log "Environment variables:"
    if [ -n "$SUPABASE_URL" ]; then
        log "✅ SUPABASE_URL is set"
    else
        log "❌ SUPABASE_URL not set"
    fi
    
    if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        log "✅ SUPABASE_SERVICE_ROLE_KEY is set"
    else
        log "❌ SUPABASE_SERVICE_ROLE_KEY not set"
    fi
}

# Main script
case "${1:-status}" in
    "start")
        kill_mcp_processes
        test_mcp_server
        start_mcp_server
        ;;
    "stop")
        kill_mcp_processes
        ;;
    "restart")
        kill_mcp_processes
        test_mcp_server
        start_mcp_server
        ;;
    "status")
        show_status
        ;;
    "test")
        test_mcp_server
        ;;
    "logs")
        if [ -f /tmp/mcp-server.log ]; then
            tail -f /tmp/mcp-server.log
        else
            log "No log file found at /tmp/mcp-server.log"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|test|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the MCP server"
        echo "  stop    - Stop the MCP server"
        echo "  restart - Restart the MCP server"
        echo "  status  - Show MCP server status"
        echo "  test    - Test MCP server installation"
        echo "  logs    - Show MCP server logs"
        exit 1
        ;;
esac