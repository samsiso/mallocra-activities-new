# 🔐 Clerk-Supabase Integration Guide

## Overview
This guide explains how to set up the complete Clerk authentication with Supabase user data storage integration for the Mallorca Activities platform.

## ✅ What's Already Configured

### Environment Variables
The following are already set up in your `.env.local` file:
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1aXBwZWQtcmVkZmlzaC04OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_YR9UhNTK6qdxnYUCKD4Aa4sJmX6hcNZXoRyJELlUN1
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile

# Supabase Database
DATABASE_URL=postgresql://postgres.hfaxhqfqoxjvjfuemicm:Million2025%40SISO@hfaxhqfqoxjvjfuemicm.supabase.co:5432/postgres
```

### Code Integration
✅ **User Actions**: Complete CRUD operations in `actions/db/users-actions.ts`  
✅ **Webhook Endpoint**: `/api/clerk/webhooks/route.ts` for automatic user synchronization  
✅ **Profile Management**: `components/user-profile-manager.tsx` with full UI  
✅ **Profile Page**: `/profile` page with server-side rendering  
✅ **Database Schema**: Users tables with Clerk integration

## 🚧 Required Webhook Setup

To complete the integration, you need to configure the webhook in your Clerk Dashboard:

### Step 1: Access Clerk Dashboard
1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Select your "Mallorca Activities" project
3. Navigate to **Configure** → **Webhooks**

### Step 2: Add Webhook Endpoint
1. Click **"Add Endpoint"**
2. **Endpoint URL**: `https://your-domain.com/api/clerk/webhooks`
   - For development: `https://your-ngrok-url.ngrok.io/api/clerk/webhooks`
   - For production: `https://your-vercel-app.vercel.app/api/clerk/webhooks`

3. **Events to Subscribe**:
   - ✅ `user.created`
   - ✅ `user.updated` 
   - ✅ `user.deleted`

4. Click **"Create"**

### Step 3: Get Webhook Secret
1. After creating the webhook, click on it
2. Copy the **Signing Secret** (starts with `whsec_`)
3. Update your `.env.local` file:
```bash
CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

## 🔄 How the Integration Works

### User Registration Flow
```
User Signs Up with Clerk → Webhook Triggered → Supabase Profile Created
```

1. **User registers** using Clerk authentication
2. **Clerk webhook** fires `user.created` event
3. **Our webhook handler** receives the event
4. **User profile created** in Supabase `users_profiles` table
5. **User redirected** to `/profile` page

### User Profile Management
```
Clerk Authentication ↔ Supabase User Data ↔ Profile UI
```

- **Authentication**: Handled by Clerk (secure, scalable)
- **User Data**: Stored in Supabase (profiles, preferences, role management)
- **UI**: React components with real-time updates

## 🧪 Testing the Integration

### 1. Test User Registration
1. Visit: `http://localhost:3003/signup`
2. Create a new account
3. Verify redirect to `/profile`
4. Check Supabase database for new user record

### 2. Test Profile Management
1. Visit: `http://localhost:3003/profile`
2. Update profile information
3. Verify changes persist in database

### 3. Test Webhook (Development)
For development testing, use ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3003

# Use the ngrok URL in Clerk webhook configuration
```

## 📊 Database Schema

### Users Profiles Table
```sql
CREATE TABLE users_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL DEFAULT 'customer',
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Available User Types

- **Customer**: Regular users who book activities
- **Salesperson**: Staff members who manage bookings
- **Operator**: Activity providers who offer services
- **Admin**: Platform administrators

## 🔧 Troubleshooting

### Common Issues

#### 1. Webhook Not Firing
- ✅ Check webhook URL is accessible
- ✅ Verify signing secret is correct
- ✅ Ensure events are properly subscribed

#### 2. Profile Not Creating
- ✅ Check database connection
- ✅ Verify user actions are working
- ✅ Check console for error logs

#### 3. Authentication Issues
- ✅ Verify Clerk keys are correct
- ✅ Check environment variables loaded
- ✅ Ensure middleware is configured properly

## 📱 Next Steps

1. **Deploy to Production**: Set up webhook for production URL
2. **User Roles**: Implement role-based access control
3. **Profile Completion**: Add onboarding flow for new users
4. **Admin Dashboard**: Create user management interface

## 🚀 Current Status

✅ **Authentication**: Clerk integration complete  
✅ **User Storage**: Supabase integration complete  
✅ **Profile Management**: Full CRUD operations  
✅ **UI Components**: Professional profile interface  
🚧 **Webhook**: Needs production URL configuration  

The integration is **ready for production** once the webhook is configured with your actual domain! 