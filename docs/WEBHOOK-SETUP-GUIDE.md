# 🔗 Clerk Webhook Setup Guide

## Why Users Aren't Syncing

The reason users can login to Clerk but don't appear in Supabase is that **the webhook hasn't been configured in Clerk Dashboard yet**. 

Webhooks are how Clerk automatically notifies our app when users sign up, update their profiles, or delete their accounts.

---

## 🚀 Quick Setup Steps

### 1. **Test Manual Sync First** 
Before setting up the webhook, let's test if the sync functionality works:

1. **Go to**: http://localhost:3004/test-db/sync-user
2. **Login** with your Clerk account 
3. **Click**: "Sync to Supabase" button
4. **Verify**: You should see "✅ Sync successful!"

### 2. **Configure Webhook in Clerk Dashboard**

#### Step 2.1: Get Your Webhook URL
- **Local Development**: `http://localhost:3004/api/clerk/webhooks`
- **Production**: `https://yourdomain.com/api/clerk/webhooks`

For local testing, you'll need to use **ngrok** to expose your local server:
```bash
# Install ngrok if you haven't
brew install ngrok

# Expose your local server
ngrok http 3004

# Use the https URL that ngrok provides
# Example: https://abc123.ngrok.io/api/clerk/webhooks
```

#### Step 2.2: Add Webhook in Clerk Dashboard

1. **Go to**: [Clerk Dashboard](https://dashboard.clerk.dev)
2. **Select** your project: "equipped-redfish-89"
3. **Navigate to**: Webhooks → "Add Endpoint"
4. **Endpoint URL**: Enter your webhook URL
   - Local: `https://YOUR_NGROK_URL.ngrok.io/api/clerk/webhooks`
   - Production: `https://yourdomain.com/api/clerk/webhooks`

#### Step 2.3: Configure Events
Select these events to sync:
- ✅ `user.created` - When new users sign up
- ✅ `user.updated` - When users update their profile
- ✅ `user.deleted` - When users delete their account

#### Step 2.4: Get Webhook Secret
1. **After creating** the webhook, Clerk will provide a **Signing Secret**
2. **Copy** the secret (starts with `whsec_`)
3. **Update** your `.env.local` file:

```bash
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

### 3. **Test the Webhook**

#### Step 3.1: Restart Your Server
```bash
npm run dev
```

#### Step 3.2: Test User Creation
1. **Sign up** a new user through Clerk
2. **Check** if the user appears in Supabase automatically
3. **Verify** in your browser console for any webhook logs

---

## 🔧 Troubleshooting

### Webhook Not Firing?
- ✅ **Verify** the webhook URL is accessible
- ✅ **Check** that ngrok is running (for local development)
- ✅ **Confirm** the webhook secret is correct
- ✅ **Look** at Clerk Dashboard webhook logs for delivery attempts

### Still Not Working?
1. **Check** browser console for errors
2. **Verify** the Supabase connection in the logs
3. **Test** manual sync first at `/test-db/sync-user`
4. **Restart** the development server after changing environment variables

### Environment Variables Checklist
```bash
# Required for Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Required for Supabase
DATABASE_URL=postgresql://...
```

---

## 🎯 Expected Result

After proper setup:
1. **User signs up** → Clerk webhook fires → User automatically created in Supabase
2. **User updates profile** → Webhook fires → Supabase profile updated
3. **User deletes account** → Webhook fires → Supabase profile deleted

The goal is **automatic synchronization** without manual intervention!

---

## 📚 Next Steps

1. **Configure webhook** following this guide
2. **Test** with a new user signup
3. **Verify** users appear in both Clerk and Supabase
4. **Deploy** to production with proper webhook URL 