# 21st.dev Component Library for Mallorca Activities

A modern, accessible, and performant component library built with 21st.dev principles for the Mallorca Activities tourism platform.

## 🎯 Overview

This component library provides a comprehensive set of UI components for both booking and blog functionality, designed with:

- **Mobile-first responsive design**
- **WCAG AAA accessibility standards**
- **Optimized performance with lazy loading and code splitting**
- **Beautiful glass morphism effects with brand colors**
- **Smooth animations with respect for `prefers-reduced-motion`**
- **TypeScript support throughout**
- **Consistent design tokens**

## 🎨 Design System

### Brand Colors
- **Primary Pink**: `#fb067d` - Used for primary actions and brand identity
- **Accent Yellow**: `#fff546` - Used for highlights and important information
- **Glass Effects**: Various opacity levels of white/black for depth

### Design Tokens
Located in `/components/design-system/tokens.ts`, providing:
- Color palettes (brand, semantic, glass effects)
- Typography scale (mobile-first responsive)
- Spacing system
- Border radius values
- Shadow effects (including brand-colored glows)
- Transitions and animations
- Breakpoints for responsive design

## 📦 Component Library

### Booking Components (`/components/booking/enhanced/`)

#### 1. **BookingCardEnhanced**
Modern booking cards with multiple variants:
- **Variants**: `standard`, `featured`, `compact`
- **Status indicators**: Available, limited spots, sold out
- **Trust signals**: Instant booking, insurance badges
- **Price display**: With discount support
- **Accessibility**: Full keyboard navigation and screen reader support

```tsx
<BookingCardEnhanced
  title="Sunset Sailing Adventure"
  date={new Date()}
  time="18:30"
  participants={2}
  location="Port de Sóller"
  price={85}
  originalPrice={100}
  status="limited"
  spotsLeft={3}
  variant="featured"
  onBook={() => handleBooking()}
/>
```

#### 2. **BookingFlowWizard**
Multi-step booking wizard with:
- **Progress tracking**: Visual progress bar and step indicators
- **Flexible navigation**: Allow or restrict step navigation
- **Custom step components**: Fully customizable content
- **Animations**: Smooth transitions between steps
- **Accessibility**: ARIA labels and keyboard navigation

```tsx
<BookingFlowWizard
  steps={customBookingSteps}
  onComplete={() => handleComplete()}
  showProgressBar
  allowStepNavigation
/>
```

#### 3. **AvailabilityCalendar**
Advanced calendar component with:
- **Real-time availability**: Visual indicators for available/limited/popular dates
- **Time slot selection**: Expandable time slots with pricing
- **Price variations**: Dynamic pricing by date and time
- **Mobile optimized**: Touch-friendly interface
- **Loading states**: Skeleton loaders for async data

```tsx
<AvailabilityCalendar
  availableDates={dates}
  onDateSelect={(date) => handleDateSelect(date)}
  onTimeSelect={(time) => handleTimeSelect(time)}
  showPricing
  showTimeSlots
/>
```

### Blog Components (`/components/blog/enhanced/`)

#### 1. **BlogCardEnhanced**
Versatile blog cards with multiple layouts:
- **Variants**: `standard`, `featured`, `compact`, `horizontal`
- **Interactive elements**: Like button, view counts
- **Category badges**: With gradient colors
- **Author information**: Avatar and name display
- **Popular indicators**: Animated trending badges
- **Hover effects**: Smooth scale and gradient transitions

```tsx
<BlogCardEnhanced
  title="Hidden Beaches in Mallorca"
  excerpt="Discover secret coves..."
  slug="hidden-beaches"
  author={{ name: "Maria Santos" }}
  publishedAt={new Date()}
  readingTime={8}
  category={{ name: "Destinations", slug: "destination" }}
  variant="featured"
  isPopular
/>
```

#### 2. **BlogContentViewer**
Full-featured article reader with:
- **Reading progress**: Top progress bar
- **Table of contents**: Auto-generated from headings
- **Social sharing**: Native share API with fallback
- **Engagement actions**: Like, bookmark, share
- **Scroll to top**: Animated button for long content
- **Typography optimization**: Readable prose styling
- **Meta information**: Author bio, stats, tags

```tsx
<BlogContentViewer
  title="Top 10 Hidden Beaches"
  content={htmlContent}
  author={authorInfo}
  publishedAt={date}
  readingTime={8}
  category={category}
  tags={tags}
  showTableOfContents
  showReadingProgress
/>
```

#### 3. **BlogSearchFilter**
Advanced filtering system with:
- **Real-time search**: With debouncing
- **Category filters**: Visual category selection
- **Tag filtering**: Multi-select tag system
- **Author filtering**: Filter by content creator
- **Sort options**: Latest, popular, trending
- **View modes**: Grid/list toggle
- **Active filter count**: Visual indicator
- **Clear all**: Quick reset functionality

```tsx
<BlogSearchFilter
  categories={categories}
  tags={tags}
  authors={authors}
  onSearch={(query) => handleSearch(query)}
  onCategoryChange={(cat) => handleCategory(cat)}
  onViewChange={(view) => setView(view)}
/>
```

## 🚀 Key Features

### Accessibility (WCAG AAA)
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA labels**: Comprehensive screen reader support
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Clear focus indicators
- **Color contrast**: AAA compliant color combinations
- **Motion preferences**: Respects `prefers-reduced-motion`

### Performance Optimizations
- **Code splitting**: Components loaded on demand
- **Image optimization**: Next.js Image component usage
- **Lazy loading**: Intersection Observer for images
- **Bundle size**: Minimal dependencies
- **CSS containment**: For animation performance
- **Memoization**: React optimization techniques

### Mobile Experience
- **Touch-friendly**: Large tap targets (min 44x44px)
- **Responsive typography**: Fluid type scaling
- **Gesture support**: Swipe and touch interactions
- **Viewport optimization**: Proper mobile viewport
- **Performance**: Optimized for 3G connections

### Design Consistency
- **Design tokens**: Centralized design system
- **Component variants**: Consistent patterns
- **Glass morphism**: Unified visual language
- **Brand colors**: Pink (#fb067d) and yellow (#fff546)
- **Spacing system**: Consistent spacing scale
- **Typography**: Harmonious type scale

## 📱 Responsive Design

All components follow a mobile-first approach with breakpoints:
- **xs**: 475px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🧪 Demo & Testing

View the complete component library demo at:
```
/demo/component-library
```

This showcases:
- All component variants
- Interactive examples
- Design token previews
- Responsive behavior
- Accessibility features

## 🔧 Integration

### With Existing Booking System
The enhanced components seamlessly integrate with the existing booking infrastructure:
- Compatible with current server actions
- Works with existing Supabase schemas
- Maintains current booking flow logic
- Enhances UI without breaking changes

### With Blog System
Enhanced blog components work with:
- Current blog database schema
- Existing server actions
- SEO optimization features
- Content management workflows

## 🎯 Usage Guidelines

### Best Practices
1. **Import from index files** for better tree-shaking
2. **Use design tokens** for consistency
3. **Provide alt text** for all images
4. **Test keyboard navigation** for all interactions
5. **Check mobile experience** on real devices
6. **Monitor bundle size** when adding features

### Component Composition
```tsx
// Example: Complete booking page
import { 
  BookingCardEnhanced,
  BookingFlowWizard,
  AvailabilityCalendar 
} from '@/components/booking/enhanced'

function BookingPage({ activity }) {
  return (
    <div className="max-w-7xl mx-auto">
      <BookingCardEnhanced {...activity} />
      <AvailabilityCalendar {...availability} />
      <BookingFlowWizard steps={steps} />
    </div>
  )
}
```

## 🚨 Important Notes

### Brand Consistency
- **Always use** pink (#fb067d) as primary color
- **Never use** orange colors (eliminated from design)
- **Maintain** glass morphism effects
- **Follow** established hover/focus states

### Accessibility Requirements
- **Test with** screen readers (NVDA, JAWS, VoiceOver)
- **Verify** keyboard navigation works
- **Check** color contrast ratios
- **Ensure** focus indicators are visible
- **Provide** meaningful alt text

### Performance Considerations
- **Lazy load** images and heavy components
- **Use** Next.js Image for optimization
- **Implement** proper loading states
- **Monitor** Core Web Vitals
- **Optimize** for mobile networks

## 🔮 Future Enhancements

### Planned Features
1. **Advanced animations**: More micro-interactions
2. **Theme customization**: Dynamic theme switching
3. **Offline support**: PWA capabilities
4. **AI integration**: Smart recommendations
5. **Voice navigation**: Accessibility enhancement

### Component Roadmap
- Rich text editor for blog creation
- Advanced booking calendar with drag selection
- Real-time collaborative features
- Enhanced data visualization components
- AR/VR integration for virtual tours

## 📚 Resources

- **Design Tokens**: `/components/design-system/tokens.ts`
- **Component Demo**: `/demo/component-library`
- **Booking Components**: `/components/booking/enhanced/`
- **Blog Components**: `/components/blog/enhanced/`
- **Hooks**: `/hooks/` (including `use-debounce`)

---

Built with ❤️ using 21st.dev principles for the modern web.