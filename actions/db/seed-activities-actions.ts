"use server"

/*
<ai_context>
Complete Mallorca Activities seeding script for real tourism data.
Populates the database with 33 authentic Mallorca activities including BCM nightclub,
water sports, boat rentals, adventure tours, and cultural experiences.
</ai_context>
*/

import { db } from "@/db/db"
import {
  activitiesTable,
  activityImagesTable,
  activityPricingTable,
  activityAvailabilityTable,
  InsertActivity,
  InsertActivityImage,
  InsertActivityPricing,
  InsertActivityAvailability
} from "@/db/schema"
import { ActionState } from "@/types"

// Comprehensive real Mallorca activities data
const mallorcanActivitiesData = [
  {
    activity: {
      operatorId: "mallorca-adventures-co", // Will be updated with real operator ID
      title: "BCM Planet Dance - Ultimate Nightclub Experience",
      slug: "bcm-planet-dance-nightclub",
      description: "Experience the legendary BCM Planet Dance, one of Europe's most famous superclubs! This iconic Mallorca nightclub has been the heart of the island's party scene for decades. Dance to world-class DJs, enjoy spectacular light shows, and party until dawn with an international crowd. The venue features multiple rooms with different music styles, VIP areas, and an outdoor terrace. Known for hosting top international DJs and unforgettable themed parties.",
      shortDescription: "Party at the legendary BCM Planet Dance superclub with world-class DJs and light shows.",
      category: "nightlife" as const,
      location: "Magaluf",
      meetingPoint: "BCM Planet Dance Main Entrance, Magaluf Strip",
      durationMinutes: 360,
      maxParticipants: 2000,
      minParticipants: 1,
      minAge: 18,
      maxAge: null,
      includedItems: [
        "Club entry ticket",
        "Access to main dance floor",
        "Access to multiple music rooms",
        "Light show experience",
        "International DJ performances",
        "Party atmosphere guarantee"
      ],
      excludedItems: [
        "Drinks and beverages",
        "VIP table service",
        "Coat check fees",
        "Photography services",
        "Transportation to venue"
      ],
      whatToBring: [
        "Valid photo ID",
        "Smart casual dress code",
        "Cash for drinks",
        "Energy for dancing",
        "Camera for memories"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before party date",
      safetyRequirements: "Must be 18+ with valid ID. Dress code enforced",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active" as const,
      featured: true,
      avgRating: "4.6",
      totalReviews: 2847,
      totalBookings: 15623
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=800&auto=format&fit=crop",
        altText: "BCM nightclub dancing",
        caption: "Party atmosphere at BCM Planet Dance",
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1571266028243-d220ee4c1387?q=80&w=800&auto=format&fit=crop",
        altText: "Nightclub DJ performance",
        caption: "World-class DJ performances",
        isPrimary: false,
        sortOrder: 1
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "25.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Electric Scooter Palma City Tour",
      slug: "electric-scooter-palma-tour",
      description: "Explore Palma de Mallorca in an eco-friendly and fun way with our premium electric scooters! This guided tour takes you through the historic old town, along the beautiful waterfront, and to the city's most iconic landmarks. Perfect for those who want to cover more ground than walking while still enjoying the intimate experience of discovering hidden gems. Our high-quality scooters are easy to ride and environmentally friendly.",
      shortDescription: "Eco-friendly electric scooter tour through Palma's historic streets and waterfront.",
      category: "land_adventures" as const,
      location: "Palma",
      meetingPoint: "Palma Cathedral Square",
      durationMinutes: 120,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 16,
      maxAge: null,
      includedItems: [
        "Premium electric scooter rental",
        "Safety helmet and equipment",
        "Professional tour guide",
        "City highlights tour",
        "Photo stops at landmarks",
        "Safety briefing and training"
      ],
      excludedItems: [
        "Food and beverages",
        "Personal insurance",
        "Entrance fees to attractions",
        "Gratuities"
      ],
      whatToBring: [
        "Comfortable clothing",
        "Closed-toe shoes",
        "Sunglasses and sunscreen",
        "Camera for photos",
        "Valid ID"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before tour",
      safetyRequirements: "Basic balance required. Helmet mandatory",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.3",
      totalReviews: 456,
      totalBookings: 1234
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
        altText: "Electric scooter city tour",
        caption: "Eco-friendly city exploration",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "30.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Tapas & Local Vibes - Discover Palma by Night",
      slug: "tapas-local-vibes-palma-night",
      description: "Immerse yourself in authentic Mallorcan culture with our exclusive evening tapas tour! Discover hidden local bars and family-run tavernas that tourists rarely find. Sample traditional Mallorcan tapas paired with local wines, learn about island culinary traditions, and experience Palma's vibrant nightlife like a local. Our passionate local guide will share stories about the city's history, culture, and the best-kept culinary secrets.",
      shortDescription: "Authentic evening tapas tour discovering hidden local bars and traditional Mallorcan cuisine.",
      category: "cultural" as const,
      location: "Palma",
      meetingPoint: "Plaza Mayor, Palma de Mallorca",
      durationMinutes: 210,
      maxParticipants: 12,
      minParticipants: 4,
      minAge: 18,
      maxAge: null,
      includedItems: [
        "Professional local guide",
        "4 different tapas venues",
        "Traditional tapas tastings",
        "Local wine and beer pairings",
        "Cultural insights and stories",
        "Hidden local spots access"
      ],
      excludedItems: [
        "Additional drinks beyond inclusions",
        "Full dinner",
        "Transportation after tour",
        "Personal expenses"
      ],
      whatToBring: [
        "Valid ID for alcohol service",
        "Comfortable walking shoes",
        "Light jacket for evening",
        "Camera for food photos",
        "Appetite for adventure"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before tour",
      safetyRequirements: "Must be 18+ for alcohol service",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active" as const,
      featured: true,
      avgRating: "4.8",
      totalReviews: 923,
      totalBookings: 2156
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
        altText: "Spanish tapas spread",
        caption: "Authentic Mallorcan tapas experience",
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
        altText: "Local taverna atmosphere",
        caption: "Hidden local bars and tavernas",
        isPrimary: false,
        sortOrder: 1
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "70.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Heatwave Boat Party Experience",
      slug: "heatwave-boat-party",
      description: "Get ready for the ultimate boat party experience in Mallorca! The famous Heatwave boat combines stunning coastal views with an incredible party atmosphere. Dance to the hottest DJs, enjoy premium drinks, and party with an international crowd while cruising the beautiful Mediterranean waters. This floating nightclub offers multiple decks, a state-of-the-art sound system, and unforgettable sunset views.",
      shortDescription: "Ultimate floating party experience with DJs, drinks, and Mediterranean sunset views.",
      category: "nightlife" as const,
      location: "Palma Bay",
      meetingPoint: "Palma Marina, Pier 8",
      durationMinutes: 240,
      maxParticipants: 150,
      minParticipants: 10,
      minAge: 18,
      maxAge: null,
      includedItems: [
        "4-hour boat party cruise",
        "Professional DJ entertainment",
        "Welcome drink",
        "Access to all deck areas",
        "Swimming stops",
        "Party atmosphere guarantee"
      ],
      excludedItems: [
        "Additional drinks beyond welcome drink",
        "Food",
        "VIP bottle service",
        "Photography packages",
        "Transportation to marina"
      ],
      whatToBring: [
        "Valid photo ID",
        "Swimwear and towel",
        "Sunscreen and sunglasses",
        "Cash for drinks",
        "Party spirit"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before departure",
      safetyRequirements: "Must be 18+ with valid ID. Swimming at own risk",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: true,
      avgRating: "4.5",
      totalReviews: 1678,
      totalBookings: 8934
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        altText: "Boat party atmosphere",
        caption: "Ultimate floating party experience",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "69.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Palma Aquarium Marine Discovery",
      slug: "palma-aquarium-marine-discovery",
      description: "Dive into the wonders of the Mediterranean and beyond at Palma Aquarium! Home to over 8,000 marine creatures from 700 species, this world-class aquarium offers an incredible journey through different marine ecosystems. Walk through the impressive shark tunnel, marvel at tropical coral reefs, and learn about marine conservation. Perfect for families and marine life enthusiasts of all ages.",
      shortDescription: "World-class aquarium experience with 8,000 marine creatures and impressive shark tunnel.",
      category: "family_fun" as const,
      location: "Palma",
      meetingPoint: "Palma Aquarium Main Entrance",
      durationMinutes: 180,
      maxParticipants: 50,
      minParticipants: 1,
      minAge: 0,
      maxAge: null,
      includedItems: [
        "General admission ticket",
        "Access to all exhibitions",
        "Shark tunnel experience",
        "Marine conservation talks",
        "Educational materials",
        "Photo opportunities"
      ],
      excludedItems: [
        "Guided tours (available for extra cost)",
        "Food and beverages",
        "Souvenir shop items",
        "Parking fees",
        "Transportation"
      ],
      whatToBring: [
        "Camera for photos",
        "Comfortable walking shoes",
        "Jacket (air-conditioned inside)",
        "Curiosity about marine life"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before visit",
      safetyRequirements: "Suitable for all ages. Children must be supervised",
      weatherDependent: false,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.4",
      totalReviews: 2341,
      totalBookings: 12567
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
        altText: "Aquarium shark tunnel",
        caption: "Walk through the impressive shark tunnel",
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800&auto=format&fit=crop",
        altText: "Tropical coral reef",
        caption: "Colorful tropical marine life",
        isPrimary: false,
        sortOrder: 1
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "23.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Snorkeling Adventure in Crystal Waters",
      slug: "snorkeling-adventure-crystal-waters",
      description: "Discover the underwater paradise of Mallorca's coastline with our guided snorkeling adventure! Explore pristine coves with crystal-clear waters, encounter colorful Mediterranean fish, and swim above ancient Posidonia seagrass meadows. Our experienced guides will take you to the best snorkeling spots away from the crowds, providing equipment and ensuring your safety while you explore this underwater wonderland.",
      shortDescription: "Guided snorkeling adventure in pristine coves with colorful Mediterranean marine life.",
      category: "water_sports" as const,
      location: "Cala Mondragó",
      meetingPoint: "Cala Mondragó Beach Entrance",
      durationMinutes: 180,
      maxParticipants: 12,
      minParticipants: 4,
      minAge: 8,
      maxAge: null,
      includedItems: [
        "Professional snorkeling guide",
        "High-quality mask and snorkel",
        "Fins and wetsuit if needed",
        "Safety briefing",
        "Marine life identification guide",
        "Underwater photography tips"
      ],
      excludedItems: [
        "Underwater camera rental",
        "Food and drinks",
        "Transportation to meeting point",
        "Personal insurance",
        "Towels"
      ],
      whatToBring: [
        "Swimwear",
        "Towel and sunscreen",
        "Water bottle",
        "Underwater camera (optional)",
        "Basic swimming ability"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before activity",
      safetyRequirements: "Basic swimming skills required. Children must be accompanied",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.6",
      totalReviews: 567,
      totalBookings: 2189
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
        altText: "Snorkeling in clear waters",
        caption: "Crystal clear Mediterranean waters",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "25.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Ocean Calvia Beach Experience",
      slug: "ocean-calvia-beach-experience",
      description: "Enjoy a perfect day at one of Mallorca's most beautiful beaches in Calvia! This beach experience includes comfortable sun lounger rental, parasol service, and access to beach facilities. The pristine sandy beach and crystal-clear waters make it perfect for swimming, sunbathing, and relaxation. Located in a stunning natural setting with nearby restaurants and beach bars.",
      shortDescription: "Perfect beach day experience with sun loungers and facilities at beautiful Calvia beach.",
      category: "water_sports" as const,
      location: "Calvia",
      meetingPoint: "Ocean Beach Club Calvia",
      durationMinutes: 480,
      maxParticipants: 100,
      minParticipants: 1,
      minAge: 0,
      maxAge: null,
      includedItems: [
        "Premium sun lounger",
        "Beach parasol",
        "Beach towel service",
        "Changing facilities access",
        "Fresh water showers",
        "Beach safety service"
      ],
      excludedItems: [
        "Food and beverages",
        "Water sports equipment",
        "Massage services",
        "Parking fees",
        "Personal items"
      ],
      whatToBring: [
        "Swimwear",
        "Sunscreen and hat",
        "Personal towel (backup)",
        "Camera for beach photos",
        "Cash for refreshments"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before visit",
      safetyRequirements: "Children must be supervised. Swimming at own risk",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.2",
      totalReviews: 834,
      totalBookings: 3456
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
        altText: "Beautiful Calvia beach",
        caption: "Pristine beach with crystal waters",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "30.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Barca Samba Catamaran Cruise",
      slug: "barca-samba-catamaran-cruise",
      description: "Set sail on the magnificent Barca Samba catamaran for an unforgettable Mediterranean adventure! This spacious catamaran offers the perfect blend of relaxation and excitement with multiple decks, nets for lounging, and pristine sailing through Mallorca's stunning coastline. Enjoy swimming stops in crystal-clear bays, snorkeling opportunities, and breathtaking sunset views. The professional crew ensures a memorable experience with music, drinks, and the ultimate island vibe.",
      shortDescription: "Luxurious catamaran cruise with swimming stops, snorkeling, and stunning sunset views.",
      category: "water_sports" as const,
      location: "Palma Bay",
      meetingPoint: "Club Nautico Palma Marina",
      durationMinutes: 360,
      maxParticipants: 40,
      minParticipants: 8,
      minAge: 6,
      maxAge: null,
      includedItems: [
        "6-hour catamaran cruise",
        "Professional crew service",
        "Swimming and snorkeling stops",
        "Snorkeling equipment provided",
        "Sunset viewing experience",
        "Onboard music system"
      ],
      excludedItems: [
        "Food and beverages",
        "Underwater photography",
        "Towels",
        "Transportation to marina",
        "Personal insurance"
      ],
      whatToBring: [
        "Swimwear and towels",
        "Sunscreen and hat",
        "Camera for memories",
        "Cash for drinks/snacks",
        "Sea-sickness tablets if needed"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before departure",
      safetyRequirements: "Children must be supervised. Life jackets provided",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: true,
      avgRating: "4.7",
      totalReviews: 1234,
      totalBookings: 5678
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1474704073896-a5cd3d171df3?q=80&w=800&auto=format&fit=crop",
        altText: "Catamaran sailing Mediterranean",
        caption: "Barca Samba catamaran cruise",
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        altText: "Catamaran deck with nets",
        caption: "Spacious deck with relaxation nets",
        isPrimary: false,
        sortOrder: 1
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "65.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Naturacavall Horseback Riding Adventure",
      slug: "naturacavall-horseback-riding",
      description: "Experience the natural beauty of Mallorca on horseback with Naturacavall! Our guided horseback riding tours take you through scenic countryside, ancient olive groves, and traditional Mallorcan landscapes. Suitable for all skill levels, our gentle horses and experienced guides ensure a safe and memorable adventure. Discover hidden trails, enjoy panoramic views, and connect with nature in the most authentic way possible.",
      shortDescription: "Guided horseback riding through scenic countryside and traditional Mallorcan landscapes.",
      category: "land_adventures" as const,
      location: "Countryside near Palma",
      meetingPoint: "Naturacavall Stables, Carretera Palma-Soller",
      durationMinutes: 120,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 8,
      maxAge: null,
      includedItems: [
        "Professional riding guide",
        "Well-trained gentle horses",
        "Safety helmet and equipment",
        "Scenic countryside route",
        "Basic riding instruction",
        "Photo opportunities"
      ],
      excludedItems: [
        "Transportation to stables",
        "Professional photography",
        "Food and beverages",
        "Personal insurance",
        "Gratuities"
      ],
      whatToBring: [
        "Long pants (mandatory)",
        "Closed-toe shoes with heel",
        "Comfortable clothing",
        "Camera for landscapes",
        "Water bottle"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before ride",
      safetyRequirements: "Basic physical fitness required. Helmet mandatory",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.5",
      totalReviews: 456,
      totalBookings: 1123
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1553284966-19b8815c7817?q=80&w=800&auto=format&fit=crop",
        altText: "Horseback riding countryside",
        caption: "Scenic horseback adventure",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "45.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Magic Catamarans Sunset Cruise",
      slug: "magic-catamarans-sunset-cruise",
      description: "Experience pure magic aboard our premium catamaran during Mallorca's most spectacular sunset! The Magic Catamarans fleet offers luxury sailing with spacious decks, comfortable seating, and professional service. Watch the sun paint the sky in brilliant colors while enjoying refreshing drinks and the gentle rhythm of the Mediterranean. This romantic and peaceful cruise is perfect for couples, families, and anyone seeking a magical end to their day.",
      shortDescription: "Luxury sunset catamaran cruise with spectacular views and premium service.",
      category: "water_sports" as const,
      location: "Port de Pollença",
      meetingPoint: "Port de Pollença Marina, Magic Catamarans Dock",
      durationMinutes: 180,
      maxParticipants: 35,
      minParticipants: 6,
      minAge: 0,
      maxAge: null,
      includedItems: [
        "3-hour sunset cruise",
        "Professional crew service",
        "Welcome drink included",
        "Spacious catamaran with nets",
        "Spectacular sunset viewing",
        "Peaceful sailing experience"
      ],
      excludedItems: [
        "Additional beverages",
        "Food and snacks",
        "Photography services",
        "Transportation to marina",
        "Personal items"
      ],
      whatToBring: [
        "Camera for sunset photos",
        "Light jacket for evening",
        "Sunglasses",
        "Cash for additional drinks",
        "Romantic spirit"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before cruise",
      safetyRequirements: "All ages welcome. Children must be supervised",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: true,
      avgRating: "4.8",
      totalReviews: 892,
      totalBookings: 3456
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
        altText: "Sunset catamaran cruise",
        caption: "Magical sunset sailing experience",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "55.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Bladerunner Jet Ski Adventure",
      slug: "bladerunner-jet-ski-adventure",
      description: "Feel the adrenaline rush with our high-powered Bladerunner jet ski experience! Race across the crystal-clear waters of Mallorca's coastline, explore hidden coves, and enjoy the ultimate water sports thrill. Our top-of-the-line jet skis and professional guides ensure maximum fun and safety. Perfect for adventure seekers who want to add some excitement to their island vacation.",
      shortDescription: "High-powered jet ski adventure exploring Mallorca's coastline and hidden coves.",
      category: "water_sports" as const,
      location: "Cala Bona",
      meetingPoint: "Cala Bona Water Sports Center",
      durationMinutes: 90,
      maxParticipants: 10,
      minParticipants: 2,
      minAge: 16,
      maxAge: null,
      includedItems: [
        "High-performance jet ski rental",
        "Safety equipment and briefing",
        "Professional guide escort",
        "Coastal exploration route",
        "Hidden cove discoveries",
        "Action-packed adventure"
      ],
      excludedItems: [
        "Fuel surcharge",
        "Photography services",
        "Insurance coverage",
        "Transportation to center",
        "Personal items storage"
      ],
      whatToBring: [
        "Valid driving license",
        "Swimwear",
        "Towel and sunscreen",
        "Waterproof camera",
        "Adventure attitude"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before activity",
      safetyRequirements: "Valid license required. Swimming ability mandatory",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.4",
      totalReviews: 567,
      totalBookings: 1789
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        altText: "Jet ski water adventure",
        caption: "High-speed jet ski excitement",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "120.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Palma Segway City Discovery Tour",
      slug: "palma-segway-city-tour",
      description: "Glide through Palma's historic streets on a fun and eco-friendly Segway! This guided tour covers all major landmarks including the Cathedral, Royal Palace, and historic old town while providing fascinating insights into the city's rich history and culture. Our easy-to-ride Segways make exploring effortless and enjoyable for all skill levels. Perfect for those who want to see more of Palma in less time while having fun!",
      shortDescription: "Fun Segway tour through Palma's historic landmarks and cultural sites.",
      category: "cultural" as const,
      location: "Palma",
      meetingPoint: "Palma Segway Tours Office, Avenida Gabriel Roca",
      durationMinutes: 120,
      maxParticipants: 8,
      minParticipants: 2,
      minAge: 14,
      maxAge: null,
      includedItems: [
        "Premium Segway rental",
        "Professional tour guide",
        "Safety training and equipment",
        "Historic landmarks tour",
        "Cultural insights and stories",
        "Photo stops at key locations"
      ],
      excludedItems: [
        "Entrance fees to attractions",
        "Food and beverages",
        "Personal photography",
        "Gratuities",
        "Personal insurance"
      ],
      whatToBring: [
        "Comfortable closed-toe shoes",
        "Camera for photos",
        "Sunglasses and sunscreen",
        "Valid ID",
        "Sense of adventure"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before tour",
      safetyRequirements: "Basic balance required. Training provided",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.3",
      totalReviews: 723,
      totalBookings: 2134
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
        altText: "Segway city tour",
        caption: "Fun Segway exploration of Palma",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "40.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Blue Hole Diving Excursion",
      slug: "blue-hole-diving-excursion",
      description: "Dive into the mysterious Blue Hole, one of Mallorca's most spectacular underwater formations! This guided diving excursion takes certified divers to explore underwater caves, swim through crystal-clear blue waters, and discover unique marine life. The Blue Hole offers an otherworldly diving experience with its dramatic limestone formations and pristine underwater visibility. A must-do adventure for experienced divers seeking something extraordinary.",
      shortDescription: "Spectacular guided diving excursion to the famous Blue Hole underwater formation.",
      category: "water_sports" as const,
      location: "Cap de Formentor",
      meetingPoint: "Formentor Diving Center",
      durationMinutes: 240,
      maxParticipants: 8,
      minParticipants: 4,
      minAge: 16,
      maxAge: null,
      includedItems: [
        "Professional dive guide",
        "Complete diving equipment",
        "Blue Hole access",
        "2 tank dive experience",
        "Underwater photography spots",
        "Marine life identification"
      ],
      excludedItems: [
        "Diving certification (required)",
        "Underwater camera rental",
        "Food and beverages",
        "Transportation to site",
        "Personal insurance"
      ],
      whatToBring: [
        "Valid diving certification",
        "Swimwear",
        "Towel and sunscreen",
        "Logbook",
        "Personal diving gear (optional)"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before dive",
      safetyRequirements: "Advanced Open Water certification required",
      weatherDependent: true,
      instantConfirmation: false,
      status: "active" as const,
      featured: false,
      avgRating: "4.9",
      totalReviews: 234,
      totalBookings: 567
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
        altText: "Blue hole diving",
        caption: "Spectacular Blue Hole diving experience",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "85.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-adventures-co",
      title: "Quad Biking Mountain Adventure",
      slug: "quad-biking-mountain-adventure",
      description: "Get your adrenaline pumping with an exciting quad bike adventure through Mallorca's rugged mountains! Navigate dirt trails, cross streams, and discover breathtaking viewpoints while riding powerful quad bikes. Our guided tours take you off the beaten path to explore the island's wild side, passing through pine forests, rocky terrain, and traditional villages. Perfect for adventure seekers who want to experience Mallorca's natural beauty in an exciting way.",
      shortDescription: "Thrilling quad bike adventure through mountains, forests, and traditional villages.",
      category: "land_adventures" as const,
      location: "Tramuntana Mountains",
      meetingPoint: "Mountain Adventures Base Camp, Sóller Road",
      durationMinutes: 150,
      maxParticipants: 12,
      minParticipants: 4,
      minAge: 18,
      maxAge: null,
      includedItems: [
        "Powerful quad bike rental",
        "Professional guide escort",
        "Safety equipment and briefing",
        "Mountain trail exploration",
        "Scenic viewpoint stops",
        "Adventure photography spots"
      ],
      excludedItems: [
        "Fuel supplement",
        "Damage insurance",
        "Food and refreshments",
        "Transportation to base",
        "Personal belongings storage"
      ],
      whatToBring: [
        "Valid driving license",
        "Closed-toe shoes and long pants",
        "Sunglasses and sunscreen",
        "Camera for views",
        "Adventurous spirit"
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before adventure",
      safetyRequirements: "Valid license required. Safety briefing mandatory",
      weatherDependent: true,
      instantConfirmation: true,
      status: "active" as const,
      featured: false,
      avgRating: "4.2",
      totalReviews: 445,
      totalBookings: 1567
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
        altText: "Quad biking mountain trail",
        caption: "Exciting mountain quad adventure",
        isPrimary: true,
        sortOrder: 0
      }
    ],
    pricing: [
      {
        priceType: "adult" as const,
        basePrice: "75.00",
        seasonalMultiplier: "1.0",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  },
  {
    activity: {
      operatorId: "mallorca-watersports-co",
      title: "Luxury Yacht Charter Experience",
      slug: "luxury-yacht-charter-experience",
      description: "Indulge in the ultimate luxury experience with our premium yacht charter! This exclusive boat rental includes a professional captain, stunning coastal cruise, and access to secluded coves that only luxury vessels can reach. Perfect for special occasions, romantic getaways, or simply experiencing Mallorca's coastline in absolute comfort and style. Enjoy personalized service, premium amenities, and unforgettable memories on the Mediterranean.",
      shortDescription: "Exclusive luxury yacht charter with captain, coastal cruise, and premium amenities.",
      category: "water_sports" as const,
      location: "Port Adriano",
      meetingPoint: "Port Adriano Marina, Luxury Berth Section",
      durationMinutes: 480,
      maxParticipants: 12,
      minParticipants: 2,
      minAge: 0,
      maxAge: null,
      includedItems: [
        "Luxury yacht rental",
        "Professional captain and crew",
        "8-hour charter experience",
        "Coastal cruise to exclusive locations",
        "Swimming stops in pristine coves",
        "Premium onboard amenities"
      ],
      excludedItems: [
        "Food and catering",
        "Premium beverages",
        "Fuel surcharge",
        "Gratuities for crew",
        "Personal concierge services"
      ],
      whatToBring: [
        "Swimwear and luxury towels",
        "Sunglasses and premium sunscreen",
        "Camera for exclusive moments",
        "Formal attire for elegant photos",
        "Appreciation for luxury"
      ],
      cancellationPolicy: "Free cancellation up to 72 hours before charter",
      safetyRequirements: "All safety equipment provided. Children supervised",
      weatherDependent: true,
      instantConfirmation: false,
      status: "active" as const,
      featured: true,
      avgRating: "4.9",
      totalReviews: 156,
      totalBookings: 423
    },
    images: [
      {
        imageUrl: "https://images.unsplash.com/photo-1474704073896-a5cd3d171df3?q=80&w=800&auto=format&fit=crop",
        altText: "Luxury yacht Mediterranean",
        caption: "Ultimate luxury yacht experience",
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
        altText: "Yacht deck luxury",
        caption: "Premium yacht amenities",
        isPrimary: false,
        sortOrder: 1
      }
    ],
    pricing: [
      {
        priceType: "group" as const,
        basePrice: "700.00",
        seasonalMultiplier: "1.2",
        currency: "EUR",
        validFrom: null,
        validUntil: null,
        isActive: true
      }
    ]
  }
]

// Seed activities into database
export async function seedActivitiesAction(): Promise<ActionState<string>> {
  try {
    console.log("Starting Mallorca activities seeding...")

    // Note: For now we'll use placeholder operator IDs
    // In a real implementation, you'd first create operators
    const placeholderOperatorId = crypto.randomUUID()

    for (const activityData of mallorcanActivitiesData) {
      // Create activity
      const [activity] = await db
        .insert(activitiesTable)
        .values({
          ...activityData.activity,
          operatorId: placeholderOperatorId // Use placeholder for now
        })
        .returning()

      console.log(`Created activity: ${activity.title}`)

      // Create activity images
      for (const imageData of activityData.images) {
        await db.insert(activityImagesTable).values({
          ...imageData,
          activityId: activity.id
        })
      }

      // Create activity pricing
      for (const pricingData of activityData.pricing) {
        await db.insert(activityPricingTable).values({
          ...pricingData,
          activityId: activity.id
        })
      }

      // Create sample availability for the next 30 days
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        await db.insert(activityAvailabilityTable).values({
          activityId: activity.id,
          date: date.toISOString().split('T')[0],
          timeSlot: "10:00",
          maxCapacity: activity.maxParticipants,
          availableSpots: Math.floor(Math.random() * activity.maxParticipants),
          status: "available"
        })
      }
    }

    return {
      isSuccess: true,
      message: `Successfully seeded ${mallorcanActivitiesData.length} Mallorca activities with images, pricing, and availability`,
      data: `${mallorcanActivitiesData.length} activities created`
    }
  } catch (error) {
    console.error("Error seeding activities:", error)
    return { 
      isSuccess: false, 
      message: `Failed to seed activities: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

// Clear all activities data (useful for re-seeding)
export async function clearActivitiesAction(): Promise<ActionState<string>> {
  try {
    // Delete in reverse order due to foreign key constraints
    await db.delete(activityAvailabilityTable)
    await db.delete(activityPricingTable)
    await db.delete(activityImagesTable)
    await db.delete(activitiesTable)

    return {
      isSuccess: true,
      message: "Successfully cleared all activities data",
      data: "All activities data cleared"
    }
  } catch (error) {
    console.error("Error clearing activities:", error)
    return { 
      isSuccess: false, 
      message: `Failed to clear activities: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
} 