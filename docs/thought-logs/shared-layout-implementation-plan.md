# Shared Layout Implementation Plan

**Document Type**: Implementation Plan  
**Date**: June 6, 2025  
**Project**: Mallorca Activities Platform  
**Focus**: Consistent Header and Footer Implementation  
**Status**: Planning Phase

---

## Executive Summary

This document outlines a plan to implement consistent navigation and footer components across all pages of the Mallorca Activities platform. Currently, the header component is only implemented in the marketing layout, and there is no standardized footer component. This plan will ensure a consistent user experience across the entire application by applying these shared elements to all pages, including activities, about, bookings, wishlist, and contact pages.

---

## 1. 🔍 Current State Analysis

### 1.1 Header Component
- **Location**: `/components/header.tsx`
- **Current Implementation**: 
  - Only implemented in the marketing layout (`app/(marketing)/layout.tsx`)
  - Not present in other sections of the application
  - Contains navigation links to Home, All Activities, About, Contact
  - Contains conditional authenticated links to My Bookings and Wishlist

### 1.2 Footer Component
- **Status**: Not implemented
- **Need**: Required for consistent branding, navigation, and legal information

### 1.3 Layout Structure
- **Current Layout Groups**:
  - Root layout (`app/layout.tsx`): Base HTML structure with Providers
  - Marketing layout (`app/(marketing)/layout.tsx`): Includes Header for marketing pages
  - Auth layout (`app/(auth)/layout.tsx`): For authentication pages
  - Todo layout (`app/todo/layout.tsx`): Example/development layout

### 1.4 Pages Requiring Shared Layout
- **Activities pages**: `/activities`, `/activities/[id]`
- **User dashboard pages**: `/bookings`, `/wishlist`
- **Information pages**: `/about`, `/contact`
- **All other non-auth pages**

---

## 2. 📋 Implementation Plan

### 2.1 Footer Component Creation

#### 2.1.1 Footer Design and Structure
- Create new component: `/components/footer.tsx`
- Implement with the following sections:
  - Company information and logo
  - Quick links to main pages
  - Activity categories
  - Contact information
  - Social media links
  - Legal links (Privacy Policy, Terms of Service)
  - Copyright information

#### 2.1.2 Footer Technical Requirements
- Responsive design for all device sizes
- Dark theme consistent with platform design
- Accessibility compliance
- Structured with proper semantic HTML

### 2.2 Layout Restructuring

#### 2.2.1 Create Shared Base Layout
- Create a new layout component: `/components/layout-with-navigation.tsx`
  - Should include Header and Footer components
  - Accepts children for main content
  - Handles common layout structure

#### 2.2.2 Update Layout Structure
**Option 1: Route Group Approach**
- Create a new route group `app/(main)/` for all pages that should have the header/footer
- Implement the header and footer in `app/(main)/layout.tsx`
- Move appropriate pages into this route group

**Option 2: Individual Layout Updates**
- Add Header and Footer components to each layout file that needs them
- Ensure consistent implementation across all layouts

### 2.3 Page Migrations

#### 2.3.1 Activities Pages
- Ensure `/activities` and `/activities/[id]` use the shared layout
- If not already in a route group with header/footer, either:
  - Move to `app/(main)/` route group, or
  - Create `app/activities/layout.tsx` with header and footer

#### 2.3.2 User Dashboard Pages
- Ensure `/bookings` and `/wishlist` use the shared layout
- Create dashboard layout with header and footer if it doesn't exist

#### 2.3.3 Information Pages
- Verify `/about` and `/contact` continue to use the shared layout
- These are already in the marketing route group with the header

---

## 3. 🔧 Technical Implementation Details

### 3.1 Footer Component Implementation

```tsx
// components/footer.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mallorca Activities</h3>
            <p className="text-gray-300 mb-4">
              Discover the best experiences Mallorca has to offer.
            </p>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-2 text-rose-500" />
              <span>Palma de Mallorca, Spain</span>
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <Phone className="h-4 w-4 mr-2 text-rose-500" />
              <span>+34 971 123 456</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="h-4 w-4 mr-2 text-rose-500" />
              <span>info@mallorca-activities.com</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-rose-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-gray-300 hover:text-rose-400 transition">
                  All Activities
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-rose-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-rose-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-300 hover:text-rose-400 transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Activity Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Activity Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities?category=water_sports" className="text-gray-300 hover:text-rose-400 transition">
                  Water Sports
                </Link>
              </li>
              <li>
                <Link href="/activities?category=land_adventures" className="text-gray-300 hover:text-rose-400 transition">
                  Land Adventures
                </Link>
              </li>
              <li>
                <Link href="/activities?category=cultural" className="text-gray-300 hover:text-rose-400 transition">
                  Cultural Tours
                </Link>
              </li>
              <li>
                <Link href="/activities?category=food_wine" className="text-gray-300 hover:text-rose-400 transition">
                  Food & Wine
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter & Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-gray-800 hover:bg-rose-900">
                <Facebook className="h-5 w-5 text-rose-400" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-gray-800 hover:bg-rose-900">
                <Twitter className="h-5 w-5 text-rose-400" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-gray-800 hover:bg-rose-900">
                <Instagram className="h-5 w-5 text-rose-400" />
              </Button>
            </div>
            <p className="text-gray-300 mb-2">Sign up for our newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="py-2 px-4 bg-gray-800 text-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-rose-500 w-full"
              />
              <Button className="rounded-l-none bg-rose-600 hover:bg-rose-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Mallorca Activities. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-rose-400 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-rose-400 text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-rose-400 text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### 3.2 Layout Structure Implementation

#### Option 1: Route Group Approach (Recommended)

```tsx
// app/(main)/layout.tsx
"use server"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default async function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

#### Option 2: Shared Layout Component

```tsx
// components/layout-with-navigation.tsx
"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LayoutWithNavigation({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

---

## 4. 🚀 Implementation Roadmap

### Phase 1: Footer Component Creation (Day 1)
1. Create footer component with responsive design
2. Test footer across different viewport sizes
3. Ensure accessibility compliance

### Phase 2: Layout Structure Updates (Day 1-2)
1. Choose implementation approach (route group or individual updates)
2. Create/update necessary layout files
3. Test navigation flow between different sections

### Phase 3: Page Migrations (Day 2)
1. Update activities pages to use shared layout
2. Update dashboard pages to use shared layout
3. Verify information pages layout

### Phase 4: Testing & Refinement (Day 3)
1. Test navigation across all pages
2. Verify responsive behavior on all device sizes
3. Fix any styling or layout issues
4. Perform accessibility testing

---

## 5. 📋 File Changes Required

### New Files
1. `/components/footer.tsx` - New footer component

### Modified Files
Depending on the chosen approach:

**Option 1: Route Group Approach**
1. Create `/app/(main)/layout.tsx`
2. Move appropriate page directories into the `(main)` group

**Option 2: Individual Layout Updates**
1. Create/update layout files for each section that needs the shared header/footer

---

## 6. 🧪 Testing Requirements

### Functional Testing
- Verify navigation links work correctly
- Test authenticated vs. unauthenticated states
- Ensure footer links work properly

### Visual Testing
- Test on desktop, tablet, and mobile viewports
- Verify consistent styling across all pages
- Check dark mode compatibility

### Accessibility Testing
- Verify semantic HTML structure
- Test keyboard navigation
- Check screen reader compatibility
- Verify color contrast ratios

---

## 7. 📈 Success Metrics

- Consistent header and footer on all specified pages
- No regressions in existing functionality
- Full responsive behavior on all device sizes
- No accessibility issues introduced

---

**Document Owner**: Development Team  
**Last Updated**: June 6, 2025  
**Implementation Priority**: High 