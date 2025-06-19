# 📅 Booking System Implementation Plan

## Overview

This document outlines the implementation plan for the booking system in the Mallorca Activities platform. The booking system will handle activity reservations, availability management, confirmation, and user booking management.

## Current Status

The application currently has:
- Basic booking schema in the database
- Initial booking widget UI on activity pages
- Limited booking management functionality

## Implementation Goals

1. Create a complete booking flow from selection to confirmation
2. Implement calendar-based availability management
3. Add booking management for users and administrators
4. Implement confirmation and notification system
5. Create a booking history and details view

## Database Schema

We're using the existing bookings schema (in `db/schema/bookings-schema.ts`):

```typescript
export const bookingsTable = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id)
    .notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  adultCount: integer("adult_count").notNull().default(1),
  childCount: integer("child_count").notNull().default(0),
  specialRequests: text("special_requests"),
  referenceCode: text("reference_code").notNull().unique(),
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export const bookingParticipantsTable = pgTable("booking_participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookingsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  type: participantTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})
```

## Implementation Plan

### 1. Enhanced Booking Widget

#### Component Structure
- Improve `app/activities/[id]/_components/booking-widget.tsx`
- Create reusable sub-components:
  - `date-picker.tsx` - Calendar for date selection
  - `time-slot-selector.tsx` - Time slot selection
  - `participant-counter.tsx` - Participant count selection
  - `booking-summary.tsx` - Booking summary and total
  - `booking-form.tsx` - Additional booking information form

#### Functionality
- Real-time availability checking
- Dynamic pricing calculation based on participant count
- Special requirements input
- Validation for all inputs
- Smooth multi-step process

### 2. Booking Flow

#### Steps
1. **Date & Time Selection**
   - Calendar view with available dates
   - Time slot selection based on activity schedule
   - Real-time availability check

2. **Participant Information**
   - Number of adults and children
   - Dynamic pricing calculation
   - Participant details collection (optional for larger groups)

3. **Booking Details**
   - Special requests
   - Contact information
   - Additional options (transfers, equipment, etc.)

4. **Review & Confirm**
   - Booking summary
   - Terms and conditions
   - Cancellation policy

5. **Payment**
   - Integration with Stripe
   - Multiple payment methods
   - Secure checkout

6. **Confirmation**
   - Booking reference
   - Confirmation email
   - Add to calendar option

### 3. Booking Management

#### User Booking Management
- Create `app/(main)/bookings/page.tsx` - List all user bookings
- Create `app/(main)/bookings/[id]/page.tsx` - Booking details page
- Implement booking actions:
  - View booking details
  - Cancel booking
  - Modify booking (date, participants)
  - Download invoice/receipt
  - Contact provider

#### Admin Booking Management
- Create `app/admin/bookings/page.tsx` - Admin booking dashboard
- Create `app/admin/bookings/[id]/page.tsx` - Admin booking details
- Implement admin actions:
  - Approve/reject bookings
  - Modify booking details
  - Cancel with/without penalty
  - Send custom notifications
  - Export booking data

### 4. Availability Management

#### Calendar System
- Create a calendar component for availability visualization
- Implement blocked date management
- Support recurring availability patterns
- Handle seasonal variations

#### Availability Actions
- Create server actions for availability management:
  - Check availability for date/time
  - Reserve time slot temporarily during booking process
  - Block dates/times for maintenance or unavailability
  - Set capacity limits for specific dates

### 5. Notification System

#### Email Notifications
- Booking confirmation email
- Booking reminder (24h before)
- Booking modification confirmation
- Cancellation notification
- Review request (post-activity)

#### In-App Notifications
- Booking status updates
- Upcoming booking reminders
- Special offers for repeat customers
- Weather alerts for outdoor activities

### 6. Mobile Optimization

- Ensure booking widget works well on mobile
- Optimize date picker for touch interfaces
- Create responsive layouts for all booking pages
- Test checkout flow on mobile devices

## Technical Considerations

### State Management
- Use form state management for multi-step booking process
- Implement proper validation at each step
- Maintain booking state during the entire flow

### Availability Calculation
- Implement efficient algorithms for availability checking
- Consider caching for improved performance
- Handle edge cases (last-minute bookings, cancellations)

### Payment Integration
- Secure Stripe integration
- Handle payment failures gracefully
- Implement proper order reconciliation

### Security
- Validate all booking data server-side
- Implement rate limiting for booking requests
- Ensure proper authentication for booking actions

## Implementation Timeline

| Task | Estimated Time | Dependencies | Priority |
|------|----------------|--------------|----------|
| Enhanced booking widget | 3 days | None | High |
| Date and time selection | 2 days | Booking widget | High |
| Participant management | 2 days | Booking widget | High |
| Booking details form | 2 days | Participant management | Medium |
| Payment integration | 3 days | Booking details | High |
| Confirmation system | 2 days | Payment integration | Medium |
| User booking management | 3 days | Confirmation system | Medium |
| Admin booking management | 4 days | User booking management | Medium |
| Availability calendar | 3 days | None | High |
| Notification system | 2 days | Confirmation system | Low |
| Mobile optimization | 3 days | All components | Medium |
| Testing and bug fixes | 4 days | All features | High |

## Testing Plan

1. Unit tests for booking actions
2. Integration tests for booking flow
3. Payment flow testing with Stripe test accounts
4. Availability algorithm testing
5. Email notification testing
6. Mobile usability testing
7. Load testing for concurrent bookings

## Future Enhancements

- Group bookings management
- Seasonal pricing rules
- Waitlist system for fully booked activities
- Flexible cancellation policies
- Dynamic capacity management
- Bundle bookings (multiple activities)

## Research Needed

- Best practices for calendar UI implementation
- Optimal booking flow UX patterns
- Efficient availability algorithms
- Email template design

## Dependencies

- Clerk for user authentication
- Supabase for data storage
- Stripe for payment processing
- Email service for notifications

## Notes

This implementation plan focuses on creating a robust booking system that balances ease of use with necessary functionality. The system will be designed to scale as the platform grows and can be extended with additional features in future iterations.

Last Updated: 2023-05-15 