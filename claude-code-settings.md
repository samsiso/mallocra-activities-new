# Claude Code MCP Settings for Multiple Instances

## 🎯 Best Solution: Configure MCP Connection Pooling

Add this to your Claude Code settings (usually `~/.claude/config.json`):

```json
{
  "mcp": {
    "supabase": {
      "connectionPool": {
        "maxInstances": 1,
        "reuseExisting": true,
        "timeout": 30000
      }
    }
  }
}
```

## 🔧 Alternative: Environment-Based Config

In your `.env.local`:
```bash
# MCP Configuration
MCP_MAX_INSTANCES=1
MCP_REUSE_CONNECTION=true
MCP_INSTANCE_ID=${BROWSER_SESSION_ID:-default}
```

## 📝 Quick Commands

### Check current instances:
```bash
# See all MCP processes
ps aux | grep -c "supabase-mcp"

# Get detailed info
node scripts/mcp-manager.js status
```

### Clean up duplicates:
```bash
# Keep only one instance
node scripts/mcp-manager.js cleanup

# Or kill all and restart
node scripts/mcp-manager.js restart
```

### Auto-monitor (prevents duplicates):
```bash
# Run in background to auto-cleanup
node scripts/mcp-manager.js monitor &
```

## 🚀 Recommended Setup

1. **Single shared instance** - Best for most users
2. **Auto-cleanup script** - Prevents buildup
3. **Regular restarts** - Keep it fresh

## 💡 Pro Tip

Add to your `.zshrc` or `.bashrc`:
```bash
alias mcp-check="ps aux | grep -c supabase-mcp"
alias mcp-clean="node ~/path/to/project/scripts/mcp-manager.js cleanup"
```