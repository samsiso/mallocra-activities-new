# 🎫 Booking System - Complete Feature Guide

**Priority**: Critical Path - Revenue Generating  
**Complexity**: High - Multi-step flow with payments  
**Dependencies**: Activities catalog, User auth, Stripe integration

---

## 🎯 **Feature Overview**

The booking system is the core revenue-generating feature that converts activity browsers into paying customers. It handles the complete customer journey from activity selection to confirmation with digital ticket delivery.

### **Business Requirements**
- **Conversion Optimization**: Minimize booking abandonment (target <25%)
- **Payment Flexibility**: Support full payment and deposit options
- **Multi-currency**: EUR primary, USD/GBP support for tourists
- **Real-time Availability**: Prevent overbooking with live inventory
- **Mobile-first**: 70%+ bookings happen on mobile devices

---

## 📋 **Complete Task List**

### **🏗️ Phase 1: Core Booking Flow (CRITICAL)**

#### **Task 1.1: Booking Widget Component**
**Priority**: ⭐⭐⭐⭐⭐  
**Location**: `app/activities/[id]/_components/booking-widget.tsx`  
**Dependencies**: Activity data, availability API

**Requirements**:
- Sticky positioning on activity detail page
- Real-time availability checking
- Participant selection (adults/children with age validation)
- Date/time picker with disabled unavailable slots
- Live price calculation with add-ons
- "Book Now" CTA with loading states

**Implementation Details**:
```tsx
interface BookingWidgetProps {
  activity: Activity
  availability: AvailabilitySlot[]
  onBookingStart: (selection: BookingSelection) => void
}

interface BookingSelection {
  activityId: string
  selectedDate: string
  selectedTime: string
  participants: {
    adults: number
    children: number
    childAges?: number[]
  }
  addOns: AddOnSelection[]
  totalPrice: number
}
```

**Edge Cases**:
- No availability for selected dates
- Capacity constraints during selection
- Price changes during booking flow
- Weather-dependent activity cancellations

---

#### **Task 1.2: Multi-Step Booking Flow Pages**

##### **Step 1: Selection Page (`/book/[id]/select`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `BookingProgress` - 3-step progress indicator
- `ActivitySummary` - Activity details recap
- `ParticipantSelector` - Age-based pricing
- `DateTimeSelector` - Calendar with availability
- `AddOnsSelector` - Optional extras (equipment, photos, meals)
- `PricingSummary` - Real-time total with breakdown

**Business Logic**:
- Dynamic pricing based on date/season
- Group discounts (4+ people = 10% off)
- Child pricing (under 12 = 20% off)
- Senior pricing (65+ = 15% off)
- Last-minute booking fee (+10% within 24h)

**Validation Rules**:
- Minimum participants: 1
- Maximum participants: Activity capacity
- Children require age specification
- Add-ons availability checking

##### **Step 2: Details Page (`/book/[id]/details`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `CustomerForm` - Personal information collection
- `ParticipantDetails` - Individual participant info
- `SpecialRequests` - Dietary, accessibility, etc.
- `AccountCreation` - Optional user account setup
- `TermsAcceptance` - Legal agreements
- `BookingSummary` - Final order review

**Data Collection**:
```typescript
interface BookingDetails {
  leadCustomer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
  }
  participants: Participant[]
  specialRequests?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  termsAccepted: boolean
  marketingOptIn: boolean
}
```

##### **Step 3: Payment Page (`/book/[id]/payment`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `PaymentMethodSelector` - Cards, PayPal, Apple Pay, Google Pay
- `StripePaymentForm` - Secure payment processing
- `DepositOptions` - Full payment vs 20% deposit
- `FinalReview` - Last chance to modify
- `SecurityBadges` - Trust signals (SSL, secure payment)

**Payment Options**:
- **Full Payment**: 100% upfront, 5% discount
- **Deposit Payment**: 20% now, remainder 24h before activity
- **Group Payment**: Split payment between multiple cards

**Stripe Integration**:
```typescript
interface PaymentIntent {
  amount: number
  currency: 'EUR' | 'USD' | 'GBP'
  bookingId: string
  customerId?: string
  metadata: {
    activityId: string
    activityDate: string
    participants: number
  }
}
```

---

#### **Task 1.3: Booking Confirmation Flow**

##### **Confirmation Page (`/booking/[bookingId]/confirmation`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `BookingConfirmation` - Success message and booking number
- `DigitalTicket` - QR code for activity check-in
- `CalendarIntegration` - Add to Google/Apple calendar
- `NextSteps` - What to bring, meeting point, contact info
- `SocialSharing` - Share experience on social media

**Digital Ticket Requirements**:
```typescript
interface DigitalTicket {
  bookingId: string
  qrCode: string // Base64 encoded QR
  activityTitle: string
  activityDate: string
  meetingPoint: string
  participantCount: number
  specialInstructions: string[]
  operatorContact: string
  cancellationPolicy: string
}
```

##### **Booking Management (`/booking/[bookingId]`)**
**Priority**: ⭐⭐⭐⭐  
**Features**:
- View booking details
- Modify participant information
- Cancel booking (with refund calculation)
- Add participants (if capacity allows)
- Contact operator directly
- Download/print tickets

---

### **🔧 Phase 2: Advanced Booking Features**

#### **Task 2.1: Availability Management System**
**Priority**: ⭐⭐⭐⭐  
**Components**: `AvailabilityEngine`, `CapacityManager`, `WeatherIntegration`

**Real-time Features**:
- Live capacity tracking across all booking channels
- Weather-based availability updates
- Operator manual availability override
- Seasonal availability templates
- Holiday and special event scheduling

**Database Schema**:
```sql
activity_availability (
  id uuid PRIMARY KEY,
  activity_id uuid REFERENCES activities(id),
  date date NOT NULL,
  time_slot time,
  max_capacity integer,
  available_spots integer,
  price_override decimal,
  status enum('available', 'limited', 'full', 'cancelled'),
  weather_dependent boolean,
  weather_status enum('good', 'marginal', 'cancelled'),
  created_at timestamp,
  updated_at timestamp
)
```

#### **Task 2.2: Advanced Pricing Engine**
**Priority**: ⭐⭐⭐  
**Features**:
- Dynamic pricing based on demand
- Seasonal multipliers (summer +20%, winter +0%)
- Early bird discounts (book 7+ days = 15% off)
- Last-minute premiums (book <24h = +10%)
- Group discounts and corporate rates
- Loyalty program integration

**Pricing Algorithm**:
```typescript
function calculateDynamicPrice(basePrice: number, factors: PricingFactors): number {
  let price = basePrice
  
  // Seasonal adjustment
  price *= factors.seasonalMultiplier
  
  // Demand adjustment (based on booking velocity)
  if (factors.demandLevel === 'high') price *= 1.15
  if (factors.demandLevel === 'low') price *= 0.95
  
  // Early bird discount
  if (factors.daysUntilActivity > 7) price *= 0.85
  
  // Last-minute premium
  if (factors.daysUntilActivity < 1) price *= 1.10
  
  // Group discount
  if (factors.participants >= 4) price *= 0.90
  
  return Math.round(price * 100) / 100
}
```

#### **Task 2.3: Payment Processing & Commission System**
**Priority**: ⭐⭐⭐⭐  
**Components**: `PaymentProcessor`, `CommissionCalculator`, `PayoutManager`

**Commission Logic**:
```typescript
interface CommissionBreakdown {
  bookingAmount: number
  platformCommission: number    // 15-20%
  salespersonCommission: number // 5-10%
  paymentProcessing: number     // 2.9% + €0.30
  operatorNet: number          // Remaining amount
}

function calculateCommissions(booking: Booking): CommissionBreakdown {
  const platformRate = booking.operator.commissionRate || 0.15
  const salespersonRate = booking.salesperson ? 
    booking.salesperson.commissionRate || 0.05 : 0
  
  const platformCommission = booking.totalAmount * platformRate
  const salespersonCommission = booking.totalAmount * salespersonRate
  const paymentProcessing = (booking.totalAmount * 0.029) + 0.30
  const operatorNet = booking.totalAmount - platformCommission - 
    salespersonCommission - paymentProcessing
  
  return {
    bookingAmount: booking.totalAmount,
    platformCommission,
    salespersonCommission,
    paymentProcessing,
    operatorNet
  }
}
```

---

### **🎨 Phase 3: User Experience Enhancements**

#### **Task 3.1: Mobile Booking Optimization**
**Priority**: ⭐⭐⭐⭐  
**Features**:
- One-handed booking flow design
- Touch-optimized calendar picker
- Auto-fill from device contacts
- Biometric payment authentication
- Offline booking capability (save draft)

#### **Task 3.2: Booking Abandonment Recovery**
**Priority**: ⭐⭐⭐  
**Features**:
- Save incomplete bookings
- Email reminders for abandoned carts
- Exit-intent discount offers
- Simplified guest checkout option
- WhatsApp booking completion

#### **Task 3.3: Social Booking Features**
**Priority**: ⭐⭐  
**Features**:
- Group booking coordination (share booking link)
- Gift booking purchases
- Social media integration for sharing
- Referral program integration
- Group payment splitting

---

## 🛠️ **Technical Implementation**

### **Server Actions**
```typescript
// actions/booking/booking-actions.ts
export async function createBookingAction(data: FormData)
export async function updateBookingAction(bookingId: string, updates: Partial<Booking>)
export async function cancelBookingAction(bookingId: string, reason?: string)
export async function checkAvailabilityAction(activityId: string, date: string)
export async function calculatePricingAction(selection: BookingSelection)
export async function processPaymentAction(paymentData: PaymentData)
```

### **Database Operations**
```typescript
// Booking creation with transaction
const { data, error } = await supabase.rpc('create_booking_with_payment', {
  booking_data: bookingDetails,
  payment_data: paymentDetails,
  availability_check: true
})

// Real-time availability subscription
const availabilitySubscription = supabase
  .channel('availability_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'activity_availability'
  }, handleAvailabilityUpdate)
  .subscribe()
```

### **State Management**
```typescript
// Booking flow state management
const [bookingState, setBookingState] = useState<BookingState>({
  step: 1,
  selection: null,
  customerDetails: null,
  paymentMethod: null,
  processing: false,
  errors: {}
})

// Form validation with Zod
const bookingSelectionSchema = z.object({
  activityId: z.string().uuid(),
  selectedDate: z.string().datetime(),
  participants: z.object({
    adults: z.number().min(1).max(20),
    children: z.number().min(0).max(10),
    childAges: z.array(z.number().min(0).max(17)).optional()
  }),
  addOns: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().min(1)
  }))
})
```

---

## 📊 **Success Metrics & Testing**

### **Conversion Metrics**
- **Booking Completion Rate**: Target 75%+ (industry average 65%)
- **Payment Success Rate**: Target 98%+ (minimize payment failures)
- **Time to Book**: Target <5 minutes average
- **Mobile Conversion**: Target 15%+ (desktop typically 18%+)

### **Business Metrics**
- **Average Booking Value**: Target €150+ per booking
- **Booking Modification Rate**: Target <10% 
- **Cancellation Rate**: Target <15%
- **Customer Satisfaction**: Target 4.5+ rating

### **Testing Scenarios**
1. **Happy Path**: Complete booking with full payment
2. **Deposit Flow**: Book with deposit, complete remaining payment
3. **Group Booking**: Multiple participants with different ages
4. **Add-ons**: Optional extras selection and pricing
5. **Capacity Limits**: Booking when limited availability
6. **Payment Failures**: Handle declined cards gracefully
7. **Weather Cancellation**: Activity cancelled due to weather
8. **Modification Flow**: Change participant details post-booking

---

## 🚨 **Error Handling & Edge Cases**

### **Payment Failures**
- Retry mechanism for temporary failures
- Alternative payment method suggestions
- Save booking details for later completion
- Clear error messaging and next steps

### **Availability Conflicts**
- Real-time availability checking before payment
- Alternative date/time suggestions
- Waitlist signup for fully booked activities
- Automatic upgrade to higher capacity activities

### **Technical Issues**
- Offline booking capability (save draft locally)
- Network failure recovery
- Session timeout handling
- Data loss prevention

---

## 🔄 **Integration Points**

### **External Services**
- **Stripe**: Payment processing and webhooks
- **Clerk**: User authentication and management
- **SendGrid**: Booking confirmation emails
- **Twilio**: SMS notifications (optional)
- **PostHog**: Conversion tracking and analytics

### **Internal Systems**
- **Activity Catalog**: Real-time inventory
- **User Management**: Customer profiles and preferences
- **Commission System**: Automatic calculation and payouts
- **Review System**: Post-experience feedback
- **Support System**: Customer service integration

---

**🎫 BOOKING SYSTEM READY**: Complete implementation guide for revenue-generating booking functionality with all business requirements and technical specifications.