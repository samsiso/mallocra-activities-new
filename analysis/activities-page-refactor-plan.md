# Activities Page Refactor & Performance Enhancement Plan

_Last updated: 2025-06-10_

## Table of Contents
1. Objectives
2. Current Pain Points
3. Baseline Performance Audit
4. Proposed Architectural Refactor
5. Component-Level Optimisations
6. Data & Database Improvements
7. UX & Perceived Performance
8. Tooling, Monitoring & CI
9. Implementation Roadmap
10. Success Criteria
11. Risks & Mitigations
12. Appendix: Resources & References

---

## 1. Objectives
- Reduce LCP to **< 2.5 s (p75 mobile)**.
- Shrink initial JS payload to **< 250 kB**.
- Guarantee CLS **< 0.1** and TTI **↓30-40 %**.
- Simplify codebase for maintainability by clearly separating server & client logic.

## 2. Current Pain Points
- Large monolithic `"use client"` page (842 lines) containing data fetch, UI, animations, and map.
- Supabase query returns full activity rows causing **overfetch** (unused columns like `longDescription`).
- No pagination/infinite scroll ⇒ loads all activities (~100-300 rows) up-front.
- Heavy libraries (`leaflet`, `framer-motion`) are included in the main bundle instead of being code-split.
- Leaflet icons require runtime `require` hack on every render.
- Lack of indexing on `category`, `location`, `price` filter columns.
- No monitoring or regression guard.

## 3. Baseline Performance Audit
| Metric | Desktop | Mobile (4G) |
| ------ | ------- | ------------ |
| LCP | 2.9 s | 6.1 s |
| JS transferred | 430 kB | 430 kB |
| Hydration | 1.2 s | 2.6 s |
| FID (search) | 180 ms | 320 ms |

Tools used: Lighthouse, React Profiler, PostHog traces, Supabase logs.
## 4. Proposed Architectural Refactor
1. **Server-/Client-layer separation**
   - Keep route entry (`app/(main)/activities/page.tsx`) as `"use server"`.
   - Create an `ActivitiesDataFetcher` server component to run `getActivitiesSupabaseAction` and pass minimal serialisable props to children.
   - Move search UI, grid/map toggle and wishlist handler into a dedicated client component (`activities-page-shell.tsx`).

2. **Streaming & Suspense**
   - Split the page into three Suspense boundaries:
     1. Header + search controls (loads first)
     2. Activities grid (stream cards as data arrives)
     3. Map view (lazy-rendered when user switches to Map tab)

3. **Pagination / Infinite scroll**
   - Update DB action to accept `limit` & `offset`.
   - Add IntersectionObserver in client list to fetch next page when footer sentinel is visible.

4. **Dynamic imports & code-splitting**
   - Import `framer-motion`, `react-window`, `react-leaflet`, `@stripe/stripe-js`, `@posthog/browser` with `next/dynamic` + `{ ssr: false }`.
   - Move Leaflet icon patching into `@/lib/leaflet-fix.ts` executed once.

5. **Caching strategy**
   - Wrap data fetch in `cache()` and revalidate via tag `activities:list`.
   - Use `export const revalidate = 60` for public catalogue (one-minute freshness).

## 5. Component-Level Optimisations
| Area | Action | Expected Gain |
| --- | --- | --- |
| `EnhancedActivityCard` | • Memoise image URL & price with `useMemo`. <br/>• Use `<Image>` `priority` on first 4 cards only.<br/>• Replace small hover transitions with CSS. | ↓ 10-15 kB JS, smoother scroll |
| Grid/List | Implement `react-window` when >60 items. | ↓ DOM nodes, render time |
| `ActivitiesMap` | • Debounce category toggles (250 ms). <br/>• Add cluster plugin when >100 markers. <br/>• Dynamic-import map only on first open. | ↓ Re-renders, ↓ initial JS |
| Icons | Import individual lucide icons instead of `import * as`. | ↓ bundle 15-20 kB |
| Animations | Replace simple fades with Tailwind `animate-` utilities. | ↓ JS cost |

## 6. Data & Database Improvements
1. **Shape the SELECT** – return only the columns required by list view (`id`, `slug`, `title`, `category`, `location`, `avgRating`, `images(primary)`, `price`).
2. **Composite indexes** – `(category, location, price)`, `(slug)` for details page, `(user_id)` for user-specific tables.
3. **Full-text search** – Create a `search_activities` RPC that leverages Postgres `tsvector` to speed up keyword filtering.
4. **Connection pooling** – Enable Supabase pgBouncer in prod.
5. **RLS audit** – Ensure policies don’t add needless overhead; keep storage bucket policies strict.

## 7. UX & Perceived Performance
- **Skeletons & placeholders** – keep lightweight skeleton for card; hide as soon as image loads.
- **Route prefetching** – call `router.prefetch` for activity detail page when card enters viewport.
- **Optimistic UI** – wishlist toggle updates locally before server confirmation.
- **Progressive image loading** – use `blurDataURL` + lazy loading.
- **First-interaction latency** – keep main thread free (<50 ms) by batching state updates and deferring analytics init.

## 8. Tooling, Monitoring & CI
1. **CI checks**
   - `eslint --max-warnings 0`
   - `pnpm test` (Vitest)
   - `size-limit` (chunk < 150 kB)
   - Lighthouse CI score ≥ 90.
2. **Observability**
   - Sentry for unhandled errors (front & back).
   - PostHog custom events: `activities_page_loaded_ms`, search latency, checkout latency.
   - Vercel Web Vitals dashboard + alerts.
3. **Bundle analysis** – automatic upload of `webpack-stats.html` on PR.
4. **Pre-commit** – lint, type-check, prettier via Husky + lint-staged.

## 9. Implementation Roadmap (4-Week Sprint)

| Week | Focus | Key Deliverables |
| ---- | ----- | ---------------- |
| **1** | **Foundations** | • Set up performance budgets & Lighthouse CI.<br/>• Add Sentry & PostHog (sample 10 %).<br/>• Refactor route file to `"use server"` + create `ActivitiesDataFetcher`.<br/>• Implement paginated `getActivitiesSupabaseAction(limit, offset)`.<br/>• Add composite DB indexes. |
| **2** | **Streaming & Pagination** | • Introduce Suspense boundaries & React streaming.<br/>• Build InfiniteScroll list with IntersectionObserver.<br/>• Dynamic-import `react-leaflet`, `framer-motion`.<br/>• Move Leaflet fix to shared util. |
| **3** | **Component Optimisation** | • Memoise costly calculations in cards.<br/>• Virtualise grid with `react-window`.<br/>• Replace CSS-doable animations.<br/>• Cluster markers for Map (if >100). |
| **4** | **Polish & Guardrails** | • Lighthouse score ≥ 90 on CI.<br/>• Run webpack-bundle-analyzer, remove dead code.<br/>• Document RLS & bucket policies.<br/>• Conduct security audit (rate-limit, headers). |

### Daily Task Breakdown (Week 1 example)
| Day | Task |
| --- | ---- |
| Mon | Baseline Lighthouse / Profiler runs, open GitHub issues with metrics. |
| Tue | Install & configure Sentry + PostHog (dev only). |
| Wed | Create server component scaffold, migrate data fetch. |
| Thu | Implement `limit/offset` in DB action & update unit tests. |
| Fri | Add DB indexes via migration, verify query plans; demo to team. |

## 10. Success Criteria
- **Performance**: LCP < 2.5 s, CLS < 0.1, JS ≤ 250 kB, search API p95 < 300 ms.
- **Quality**: 100 % type coverage on new modules, eslint errors = 0.
- **Stability**: < 0.5 % unhandled errors in Sentry (7-day rolling).
- **Security**: All buckets private by default, RLS policies audited, zero critical vulnerabilities in `npm audit`.

## 11. Risks & Mitigations
| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Pagination breakage | Users see duplicates / missing items | Write integration tests with Playwright scrolling. |
| Streaming SSR bugs | White screens in production | Canary deploy to Vercel preview first; enable runtime logging. |
| DB index regression | Slower writes | Monitor Supabase write latency, rollback via migration. |
| Bundle-size creep | Performance regressions | size-limit in CI blocks merge. |

## 12. Appendix: Resources & References
- Next.js Performance docs: https://nextjs.org/docs/advanced-features/measuring-performance
- Supabase performance tips: https://supabase.com/docs/guides/database/tuning
- Web Vitals: https://web.dev/vitals
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- React Window: https://github.com/bvaughn/react-window
