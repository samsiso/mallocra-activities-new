#!/usr/bin/env node

/**
 * Environment Variable Debugging Script
 * Run this to check if all required environment variables are set correctly
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
]

const optionalEnvVars = [
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL', 
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_POSTHOG_HOST',
  'NEXT_PUBLIC_APP_URL'
]

console.log('🔍 Environment Variable Debug Report')
console.log('=====================================\n')

console.log('📋 Required Environment Variables:')
let hasAllRequired = true

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  const status = value ? '✅' : '❌'
  const displayValue = value ? `${value.substring(0, 10)}...` : 'NOT SET'
  
  console.log(`${status} ${envVar}: ${displayValue}`)
  
  if (!value) {
    hasAllRequired = false
  }
})

console.log('\n📋 Optional Environment Variables:')
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  const status = value ? '✅' : '⚠️ '
  const displayValue = value ? `${value.substring(0, 10)}...` : 'NOT SET'
  
  console.log(`${status} ${envVar}: ${displayValue}`)
})

console.log('\n🌍 Environment Info:')
console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`)
console.log(`🚀 VERCEL: ${process.env.VERCEL || 'false'}`)
console.log(`🔧 VERCEL_ENV: ${process.env.VERCEL_ENV || 'NOT SET'}`)

console.log('\n📊 Summary:')
if (hasAllRequired) {
  console.log('✅ All required environment variables are set!')
  console.log('🚀 Your app should deploy successfully to Vercel.')
} else {
  console.log('❌ Some required environment variables are missing!')
  console.log('💡 Please set them in your Vercel dashboard or .env.local file.')
}

console.log('\n🔗 Helpful Links:')
console.log('• Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables')
console.log('• Clerk Setup Guide: https://clerk.com/docs/quickstarts/nextjs')
console.log('• Supabase Setup: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs')

console.log('\n=====================================') 