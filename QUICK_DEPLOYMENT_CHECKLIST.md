# 🚀 Quick Deployment Checklist - Mallorca Activities Platform

## ✅ What You Already Have:
- [x] Supabase database configured
- [x] Clerk authentication set up
- [x] Google Maps API key
- [x] Complete codebase with all features
- [x] Telegram notification system (code ready)

## 🔧 What You Need to Add (30 minutes):

### 1. **Telegram Setup** (5 minutes)
- [ ] Message @BotFather on Telegram
- [ ] Create bot and get token
- [ ] Get your chat ID
- [ ] Update `.env.local` with:
  ```
  TELEGRAM_BOT_TOKEN=your-actual-token
  TELEGRAM_ADMIN_CHAT_ID=your-actual-chat-id
  ```

### 2. **Stripe Setup** (15 minutes)
- [ ] Create Stripe account at stripe.com
- [ ] Get API keys from dashboard
- [ ] Create webhook endpoint
- [ ] Update `.env.local` with:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

### 3. **Database Migration** (5 minutes)
```bash
npm install
npm run db:generate
npm run db:migrate
```

### 4. **Test Locally** (5 minutes)
```bash
npm run dev
```
- [ ] Test registration/login
- [ ] Test activity browsing
- [ ] Create test booking (if Stripe configured)

## 🚀 Deploy to Production:

### Vercel Deployment (10 minutes)
1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

### Required Environment Variables for Vercel:
```
# Copy all from .env.local plus:
SUPABASE_SERVICE_ROLE_KEY=service_role_key_from_supabase
CLOUDINARY_API_KEY=your_cloudinary_key (optional)
CLOUDINARY_API_SECRET=your_cloudinary_secret (optional)
```

## 📱 Test Telegram Notifications:
1. Make a test booking
2. Check Telegram for instant notification
3. Test other alerts (cancellation, review, etc.)

## 🎯 That's It!
Your platform is ready for real bookings with:
- Full booking system
- Payment processing
- Telegram business alerts
- Admin dashboard
- Customer management

**Total Time: ~45 minutes to full production deployment!**