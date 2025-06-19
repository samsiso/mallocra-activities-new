import {
  Waves,
  Mountain,
  Building,
  Moon,
  Users,
  MapPin,
  Utensils,
  Car,
  LucideIcon
} from "lucide-react"
import { CategoryData } from "../_components/enhanced-category-card"

export const categoriesData: CategoryData[] = [
  {
    id: "water_sports",
    title: "Water Sports",
    description:
      "Dive into crystal-clear Mediterranean waters with our premium water sports collection. From luxury yacht charters to thrilling jet ski adventures.",
    shortDescription:
      "Premium aquatic adventures in Mallorca's pristine waters",
    slug: "water-sports",
    icon: Waves,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#0ea5e9", // sky-500
      to: "#0284c7" // sky-600
    },
    averagePrice: 65,
    features: [
      "Professional equipment included",
      "Certified instructors",
      "Small group experiences",
      "Safety-first approach"
    ],
    href: "/activities?category=water_sports"
  },
  {
    id: "land_adventures",
    title: "Land Adventures",
    description:
      "Explore Mallorca's dramatic landscapes through hiking trails, mountain biking, and off-road adventures that showcase the island's natural beauty.",
    shortDescription:
      "Discover hidden trails and mountain peaks across the island",
    slug: "land-adventures",
    icon: Mountain,
    imageUrl:
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#22c55e", // green-500
      to: "#16a34a" // green-600
    },
    averagePrice: 45,
    features: [
      "Expert local guides",
      "All fitness levels welcome",
      "Stunning photo opportunities",
      "Traditional lunch included"
    ],
    href: "/activities?category=land_adventures"
  },
  {
    id: "cultural",
    title: "Cultural Experiences",
    description:
      "Immerse yourself in Mallorca's rich history and vibrant culture through guided tours of historic sites, museums, and authentic local experiences.",
    shortDescription: "Authentic cultural immersion with local historians",
    slug: "cultural",
    icon: Building,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#a855f7", // purple-500
      to: "#9333ea" // purple-600
    },
    averagePrice: 35,
    features: [
      "UNESCO World Heritage sites",
      "Local artisan workshops",
      "Historical storytelling",
      "Traditional tapas tours"
    ],
    href: "/activities?category=cultural"
  },
  {
    id: "food_wine",
    title: "Food & Wine",
    description:
      "Savor Mallorca's culinary delights through wine tastings, cooking classes, and gourmet food tours featuring the island's finest flavors.",
    shortDescription: "Culinary adventures with award-winning local chefs",
    slug: "food-wine",
    icon: Utensils,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#dc2626", // red-600
      to: "#b91c1c" // red-700
    },
    averagePrice: 85,
    features: [
      "Michelin-starred restaurants",
      "Organic wine estates",
      "Farm-to-table experiences",
      "Professional sommelier guidance"
    ],
    href: "/activities?category=food_wine"
  },
  {
    id: "nightlife",
    title: "Nightlife & Entertainment",
    description:
      "Experience Mallorca's legendary nightlife scene with exclusive access to beach clubs, sunset boat parties, and VIP entertainment venues.",
    shortDescription: "Premium nightlife experiences and sunset celebrations",
    slug: "nightlife",
    icon: Moon,
    imageUrl:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#ec4899", // pink-500
      to: "#db2777" // pink-600
    },
    averagePrice: 95,
    features: [
      "VIP club access",
      "Sunset boat parties",
      "Premium cocktail experiences",
      "Celebrity DJ performances"
    ],
    href: "/activities?category=nightlife"
  },
  {
    id: "family_fun",
    title: "Family Adventures",
    description:
      "Create unforgettable family memories with our specially designed activities suitable for all ages, from beach games to educational tours.",
    shortDescription: "Safe, fun activities perfect for families with children",
    slug: "family-fun",
    icon: Users,
    imageUrl:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    gradient: {
      from: "#f59e0b", // amber-500
      to: "#d97706" // amber-600
    },
    averagePrice: 40,
    features: [
      "Child-friendly activities",
      "Educational experiences",
      "Safety-certified equipment",
      "Family group discounts"
    ],
    href: "/activities?category=family_fun"
  }
]

// Helper function to get category by ID
export const getCategoryById = (id: string): CategoryData | undefined => {
  return categoriesData.find(cat => cat.id === id)
}

// Helper function to get category activity count (placeholder for now)
export const getCategoryActivityCount = async (
  categoryId: string
): Promise<number> => {
  // This will be replaced with actual database calls
  const mockCounts: Record<string, number> = {
    water_sports: 24,
    land_adventures: 18,
    cultural: 15,
    food_wine: 12,
    nightlife: 8,
    family_fun: 22
  }

  return mockCounts[categoryId] || 0
}
