#!/bin/bash

echo "🔍 Finding all MCP-related processes..."

# Kill all MCP-related processes
ps aux | grep -E "(mcp|@upstash|@smithery|sequential-thinking|alpine/socat)" | grep -v grep | awk '{print $2}' | while read pid; do
    echo "Killing process $pid"
    kill -9 $pid 2>/dev/null
done

# Kill any Docker containers related to MCP
docker ps -q --filter "label=mcp.client" | while read container; do
    echo "Stopping Docker container $container"
    docker stop $container
done

echo "✅ All MCP processes have been terminated"
echo ""
echo "🚀 To restart MCP services properly:"
echo "1. Restart Cursor/Claude Desktop"
echo "2. Or manually start the specific MCP you need"