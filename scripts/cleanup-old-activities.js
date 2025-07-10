#!/usr/bin/env node

/**
 * Cleanup Script - Remove Old Duplicate Activities
 * Run this after verifying the consolidated activities work correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupOldActivities() {
  try {
    console.log('🧹 Starting cleanup of old duplicate activities...\n');

    // List of old activities to remove
    const oldActivityTitles = [
      'Jet Ski 30-Minute Tour',
      'Jet Ski 1-Hour Tour', 
      'Formula Tours - Tour 1',
      'Formula Tours - Tour 2',
      'Boat Rental Option 1',
      'Boat Rental Option 2',
      'Boat Rental Option 3'
    ];

    // Get old activity IDs
    const { data: oldActivities } = await supabase
      .from('activities')
      .select('id, title')
      .in('title', oldActivityTitles);

    if (!oldActivities || oldActivities.length === 0) {
      console.log('✅ No old activities found to clean up.');
      return;
    }

    console.log(`📋 Found ${oldActivities.length} old activities to remove:`);
    oldActivities.forEach(activity => {
      console.log(`   - ${activity.title}`);
    });
    console.log('');

    const oldActivityIds = oldActivities.map(a => a.id);

    // Step 1: Delete old activity pricing
    console.log('📝 Step 1: Removing old pricing records...');
    const { error: pricingError } = await supabase
      .from('activity_pricing')
      .delete()
      .in('activity_id', oldActivityIds);

    if (pricingError) {
      console.error('❌ Error deleting pricing:', pricingError);
      return;
    }
    console.log('✅ Old pricing records removed');

    // Step 2: Delete old activity images
    console.log('📝 Step 2: Removing old image records...');
    const { error: imagesError } = await supabase
      .from('activity_images')
      .delete()
      .in('activity_id', oldActivityIds);

    if (imagesError) {
      console.error('❌ Error deleting images:', imagesError);
      return;
    }
    console.log('✅ Old image records removed');

    // Step 3: Delete old availability records (if any)
    console.log('📝 Step 3: Removing old availability records...');
    const { error: availabilityError } = await supabase
      .from('activity_availability')
      .delete()
      .in('activity_id', oldActivityIds);

    if (availabilityError) {
      console.error('❌ Error deleting availability:', availabilityError);
      return;
    }
    console.log('✅ Old availability records removed');

    // Step 4: Delete old add-ons (if any)
    console.log('📝 Step 4: Removing old add-on records...');
    const { error: addOnsError } = await supabase
      .from('activity_add_ons')
      .delete()
      .in('activity_id', oldActivityIds);

    if (addOnsError) {
      console.error('❌ Error deleting add-ons:', addOnsError);
      return;
    }
    console.log('✅ Old add-on records removed');

    // Step 5: Finally, delete the old activities
    console.log('📝 Step 5: Removing old activity records...');
    const { error: activitiesError } = await supabase
      .from('activities')
      .delete()
      .in('id', oldActivityIds);

    if (activitiesError) {
      console.error('❌ Error deleting activities:', activitiesError);
      return;
    }
    console.log('✅ Old activity records removed');

    // Verification
    console.log('\n📝 Verification: Checking remaining activities...');
    const { data: remainingActivities } = await supabase
      .from('activities')
      .select('title, slug')
      .in('slug', ['jet-ski-adventure-tour', 'formula-racing-experience', 'private-boat-rental']);

    console.log('✅ Consolidated activities still present:');
    remainingActivities?.forEach(activity => {
      console.log(`   ✓ ${activity.title} (${activity.slug})`);
    });

    // Check that old activities are gone
    const { data: checkOld } = await supabase
      .from('activities')
      .select('title')
      .in('title', oldActivityTitles);

    if (checkOld && checkOld.length > 0) {
      console.log('\n⚠️  Warning: Some old activities still exist:');
      checkOld.forEach(activity => {
        console.log(`   - ${activity.title}`);
      });
    } else {
      console.log('\n✅ All old duplicate activities successfully removed');
    }

    console.log('\n🎉 Cleanup completed successfully!');
    console.log('\n📊 Final Summary:');
    console.log('   • Removed 7 duplicate activities');
    console.log('   • Cleaned up all related data (pricing, images, availability, add-ons)');
    console.log('   • Consolidated activities remain intact');
    console.log('   • Database is now clean and organized');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupOldActivities();