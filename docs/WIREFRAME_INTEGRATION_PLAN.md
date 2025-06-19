# 🗺️ Wireframe Integration Roadmap - Mallorca Activities Platform

**Date**: 2025-01-25  
**Current Status**: MVP Base Complete (Landing + Activities Catalog)  
**Next Phase**: Full Platform Integration  
**Development Approach**: Agile incremental implementation

---

## 🎯 **Integration Strategy Overview**

### **Phase 1: Core Customer Journey (Priority 1)**
**Goal**: Complete end-to-end booking flow  
**Timeline**: 3-4 development sessions  
**Revenue Impact**: Direct booking conversion

### **Phase 2: User Management & Authentication (Priority 2)**  
**Goal**: User accounts, authentication, and personalization  
**Timeline**: 2-3 development sessions  
**Revenue Impact**: Customer retention and repeat bookings

### **Phase 3: Business Operations (Priority 3)**
**Goal**: Operator and salesperson dashboards  
**Timeline**: 3-4 development sessions  
**Revenue Impact**: Platform commission and efficiency

### **Phase 4: Platform Management (Priority 4)**
**Goal**: Admin tools and advanced features  
**Timeline**: 2-3 development sessions  
**Revenue Impact**: Platform scaling and management

---

## 📋 **Detailed Page Implementation Plan**

### **🔥 PHASE 1: Core Customer Journey (CRITICAL PATH)**

#### **1.1 Activity Detail Page (`/activities/[id]`)**
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)  
**Dependencies**: None - can use existing mock data  
**Components Needed**:
- `ActivityImageGallery` - Main images with lightbox
- `BookingWidget` - Sticky booking form
- `AvailabilityCalendar` - Real-time availability
- `ReviewsSection` - Customer reviews display
- `ActivityDescription` - Detailed activity info
- `SimilarActivities` - Recommendations carousel

**Database Integration**:
- Activity details query
- Reviews and ratings
- Real-time availability
- Related activities algorithm

**File Structure**:
```
app/activities/[id]/
  ├── page.tsx                 (main detail page)
  ├── _components/
  │   ├── activity-gallery.tsx
  │   ├── booking-widget.tsx
  │   ├── availability-calendar.tsx
  │   ├── reviews-section.tsx
  │   └── similar-activities.tsx
  └── loading.tsx              (loading state)
```

---

#### **1.2 Booking Flow Pages**

##### **Booking Step 1: Selection (`/book/[id]/select`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `BookingProgress` - 3-step progress indicator
- `ParticipantSelector` - Adults/children selectors
- `DateTimeSelector` - Date and time selection
- `AddOnsSelector` - Optional extras
- `PricingSummary` - Live price calculation

##### **Booking Step 2: Details (`/book/[id]/details`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `CustomerForm` - Personal information
- `AccountCreation` - Optional account setup
- `TermsAcceptance` - Terms and conditions
- `BookingSummary` - Order review

##### **Booking Step 3: Payment (`/book/[id]/payment`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `PaymentMethodSelector` - Card, PayPal, etc.
- `StripePaymentForm` - Secure payment processing
- `DepositOptions` - Full payment vs deposit
- `FinalReview` - Last chance to edit

##### **Booking Confirmation (`/booking/[bookingId]/confirmation`)**
**Priority**: ⭐⭐⭐⭐⭐  
**Components Needed**:
- `BookingConfirmation` - Success message and details
- `DigitalTicket` - QR code and booking info
- `CalendarIntegration` - Add to calendar buttons
- `NextSteps` - What happens next information

**File Structure**:
```
app/book/[id]/
  ├── select/
  │   └── page.tsx
  ├── details/
  │   └── page.tsx
  ├── payment/
  │   └── page.tsx
  └── _components/
      ├── booking-progress.tsx
      ├── participant-selector.tsx
      ├── customer-form.tsx
      └── payment-form.tsx

app/booking/[bookingId]/
  ├── confirmation/
  │   └── page.tsx
  └── _components/
      ├── booking-confirmation.tsx
      └── digital-ticket.tsx
```

---

### **🔐 PHASE 2: User Management & Authentication**

#### **2.1 User Dashboard (`/dashboard`)**
**Priority**: ⭐⭐⭐⭐  
**Components Needed**:
- `DashboardOverview` - User stats and quick actions
- `UpcomingBookings` - Next activities
- `BookingHistory` - Past activities
- `FavoriteActivities` - Wishlist display

#### **2.2 My Bookings (`/bookings`)**
**Priority**: ⭐⭐⭐⭐  
**Components Needed**:
- `BookingsList` - All user bookings
- `BookingCard` - Individual booking display
- `BookingFilters` - Filter by status, date, etc.
- `BookingActions` - Cancel, modify, etc.

#### **2.3 Wishlist (`/wishlist`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `WishlistGrid` - Saved activities
- `WishlistActions` - Remove, book now, etc.
- `PriceAlerts` - Notify of price changes

#### **2.4 User Profile (`/profile`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `ProfileForm` - Edit personal information
- `PasswordChange` - Security settings
- `NotificationSettings` - Email/SMS preferences
- `TravelPreferences` - Activity preferences

**File Structure**:
```
app/(authenticated)/
  ├── dashboard/
  │   └── page.tsx
  ├── bookings/
  │   ├── page.tsx
  │   └── [bookingId]/
  │       └── page.tsx
  ├── wishlist/
  │   └── page.tsx
  ├── profile/
  │   └── page.tsx
  └── _components/
      ├── dashboard-overview.tsx
      ├── booking-card.tsx
      ├── wishlist-grid.tsx
      └── profile-form.tsx
```

---

### **💼 PHASE 3: Business Operations**

#### **3.1 Salesperson Portal**

##### **Sales Dashboard (`/sales/dashboard`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `SalesMetrics` - Daily/weekly performance
- `CommissionTracker` - Earnings overview
- `QuickBooking` - Fast booking interface
- `CustomerLookup` - Find existing customers

##### **Sales Activities (`/sales/activities`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `ActivityShowcase` - Customer-facing display
- `PricingTools` - Dynamic pricing options
- `AvailabilityChecker` - Real-time slot checking

##### **Sales History (`/sales/history`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `SalesHistory` - All sales records
- `CommissionDetails` - Detailed earnings breakdown

#### **3.2 Operator Portal**

##### **Operator Dashboard (`/operator/dashboard`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `OperatorOverview` - Today's bookings and status
- `WeatherAlerts` - Weather impact notifications
- `BookingManagement` - Approve/cancel bookings
- `CapacityManager` - Adjust availability

##### **Operator Bookings (`/operator/bookings`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `BookingCalendar` - Calendar view of bookings
- `BookingDetails` - Customer information
- `CommunicationTools` - Message customers

##### **Operator Analytics (`/operator/analytics`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `PerformanceMetrics` - Booking trends
- `RevenueDashboard` - Financial overview
- `CustomerFeedback` - Reviews and ratings

**File Structure**:
```
app/(sales)/
  ├── sales/
  │   ├── dashboard/
  │   ├── activities/
  │   └── history/
  └── _components/
      ├── sales-metrics.tsx
      ├── quick-booking.tsx
      └── activity-showcase.tsx

app/(operator)/
  ├── operator/
  │   ├── dashboard/
  │   ├── bookings/
  │   └── analytics/
  └── _components/
      ├── operator-overview.tsx
      ├── booking-calendar.tsx
      └── weather-alerts.tsx
```

---

### **⚙️ PHASE 4: Platform Management**

#### **4.1 Admin Portal**

##### **Admin Dashboard (`/admin/dashboard`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `PlatformMetrics` - Overall platform performance
- `UserManagement` - Manage all user types
- `ActivityManagement` - Approve new activities
- `SystemHealth` - Monitor platform health

##### **Admin Analytics (`/admin/analytics`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `RevenueAnalytics` - Platform revenue tracking
- `UserBehavior` - User flow analysis
- `ConversionMetrics` - Booking conversion rates

#### **4.2 Support Pages**

##### **About Page (`/about`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `CompanyStory` - About Mallorca Activities
- `TeamSection` - Meet the team
- `MissionValues` - Company values

##### **Contact Page (`/contact`)**
**Priority**: ⭐⭐⭐  
**Components Needed**:
- `ContactForm` - Customer support form
- `ContactInfo` - Phone, email, address
- `FAQ` - Common questions
- `LiveChat` - Real-time support

##### **Help Center (`/help`)**
**Priority**: ⭐⭐  
**Components Needed**:
- `HelpCategories` - Organized help topics
- `SearchableArticles` - Searchable knowledge base
- `VideoTutorials` - How-to videos

---

## 🛠️ **Technical Implementation Strategy**

### **Server Actions Needed**
```typescript
// Customer booking actions
createBookingAction()
updateBookingAction() 
cancelBookingAction()
getCustomerBookingsAction()

// Activity management actions
getActivityDetailsAction()
checkAvailabilityAction()
addToWishlistAction()
submitReviewAction()

// Payment processing actions
processPaymentAction()
processRefundAction()
calculatePricingAction()

// User management actions
updateProfileAction()
changePasswordAction()
updatePreferencesAction()

// Business operations actions
getSalesMetricsAction()
getOperatorBookingsAction()
updateAvailabilityAction()
sendCustomerMessageAction()
```

### **Database Modifications**
- **Additional Tables**: User preferences, wishlist items, booking modifications
- **Indexes**: Performance optimization for booking queries
- **Views**: Materialized views for analytics
- **Triggers**: Automatic notifications and updates

### **Component Library Extensions**
- **Form Components**: Advanced form handling with validation
- **Calendar Components**: Booking calendar and availability
- **Chart Components**: Analytics and dashboard charts
- **Payment Components**: Stripe integration components

### **State Management**
- **Booking Flow**: Multi-step form state management
- **User Session**: Authentication and user data
- **Real-time Updates**: WebSocket for live availability
- **Offline Support**: Progressive Web App features

---

## 📅 **Implementation Timeline**

### **Sprint 1 (Week 1): Activity Detail + Booking Flow**
- ✅ Activity detail page
- ✅ Booking selection page
- ✅ Booking details page
- ✅ Payment integration

### **Sprint 2 (Week 2): User Authentication + Dashboards**
- ✅ User dashboard
- ✅ My bookings page
- ✅ Profile management
- ✅ Wishlist functionality

### **Sprint 3 (Week 3): Business Operations**
- ✅ Salesperson portal
- ✅ Operator dashboard
- ✅ Basic analytics

### **Sprint 4 (Week 4): Polish + Advanced Features**
- ✅ Admin portal
- ✅ Support pages
- ✅ Performance optimization
- ✅ Mobile app features

---

## 🎯 **Success Metrics**

### **Technical Metrics**
- **Page Load Speed**: <2 seconds for all pages
- **Mobile Performance**: 90+ Lighthouse score
- **Conversion Rate**: 15%+ booking completion
- **User Retention**: 60%+ return visitors

### **Business Metrics**
- **Booking Volume**: 100+ bookings per month
- **Revenue Growth**: 25%+ month-over-month
- **Customer Satisfaction**: 4.5+ average rating
- **Platform Commission**: 15-20% on all bookings

---

## 🚀 **Ready to Start Implementation**

**Current Status**: ✅ MVP Base Complete  
**Next Priority**: 🔥 Activity Detail Page  
**Estimated Completion**: 4-6 weeks for full platform  
**Team Ready**: All wireframes documented and ready for development

---

*This roadmap provides a clear path from our current MVP to a fully functional Mallorca Activities platform with all user types supported and revenue-generating features implemented.* 