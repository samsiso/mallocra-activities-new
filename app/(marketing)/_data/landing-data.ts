/*
<ai_context>
Centralized data for the landing page components.
All data objects extracted from the main landing page for better maintainability.
</ai_context>
*/

// Background images for the hero slider
export const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    alt: "Beautiful Mallorca coastline with crystal clear waters"
  },
  {
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    alt: "Serra de Tramuntana mountain landscapes"
  },
  {
    url: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?q=80&w=2070&auto=format&fit=crop",
    alt: "Palma Cathedral and historic old town"
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    alt: "Magical sunset over Mallorca waters"
  },
  {
    url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
    alt: "Adventure activities and sailing in Mallorca"
  }
]

// Live activity feed data
export const liveActivities = [
  {
    id: 1,
    name: "Sarah from London",
    activity: "Catamaran Sunset Cruise",
    time: "2 mins ago",
    flag: "🇬🇧"
  },
  {
    id: 2,
    name: "Marco from Italy",
    activity: "Serra de Tramuntana Hiking",
    time: "5 mins ago",
    flag: "🇮🇹"
  },
  {
    id: 3,
    name: "Emma from Germany",
    activity: "Palma Old Town Tour",
    time: "8 mins ago",
    flag: "🇩🇪"
  },
  {
    id: 4,
    name: "Sophie from France",
    activity: "Catamaran Sunset Cruise",
    time: "12 mins ago",
    flag: "🇫🇷"
  },
  {
    id: 5,
    name: "James from Australia",
    activity: "Serra de Tramuntana Hiking",
    time: "15 mins ago",
    flag: "🇦🇺"
  }
]

// Instagram gallery photos
export const instagramPhotos = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759844-d150baec4168?q=80&w=400&auto=format&fit=crop"
]

// Featured activities data (this should come from database in real app)
export const featuredActivities = [
  {
    id: 1,
    title: "Catamaran Sunset Cruise",
    category: "Water Sports",
    location: "Palma Bay",
    duration: "3 hours",
    price: 85,
    rating: 4.9,
    reviews: 324,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
    isHot: true,
    availability: ["2024-12-28", "2024-12-29", "2024-12-30"]
  },
  {
    id: 2,
    title: "Serra de Tramuntana Hiking",
    category: "Adventure",
    location: "Tramuntana Mountains",
    duration: "6 hours",
    price: 65,
    rating: 4.8,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    availability: ["2024-12-27", "2024-12-28", "2024-12-31"]
  },
  {
    id: 3,
    title: "Palma Old Town Walking Tour",
    category: "Cultural",
    location: "Palma de Mallorca",
    duration: "2.5 hours",
    price: 35,
    rating: 4.7,
    reviews: 256,
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=800&auto=format&fit=crop",
    availability: ["2024-12-26", "2024-12-27", "2024-12-28", "2024-12-29"]
  }
]

// Enhanced testimonials with video support
export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "London, UK",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    review:
      "Absolutely incredible experience! The catamaran sunset cruise was magical, and our guide Marco was fantastic. We'll definitely be booking again next year!",
    activity: "Catamaran Sunset Cruise",
    hasVideo: true,
    videoUrl: "https://vimeo.com/76979871" // Sample video URL
  },
  {
    id: 2,
    name: "Michael Weber",
    location: "Berlin, Germany",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    review:
      "The hiking tour in Tramuntana was breathtaking. Perfect organization, beautiful routes, and amazing views. Highly recommend We Are Excursions!",
    activity: "Serra de Tramuntana Hiking",
    hasVideo: false
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "Manchester, UK",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    review:
      "Professional service from start to finish. The cultural tour gave us insights into Mallorca we never would have discovered on our own. Outstanding!",
    activity: "Palma Cultural Tour",
    hasVideo: true,
    videoUrl: "https://vimeo.com/76979871" // Sample video URL
  }
]

// Weather data (in real app, this would come from API)
export const weatherData = {
  location: "Palma, Mallorca",
  temperature: 22,
  condition: "sunny" as const,
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: "Today", high: 22, low: 16, condition: "sunny" as const },
    { day: "Tomorrow", high: 24, low: 18, condition: "partly-cloudy" as const },
    { day: "Thu", high: 21, low: 15, condition: "rainy" as const }
  ]
}

// Trust & Recognition awards data
export const trustAwards = [
  {
    icon: "Award",
    title: "TripAdvisor Excellence",
    subtitle: "2024 Winner",
    color: "text-yellow-500"
  },
  {
    icon: "Star",
    title: "Lonely Planet",
    subtitle: "Recommended",
    color: "text-orange-500"
  },
  {
    icon: "Heart",
    title: "Travel + Leisure",
    subtitle: "Top Pick",
    color: "text-red-500"
  },
  {
    icon: "CheckCircle",
    title: "Conde Nast",
    subtitle: "Traveler Award",
    color: "text-green-500"
  }
]

// Trust badges data
export const trustBadges = [
  {
    icon: "Shield",
    text: "100% Secure Booking",
    color: "text-blue-600"
  },
  {
    icon: "CheckCircle",
    text: "Verified Reviews",
    color: "text-green-600"
  },
  {
    icon: "Zap",
    text: "Instant Confirmation",
    color: "text-yellow-600"
  },
  {
    icon: "Heart",
    text: "24/7 Support",
    color: "text-red-600"
  }
]

// Newsletter benefits data
export const newsletterBenefits = [
  {
    icon: "Zap",
    title: "Early Access",
    description: "Be first to book new activities",
    color: "text-yellow-500"
  },
  {
    icon: "Heart",
    title: "Exclusive Deals",
    description: "Member-only discounts up to 30%",
    color: "text-red-500"
  },
  {
    icon: "Globe",
    title: "Insider Tips",
    description: "Local secrets & hidden gems",
    color: "text-blue-500"
  }
]

// Destination showcase data
export const destinations = [
  {
    title: "Crystal Clear Waters",
    description:
      "Pristine beaches with turquoise waters perfect for swimming and water sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    activities: "24"
  },
  {
    title: "Rich History",
    description:
      "Explore ancient landmarks, Gothic cathedrals, and charming historic districts",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=800&auto=format&fit=crop",
    activities: "18"
  },
  {
    title: "Mountain Adventures",
    description:
      "Hiking trails with breathtaking views and outdoor adventures in the Tramuntana",
    image:
      "https://images.unsplash.com/photo-1464822759844-d150baec4168?q=80&w=800&auto=format&fit=crop",
    activities: "12"
  }
]

// Map location pins data
export const mapPins = [
  {
    x: "25%",
    y: "40%",
    activity: "Palma Tours",
    count: 45
  },
  {
    x: "60%",
    y: "20%",
    activity: "Mountain Hiking",
    count: 23
  },
  {
    x: "80%",
    y: "60%",
    activity: "Beach Activities",
    count: 67
  },
  {
    x: "40%",
    y: "70%",
    activity: "Water Sports",
    count: 34
  }
]

// Hero stats data
export const heroStats = [
  {
    icon: "Users",
    number: 50000,
    suffix: "+",
    label: "Happy Travelers",
    color: "text-blue-400"
  },
  {
    icon: "Star",
    number: 4.9,
    suffix: "/5",
    label: "Average Rating",
    color: "text-yellow-400"
  },
  {
    icon: "Activity",
    number: 200,
    suffix: "+",
    label: "Unique Activities",
    color: "text-purple-400"
  },
  {
    icon: "Award",
    number: 15,
    suffix: "+",
    label: "Years Experience",
    color: "text-orange-400"
  }
]
