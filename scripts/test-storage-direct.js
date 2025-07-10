// Test storage without MCP
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupStorage() {
  console.log('🚀 Setting up Supabase storage directly...\n')
  
  try {
    // Create images bucket if it doesn't exist
    const { data: existingBucket } = await supabase.storage.getBucket('images')
    
    if (!existingBucket) {
      const { data, error } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (error) {
        console.error('❌ Error creating bucket:', error.message)
      } else {
        console.log('✅ Created "images" bucket')
      }
    } else {
      console.log('✅ "images" bucket already exists')
    }
    
    // List all buckets
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('\n📦 Available storage buckets:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    console.log('\n✅ Storage is ready for uploads!')
    console.log('🔗 Upload images at: http://localhost:3002/admin/simple-upload')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupStorage()