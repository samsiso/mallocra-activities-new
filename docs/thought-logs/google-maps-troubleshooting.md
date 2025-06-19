# 🔧 Google Maps API Troubleshooting Guide

**Date**: January 24, 2025  
**Issue**: Google Maps showing "Sorry! Something went wrong" error  
**Status**: Active troubleshooting - API key configuration issue

---

## 🎯 **Current Situation**

✅ **Map section is visible** - "Activities Across Mallorca" section loaded  
✅ **Right panel working** - Location highlights display correctly  
✅ **Legend visible** - Activity types with color coding shown  
❌ **Map not loading** - "Sorry! Something went wrong" error

**Error Message**: "This page didn't load Google Maps correctly. See the JavaScript console for technical details."

---

## 🔍 **Step 1: Check Browser Console**

**Instructions for user:**
1. **Open Developer Tools**: Press `F12` (or `Cmd+Option+I` on Mac)
2. **Go to Console Tab**: Look for red error messages
3. **Refresh the page**: Reload to see fresh errors
4. **Look for**: Messages containing "Google Maps", "API key", or "REQUEST_DENIED"

**Common Error Messages & Solutions:**

### **"Google Maps JavaScript API has not been used"**
- **Problem**: Maps JavaScript API not enabled
- **Solution**: Enable Maps JavaScript API in Google Cloud Console

### **"This API project is not authorized to use this API"**
- **Problem**: API key restrictions too strict
- **Solution**: Check HTTP referrer restrictions

### **"REQUEST_DENIED"**
- **Problem**: Billing not enabled or API key invalid
- **Solution**: Enable billing in Google Cloud Console

### **"RefererNotAllowedMapError"**
- **Problem**: Domain not allowed in API key restrictions
- **Solution**: Add `http://localhost:3000/*` to referrer list

---

## 🛠️ **Step 2: Verify Google Cloud Console Setup**

### **A. Check APIs Enabled**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: "Mallorca Activities Maps"
3. Go to **"APIs & Services"** → **"Enabled APIs"**
4. **Verify these APIs are enabled**:
   - ✅ **Maps JavaScript API** (CRITICAL)
   - ✅ **Places API** (recommended)
   - ✅ **Geocoding API** (recommended)

### **B. Check API Key Configuration**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click the **pencil icon** next to your API key
3. **Application restrictions**:
   - Should be: "HTTP referrers (web sites)"
   - **Add these referrers**:
     ```
     http://localhost:3000/*
     https://*.vercel.app/*
     *://localhost:3000/*
     ```
4. **API restrictions**:
   - Should be: "Restrict key"
   - **Selected APIs**: Maps JavaScript API, Places API, Geocoding API

### **C. Verify Billing**
1. Go to **"Billing"** in left sidebar
2. **Check status**: Should show "Billing enabled"
3. **Check quotas**: Go to "APIs & Services" → "Quotas"
4. **Look for**: Maps JavaScript API quota should show available usage

---

## 🔧 **Step 3: Test API Key Directly**

Let me create a simple test to verify if your API key works:

### **Test URL Format:**
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyAwwZTGUoG2y1Y3YmnlOP6Lv7vJZlwpvpk&callback=initMap
```

**Instructions:**
1. Open browser console
2. Paste this code:
```javascript
function initMap() {
  console.log("Google Maps API loaded successfully!");
}

const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAwwZTGUoG2y1Y3YmnlOP6Lv7vJZlwpvpk&callback=initMap';
document.head.appendChild(script);
```
3. **Expected result**: "Google Maps API loaded successfully!" in console
4. **If error**: Note the specific error message

---

## 🎯 **Step 4: Most Likely Solutions**

Based on the error pattern, here are the most common fixes:

### **Solution 1: Enable Maps JavaScript API**
1. Go to Google Cloud Console
2. **"APIs & Services"** → **"Library"**
3. **Search**: "Maps JavaScript API"
4. **Click**: Maps JavaScript API
5. **Click**: "Enable" button
6. **Wait**: 1-2 minutes for activation

### **Solution 2: Fix Referrer Restrictions**
1. Go to **"APIs & Services"** → **"Credentials"**
2. **Edit your API key**
3. **Application restrictions**: HTTP referrers
4. **Add these EXACT referrers**:
   ```
   http://localhost:3000/*
   https://*.vercel.app/*
   ```
5. **Save** and wait 5 minutes

### **Solution 3: Enable Billing**
1. Go to **"Billing"** in Google Cloud Console
2. **"Link a billing account"**
3. **Add payment method** (credit card required)
4. **Note**: Free tier includes 28,000 map loads/month

### **Solution 4: Create New API Key**
If above doesn't work:
1. **Create a new API key** in Google Cloud Console
2. **Set NO restrictions** initially (for testing)
3. **Test if map works**
4. **Then add restrictions** after confirming it works

---

## 📊 **Step 5: Test Page Verification**

### **Visit Test Page**
1. Go to: `http://localhost:3000/test-map`
2. **Should show**: Debug information about API key
3. **Should display**: Two working test maps
4. **Check console**: For any error messages

### **Expected Debug Output**
```
API Key available: Yes
API Key (first 10 chars): AIzaSyAwwZ...
Loading Google Maps with API key: AIzaSyAwwZ...
Creating map at coordinates: 39.5696, 2.6502
Map loaded successfully
```

---

## 🚨 **Emergency Backup Solution**

If all else fails, here's a temporary workaround:

### **Option 1: Remove API Restrictions**
1. Edit your API key in Google Cloud Console
2. **Application restrictions**: None
3. **API restrictions**: Don't restrict key
4. **Test if map works**
5. **Re-add restrictions** once working

### **Option 2: Use Different API Key**
1. Create a completely new Google Cloud project
2. Enable Maps JavaScript API
3. Create new API key with no restrictions
4. Update `.env.local` with new key

---

## 📋 **Next Steps**

**Immediate Action Required:**
1. **Check browser console** for specific error message
2. **Verify Maps JavaScript API** is enabled in Google Cloud Console
3. **Check billing status** - this is often the blocker
4. **Test with no restrictions** on API key temporarily

**Report Back:**
- What error message appears in browser console?
- Is Maps JavaScript API enabled in your Google Cloud project?
- Is billing enabled on your Google Cloud account?
- Did the test page (`/test-map`) work?

---

**🎯 Goal**: Get from "Sorry! Something went wrong" to interactive map with 6 colored activity dots  
**⏰ Expected Fix Time**: 5-15 minutes once correct settings applied  
**🔥 Priority**: High - this unlocks all map features for the platform 