# 👤 User Management Implementation Plan

## Overview

This document outlines the implementation plan for the user management system in the Mallorca Activities platform. The user management system will handle user profiles, account settings, preferences, and related functionality.

## Current Status

The application currently has:
- Basic Clerk authentication for login/signup
- Basic user profile storage in the database
- Limited profile data management

## Implementation Goals

1. Create a comprehensive user profile management system
2. Implement user settings and preferences
3. Add profile image/avatar handling
4. Implement privacy and notification settings
5. Create a user dashboard for booking history and favorites

## Database Schema

We're using the existing profiles schema (in `db/schema/profiles-schema.ts`):

```typescript
export const profilesTable = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  imageUrl: text("image_url"),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})
```

We may need to extend this schema with additional fields:
- phoneNumber
- address
- preferences (JSON)
- notificationSettings (JSON)
- language preference

## Implementation Plan

### 1. User Profile Page

#### Route Structure
- Create `app/(main)/profile/page.tsx` - Main profile page (server component)
- Create `app/(main)/profile/edit/page.tsx` - Profile editing page
- Create `app/(main)/profile/settings/page.tsx` - Settings page

#### Components
- `_components/profile-header.tsx` - Profile header with user info and avatar
- `_components/profile-tabs.tsx` - Navigation tabs for profile sections
- `_components/profile-form.tsx` - Form for editing profile information
- `_components/avatar-upload.tsx` - Component for avatar upload and management
- `_components/settings-form.tsx` - Form for user settings and preferences

#### Data Flow
1. User visits profile page
2. Server component fetches user profile data
3. Page renders appropriate UI based on data
4. Edit forms submit to server actions

### 2. Profile Actions

Extend the existing profile actions in `actions/db/profiles-actions.ts`:

```typescript
// Current actions
export async function createProfileAction(profile: InsertProfile): Promise<ActionState<SelectProfile>>
export async function getProfileAction(userId: string): Promise<ActionState<SelectProfile | null>>
export async function updateProfileAction(userId: string, data: Partial<InsertProfile>): Promise<ActionState<SelectProfile>>
export async function updateProfileByStripeCustomerIdAction(customerId: string, data: Partial<InsertProfile>): Promise<ActionState<SelectProfile>>
export async function deleteProfileAction(userId: string): Promise<ActionState<void>>

// New actions to implement
export async function updateProfileImageAction(userId: string, imageUrl: string): Promise<ActionState<SelectProfile>>
export async function updateProfileSettingsAction(userId: string, settings: ProfileSettings): Promise<ActionState<SelectProfile>>
export async function updateNotificationPreferencesAction(userId: string, preferences: NotificationPreferences): Promise<ActionState<SelectProfile>>
```

### 3. UI Implementation

#### Profile Page
- Header with user info and stats
- Tabs for different sections:
  - Personal Info
  - Bookings
  - Wishlist
  - Settings

#### Profile Edit Form
- Personal information fields:
  - Name
  - Email
  - Phone
  - Address
- Form validation
- Save/Cancel buttons
- Success/error messaging

#### Settings Page
- Account preferences
- Notification settings
- Privacy settings
- Language preferences
- Theme preferences (dark/light mode)

#### Avatar Management
- Image upload interface
- Image cropping
- Remove image option
- Default avatar fallback

### 4. Integration with Auth

- Extend Clerk auth integration to sync profile data
- Handle account deletion properly
- Manage email verification flow
- Implement password change functionality

### 5. Mobile Optimization

- Ensure all profile pages are responsive
- Optimize forms for mobile input
- Create mobile-specific layouts where needed
- Test on various device sizes

## Technical Considerations

### State Management
- Use React context for profile state if needed
- Otherwise rely on server components for data fetching

### Form Handling
- Use react-hook-form for form validation and submission
- Implement proper error handling and feedback

### Image Upload
- Use Supabase storage for avatar images
- Implement client-side image optimization before upload
- Set up proper bucket policies for user uploads

### Security
- Ensure proper auth checks on all profile routes
- Validate all form inputs server-side
- Implement CSRF protection

## Implementation Timeline

| Task | Estimated Time | Dependencies | Priority |
|------|----------------|--------------|----------|
| Create profile route structure | 1 day | None | High |
| Implement profile page UI | 2 days | Route structure | High |
| Extend profile actions | 1 day | None | High |
| Implement profile edit form | 2 days | Profile actions | High |
| Implement avatar management | 2 days | Profile actions | Medium |
| Create settings page | 2 days | Profile page | Medium |
| Implement notification preferences | 1 day | Settings page | Low |
| Mobile optimization | 2 days | All UI components | Medium |
| Testing and bug fixes | 2 days | All features | High |

## Testing Plan

1. Unit tests for profile actions
2. Integration tests for profile page
3. E2E tests for profile editing flow
4. Mobile testing on multiple devices
5. Security testing for profile routes

## Future Enhancements

- Social media account linking
- Two-factor authentication
- Advanced privacy controls
- User activity timeline
- Enhanced notification system

## Research Needed

- Best practices for profile image handling
- Optimal user settings UX patterns
- Privacy considerations for user data

## Dependencies

- Clerk for authentication
- Supabase for data storage
- React Hook Form for form handling
- Supabase Storage for image uploads

## Notes

This plan focuses on the core user management functionality. Additional features like advanced notification preferences or social media integration can be implemented in future iterations.

Last Updated: 2023-05-15 