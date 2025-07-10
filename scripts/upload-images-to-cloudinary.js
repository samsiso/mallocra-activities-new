// Quick script to upload images to Cloudinary
// Run with: node scripts/upload-images-to-cloudinary.js

const cloudinary = require('cloudinary').v2;

// Configure with your credentials
cloudinary.config({
  cloud_name: 'dfqvslgiy',
  api_key: 'YOUR_API_KEY', // Add your API key here
  api_secret: 'YOUR_API_SECRET' // Add your API secret here
});

// Upload a single image
async function uploadImage(imagePath, folder = 'activities') {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });
    
    console.log('✅ Uploaded:', result.public_id);
    console.log('📍 URL:', result.secure_url);
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Example usage:
// uploadImage('./images/mallorca-beach.jpg', 'activities/beach');

// Bulk upload from a folder
const fs = require('fs');
const path = require('path');

async function uploadFolder(localFolder, cloudinaryFolder) {
  const files = fs.readdirSync(localFolder);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const filePath = path.join(localFolder, file);
      await uploadImage(filePath, cloudinaryFolder);
    }
  }
}

// Example: Upload all images from a local folder
// uploadFolder('./images', 'activities');

console.log('🎯 Add your API credentials and uncomment the upload commands!');