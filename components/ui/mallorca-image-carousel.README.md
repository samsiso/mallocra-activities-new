# Mallorca Image Carousel Component

A modern, accessible, and feature-rich image carousel component designed specifically for showcasing Mallorca's beautiful beaches, crystal-clear waters, and sailing experiences.

## Features

### 🎨 Visual Features
- **Smooth Transitions**: Powered by Framer Motion for fluid animations
- **Parallax Effects**: Mouse movement creates subtle depth effects
- **Image Preloading**: Ensures smooth transitions between slides
- **Gradient Overlays**: Enhances text readability over images
- **Responsive Design**: Works flawlessly on all screen sizes

### ♿ Accessibility (WCAG AAA Compliant)
- **Full Keyboard Navigation**: 
  - Arrow keys for navigation
  - Space for play/pause
  - F for fullscreen
  - Escape to exit fullscreen
- **Screen Reader Support**: Live region announcements for slide changes
- **Proper ARIA Labels**: All interactive elements properly labeled
- **Focus Management**: Clear focus indicators and logical tab order
- **Reduced Motion**: Respects user's motion preferences

### 🎮 Interactive Controls
- **Auto-play**: Configurable interval with play/pause control
- **Navigation Buttons**: Previous/Next with hover effects
- **Dot Indicators**: Click to jump to any slide
- **Thumbnail Navigation**: Optional thumbnail strip
- **Fullscreen Mode**: Immersive viewing experience
- **Info Overlay**: Display image titles and descriptions
- **Sound Effects**: Optional transition sounds

## Installation

The component is already included in the project. Import it from:

```tsx
import { 
  MallorcaImageCarousel, 
  SimpleImageCarousel 
} from '@/components/ui/mallorca-image-carousel'
```

## Usage Examples

### Basic Usage (Default Mallorca Images)

```tsx
<MallorcaImageCarousel />
```

### Simple Carousel (Minimal Features)

```tsx
<SimpleImageCarousel />
```

### Custom Images

```tsx
const customImages = [
  {
    url: "https://example.com/image1.jpg",
    alt: "Beach scene",
    title: "Cala Millor",
    description: "Beautiful sandy beach"
  },
  // ... more images
]

<MallorcaImageCarousel images={customImages} />
```

### Full Configuration

```tsx
<MallorcaImageCarousel
  images={customImages}
  autoPlay={true}
  interval={5000}
  showControls={true}
  showIndicators={true}
  showThumbnails={true}
  enableFullscreen={true}
  enableKeyboardNavigation={true}
  className="custom-carousel"
  imageClassName="custom-image"
  overlayGradient={true}
  parallaxEffect={true}
  soundEffects={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CarouselImage[]` | Default Mallorca images | Array of images to display |
| `autoPlay` | `boolean` | `true` | Enable automatic slide advancement |
| `interval` | `number` | `5000` | Time between slides in milliseconds |
| `showControls` | `boolean` | `true` | Show navigation controls |
| `showIndicators` | `boolean` | `true` | Show dot indicators |
| `showThumbnails` | `boolean` | `false` | Show thumbnail navigation |
| `enableFullscreen` | `boolean` | `true` | Allow fullscreen mode |
| `enableKeyboardNavigation` | `boolean` | `true` | Enable keyboard controls |
| `className` | `string` | `undefined` | Custom CSS classes for container |
| `imageClassName` | `string` | `undefined` | Custom CSS classes for images |
| `overlayGradient` | `boolean` | `true` | Show gradient overlay |
| `parallaxEffect` | `boolean` | `true` | Enable mouse parallax |
| `soundEffects` | `boolean` | `false` | Enable transition sounds |

## Image Object Structure

```typescript
interface CarouselImage {
  url: string        // Image URL (required)
  alt: string        // Alt text for accessibility (required)
  title?: string     // Optional title shown in info overlay
  description?: string // Optional description shown in info overlay
}
```

## Default Mallorca Images

The component includes 5 stunning default images showcasing:
1. **Cala Mondragó** - Turquoise waters and pristine beach
2. **Port de Sóller** - Luxury yachts at sunset
3. **Es Trenc** - Caribbean-like white sand beach
4. **Cala Figuera** - Traditional fishing boats
5. **Cap de Formentor** - Dramatic cliffs and panoramic views

## Keyboard Shortcuts

- **←/→**: Navigate previous/next
- **Space**: Toggle play/pause
- **F**: Toggle fullscreen
- **Esc**: Exit fullscreen
- **Tab**: Navigate controls
- **Enter**: Activate focused control

## Styling

The component uses Tailwind CSS and accepts custom classes:

```tsx
// Custom container styling
<MallorcaImageCarousel 
  className="rounded-2xl shadow-2xl"
/>

// Custom image styling
<MallorcaImageCarousel 
  imageClassName="brightness-110 contrast-125"
/>
```

## Performance Considerations

- **Image Optimization**: Uses Next.js Image component for automatic optimization
- **Lazy Loading**: Only loads visible and adjacent images
- **Preloading**: Preloads all images for smooth transitions
- **Responsive Sizing**: Serves appropriate image sizes based on viewport

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (some fullscreen API differences)
- Mobile browsers: Full touch support

## Examples

View the live demo at `/demo/mallorca-carousel` to see:
- Default configuration
- Minimal configuration
- Thumbnail navigation
- Custom styling examples

## Future Enhancements

- [ ] Touch/swipe gestures for mobile
- [ ] Video support alongside images
- [ ] Ken Burns effect option
- [ ] Social sharing integration
- [ ] Analytics integration
- [ ] Custom transition effects

## Credits

Built with:
- Next.js 15 and React 18
- Framer Motion for animations
- Tailwind CSS for styling
- Radix UI for accessible components
- High-quality Unsplash images of Mallorca