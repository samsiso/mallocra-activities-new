# Vercel Deployment Guide - Mallorca Activities Platform

## 🚀 Quick Pre-Deployment Checklist

Before deploying to Vercel, always run:
```bash
npm run build              # Test build locally
npm run type-check        # Check TypeScript errors
npm run lint              # Check for linting issues
node scripts/check-build.js  # Verify environment setup
```

## 🔧 Common Build Issues and Solutions

### 1. **Puppeteer Build Failures**

**Error:** `Cannot find module 'puppeteer'` or Chromium download failures

**Solution:**
- Puppeteer is now in `devDependencies` (fixed)
- Test scripts excluded via `.vercelignore`
- For production puppeteer needs, use:
  ```bash
  npm install @sparticuz/chromium puppeteer-core
  ```

### 2. **"Use Server" Directive Errors**

**Error:** `Only async functions are allowed to be exported in a "use server" file`

**Solution:**
- Remove `"use server"` from page components
- Use it only in server action files (`/actions` directory)
- Pages should use standard exports:
  ```typescript
  // ❌ WRONG
  "use server"
  export const dynamic = "force-dynamic"
  
  // ✅ RIGHT
  export const dynamic = "force-dynamic"
  ```

### 3. **Client Component Static Generation Errors**

**Error:** `TypeError: n is not a function` during build

**Solution:**
- Use proper client component structure:
  ```typescript
  "use client"
  
  import { useUser } from "@clerk/nextjs"
  
  export default function MyComponent() {
    // Component logic
  }
  ```
- Avoid complex dynamic imports with SSR

### 4. **Clerk Authentication Build Errors**

**Error:** `The publishableKey passed to Clerk is invalid`

**Solutions:**
- Add dynamic rendering to auth pages:
  ```typescript
  export const dynamic = "force-dynamic"
  ```
- Ensure all Clerk env vars are set in Vercel
- If key ends with `$`, wrap in quotes: `"pk_test_....$"`

**Pages requiring dynamic rendering:**
- `/profile`
- `/bookings`
- `/admin`
- `/todo`
- Any page using `auth()`, `currentUser()`, or `useUser()`

### 5. **Database Connection Errors**

**Error:** `Database unavailable` or `Invalid API key`

**Solution:**
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (CRITICAL!)
- Use admin client for server operations:
  ```typescript
  import { supabaseAdminClient } from '@/lib/supabase-admin'
  ```

### 6. **TypeScript Build Errors**

**Current Setting:** `ignoreBuildErrors: true` in `next.config.mjs`

**Recommendation:**
1. Run `npm run type-check` locally
2. Fix all TypeScript errors
3. Remove `ignoreBuildErrors` from config
4. Use proper typing throughout

## 📋 Required Environment Variables

Add these in Vercel Dashboard (Settings → Environment Variables):

```bash
# Database (ALL REQUIRED)
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # ⚠️ CRITICAL for server operations!

# Authentication (ALL REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Payments
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# External Services
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Email
RESEND_API_KEY=

# SMS (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## 🛠️ Project Configuration Files

### `.vercelignore`
```
# Test files
scripts/quick-test.js
scripts/comprehensive-app-tester.js
scripts/run-e2e-tests.sh
tests/
__tests__/
e2e/
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
playwright-report/
test-results/

# Development files
.env.local
.env.development
docs/
analysis/
prompts/
*.md

# Development tools
.vscode/
.idea/
.cursor/

# MCP configuration
.mcp.json
.claude.json
mcp.json
```

### `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["lhr1"],
  "functions": {
    "app/api/**/*": {
      "maxDuration": 30
    },
    "app/(main)/bookings/page.tsx": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 Deployment Steps

### 1. Local Verification
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run all checks
npm run type-check
npm run lint
npm run build
npm start  # Test production build

# Verify environment
node scripts/check-build.js
```

### 2. Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Add environment variables
vercel env add DATABASE_URL
# ... add all required variables

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3. Using GitHub Integration
1. Push to main branch
2. Vercel auto-deploys
3. Monitor build logs
4. Check deployment

## 🔍 Debugging Deployment Issues

### Check Build Logs
```bash
# View latest logs
vercel logs

# View specific deployment
vercel inspect [deployment-url]
```

### Common Runtime Errors

#### 1. Middleware Errors
- Check `middleware.ts` configuration
- Verify matcher patterns
- Ensure auth setup is correct

#### 2. API Route Failures
- Check environment variables
- Verify database connections
- Test API routes locally first

#### 3. Page Load Errors
- Check browser console
- Verify client-side env vars (NEXT_PUBLIC_*)
- Ensure proper error boundaries

## 📊 Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check specific bundles
npm run analyze:server
npm run analyze:browser
```

### 2. Image Optimization
- Use Next.js Image component
- Configure Cloudinary properly
- Set appropriate sizes in `next.config.mjs`

### 3. Edge Functions
For better performance, consider Edge Runtime:
```typescript
export const runtime = 'edge'  // For API routes
```

## 🛡️ Security Considerations

### 1. Environment Variables
- Never commit `.env.local`
- Use different keys for production
- Rotate keys regularly

### 2. API Security
- Validate all inputs
- Use proper CORS settings
- Implement rate limiting

### 3. Database Security
- Use Row Level Security (RLS)
- Validate permissions
- Sanitize queries

## 📝 Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Build timeout | Remove unused dependencies, optimize imports |
| Function timeout | Increase `maxDuration` in vercel.json |
| Missing env vars | Check Vercel dashboard, ensure all set |
| Auth errors | Add `export const dynamic = "force-dynamic"` |
| Type errors | Run `npm run type-check` and fix |
| Puppeteer errors | Move to devDependencies or use puppeteer-core |
| Database errors | Ensure `SUPABASE_SERVICE_ROLE_KEY` is set |

## 🚨 Emergency Fixes

### Rollback Deployment
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Force Rebuild
```bash
# Clear cache and rebuild
vercel --force
```

### Check Status
- [Vercel Status](https://www.vercel-status.com/)
- [Next.js Issues](https://github.com/vercel/next.js/issues)

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deploy Guide**: https://nextjs.org/docs/deployment
- **Project Issues**: GitHub Issues
- **Community**: Vercel Discord

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Maintainer**: Mallorca Activities Team