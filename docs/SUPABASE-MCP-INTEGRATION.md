# 🗄️ **Supabase MCP Integration Guide**

---

## 🎯 **Supabase MCP Setup for Autonomous Development**

### 🔧 **MCP Configuration**
```json
{
  "mcps": {
    "supabase": {
      "url": "env:NEXT_PUBLIC_SUPABASE_URL",
      "anon_key": "env:NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "service_role_key": "env:SUPABASE_SERVICE_ROLE_KEY"
    }
  }
}
```

### 🏗️ **Database Architecture Overview**
Our Supabase database follows this structure:

```
📊 Database Schema
├── activities (main content)
├── bookings (reservations)
├── users (Clerk integration)
├── reviews (user feedback)  
├── media (Cloudinary assets)
├── profiles (extended user data)
└── todos (task management)
```

---

## 🔍 **Database Schema Deep Dive**

### 🎯 **Activities Table**
```sql
activities
├── id (uuid, primary key)
├── title (text)
├── description (text)
├── price (decimal)
├── duration (integer, minutes)
├── location (text)
├── category (text)
├── image_url (text, Cloudinary)
├── featured (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 🎫 **Bookings Table**
```sql
bookings
├── id (uuid, primary key)
├── activity_id (uuid, FK to activities)
├── user_id (text, Clerk user ID)
├── booking_date (date)
├── participants (integer)
├── total_amount (decimal)
├── status (enum: pending, confirmed, cancelled)
├── stripe_payment_id (text)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 👤 **Users/Profiles Integration**
```sql
profiles
├── id (uuid, primary key)
├── clerk_user_id (text, unique)
├── email (text)
├── full_name (text)
├── phone (text)
├── preferences (jsonb)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## ⚡ **Autonomous Database Operations**

### 🔧 **Client Usage Patterns**

#### Server-Side Operations (Server Components/Actions)
```typescript
import { createClient } from '@/lib/supabase-server'

// For server components and server actions
export async function getActivities() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('featured', true)
  
  if (error) throw error
  return data
}
```

#### Client-Side Operations (Client Components)
```typescript
import { createClient } from '@/lib/supabase'

// For client components with user interaction
export function useActivities() {
  const supabase = createClient()
  // Real-time subscriptions, user-specific queries
}
```

### 🎯 **Common Query Patterns**

#### Activities with Filters
```typescript
// Search and filter activities
const { data } = await supabase
  .from('activities')
  .select(`
    *,
    reviews(rating, comment),
    media(url, type)
  `)
  .ilike('title', `%${searchTerm}%`)
  .eq('category', category)
  .order('created_at', { ascending: false })
```

#### Booking Creation
```typescript
// Create new booking with validation
const { data, error } = await supabase
  .from('bookings')
  .insert({
    activity_id: activityId,
    user_id: clerkUserId,
    booking_date: date,
    participants: count,
    total_amount: price * count,
    status: 'pending'
  })
  .select()
  .single()
```

#### User Profile Sync
```typescript
// Sync Clerk user with Supabase profile
const { data } = await supabase
  .from('profiles')
  .upsert({
    clerk_user_id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    full_name: `${user.firstName} ${user.lastName}`,
    updated_at: new Date().toISOString()
  })
```

---

## 🚀 **Autonomous MCP Workflow**

### 🔍 **1. Research Phase (Use MCP)**
```bash
# Use Supabase MCP to understand current data
supabase:query "SELECT * FROM activities WHERE featured = true LIMIT 5"
supabase:describe activities
supabase:relationships activities
```

### 💡 **2. Innovation Phase**
- Leverage existing data relationships
- Build on current schema patterns
- Consider performance implications
- Plan for real-time features

### 📋 **3. Planning Phase**
- Map out required queries
- Plan for error handling
- Consider caching strategies
- Design for scalability

### ⚡ **4. Execution Phase**
- Use appropriate Supabase client
- Implement proper error handling
- Add loading states
- Test with real data

### 🔎 **5. Review Phase**
- Test queries with MCP
- Verify data integrity
- Check performance
- Update documentation

---

## 🔄 **Real-time Features**

### 📡 **Subscription Patterns**
```typescript
// Real-time booking updates
const channel = supabase
  .channel('bookings')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bookings' },
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe()
```

### 🎯 **Use Cases for Real-time**
- Live booking availability
- Activity updates
- Admin dashboard metrics
- User notifications

---

## 🛡️ **Security & RLS Policies**

### 🔒 **Row Level Security**
```sql
-- Activities are public read
CREATE POLICY "Activities are viewable by everyone" 
ON activities FOR SELECT 
USING (true);

-- Users can only see their own bookings
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid()::text = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can insert own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);
```

### 🎯 **Security Best Practices**
- Always use RLS policies
- Validate user permissions
- Sanitize input data
- Use service role key only on server
- Never expose sensitive data

---

## 🎯 **Performance Optimization**

### ⚡ **Query Optimization**
```typescript
// Efficient data fetching with joins
const { data } = await supabase
  .from('activities')
  .select(`
    id,
    title,
    price,
    image_url,
    reviews!inner(rating)
  `)
  .gte('reviews.rating', 4)
  .limit(10)
```

### 📊 **Caching Strategies**
- Use React Query for client-side caching
- Implement ISR for static content
- Cache expensive aggregations
- Use CDN for media assets

---

## 🐛 **Error Handling Patterns**

### 🔧 **Server Action Error Handling**
```typescript
'use server'

export async function createBooking(formData: FormData) {
  try {
    const supabase = createClient()
    const data = await supabase
      .from('bookings')
      .insert(validatedData)
      .select()
      .single()
    
    if (data.error) {
      return { success: false, error: data.error.message }
    }
    
    revalidatePath('/bookings')
    return { success: true, data: data.data }
  } catch (error) {
    return { success: false, error: 'Failed to create booking' }
  }
}
```

### 🎯 **Client Error Handling**
```typescript
// Client component error handling with toast
try {
  const { data, error } = await supabase.from('activities').select()
  if (error) throw error
} catch (error) {
  toast.error('Failed to load activities')
  console.error('Activities error:', error)
}
```

---

## 📋 **Autonomous Development Checklist**

### ✅ **Before Database Operations**
- [ ] Check existing schema in `/db/schema/`
- [ ] Verify RLS policies are in place
- [ ] Choose appropriate Supabase client
- [ ] Plan error handling strategy

### ✅ **During Implementation**
- [ ] Use TypeScript for type safety
- [ ] Implement proper loading states
- [ ] Add comprehensive error handling
- [ ] Test with real data via MCP

### ✅ **After Implementation**
- [ ] Test queries with Supabase MCP
- [ ] Verify security policies work
- [ ] Check performance metrics
- [ ] Update schema documentation

---

## 🧪 **Testing with MCP**

### 🔍 **Query Testing**
```bash
# Test activity queries
supabase:query "SELECT COUNT(*) FROM activities WHERE featured = true"

# Test booking relationships
supabase:query "
  SELECT b.*, a.title 
  FROM bookings b 
  JOIN activities a ON b.activity_id = a.id 
  LIMIT 5
"

# Test user data
supabase:query "SELECT * FROM profiles WHERE clerk_user_id = 'user_123'"
```

### 📊 **Performance Testing**
```bash
# Check query performance
supabase:explain "SELECT * FROM activities WHERE category = 'adventure'"

# Analyze table stats
supabase:stats activities
supabase:stats bookings
```

---

**🎯 Key Takeaway**: Use Supabase MCP for immediate database understanding and testing, then implement using the appropriate client pattern for your component type (server vs client).