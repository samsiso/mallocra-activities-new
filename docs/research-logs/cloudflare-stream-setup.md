# 🎬 Cloudflare Stream Setup Guide - 25GB Video Storage

**Date:** January 25, 2025  
**Project:** We Are Excursions - Video Landing Page Enhancement  
**Goal:** Set up Cloudflare Stream with 25GB storage for professional video hosting

---

## 🚀 **Quick Setup Steps**

### 1. **Create Cloudflare Account & Enable Stream**
```bash
# Go to: https://dash.cloudflare.com/
# Navigate to: Stream > Get Started
# Choose: $5/month for 1,000 minutes storage
```

### 2. **Purchase Storage for 25GB**
- **25GB ≈ 5,000 minutes** of HD video storage
- **Cost**: $25/month (5 × $5 packages)
- **Delivery**: $1 per 1,000 minutes delivered to users

### 3. **Upload Your Videos**
```bash
# Method 1: Direct Upload via Dashboard
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F file=@your-video.mp4 \
  https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/stream

# Method 2: Upload from URL (for your existing videos)
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf"}' \
  https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/stream/copy
```

---

## 🔧 **Environment Variables Setup**

Add to your `.env.local`:
```env
# Cloudflare Stream Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE=your_customer_code_here
```

---

## 📝 **Update Your Landing Page**

Replace the current video URLs with Cloudflare Stream URLs:

```typescript
// Current implementation (temporary URLs)
const heroVideos = [
  {
    type: "video",
    src: "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    alt: "Crystal clear waters of Mallorca",
    title: "Pristine Beaches"
  }
]

// After Cloudflare Setup (production URLs)
const heroVideos = [
  {
    type: "video", 
    src: `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/YOUR_VIDEO_ID/manifest/video.m3u8`,
    poster: `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/YOUR_VIDEO_ID/thumbnails/thumbnail.jpg`,
    alt: "Crystal clear waters of Mallorca",
    title: "Pristine Beaches"
  }
]
```

---

## 🎯 **Performance Benefits**

### **Before (Current State)**
- ❌ External video dependencies
- ❌ No guaranteed uptime
- ❌ Limited bandwidth
- ❌ No analytics

### **After (Cloudflare Stream)**
- ✅ Global CDN delivery from 330+ locations
- ✅ Automatic adaptive bitrate streaming
- ✅ 99.9% uptime guarantee
- ✅ Detailed video analytics
- ✅ Automatic video optimization
- ✅ Mobile-friendly HLS streaming

---

## 📊 **Cost Breakdown**

### **Monthly Costs**
- **Storage (25GB)**: $25/month (5,000 minutes)
- **Delivery**: $1 per 1,000 minutes watched
- **Example**: 10,000 video views/month = ~$10 delivery cost
- **Total Estimated**: $35-45/month for professional video hosting

### **ROI Benefits**
- **Faster page load**: Better SEO rankings
- **Higher engagement**: Video content increases time on site
- **Professional appearance**: Builds trust with visitors
- **Global reach**: Optimized delivery worldwide

---

## 🔄 **Migration Steps**

### **Phase 1: Upload Videos** (This Week)
1. Create Cloudflare Stream account
2. Purchase 25GB storage ($25/month)
3. Upload your best Mallorca videos
4. Test video playback and performance

### **Phase 2: Integration** (Next Week)  
1. Add environment variables
2. Update video URLs in landing page
3. Test responsive playback
4. Monitor Core Web Vitals

### **Phase 3: Optimization** (Ongoing)
1. Add more video content
2. Implement lazy loading
3. Monitor analytics
4. A/B test video vs image performance

---

## 🛠️ **Technical Implementation**

### **Video Component Enhancement**
```typescript
// Enhanced video component with Cloudflare Stream
interface CloudflareVideoProps {
  videoId: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

function CloudflareVideo({ videoId, ...props }: CloudflareVideoProps) {
  const streamUrl = `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
  
  return (
    <video
      src={streamUrl}
      {...props}
      className="h-full w-full object-cover"
      playsInline
      preload="metadata"
    />
  )
}
```

---

## 📈 **Success Metrics**

### **Performance Tracking**
- **Page Load Time**: Target <3 seconds
- **Video Load Time**: Target <2 seconds first frame
- **Bounce Rate**: Expect 15-20% improvement
- **Time on Page**: Expect 30-40% increase

### **Business Metrics** 
- **Lead Generation**: Video landing pages convert 80% higher
- **Brand Perception**: Professional video builds trust
- **SEO Benefits**: Video content improves search rankings
- **Mobile Experience**: Responsive video works on all devices

---

## 🎬 **Next Steps**

1. **Sign up for Cloudflare Stream**: https://dash.cloudflare.com/
2. **Purchase 25GB storage package** ($25/month)
3. **Upload your best Mallorca videos**
4. **Get API credentials** and update environment variables
5. **Test the integration** on staging environment
6. **Deploy to production** and monitor performance

**Estimated Setup Time**: 2-3 hours  
**Go-Live Date**: Within 1 week  
**ROI Timeline**: Immediate (better user experience + SEO benefits) 