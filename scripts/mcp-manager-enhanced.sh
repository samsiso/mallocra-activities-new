#!/bin/bash

# Enhanced MCP Manager Script with Reliability Improvements
# Manages MCP server processes with health monitoring and automatic recovery

set -euo pipefail

# Configuration
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly LOG_DIR="/tmp/mcp-logs"
readonly PID_DIR="/tmp/mcp-pids"
readonly CONFIG_FILE="${PROJECT_ROOT}/.cursor/mcp.json"
readonly HEALTH_CHECK_INTERVAL=30
readonly MAX_RESTART_ATTEMPTS=3
readonly RESTART_BACKOFF_BASE=2

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Ensure required directories exist
mkdir -p "$LOG_DIR" "$PID_DIR"

# Logging functions
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_DIR}/mcp-manager.log"
}

log_info() {
    log "INFO" "$@"
    echo -e "${BLUE}ℹ${NC} $*"
}

log_warn() {
    log "WARN" "$@"
    echo -e "${YELLOW}⚠${NC} $*"
}

log_error() {
    log "ERROR" "$@"
    echo -e "${RED}✗${NC} $*"
}

log_success() {
    log "SUCCESS" "$@"
    echo -e "${GREEN}✓${NC} $*"
}

# Configuration validation
validate_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration file not found: $CONFIG_FILE"
        return 1
    fi

    # JSON syntax validation
    if ! jq empty "$CONFIG_FILE" 2>/dev/null; then
        log_error "Invalid JSON syntax in $CONFIG_FILE"
        return 1
    fi

    # Check if mcpServers exists
    if ! jq -e '.mcpServers' "$CONFIG_FILE" > /dev/null 2>&1; then
        log_error "No mcpServers configuration found in $CONFIG_FILE"
        return 1
    fi

    log_success "Configuration validation passed"
    return 0
}

# Environment variable validation
validate_environment() {
    local missing_vars=()
    
    # Extract environment variables from config
    jq -r '.mcpServers[].env // {} | to_entries[] | .value' "$CONFIG_FILE" 2>/dev/null | \
    while IFS= read -r env_var; do
        if [[ "$env_var" =~ ^\$\{([^}]+)\}$ ]]; then
            var_name="${BASH_REMATCH[1]}"
            if [[ -z "${!var_name:-}" ]]; then
                missing_vars+=("$var_name")
            fi
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing environment variables: ${missing_vars[*]}"
        return 1
    fi

    log_success "Environment validation passed"
    return 0
}

# Get list of configured servers
get_servers() {
    jq -r '.mcpServers | keys[]' "$CONFIG_FILE" 2>/dev/null || true
}

# Get server configuration
get_server_config() {
    local server_name="$1"
    jq -r ".mcpServers[\"$server_name\"]" "$CONFIG_FILE" 2>/dev/null
}

# Check if server process is running
check_server_process() {
    local server_name="$1"
    local pid_file="${PID_DIR}/${server_name}.pid"
    
    if [[ -f "$pid_file" ]]; then
        local pid="$(cat "$pid_file")"
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        else
            # Stale PID file
            rm -f "$pid_file"
            return 1
        fi
    fi
    return 1
}

# Health check for a specific server
health_check_server() {
    local server_name="$1"
    local log_file="${LOG_DIR}/${server_name}.log"
    
    # Check if process is running
    if ! check_server_process "$server_name"; then
        log_warn "Server $server_name process not running"
        return 1
    fi

    # Check for recent errors in logs
    if [[ -f "$log_file" ]]; then
        local recent_errors=$(tail -n 50 "$log_file" | grep -i "error\|exception\|failed" | wc -l)
        if [[ "$recent_errors" -gt 5 ]]; then
            log_warn "Server $server_name has $recent_errors recent errors"
            return 1
        fi
    fi

    return 0
}

# Start a specific server
start_server() {
    local server_name="$1"
    local config pid_file log_file command args env_vars
    
    config="$(get_server_config "$server_name")"
    pid_file="${PID_DIR}/${server_name}.pid"
    log_file="${LOG_DIR}/${server_name}.log"
    
    # Extract configuration
    command="$(echo "$config" | jq -r '.command')"
    args="$(echo "$config" | jq -r '.args[]?' | tr '\n' ' ')"
    env_vars="$(echo "$config" | jq -r '.env // {} | to_entries[] | "\(.key)=\(.value)"' | tr '\n' ' ')"

    # Check if already running
    if check_server_process "$server_name"; then
        log_warn "Server $server_name is already running"
        return 0
    fi

    log_info "Starting server: $server_name"
    log_info "Command: $command $args"

    # Start server with environment variables
    (
        # Set environment variables
        if [[ -n "$env_vars" ]]; then
            eval "export $env_vars"
        fi
        
        # Start server and capture PID
        exec "$command" $args > "$log_file" 2>&1 &
        echo $! > "$pid_file"
        
        # Wait a moment to check if it started successfully
        sleep 2
        if kill -0 $! 2>/dev/null; then
            log_success "Server $server_name started successfully (PID: $!)"
        else
            log_error "Server $server_name failed to start"
            rm -f "$pid_file"
            exit 1
        fi
    ) &
    
    # Wait for the subshell to complete
    wait $!
}

# Stop a specific server
stop_server() {
    local server_name="$1"
    local pid_file="${PID_DIR}/${server_name}.pid"
    
    if [[ -f "$pid_file" ]]; then
        local pid="$(cat "$pid_file")"
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping server: $server_name (PID: $pid)"
            kill "$pid"
            
            # Wait for graceful shutdown
            local count=0
            while kill -0 "$pid" 2>/dev/null && [[ $count -lt 10 ]]; do
                sleep 1
                ((count++))
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                log_warn "Force killing server: $server_name"
                kill -9 "$pid"
            fi
            
            log_success "Server $server_name stopped"
        fi
        rm -f "$pid_file"
    else
        log_warn "Server $server_name is not running"
    fi
}

# Restart server with exponential backoff
restart_server_with_backoff() {
    local server_name="$1"
    local attempt="${2:-1}"
    
    if [[ $attempt -gt $MAX_RESTART_ATTEMPTS ]]; then
        log_error "Maximum restart attempts reached for $server_name"
        return 1
    fi

    log_info "Restart attempt $attempt/$MAX_RESTART_ATTEMPTS for $server_name"
    
    # Stop server if running
    stop_server "$server_name"
    
    # Wait with exponential backoff
    local wait_time=$((RESTART_BACKOFF_BASE ** attempt))
    log_info "Waiting ${wait_time}s before restart..."
    sleep "$wait_time"
    
    # Try to start server
    if start_server "$server_name"; then
        # Verify it's actually working
        sleep 5
        if health_check_server "$server_name"; then
            log_success "Server $server_name restarted successfully"
            return 0
        else
            log_warn "Server $server_name started but failed health check"
            return 1
        fi
    else
        log_error "Failed to restart $server_name (attempt $attempt)"
        restart_server_with_backoff "$server_name" $((attempt + 1))
    fi
}

# Cleanup zombie processes
cleanup_zombie_processes() {
    log_info "Cleaning up zombie processes..."
    
    # Find and kill orphaned MCP processes
    local orphaned_pids
    orphaned_pids=$(pgrep -f "mcp-server\|@supabase\|@smithery" 2>/dev/null || true)
    
    if [[ -n "$orphaned_pids" ]]; then
        log_info "Found orphaned processes: $orphaned_pids"
        echo "$orphaned_pids" | xargs -r kill -TERM
        sleep 2
        echo "$orphaned_pids" | xargs -r kill -KILL 2>/dev/null || true
        log_success "Orphaned processes cleaned up"
    else
        log_info "No orphaned processes found"
    fi
    
    # Clean up stale PID files
    for pid_file in "$PID_DIR"/*.pid; do
        if [[ -f "$pid_file" ]]; then
            local pid="$(cat "$pid_file" 2>/dev/null || echo "")"
            if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
                log_info "Removing stale PID file: $(basename "$pid_file")"
                rm -f "$pid_file"
            fi
        fi
    done
}

# Health monitoring daemon
start_health_monitor() {
    local monitor_pid_file="${PID_DIR}/health-monitor.pid"
    
    # Check if monitor is already running
    if [[ -f "$monitor_pid_file" ]]; then
        local monitor_pid="$(cat "$monitor_pid_file")"
        if kill -0 "$monitor_pid" 2>/dev/null; then
            log_warn "Health monitor is already running (PID: $monitor_pid)"
            return 0
        else
            rm -f "$monitor_pid_file"
        fi
    fi

    log_info "Starting health monitor..."
    
    (
        echo $$ > "$monitor_pid_file"
        
        while true; do
            local failed_servers=()
            
            for server in $(get_servers); do
                if ! health_check_server "$server"; then
                    failed_servers+=("$server")
                fi
            done
            
            if [[ ${#failed_servers[@]} -gt 0 ]]; then
                log_warn "Health check failed for servers: ${failed_servers[*]}"
                
                for server in "${failed_servers[@]}"; do
                    log_info "Attempting automatic recovery for $server"
                    restart_server_with_backoff "$server" 1
                done
            else
                log_info "All servers healthy"
            fi
            
            sleep "$HEALTH_CHECK_INTERVAL"
        done
    ) &
    
    local monitor_pid=$!
    echo "$monitor_pid" > "$monitor_pid_file"
    log_success "Health monitor started (PID: $monitor_pid)"
}

# Stop health monitor
stop_health_monitor() {
    local monitor_pid_file="${PID_DIR}/health-monitor.pid"
    
    if [[ -f "$monitor_pid_file" ]]; then
        local monitor_pid="$(cat "$monitor_pid_file")"
        if kill -0 "$monitor_pid" 2>/dev/null; then
            log_info "Stopping health monitor (PID: $monitor_pid)"
            kill "$monitor_pid"
            rm -f "$monitor_pid_file"
            log_success "Health monitor stopped"
        else
            rm -f "$monitor_pid_file"
            log_warn "Health monitor was not running"
        fi
    else
        log_warn "Health monitor is not running"
    fi
}

# Show status dashboard
show_dashboard() {
    clear
    echo -e "${BLUE}🔧 MCP Server Health Dashboard${NC}"
    echo "================================"
    echo
    
    # Server status
    echo -e "${BLUE}📊 Server Status:${NC}"
    for server in $(get_servers); do
        if check_server_process "$server"; then
            if health_check_server "$server"; then
                echo -e "  ${GREEN}✅ $server${NC} - Running & Healthy"
            else
                echo -e "  ${YELLOW}⚠ $server${NC} - Running but Unhealthy"
            fi
        else
            echo -e "  ${RED}❌ $server${NC} - Not Running"
        fi
    done
    
    echo
    
    # System stats
    echo -e "${BLUE}💻 System Stats:${NC}"
    echo "  CPU Usage: $(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1)%"
    echo "  Memory: $(ps -A -o %mem | awk '{s+=$1} END {print s "%"}')"
    echo "  MCP Processes: $(pgrep -f "mcp-server\|@supabase\|@smithery" | wc -l | tr -d ' ')"
    
    echo
    
    # Recent logs
    echo -e "${BLUE}📋 Recent Activity:${NC}"
    if [[ -f "${LOG_DIR}/mcp-manager.log" ]]; then
        tail -n 5 "${LOG_DIR}/mcp-manager.log" | while IFS= read -r line; do
            echo "  $line"
        done
    else
        echo "  No recent activity"
    fi
}

# Main command handling
main() {
    case "${1:-help}" in
        "validate")
            echo "🔍 Validating MCP configuration..."
            validate_config && validate_environment
            ;;
        "start")
            echo "🚀 Starting MCP servers..."
            validate_config || exit 1
            cleanup_zombie_processes
            
            if [[ "${2:-}" == "--monitor" ]]; then
                start_health_monitor
            fi
            
            for server in $(get_servers); do
                start_server "$server"
            done
            ;;
        "stop")
            echo "🛑 Stopping MCP servers..."
            stop_health_monitor
            
            for server in $(get_servers); do
                stop_server "$server"
            done
            cleanup_zombie_processes
            ;;
        "restart")
            echo "🔄 Restarting MCP servers..."
            "$0" stop
            sleep 2
            "$0" start "${@:2}"
            ;;
        "status")
            show_dashboard
            ;;
        "logs")
            local server="${2:-}"
            if [[ -n "$server" ]]; then
                tail -f "${LOG_DIR}/${server}.log"
            else
                tail -f "${LOG_DIR}/mcp-manager.log"
            fi
            ;;
        "cleanup")
            echo "🧹 Cleaning up processes..."
            cleanup_zombie_processes
            ;;
        "monitor")
            start_health_monitor
            ;;
        "dashboard")
            while true; do
                show_dashboard
                sleep 5
            done
            ;;
        "help"|*)
            cat << EOF
🔧 Enhanced MCP Manager

Usage: $SCRIPT_NAME <command> [options]

Commands:
  validate          Validate configuration and environment
  start [--monitor] Start all MCP servers (optionally with health monitoring)
  stop              Stop all MCP servers and health monitor
  restart           Restart all MCP servers
  status            Show current status of all servers
  logs [server]     Show logs (specific server or manager logs)
  cleanup           Clean up zombie processes and stale files
  monitor           Start health monitoring daemon
  dashboard         Show live dashboard (refreshes every 5s)
  help              Show this help message

Examples:
  $SCRIPT_NAME start --monitor    # Start servers with health monitoring
  $SCRIPT_NAME logs supabase-mcp  # View logs for specific server
  $SCRIPT_NAME dashboard          # Show live dashboard

Configuration file: $CONFIG_FILE
Log directory: $LOG_DIR
EOF
            ;;
    esac
}

# Signal handling for graceful shutdown
trap 'stop_health_monitor; cleanup_zombie_processes; exit 0' SIGINT SIGTERM

# Run main function
main "$@" 