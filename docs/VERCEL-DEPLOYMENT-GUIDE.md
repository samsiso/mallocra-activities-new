# Vercel Deployment Guide - Preventing Build Failures

## 🚀 Quick Pre-Deployment Checklist

Before deploying to Vercel, run:
```bash
node scripts/check-build.js
```

## 🔧 Common Issues and Solutions

### 1. **Clerk Authentication Errors**

**Error:** `The publishableKey passed to Clerk is invalid`

**Solutions:**
- Add `export const dynamic = "force-dynamic"` to any page using Clerk auth
- Ensure environment variables are set in Vercel dashboard
- If key ends with `$`, wrap it in quotes in Vercel: `"pk_test_....$"`

**Pages that need dynamic rendering:**
```typescript
// Add this to any page using auth(), currentUser(), or useUser()
export const dynamic = "force-dynamic"
```

### 2. **Environment Variable Issues**

**Required Variables:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

**Vercel Settings:**
1. Go to: https://vercel.com/[team]/[project]/settings/environment-variables
2. Add each variable
3. Select all environments: Production ✓, Preview ✓, Development ✓

### 3. **Static Generation with Auth**

**Problem:** Next.js tries to statically generate pages that need authentication

**Solution:** Force dynamic rendering on these pages:
- `/todo`
- `/profile`
- `/bookings`
- `/admin`
- `/debug-auth`

### 4. **Build Optimization**

**Add to package.json scripts:**
```json
{
  "scripts": {
    "prebuild:check": "node scripts/check-build.js",
    "build": "npm run prebuild:check && next build"
  }
}
```

## 📋 Deployment Steps

1. **Local Verification:**
   ```bash
   npm run build  # Test build locally
   node scripts/check-build.js  # Run checks
   ```

2. **Environment Setup:**
   - Copy values from `.env.local`
   - Add to Vercel dashboard
   - Verify no missing variables

3. **Git Workflow:**
   ```bash
   git add -A
   git commit -m "fix: deployment configuration"
   git push origin main
   ```

4. **Monitor Deployment:**
   - Check Vercel dashboard
   - Watch build logs
   - Verify all pages load

## 🛡️ Preventing Future Issues

### 1. **Always Test Locally First**
```bash
npm run build && npm start
```

### 2. **Use Dynamic Rendering for Auth Pages**
```typescript
// For any page using authentication
export const dynamic = "force-dynamic"
```

### 3. **Environment Variable Validation**
```javascript
// Add to your code
if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk publishable key")
}
```

### 4. **Automated Checks**
- Run `check-build.js` before every deployment
- Add to CI/CD pipeline
- Use GitHub Actions for automated testing

## 🔍 Debugging Tips

1. **Check Vercel Function Logs:**
   - Go to Functions tab in Vercel
   - Look for middleware errors

2. **Environment Variable Issues:**
   - Verify in Vercel dashboard
   - Check for special characters
   - Ensure proper escaping

3. **Build Output:**
   - Look for "Generating static pages" errors
   - Check which pages fail
   - Add dynamic export to those pages

## 📝 Quick Fixes

### Force Dynamic on All Auth Pages:
```bash
# Find all pages with auth
grep -r "auth()" app/
grep -r "currentUser" app/
grep -r "useUser" app/

# Add to each file:
export const dynamic = "force-dynamic"
```

### Verify Environment Variables:
```bash
# Check locally
node scripts/verify-env.js

# Check what Vercel sees
vercel env pull
```

---

**Remember:** Most Vercel build failures are due to:
1. Missing environment variables
2. Static generation of auth-protected pages
3. Special characters in environment values

Always run local build tests before deploying!