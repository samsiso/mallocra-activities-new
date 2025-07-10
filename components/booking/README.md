# Booking Component Library

A modern, accessible component library for the Mallorca Activities booking system built with 21st.dev principles.

## 🎨 Design Principles

- **Mobile-first** responsive design
- **WCAG AAA** accessibility standards
- **Performance-focused** with Core Web Vitals optimization
- **Delightful interactions** with respect for prefers-reduced-motion
- **Consistent design tokens** for spacing, typography, and color
- **Glass morphism** effects with pink brand colors

## 📦 Components

### Core Components
- `BookingCard` - Main booking container with glass effects
- `BookingProgress` - Step indicator with animations
- `DateTimePicker` - Accessible date and time selection
- `ParticipantSelector` - Interactive participant count selector
- `PriceDisplay` - Dynamic pricing with currency support
- `BookingSummary` - Sticky summary card for desktop

### Form Components
- `BookingForm` - Multi-step form with validation
- `GuestDetailsForm` - Customer information collection
- `PaymentForm` - Stripe Elements integration
- `SpecialRequirementsInput` - Accessible textarea with character count

### Feedback Components
- `AvailabilityIndicator` - Real-time slot availability
- `WeatherWidget` - Weather conditions for outdoor activities
- `TrustSignals` - Security badges and guarantees
- `LoadingStates` - Skeleton loaders and spinners

### Confirmation Components
- `BookingConfirmation` - Success animation and details
- `BookingReceipt` - Printable booking summary
- `NextSteps` - Post-booking action cards

## 🚀 Usage

```tsx
import { BookingCard, BookingProgress, DateTimePicker } from '@/components/booking'

// Example usage
<BookingCard>
  <BookingProgress currentStep={1} totalSteps={3} />
  <DateTimePicker
    selectedDate={date}
    onDateChange={setDate}
    availableSlots={slots}
  />
</BookingCard>
```

## 🎯 Accessibility Features

- Full keyboard navigation support
- Screen reader announcements for all interactions
- Focus management between steps
- ARIA labels and descriptions
- High contrast mode support
- Reduced motion alternatives

## ⚡ Performance Optimizations

- Lazy loading for heavy components
- Optimistic UI updates
- Bundle splitting per booking step
- Image optimization with Next.js Image
- CSS containment for animations
- Virtual scrolling for long lists