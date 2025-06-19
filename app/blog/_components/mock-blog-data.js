// Simple mock blog data for fallback when database is unavailable
const mockBlogData = [
  {
    id: "1",
    title: "The Ultimate Guide to Mallorca's Best Beaches",
    slug: "ultimate-guide-mallorca-beaches-hidden-coves-crystal-waters",
    summary:
      "Discover Mallorca's most stunning beaches, from pristine Cala Mondragó to luxurious Port Adriano.",
    content: `<h2>🌊 Paradise Found in the Mediterranean</h2>
<p>Mallorca's coastline is a treasure trove of spectacular beaches, each offering its own unique charm and crystal-clear waters.</p>
<h3>🏖️ Top Beach Destinations</h3>
<p>From family-friendly coves to luxury beach clubs, Mallorca has something for everyone.</p>`,
    imageUrl: "/images/blogs/mallorca-beaches.jpg",
    status: "published",
    category: "travel_guide",
    author: "Maria Rodriguez",
    authorImageUrl: "/images/authors/maria-rodriguez.jpg",
    metaTitle: "Ultimate Guide to Mallorca's Best Beaches",
    metaDescription:
      "Discover Mallorca's most stunning beaches with our comprehensive guide.",
    canonicalUrl: null,
    isFeatured: true,
    publishedAt: new Date("2025-01-25T10:00:00Z"),
    createdAt: new Date("2025-01-25T09:00:00Z"),
    updatedAt: new Date("2025-01-25T10:00:00Z"),
    viewCount: 1250
  },
  {
    id: "2",
    title: "Mallorca Nightlife Guide",
    slug: "mallorca-nightlife-guide-bcm-planet-dance-boat-parties",
    summary:
      "Ultimate guide to Mallorca's legendary nightlife scene including BCM Planet Dance and boat parties.",
    content: `<h2>🌙 Mallorca After Dark</h2>
<p>When the sun sets over Mallorca, the island transforms into one of Europe's premier nightlife destinations.</p>
<h3>🕺 Legendary Nightclubs</h3>
<p>From world-famous superclubs to intimate beach bars, Mallorca offers unforgettable experiences.</p>`,
    imageUrl: "/images/blogs/mallorca-nightlife.jpg",
    status: "published",
    category: "activity_spotlight",
    author: "Carlos Mendez",
    authorImageUrl: "/images/authors/carlos-mendez.jpg",
    metaTitle: "Mallorca Nightlife Guide | BCM Planet Dance & Boat Parties",
    metaDescription: "Ultimate guide to Mallorca's legendary nightlife scene.",
    canonicalUrl: null,
    isFeatured: true,
    publishedAt: new Date("2025-01-24T15:00:00Z"),
    createdAt: new Date("2025-01-24T14:00:00Z"),
    updatedAt: new Date("2025-01-24T15:00:00Z"),
    viewCount: 890
  },
  {
    id: "3",
    title: "Palma's Cultural Heritage",
    slug: "palma-cultural-heritage-cathedral-local-traditions",
    summary:
      "Explore Palma's rich cultural heritage from the stunning Cathedral to local traditions.",
    content: `<h2>🏛️ Palma: Where History Comes Alive</h2>
<p>Palma de Mallorca is a treasure trove of cultural heritage, where Gothic architecture meets contemporary art.</p>
<h3>⛪ La Seu Cathedral</h3>
<p>The crown jewel of Palma's skyline, La Seu Cathedral is one of Europe's most magnificent Gothic structures.</p>`,
    imageUrl: "/images/blogs/palma-cathedral.jpg",
    status: "published",
    category: "local_culture",
    author: "Isabella Torres",
    authorImageUrl: "/images/authors/isabella-torres.jpg",
    metaTitle: "Palma's Cultural Heritage Guide",
    metaDescription:
      "Explore Palma's rich cultural heritage and local traditions.",
    canonicalUrl: null,
    isFeatured: false,
    publishedAt: new Date("2025-01-23T14:00:00Z"),
    createdAt: new Date("2025-01-23T13:00:00Z"),
    updatedAt: new Date("2025-01-23T14:00:00Z"),
    viewCount: 675
  },
  {
    id: "4",
    title: "Serra de Tramuntana Adventures",
    slug: "serra-tramuntana-adventures-unesco-mountains-experiences",
    summary:
      "Explore Serra de Tramuntana's UNESCO World Heritage adventures from horseback riding to quad biking.",
    content: `<h2>🏔️ Serra de Tramuntana: Mallorca's Majestic Mountains</h2>
<p>Designated as a UNESCO World Heritage Site, the Serra de Tramuntana mountain range offers spectacular adventures.</p>
<h3>🐴 Horseback Riding Adventures</h3>
<p>Explore ancient pathways and dramatic landscapes on horseback.</p>`,
    imageUrl: "/images/blogs/serra-tramuntana.jpg",
    status: "published",
    category: "activity_spotlight",
    author: "Miguel Santos",
    authorImageUrl: "/images/authors/miguel-santos.jpg",
    metaTitle: "Serra de Tramuntana Adventures",
    metaDescription:
      "Explore UNESCO World Heritage mountains with thrilling experiences.",
    canonicalUrl: null,
    isFeatured: false,
    publishedAt: new Date("2025-01-22T12:00:00Z"),
    createdAt: new Date("2025-01-22T11:00:00Z"),
    updatedAt: new Date("2025-01-22T12:00:00Z"),
    viewCount: 425
  }
]

export default mockBlogData 