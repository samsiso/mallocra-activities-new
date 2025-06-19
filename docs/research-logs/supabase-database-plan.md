# Supabase Database Implementation Plan

## Overview

This document outlines the database schema and implementation plan for the Mallorca Activities client application. After analyzing the codebase, we've identified key features requiring database support and have designed an appropriate Supabase schema.

## Core Features Requiring Database Support

1. **User Management**
   - Customer accounts with profiles
   - Role-based access (customers, salespeople, operators, admins)
   - Authentication via Clerk integration

2. **Activities Management**
   - Activity listings with details, pricing, and availability
   - Categories and filtering
   - Image storage and management
   - Add-ons and extras

3. **Booking System**
   - Reservation management
   - Payment processing
   - Commission tracking
   - Booking status lifecycle

4. **Reviews and Ratings**
   - Customer reviews for activities
   - Rating aggregation
   - Operator responses

5. **Storage Requirements**
   - Activity images
   - User profile photos
   - Review attachments

## Database Schema Plan

The following tables should be implemented in Supabase:

### User Management Tables

1. **users_profiles**
   - Extends Clerk authentication
   - Stores user profile information
   - Links to role-specific tables

2. **salespeople**
   - Extended information for users with salesperson role
   - Commission rates and territories

3. **operators**
   - Extended information for activity providers
   - Business details and verification status

4. **profiles**
   - Basic profiles linked to Clerk authentication
   - Membership status tracking (free/pro)
   - Stripe integration for subscriptions

### Activities Management Tables

1. **activities**
   - Core activity information
   - SEO-friendly slugs
   - Categorization
   - Rating aggregation

2. **activity_images**
   - Image URLs and metadata
   - Alt text for accessibility
   - Primary image flag

3. **activity_pricing**
   - Different price types (adult, child, etc.)
   - Seasonal pricing support
   - Currency handling

4. **activity_availability**
   - Real-time availability tracking
   - Date and time slots
   - Capacity management

5. **activity_add_ons**
   - Optional extras for activities
   - Pricing for add-ons

### Booking System Tables

1. **bookings**
   - Reservation details
   - Customer information
   - Pricing breakdown
   - Status tracking

2. **booking_add_ons**
   - Junction table for bookings and add-ons
   - Quantity and pricing information

3. **payments**
   - Payment processing records
   - Stripe integration
   - Refund handling

4. **commissions**
   - Commission calculations
   - Platform and salesperson shares
   - Payment status

### Reviews and Feedback Tables

1. **reviews**
   - Customer reviews for activities
   - Rating data
   - Photo attachments
   - Operator responses

### Utility Tables

1. **todos**
   - Simple todo tracking for users
   - Pro membership feature

## Enums to Implement

The following PostgreSQL enums should be created:

1. `user_type`: customer, salesperson, operator, admin
2. `user_status`: active, inactive, suspended, pending
3. `activity_category`: water_sports, land_adventures, cultural, nightlife, family_fun
4. `activity_status`: active, inactive, draft, suspended
5. `availability_status`: available, limited, full, cancelled
6. `weather_status`: good, marginal, cancelled
7. `price_type`: adult, child, senior, group, family
8. `booking_status`: pending, confirmed, cancelled, completed, no_show
9. `payment_status`: pending, authorized, paid, refunded, failed
10. `payment_method`: card, paypal, apple_pay, google_pay, sepa, cash
11. `commission_status`: pending, calculated, paid, withheld
12. `membership`: free, pro
13. `role`: assistant, user (for messages)

## Supabase Storage Buckets

The following storage buckets should be created:

1. **activity-images**
   - Public bucket for activity photos
   - Structure: `activity-images/{activityId}/{filename}`

2. **profile-images**
   - Public bucket for user profile photos
   - Structure: `profile-images/{userId}/{filename}`

3. **review-attachments**
   - Public bucket for review photos
   - Structure: `review-attachments/{reviewId}/{filename}`

## Row Level Security (RLS) Policies

The following RLS policies should be implemented:

### For Tables

1. **Users Profiles Table**
   ```sql
   CREATE POLICY "Users can read any profile"
   ON users_profiles
   FOR SELECT
   USING (true);

   CREATE POLICY "Users can update own profile"
   ON users_profiles
   FOR UPDATE
   USING (auth.uid()::text = clerk_user_id);
   ```

2. **Activities Table**
   ```sql
   CREATE POLICY "Anyone can view published activities"
   ON activities
   FOR SELECT
   USING (status = 'active');

   CREATE POLICY "Operators can manage their own activities"
   ON activities
   FOR ALL
   USING (auth.uid()::text IN (
     SELECT clerk_user_id FROM users_profiles 
     WHERE id = operator_id
   ));
   ```

3. **Bookings Table**
   ```sql
   CREATE POLICY "Users can view their own bookings"
   ON bookings
   FOR SELECT
   USING (auth.uid()::text IN (
     SELECT clerk_user_id FROM users_profiles 
     WHERE id = customer_id
   ));

   CREATE POLICY "Operators can view bookings for their activities"
   ON bookings
   FOR SELECT
   USING (activity_id IN (
     SELECT id FROM activities 
     WHERE operator_id IN (
       SELECT id FROM users_profiles 
       WHERE clerk_user_id = auth.uid()::text
     )
   ));
   ```

### For Storage Buckets

1. **activity-images Bucket**
   ```sql
   CREATE POLICY "Public read access for activity images"
   ON storage.objects
   FOR SELECT
   USING (bucket_id = 'activity-images');

   CREATE POLICY "Operators can upload activity images"
   ON storage.objects
   FOR INSERT
   WITH CHECK (
     bucket_id = 'activity-images' AND
     (storage.foldername(name))[1] IN (
       SELECT id::text FROM activities
       WHERE operator_id IN (
         SELECT id FROM users_profiles
         WHERE clerk_user_id = auth.uid()::text
       )
     )
   );
   ```

2. **profile-images Bucket**
   ```sql
   CREATE POLICY "Public read access for profile images"
   ON storage.objects
   FOR SELECT
   USING (bucket_id = 'profile-images');

   CREATE POLICY "Users can manage their own profile images"
   ON storage.objects
   FOR ALL
   USING (
     bucket_id = 'profile-images' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

## Implementation Steps

1. **Set up Supabase Project**
   - Confirm existing project credentials
   - Verify database connection

2. **Create Database Schema**
   - Deploy existing schemas via Drizzle
   - Create necessary enums
   - Set up foreign key relationships

3. **Configure Storage**
   - Create the three storage buckets
   - Set up public/private access as needed

4. **Implement RLS Policies**
   - Set up row-level security for all tables
   - Configure storage bucket policies

5. **Develop Server Actions**
   - Create actions/db files for all main tables
   - Follow CRUD pattern (Create, Read, Update, Delete)
   - Use ActionState pattern for consistency

6. **Create Storage Actions**
   - Build upload/download functions for images
   - Implement proper file handling

7. **Set up Webhook Endpoints**
   - Create webhook handlers for Stripe
   - Handle auth events from Clerk

## Implementation Status

The following implementation tasks have been completed:

### Database Setup
- ✅ All tables created with proper schemas
- ✅ Enums defined for categorical data
- ✅ Primary and foreign key relationships established
- ✅ Default values and constraints applied

### Storage Implementation
- ✅ Created 3 storage buckets:
  - `activity-images` for activity photos
  - `profile-images` for user profile photos
  - `review-attachments` for review photos
- ✅ Defined appropriate public/private access settings

### Security Implementation
- ✅ Enabled Row Level Security (RLS) on all tables
- ✅ Created RLS policies for controlling access:
  - Users can view all activities but only manage their own profiles and bookings
  - Operators can manage their own activities and view related bookings
  - Admins have full access to manage all content
- ✅ Set up bucket policies for storage access control

### Performance Optimizations
- ✅ Created indexes for frequently queried columns:
  - Category, location, and status indexes on activities
  - User type and status indexes on users_profiles
  - Date and status indexes on availability and bookings
- ✅ Created views for common queries:
  - `activity_details` - Complete activity information with operator details
  - `available_activities` - Activities with available slots
  - `booking_details` - Bookings with related activity information

### Database Functions
- ✅ Created search function:
  - `search_activities_v2` - Flexible activity search with filtering
- ✅ Created availability function:
  - `check_availability_simple` - Get available slots for an activity
- ✅ Created booking management functions:
  - `create_booking` - Create a booking and update availability
  - `update_booking_status` - Handle booking status changes
  - `calculate_salesperson_commission` - Calculate commissions
- ✅ Created user dashboard function:
  - `get_user_dashboard` - Get a user's bookings, favorites, and todos
- ✅ Created utility functions:
  - `get_activity_images_urls` - Generate public URLs for images
  - `update_activity_rating` - Update average ratings automatically

### Sample Data
- ✅ Added sample users with different roles:
  - Customers
  - Operators
  - Salespeople
  - Admin
- ✅ Added sample activities with complete details:
  - Descriptions
  - Pricing
  - Images
  - Availability
  - Add-ons
- ✅ Added sample bookings and reviews

## Next Steps

1. **Implement API Functions**
   - Create server-side functions for common operations
   - Optimize query performance for high-traffic endpoints

2. **Monitoring & Maintenance**
   - Set up database monitoring
   - Create regular backup schedule
   - Implement query optimization monitoring

3. **Data Migration Plan**
   - Develop strategy for migrating existing data
   - Create data validation checks

4. **User Feedback Loop**
   - Implement analytics tracking
   - Create feedback collection mechanisms

## Notes and Considerations

- All tables should include createdAt and updatedAt timestamps
- Use UUID as primary keys for all tables
- Implement proper cascade deletion where appropriate
- Ensure proper indexing for frequently queried fields
- Consider implementing soft deletes for critical data 