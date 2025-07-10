#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// MCP instance tracker
const MCP_PID_FILE = path.join(__dirname, '.mcp-instances.json');

// Load existing instances
function loadInstances() {
  try {
    return JSON.parse(fs.readFileSync(MCP_PID_FILE, 'utf8'));
  } catch {
    return {};
  }
}

// Save instances
function saveInstances(instances) {
  fs.writeFileSync(MCP_PID_FILE, JSON.stringify(instances, null, 2));
}

// Commands
const commands = {
  status: () => {
    console.log('🔍 Checking MCP instances...\n');
    exec('ps aux | grep -i "supabase-mcp" | grep -v grep', (err, stdout) => {
      if (stdout) {
        console.log('Active instances:');
        console.log(stdout);
        
        // Count instances
        const lines = stdout.trim().split('\n');
        console.log(`\n📊 Total instances: ${lines.length}`);
        
        if (lines.length > 3) {
          console.log('⚠️  WARNING: Too many instances! Consider cleanup.');
        }
      } else {
        console.log('No active MCP instances found.');
      }
    });
  },

  cleanup: () => {
    console.log('🧹 Cleaning up duplicate MCP instances...');
    
    // Get all MCP processes
    exec('pgrep -f "supabase-mcp"', (err, stdout) => {
      if (stdout) {
        const pids = stdout.trim().split('\n');
        
        // Keep only the first instance
        if (pids.length > 1) {
          const toKill = pids.slice(1);
          toKill.forEach(pid => {
            exec(`kill ${pid}`, () => {
              console.log(`✅ Killed duplicate instance: ${pid}`);
            });
          });
          console.log(`\n🎯 Kept primary instance: ${pids[0]}`);
        } else {
          console.log('✅ No duplicates found!');
        }
      }
    });
  },

  restart: () => {
    console.log('🔄 Restarting MCP...');
    
    // Kill all instances
    exec('pkill -f "supabase-mcp"', () => {
      console.log('✅ Stopped all instances');
      
      // Wait a bit
      setTimeout(() => {
        console.log('🚀 Starting fresh instance...');
        exec('npm exec @smithery/cli@latest run @supabase-community/supabase-mcp &', (err) => {
          if (!err) {
            console.log('✅ MCP restarted successfully!');
          }
        });
      }, 2000);
    });
  },

  monitor: () => {
    console.log('📊 Starting MCP monitor...');
    setInterval(() => {
      exec('pgrep -f "supabase-mcp" | wc -l', (err, stdout) => {
        const count = parseInt(stdout.trim());
        const time = new Date().toLocaleTimeString();
        
        if (count > 3) {
          console.log(`⚠️  [${time}] High instance count: ${count} - Running cleanup...`);
          commands.cleanup();
        } else {
          console.log(`✅ [${time}] Instance count OK: ${count}`);
        }
      });
    }, 30000); // Check every 30 seconds
  }
};

// CLI
const command = process.argv[2];

if (!command || !commands[command]) {
  console.log(`
🔧 MCP Instance Manager

Usage: node mcp-manager.js <command>

Commands:
  status   - Show all MCP instances
  cleanup  - Remove duplicate instances (keeps one)
  restart  - Kill all and start fresh
  monitor  - Auto-cleanup duplicates every 30s

Example:
  node mcp-manager.js status
  `);
} else {
  commands[command]();
}