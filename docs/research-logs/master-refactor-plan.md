# Master Refactor & Optimisation Blueprint

_Last updated: 2025-06-10_

## Objective
Create a structured, end-to-end roadmap that elevates performance, maintainability, accessibility, and developer-experience across the entire mallocra-activities codebase. This document is the **single source of truth** for all upcoming refactor efforts and feeds directly into an AI-assisted task system.

**How to use this file**
1. Stakeholders agree on priorities & check the KPI table.
2. Developers choose a section → copy corresponding *Task Bundle* into an issue or ticket.
3. AI agents consume the *AI Prompt* to implement the changes incrementally.
4. Progress is recorded back in this file & in `prompt-tracker.md`.

---

## Global KPIs
| Metric | Current | Target | Stretch |
|--------|---------|--------|---------|
| LCP (Mobile 4G) | ~3.2 s | <2.0 s | **<1.5 s** |
| First-Load JS (gz) | ~310 kB | <180 kB | **<140 kB** |
| CLS | 0.12 | <0.08 | **<0.05** |
| TTI | ~4.3 s | <3.0 s | **<2.0 s** |
| Lighthouse PWA Score | 62 | ≥ 85 | **≥ 95** |

---

## ✨ Section 1 – Performance Optimisation

### Overview
Streamline rendering, reduce asset weight, and leverage edge infrastructure to deliver sub-2-second experiences worldwide.

### Task Bundle
- [ ] Convert all `page.tsx` files to **server components** unless explicit interactivity is needed.
- [ ] Implement edge-static export (`runtime = "edge"`, `dynamic = "force-static"`) for marketing & blog pages.
- [ ] Split interactive islands using `next/dynamic` with `ssr:false` + skeleton fallbacks.
- [ ] Apply Cloudinary automatic format & quality (`f_auto,q_auto`) to every `next/image` URL via helper in `lib/media.ts`.
- [ ] Replace autoplay hero videos with static poster + click-to-play dialog respecting `prefers-reduced-data`.
- [ ] Tree-shake lucide icons via `lucide-react/light` imports.
- [ ] Remove Framer Motion where pure CSS suffices; set `motionReduced` checks.
- [ ] Add resource hints (preconnect, priority hints) in `<head>` using `<Head>`.
- [ ] Configure Tailwind `content-visibility:auto` plugin & `optimizeUniversalDefaults`.

### AI Prompt Template
```prompt
Refactor the {route} page for performance:
1. Ensure server-component first strategy.
2. Extract any interactive UI into a `*_island.tsx` client component loaded via `next/dynamic`.
3. Migrate all images to `getOptimizedImage()` helper with Cloudinary `f_auto,q_auto,w_1920`.
4. Replace simple motion variants with Tailwind animations.
5. Add `<Head>` preconnect to Cloudinary.
Return only code edits.
```

## 🧹 Section 2 – Codebase Cleanup & Modularisation

### Overview
Eliminate dead code, enforce consistent folder conventions, and centralise data to unlock tree-shaking and easier onboarding.

### Task Bundle
- [ ] Delete obsolete files & folders: `_backup/`, `debug/`, `test-*`, `page-broken.tsx`.
- [ ] Ensure every route uses kebab-case naming & has dedicated `/_components` folder.
- [ ] Move mock/static arrays into `app/**/_data/*.ts` modules with proper typings.
- [ ] Export all data types via `types/index.ts`; enable `strictNullChecks`.
- [ ] Introduce Zod schemas for external fetch responses.

### AI Prompt Template
```prompt
Clean up folder {path}:
1. Remove any *_backup* or unused test files.
2. Relocate inline static data into `{sameRoute}/_data/data.ts` and import it.
3. Add corresponding TypeScript interfaces in `types/{route}-types.ts` and export.
4. Adjust imports after relocation.
Provide edits only.
```

## 📦 Section 3 – Library Isolation & Dependency Health

### Overview
Minimise bundle bloat by loading heavy libraries only when needed and purging unused packages.

### Task Bundle
- [ ] Wrap Leaflet map in `components/islands/leaflet-map-island.tsx` dynamic import; fallback skeleton.
- [ ] Defer PostHog initialisation until `window.load` via dynamic import.
- [ ] Audit `package.json` for unused dependencies (`npm ls --prod`) and remove.
- [ ] Introduce bundle-analyser CI step failing if JS > 180 kB.

### AI Prompt Template
```prompt
Isolate the {library} usage:
1. Create `components/islands/{library}-island.tsx` as a client-only dynamic component.
2. Replace direct imports with dynamic import (`ssr:false`).
3. Add a lightweight skeleton fallback.
Show only code edits.
```

## 🎨 Section 4 – UI Consistency & Design System

### Overview
Promote a cohesive dark theme with reusable components and reduce duplicated Tailwind classes.

### Task Bundle
- [ ] Audit all pages for light-theme remnants; migrate to dark palette.
- [ ] Extract recurring gradient badges/buttons into `components/magicui/ui-primitives.tsx`.
- [ ] Implement Storybook (dark-mode add-on) for visual regression snapshots.

### AI Prompt Template
```prompt
Standardise UI for {component}:
1. Move repeated Tailwind gradient class into a new styled component in `components/magicui`.
2. Replace occurrences across codebase.
3. Ensure dark theme tokens (`bg-gray-900`, `text-white`) are applied.
Provide only edits.
```

## ♿ Section 5 – Accessibility & UX Polish

### Overview
Guarantee inclusive experiences and micro-interaction smoothness.

### Task Bundle
- [ ] Add `alt` text to all `next/image` usages using descriptive alt generator script.
- [ ] Add aria-labels/roles to interactive icons & badges.
- [ ] Implement `VisuallyHidden` component for decorative emojis.
- [ ] Hook up `@radix-ui/react-tooltip` for icon-only buttons.

### AI Prompt Template
```prompt
Improve accessibility for {filePath}:
1. Ensure every `<Image>` has meaningful `alt`.
2. Add `aria-label` to icon buttons.
3. Import and wrap emojis in `<VisuallyHidden>`.
Return code edits only.
```

---

## 🧪 Section 6 – Testing & Continuous Integration

### Overview
Prevent regressions via automated UI tests and performance budgets.

### Task Bundle
- [ ] Set up Playwright with smoke tests for hero CTA, signup, booking flow.
- [ ] Add GitHub Action: `next build && next lint && playwright test`.
- [ ] Enforce performance budget using `next build --profile` + custom script.

### AI Prompt Template
```prompt
Add Playwright test for {scenario}:
1. Create `tests/{scenario}.spec.ts` covering critical flow.
2. Update CI config to run tests.
Show new files only.
```

---

## 🔎 Detailed Sub-Tasks & File Map (v1)

Below is a concrete breakdown of **what** files/routes need attention in each section. Use this as a starting backlog. Tick when completed & update with discoveries.

### Section 1 – Performance Optimisation: Target Pages
| Route | Current Issues | Priority | Owner | Status |
|-------|---------------|----------|-------|--------|
| `app/(marketing)/page.tsx` | 2 k LoC, client-only, heavy assets | 🔴 P0 | Frontend | ⬜ |
| `app/(main)/activities/[id]/page.tsx` | Large client page, map, motion | 🔴 P0 | Frontend | ⬜ |
| `app/blog/page.tsx` | Client component, no pagination | 🟠 P1 | Frontend | ⬜ |
| `app/(marketing)/pricing/page.tsx` | Autoplay video hero | 🟠 P1 | Frontend | ⬜ |
| `app/(main)/wishlist/page.tsx` | Unoptimised queries | 🟢 P2 | Backend | ⬜ |

### Section 2 – Cleanup Candidates
| Path | Action |
|------|--------|
| `**/_backup/**` | Delete folder |
| `app/(marketing)/page-broken.tsx` | Remove file |
| `test-db/**`, `test-map/**`, `todo/**` | Archive or delete |
| `analysis/**`, `debug/**` | Evaluate necessity |

### Section 3 – Library Isolation Mapping
| Library | Files where Imported | Island Target |
|---------|---------------------|---------------|
| Leaflet | `components/ui/leaflet-map.tsx`, `app/**/map` pages | `islands/leaflet-map-island.tsx` |
| Framer Motion | Many marketing sections | Replace with CSS or Island per section |
| PostHog | `components/utilities/posthog/*` | Dynamic import post-page-load |

### Section 4 – UI Consistency Audit Targets
- Buttons: instances of `className="bg-gradient-to-…"` duplicated across marketing pages.
- Gradient Badges: search for `Badge` with inlined gradient classes.
- Hero Headings: inconsistent font-sizes across hero sections.

### Section 5 – Accessibility Checks
- Ensure `alt` text on all hero/background images in marketing & blog pages.
- Add `aria-live` for async error/success messages in booking forms.
- Keyboard focus-visible styles on CTA buttons.

### Section 6 – Testing Coverage Matrix
| Flow | Test File | Devices |
|------|-----------|---------|
| Landing → Activity Search → Booking | `landing-search-book.spec.ts` | Desktop, Mobile |
| Login / Signup Clerk | `auth-flow.spec.ts` | Desktop |
| Blog Pagination & Tag Filter | `blog-tag-flow.spec.ts` | Desktop |

---

## ⏳ Execution Timeline (Draft)
| Sprint | Duration | Focus | Deliverables |
|--------|----------|-------|--------------|
| Sprint 1 | Week 1-2 | P0 Performance Pages | Refactored landing + activity details page; baseline Lighthouse report & green KPIs |
| Sprint 2 | Week 3-4 | Cleanup & Library Isolation | Codebase debris removed, Leaflet/PostHog islands, CI bundle budget enforced |
| Sprint 3 | Week 5-6 | UI Consistency & Accessibility | Dark-theme audit complete, `magicui` primitives released, WCAG AA checks pass |
| Sprint 4 | Week 7-8 | Testing & CI Hardening | Playwright suite green in CI, performance budget integrated, Storybook snapshots |
| Sprint 5 | Week 9-10 | Stretch Goals & Polish | Remaining P1/P2 tasks, stretch KPIs hit, docs & knowledge hand-off |

*Adjust timeline based on team velocity; one sprint = 2 calendar weeks.*

## ⚠️ Risk & Mitigation Matrix
| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Unexpected breaking changes from server-component conversion | High | Medium | Incremental PRs, E2E smoke tests per page |
| Asset size regression | High | High | CI bundle analyser budget fail gate |
| Team unfamiliar with Edge runtime | Medium | Medium | Knowledge-sharing session & doc links |
| Library removal affects UX (Framer→CSS) | Medium | Low | A/B test and user analytics monitoring |
| CI instability with new Playwright tests | Low | Medium | Flaky-test quarantine rule & retries |

## 🔗 Dependency Map
- **Section 3 (Library Isolation)** depends on cleanup of old imports from **Section 2**.
- **CI Performance Budget** must be merged before Sprint 2 tasks to catch regressions early.
- **Storybook** setup is prerequisite for UI consistency regression tests.
- **Testing** requires routes to be stable post-refactor of sections 1-3.

## 🗂️ Kanban Board Labels (GitHub)
- `area:performance`  
- `area:cleanup`  
- `area:library`  
- `area:ui`  
- `area:accessibility`  
- `area:testing`  
- `priority:P0|P1|P2`  
- `status:todo|in-progress|review|done`

## 🏷️ Story Point Guide
| Size | Criteria | Points |
|------|----------|--------|
| XS | Small file edit (<20 LOC), no tests | 1 |
| S | Multi-file refactor, tests update | 2 |
| M | New component or library isolation | 3 |
| L | Route-level server conversion + tests | 5 |
| XL | Cross-cutting infra change (CI, Tailwind config) | 8 |

## 📜 Change-Log Template
```md
### {Commit / PR Title}
*Area:* Section X – {area}
*Story Points:* {1|2|3|5|8}
*Description:* …
*Checklist:* ✅ Lint  ✅ Unit Tests  ✅ E2E  ✅ Docs
```

> Keep this plan living—update timelines, risks, and task progress at each sprint planning.
