# Mallorca Activities – Landing Page UX & Layout Deep-Dive

*Date: 25 Jan 2025*

---

## 1. Objective
Design a **conversion-centred** landing page that:
1. Captures attention in < 3 s (visual wow).  
2. Communicates value proposition & trust instantly.  
3. Guides both *search-driven* and *browse-driven* visitors to relevant content in ≤ 1 scroll.  
4. Injects social proof before commitment friction.  
5. Ends with a compelling, low-friction call-to-action.

> Target KPI: **+15 % uplift** in "Book Adventure" clicks & **< 2.5 s LCP** on mobile.

---

## 2. Cognitive-Flow Map (F-Pattern)
```
 ┌───────────────────────────────┐
 │       HERO (motion, USP)      │ ← 1st fixation (eye & cursor)
 └───────────────────────────────┘
 ▼
 ┌───────────────┐  ┌──────────┐
 │ FEATURED CARD │→ │ SEARCH 🔍│  ← 2nd fixation (intent input)
 └───────────────┘  └──────────┘
 ▼
 ┌─────────────────────────┐
 │ CATEGORY / NAV CLUSTER │ ← 3rd, for explorers
 └─────────────────────────┘
 ▼
 ┌──────────────────┐
 │ SOCIAL PROOF ⭐  │ ← builds trust before deep dive
 └──────────────────┘
 ▼
 ┌──────────────────────────────┐
 │ SUPPORTING CONTEXT (MAP) 🗺️ │
 └──────────────────────────────┘
 ▼
 ┌───────────────┐
 │ FINAL CTA 🚀 │
 └───────────────┘
```

*Heat-mapping studies show section visibility drops ~22 % every additional 1 000 px; therefore place revenue-driving content early.*

---

## 3. Recommended Section Order & Rationale
| # | Section | Why Here? | Key Elements |
|---|---------|-----------|--------------|
| 1 | **Hero Carousel + Search** | Delivers emotional hook & instant action path. | • 12–15 s autoplay video (mute)  
• H1 headline with dynamic keyword (< 60 ch)  
• Sub-headline (benefit)  
• Primary CTA *and* live search field (auto-suggest)  
• Trust badges (4.8★, 50 k travellers, Secure) |
| 2 | **Top-Rated Experiences** | Proof of value while user attention still high. | • 4–6 cards (card skeleton while loading)  
• Price, rating, availability badges  
• Bookmark icon (wishlist) |
| 3 | **Category Explorer** | Offers alternative navigation for exploratory users. | • 4 category tiles in first row, lazy-load rest  
• Hover zoom + overlay gradient  
• Accessibility: role="list" / "listitem" |
| 4 | **Testimonials & Media Logos** | Social validation midway through scroll. | • Carousel with drag & nav arrows  
• Traveller photos (60 × 60)  
• Publication badges (TripAdvisor etc.) |
| 5 | **Interactive Island Map** | Adds depth for those needing location context. | • Dynamic LeafletMap (SSG + dynamic import)  
• List of 3 location highlights  
• Lazy-load (IntersectionObserver 50 %) |
| 6 | **Final CTA Strip** | Conversion catch-all for committed visitors. | • Gradient background, blurred shapes  
• Dual buttons: Book Now (primary), Contact (secondary)  
• Mini trust icons row |
| Footer | Standard | SEO, trust, navigation. | |

---

## 4. Mobile-First Considerations
1. **Sticky Bottom CTA**: "Book Adventure" button after user scrolls > 600 px.  
2. Replace hover effects with subtle tap shadow/scale.  
3. Reduce hero video height to 60 vh on devices < 380 px to avoid content push.

---

## 5. Performance & Accessibility
| Area | Current Risk | Fix |
|------|--------------|-----|
| Hero videos | 4K assets heavy | Serve adaptive resolutions via `<source>` & `preload="none"` for non-active slides. |
| Map | JS bundle weight | `next/dynamic` import + no SSR + tree-shake Leaflet icons. |
| LCP | Large poster images | Use Cloudinary `<Image width={1920} quality={60} />` + priority for first poster. |
| Colour contrast | Gradient overlays | Ensure text contrast ≥ 4.5:1 (WCAG AA). |

---

## 6. A/B Test Suggestions
1. **Hero Copy**: "Book the Best Mallorca Adventures" vs "Mallorca's #1 Experiences Marketplace".  
2. **Card Count**: 4 vs 6 featured cards.  
3. **Map Placement**: Section 5 (recommended) vs removed entirely (control).  
4. **Video vs Static Hero**: Measure LCP & conversion delta.

---

## 7. Next Steps for Dev Team
1. Re-order React sections in `app/(marketing)/page.tsx` as above.  
2. Extract each section into self-contained component for readability (e.g., `<HeroSection/>`, `<FeaturedSection/>`).  
3. Implement sticky header CTA & bottom sheet CTA for mobile.  
4. Ship to staging; enable PostHog heat-map & funnel tracking.  
5. Review metrics after 1 week → iterate.

---

*Prepared by UX/Conversion Specialist – Mallorca Activities Platform* 