#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

// ANSI color codes (fallback if chalk not available)
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTests() {
  log('\n🧪 Running Booking Flow Tests\n', 'blue');
  
  // Check if server is running
  log('Checking if development server is running...', 'yellow');
  
  const checkServer = spawn('curl', ['-s', 'http://localhost:3001']);
  
  checkServer.on('close', async (code) => {
    if (code !== 0) {
      log('⚠️  Server not running. Please start it with: npm run dev', 'yellow');
      log('Then run this script again.\n', 'yellow');
      process.exit(1);
    }
    
    log('✅ Server is running\n', 'green');
    
    // Run the console monitoring test to see detailed logs
    log('Running console monitoring test to capture all logs...', 'blue');
    
    const test = spawn('npx', ['playwright', 'test', 'booking-console-monitoring', '--reporter=line'], {
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    let hasErrors = false;
    
    test.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      
      // Color code the output
      if (text.includes('✅') || text.includes('passed')) {
        process.stdout.write(`${colors.green}${text}${colors.reset}`);
      } else if (text.includes('❌') || text.includes('failed') || text.includes('error')) {
        process.stdout.write(`${colors.red}${text}${colors.reset}`);
        hasErrors = true;
      } else if (text.includes('Console Log Summary') || text.includes('API Call Summary')) {
        process.stdout.write(`${colors.blue}${text}${colors.reset}`);
      } else {
        process.stdout.write(text);
      }
    });
    
    test.stderr.on('data', (data) => {
      process.stderr.write(`${colors.red}${data}${colors.reset}`);
      hasErrors = true;
    });
    
    test.on('close', (code) => {
      if (code === 0 && !hasErrors) {
        log('\n✅ All tests passed!', 'green');
        log('\n📊 Summary:', 'blue');
        
        // Extract summary from output
        const summaryMatch = output.match(/Console Log Summary[\s\S]*?(?=\n\n|$)/);
        if (summaryMatch) {
          console.log(summaryMatch[0]);
        }
        
        log('\n💡 Tips:', 'yellow');
        log('- Run "npm run test:e2e:ui" to see tests in browser', 'yellow');
        log('- Check playwright-report/index.html for detailed results', 'yellow');
      } else {
        log('\n❌ Tests failed!', 'red');
        log('\n🔍 Debug steps:', 'yellow');
        log('1. Check the console output above for error details', 'yellow');
        log('2. Run "npm run test:e2e:ui" to debug visually', 'yellow');
        log('3. Check if Supabase keys are correctly set in .env.local', 'yellow');
        log('4. Verify the database is accessible', 'yellow');
        
        process.exit(1);
      }
    });
  });
}

// Run the tests
runTests().catch(console.error);