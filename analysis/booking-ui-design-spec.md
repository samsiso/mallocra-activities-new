# Booking Flow UI Design Specification

*Mallorca Activities Platform – v1.0 (January 2025)*

---

## 1 · Purpose
Provide a single source-of-truth for designers & developers to style the **Booking Widget + 4-step Booking Flow** so it matches the brand palette (rose ⚘, yellow ⚡, black ⬛, white ⬜) and delivers a premium user experience across devices.

---

## 2 · Brand Palette & Design Tokens

| Token | Hex | Tailwind Alias | Usage |
|-------|-----|----------------|-------|
| `brand-rose` | `#e11d48` | `rose-600` | Primary buttons, active states |
| `brand-rose-light` | `#f43f5e` | `rose-400` | Hover / focus rings |
| `brand-yellow` | `#facc15` | `yellow-400` | Price emphasis, success badges |
| `brand-black` | `#0f0f0f` | `black` | Page & card backgrounds |
| `glass-bg` | `rgba(255,255,255,.05)` | `white/5` | Glassmorphism card surface |
| `text-primary` | `#ffffff` | `white` | Body copy |
| `text-secondary` | `rgba(255,255,255,.7)` | `white/70` | Labels & helper text |

_Add to `tailwind.config.js` under `theme.extend.colors.brand`._

---

## 3 · Core Components

### 3.1 · `<GlassCard>` Wrapper
```tsx
export default function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}
```

### 3.2 · `<PrimaryButton>`
```tsx
<Button className="bg-brand-rose hover:bg-brand-rose-light focus:ring-4 focus:ring-brand-yellow font-extrabold" />
```

### 3.3 · `<ProgressBar>`
```tsx
<div className="h-2 w-full rounded bg-white/10 overflow-hidden">
  <motion.div
    animate={{ width: `${percent}%` }}
    className="h-full bg-brand-rose" />
</div>
```

### 3.4 · Input Styles
```
className="w-full rounded-lg bg-black/50 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-rose-light"
```

---

## 4 · Booking Flow Structure

1️⃣ **Select Step**  
   • Date / time selectors, participants counters.  
   • Sticky summary sidebar (desktop).  

2️⃣ **Details Step**  
   • Lead customer form (first / last name, email, phone).  
   • Special requirements textarea.  

3️⃣ **Payment Step**  
   • Stripe Elements card form styled with palette.  
   • Order recap card.  

4️⃣ **Confirmation Step**  
   • Success badge, reference code pill, next-steps buttons.  

> Each step page uses `<ProgressBar>` at top and wraps content inside `<GlassCard>` centred on dark background.

---

## 5 · Visual Hierarchy & Layout

```
+------------------------------------------------+
|   ProgressBar (100% width)                     |
+--------------------+---------------------------+
|                    |                           |
|  GlassCard (main)  |  Sticky Summary (desktop) |
|                    |                           |
+--------------------+---------------------------+
|      PrimaryButton (full width on mobile)      |
+------------------------------------------------+
```

Mobile: summary collapses into accordion below form.

---

## 6 · Micro-interactions & Motion
| Element | Interaction | Motion Spec |
|---------|-------------|-------------|
| Buttons | Hover | `scale: 1.05;` duration `150 ms` |
| ProgressBar | Step change | `width` tween `0.5 s` easeOut |
| Price pill | Hover | subtle glow `shadow-brand-yellow/40` |
| Confirmation confetti | On mount | 2 s particle burst (optional) |

---

## 7 · Accessibility Checklist
- Colour contrast ≥ 4.5 : 1.  
- Labels linked to inputs, `aria-live="polite"` for dynamic price & errors.  
- `role="progressbar"` + `aria-valuenow` for `<ProgressBar>`.  
- Keyboard focus ring clearly visible (rose-light).  

---

## 8 · Implementation Timeline
| Sprint | Task | File(s) |
|--------|------|---------|
| S-1 | Tailwind tokens + `<GlassCard>` & `<PrimaryButton>` components | `tailwind.config.js`, `components/ui` |
| S-1 | Refactor `BookingWidget` UI | `app/activities/[id]/_components/booking-widget.tsx` |
| S-2 | Build and wire `<ProgressBar>`; update *Select* & *Details* pages | `/book/[id]/*` |
| S-2 | Add sticky summary (desktop) + accordion (mobile) | same |
| S-3 | Style *Payment* & *Confirmation* pages, add animations | payment/confirmation pages |
| S-3 | QA, Lighthouse, fix contrast & LCP | – |

---

## 9 · Design References
- **Glassmorphism** inspiration: Apple Music cards.  
- **Colour palette** reference: Ferrari red (#e11d48) × Pirelli yellow (#facc15) over black.  
- **Typography**: `Inter`, weights 400-800.

---

### Appendices
A. Figma link once high-fidelity mock-ups are ready.  
B. Motion spec JSON for Framer Motion (coming).

---

*Prepared by UX Team – contact: ux@mallorca-activities.com* 