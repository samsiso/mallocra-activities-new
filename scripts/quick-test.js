#!/usr/bin/env node

/**
 * Quick Test - Check if hydration issue is fixed
 */

const puppeteer = require('puppeteer');

async function quickTest() {
  console.log('🔍 Quick test for hydration errors...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('Hydration')) {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    if (error.message.includes('Hydration')) {
      consoleErrors.push(`Page Error: ${error.message}`);
    }
  });

  try {
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (consoleErrors.length === 0) {
      console.log('✅ No hydration errors detected!');
    } else {
      console.log('❌ Hydration errors still present:');
      consoleErrors.forEach(error => console.log(`   ${error}`));
    }
    
    // Test activities page too
    await page.goto('http://localhost:3000/activities', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (consoleErrors.length === 0) {
      console.log('✅ Activities page also clean!');
    } else {
      console.log('❌ Activities page has hydration errors');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
  
  await browser.close();
}

quickTest().catch(console.error);