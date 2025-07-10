#!/usr/bin/env node

/**
 * Activity Consolidation Script
 * Consolidates duplicate activities into single activities with pricing variations
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function consolidateActivities() {
  try {
    console.log('🚀 Starting activity consolidation...\n');

    // =============================================
    // STEP 1: Create consolidated JetSki Tour activity
    // =============================================
    console.log('📝 Step 1: Creating consolidated JetSki Tour activity...');
    
    const jetSkiActivity = await supabase
      .from('activities')
      .insert({
        operator_id: 'ab23059a-c9d8-4a51-9bd8-da900444053a', // Existing operator ID
        title: 'Jet Ski Adventure Tour',
        slug: 'jet-ski-adventure-tour',
        description: "Experience the thrill of jet skiing along Mallorca's stunning coastline. Choose from our 30-minute taster session or extend your adventure with our full 1-hour tour. Perfect for beginners and experienced riders alike, our guided jet ski tours offer an unforgettable water sports experience with breathtaking views of the Mediterranean.",
        short_description: "Thrilling jet ski tours along Mallorca's coastline - choose 30 minutes or 1 hour",
        category: 'water_sports',
        location: 'Palma Bay Marina',
        duration_minutes: 60,
        max_participants: 2,
        min_age: 16,
        what_to_bring: ['Swimwear', 'towel', 'sunscreen', 'waterproof camera (optional)'],
        included_items: ['Professional guide', 'safety equipment', 'brief training session', 'fuel'],
        cancellation_policy: 'Free cancellation up to 24 hours before the tour',
        safety_requirements: 'Minimum age 16 years. Valid driving license required for driver.',
        status: 'active'
      })
      .select()
      .single();

    if (jetSkiActivity.error) {
      console.error('❌ Error creating JetSki activity:', jetSkiActivity.error);
      return;
    }

    console.log('✅ JetSki activity created:', jetSkiActivity.data.title);

    // Add JetSki pricing variations
    const jetSkiPricing = await supabase
      .from('activity_pricing')
      .insert([
        {
          activity_id: jetSkiActivity.data.id,
          price_type: 'adult',
          base_price: '99.00',
          currency: 'EUR'
        },
        {
          activity_id: jetSkiActivity.data.id,
          price_type: 'adult', 
          base_price: '159.00',
          currency: 'EUR'
        }
      ]);

    if (jetSkiPricing.error) {
      console.error('❌ Error creating JetSki pricing:', jetSkiPricing.error);
      return;
    }

    console.log('✅ JetSki pricing variations created\n');

    // =============================================
    // STEP 2: Create consolidated Formula Racing activity
    // =============================================
    console.log('📝 Step 2: Creating consolidated Formula Racing activity...');
    
    const formulaActivity = await supabase
      .from('activities')
      .insert({
        operator_id: 'ab23059a-c9d8-4a51-9bd8-da900444053a',
        title: 'Formula Racing Experience',
        slug: 'formula-racing-experience',
        description: "Get behind the wheel of a real Formula racing car and experience the thrill of high-speed racing on professional tracks. Choose from our introductory 2.5-hour session or our comprehensive 4.5-hour advanced experience. Both tours include professional instruction, safety briefing, and the chance to push these incredible machines to their limits.",
        short_description: "Professional Formula racing experience - choose from 2.5 or 4.5 hour sessions",
        category: 'land_adventures',
        location: 'Formula Racing Circuit, Mallorca',
        duration_minutes: 270,
        max_participants: 20,
        min_age: 18,
        what_to_bring: ['Closed-toe shoes', 'comfortable clothing', 'valid driving license'],
        included_items: ['Professional instructor', 'safety equipment', 'racing car', 'fuel', 'timing system'],
        cancellation_policy: 'Free cancellation up to 48 hours before the experience',
        safety_requirements: 'Minimum age 18 years. Valid driving license required. Medical clearance may be required.',
        status: 'active'
      })
      .select()
      .single();

    if (formulaActivity.error) {
      console.error('❌ Error creating Formula activity:', formulaActivity.error);
      return;
    }

    console.log('✅ Formula activity created:', formulaActivity.data.title);

    // Add Formula Racing pricing variations
    const formulaPricing = await supabase
      .from('activity_pricing')
      .insert([
        {
          activity_id: formulaActivity.data.id,
          price_type: 'adult',
          base_price: '59.00',
          currency: 'EUR'
        },
        {
          activity_id: formulaActivity.data.id,
          price_type: 'adult',
          base_price: '79.00',
          currency: 'EUR'
        }
      ]);

    if (formulaPricing.error) {
      console.error('❌ Error creating Formula pricing:', formulaPricing.error);
      return;
    }

    console.log('✅ Formula pricing variations created\n');

    // =============================================
    // STEP 3: Create consolidated Boat Rental activity
    // =============================================
    console.log('📝 Step 3: Creating consolidated Boat Rental activity...');
    
    const boatActivity = await supabase
      .from('activities')
      .insert({
        operator_id: 'ab23059a-c9d8-4a51-9bd8-da900444053a',
        title: 'Private Boat Rental',
        slug: 'private-boat-rental',
        description: "Charter your own private boat and explore Mallorca's stunning coastline at your own pace. Choose from our fleet of well-maintained boats accommodating different group sizes and budgets. All boats come with safety equipment and optional captain service. Perfect for families, couples, or groups looking for a personalized maritime adventure.",
        short_description: "Private boat charter with flexible duration and capacity options",
        category: 'water_sports',
        location: 'Marina Port de Mallorca',
        duration_minutes: 60,
        max_participants: 10,
        what_to_bring: ['Swimwear', 'towel', 'sunscreen', 'snacks and drinks'],
        included_items: ['Boat rental', 'safety equipment', 'fuel', 'basic navigation briefing'],
        cancellation_policy: 'Free cancellation up to 24 hours before rental',
        safety_requirements: 'Valid boat license required for self-drive or captain service available for additional fee.',
        status: 'active'
      })
      .select()
      .single();

    if (boatActivity.error) {
      console.error('❌ Error creating Boat activity:', boatActivity.error);
      return;
    }

    console.log('✅ Boat activity created:', boatActivity.data.title);

    // Add Boat Rental pricing variations
    const boatPricing = await supabase
      .from('activity_pricing')
      .insert([
        {
          activity_id: boatActivity.data.id,
          price_type: 'adult',
          base_price: '320.00',
          currency: 'EUR'
        },
        {
          activity_id: boatActivity.data.id,
          price_type: 'adult',
          base_price: '350.00',
          currency: 'EUR'
        },
        {
          activity_id: boatActivity.data.id,
          price_type: 'adult',
          base_price: '380.00',
          currency: 'EUR'
        }
      ]);

    if (boatPricing.error) {
      console.error('❌ Error creating Boat pricing:', boatPricing.error);
      return;
    }

    console.log('✅ Boat pricing variations created\n');

    // =============================================
    // STEP 4: Copy images from old activities
    // =============================================
    console.log('📝 Step 4: Copying images from old activities...');

    // Get old JetSki activity IDs
    const oldJetSkiActivities = await supabase
      .from('activities')
      .select('id')
      .in('title', ['Jet Ski 30-Minute Tour', 'Jet Ski 1-Hour Tour']);

    // Get old Formula activity IDs
    const oldFormulaActivities = await supabase
      .from('activities')
      .select('id')
      .in('title', ['Formula Tours - Tour 1', 'Formula Tours - Tour 2']);

    // Get old Boat activity IDs
    const oldBoatActivities = await supabase
      .from('activities')
      .select('id')
      .in('title', ['Boat Rental Option 1', 'Boat Rental Option 2', 'Boat Rental Option 3']);

    // Copy images for each activity type
    const imagesToCopy = [
      { oldIds: oldJetSkiActivities.data?.map(a => a.id) || [], newId: jetSkiActivity.data.id },
      { oldIds: oldFormulaActivities.data?.map(a => a.id) || [], newId: formulaActivity.data.id },
      { oldIds: oldBoatActivities.data?.map(a => a.id) || [], newId: boatActivity.data.id }
    ];

    for (const { oldIds, newId } of imagesToCopy) {
      if (oldIds.length > 0) {
        const { data: images } = await supabase
          .from('activity_images')
          .select('image_url, alt_text, sort_order')
          .in('activity_id', oldIds);

        if (images && images.length > 0) {
          const imagesToInsert = images.map((img, index) => ({
            activity_id: newId,
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_primary: index === 0, // First image is primary
            sort_order: img.sort_order || index
          }));

          await supabase
            .from('activity_images')
            .insert(imagesToInsert);
        }
      }
    }

    console.log('✅ Images copied successfully\n');

    // =============================================
    // STEP 5: Verification
    // =============================================
    console.log('📝 Step 5: Verifying consolidation...');

    const { data: consolidatedActivities } = await supabase
      .from('activities')
      .select(`
        id,
        title,
        slug,
        category,
        activity_pricing (
          id,
          description,
          base_price,
          currency,
          duration_minutes,
          max_participants
        ),
        activity_images (
          id,
          image_url,
          is_primary
        )
      `)
      .in('slug', ['jet-ski-adventure-tour', 'formula-racing-experience', 'private-boat-rental']);

    console.log('✅ Consolidated Activities:');
    consolidatedActivities?.forEach(activity => {
      console.log(`  📍 ${activity.title}`);
      console.log(`     - Pricing options: ${activity.activity_pricing.length}`);
      console.log(`     - Images: ${activity.activity_images.length}`);
      console.log(`     - Slug: ${activity.slug}\n`);
    });

    // =============================================
    // STEP 6: Update existing bookings (if any)
    // =============================================
    console.log('📝 Step 6: Updating existing bookings...');

    // Get old activity IDs for updating bookings
    const allOldActivityIds = [
      ...oldJetSkiActivities.data?.map(a => a.id) || [],
      ...oldFormulaActivities.data?.map(a => a.id) || [],
      ...oldBoatActivities.data?.map(a => a.id) || []
    ];

    if (allOldActivityIds.length > 0) {
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('id, activity_id')
        .in('activity_id', allOldActivityIds);

      if (existingBookings && existingBookings.length > 0) {
        console.log(`   Found ${existingBookings.length} existing bookings to update`);
        
        // Update bookings in batches by activity type
        const jetSkiBookings = existingBookings.filter(b => 
          oldJetSkiActivities.data?.some(a => a.id === b.activity_id)
        );
        const formulaBookings = existingBookings.filter(b => 
          oldFormulaActivities.data?.some(a => a.id === b.activity_id)
        );
        const boatBookings = existingBookings.filter(b => 
          oldBoatActivities.data?.some(a => a.id === b.activity_id)
        );

        // Update each group
        if (jetSkiBookings.length > 0) {
          await supabase
            .from('bookings')
            .update({ activity_id: jetSkiActivity.data.id })
            .in('id', jetSkiBookings.map(b => b.id));
        }
        if (formulaBookings.length > 0) {
          await supabase
            .from('bookings')
            .update({ activity_id: formulaActivity.data.id })
            .in('id', formulaBookings.map(b => b.id));
        }
        if (boatBookings.length > 0) {
          await supabase
            .from('bookings')
            .update({ activity_id: boatActivity.data.id })
            .in('id', boatBookings.map(b => b.id));
        }

        console.log('✅ Bookings updated successfully');
      } else {
        console.log('   No existing bookings found');
      }
    }

    console.log('\n🎉 Consolidation completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   • Created 3 consolidated activities');
    console.log('   • Created 7 pricing variations total');
    console.log('   • Copied all images from old activities');
    console.log('   • Updated existing bookings (if any)');
    console.log('\n⚠️  Note: Old duplicate activities are still present.');
    console.log('   Run the cleanup script to remove them after verification.');

  } catch (error) {
    console.error('❌ Error during consolidation:', error);
  }
}

// Run the consolidation
consolidateActivities();