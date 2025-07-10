"use client"

import React from "react"
import {
  MallorcaImageCarousel,
  SimpleImageCarousel,
  type CarouselImage
} from "@/components/ui/mallorca-image-carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code2,
  Sparkles,
  Waves,
  Sailboat,
  Image as ImageIcon
} from "lucide-react"

// Additional Mallorca-themed images for variety
const additionalMallorcaImages: CarouselImage[] = [
  {
    url: "https://images.unsplash.com/photo-1565071783280-719b01b29912?q=80&w=2070&auto=format&fit=crop",
    alt: "Hidden beach cove with crystal clear water in Mallorca",
    title: "Caló des Moro",
    description: "Discover Mallorca's most Instagram-worthy hidden beach"
  },
  {
    url: "https://images.unsplash.com/photo-1589122382418-59e732ae6dde?q=80&w=2070&auto=format&fit=crop",
    alt: "Sunset sailing with traditional llaüt boat in Mallorca",
    title: "Traditional Sailing",
    description: "Experience authentic Mallorcan sailing culture"
  },
  {
    url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=2070&auto=format&fit=crop",
    alt: "Underwater view of Mediterranean sea life",
    title: "Marine Paradise",
    description: "Explore the rich underwater world of the Balearic Sea"
  },
  {
    url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=2070&auto=format&fit=crop",
    alt: "Sa Calobra beach with dramatic cliffs",
    title: "Sa Calobra",
    description: "Adventure to one of Mallorca's most spectacular beaches"
  },
  {
    url: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2070&auto=format&fit=crop",
    alt: "Catamaran cruising along Mallorca coast",
    title: "Catamaran Dreams",
    description: "Sail the Mediterranean in ultimate comfort and style"
  }
]

export default function MallorcaCarouselDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <MallorcaImageCarousel
          images={additionalMallorcaImages}
          className="h-full"
          interval={4000}
          parallaxEffect={true}
          overlayGradient={true}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="z-10 px-4 text-center text-white">
            <h1 className="mb-4 text-5xl font-bold md:text-7xl">
              Mallorca Image Carousel
            </h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">
              A modern, accessible component library for stunning visual
              experiences
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Waves className="mr-2 size-4" />
                Beach Themed
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Sailboat className="mr-2 size-4" />
                Sea & Boats
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Sparkles className="mr-2 size-4" />
                Accessible
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Component Features</h2>
          <p className="text-xl text-gray-600">
            Built with modern web standards and accessibility in mind
          </p>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card className="border-pink-200 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-5 text-pink-500" />
                Beautiful Imagery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Curated collection of high-quality Mallorca beach, sea, and boat
                images with proper alt text for accessibility.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="size-5 text-blue-500" />
                Modern Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Parallax effects, keyboard navigation, fullscreen mode, touch
                gestures, and smooth animations powered by Framer Motion.
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-yellow-500" />
                Accessibility First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                WCAG AAA compliant with proper ARIA labels, keyboard navigation,
                screen reader announcements, and reduced motion support.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Variations */}
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="minimal">Minimal</TabsTrigger>
            <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Default Configuration</CardTitle>
                <CardDescription>
                  Full-featured carousel with all controls and effects enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-hidden rounded-lg">
                  <MallorcaImageCarousel />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="minimal" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Minimal Configuration</CardTitle>
                <CardDescription>
                  Simple carousel with basic functionality using
                  SimpleImageCarousel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-hidden rounded-lg">
                  <SimpleImageCarousel />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thumbnails" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>With Thumbnails</CardTitle>
                <CardDescription>
                  Carousel with thumbnail navigation for quick image selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] overflow-hidden rounded-lg">
                  <MallorcaImageCarousel
                    showThumbnails={true}
                    images={additionalMallorcaImages}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Custom Styled</CardTitle>
                <CardDescription>
                  Carousel with custom styling and disabled features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-hidden rounded-3xl shadow-2xl">
                  <MallorcaImageCarousel
                    images={additionalMallorcaImages}
                    autoPlay={false}
                    showIndicators={false}
                    parallaxEffect={false}
                    overlayGradient={false}
                    className="rounded-3xl"
                    imageClassName="saturate-150"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Code Examples */}
        <div className="mt-16">
          <h3 className="mb-6 text-2xl font-bold">Usage Examples</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">
                  <code className="text-sm">{`import { MallorcaImageCarousel } from '@/components/ui/mallorca-image-carousel'

// Default carousel with Mallorca images
<MallorcaImageCarousel />

// With custom images
<MallorcaImageCarousel 
  images={customImages}
  interval={3000}
/>`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">
                  <code className="text-sm">{`<MallorcaImageCarousel
  images={images}
  autoPlay={true}
  interval={5000}
  showThumbnails={true}
  enableFullscreen={true}
  parallaxEffect={true}
  soundEffects={true}
  className="custom-class"
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg">
          <h3 className="mb-6 text-2xl font-bold">Component Features</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="mb-2 font-semibold text-pink-600">
                Visual Features
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Smooth fade transitions with Framer Motion</li>
                <li>✓ Parallax mouse movement effects</li>
                <li>✓ Gradient overlays for text readability</li>
                <li>✓ Image preloading for performance</li>
                <li>✓ Responsive image sizing with Next.js Image</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="mb-2 font-semibold text-blue-600">
                Accessibility
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Full keyboard navigation (arrows, space, F, Esc)</li>
                <li>✓ Screen reader announcements</li>
                <li>✓ Proper ARIA labels and roles</li>
                <li>✓ Focus management and indicators</li>
                <li>✓ Respects prefers-reduced-motion</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="mb-2 font-semibold text-yellow-600">Controls</h4>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Play/pause autoplay functionality</li>
                <li>✓ Previous/next navigation buttons</li>
                <li>✓ Dot indicators with direct navigation</li>
                <li>✓ Thumbnail strip navigation</li>
                <li>✓ Fullscreen mode support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="mb-2 font-semibold text-green-600">
                Customization
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Custom image sets with metadata</li>
                <li>✓ Configurable autoplay interval</li>
                <li>✓ Optional sound effects</li>
                <li>✓ Flexible styling with className props</li>
                <li>✓ Toggle individual features on/off</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
