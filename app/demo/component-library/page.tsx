"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookingCardEnhanced,
  BookingFlowWizard,
  AvailabilityCalendar,
  defaultBookingSteps
} from "@/components/booking/enhanced"
import {
  BlogCardEnhanced,
  BlogContentViewer,
  BlogSearchFilter
} from "@/components/blog/enhanced"
import { designTokens } from "@/components/design-system"
import { Calendar, Users, CreditCard, CheckCircle } from "lucide-react"

// Sample data for demos
const sampleBookingData = {
  title: "Sunset Sailing Adventure",
  description:
    "Experience the magic of Mallorca's coastline as the sun sets over the Mediterranean",
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  time: "18:30",
  participants: 2,
  location: "Port de Sóller",
  price: 85,
  originalPrice: 100,
  status: "limited" as const,
  spotsLeft: 3,
  isInstantBooking: true,
  hasInsurance: true
}

const sampleAvailability = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() + i)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const isPopular = isWeekend && Math.random() > 0.5

  return {
    date,
    available: Math.random() > 0.2,
    spots: Math.floor(Math.random() * 20) + 1,
    minPrice: isWeekend ? 95 : 85,
    isPopular,
    timeSlots: [
      { time: "09:00", available: true, spots: 8, price: 85 },
      { time: "11:30", available: true, spots: 5, price: 85 },
      { time: "14:00", available: Math.random() > 0.3, spots: 2, price: 95 },
      { time: "16:30", available: true, spots: 10, price: 95 },
      { time: "18:30", available: Math.random() > 0.2, spots: 3, price: 105 }
    ]
  }
})

const sampleBlogPost = {
  id: "1",
  title: "Top 10 Hidden Beaches in Mallorca You Must Visit",
  excerpt:
    "Discover the secret coves and pristine beaches that only locals know about. From crystal-clear waters to dramatic cliffs, these hidden gems will take your breath away.",
  slug: "hidden-beaches-mallorca",
  featuredImage: "/api/placeholder/800/600",
  author: {
    name: "Maria Santos",
    avatar: "/api/placeholder/100/100",
    bio: "Travel writer and Mallorca local sharing the best of the island"
  },
  publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  readingTime: 8,
  category: {
    name: "Destinations",
    slug: "destination"
  },
  tags: ["beaches", "hidden-gems", "summer", "swimming"],
  viewCount: 15234,
  likeCount: 892,
  commentCount: 45,
  isPopular: true
}

const sampleBlogContent = `
<h2>Introduction to Mallorca's Secret Beaches</h2>
<p>While millions of tourists flock to Mallorca's famous beaches every summer, the island still holds many secrets. These hidden beaches, known mostly to locals, offer a more authentic and peaceful experience.</p>

<h2>1. Cala Varques - The Adventurer's Paradise</h2>
<p>Located on the east coast, Cala Varques requires a 20-minute walk through private land, but the journey is worth it. This pristine beach features turquoise waters, white sand, and impressive caves perfect for exploration.</p>

<h3>How to Get There</h3>
<p>Park near the Cuevas del Drach and follow the coastal path. The walk is moderately challenging but suitable for most fitness levels.</p>

<h2>2. Es Caragol - The Southern Gem</h2>
<p>Mallorca's southernmost beach is a protected natural area accessible only by foot or bicycle. The 30-minute walk from Ses Salines lighthouse rewards visitors with untouched dunes and crystal-clear waters.</p>

<h3>Best Time to Visit</h3>
<p>Early morning or late afternoon to avoid the heat and enjoy the spectacular sunrises or sunsets.</p>

<h2>Essential Tips for Beach Explorers</h2>
<ul>
  <li>Always bring water and sun protection</li>
  <li>Respect private property and protected areas</li>
  <li>Leave no trace - take your rubbish with you</li>
  <li>Check weather conditions before visiting remote beaches</li>
</ul>
`

const sampleCategories = [
  { id: "1", name: "Travel Guides", slug: "guide", count: 45 },
  { id: "2", name: "Tips & Tricks", slug: "tips", count: 32 },
  { id: "3", name: "Destinations", slug: "destination", count: 28 },
  { id: "4", name: "Activities", slug: "activity", count: 56 },
  { id: "5", name: "Events", slug: "event", count: 19 }
]

const sampleTags = [
  "beaches",
  "hiking",
  "culture",
  "food",
  "adventure",
  "family",
  "romantic",
  "budget",
  "luxury",
  "photography"
]

const sampleAuthors = [
  { id: "1", name: "Maria Santos", postCount: 23 },
  { id: "2", name: "James Wilson", postCount: 18 },
  { id: "3", name: "Anna Schmidt", postCount: 31 },
  { id: "4", name: "Carlos Ruiz", postCount: 12 }
]

// Custom booking step components
const DateSelectionStep = () => (
  <div className="space-y-4">
    <p className="text-gray-600">
      Choose your preferred date and time for the activity.
    </p>
    <AvailabilityCalendar
      availableDates={sampleAvailability}
      showPricing
      showTimeSlots
    />
  </div>
)

const ParticipantsStep = () => (
  <div className="space-y-4">
    <p className="text-gray-600">
      Select the number of participants for your booking.
    </p>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {["Adults", "Children", "Infants"].map(type => (
        <div
          key={type}
          className="rounded-xl border border-white/20 bg-white/10 p-4"
        >
          <h4 className="mb-2 font-medium">{type}</h4>
          <div className="flex items-center gap-3">
            <button className="size-8 rounded-lg bg-pink-500 text-white hover:bg-pink-600">
              -
            </button>
            <span className="w-12 text-center font-semibold">0</span>
            <button className="size-8 rounded-lg bg-pink-500 text-white hover:bg-pink-600">
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const PaymentStep = () => (
  <div className="space-y-4">
    <p className="text-gray-600">Complete your booking with secure payment.</p>
    <div className="rounded-xl border border-white/20 bg-white/10 p-6">
      <h4 className="mb-4 font-medium">Payment Summary</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>€170.00</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-€30.00</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>€140.00</span>
        </div>
      </div>
    </div>
  </div>
)

const ConfirmationStep = () => (
  <div className="space-y-4 text-center">
    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-500">
      <CheckCircle className="size-12 text-white" />
    </div>
    <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
    <p className="text-gray-600">
      Your booking reference is{" "}
      <span className="font-mono font-bold">MAL-2024-0123</span>
    </p>
    <p className="text-sm text-gray-500">
      We've sent a confirmation email with all the details.
    </p>
  </div>
)

export default function ComponentLibraryDemo() {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [activeSection, setActiveSection] = useState<"booking" | "blog">(
    "booking"
  )

  const customBookingSteps = [
    {
      id: "select",
      title: "Select Date & Time",
      description: "Choose when you want to experience this activity",
      icon: <Calendar className="size-6 text-pink-600" />,
      component: <DateSelectionStep />
    },
    {
      id: "participants",
      title: "Participants",
      description: "How many people will be joining?",
      icon: <Users className="size-6 text-pink-600" />,
      component: <ParticipantsStep />
    },
    {
      id: "payment",
      title: "Payment",
      description: "Secure payment processing",
      icon: <CreditCard className="size-6 text-pink-600" />,
      component: <PaymentStep />
    },
    {
      id: "confirmation",
      title: "Confirmation",
      description: "Your booking is complete!",
      icon: <CheckCircle className="size-6 text-pink-600" />,
      component: <ConfirmationStep />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              21st.dev Component Library
            </h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              Modern, accessible, and performant UI components for the Mallorca
              Activities platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveSection("booking")}
              className={`border-b-2 px-2 py-4 font-medium transition-colors duration-300 ${
                activeSection === "booking"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Booking Components
            </button>
            <button
              onClick={() => setActiveSection("blog")}
              className={`border-b-2 px-2 py-4 font-medium transition-colors duration-300 ${
                activeSection === "blog"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Blog Components
            </button>
          </div>
        </div>
      </div>

      {/* Component Sections */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {activeSection === "booking" ? (
          <div className="space-y-16">
            {/* Booking Card Section */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Booking Cards</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Standard Card</h3>
                  <BookingCardEnhanced
                    {...sampleBookingData}
                    variant="standard"
                    onBook={() => console.log("Book clicked")}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Featured Card</h3>
                  <BookingCardEnhanced
                    {...sampleBookingData}
                    variant="featured"
                    status="available"
                    onBook={() => console.log("Book clicked")}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Compact Card</h3>
                  <BookingCardEnhanced
                    {...sampleBookingData}
                    variant="compact"
                    status="soldout"
                    onBook={() => console.log("Book clicked")}
                  />
                </div>
              </div>
            </section>

            {/* Booking Flow Wizard */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Booking Flow Wizard</h2>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <BookingFlowWizard
                  steps={customBookingSteps}
                  onComplete={() => console.log("Booking completed")}
                />
              </div>
            </section>

            {/* Availability Calendar */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Availability Calendar</h2>
              <div className="mx-auto max-w-2xl">
                <AvailabilityCalendar
                  availableDates={sampleAvailability}
                  onDateSelect={date => console.log("Date selected:", date)}
                  onTimeSelect={time => console.log("Time selected:", time)}
                  showPricing
                  showTimeSlots
                />
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Blog Search & Filter */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Blog Search & Filter</h2>
              <BlogSearchFilter
                categories={sampleCategories}
                tags={sampleTags}
                authors={sampleAuthors}
                currentView={currentView}
                onSearch={q => console.log("Search:", q)}
                onCategoryChange={c => console.log("Category:", c)}
                onTagChange={t => console.log("Tags:", t)}
                onViewChange={setCurrentView}
              />
            </section>

            {/* Blog Cards */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Blog Cards</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Standard Card</h3>
                  <BlogCardEnhanced
                    {...sampleBlogPost}
                    variant="standard"
                    onLike={() => console.log("Liked")}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Featured Card</h3>
                  <BlogCardEnhanced
                    {...sampleBlogPost}
                    variant="featured"
                    onLike={() => console.log("Liked")}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Compact Card</h3>
                  <BlogCardEnhanced
                    {...sampleBlogPost}
                    variant="compact"
                    onLike={() => console.log("Liked")}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">Horizontal Card</h3>
                <BlogCardEnhanced
                  {...sampleBlogPost}
                  variant="horizontal"
                  onLike={() => console.log("Liked")}
                />
              </div>
            </section>

            {/* Blog Content Viewer */}
            <section>
              <h2 className="mb-8 text-3xl font-bold">Blog Content Viewer</h2>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <BlogContentViewer
                  title={sampleBlogPost.title}
                  content={sampleBlogContent}
                  author={sampleBlogPost.author}
                  publishedAt={sampleBlogPost.publishedAt}
                  readingTime={sampleBlogPost.readingTime}
                  category={sampleBlogPost.category}
                  tags={sampleBlogPost.tags}
                  viewCount={sampleBlogPost.viewCount}
                  likeCount={sampleBlogPost.likeCount}
                  commentCount={sampleBlogPost.commentCount}
                  featuredImage={sampleBlogPost.featuredImage}
                  onShare={() => console.log("Shared")}
                  onBookmark={() => console.log("Bookmarked")}
                  onLike={() => console.log("Liked")}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Design Tokens Preview */}
      <section className="mt-24 bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-3xl font-bold">Design System Tokens</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Colors */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Brand Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-lg"
                    style={{ backgroundColor: designTokens.colors.brand.pink }}
                  />
                  <div>
                    <p className="font-mono text-sm">brand.pink</p>
                    <p className="text-xs opacity-70">
                      {designTokens.colors.brand.pink}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-lg"
                    style={{
                      backgroundColor: designTokens.colors.brand.yellow
                    }}
                  />
                  <div>
                    <p className="font-mono text-sm">brand.yellow</p>
                    <p className="text-xs opacity-70">
                      {designTokens.colors.brand.yellow}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Typography Scale</h3>
              <div className="space-y-2">
                {Object.entries(designTokens.typography.fontSize)
                  .slice(0, 5)
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="font-mono text-sm opacity-70">{key}</p>
                      <p style={{ fontSize: value }}>The quick brown fox</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Spacing Scale</h3>
              <div className="space-y-2">
                {Object.entries(designTokens.spacing)
                  .slice(0, 8)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div
                        className="bg-pink-500"
                        style={{ width: value, height: "24px" }}
                      />
                      <span className="font-mono text-sm">
                        {key}: {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
