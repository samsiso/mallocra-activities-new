# Admin Sidebar – Enhancement Roadmap

This document builds **on top of** the initial redesign plan (`admin-sidebar-redesign-plan.md`). Whereas the redesign focused on colour, branding, and sticky behaviour, the roadmap below targets long-term **UX quality, accessibility, performance, and maintainability**.

---
## 1. UX & Interaction Upgrades

| Area | Problem | Enhancement | Acceptance Criteria |
|------|---------|-------------|---------------------|
| **Search** | Search component requires explicit click | • Auto-focus the search input when sidebar opens on mobile.<br>• Support `⌘/Ctrl + K` to open global search. | Pressing `⌘+K` toggles search palette; input is focused. |
| **Collapsed Tooltips** | Icon-only mode lacks context | Add `@radix-ui/tooltip` on each menu item icon when collapsed. | Hovering shows label within 150 ms. |
| **Section Divider** | Long menu feels cluttered | Introduce collapsible section groups (`<Disclosure>`). Remember open/closed state in `localStorage`. | State persists across sessions. |
| **Active Indicator** | Current indicator (left border) not visible in collapsed mode | Add a subtle 2 px top border + coloured dot next to icon when collapsed. | Indicator passes WCAG AA contrast. |
| **Notifications** | No badge counts | Optional `badgeCount` prop on nav items (e.g. `Bookings`). Display yellow (#FACC15) pill. | Count updates real-time via SWR. |
| **Animations** | Abrupt open/close | Use `framer-motion` `AnimatePresence` for smooth width transition & overlay fade. | Transition ≤ 300 ms, 60 fps on desktop. |

---
## 2. Accessibility (a11y)

1. **ARIA roles** – Wrap nav list with `role="navigation"` and `aria-label="Admin"`.
2. **Keyboard Navigation** –
   * Use `roving-tabindex` pattern so arrow keys traverse menu items.
   * `Esc` closes mobile drawer.
3. **Focus Rings** – Tailwind ring utilities (`ring-2 ring-exc-rose`) for visible focus states.
4. **Screen Reader Labels** – `aria-current="page"` for active links; tooltips provide `aria-label` fallback.
5. **Color Contrast** – Validate all colours with Lighthouse; adjust Rose-700 or lighten text to meet 4.5:1.

---
## 3. Performance Optimisations

1. **Lazy-Load Icons** – Dynamic import lucide icons with `next/dynamic`.
2. **Memoise Navigation Data** – Move `navigationGroups` to a separate `const` file & wrap in `useMemo`.
3. **Throttle Scroll Events** – If additional on-scroll logic is introduced, use `requestAnimationFrame` or `lodash/throttle`.
4. **Tree-Shaking** – Ensure no unused icons/components are imported after migration.

---
## 4. Theming & Maintainability

1. **CSS Variables** – Expose the brand palette as CSS variables (e.g. `--color-primary`). Allows future theme switch (light/dark) without editing classes.
2. **Tailwind Plugin** – Create `libs/tailwind-brand.ts` to inject brand colours → reduces repetition.
3. **Variants** – Leverage `@tailwindcss/typography` for sidebar docs links (if ever added).
4. **Storybook** – Document sidebar states (default, collapsed, mobile) for rapid QA.

---
## 5. Analytics & Logging

1. **PostHog Events**:  
   • `sidebar_toggle` – properties: `{ collapsed, device }`  
   • `nav_click` – `{ item_name }`
2. **Error Monitoring** – Wrap sidebar in Error Boundary; log to Sentry.

---
## 6. Testing Strategy

| Layer | Tool | What to test |
|-------|------|--------------|
| **Unit** | Vitest + React-Testing-Library | • `isCollapsed` state toggles.<br>• Tooltip rendering. |
| **Integration** | Cypress Component Tests | • Navigation link routing + `aria-current`. |
| **E2E** | Cypress | • Mobile drawer open/close & scroll lock.<br>• Keyboard navigation passes. |

---
## 7. Implementation Phases

1. **Phase 1** – Refactor component structure (extraction, memoisation).  
2. **Phase 2** – Add tooltips, accessibility hooks, keyboard nav.  
3. **Phase 3** – Animate with framer-motion & PostHog events.  
4. **Phase 4** – Introduce Storybook docs & automated tests.  
5. **Phase 5** – Deployment & Lighthouse regression audit.

---
### Timeline Estimate

| Phase | Effort | Developer Days |
|-------|--------|----------------|
| 1 | 5 hrs | 1 day |
| 2 | 8 hrs | 1.5 days |
| 3 | 6 hrs | 1 day |
| 4 | 4 hrs | 0.5 day |
| 5 | 2 hrs | 0.25 day |

Total **≈ 4 dev-days** assuming 1 mid-level engineer.

---
### Risks & Mitigations

* **Colour Contrast Failures** → Run automated a11y tests + manual checks.
* **Performance Jank** → Monitor FPS using Chrome DevTools after animations.
* **Breaking Mobile Nav** → Add Cypress viewport regression snapshots.

---
### Next Steps

1. Get sign-off on roadmap + timeline.  
2. Approve colour tokens & a11y requirements.  
3. Begin Phase 1 implementation.

*Updated:* {{DATE}} 