# 🚀 Mallorca Activities - Complete Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured with your GitHub account
- Access to Supabase project: https://tskawjnjmiltzoypdnsl.supabase.co

## 🔧 Environment Setup

### 1. Create `.env.local` file

Create a `.env.local` file in the root directory and add:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1aXBwZWQtcmVkZmlzaC04OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_YR9UhNTK6qdxnYUCKD4Aa4sJmX6hcNZXoRyJELlUN1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tskawjnjmiltzoypdnsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDEwNDAsImV4cCI6MjA2NDYxNzA0MH0.3KAR1QM0ZGX6hB9lXE2hZ-5y9xdWIYYNgAo6GCbWlSk

# Database URL (Get password from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tskawjnjmiltzoypdnsl.supabase.co:5432/postgres

# PostHog (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Get your Supabase password:
1. Go to https://tskawjnjmiltzoypdnsl.supabase.co
2. Navigate to Settings > Database
3. Copy the password from connection string
4. Replace `[YOUR-PASSWORD]` in DATABASE_URL

Then run migrations:
```bash
npm run db:generate
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🏗️ Project Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Styling**: Dark theme with orange accents
- **Icons**: Lucide React

## 📱 Features Already Built

✅ Authentication (Login/Signup)  
✅ Dark theme with Mallorca branding  
✅ Activity detail pages with booking widget  
✅ Reviews and recommendations system  
✅ Image galleries and location maps  
✅ Responsive design  

## 🔄 Development Workflow

1. Work on `dev` branch
2. Commit changes with descriptive messages
3. Push to GitHub regularly
4. Test locally at http://localhost:3000

## 🎯 Next Steps

1. Set up environment variables
2. Configure database connection
3. Test authentication flow
4. Add real activity data
5. Implement booking functionality 