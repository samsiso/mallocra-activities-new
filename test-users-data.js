const { createClient } = require('@supabase/supabase-js');

// Test script to verify users data is working
async function testUsersData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Test fetching users
    const { data: userProfiles, error: profilesError } = await supabase
      .from('users_profiles')
      .select(`
        id,
        clerk_user_id,
        user_type,
        first_name,
        last_name,
        email,
        phone,
        preferred_language,
        status,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      return;
    }

    console.log('✅ Successfully fetched users from Supabase:');
    console.log(`Found ${userProfiles?.length || 0} users`);
    
    if (userProfiles && userProfiles.length > 0) {
      console.log('\nFirst few users:');
      userProfiles.slice(0, 3).forEach((user, index) => {
        console.log(`${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - ${user.user_type} - ${user.status}`);
      });
    }

    // Test bookings data
    const { data: bookingStats, error: bookingsError } = await supabase
      .from('bookings')
      .select('customer_id, total_amount, status, created_at')
      .limit(5);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    } else {
      console.log(`\n📊 Found ${bookingStats?.length || 0} bookings in the database`);
      if (bookingStats && bookingStats.length > 0) {
        console.log('Booking statuses:', [...new Set(bookingStats.map(b => b.status))]);
      } else {
        console.log('ℹ️ No bookings found - users will show 0 total bookings and spending');
      }
    }

    console.log('\n🎉 Admin users page should now show real data from Supabase!');
    console.log('🌐 Visit: http://localhost:3000/admin/users');
    
  } catch (error) {
    console.error('❌ Error testing users data:', error);
  }
}

// Load environment variables if in Node.js environment
if (typeof process !== 'undefined' && process.env) {
  require('dotenv').config({ path: '.env.local' });
}

testUsersData(); 