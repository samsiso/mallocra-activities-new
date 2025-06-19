# External Media Storage Solutions

## Problem Statement

Supabase Storage has a limited quota (500MB) which is insufficient for storing many images and videos. We need a solution that allows us to store and serve media files without quickly depleting this limited storage.

## Solution: Cloudinary Integration

### Overview

We've implemented a Cloudinary-based solution that:

1. Stores actual media files on Cloudinary's servers
2. Only stores lightweight metadata in the Supabase database
3. Optimizes media delivery with CDN and transformation capabilities

### Key Components

1. **Media Service** (`lib/media-service.ts`): Core service that interacts with Cloudinary API
2. **Media Schema** (`db/schema/media-schema.ts`): Database schema for storing media metadata
3. **Media Actions** (`actions/db/media-actions.ts`): Server actions for media operations
4. **UI Components**:
   - `OptimizedImage`: Component for efficient image display
   - `OptimizedVideo`: Component for efficient video display
   - `MediaUpload`: Component for uploading media
   - `MediaGallery`: Component for displaying media items

### Technical Details

#### Cloudinary Configuration

```typescript
// In lib/media-service.ts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
```

#### Required Environment Variables

Add these to your `.env.local` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Benefits

1. **Unlimited Storage**: Cloudinary's free tier includes 25GB storage and 25GB bandwidth monthly
2. **Automatic Optimization**: Images and videos are automatically optimized
3. **On-the-fly Transformations**: Resize, crop, and format media through URL parameters
4. **CDN Delivery**: Fast global content delivery
5. **Bandwidth Savings**: Adaptive streaming and progressive loading

### Implementation Details

#### Media Metadata Schema

```typescript
export const mediaTable = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  
  // External storage metadata (Cloudinary)
  cloudinaryId: text("cloudinary_id").notNull(),
  publicUrl: text("public_url").notNull(),
  secureUrl: text("secure_url").notNull(),
  
  // Media information
  type: mediaTypeEnum("type").notNull(),
  format: text("format").notNull(),
  width: text("width").notNull(),
  height: text("height").notNull(),
  
  // Association metadata
  activityId: uuid("activity_id"), // Optional link to an activity
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})
```

#### Upload Flow

1. User selects a file in `MediaUpload` component
2. File is uploaded directly to Cloudinary via `MediaService.uploadMedia()`
3. Metadata is stored in Supabase via `uploadMediaAction()`
4. UI is updated with the newly uploaded media

#### Image/Video Display

The `OptimizedImage` and `OptimizedVideo` components handle efficient media loading with:

- Lazy loading
- Responsive sizing
- Cloudinary transformations
- Loading indicators

### Alternative Solutions Considered

1. **Traditional CDNs**: More complex setup, less specialized for media
2. **S3-compatible Storage**: Requires more configuration and doesn't include transformations
3. **Imgur API**: Limited to images only, less control
4. **YouTube/Vimeo Embeds**: Video-only solution with limited customization

### Demo

A demo page is available at `/media-demo` showcasing the upload and gallery components.

## Future Improvements

1. **Bulk Uploads**: Add support for uploading multiple files
2. **Advanced Transformations**: Expose more Cloudinary transformation options
3. **Upload Progress**: Show upload progress indicator for large files
4. **Client-side Compression**: Add optional client-side compression before upload
5. **Media Tags**: Add ability to tag and categorize media

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [next-cloudinary package](https://next-cloudinary.spacejelly.dev/)
- [Demo Page](/media-demo) 