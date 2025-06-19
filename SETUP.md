# 🏝️ Mallorca Activities Setup Instructions

## 🔑 Environment Variables

You need to create a `.env.local` file in the root directory with the following variables:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1aXBwZWQtcmVkZmlzaC04OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_YR9UhNTK6qdxnYUCKD4Aa4sJmX6hcNZXoRyJELlUN1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tskawjnjmiltzoypdnsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2F3am5qbWlsdHpveXBkbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDEwNDAsImV4cCI6MjA2NDYxNzA0MH0.3KAR1QM0ZGX6hB9lXE2hZ-5y9xdWIYYNgAo6GCbWlSk

# Database URL for Drizzle (you'll need to get your password from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tskawjnjmiltzoypdnsl.supabase.co:5432/postgres

# PostHog (optional - for analytics)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## 🗄️ Database Setup

### Getting Your Supabase Password

1. Go to your Supabase project: https://tskawjnjmiltzoypdnsl.supabase.co
2. Navigate to **Settings** > **Database**
3. Copy the password from the connection string
4. Replace `[YOUR-PASSWORD]` in the `DATABASE_URL` above

### Running Migrations

Once you have the `DATABASE_URL` set up, run:

```bash
npm run db:generate
npm run db:migrate
```

## 🚀 Running the App

1. Install dependencies: `npm install`
2. Create `.env.local` with the variables above
3. Start the development server: `npm run dev`
4. Open http://localhost:3000

## ✅ What's Already Set Up

- ✅ **Clerk Authentication**: Login/Signup pages with dark theme
- ✅ **Supabase Integration**: Database connection configured
- ✅ **Dark Theme**: Enforced across all components with orange accents
- ✅ **Drizzle ORM**: Database schema and migrations ready
- ✅ **Mallorca Branding**: Updated hero section and metadata
- ✅ **TypeScript**: Full type safety configured
- ✅ **Tailwind CSS**: Dark theme classes applied

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 18+ and TypeScript
- **Authentication**: Clerk with protected routes
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Dark mode with orange accent colors

## 🔐 Authentication Flow

1. Users can access the landing page at `/`
2. Click "Start Exploring" to go to `/signup`
3. After authentication, they're redirected to `/todo`
4. Protected routes require authentication via middleware

## 🎨 UI Components

All UI components are pre-configured with:
- Dark theme (`bg-gray-900`, `text-white`)
- Orange accent colors (`text-orange-500`, `bg-orange-600`)
- Consistent dark styling across all pages

Your app is ready to go! 🎉 