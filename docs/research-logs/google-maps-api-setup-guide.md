# 🗺️ Google Maps API Key Setup Guide

**Date**: January 24, 2025  
**Purpose**: Complete walkthrough for getting Google Maps API key from Google Cloud Console  
**For**: Mallorca Activities Platform - Interactive Map Features

---

## 🚀 **Step-by-Step Google Cloud Console Setup**

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Sign in** with your Google account
3. If you don't have a Google account, create one first

### **Step 2: Create or Select a Project**
1. Click the **project dropdown** at the top of the page (next to "Google Cloud")
2. Click **"New Project"** 
3. **Name your project**: e.g., "Mallorca Activities Maps"
4. **Organization**: Leave as default or select if you have one
5. Click **"Create"**
6. **Wait** for the project to be created (takes ~30 seconds)
7. **Select your new project** from the dropdown

### **Step 3: Enable Google Maps APIs**
1. In the **left sidebar**, click **"APIs & Services"** → **"Library"**
2. **Search for and enable** these APIs (you'll need multiple):

#### **🗺️ Core Map APIs** (Required)
- **Maps JavaScript API** (for interactive maps)
- **Places API** (for address autocomplete) 
- **Geocoding API** (for address ↔ coordinates conversion)

#### **📍 Enhanced Features** (Optional but recommended)
- **Maps Static API** (for static map images)
- **Directions API** (for turn-by-turn directions)
- **Distance Matrix API** (for travel time calculations)

**For each API:**
1. Click on the API name
2. Click **"Enable"** button
3. Wait for it to activate
4. Repeat for all APIs

### **Step 4: Create API Key**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Your API key will be generated automatically
4. **Copy the API key** immediately (starts with `AIza...`)

### **Step 5: Secure Your API Key (Important!)**
1. Click the **pencil icon** next to your new API key
2. **Set Application Restrictions**:
   - Choose **"HTTP referrers (web sites)"**
   - Add these referrers:
     ```
     http://localhost:3000/*
     https://yourdomain.com/*
     https://*.vercel.app/*
     ```

3. **Set API Restrictions**:
   - Choose **"Restrict key"**
   - Select the APIs you enabled:
     - Maps JavaScript API
     - Places API  
     - Geocoding API
     - (any others you enabled)

4. Click **"Save"**

### **Step 6: Set Up Billing (Required)**
⚠️ **Important**: Google Maps API requires billing to be enabled, but has generous free tier!

1. Go to **"Billing"** in the left sidebar
2. Click **"Link a billing account"**
3. **Create billing account** or select existing one
4. **Add payment method** (credit card required)

**💰 Free Tier Limits (Monthly):**
- **Maps JavaScript API**: 28,000 loads
- **Places API**: $200 credit (~40,000 requests)
- **Geocoding API**: $200 credit (~40,000 requests)

*For a typical activity booking site, you'll likely stay within free limits!*

---

## 🔧 **Adding API Key to Your Project**

### **Step 1: Update Environment File**
1. Open your `.env.local` file in the project root
2. **Replace the existing key** with your new one:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYOUR_NEW_KEY_HERE
```

### **Step 2: Restart Development Server**
```bash
npm run dev
```

### **Step 3: Test Your Map**
1. Go to `http://localhost:3000/test-map`
2. Check console for any errors
3. You should see working maps with debug info

---

## 🎯 **Features You Can Now Use**

With your API key set up, you can use all these Google Maps features:

### **🗺️ Core Map Features**
- ✅ **Interactive Maps** - Pan, zoom, different map types
- ✅ **Custom Markers** - Activity location pins with colors
- ✅ **Info Windows** - Rich popups with activity details
- ✅ **Map Styling** - Custom colors to match brand

### **📍 Location Features**
- ✅ **Address Autocomplete** - Fast address entry in forms
- ✅ **Geocoding** - Convert addresses to coordinates
- ✅ **Reverse Geocoding** - Get addresses from coordinates
- ✅ **Place Details** - Business hours, ratings, reviews

### **🧭 Navigation Features**
- ✅ **Directions** - Turn-by-turn routing
- ✅ **Distance Calculation** - Travel times between points
- ✅ **Multiple Transport Modes** - Walking, driving, transit, cycling

### **🎨 Enhanced Experience**
- ✅ **Street View** - Ground-level imagery
- ✅ **Aerial View** - 360° cinematic views
- ✅ **Data Layers** - Traffic, transit, bike paths
- ✅ **Custom Shapes** - Service areas, boundaries

---

## 🔍 **Troubleshooting Common Issues**

### **"Maps JavaScript API hasn't been used" Error**
- **Solution**: Enable Maps JavaScript API in Google Cloud Console

### **"This API project is not authorized" Error**
- **Solution**: Check API restrictions match your domain
- **Check**: HTTP referrers include your localhost and domain

### **"REQUEST_DENIED" Error**
- **Solution**: Enable billing in Google Cloud Console
- **Check**: API key restrictions aren't too restrictive

### **Maps not loading**
- **Check**: API key is correctly set in `.env.local`
- **Check**: Development server restarted after adding key
- **Check**: Browser console for error messages

---

## 💡 **Pro Tips**

### **Security Best Practices**
1. **Never commit API keys to Git** (use .env.local)
2. **Always set HTTP referrer restrictions**
3. **Use API restrictions** to limit key scope
4. **Monitor usage** in Google Cloud Console

### **Performance Optimization**
1. **Only enable APIs you need** to reduce costs
2. **Use static maps** for non-interactive images
3. **Cache geocoding results** to reduce API calls
4. **Implement error handling** for API failures

### **Development vs Production**
1. **Use different API keys** for dev and production
2. **Set appropriate referrer restrictions** for each environment
3. **Monitor usage quotas** especially in production

---

## 📊 **Expected Costs**

For a typical activity booking platform:

**Free Tier (Monthly)**:
- **Up to ~5,000 page views** with interactive maps
- **~40,000 address searches**
- **~40,000 geocoding requests**

**Beyond Free Tier**:
- **Maps loads**: $7 per 1,000 additional loads
- **Places API**: $17 per 1,000 requests  
- **Geocoding**: $5 per 1,000 requests

*Most small to medium sites stay within free limits!*

---

**✅ Result**: Fully functional Google Maps with all premium features enabled  
**🎯 Next Step**: Test the interactive map at `http://localhost:3000/test-map`  
**🚀 Impact**: Rich, interactive location discovery for your activities platform 