# Booking Component Library Documentation

A comprehensive, accessible, and performant booking component library for the Mallorca Activities platform built with 21st.dev principles.

## 🎯 Design Philosophy

- **Mobile-first**: All components are optimized for touch devices
- **Accessibility**: WCAG AAA compliant with full keyboard navigation
- **Performance**: Optimized for Core Web Vitals with lazy loading
- **Delightful**: Smooth animations with respect for prefers-reduced-motion
- **Consistent**: Design tokens for spacing, typography, and colors
- **Glass morphism**: Modern glass effects with brand colors

## 📚 Component Reference

### Core Components

#### BookingCard
Main container component with glass morphism effects.

```tsx
<BookingCard variant="elevated" animate>
  {/* Content */}
</BookingCard>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'bordered'
- `animate`: boolean (default: true)
- `className`: string

#### BookingProgress
Step indicator with animated progress tracking.

```tsx
<BookingProgress 
  currentStep={2} 
  totalSteps={3}
  steps={customSteps} // optional
/>
```

**Props:**
- `currentStep`: number (1-based)
- `totalSteps`: number
- `steps`: Array of step objects (optional)

#### DateTimePicker
Accessible calendar with time slot selection.

```tsx
<DateTimePicker
  selectedDate={date}
  selectedTime={time}
  onDateChange={setDate}
  onTimeChange={setTime}
  availableSlots={slots}
  minDate={new Date()}
/>
```

**Props:**
- `selectedDate`: Date | null
- `selectedTime`: string | null
- `onDateChange`: (date: Date) => void
- `onTimeChange`: (time: string) => void
- `availableSlots`: Record<string, TimeSlot[]>
- `minDate`: Date (optional)
- `maxDate`: Date (optional)

#### ParticipantSelector
Interactive selector for different participant types.

```tsx
<ParticipantSelector
  participants={{ adults: 2, children: 1 }}
  onParticipantChange={handleChange}
  participantTypes={types}
  maxParticipants={20}
/>
```

**Props:**
- `participants`: Record<string, number>
- `onParticipantChange`: (type: string, count: number) => void
- `participantTypes`: ParticipantType[]
- `maxParticipants`: number (default: 20)
- `minParticipants`: number (default: 1)

### Display Components

#### PriceDisplay
Dynamic pricing display with discount support.

```tsx
<PriceDisplay
  originalPrice={60}
  discountedPrice={45}
  currency="EUR"
  size="lg"
  showSavings
/>
```

**Props:**
- `originalPrice`: number (optional)
- `discountedPrice`: number
- `currency`: string (default: 'EUR')
- `size`: 'sm' | 'md' | 'lg'
- `showSavings`: boolean (default: true)

#### BookingSummary
Comprehensive booking details summary.

```tsx
<BookingSummary
  activityTitle="Sunset Cruise"
  selectedDate={date}
  participants={participants}
  pricing={pricingDetails}
  sticky
/>
```

**Props:**
- `activityTitle`: string
- `selectedDate`: Date | null
- `participants`: object
- `pricing`: object
- `sticky`: boolean (default: true)

### Status Components

#### AvailabilityIndicator
Real-time availability status display.

```tsx
<AvailabilityIndicator
  status="limited"
  spotsLeft={3}
  totalSpots={20}
  showDetails
/>
```

**Props:**
- `status`: 'available' | 'limited' | 'unavailable' | 'checking'
- `spotsLeft`: number (optional)
- `totalSpots`: number (optional)
- `showDetails`: boolean (default: true)

#### WeatherWidget
Weather conditions display for activities.

```tsx
<WeatherWidget
  weather={weatherData}
  activityType="outdoor"
  compact={false}
/>
```

**Props:**
- `weather`: WeatherData object
- `activityType`: 'outdoor' | 'indoor' | 'water'
- `compact`: boolean

### Form Components

#### BookingForm
Multi-step form wrapper with navigation.

```tsx
<BookingForm
  steps={formSteps}
  currentStep={0}
  onStepChange={setStep}
  onComplete={handleComplete}
/>
```

**Props:**
- `steps`: BookingStep[]
- `currentStep`: number
- `onStepChange`: (step: number) => void
- `onComplete`: () => void | Promise<void>

#### GuestDetailsForm
Customer information collection form.

```tsx
<GuestDetailsForm
  details={guestDetails}
  onChange={setGuestDetails}
  participantCount={3}
  errors={validationErrors}
/>
```

**Props:**
- `details`: GuestDetails object
- `onChange`: (details: GuestDetails) => void
- `participantCount`: number
- `errors`: Record<string, string>

#### PaymentForm
Secure payment form with Stripe integration.

```tsx
<PaymentForm
  amount={105}
  onSubmit={handlePayment}
  isProcessing={false}
  stripeElement={<StripeElements />}
/>
```

**Props:**
- `amount`: number
- `onSubmit`: () => void | Promise<void>
- `isProcessing`: boolean
- `stripeElement`: React.ReactNode

### Confirmation Components

#### BookingConfirmation
Success confirmation with animations.

```tsx
<BookingConfirmation
  bookingReference="MAL-2024-001"
  activityTitle="Kayaking Tour"
  date="March 15, 2024"
  time="09:00"
  participants={participants}
  totalAmount={150}
/>
```

#### NextSteps
Post-booking action cards.

```tsx
<NextSteps steps={customSteps} />
```

## 🎨 Theming & Customization

### CSS Variables
The component library uses CSS variables for easy theming:

```css
:root {
  --booking-primary: #fb067d;
  --booking-accent: #fff546;
  --booking-glass-bg: rgba(255, 255, 255, 0.1);
  --booking-glass-border: rgba(255, 255, 255, 0.2);
}
```

### Brand Colors
- Primary: Pink `#fb067d`
- Accent: Yellow `#fff546`
- Glass effects: `bg-white/10`, `bg-white/15`, `bg-white/20`

## ♿ Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Focus indicators are clearly visible

### Screen Readers
- Proper ARIA labels and descriptions
- Live regions for dynamic updates
- Semantic HTML structure

### Motion Preferences
```tsx
// Components respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## ⚡ Performance Optimizations

### Bundle Splitting
```tsx
// Lazy load heavy components
const DateTimePicker = lazy(() => import('./date-time-picker'))
```

### Image Optimization
- Use Next.js Image component
- Lazy loading for images
- Appropriate image formats

### CSS Containment
```css
.booking-card {
  contain: layout style;
}
```

## 🧪 Testing

### Unit Tests
```tsx
describe('ParticipantSelector', () => {
  it('should update participant count', () => {
    // Test implementation
  })
})
```

### Accessibility Tests
```tsx
it('should be navigable by keyboard', () => {
  // Test keyboard navigation
})
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Touch-friendly tap targets (min 44x44px)
- Swipe gestures for navigation
- Optimized layouts for small screens

## 🚀 Usage Examples

### Complete Booking Flow
```tsx
import { 
  BookingCard, 
  BookingForm, 
  DateTimePicker,
  ParticipantSelector,
  GuestDetailsForm,
  PaymentForm,
  BookingConfirmation 
} from '@/components/booking'

function BookingPage() {
  const steps = [
    {
      id: 'select',
      title: 'Select Date & Time',
      component: <DateTimePicker {...props} />
    },
    // ... more steps
  ]

  return (
    <BookingCard variant="elevated">
      <BookingForm steps={steps} {...formProps} />
    </BookingCard>
  )
}
```

## 🛠️ Development Guidelines

### Component Structure
```
booking/
├── component-name.tsx      # Component implementation
├── component-name.test.tsx # Tests
├── component-name.stories.tsx # Storybook stories
└── index.ts               # Exports
```

### Code Style
- Use TypeScript strict mode
- Follow React best practices
- Implement proper error boundaries
- Add comprehensive JSDoc comments

## 📊 Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS 13+, Android 8+

## 🤝 Contributing

1. Follow the established patterns
2. Ensure accessibility compliance
3. Add comprehensive tests
4. Update documentation
5. Check performance impact

## 📝 License

This component library is part of the Mallorca Activities platform and follows the project's licensing terms.