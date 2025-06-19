# 🛠️ Development Context - AI Guidelines & Patterns

**Purpose**: Complete development guidance for AI assistants working on Mallorca Activities platform  
**Scope**: Architecture patterns, coding standards, business logic, and autonomous development workflow

---

## ⚡ **AUTONOMOUS DEVELOPMENT RULES**

### **🤖 Core AI Behavior**
- **ACT IMMEDIATELY**: Don't ask for permission, execute tasks
- **RESEARCH FIRST**: Always check existing patterns before creating
- **BATCH OPERATIONS**: Use multiple tool calls simultaneously for efficiency
- **QUALITY GATES**: Run type-check, lint, format before any commits
- **DOCUMENT PROGRESS**: Use TodoWrite extensively, update brain with learnings

### **🔄 RIPER Development Cycle**
Execute within each response:
1. **🔍 Research** - Understand existing code and requirements
2. **💡 Innovate** - Build on patterns, think creatively  
3. **📋 Plan** - Create implementation strategy with TodoWrite
4. **⚡ Execute** - Implement immediately with batch operations
5. **🔎 Review** - Test, verify, document, plan next steps

---

## 🏗️ **Technical Architecture Patterns**

### **Next.js App Router Structure**
```
app/
├── (marketing)/           # Public marketing pages
│   ├── page.tsx          # Landing page
│   └── landing/          # Landing components
├── (auth)/               # Authentication pages  
├── activities/           # Activity catalog and details
├── book/                 # Booking flow pages
├── admin/                # Admin dashboard
├── api/                  # API routes and webhooks
└── globals.css           # Global styles
```

### **Component Architecture**
```
components/
├── ui/                   # Base UI components (Shadcn/UI)
├── forms/               # Reusable form components
├── layout/              # Layout and navigation
├── business/            # Business-specific components
└── providers/           # Context providers
```

### **Server Actions Pattern**
```typescript
// actions/[domain]/[entity]-actions.ts
"use server"

import { createSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache" 
import { z } from "zod"

const createBookingSchema = z.object({
  activityId: z.string().uuid(),
  customerId: z.string().uuid(),
  // ... validation schema
})

export async function createBookingAction(data: FormData) {
  try {
    const supabase = createSupabaseServer()
    const validated = createBookingSchema.parse(Object.fromEntries(data))
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(validated)
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/bookings')
    return { success: true, data: booking }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 🗄️ **Database Patterns**

### **Supabase Client Usage**
```typescript
// Server Components & Actions
import { createSupabaseServer } from "@/lib/supabase-server"

// Client Components  
import { createSupabaseClient } from "@/lib/supabase"
```

### **Schema Patterns**
- **UUID Primary Keys**: All tables use `uuid` for security and scalability
- **Timestamps**: `created_at` and `updated_at` on all entities
- **Soft Deletes**: Use `deleted_at` instead of hard deletes where needed
- **Enums**: Strongly typed status fields (pending, confirmed, cancelled)
- **Foreign Keys**: Proper relationships with cascade rules

### **Query Patterns**
```typescript
// Real-time availability check
const { data: availability } = await supabase
  .from('activity_availability')
  .select(`
    *,
    activities(title, max_participants),
    bookings(participants)
  `)
  .eq('activity_id', activityId)
  .eq('date', selectedDate)
  .gte('available_spots', requestedSpots)
```

---

## 🎨 **UI/UX Development Standards**

### **Brand Color System**
```css
/* Primary Brand Colors */
--primary-pink: #fa057c
--accent-yellow: #fff546  
--white: #ffffff
--black: #000000

/* Glass Effects */
--glass-pink-light: rgb(250 5 124 / 0.15)
--glass-pink-medium: rgb(250 5 124 / 0.20)
--glass-white-light: rgb(255 255 255 / 0.20)
--glass-white-medium: rgb(255 255 255 / 0.25)
```

### **Component Styling Patterns**
```tsx
// Glass morphism pattern
<div className="backdrop-blur-md bg-pink-500/20 border border-pink-400/30 rounded-xl">

// Button patterns
<Button className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">

// Card patterns  
<Card className="bg-gradient-to-br from-gray-900/90 to-pink-900/20 border-pink-400/30">
```

### **Typography Hierarchy**
- **Hero Titles**: `text-4xl md:text-6xl font-bold`
- **Section Titles**: `text-2xl md:text-3xl font-semibold`
- **Card Titles**: `text-lg md:text-xl font-medium`
- **Body Text**: `text-sm md:text-base`
- **Captions**: `text-xs md:text-sm text-gray-400`

---

## 💼 **Business Logic Patterns**

### **Commission Calculation**
```typescript
export function calculateCommissions(bookingAmount: number, commissionRate: number = 0.15) {
  const platformCommission = bookingAmount * commissionRate
  const salespersonCommission = bookingAmount * 0.05 // 5% base rate
  const operatorNet = bookingAmount - platformCommission - salespersonCommission
  
  return {
    platformCommission,
    salespersonCommission, 
    operatorNet,
    totalFees: platformCommission + salespersonCommission
  }
}
```

### **Availability Management**
```typescript
export async function checkAvailability(
  activityId: string,
  date: string,
  participants: number
) {
  const supabase = createSupabaseServer()
  
  const { data } = await supabase
    .from('activity_availability')
    .select('*, bookings(participants)')
    .eq('activity_id', activityId)
    .eq('date', date)
    .single()
    
  const bookedSpots = data?.bookings?.reduce((sum, booking) => sum + booking.participants, 0) || 0
  const availableSpots = (data?.max_capacity || 0) - bookedSpots
  
  return {
    available: availableSpots >= participants,
    availableSpots,
    maxCapacity: data?.max_capacity || 0
  }
}
```

### **Pricing Engine**
```typescript
export function calculateActivityPrice(basePrice: number, options: PricingOptions) {
  let finalPrice = basePrice
  
  // Seasonal multiplier
  if (options.seasonalMultiplier) {
    finalPrice *= options.seasonalMultiplier
  }
  
  // Group discounts
  if (options.participants >= 4) {
    finalPrice *= 0.9 // 10% group discount
  }
  
  // Last-minute booking premium
  if (options.isLastMinute) {
    finalPrice *= 1.1 
  }
  
  return Math.round(finalPrice * 100) / 100 // Round to 2 decimals
}
```

---

## 🔐 **Authentication & Authorization**

### **Role-Based Access Control**
```typescript
export enum UserRole {
  CUSTOMER = 'customer',
  SALESPERSON = 'salesperson', 
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

export function requireRole(allowedRoles: UserRole[]) {
  return async function(req: Request) {
    const user = await getCurrentUser()
    if (!user || !allowedRoles.includes(user.role)) {
      throw new Error('Unauthorized')
    }
  }
}
```

### **Route Protection Patterns**
```typescript
// Middleware for protected routes
export default clerkMiddleware((auth, req) => {
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    auth().protect({ role: 'admin' })
  }
  
  // Protect user dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    auth().protect()
  }
})
```

---

## 📱 **Mobile-First Development**

### **Responsive Design Patterns**
```tsx
// Mobile-first component structure
<div className="
  // Mobile (default)
  flex flex-col space-y-4 p-4
  
  // Tablet
  md:flex-row md:space-y-0 md:space-x-6 md:p-6
  
  // Desktop  
  lg:max-w-6xl lg:mx-auto lg:p-8
">
```

### **Touch-Optimized Interactions**
- **Minimum Touch Targets**: 44px × 44px minimum
- **Swipe Gestures**: Implement for carousels and galleries
- **Loading States**: Always show loading for async operations
- **Offline Support**: Cache critical data for poor connectivity

---

## 🧪 **Testing & Quality Standards**

### **Type Safety Requirements**
```typescript
// All props must be properly typed
interface ActivityCardProps {
  activity: Activity
  onBook?: (activityId: string) => void
  showPricing?: boolean
  className?: string
}

// Zod schemas for all API inputs
const createBookingSchema = z.object({
  activityId: z.string().uuid(),
  participants: z.number().min(1).max(20),
  selectedDate: z.string().datetime(),
  customerDetails: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional()
  })
})
```

### **Error Handling Patterns**
```typescript
// Server Actions error handling
export async function createBookingAction(data: FormData) {
  try {
    const validated = createBookingSchema.parse(Object.fromEntries(data))
    // ... processing
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Client component error handling  
const [booking, setBooking] = useState<BookingState>({ 
  status: 'idle',
  data: null,
  error: null 
})
```

---

## 🚀 **Performance Optimization**

### **Image Optimization**
```tsx
import Image from "next/image"

<Image
  src={activity.imageUrl}
  alt={activity.title}
  width={400}
  height={300}
  className="rounded-lg object-cover"
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### **Dynamic Imports**
```tsx
// Lazy load heavy components
const ActivityMap = dynamic(() => import('./activity-map'), {
  loading: () => <MapSkeleton />,
  ssr: false
})
```

### **Database Query Optimization**
```typescript
// Use select to limit data transfer
const { data } = await supabase
  .from('activities')
  .select('id, title, price, image_url') // Only needed fields
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(12)
```

---

## 🔧 **Development Tools & Commands**

### **Essential Commands**
```bash
# Development with type checking
npm run dev              # Start development server
npm run type-check       # TypeScript check without emit
npm run lint            # ESLint check
npm run lint:fix        # Fix linting issues
npm run format:write    # Format with Prettier

# Database operations
npm run db:generate     # Generate Drizzle migrations  
npm run db:migrate      # Run database migrations

# Production build
npm run build          # Build for production
npm run analyze        # Bundle size analysis
```

### **Git Workflow**
```bash
# Quality checks before commit (MANDATORY)
npm run type-check && npm run lint:fix && npm run format:write

# Conventional commits
git commit -m "feat: add activity booking flow
- Implement multi-step booking process
- Add Stripe payment integration  
- Include booking confirmation emails"
```

---

## 📊 **Monitoring & Analytics**

### **PostHog Integration**
```typescript
// Track business events
posthog.capture('booking_completed', {
  activity_id: booking.activityId,
  booking_value: booking.totalAmount,
  payment_method: booking.paymentMethod,
  customer_type: booking.customerType
})

// Feature flags
const showNewBookingFlow = posthog.isFeatureEnabled('new-booking-flow')
```

### **Performance Monitoring**
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    posthog.capture('web_vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id
    })
  }
}
```

---

## 🛡️ **Security Patterns**

### **Input Validation**
```typescript
// Always validate inputs with Zod
const userInputSchema = z.object({
  email: z.string().email().max(255),
  message: z.string().max(1000),
  activityId: z.string().uuid()
})

// Sanitize HTML inputs
import DOMPurify from 'isomorphic-dompurify'
const sanitizedContent = DOMPurify.sanitize(userInput)
```

### **Rate Limiting**
```typescript
// API route protection
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10 s")
})

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 })
  }
}
```

---

## 🎯 **AI Development Checklist**

### **Before Starting Any Task**
- [ ] Read relevant brain context files
- [ ] Check existing patterns in codebase
- [ ] Understand business requirements
- [ ] Create TodoList with specific tasks
- [ ] Verify dependencies in package.json

### **During Development**
- [ ] Use established component patterns
- [ ] Follow brand color guidelines (pink/yellow theme)
- [ ] Implement proper TypeScript typing
- [ ] Add loading and error states
- [ ] Test on mobile first

### **Before Completing**
- [ ] Run type-check (MANDATORY)
- [ ] Run lint:fix (MANDATORY)  
- [ ] Run format:write (MANDATORY)
- [ ] Test booking flow end-to-end
- [ ] Update brain with new patterns
- [ ] Document in TodoList completion

---

**🛠️ DEVELOPMENT CONTEXT READY**: Complete guidance for autonomous Mallorca Activities platform development with established patterns and quality standards.