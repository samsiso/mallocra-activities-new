# 🖼️ Mallorca Activities Platform - Wireframes & Page Specifications

**Date**: 2025-01-25  
**Planning Focus**: Comprehensive page-by-page specifications and wireframes for the platform  
**Prompt Count**: 3/5  
**Current Status**: Development Planning Phase

---

## 🎯 **Page Architecture Overview**

Based on our research and user journey analysis, the platform requires **32 core pages** organized across 4 user types:

- **Public/Customer Pages**: 12 pages
- **Salesperson Interface**: 8 pages  
- **Operator Dashboard**: 9 pages
- **Admin Interface**: 3 pages

---

## 🌐 **PUBLIC & CUSTOMER PAGES**

### **1. Landing Page (`/`)**

#### **Purpose & Importance**
The primary entry point that converts visitors into users. Must showcase Mallorca's unique activities while building trust and driving engagement.

#### **Key Features**
- **Hero Section**: High-impact video/imagery of popular activities
- **Value Propositions**: Real-time availability, instant confirmation, local expertise
- **Activity Categories**: Water Sports, Land Adventures, Cultural, Nightlife
- **Popular Activities Grid**: Top 6-8 activities with pricing and quick book
- **Trust Signals**: Customer reviews, safety certifications, operator partnerships
- **Social Proof**: Booking numbers, customer testimonials, review scores

#### **Dark Theme Implementation**
- Background: `bg-gray-900` with activity imagery overlays
- Primary CTAs: `bg-orange-600` with `text-white`
- Text: `text-white` for headers, `text-gray-100` for body

#### **Mobile Optimization**
- Touch-friendly category cards
- Swipe-able popular activities carousel
- Prominent "Book Now" buttons (min 44px height)
- Quick search bar at top

---

### **2. Activity Catalog (`/activities`)**

#### **Purpose & Importance**
Core discovery page where customers browse and filter all available activities. Must provide efficient search and compelling activity presentation.

#### **Key Features**
- **Advanced Filters Sidebar**:
  - Category selection (Water Sports, Land Adventures, etc.)
  - Price range slider (€50-250 based on research)
  - Date picker with availability
  - Location/area selection
  - Duration filters
  - Group size options
  - Rating filter (4+ stars)

- **Activity Grid Layout**:
  - High-quality activity images (16:9 aspect ratio)
  - Activity title and operator name
  - Starting price and currency
  - Star rating and review count
  - "Available Today" badges
  - Quick book button

- **Sort Options**:
  - Price: Low to High / High to Low
  - Popularity (booking frequency)
  - Rating (highest first)
  - Distance from user location
  - Newest activities

#### **Search Functionality**
- Global search bar with auto-complete
- Search by activity name, location, or keywords
- Recent searches and popular searches

#### **Load Performance**
- Infinite scroll or pagination
- Image lazy loading
- Filter results update without page reload

---

### **3. Activity Detail Page (`/activities/[id]`)**

#### **Purpose & Importance**
The conversion page where browsing becomes booking. Must provide comprehensive information while maintaining momentum toward purchase.

#### **Key Features**
- **Activity Overview Section**:
  - High-quality image gallery (6-8 photos minimum)
  - Activity title and operator branding
  - Location with Google Maps integration
  - Duration, group size, minimum age
  - Price breakdown (adult/child/senior if applicable)

- **Description & Highlights**:
  - Compelling activity description (150-300 words)
  - What's included/excluded lists
  - Meeting point and pickup information
  - Cancellation policy
  - Weather dependency notice

- **Availability Calendar**:
  - Real-time availability display
  - Time slot selection
  - Capacity indicators (e.g., "Only 3 spots left")
  - Seasonal pricing display

- **Reviews & Ratings**:
  - Overall rating with star display
  - Recent reviews (5-10 visible)
  - Verified booking badges
  - Photo reviews when available
  - Filter reviews by rating/date

- **Booking Widget** (Sticky on mobile):
  - Date and time selection
  - Participant number selector
  - Price calculation in real-time
  - "Book Now" primary CTA
  - "Add to Wishlist" secondary CTA

#### **Trust Building Elements**
- Operator license/certification display
- Safety equipment information
- Insurance coverage details
- Customer photos from experiences

---

### **4. Booking Flow - Step 1: Selection (`/book/[activityId]/select`)**

#### **Purpose & Importance**
First step of the booking funnel. Must be simple and clear to prevent abandonment while collecting necessary information.

#### **Key Features**
- **Progress Indicator**: "1 of 3 - Select Experience"
- **Activity Summary Card**:
  - Activity image and title
  - Selected date/time
  - Price per person
  - Cancellation policy reminder

- **Selection Options**:
  - Participant types (Adult/Child/Senior)
  - Quantity selectors with price updates
  - Optional add-ons (equipment, photos, insurance)
  - Special requirements text field

- **Price Calculation Panel**:
  - Line items with quantities
  - Subtotal calculation
  - Fees and taxes
  - Total amount prominently displayed
  - Currency selector (EUR/USD/GBP)

#### **User Experience**
- Auto-save selections to prevent loss
- Clear error messaging for invalid selections
- Mobile-optimized quantity controls
- Real-time price updates

---

### **5. Booking Flow - Step 2: Details (`/book/[activityId]/details`)**

#### **Purpose & Importance**
Collects customer information and finalizes booking details. Must balance information collection with simplicity.

#### **Key Features**
- **Progress Indicator**: "2 of 3 - Your Details"
- **Customer Information Form**:
  - Lead participant details (name, email, phone)
  - Additional participant names (if required)
  - Emergency contact information
  - Special dietary requirements/accessibility needs

- **Account Creation Option**:
  - "Create account to save booking history"
  - Social login options (Google, Facebook)
  - Guest checkout option

- **Contact Preferences**:
  - Email confirmations
  - SMS reminders
  - Marketing communications opt-in

- **Terms & Conditions**:
  - Activity-specific terms
  - Cancellation policy agreement
  - Privacy policy consent
  - Age verification for certain activities

---

### **6. Booking Flow - Step 3: Payment (`/book/[activityId]/payment`)**

#### **Purpose & Importance**
The critical conversion point. Must provide secure, fast payment while offering flexibility.

#### **Key Features**
- **Progress Indicator**: "3 of 3 - Payment"
- **Booking Summary**:
  - All selected options
  - Final price breakdown
  - Customer details confirmation

- **Payment Options**:
  - Full payment vs deposit (20%) option
  - Credit/debit card (Stripe integration)
  - PayPal option
  - Apple Pay/Google Pay for mobile
  - SEPA for European customers

- **Security Features**:
  - SSL encryption indicators
  - Stripe security badges
  - PCI compliance notice

- **Final Details**:
  - Terms acceptance checkboxes
  - Newsletter signup option
  - Booking confirmation preview

---

### **7. Booking Confirmation (`/booking/[bookingId]/confirmation`)**

#### **Purpose & Importance**
Builds confidence in purchase and provides essential next-step information.

#### **Key Features**
- **Confirmation Message**:
  - "Booking Confirmed" with check mark
  - Booking reference number
  - Confirmation email sent notice

- **Booking Details Summary**:
  - Activity information
  - Date, time, and meeting point
  - Participant details
  - Payment confirmation

- **Digital Ticket**:
  - QR code for check-in
  - Downloadable PDF ticket
  - Add to Apple Wallet/Google Pay option

- **Next Steps Information**:
  - What to bring checklist
  - Weather contingency plans
  - Contact information for questions
  - Directions to meeting point

- **Related Suggestions**:
  - "You might also like" activities
  - Complete your Mallorca experience recommendations

---

### **8. User Account Dashboard (`/account`)**

#### **Purpose & Importance**
Central hub for customer activity management and platform engagement.

#### **Key Features**
- **Profile Management**:
  - Personal information editing
  - Contact preferences
  - Password/security settings

- **Booking History**:
  - Upcoming bookings with countdown timers
  - Past bookings with review prompts
  - Cancelled/refunded bookings
  - Re-book quick actions

- **Wishlist Management**:
  - Saved activities with price tracking
  - Share wishlist functionality
  - Move to cart quick actions

- **Loyalty/Rewards Section**:
  - Booking streak counters
  - Discount codes and promotions
  - Referral program status

---

### **9. Booking Management (`/booking/[bookingId]`)**

#### **Purpose & Importance**
Individual booking management and modification interface.

#### **Key Features**
- **Booking Status Display**:
  - Current status (Confirmed/Pending/Cancelled)
  - Time until activity
  - Weather forecast for activity date

- **Booking Actions**:
  - Modify participant numbers (if allowed)
  - Reschedule options
  - Cancellation with refund calculation
  - Download tickets/vouchers

- **Activity Information**:
  - Detailed meeting instructions
  - What to bring reminders
  - Operator contact information
  - Emergency contact details

- **Communication History**:
  - Messages from operator
  - Booking modification history
  - Customer service interactions

---

### **10. Reviews & Ratings (`/reviews/create/[bookingId]`)**

#### **Purpose & Importance**
Captures post-experience feedback to build trust and improve service quality.

#### **Key Features**
- **Rating System**:
  - Overall experience (1-5 stars)
  - Specific aspects (guide, value, safety, fun)
  - Photo upload capability

- **Review Form**:
  - Written review text area
  - Predefined quick tags (Fun, Educational, Scenic)
  - Would recommend toggle
  - Anonymous posting option

- **Incentives**:
  - Discount for next booking
  - Loyalty points award
  - Feature review opportunity

---

### **11. Customer Support (`/support`)**

#### **Purpose & Importance**
Self-service support hub reducing customer service load while providing quick answers.

#### **Key Features**
- **FAQ Section**:
  - Booking and cancellation questions
  - Activity-specific information
  - Payment and refund policies
  - Contact information

- **Live Chat Integration**:
  - Real-time support during business hours
  - Automated responses for common questions
  - Escalation to human agents

- **Contact Forms**:
  - General inquiries
  - Booking modifications
  - Complaints and feedback
  - Partnership inquiries

---

### **12. Search Results (`/search?q=[query]`)**

#### **Purpose & Importance**
Optimized search results page for both internal searches and SEO traffic.

#### **Key Features**
- **Search Results Display**:
  - Relevant activities based on query
  - Suggested searches and corrections
  - Filter options on search results

- **SEO Optimization**:
  - Rich snippets for activities
  - Location-based search results
  - Popular search terms suggestions

---

## 📱 **SALESPERSON MOBILE INTERFACE**

### **13. Salesperson Login (`/sales/login`)**

#### **Purpose & Importance**
Dedicated login for sales team with mobile optimization and quick access.

#### **Key Features**
- **Mobile-First Design**:
  - Large touch targets
  - Simple email/password form
  - Remember login option
  - Biometric login (Face ID/Fingerprint)

- **Quick Stats Preview**:
  - Today's sales summary
  - Commission earned this month
  - Active promotions

---

### **14. Sales Dashboard (`/sales/dashboard`)**

#### **Purpose & Importance**
Central command center for salespeople with real-time information and quick actions.

#### **Key Features**
- **Daily Overview Cards**:
  - Sales target progress bar
  - Commission earned today
  - Available activities count
  - Weather conditions

- **Quick Action Buttons**:
  - Quick Sale (scan customer phone)
  - Browse Activities
  - Check Availability
  - Customer Lookup

- **Performance Metrics**:
  - Weekly sales chart
  - Top-selling activities
  - Customer satisfaction scores
  - Leaderboard position

---

### **15. Activity Showcase (`/sales/activities`)**

#### **Purpose & Importance**
Mobile-optimized activity browser for presenting to customers on the street.

#### **Key Features**
- **Customer-Facing Mode**:
  - Full-screen activity images
  - Simple swipe navigation
  - Price display toggle
  - Video previews

- **Salesperson Controls**:
  - Quick availability check
  - Instant booking button
  - Commission calculator
  - Compare activities option

- **Offline Capability**:
  - Cached activity information
  - Offline booking queue
  - Sync when connection restored

---

### **16. Quick Booking Interface (`/sales/quick-book`)**

#### **Purpose & Importance**
Streamlined booking process optimized for face-to-face sales interactions.

#### **Key Features**
- **Customer Information**:
  - Simplified form fields
  - QR code scanning for contact info
  - Voice-to-text for names
  - Photo capture for ID verification

- **Rapid Activity Selection**:
  - Large activity thumbnails
  - Availability indicators
  - Price adjustments for commissions
  - Package deal suggestions

- **Payment Processing**:
  - Mobile card readers
  - Cash transaction recording
  - Deposit vs full payment options
  - Receipt generation

---

### **17. Commission Tracker (`/sales/commissions`)**

#### **Purpose & Importance**
Transparent commission tracking builds trust and motivates sales performance.

#### **Key Features**
- **Real-Time Earnings**:
  - Today's commission total
  - Pending commission amount
  - Monthly commission history
  - Payout schedule information

- **Sales Breakdown**:
  - Commission per booking
  - Activity category performance
  - Customer repeat rate
  - Average sale value

- **Gamification Elements**:
  - Monthly targets and progress
  - Achievement badges
  - Leaderboard comparisons
  - Bonus opportunity alerts

---

### **18. Customer Management (`/sales/customers`)**

#### **Purpose & Importance**
Relationship management for repeat customers and referral tracking.

#### **Key Features**
- **Customer Database**:
  - Contact information storage
  - Booking history per customer
  - Preference notes
  - Follow-up reminders

- **Repeat Customer Tools**:
  - Quick rebooking options
  - Loyalty discount application
  - Referral tracking
  - Birthday/anniversary reminders

---

### **19. Training Resources (`/sales/training`)**

#### **Purpose & Importance**
Continuous education platform for sales team effectiveness.

#### **Key Features**
- **Product Knowledge**:
  - Activity detail sheets
  - Operator information
  - Safety protocols
  - Selling point highlights

- **Sales Techniques**:
  - Video training modules
  - Role-playing scenarios
  - Objection handling guides
  - Cultural sensitivity training

- **Platform Updates**:
  - New feature announcements
  - Process changes
  - Best practice sharing
  - Success story examples

---

### **20. Sales Analytics (`/sales/analytics`)**

#### **Purpose & Importance**
Data-driven insights for personal performance improvement.

#### **Key Features**
- **Performance Dashboard**:
  - Conversion rate tracking
  - Activity preference analysis
  - Peak performance times
  - Customer satisfaction correlation

- **Goal Tracking**:
  - Daily/weekly/monthly targets
  - Performance trends
  - Improvement suggestions
  - Benchmark comparisons

---

## 🏢 **OPERATOR DASHBOARD PAGES**

### **21. Operator Login (`/operator/login`)**

#### **Purpose & Importance**
Secure access portal for business operators with multi-factor authentication.

#### **Key Features**
- **Enhanced Security**:
  - Two-factor authentication
  - IP address verification
  - Session timeout settings
  - Login attempt monitoring

- **Business Verification**:
  - License number verification
  - Insurance status check
  - Operator credentials display

---

### **22. Operator Dashboard (`/operator/dashboard`)**

#### **Purpose & Importance**
Business intelligence hub providing critical operational insights.

#### **Key Features**
- **Business Overview Cards**:
  - Today's bookings and revenue
  - Weekly booking trends
  - Capacity utilization rates
  - Customer satisfaction scores

- **Real-Time Metrics**:
  - Live booking notifications
  - Availability status indicators
  - Weather impact alerts
  - Emergency contact displays

- **Financial Summary**:
  - Revenue vs commission breakdown
  - Payout schedule information
  - Outstanding payments
  - Monthly financial reports

---

### **23. Activity Management (`/operator/activities`)**

#### **Purpose & Importance**
Complete activity lifecycle management from creation to optimization.

#### **Key Features**
- **Activity Listing**:
  - All activities with status indicators
  - Performance metrics per activity
  - Quick edit options
  - Duplicate activity function

- **Activity Editor**:
  - Rich text description editor
  - Image gallery management
  - Pricing configuration
  - Availability calendar setup

- **Performance Analytics**:
  - Booking frequency charts
  - Revenue per activity
  - Customer rating trends
  - Conversion rate analysis

---

### **24. Booking Management (`/operator/bookings`)**

#### **Purpose & Importance**
Comprehensive booking oversight and customer communication hub.

#### **Key Features**
- **Booking Calendar View**:
  - Daily/weekly/monthly views
  - Capacity visualization
  - Booking status colors
  - Drag-and-drop rescheduling

- **Booking Details**:
  - Customer information display
  - Payment status tracking
  - Special requirements alerts
  - Communication history

- **Bulk Actions**:
  - Mass booking confirmations
  - Weather cancellation tools
  - Group message sending
  - Capacity adjustments

---

### **25. Availability Calendar (`/operator/availability`)**

#### **Purpose & Importance**
Dynamic availability management preventing overbooking and optimizing capacity.

#### **Key Features**
- **Calendar Interface**:
  - Monthly/weekly/daily views
  - Multiple time slot management
  - Capacity settings per slot
  - Recurring availability patterns

- **Automatic Rules**:
  - Weather-dependent availability
  - Minimum booking requirements
  - Advance booking cutoffs
  - Seasonal capacity changes

- **Integration Features**:
  - Real-time synchronization
  - Third-party calendar imports
  - API connectivity for partners
  - Manual override capabilities

---

### **26. Financial Dashboard (`/operator/finances`)**

#### **Purpose & Importance**
Complete financial transparency and reporting for business management.

#### **Key Features**
- **Revenue Analytics**:
  - Daily/weekly/monthly revenue charts
  - Revenue per customer metrics
  - Seasonal performance comparisons
  - Forecast projections

- **Commission Breakdown**:
  - Platform commission calculations
  - Salesperson commission tracking
  - Partner referral fees
  - Payment processing costs

- **Payout Management**:
  - Scheduled payout calendar
  - Bank account management
  - Payment history records
  - Tax reporting documents

---

### **27. Customer Reviews (`/operator/reviews`)**

#### **Purpose & Importance**
Reputation management and customer feedback analysis.

#### **Key Features**
- **Review Management**:
  - All reviews with response options
  - Rating trend analysis
  - Review moderation tools
  - Customer service alerts

- **Response System**:
  - Template responses
  - Public response publishing
  - Private customer messaging
  - Review dispute process

- **Analytics**:
  - Rating improvements over time
  - Common feedback themes
  - Competitor benchmarking
  - Service improvement suggestions

---

### **28. Staff Management (`/operator/staff`)**

#### **Purpose & Importance**
Team coordination and performance tracking for operational efficiency.

#### **Key Features**
- **Staff Directory**:
  - Employee profiles and roles
  - Contact information
  - Certification tracking
  - Performance ratings

- **Schedule Management**:
  - Staff scheduling calendar
  - Availability management
  - Shift assignments
  - Overtime tracking

- **Performance Tracking**:
  - Customer feedback per staff member
  - Training completion status
  - Safety incident reporting
  - Recognition and rewards

---

### **29. Analytics & Reports (`/operator/analytics`)**

#### **Purpose & Importance**
Deep business intelligence for strategic decision making.

#### **Key Features**
- **Business Intelligence**:
  - Customer demographic analysis
  - Booking pattern insights
  - Revenue optimization suggestions
  - Market trend analysis

- **Custom Reports**:
  - Configurable report builder
  - Automated report scheduling
  - Export functionality (PDF/Excel)
  - Historical data comparison

- **Predictive Analytics**:
  - Demand forecasting
  - Capacity optimization
  - Price recommendation engine
  - Seasonal planning tools

---

## 👑 **ADMIN INTERFACE PAGES**

### **30. Admin Dashboard (`/admin/dashboard`)**

#### **Purpose & Importance**
Platform-wide oversight and management for operational excellence.

#### **Key Features**
- **Platform Metrics**:
  - Total users and growth rates
  - Platform revenue and commission
  - Active operators and activities
  - System performance metrics

- **Monitoring Tools**:
  - Real-time activity monitoring
  - Error tracking and alerts
  - Performance benchmarks
  - Security incident tracking

---

### **31. User Management (`/admin/users`)**

#### **Purpose & Importance**
Comprehensive user administration and support tools.

#### **Key Features**
- **User Database**:
  - All user types management
  - Role-based access control
  - Account status monitoring
  - Bulk user operations

- **Support Tools**:
  - Customer service interface
  - Account recovery tools
  - Dispute resolution system
  - Communication templates

---

### **32. Platform Analytics (`/admin/analytics`)**

#### **Purpose & Importance**
Strategic business intelligence for platform optimization and growth.

#### **Key Features**
- **Business Intelligence**:
  - Platform-wide performance metrics
  - Revenue and growth analytics
  - Market penetration analysis
  - Competitive positioning data

- **Operational Insights**:
  - User behavior analysis
  - Feature usage statistics
  - Performance optimization opportunities
  - Growth opportunity identification

---

## 🎨 **Universal Design System Elements**

### **Dark Theme Consistency**
Every page implements:
- **Primary Background**: `bg-gray-900` (#111827)
- **Secondary Background**: `bg-gray-800` (#1f2937)
- **Text Colors**: `text-white` (primary), `text-gray-100` (secondary)
- **Orange Accents**: `text-orange-500`, `bg-orange-600` for CTAs
- **Borders**: `border-gray-700` (#374151)

### **Mobile-First Components**
- **Touch-Friendly Controls**: Minimum 44px touch targets
- **Responsive Navigation**: Collapsible menus and bottom tabs
- **Gesture Support**: Swipe navigation where appropriate
- **Loading States**: Skeleton screens and progress indicators

### **Performance Standards**
- **Page Load Time**: <2 seconds target
- **First Contentful Paint**: <1.5 seconds
- **Mobile Performance**: 90+ Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliance

---

## 🔄 **Page Flow & Navigation**

### **Customer Journey Flows**
1. **Discovery**: Landing → Activities → Detail → Booking
2. **Return Users**: Login → Dashboard → Quick Rebooking
3. **Support**: Any page → Support → Resolution

### **Salesperson Workflows**
1. **Daily Routine**: Login → Dashboard → Activity Showcase → Quick Booking
2. **Performance Review**: Dashboard → Analytics → Commission Tracker
3. **Customer Service**: Customer Management → Communication Tools

### **Operator Management**
1. **Daily Operations**: Dashboard → Bookings → Customer Communication
2. **Business Analysis**: Analytics → Financial Dashboard → Reports
3. **Activity Optimization**: Activities → Performance → Availability

---

## 📊 **Development Priority Matrix**

### **Phase 1 (MVP - Weeks 1-4)**
1. Landing Page
2. Activity Catalog
3. Activity Detail Page
4. Booking Flow (3 pages)
5. Basic User Dashboard

### **Phase 2 (Core Features - Weeks 5-8)**
6. Salesperson Dashboard
7. Operator Dashboard
8. Booking Management
9. Review System

### **Phase 3 (Advanced Features - Weeks 9-12)**
10. Advanced Analytics
11. Commission Management
12. Full Admin Interface

### **Phase 4 (Optimization - Weeks 13-16)**
13. Performance optimization
14. Advanced search features
15. Mobile app considerations

---

*This comprehensive wireframe document provides the foundation for building a user-centric, conversion-optimized platform that serves all stakeholder needs while maintaining our dark theme design system and mobile-first approach.* 