// Run this with: node scripts/populate-activities.js
// Make sure you have your .env.local variables set

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function populateActivities() {
  console.log('Starting to populate activities...')
  
  // Your activity population logic here
  // This is a standalone script that doesn't depend on Next.js
  
  console.log('Activities populated successfully!')
}

populateActivities().catch(console.error)