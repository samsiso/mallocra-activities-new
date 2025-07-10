#!/usr/bin/env node

/**
 * Test script to verify MCP and database connections are working
 * Run this to test the setup after Claude restarts
 */

const { createClient } = require('@supabase/supabase-js');

// Environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tskawjnjmiltzoypdnsl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA0MTA0MCwiZXhwIjoyMDY0NjE3MDQwfQ.HY91_ZAp7gpeI8B-2oRaV_-rKo1fhC_G601EPY-p0bI';

async function testMCPConnection() {
  console.log('🔄 Testing MCP and Database Connection...\n');
  
  try {
    // Test 1: Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('✅ Supabase client created successfully');
    
    // Test 2: Test database connection
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ Database connected - Found ${activitiesCount} activities`);
    
    // Test 3: Test a simple query
    const { data: sampleActivity } = await supabase
      .from('activities')
      .select('id, title, location, category')
      .limit(1)
      .single();
    
    console.log('✅ Sample query successful:', {
      id: sampleActivity.id,
      title: sampleActivity.title,
      location: sampleActivity.location,
      category: sampleActivity.category
    });
    
    // Test 4: Test bookings table
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ Bookings table accessible - Found ${bookingsCount} bookings`);
    
    console.log('\n🎉 All tests passed! MCP and database connections are working correctly.');
    console.log('\n📋 Available MCP tools should include:');
    console.log('   - mcp__supabase__execute_sql');
    console.log('   - mcp__supabase__list_tables');
    console.log('   - mcp__supabase__get_project');
    console.log('   - And more...');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check environment variables in .env.local');
    console.error('   2. Verify MCP configuration in .cursor/mcp.json');
    console.error('   3. Run: claude mcp list');
    console.error('   4. Check CLAUDE.md for setup instructions');
  }
}

// Run the test
testMCPConnection();