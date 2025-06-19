# Package Dependencies Analysis

**Date**: 2025-01-25  
**Audit Phase**: SESSION 14 - Baseline Audit  
**Focus**: Bundle size contributors and optimization opportunities

---

## 📦 HEAVY DEPENDENCIES IDENTIFIED

### **🔍 Major Bundle Contributors**

#### **UI & Animation Libraries**
- **framer-motion**: ~150-200 kB - Heavy animation library used extensively
- **@radix-ui/***: ~100-150 kB total - Multiple UI primitive packages
- **lucide-react**: ~50-100 kB - Icon library (likely loading full pack)
- **next-themes**: ~10-20 kB - Theme switching

#### **Maps & Visualization** 
- **leaflet**: ~150-200 kB - Interactive mapping library
- **react-leaflet**: ~30-50 kB - React wrapper for Leaflet
- **@types/leaflet**: Dev only
- **recharts**: ~100-150 kB - Chart library (potentially unused?)

#### **Analytics & Third-Party**
- **posthog-js**: ~50-80 kB - Analytics tracking
- **@supabase/supabase-js**: ~100-150 kB - Database client

#### **Forms & Validation**
- **react-hook-form**: ~30-50 kB - Form handling
- **@hookform/resolvers**: ~10-20 kB - Form validation
- **zod**: ~50-80 kB - Schema validation

---

## ⚠️ OPTIMIZATION OPPORTUNITIES

### **1. Dynamic Imports Needed**
```typescript
// Current: All loaded immediately
import { motion } from "framer-motion"
import { MapContainer } from "react-leaflet" 
import posthog from "posthog-js"

// Target: Dynamic loading
const Map = dynamic(() => import('./map-component'), { ssr: false })
const Analytics = dynamic(() => import('./analytics'), { ssr: false })
```

### **2. Tree Shaking Improvements**
```typescript
// Current: Full package imports
import { Star, Users, MapPin } from "lucide-react"

// Target: Individual imports
import Star from "lucide-react/dist/esm/icons/star"
import Users from "lucide-react/dist/esm/icons/users"
```

### **3. Conditional Loading**
- **Leaflet**: Only load when map section is visible
- **PostHog**: Defer until after page interaction
- **Framer Motion**: Load only for interactive sections

---

## 📊 ESTIMATED BUNDLE IMPACT

| Package | Estimated Size | Usage | Optimization Potential |
|---------|---------------|--------|----------------------|
| framer-motion | 150-200 kB | Extensive | 🔴 High - Replace with CSS |
| leaflet | 150-200 kB | Single map | 🔴 High - Dynamic import |
| @radix-ui/* | 100-150 kB | UI components | 🟡 Medium - Tree shake |
| posthog-js | 50-80 kB | Analytics | 🟠 High - Defer loading |
| lucide-react | 50-100 kB | Icons | 🟡 Medium - Individual imports |
| recharts | 100-150 kB | Unknown usage | 🔴 High - Remove if unused |

---

## 🎯 PHASE 2 PACKAGE OPTIMIZATIONS

### **Immediate Actions**
1. **Audit unused packages**: Check if recharts is actually used
2. **Dynamic import strategy**: Leaflet, PostHog, heavy Framer components
3. **Icon optimization**: Switch to individual Lucide imports
4. **Conditional loading**: Analytics and maps

### **Expected Savings**
- **Dynamic imports**: ~300-400 kB reduction
- **Tree shaking**: ~50-100 kB reduction  
- **Unused package removal**: ~100-150 kB reduction
- **Total potential**: ~450-650 kB savings (meeting <180 kB target)

---

**Analysis Status**: ✅ Complete  
**Priority**: Phase 2 implementation  
**Target**: <180 kB first load bundle 