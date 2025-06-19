# 🎯 Activity Detail Page - Complete Implementation Guide

**Page**: `/activities/[id]`  
**Priority**: Critical Path - Primary conversion page  
**Complexity**: High - Rich media, real-time data, booking integration  
**Conversion Impact**: 🔥 60% of bookings start from this page

---

## 📋 **Complete Task List**

### **🏗️ Phase 1: Core Page Structure (CRITICAL)**

#### **Task 1.1: Dynamic Route Setup**
**Priority**: ⭐⭐⭐⭐⭐  
**File**: `app/activities/[id]/page.tsx`  
**Dependencies**: Activity database schema, Supabase integration

**Requirements**:
```tsx
// Page structure with proper SEO and loading states
export default async function ActivityDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const activity = await getActivityById(params.id)
  
  if (!activity) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <ActivityDetailContent activity={activity} />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const activity = await getActivityById(params.id)
  return {
    title: `${activity.title} - Mallorca Activities`,
    description: activity.description,
    openGraph: {
      title: activity.title,
      description: activity.description,
      images: [activity.primaryImage]
    }
  }
}
```

**Data Requirements**:
```typescript
interface Activity {
  id: string
  title: string
  description: string
  shortDescription: string
  category: ActivityCategory
  duration: number // in minutes
  maxParticipants: number
  minAge: number
  difficulty: 'easy' | 'moderate' | 'challenging'
  location: {
    name: string
    coordinates: [number, number]
    meetingPoint: string
  }
  pricing: {
    adult: number
    child: number
    senior: number
    group: number
  }
  images: ActivityImage[]
  videos?: ActivityVideo[]
  included: string[]
  excluded: string[]
  requirements: string[]
  cancellationPolicy: string
  weatherDependent: boolean
  languages: string[]
  operatorId: string
  operator: Operator
  reviews: Review[]
  averageRating: number
  totalReviews: number
  availability: AvailabilitySlot[]
}
```

---

#### **Task 1.2: Hero Section with Image Gallery**
**Priority**: ⭐⭐⭐⭐⭐  
**Component**: `_components/activity-gallery.tsx`  
**Features**: Image carousel, video player, full-screen lightbox

**Component Requirements**:
```tsx
interface ActivityGalleryProps {
  images: ActivityImage[]
  videos?: ActivityVideo[]
  title: string
  className?: string
}

interface ActivityImage {
  id: string
  url: string
  alt: string
  caption?: string
  isPrimary: boolean
  order: number
}
```

**Features**:
- **Primary Image**: Large hero image with overlay title
- **Thumbnail Gallery**: Scrollable thumbnails below hero
- **Video Integration**: Play button overlay for videos
- **Lightbox**: Full-screen gallery with navigation
- **Mobile Optimization**: Swipe gestures, touch-friendly
- **Performance**: Lazy loading, Next.js Image optimization

**Implementation Details**:
- Use `framer-motion` for smooth transitions
- Implement touch/swipe support for mobile
- Keyboard navigation support (arrow keys)
- Auto-play prevention for videos
- Image placeholder during loading

---

#### **Task 1.3: Activity Information Section**
**Priority**: ⭐⭐⭐⭐⭐  
**Component**: `_components/activity-info.tsx`  

**Information Hierarchy**:
1. **Title & Rating**: Activity name with star rating
2. **Quick Stats**: Duration, group size, difficulty, age requirements
3. **Location**: Meeting point with map integration
4. **Description**: Rich text with highlights and key features
5. **What's Included**: Bullet points of included items
6. **What's Not Included**: Excluded items and additional costs
7. **Requirements**: What to bring, fitness level, restrictions
8. **Cancellation Policy**: Clear terms and conditions

**Component Structure**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Main Content - 2/3 width on desktop */}
  <div className="lg:col-span-2 space-y-6">
    <ActivityHeader />
    <ActivityDescription />
    <ActivityInclusions />
    <ActivityRequirements />
    <ActivityLocation />
  </div>
  
  {/* Sidebar - 1/3 width on desktop, full width mobile */}
  <div className="lg:col-span-1">
    <BookingWidget />
  </div>
</div>
```

---

#### **Task 1.4: Sticky Booking Widget**
**Priority**: ⭐⭐⭐⭐⭐  
**Component**: `_components/booking-widget.tsx`  
**Functionality**: Real-time availability, pricing, booking initiation

**Widget Features**:
- **Price Display**: Starting from price with currency
- **Availability Calendar**: Mini calendar with available dates
- **Participant Selection**: Adults/children counter
- **Date/Time Selection**: Available time slots
- **Add-ons Preview**: Popular extras with pricing
- **Total Price Calculation**: Live updating price
- **Book Now Button**: Primary CTA with loading states

**Responsive Behavior**:
- **Desktop**: Sticky sidebar widget
- **Tablet**: Fixed bottom bar
- **Mobile**: Floating action button with slide-up modal

**Integration Points**:
```typescript
// Real-time availability checking
const checkAvailability = async (activityId: string, date: string) => {
  const { data } = await supabase
    .from('activity_availability')
    .select('*, bookings(participants)')
    .eq('activity_id', activityId)
    .eq('date', date)
    .eq('status', 'available')
}

// Price calculation with add-ons
const calculateTotalPrice = (
  basePrice: number,
  participants: ParticipantCount,
  addOns: AddOnSelection[],
  selectedDate: string
) => {
  // Apply seasonal pricing, group discounts, add-on costs
}
```

---

### **🌟 Phase 2: Enhanced Features**

#### **Task 2.1: Reviews & Rating System**
**Priority**: ⭐⭐⭐⭐  
**Component**: `_components/reviews-section.tsx`

**Review Features**:
- **Rating Overview**: Average rating with distribution bars
- **Verified Reviews**: Badge for confirmed bookings
- **Review Filters**: Sort by rating, date, language
- **Photo Reviews**: Customer photos from experience
- **Helpful Voting**: Upvote helpful reviews
- **Operator Responses**: Business replies to reviews

**Review Component**:
```tsx
interface ReviewProps {
  review: {
    id: string
    customerName: string
    customerCountry: string
    rating: number
    reviewText: string
    reviewDate: string
    isVerified: boolean
    photos?: string[]
    operatorResponse?: string
    helpfulVotes: number
  }
  onHelpfulVote: (reviewId: string) => void
}
```

#### **Task 2.2: Similar Activities Recommendations**
**Priority**: ⭐⭐⭐  
**Component**: `_components/similar-activities.tsx`

**Recommendation Algorithm**:
```typescript
const getSimilarActivities = async (activity: Activity) => {
  // Algorithm factors:
  // 1. Same category (weight: 40%)
  // 2. Similar price range (weight: 30%)
  // 3. Same location area (weight: 20%)
  // 4. Similar duration (weight: 10%)
  
  return await supabase
    .from('activities')
    .select('*, reviews(rating)')
    .neq('id', activity.id)
    .eq('category', activity.category)
    .gte('price_adult', activity.pricing.adult * 0.7)
    .lte('price_adult', activity.pricing.adult * 1.3)
    .eq('status', 'active')
    .limit(6)
}
```

#### **Task 2.3: Interactive Map Integration**
**Priority**: ⭐⭐⭐  
**Component**: `_components/activity-map.tsx`

**Map Features**:
- **Meeting Point**: Exact location with marker
- **Directions**: Integration with Google Maps/Apple Maps
- **Nearby Activities**: Other activities in the area
- **Transport Options**: Public transport, parking info
- **Area Highlights**: Points of interest nearby

**Implementation**:
```tsx
// Use Leaflet for map integration
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const ActivityMap: React.FC<{ 
  location: ActivityLocation 
  nearbyActivities?: Activity[] 
}> = ({ location, nearbyActivities }) => {
  return (
    <MapContainer
      center={[location.coordinates[0], location.coordinates[1]]}
      zoom={15}
      className="h-64 w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={location.coordinates}>
        <Popup>{location.meetingPoint}</Popup>
      </Marker>
    </MapContainer>
  )
}
```

---

### **📱 Phase 3: Mobile Optimization**

#### **Task 3.1: Mobile-First Layout**
**Priority**: ⭐⭐⭐⭐  

**Mobile Layout Adjustments**:
- **Image Gallery**: Full-width hero with dots indicator
- **Information Cards**: Expandable sections to save space
- **Booking Widget**: Bottom-fixed with slide-up modal
- **Reviews**: Compact cards with load more functionality
- **Navigation**: Sticky header with back button

**Touch Interactions**:
- **Swipe Gallery**: Horizontal swipe for image navigation
- **Pull to Refresh**: Update availability and pricing
- **Tap to Expand**: Collapsible information sections
- **Long Press**: Quick actions (save, share)

#### **Task 3.2: Progressive Loading**
**Priority**: ⭐⭐⭐  

**Loading Strategy**:
1. **Critical Above-fold**: Hero image, title, price, book button
2. **Secondary Content**: Description, inclusions, basic info
3. **Below-fold**: Reviews, similar activities, detailed info
4. **Background**: High-res images, videos, map tiles

**Loading States**:
```tsx
// Skeleton components for loading states
<div className="space-y-4">
  <Skeleton className="h-64 w-full rounded-lg" />
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>
```

---

### **🔧 Phase 4: Advanced Functionality**

#### **Task 4.1: Real-time Features**
**Priority**: ⭐⭐⭐  

**Real-time Updates**:
- **Availability Changes**: Live capacity updates
- **Price Changes**: Dynamic pricing adjustments
- **Weather Alerts**: Weather-dependent activity status
- **Last-minute Deals**: Automatic discount application

**WebSocket Integration**:
```typescript
// Supabase real-time subscription
const activitySubscription = supabase
  .channel(`activity_${activityId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'activity_availability',
    filter: `activity_id=eq.${activityId}`
  }, handleAvailabilityUpdate)
  .subscribe()
```

#### **Task 4.2: Social Features**
**Priority**: ⭐⭐  

**Social Integration**:
- **Share Activity**: Social media sharing with rich previews
- **Save to Wishlist**: Heart icon with instant save
- **Recently Viewed**: Track user activity history
- **Social Proof**: "X people viewed this today"

#### **Task 4.3: Accessibility & SEO**
**Priority**: ⭐⭐⭐  

**Accessibility Features**:
- **Screen Reader**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Tab order and focus management
- **High Contrast**: Support for high contrast mode
- **Font Scaling**: Responsive to user font size preferences

**SEO Optimization**:
- **Rich Snippets**: Schema.org markup for activities
- **Meta Tags**: Complete Open Graph and Twitter Card data
- **Structured Data**: JSON-LD for search engines
- **Image Alt Text**: Descriptive alt text for all images

---

## 🛠️ **Technical Implementation**

### **Server Actions**
```typescript
// actions/activities/activity-actions.ts
export async function getActivityById(id: string)
export async function getActivityAvailability(id: string, dateRange: DateRange)
export async function getSimilarActivities(id: string)
export async function addToWishlist(userId: string, activityId: string)
export async function trackActivityView(activityId: string, userId?: string)
```

### **Database Queries**
```sql
-- Complete activity query with all related data
SELECT 
  a.*,
  o.business_name as operator_name,
  o.contact_info as operator_contact,
  AVG(r.rating) as average_rating,
  COUNT(r.id) as total_reviews,
  array_agg(DISTINCT ai.image_url) as images,
  array_agg(DISTINCT av.video_url) as videos
FROM activities a
LEFT JOIN operators o ON a.operator_id = o.id
LEFT JOIN reviews r ON a.id = r.activity_id
LEFT JOIN activity_images ai ON a.id = ai.activity_id
LEFT JOIN activity_videos av ON a.id = av.activity_id
WHERE a.id = $1 AND a.status = 'active'
GROUP BY a.id, o.business_name, o.contact_info;
```

### **Component Architecture**
```
app/activities/[id]/
├── page.tsx                     # Main page component
├── loading.tsx                  # Loading state
├── not-found.tsx               # 404 handling
├── error.tsx                   # Error boundary
└── _components/
    ├── activity-gallery.tsx    # Image/video gallery
    ├── activity-info.tsx       # Main information
    ├── booking-widget.tsx      # Booking interface
    ├── reviews-section.tsx     # Reviews and ratings
    ├── similar-activities.tsx  # Recommendations
    ├── activity-map.tsx        # Location map
    └── share-buttons.tsx       # Social sharing
```

---

## 📊 **Success Metrics & Testing**

### **Conversion Metrics**
- **Booking Conversion Rate**: Target 15%+ (industry average 8-12%)
- **Time on Page**: Target 3+ minutes average
- **Bounce Rate**: Target <40%
- **Add to Wishlist Rate**: Target 8%+

### **Performance Metrics**
- **Page Load Speed**: <2 seconds LCP
- **Mobile Performance**: 90+ Lighthouse score
- **Image Load Time**: <1 second above-fold images
- **Booking Widget Load**: <500ms interaction ready

### **User Experience Metrics**
- **Gallery Engagement**: 60%+ users view multiple images
- **Review Section Views**: 40%+ scroll to reviews
- **Map Interaction**: 25%+ click on location
- **Social Shares**: 5%+ share activity

### **A/B Testing Opportunities**
1. **Booking Widget Position**: Sticky vs inline vs floating
2. **Price Display**: Starting from vs exact pricing
3. **CTA Button Text**: "Book Now" vs "Reserve Spot" vs "Check Availability"
4. **Gallery Layout**: Carousel vs grid vs masonry
5. **Review Display**: Chronological vs rating-based sorting

---

## 🚨 **Error Handling & Edge Cases**

### **Data Loading Errors**
- **Activity Not Found**: Custom 404 page with similar suggestions
- **Network Errors**: Retry mechanism with offline message
- **Slow Loading**: Progressive loading with skeletons
- **Image Load Failures**: Fallback images and error handling

### **Availability Edge Cases**
- **Sold Out Activities**: Clear messaging with waitlist signup
- **Weather Cancellations**: Real-time weather status updates
- **Last-minute Changes**: Operator notifications and updates
- **Capacity Conflicts**: Real-time availability checking

### **Mobile-Specific Issues**
- **Slow Networks**: Optimized images and progressive loading
- **Small Screens**: Collapsible sections and optimized layouts
- **Touch Interactions**: Proper touch targets and gestures
- **Orientation Changes**: Responsive design for landscape/portrait

---

**🎯 ACTIVITY DETAIL PAGE READY**: Complete implementation guide for high-converting activity detail pages with all business requirements and technical specifications.