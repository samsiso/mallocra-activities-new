# 🏝️ Mallorca Activities Platform - Development Plan

**Date**: 2025-01-25  
**Planning Focus**: Comprehensive development roadmap for the Mallorca Activities booking platform  
**Prompt Count**: 2/5  
**Current Status**: Planning Phase

---

## 🎯 **Project Vision & Objectives**

### **Mission Statement**
Build the premier activities booking platform for Mallorca that connects tourists with authentic local experiences while empowering salespeople and operators through innovative technology and fair commission structures.

### **Core Objectives**
1. **Customer Experience**: Intuitive booking platform with dark theme and mobile-first design
2. **Operator Success**: Fair commission structure (15-20% vs industry 25-30%)
3. **Salesperson Network**: Unique street-level distribution model
4. **Local Authenticity**: Showcase genuine Mallorca experiences
5. **Technology Excellence**: Real-time availability, instant confirmation

---

## 🏗️ **Platform Architecture Plan**

### **Technology Stack (Following User Rules)**
- **Frontend**: React 18+ with TypeScript (functional components only)
- **Styling**: Tailwind CSS with dark theme (bg-gray-900, orange accents)
- **Icons**: Lucide React exclusively
- **Build**: Vite
- **Backend**: Next.js with Server Actions
- **Database**: Supabase with Drizzle ORM
- **Auth**: Clerk (already configured)
- **Payments**: Stripe
- **Analytics**: PostHog

### **Core Features by User Type**

#### **Customer-Facing Features**
1. **Activity Catalog**
   - Search/filter by type, price, date, location
   - Categories: Water Sports, Land Adventures, Cultural, Nightlife
   - High-quality images and 360° previews
   - Real-time availability display

2. **Activity Details**
   - Comprehensive descriptions with pricing
   - Customer reviews and ratings (verified badges)
   - Weather dependency information
   - Multilingual support (German, English, Spanish)

3. **Booking & Payment**
   - Deposit option (20%) or full payment
   - Stripe integration with multiple currencies
   - Digital tickets with QR codes
   - Flexible cancellation policies

4. **User Management**
   - Clerk authentication (Google/email)
   - Booking history and wishlist
   - Push notifications for confirmations

#### **Salesperson Features**
1. **Mobile-First Dashboard**
   - Real-time inventory and pricing
   - Commission tracking and analytics
   - Digital brochures for customer presentations
   - WhatsApp integration for quick bookings

2. **Sales Tools**
   - QR code generation for instant bookings
   - Offline mode for poor connectivity
   - Commission calculator
   - Customer management system

3. **Performance Tracking**
   - Sales targets and achievements
   - Leaderboards and gamification
   - Monthly commission reports
   - Training resources

#### **Business Owner Features**
1. **Operator Dashboard**
   - Activity catalog management
   - Pricing and availability control
   - Booking analytics and reporting
   - Financial tracking and payouts

2. **Commission Management**
   - Automated commission calculations
   - Salesperson payout system
   - Performance analytics
   - Tiered commission structures

3. **Business Intelligence**
   - Revenue analytics and forecasting
   - Customer demographic insights
   - Seasonal trend analysis
   - Competitive pricing intelligence

---

## 🗄️ **Database Schema Plan**

### **Core Tables**

#### **Users Management**
```sql
-- Using Clerk for authentication, extend with profiles
users_profiles (
  id uuid PRIMARY KEY,
  clerk_user_id text NOT NULL,
  user_type enum('customer', 'salesperson', 'operator', 'admin'),
  first_name text,
  last_name text,
  email text,
  phone text,
  preferred_language text DEFAULT 'en',
  created_at timestamp,
  updated_at timestamp
)

salespeople (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profiles(id),
  commission_rate decimal DEFAULT 0.15,
  territory text,
  status enum('active', 'inactive', 'suspended'),
  total_sales decimal DEFAULT 0,
  monthly_target decimal,
  created_at timestamp,
  updated_at timestamp
)

operators (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profiles(id),
  business_name text NOT NULL,
  license_number text,
  commission_rate decimal DEFAULT 0.15,
  status enum('active', 'pending', 'suspended'),
  created_at timestamp,
  updated_at timestamp
)
```

#### **Activities & Inventory**
```sql
activities (
  id uuid PRIMARY KEY,
  operator_id uuid REFERENCES operators(id),
  title text NOT NULL,
  description text,
  category enum('water_sports', 'land_adventures', 'cultural', 'nightlife'),
  duration_minutes integer,
  max_participants integer,
  min_age integer,
  location text,
  meeting_point text,
  included_items text[],
  excluded_items text[],
  cancellation_policy text,
  weather_dependent boolean DEFAULT false,
  status enum('active', 'inactive', 'draft'),
  created_at timestamp,
  updated_at timestamp
)

activity_pricing (
  id uuid PRIMARY KEY,
  activity_id uuid REFERENCES activities(id),
  price_type enum('adult', 'child', 'senior', 'group'),
  base_price decimal NOT NULL,
  seasonal_multiplier decimal DEFAULT 1.0,
  currency text DEFAULT 'EUR',
  valid_from timestamp,
  valid_until timestamp,
  created_at timestamp,
  updated_at timestamp
)

activity_availability (
  id uuid PRIMARY KEY,
  activity_id uuid REFERENCES activities(id),
  date date NOT NULL,
  time_slot time,
  max_capacity integer,
  available_spots integer,
  price_override decimal,
  status enum('available', 'limited', 'full', 'cancelled'),
  weather_status enum('good', 'marginal', 'cancelled'),
  created_at timestamp,
  updated_at timestamp
)
```

#### **Bookings & Payments**
```sql
bookings (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES users_profiles(id),
  activity_id uuid REFERENCES activities(id),
  salesperson_id uuid REFERENCES salespeople(id),
  booking_date timestamp NOT NULL,
  activity_date date NOT NULL,
  activity_time time,
  participants integer,
  total_amount decimal,
  deposit_amount decimal,
  currency text DEFAULT 'EUR',
  booking_status enum('pending', 'confirmed', 'cancelled', 'completed'),
  payment_status enum('pending', 'partial', 'paid', 'refunded'),
  special_requests text,
  customer_notes text,
  created_at timestamp,
  updated_at timestamp
)

booking_participants (
  id uuid PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id),
  participant_name text,
  participant_age integer,
  participant_type enum('adult', 'child', 'senior'),
  special_requirements text,
  created_at timestamp
)

payments (
  id uuid PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id),
  stripe_payment_intent_id text,
  amount decimal,
  currency text DEFAULT 'EUR',
  payment_type enum('deposit', 'full', 'additional'),
  payment_method text,
  payment_status enum('pending', 'succeeded', 'failed', 'cancelled'),
  created_at timestamp,
  updated_at timestamp
)
```

#### **Commission & Analytics**
```sql
commissions (
  id uuid PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id),
  salesperson_id uuid REFERENCES salespeople(id),
  operator_id uuid REFERENCES operators(id),
  commission_amount decimal,
  commission_rate decimal,
  payout_status enum('pending', 'paid', 'cancelled'),
  payout_date timestamp,
  created_at timestamp,
  updated_at timestamp
)

reviews (
  id uuid PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id),
  customer_id uuid REFERENCES users_profiles(id),
  activity_id uuid REFERENCES activities(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  verified boolean DEFAULT false,
  status enum('pending', 'published', 'hidden'),
  created_at timestamp,
  updated_at timestamp
)
```

---

## 🎨 **UI/UX Design System**

### **Dark Theme Specifications**
- **Primary Background**: `bg-gray-900` (#111827)
- **Secondary Background**: `bg-gray-800` (#1f2937)
- **Text Primary**: `text-white` (#ffffff)
- **Text Secondary**: `text-gray-100` (#f3f4f6)
- **Borders**: `border-gray-700` (#374151)
- **Orange Accents**: `text-orange-500` (#f97316), `bg-orange-600` (#ea580c)

### **Component Library Plan**
1. **Activity Cards**: Dark themed with orange accent buttons
2. **Booking Forms**: Multi-step with progress indicators
3. **Calendar Components**: Custom availability calendar
4. **Payment Interface**: Stripe elements with dark styling
5. **Dashboard Widgets**: Analytics cards with charts
6. **Mobile Navigation**: Bottom tab navigation for mobile

### **Responsive Design**
- **Mobile First**: 320px+ (majority of bookings)
- **Tablet**: 768px+ (dashboard usage)
- **Desktop**: 1024px+ (operator management)

---

## 📱 **Mobile Experience Priority**

### **Customer Mobile Journey**
1. **Discovery**: Browse activities by category/location
2. **Details**: High-quality images, reviews, availability
3. **Booking**: Simple 3-step process (select, details, pay)
4. **Confirmation**: Instant confirmation with QR ticket
5. **Experience**: Day-of reminders and check-in

### **Salesperson Mobile Tools**
1. **Quick Sale**: Scan customer phone for instant booking
2. **Inventory Check**: Real-time availability and pricing
3. **Commission Tracker**: Live earnings dashboard
4. **Customer Demo**: Showcase activities with images/videos

---

## 💰 **Business Model Implementation**

### **Commission Structure**
- **Platform Commission**: 15-20% (competitive vs 25-30% industry standard)
- **Salesperson Commission**: 5-10% of booking value
- **Operator Net**: 70-80% of booking value
- **Payment Processing**: 2.9% + €0.30 per transaction (Stripe)

### **Revenue Streams**
1. **Primary**: Commission from bookings
2. **Secondary**: Premium operator listings (€50-200/month)
3. **Tertiary**: API access for partners
4. **Future**: White-label solutions for other destinations

### **Pricing Strategy**
- **Free Tier**: Basic listing for operators
- **Pro Tier**: €99/month - advanced analytics, priority support
- **Enterprise**: €299/month - dedicated account manager, custom features

---

## 🚀 **Development Phases**

### **Phase 1: MVP Foundation (Weeks 1-4)**
1. **Week 1**: Project setup, database schema, basic auth
2. **Week 2**: Activity catalog and search functionality
3. **Week 3**: Booking flow and Stripe integration
4. **Week 4**: Basic operator dashboard and testing

### **Phase 2: Core Features (Weeks 5-8)**
1. **Week 5**: Salesperson mobile interface
2. **Week 6**: Review system and customer profiles
3. **Week 7**: Commission tracking and payouts
4. **Week 8**: Email notifications and booking management

### **Phase 3: Advanced Features (Weeks 9-12)**
1. **Week 9**: Advanced analytics and reporting
2. **Week 10**: Multi-language support
3. **Week 11**: API development for partners
4. **Week 12**: Performance optimization and security

### **Phase 4: Launch Preparation (Weeks 13-16)**
1. **Week 13**: Comprehensive testing and bug fixes
2. **Week 14**: Content creation and operator onboarding
3. **Week 15**: Marketing website and documentation
4. **Week 16**: Soft launch with select operators

---

## 📊 **Success Metrics & KPIs**

### **Business Metrics**
- **Gross Merchandise Value (GMV)**: Monthly booking volume
- **Take Rate**: Platform commission percentage
- **Monthly Recurring Revenue (MRR)**: Subscription revenue
- **Customer Acquisition Cost (CAC)**: Marketing efficiency
- **Lifetime Value (LTV)**: Customer retention value

### **User Experience Metrics**
- **Conversion Rate**: Visitors to bookings
- **Time to Book**: Booking completion speed
- **Mobile Conversion**: Mobile vs desktop performance
- **Customer Satisfaction**: Review ratings average
- **Operator Satisfaction**: Retention and growth rates

### **Technical Metrics**
- **Page Load Speed**: <2 seconds target
- **Uptime**: 99.9% availability target
- **API Response Time**: <200ms average
- **Mobile Performance**: 90+ Lighthouse score
- **Security**: Zero data breaches

---

## 🔄 **Integration Plan**

### **Third-Party Services**
1. **Stripe**: Payment processing and payouts
2. **Clerk**: Authentication and user management
3. **Supabase**: Database and real-time features
4. **PostHog**: Analytics and feature flags
5. **SendGrid**: Email notifications
6. **Twilio**: SMS notifications (Spain/Germany/UK)

### **API Integrations**
1. **Weather APIs**: Activity weather dependencies
2. **Translation APIs**: Multi-language content
3. **Maps APIs**: Location and directions
4. **Review APIs**: Social proof aggregation

---

## 🛡️ **Security & Compliance**

### **Data Protection**
- **GDPR Compliance**: EU customer data protection
- **PCI DSS**: Payment card data security
- **Data Encryption**: At rest and in transit
- **Regular Audits**: Security assessments

### **Business Compliance**
- **Tourism Licenses**: Mallorca operator requirements
- **Tax Compliance**: Spanish tax obligations
- **Insurance Requirements**: Liability coverage
- **Consumer Protection**: EU booking rights

---

## 📈 **Growth Strategy**

### **Operator Acquisition**
1. **Direct Outreach**: Personal sales to top operators
2. **Industry Events**: Mallorca tourism trade shows
3. **Referral Program**: Operator-to-operator incentives
4. **Competitive Advantage**: Lower commission rates

### **Customer Acquisition**
1. **SEO Strategy**: "Mallorca activities" keyword targeting
2. **Content Marketing**: Activity guides and blogs
3. **Social Media**: Instagram and TikTok presence
4. **Hotel Partnerships**: Concierge recommendations

### **International Expansion**
1. **Phase 1**: Perfect Mallorca operations
2. **Phase 2**: Expand to Ibiza and Menorca
3. **Phase 3**: Canary Islands and mainland Spain
4. **Phase 4**: Other Mediterranean destinations

---

## ⚡ **Next Immediate Actions**

### **Development Setup**
1. Complete project initialization
2. Set up Supabase database with schemas
3. Implement basic authentication flow
4. Create dark theme design system
5. Build first activity catalog page

### **Business Setup**
1. Register Spanish business entity
2. Set up Stripe account for EU operations
3. Create operator onboarding materials
4. Design salesperson recruitment strategy
5. Establish legal compliance framework

---

*This comprehensive plan provides the roadmap for building a market-leading activities platform specifically tailored to Mallorca's unique tourism ecosystem, leveraging our extensive market research and competitive analysis.* 