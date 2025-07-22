#!/usr/bin/env node

/**
 * Pre-build verification script for Vercel deployments
 * Checks for common issues that cause build failures
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local in development
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv might not be available in production
  }
}

console.log('🔍 Running pre-build checks...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify all required environment variables
console.log('1️⃣ Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`   ❌ Missing: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ Found: ${varName}`);
  }
});

// Check 2: Find pages that use authentication but might need dynamic rendering
console.log('\n2️⃣ Checking pages with authentication...');
const pagesWithAuth = [
  'app/debug-auth/page.tsx',
  'app/todo/page.tsx',
  'app/(main)/profile/page.tsx',
  'app/(main)/bookings/page.tsx',
  'app/admin/layout.tsx',
  'app/activities/[id]/page.tsx',
  'app/(marketing)/pricing/page.tsx'
];

pagesWithAuth.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasDynamic = content.includes('export const dynamic');
    const hasAuth = content.includes('auth()') || content.includes('currentUser') || content.includes('useUser');
    
    if (hasAuth && !hasDynamic) {
      console.warn(`   ⚠️  ${pagePath} uses auth but might need 'export const dynamic = "force-dynamic"'`);
      hasWarnings = true;
    } else if (hasAuth && hasDynamic) {
      console.log(`   ✅ ${pagePath} - properly configured`);
    }
  }
});

// Check 3: Check for problematic static exports
console.log('\n3️⃣ Checking for static exports with auth dependencies...');
const checkForStaticExports = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkForStaticExports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('generateStaticParams') && 
          (content.includes('@clerk') || content.includes('auth()'))) {
        console.warn(`   ⚠️  ${filePath} has generateStaticParams with auth dependencies`);
        hasWarnings = true;
      }
    }
  });
};

if (fs.existsSync(path.join(process.cwd(), 'app'))) {
  checkForStaticExports(path.join(process.cwd(), 'app'));
}

// Check 4: Verify Clerk key format
console.log('\n4️⃣ Checking Clerk key format...');
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (clerkKey) {
  if (!clerkKey.startsWith('pk_')) {
    console.error('   ❌ Clerk publishable key should start with "pk_"');
    hasErrors = true;
  } else if (clerkKey.endsWith('$')) {
    console.warn('   ⚠️  Clerk key ends with "$" - make sure it\'s properly escaped in Vercel');
    hasWarnings = true;
  } else {
    console.log('   ✅ Clerk key format looks correct');
  }
}

// Summary
console.log('\n📊 Summary:');
if (!hasErrors && !hasWarnings) {
  console.log('✅ All checks passed! Ready for deployment.');
  process.exit(0);
} else {
  if (hasErrors) {
    console.error(`❌ Found ${hasErrors ? 'errors' : '0 errors'} that will cause build failures`);
  }
  if (hasWarnings) {
    console.warn(`⚠️  Found ${hasWarnings ? 'warnings' : '0 warnings'} that might cause issues`);
  }
  process.exit(hasErrors ? 1 : 0);
}