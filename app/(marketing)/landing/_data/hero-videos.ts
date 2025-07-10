/**
 * Hero video configuration for landing page slideshow
 */

export interface HeroVideo {
  id: string
  src: string
  type: "video" | "image"
  alt?: string
  poster?: string
  cloudinaryId?: string
  fallbackSrc?: string
  title?: string
}

export const FALLBACK_VIDEOS: HeroVideo[] = [
  {
    id: "fallback-1",
    src: "https://images.unsplash.com/photo-1578530332818-6ba472e67b9f?q=80&w=1920&auto=format&fit=crop",
    type: "image",
    alt: "Turquoise waters and sandy beach at Cala Mondragó, Mallorca"
  },
  {
    id: "fallback-2",
    src: "https://images.unsplash.com/photo-1570135460345-26da4177b7f6?q=80&w=1920&auto=format&fit=crop",
    type: "image",
    alt: "Luxury yachts and sailboats in Port de Sóller marina at sunset"
  },
  {
    id: "fallback-3",
    src: "https://images.unsplash.com/photo-1601389004506-dcf7e42de4d8?q=80&w=1920&auto=format&fit=crop",
    type: "image",
    alt: "Crystal clear Mediterranean waters at Es Trenc beach"
  },
  {
    id: "fallback-4",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop",
    type: "image",
    alt: "Traditional fishing boats in a picturesque Mallorca cove"
  },
  {
    id: "fallback-5",
    src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1920&auto=format&fit=crop",
    type: "image",
    alt: "Aerial view of Cap de Formentor with dramatic cliffs and blue sea"
  }
]

export const heroVideos: HeroVideo[] = [
  {
    id: "hero-1",
    type: "video",
    cloudinaryId: "lcwtw5eus5cvbcddrpqh",
    src: "",
    fallbackSrc:
      "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1c9a91a9d&profile_id=174",
    poster:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    alt: "Aerial view of Mallorca coastline",
    title: "Premium Experience"
  },
  {
    id: "hero-2",
    type: "video",
    cloudinaryId: "rjuszbicymgknucnikjy",
    src: "",
    fallbackSrc:
      "https://player.vimeo.com/external/434041090.hd.mp4?s=7c31bd8b0e3d7c47a1a8b5a8b5c5f5c5c5f5c5f5&profile_id=174",
    poster:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920&auto=format&fit=crop",
    alt: "Sailing adventure in Mallorca",
    title: "Unforgettable Adventures"
  },
  {
    id: "hero-3",
    type: "video",
    cloudinaryId: "gezph6p3putc1ljotgcp",
    src: "",
    fallbackSrc:
      "https://player.vimeo.com/external/434045423.hd.mp4?s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0&profile_id=174",
    poster:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
    alt: "Mountain adventures in Serra de Tramuntana",
    title: "Paradise Activities"
  }
]
