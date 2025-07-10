# Global MCP Setup for Multiple Supabase Projects

This comprehensive MCP setup allows you to manage multiple Supabase projects and ensures MCP servers auto-load with **any** Claude Code startup method.

## 🚀 **Quick Start**

```bash
# One-command setup
./scripts/quick-mcp-setup.sh
```

## 📋 **Features**

### ✅ **Universal Claude Support**
Works with **all** Claude startup methods:
- `claude`
- `claude --dangerously-skip-permissions`
- `claude --mcp-config <file>`
- `claude --resume`
- Any other Claude command

### ✅ **Multi-Project Management**
- Add unlimited Supabase projects
- Each project gets its own MCP server
- Auto-detection from `.env.local` files
- Global configuration management

### ✅ **Persistent Configuration**
- Survives Claude restarts
- Global configuration storage
- Project-specific overrides
- Shell integration

## 🔧 **Manual Setup**

### Step 1: Initialize Global Configuration
```bash
./scripts/global-mcp-manager.sh init
```

### Step 2: Add Current Project
```bash
./scripts/global-mcp-manager.sh auto-add mallorca-activities
```

### Step 3: Add Additional Projects
```bash
./scripts/global-mcp-manager.sh add-project "my-app-prod" \
  "https://your-prod-id.supabase.co" \
  "your_production_anon_key" \
  "your_production_service_key"
```

### Step 4: Set Up Global Configuration
```bash
./scripts/global-mcp-manager.sh setup-global
```

## 📊 **Project Management Commands**

### Add a New Project
```bash
./scripts/global-mcp-manager.sh add-project <name> <url> <anon_key> <service_key>
```

### List All Projects
```bash
./scripts/global-mcp-manager.sh list-projects
```

### Remove a Project
```bash
./scripts/global-mcp-manager.sh remove-project <name>
```

### Check Configuration Status
```bash
./scripts/global-mcp-manager.sh status
```

### Load All MCP Servers
```bash
./scripts/global-mcp-manager.sh load-all
```

## 🗂️ **Configuration Files**

### Global Configuration
- `~/.config/claude-code/mcp-servers.json` - All MCP servers
- `~/.config/claude-code/projects.json` - Project definitions

### Project-Specific Configuration
- `.claude.json` - Claude Code configuration
- `.cursor/mcp.json` - Cursor compatibility
- `.mcp.json` - Additional compatibility

## 🔄 **Auto-Loading Mechanism**

The system ensures MCP servers are available through multiple methods:

1. **Global Claude Config**: Registers servers with Claude CLI
2. **Project Configs**: Local configurations for project-specific use
3. **Startup Wrapper**: Shell integration for automatic loading
4. **Environment Variables**: Runtime configuration

## 🛠️ **Advanced Usage**

### Add Multiple Projects from Script
```bash
# Edit scripts/add-project-example.sh with your project details
./scripts/add-project-example.sh run
```

### Use Wrapper for Enhanced Loading
```bash
# Use the wrapper for guaranteed MCP loading
./scripts/claude-startup-wrapper.sh
./scripts/claude-startup-wrapper.sh --dangerously-skip-permissions
```

## 🔍 **Troubleshooting**

### MCP Servers Not Loading
```bash
# Check configuration status
./scripts/global-mcp-manager.sh status

# Reload all servers
./scripts/global-mcp-manager.sh load-all

# Check Claude MCP list
claude mcp list
```

### Adding Projects Fails
```bash
# Ensure jq is installed
brew install jq

# Check .env.local format
cat .env.local | grep SUPABASE
```

### Configuration Not Persisting
```bash
# Recreate all configurations
./scripts/quick-mcp-setup.sh
```

## 📝 **Examples**

### Example 1: Add Production Environment
```bash
./scripts/global-mcp-manager.sh add-project "myapp-prod" \
  "https://abcdef.supabase.co" \
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example 2: Multiple Projects Setup
```bash
# Add staging
./scripts/global-mcp-manager.sh add-project "myapp-staging" \
  "https://staging-id.supabase.co" \
  "staging_anon_key" \
  "staging_service_key"

# Add development
./scripts/global-mcp-manager.sh add-project "myapp-dev" \
  "https://dev-id.supabase.co" \
  "dev_anon_key" \
  "dev_service_key"
```

### Example 3: Project-Specific Usage
```bash
# In each project directory
./scripts/global-mcp-manager.sh auto-add $(basename $PWD)
```

## 🎯 **MCP Server Names**

Projects are automatically named as:
- `supabase-<project-name>` (e.g., `supabase-mallorca-activities`)
- All use the same MCP tools: `mcp__supabase__*`

## 🔒 **Security Notes**

- Service role keys are stored in global configuration
- Use environment variables for sensitive data
- Consider using separate keys for different environments
- Global config is stored in `~/.config/claude-code/`

## 📚 **File Structure**

```
scripts/
├── global-mcp-manager.sh      # Main project management
├── claude-startup-wrapper.sh  # Claude startup wrapper
├── quick-mcp-setup.sh         # One-command setup
├── add-project-example.sh     # Example for multiple projects
├── auto-setup-mcp.sh          # Legacy auto-setup
└── mcp-manager.sh             # Process management

Configuration:
~/.config/claude-code/
├── mcp-servers.json           # Global MCP servers
├── projects.json              # Project definitions
└── startup.sh                 # Startup profile
```

## 🎉 **Success Verification**

After setup, you should see:
```bash
# Check projects
./scripts/global-mcp-manager.sh list-projects

# Check MCP servers
claude mcp list

# Start Claude and verify MCP tools are available
# Look for tools like: mcp__supabase__execute_sql
```

## 💡 **Tips**

1. **Use Auto-Add**: `./scripts/global-mcp-manager.sh auto-add` detects `.env.local` automatically
2. **Check Status**: Always run `./scripts/global-mcp-manager.sh status` when troubleshooting
3. **Multiple Environments**: Use different project names for prod/staging/dev
4. **Backup Config**: Keep backups of `~/.config/claude-code/` directory

---

**🚀 Ready to use!** Restart Claude Code and your MCP servers will be available automatically with any startup method.