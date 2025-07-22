#!/usr/bin/env node

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
]

console.log('🔍 Verifying environment variables...\n')

let hasErrors = false

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`)
    hasErrors = true
  } else {
    const value = process.env[varName]
    const displayValue = value.substring(0, 10) + '...'
    console.log(`✅ Found: ${varName} = ${displayValue}`)
  }
})

if (hasErrors) {
  console.error('\n⚠️  Some environment variables are missing!')
  console.error('Please set them in your Vercel dashboard:')
  console.error('https://vercel.com/[your-team]/[your-project]/settings/environment-variables')
  process.exit(1)
} else {
  console.log('\n✨ All environment variables are configured!')
}