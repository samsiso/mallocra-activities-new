#!/usr/bin/env node

/**
 * Test if food_wine enum works now
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testEnumFix() {
  console.log('🧪 Testing food_wine category enum...')
  
  try {
    // Try to query activities with food_wine category
    const { data, error } = await supabase
      .from('activities')
      .select('id, title, category')
      .eq('category', 'food_wine')
      .limit(1)
    
    if (error) {
      console.error('❌ Error querying food_wine category:', error.message)
      
      // Try to add the enum value directly
      console.log('🔧 Attempting to add food_wine to enum...')
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: "ALTER TYPE activity_category ADD VALUE IF NOT EXISTS 'food_wine';"
      })
      
      if (alterError) {
        console.error('❌ Failed to alter enum:', alterError.message)
      } else {
        console.log('✅ Successfully added food_wine to enum')
      }
    } else {
      console.log('✅ food_wine category works!', data)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testEnumFix()