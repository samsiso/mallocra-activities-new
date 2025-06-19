# Landing Page Baseline Performance Audit

**Date**: 2025-01-25  
**Phase**: SESSION 14 - Landing Page Refactor Baseline  
**Target**: `app/(marketing)/page.tsx`

---

## 🎯 AUDIT SUMMARY

### Current State Analysis
- **File Size**: 2,215 lines - monolithic client component
- **Component Type**: `"use client"` - prevents server optimization  
- **Architecture**: Single massive component with inline data

### Critical Performance Issues
1. **Bundle Bloat**: ~600-900 kB estimated first load (target: <180 kB)
2. **Client-Only Rendering**: No server-side optimization
3. **Heavy Dependencies**: Framer Motion, Leaflet, autoplay videos
4. **Inline Data**: 300+ lines of mock data in component

### Performance Targets vs Estimated Current
| Metric | Target | Estimated | Status |
|--------|---------|-----------|---------|
| LCP | <2.0s | ~4-6s | 🔴 2-4s slower |
| First Load JS | <180kB | ~600kB | 🔴 3x larger |
| CLS | <0.08 | ~0.15 | 🔴 2x worse |
| TTI | <3.0s | ~5-8s | 🔴 2-5s slower |

---

## 🔍 COMPONENT BREAKDOWN

### Heavy Sections Identified
1. **Hero Video Slideshow** (223 lines) - Autoplay videos + complex state
2. **Featured Activities** (178 lines) - Heavy Framer Motion animations  
3. **Map Section** (107 lines) - Leaflet library loaded immediately
4. **Testimonials** (308 lines) - Client-side carousel with animations

### Bundle Analysis (Estimated)
- **Framework**: ~230 kB (Next.js + React)
- **Libraries**: ~300-400 kB (Framer Motion, Leaflet, Lucide)
- **App Code**: ~100-150 kB (landing page + data)
- **Total**: ~600-900 kB (3-5x target)

---

## 🛠️ PHASE 2 RECOMMENDATIONS

### Priority Actions
1. **Split monolithic component** into logical server/client islands
2. **Extract inline data** to `_data/landing-data.ts`
3. **Convert static sections** to server components
4. **Dynamic import** heavy libraries (Leaflet, PostHog)

### Expected Improvements
- **40-60% bundle reduction** from code splitting
- **Server rendering** for static content
- **Progressive enhancement** foundation
- **Modular architecture** for easier optimization

---

**Status**: ✅ Baseline Analysis Complete  
**Next**: Phase 2 - Component Reorganization  
**Target**: Achieve <180kB first load bundle 