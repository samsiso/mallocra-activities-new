# Admin Sidebar Redesign Plan

## Background
The current admin sidebar for the dashboard has the following issues:

1. **Scrolling Behaviour** – It is positioned `fixed` with a `h-screen` height which causes it to remain static while the page content scrolls. Instead, the sidebar should scroll along naturally with the page so that its top is always visible (`sticky`) but it can move when the user reaches the bottom of the page.
2. **Visual Style** – The existing palette (grey + orange) does not match the new *We Are Excursions* brand colours (Royal scheme – Rose-Red, Black, White, Yellow).
3. **Brand Identity** – The header still shows *Mallocra Admin*. We need to change this to **We Are Excursions Admin** and apply the brand typography.

## Goals

1. Convert sidebar positioning from `fixed` to **sticky** so that it scrolls with the document but always stays pinned to the top while visible.
2. Apply the official *We Are Excursions* colour palette across the sidebar (background, text, hover, border, badge indicators).
3. Update logo/header to the company name and adjust icon/avatar palette.
4. Keep current mobile-collapse behaviour but ensure colours match on both light & dark modes.

## Brand Colour Palette

| Purpose                | Colour | Tailwind Token Suggestion |
| ---------------------- | ------ | ------------------------- |
| Primary Background     | #111111 (Black) | `bg-exc-black` |
| Primary Accent (links) | #F43F5E (Rose-Red 500) | `text-exc-rose` |
| Hover Accent           | #BE123C (Rose-Red 700) | `hover:bg-exc-rose-700` |
| Warning / Badge        | #FACC15 (Yellow 400) | `bg-exc-yellow` |
| Surface / Card         | #1F1F1F (Gray 900) | `bg-exc-surface` |

Add these tokens to `tailwind.config.ts` under `extend.colors`:

```ts
colors: {
  "exc-black": "#111111",
  "exc-rose": {
    DEFAULT: "#F43F5E",
    700: "#BE123C"
  },
  "exc-yellow": "#FACC15",
  "exc-surface": "#1F1F1F"
}
```

## UX / Interaction Updates

1. **Sticky Implementation**
   * Replace `fixed inset-y-0` with `sticky top-0`.
   * Remove `h-screen`; let the natural height flow, with `overflow-y-auto` on the nav wrapper for long menus.
2. **Focus & Active State**
   * Active menu item: Rose-Red background `bg-exc-rose/90` with white text.
   * Hover state: Slightly darker rose `hover:bg-exc-rose-700`.
3. **Collapse / Expand Button**
   * Maintain but set icon colour to `text-exc-rose`.
4. **Mobile View**
   * Retain slide-in menu; apply gradient overlay `from-exc-black/80 to-exc-black/50` for backdrop.

## Implementation Steps

1. **Add Colours** – Update `tailwind.config.ts` with the colour tokens above.
2. **Refactor Component** – Edit `app/admin/dashboard/_components/admin-sidebar.tsx`:
   * Change outer `div` classes: `fixed … h-screen` → `sticky top-0 max-h-screen`.
   * Replace `bg-gray-800` with `bg-exc-black`.
   * Replace orange accents with `exc-rose`.
   * Update `Logo` span to show `W` (for We) or SVG logo; header to `We Are Excursions Admin`.
3. **Avatar / Badge** – Update footer avatar background to `bg-exc-rose` and text to white.
4. **Testing**
   * Desktop and mobile viewport tests.
   * Scroll test to confirm sticky behaviour.
   * Lighthouse colour-contrast audit.

## Roll-back Plan

If issues arise:
1. Revert class changes in the sidebar component.
2. Remove added colour keys from Tailwind config.
3. Deploy previous commit.

---
**Last updated:** {{DATE}} 