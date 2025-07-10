# 🚀 Storage Options for Mallorca Activities

## 📊 Quick Comparison

| Service | Free Storage | Free Bandwidth | Best For | Setup Time |
|---------|-------------|----------------|----------|------------|
| **ImageKit** ⭐ | Unlimited | 20GB/month | Images + Videos | 5 mins |
| **Uploadcare** | 3GB | 30GB/month | Easy UI | 5 mins |
| **Firebase** | 5GB | 1GB/day | Google ecosystem | 10 mins |
| **Backblaze B2** | 10GB | Unlimited* | Large files | 20 mins |
| **Cloudinary** | 25GB bandwidth total | - | Already using | - |
| **Supabase** | 1GB | 2GB/month | Already have | 0 mins |

*With Cloudflare CDN

## 🎯 Recommended: ImageKit

**Why ImageKit?**
- ✅ **Unlimited storage** (no 2GB limit!)
- ✅ **20GB bandwidth/month** (plenty for your needs)
- ✅ **Great drag-drop UI**
- ✅ **Automatic image optimization**
- ✅ **Works for both images AND videos**

## 📝 ImageKit Setup Instructions

1. **Sign up** at https://imagekit.io (free)
2. **Get credentials** from Dashboard → Developer Options
3. **Add to .env.local**:
   ```bash
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```
4. **Upload images** at http://localhost:3002/admin/imagekit-upload

## 🎬 What About Videos?

**Option 1**: Keep Cloudinary for existing videos (they work fine)
**Option 2**: Upload new videos to ImageKit (supports video too!)
**Option 3**: Use YouTube/Vimeo embeds (completely free)

## 💡 Migration Strategy

1. **Keep Cloudinary** for the 5 existing videos
2. **Use ImageKit** for all new images and videos
3. **No need to migrate** - just use both!

## 🔗 Upload Pages

- **ImageKit Upload**: `/admin/imagekit-upload`
- **Quick Import**: `/admin/quick-import`
- **Supabase Upload**: `/admin/upload-images`

Choose ImageKit for the best free experience!