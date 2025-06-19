require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

supabase
  .from('users_profiles')
  .select('id, first_name, last_name, email, user_type, status')
  .limit(5)
  .then(({data, error}) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log(`✅ Found ${data?.length || 0} users in database`);
      if (data && data.length > 0) {
        data.forEach((user, i) => {
          console.log(`${i+1}. ${user.first_name} ${user.last_name} - ${user.user_type} (${user.status})`);
        });
      }
    }
  }); 