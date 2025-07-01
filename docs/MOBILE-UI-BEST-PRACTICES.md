# Mobile UI Best Practices Guide

## 📱 Core Principles for Mobile Design

### 1. **Thumb-Friendly Design**
- **Primary actions** should be in the bottom 60% of screen (thumb reach zone)
- **Touch targets** minimum 44x44px (iOS) or 48x48px (Android)
- **Important CTAs** placed at bottom of screen for easy access
- **Avoid top corners** for interactive elements

### 2. **One-Handed Operation**
- Design for single-hand use (85% of users)
- Place navigation and key actions within thumb reach
- Use bottom sheets instead of top modals
- Implement swipe gestures for common actions

### 3. **Performance First**
- **Initial load**: Under 3 seconds on 3G
- **Animations**: 200-300ms max duration
- **Lazy load** images and heavy content
- **Optimize videos**: Use poster images, lazy load, compress

### 4. **Visual Hierarchy**
- **F-pattern** or **Z-pattern** scanning
- **Large, readable fonts**: Min 16px body text
- **High contrast**: WCAG AA standard (4.5:1 for normal text)
- **Clear CTAs**: Stand out with color and size

---

## 🎨 Mobile-Specific Design Patterns

### **Hero Sections**
```css
/* Mobile hero best practices */
.mobile-hero {
  min-height: 100vh; /* Full viewport */
  min-height: 100dvh; /* Dynamic viewport height */
  padding: 20px; /* Comfortable margins */
}
```

**Best Practices:**
- Show key message immediately
- Single primary CTA above fold
- Minimize text - users scan, don't read
- Use background videos sparingly (battery drain)

### **Navigation**
- **Bottom navigation** for primary actions (max 5 items)
- **Hamburger menu** for secondary options
- **Sticky headers** that hide on scroll down, show on scroll up
- **Tab bars** for section navigation

### **Forms & Input**
- **Single column** layouts
- **Auto-advance** between fields
- **Show appropriate keyboards** (email, number, etc.)
- **Inline validation** with clear error messages
- **Minimize required fields**

### **Cards & Lists**
- **Full-width cards** with adequate padding
- **Swipe actions** for quick interactions
- **Lazy loading** with skeleton screens
- **Pull-to-refresh** for updated content

---

## 📐 Responsive Breakpoints

### **Mobile-First Approach**
```css
/* Base (Mobile) */
/* 320px - 768px */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### **Common Device Sizes**
- **iPhone SE**: 375x667px
- **iPhone 12/13/14**: 390x844px
- **iPhone Pro Max**: 428x926px
- **Android Average**: 360x800px

---

## ⚡ Performance Guidelines

### **Images**
- Use **WebP** format with JPEG fallback
- **Responsive images** with srcset
- **Lazy loading** with intersection observer
- **Blur-up** technique for progressive loading

### **Animations**
- Use **transform** and **opacity** only
- Avoid **animating layout** properties
- **will-change** for heavy animations
- **Reduce motion** media query respect

### **Scrolling**
- **Momentum scrolling**: `-webkit-overflow-scrolling: touch`
- **Scroll snap** for carousels
- **Virtual scrolling** for long lists
- **Debounce** scroll event handlers

---

## 🎯 Mobile UX Patterns

### **Loading States**
1. **Skeleton screens** over spinners
2. **Progressive disclosure** of content
3. **Optimistic UI** updates
4. **Meaningful transitions**

### **Error Handling**
- **Inline errors** near the source
- **Toast notifications** for system messages
- **Retry mechanisms** for network failures
- **Offline support** with service workers

### **Gestures**
- **Swipe** for navigation and actions
- **Pull-to-refresh** for updates
- **Long press** for context menus
- **Pinch-to-zoom** for images

---

## 📊 Metrics to Track

### **Core Web Vitals**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### **User Metrics**
- **Bounce rate**: Target < 40%
- **Session duration**: > 2 minutes
- **Conversion rate**: Track by device
- **Touch accuracy**: Monitor mis-taps

---

## 🚫 Common Mobile Mistakes to Avoid

1. **Tiny touch targets** - Keep minimum 44x44px
2. **Desktop-only hover states** - Provide touch alternatives
3. **Fixed positioning issues** - Test with keyboard open
4. **Horizontal scrolling** - Keep content within viewport
5. **Auto-playing videos** - Respect user preferences
6. **Dense information** - Simplify for mobile context
7. **Popup overload** - Minimize interruptions
8. **Slow animations** - Keep under 300ms
9. **Large images** - Optimize for mobile bandwidth
10. **Ignoring thumb reach** - Test one-handed use

---

## ✅ Mobile Testing Checklist

- [ ] Test on real devices (not just Chrome DevTools)
- [ ] Check with slow 3G connection
- [ ] Verify touch targets are adequate
- [ ] Test with screen reader
- [ ] Validate forms with mobile keyboard
- [ ] Check landscape orientation
- [ ] Test with one hand
- [ ] Verify gestures work correctly
- [ ] Monitor battery usage
- [ ] Test offline functionality

---

## 🎨 Color & Contrast for Mobile

### **Outdoor Readability**
- Higher contrast ratios (aim for 7:1)
- Avoid light gray text
- Consider dark mode support
- Test in bright sunlight conditions

### **Color Usage**
- Use color + iconography (not color alone)
- Ensure sufficient contrast
- Test with color blindness simulators
- Provide visual feedback for all interactions

---

## 📱 Platform-Specific Considerations

### **iOS**
- Respect safe areas (notch, home indicator)
- Use SF Symbols for consistency
- Follow Human Interface Guidelines
- Support Dynamic Type

### **Android**
- Material Design principles
- Support back button navigation
- Handle different screen densities
- Test on various manufacturers

---

## 🔧 Implementation Tips

1. **Start mobile-first** - Easier to scale up than down
2. **Use CSS Grid/Flexbox** - Better responsive layouts
3. **Implement touch events** - Not just click handlers
4. **Optimize fonts** - Use system fonts when possible
5. **Minimize JavaScript** - CSS solutions preferred
6. **Cache aggressively** - Reduce network requests
7. **Compress everything** - Images, videos, code
8. **Test early and often** - Real device testing crucial

---

This guide should be referenced when making any mobile UI decisions to ensure the best possible user experience.