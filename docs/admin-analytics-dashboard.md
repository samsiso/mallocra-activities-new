# 🛠️ Admin Analytics Dashboard – Functional & Technical Specification

_Last updated: 2025-06-10_

---

## 1️⃣ Purpose & Vision
The Admin Analytics Dashboard empowers internal stakeholders to **monitor, analyse, and optimise** platform performance in real-time. It consolidates high-value metrics—**GMV, DAU, Churn, Conversion Funnel**, and more—into a single dark-theme interface powered by **PostHog**.

> "If we can't measure it, we can't improve it." – _Peter Drucker_

---

## 2️⃣ Core Metrics
| Metric | Definition | Data Source |
| ------ | ---------- | ----------- |
| **GMV** | Gross Merchandise Value – total € value of completed bookings (minus refunds) | `bookings` table + Stripe Webhooks |
| **DAU / WAU / MAU** | Unique authenticated users performing any action in the given window | PostHog `$identify` events |
| **Churn Rate** | % users who were active in previous period but inactive in current | PostHog cohorts |
| **Conversion Funnel** | Visitor → Signup → First Booking → Repeat Booking | PostHog funnels + custom events |
| **Average Order Value** | GMV / # bookings in period | Computed on server |
| **Cancellation %** | Cancelled bookings / total bookings | `bookings` table |

_Note:_ All monetary values are stored in **EUR cents** in DB; convert to € for display.

---

## 3️⃣ Event Tracking Schema (PostHog)
| Event | Trigger | Properties |
| ----- | ------- | ---------- |
| `booking_completed` | Successful Stripe webhook `checkout.session.completed` | `booking_id`, `user_id`, `amount_cents`, `currency`, `activity_id` |
| `booking_cancelled` | Booking status changes to `cancelled` | `booking_id`, `user_id`, `reason` |
| `pageview` | Route change | `path` |
| `user_signed_up` | Clerk `user.created` webhook | `user_id`, `plan` |
| `clicked_cta` | Marketing CTA interactions | `cta_id`, `page` |

Ensure **every** user is identified via `posthog.identify` with Clerk `user.id`. 

---

## 4️⃣ Architecture Overview
```
[Client: Admin Dashboard]
      │  (fetch)
      ▼
[Next.js Server Actions] ──→  [PostHog API]
      │                       ▲
      │  (SQL queries)        │ (aggregations)
      ▼                       │
[Supabase / Postgres] ───────┘
```
1. **Server Actions** serve as a lightweight tRPC-like layer returning JSON stats.
2. Heavy aggregations (funnel, retention) off-loaded to PostHog's `/api/projects/:id/query/` endpoints.
3. Financial metrics (GMV, refunds) fetched directly from Postgres with Drizzle.
4. All responses cached for 5 min via `unstable_cache` (Next.js).

---

## 5️⃣ UI Requirements
- **Route**: `app/admin/dashboard/page.tsx` (`"use server"`).
- **Charts Library**: `recharts` (already in deps) with Tailwind-styled dark theme.
- **Layout**: 3-column grid (12-col) responsive → 1-col on mobile.
- **Components**:
  1. **MetricCard** – big number & % change (GMV, DAU)
  2. **LineChartCard** – GMV trend
  3. **BarChartCard** – DAU/MAU
  4. **FunnelChartCard** – conversion funnel
  5. **RetentionHeatmap** – churn / retention matrix
- **Filters**: Date range picker (`last 7d`, `30d`, custom) + activity category dropdown.
- **Access Control**: Only Clerk users with `role = "admin"` can access route (middleware guard).

---

## 6️⃣ Implementation Tasks (Sprint-level)
| # | Task | Owner | Effort |
| - | ---- | ----- | ------ |
| 1 | Create PostHog events & verify schema | Analytics Eng | 2d |
| 2 | Build server actions `getGmvStats`, `getFunnelStats`, etc. | Backend | 3d |
| 3 | Add `admin` role column to `profiles` table | DB | 1d |
| 4 | Middleware guard for `/admin/*` routes | Backend | 0.5d |
| 5 | Scaffold dashboard page & cards | Frontend | 3d |
| 6 | Integrate charts & filters | Frontend | 2d |
| 7 | QA + Lighthouse + PostHog verification | QA | 1d |
| 8 | Docs & analytics playbook update | Tech Writer | 0.5d |

_Time-boxed MVP: **~2 weeks**._ 

---

## 7️⃣ Security & Compliance
- Restrict PostHog **API keys** to server-side only; never expose on client.
- Pseudonymise user data for GDPR compliance; avoid storing PII in event props.
- Use Supabase RLS to ensure only admins can query finance tables.
- Enforce HTTPS and Content-Security-Policy headers for `/admin` routes.

---

## 8️⃣ PostHog Configuration Steps
1. **Create Project** `Mallorca Activities – Prod` in PostHog.
2. Copy project API key → add to `.env.local` as `NEXT_PUBLIC_POSTHOG_KEY`.
3. Generate **Personal API Key** for server actions → store in `POSTHOG_API_KEY` (server only).
4. Define events & properties via PostHog UI or API.
5. Set up **Funnels**:
   - `Visitor (pageview)` → `user_signed_up` → `booking_completed` → `booking_completed` (repeat).
6. Set up **Retention Analysis** on `booking_completed`.
7. Enable **Autocapture heatmaps** on marketing pages.

---

## 9️⃣ Future Enhancements (v2+)
- **Cohort Comparison**: Compare GMV by acquisition channel.
- **Custom Alerts**: Slack webhook when GMV drops >20 % WoW.
- **Embedded Session Replays**: Link out to PostHog replays filtered by funnel drop-off.
- **Forecasting**: Simple ARIMA forecast for GMV next 30 days.
- **Multi-Project Toggle**: Staging vs Prod metrics switcher.

---

## 🔚 Sign-Off Checklist
- [ ] Database migrations merged
- [ ] Clerk `admin` role assigned
- [ ] PostHog events firing in staging
- [ ] Dashboard page deployed behind auth
- [ ] QA approved visual & data accuracy

> **Next Step:** Start with Task #3 – extend `profiles` schema to include `role` and seed existing admin accounts. 