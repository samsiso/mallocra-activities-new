# Landing Page Speed Refactor Plan

_Last updated: 2025-06-10_

## Context
The current marketing landing page (`app/(marketing)/page.tsx`) is a 2 000-line client component that ships large JS bundles, auto-playing videos, and non-critical interactive libraries (Leaflet, Framer-motion, PostHog) on first paint. This leads to poor performance metrics (high LCP, FCP, TTI, and CLS).

This document captures the complete refactor strategy aimed at dramatically improving speed, accessibility, and maintainability while preserving the rich visual experience.
## Goals & Key Performance Indicators (KPIs)
- **LCP** < 2.5 s (Simulated Slow 3G, desktop & mobile)
- **First Load JS** < 200 kB gzipped
- **CLS** < 0.1
- **TTI** < 3 s
- <5 % regression in conversion / engagement metrics (tracked via PostHog)

## Current Pain Points
1. Monolithic `"use client"` page component — prevents server-side streaming & tree-shaking.
2. Heavy assets above-the-fold: autoplay background videos, multi-MB hero slideshow.
3. Unconditional loading of Leaflet, Framer-motion, Lucide icon pack, PostHog.
4. Inline mock data inflates bundle and blocks code-splitting.
5. Animations run even when `prefers-reduced-motion` is set.

## Phased Roadmap

### Phase 1 – Baseline Audit
- Run `next build --profile` and capture bundle-analyzer report.
- Record Lighthouse metrics for mobile & desktop; store screenshots in `docs/research-logs/screenshots/`.
- List top 10 heaviest JS/CSS/asset contributors.

### Phase 2 – File & Component Re-org
- Create `app/(marketing)/landing/` folder.
- Split page into smaller sections:
  - `hero-section` _(client)_
  - `featured-activities` _(server)_
  - `categories-grid` _(server)_
  - `testimonials-carousel` _(client)_
  - `stats-bar` _(server)_
  - `leaflet-map` _(client – dynamic)_
  - `newsletter-cta` _(server)_
- Move all static arrays to `_data/landing-data.ts`.

### Phase 3 – Server-First Conversion
- Remove top-level `"use client"` from `page.tsx`.
- Fetch data (Supabase, Cloudinary) within server components.
- Pass serialized props to client islands only when necessary.

### Phase 4 – Dynamic / Lazy Islands
- Import interactive islands with `next/dynamic` and `ssr:false`.
- Provide lightweight skeleton fallbacks (e.g., `SkeletonMap`).
- Tree-shake Lucide icons by using per-icon imports or dynamic loading.

### Phase 5 – Media Optimisation
- Replace autoplay hero video with static image + "Watch video" CTA (opens Dialog).
- Preload only first hero image (`priority`); lazy-load others via `IntersectionObserver`.
- Apply Cloudinary transformations `q_auto,f_auto,w_1920` to all images.
- Supply `sizes` attribute on every `next/image`.

### Phase 6 – Animation Budget
- Consolidate Framer-motion variants; remove redundant animations.
- Respect `prefers-reduced-motion` by disabling motion where applicable.

### Phase 7 – Analytics Defer
- Load PostHog via dynamic import after `window.load`.
- Guard init behind env check `NEXT_PUBLIC_POSTHOG_KEY`.

### Phase 8 – Third-Party Library Review
- Consider replacing Leaflet with static map tiles or removing entirely.
- Evaluate moving simple effects from Framer to CSS keyframes.

### Phase 9 – CSS/Tailwind Optimisation
- Verify Tailwind purge picks up new component paths.
- Extract repeated gradient utilities into reusable classes under `magicui`.

### Phase 10 – Testing & Metrics
- After each phase, repeat Lighthouse & compare against KPIs.
- Log results in `docs/research-logs/landing-metrics-history.md`.

### Phase 11 – Progressive Enhancement
- Polyfill `IntersectionObserver` only for legacy browsers.
- Ensure critical CTA & content remain accessible without JS.

### Phase 12 – Documentation & Tracking
- Record all steps in this document and in `prompt-tracker.md` per workflow.
- Push to `dev` branch every 5 prompts.

---

## Checklist

| Phase | Task | Status |
|-------|------|--------|
| 1 | Baseline audit completed & metrics recorded | ⬜ |
| 2 | Folder & component re-org | ⬜ |
| 3 | Server-first conversion | ⬜ |
| 4 | Islands dynamically imported | ⬜ |
| 5 | Media optimisation implemented | ⬜ |
| 6 | Animation budget reductions | ⬜ |
| 7 | PostHog deferred | ⬜ |
| 8 | 3rd-party libs reviewed | ⬜ |
| 9 | Tailwind purge verified | ⬜ |
| 10 | Post-phase metrics green | ⬜ |
| 11 | Progressive enhancement verified | ⬜ |
| 12 | Docs & tracking updated | ⬜ |

> **Tip:** Tick each box in this table as you complete the corresponding tasks.

---

### Contributors
- _Author:_ AI Agent (Cursor)  
- _Reviewer:_ _TBD_  
- _Stakeholders:_ Product, Design, DevOps

## 🔥 Advanced Optimisations – v2
*This section augments the previous 12-phase roadmap with cutting-edge tactics to squeeze the last milliseconds out of the landing page while ensuring a silky-smooth user experience.*

### 🏎️ Performance Targets (re-scoped)
| Metric | Previous | **New Stretch Goal** |
|--------|----------|----------------------|
| LCP (Mobile 4G) | < 2.5 s | **< 1.8 s** |
| CLS | < 0.1 | **< 0.05** |
| First-Load JS (gz) | < 200 kB | **< 150 kB** |
| TTI | < 3 s | **< 2 s** |

### 1. Rendering & Routing
1. **Edge Runtime Static Rendering**: add `export const runtime = "edge"` + `export const dynamic = "force-static"` in the new landing `page.tsx` to ensure static generation & global CDN edge caching.
2. **HTTP/3 & Early Hints**: configure Vercel headers to use Early Hints (`103`) for critical CSS/JS; Next.js does this automatically but verify via headers.
3. **React Server Components Streaming**: keep each server component small to stream gradually—critical hero section first, below-the-fold async.

### 2. Resource Hints & Preloading
- **Preconnect / DNS-Prefetch**: `<link rel="preconnect" href="https://res.cloudinary.com">` & other third-party origins.
- **Priority Hints**: use `fetchPriority="high"` on first hero image; `low` on decorative images.
- **Font Optimisation**:
  - Use `@next/font` to self-host variable font (Inter var) with `display:swap`.
  - Subset Latin-only charset to cut ~40 kB.

### 3. Media Strategy Upgrades
- **Adaptive Formats**: serve AVIF > WebP > JPEG fallback via Cloudinary `f_avif`.
- **BlurHash / LQIP**: generate blur placeholders for images instead of heavy `blurDataURL`.
- **Deferred Video Loading**:
  - Inline critical CSS `prefers-reduced-data` check; skip video entirely for data-saver.
  - Use `decode="async"` on `<video>` tags.

### 4. JavaScript Budget Tightening
- **Strip Framer Motion where overkill**: replace simple fade/slide with CSS keyframes or Tailwind `animate-…` utilities.
- **Use `shallow` Lucide Imports**: `import { Star } from "lucide-react/light"` (supports deep tree-shaking).
- **Aggressive Code-Splitting**: verify dynamic island chunks are < 30 kB each.

### 5. CSS & Tailwind Micro-tuning
- Turn on **Tailwind `content-visibility:auto` plugin** to auto-apply where safe.
- Enable `experimental.optimizeUniversalDefaults` in `tailwind.config.ts`.

### 6. UX Smoothness Enhancements
- **Skeletons & Shimmer** for all async islands (e.g., Testimonials, Map) to minimise perceived wait.
- **Scroll Restoration**: handle dynamic route prefetch with `prefetch={true}` on `Link`s & restore scroll after nav.
- **Reduced Motion Respect**: wrap Framer root with `{!prefersReducedMotion && <MotionProvider>…}`.

### 7. Monitoring & Continuous Optimisation
- Integrate **next-metrics** or Vercel Web Vitals overlay to watch real-user Core Web Vitals.
- Configure PostHog autocapture exclusion rules to avoid unnecessary listeners on static markup.

### 8. Deployment Practices
- Enable **Vercel Image Optimization Caching** with `minimumCacheTTL` = 31536000 for versioned assets.
- Activate **Vercel Edge Network compression** (Brotli) for text assets.

### 9. A/B & Rollout
- Use Vercel **Edge Middleware** for gradual rollout; 10 % traffic to new landing page variant, measure vitals vs control.

> These advanced tactics should be executed **after** the initial 12-phase refactor; each optimisation must be profiled to confirm real-world benefit.
