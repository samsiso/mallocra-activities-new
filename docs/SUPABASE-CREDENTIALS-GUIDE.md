# Supabase Credentials Guide

This document explains how your Supabase credentials are organized and secured for the Mallorca Activities platform.

## 🔐 **Credential Storage**

### Primary Storage: `.env.mcp`
- **Status**: ✅ Gitignored (safe from commits)
- **Purpose**: MCP server configuration and backup credentials
- **Location**: Project root directory

### Secondary Storage: `.env.local`
- **Status**: ✅ Gitignored (safe from commits)  
- **Purpose**: Application runtime environment
- **Location**: Project root directory

## 📊 **Supabase Project Details**

### Project Information
- **Name**: marroca-activites
- **Environment**: main (Production)
- **URL**: https://tskawjnjmiltzoypdnsl.supabase.co
- **Project Ref**: tskawjnjmiltzoypdnsl

### API Keys Available

#### New API Keys (Recommended)
```bash
# Publishable Key (Safe for browsers with RLS)
SUPABASE_PUBLISHABLE_KEY=sb_publishable_zCI_Fzjf9KDej0MriIr5Kw_8eVo9t0o

# Secret Key (Backend only - partial shown)
SUPABASE_SECRET_KEY=sb_secret_0o3aF...
```

#### Legacy JWT Keys (Currently Active)
```bash
# Anon Key (Public - safe for frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (Admin - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 **MCP Integration**

### Working MCP Servers
Your project now has these reliable MCP servers:

1. **PostgreSQL MCP** - Direct database access
2. **Filesystem MCP** - Local file operations  
3. **GitHub MCP** - Git repository operations
4. **SQLite MCP** - Local testing database

### Auto-Loading Setup
- ✅ MCP servers auto-load when running `claude`
- ✅ Credentials stored securely in `.env.mcp`
- ✅ Global configuration in `~/.config/claude-code/mcp-servers.json`

## 🚨 **Security Notes**

### What's Safe to Share
- ✅ Anon key (frontend safe with RLS)
- ✅ Publishable key (browser safe with RLS)
- ✅ Project URL and reference

### Never Share Publicly
- ❌ Service Role Key (bypasses RLS)
- ❌ Secret API keys (backend privileged access)
- ❌ Database password/connection strings

### Git Safety
- ✅ `.env.mcp` is gitignored
- ✅ `.env.local` is gitignored
- ✅ All sensitive files excluded from commits

## 🔄 **Usage Instructions**

### For MCP Servers
```bash
# Auto-loads with claude command
claude

# Manual verification
claude mcp list
```

### For Application Development
```bash
# Environment variables available in:
# - .env.local (runtime)
# - .env.mcp (MCP backup)
```

### For Database Operations
```bash
# Direct PostgreSQL access via MCP
# Uses DATABASE_URL from .env.mcp
```

## 📱 **API Key Migration Plan**

Supabase is transitioning to new API key format:

### Current State
- ✅ JWT keys still active and working
- ✅ New publishable/secret keys available
- ✅ Both formats stored for transition

### Migration Strategy
1. Keep using JWT keys for now (fully functional)
2. Test new API keys in development
3. Migrate when Supabase completes the transition
4. Legacy keys can be disabled after migration

## 🛠️ **Troubleshooting**

### If MCP Servers Fail
```bash
# Reload all MCP servers
./scripts/global-mcp-manager.sh load-all

# Check credentials
cat .env.mcp | grep SUPABASE
```

### If Database Connection Fails
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test direct connection
psql "$DATABASE_URL"
```

### If Environment Variables Missing
```bash
# Check application environment
cat .env.local | grep SUPABASE

# Source MCP environment
source .env.mcp
```

## 📋 **Maintenance Checklist**

### Monthly
- [ ] Verify API keys still active
- [ ] Check MCP server connectivity
- [ ] Review access logs in Supabase dashboard

### When Needed
- [ ] Rotate service role key if compromised
- [ ] Update MCP configurations
- [ ] Migrate to new API key format when available

---

**🔐 Your Supabase credentials are now securely stored and gitignored. All MCP servers have reliable access to your database while keeping sensitive information safe.**