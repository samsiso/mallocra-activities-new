"use server"

import { db } from "@/db/db"
import { 
  blogsTable, 
  blogTagsTable, 
  blogToTagTable,
  InsertBlog,
  InsertBlogTag
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

// Tourism blog content data
const mallorcanBlogContent = [
  {
    blog: {
      title: "The Ultimate Guide to Mallorca's Best Beaches: From Hidden Coves to Crystal Waters",
      slug: "ultimate-guide-mallorca-beaches-hidden-coves-crystal-waters",
      summary: "Discover Mallorca's most stunning beaches, from pristine Cala Mondragó to luxurious Port Adriano. Complete guide with activities, facilities, and insider tips for the perfect beach day.",
      content: `<h2>🌊 Paradise Found in the Mediterranean</h2>
<p>Mallorca's coastline is a treasure trove of spectacular beaches, each offering its own unique charm and crystal-clear waters. From the famous party beaches of Magaluf to the pristine natural coves of the east coast, our comprehensive guide will help you discover the perfect beach for your Mallorca adventure.</p>

<h2>🏝️ Top Beach Destinations</h2>

<h3>1. Cala Mondragó - Snorkeling Paradise</h3>
<p><strong>Location:</strong> Southeast Coast, Mondragó Natural Park<br>
<strong>Best For:</strong> Snorkeling, families, nature lovers<br>
<strong>Facilities:</strong> Parking, restaurants, beach bars</p>

<p>This protected cove within Mondragó Natural Park offers some of the clearest waters in Mallorca. The pristine bay is perfect for swimming and snorkeling, with Posidonia seagrass meadows home to colorful Mediterranean marine life.</p>

<p><strong>🤿 Activity Connection:</strong> Join our <a href="/activities/snorkeling-adventure-crystal-waters">Snorkeling Adventure in Crystal Waters</a> to explore this underwater paradise with professional guides and equipment included.</p>

<h3>2. Ocean Calvia - Luxury Beach Experience</h3>
<p><strong>Location:</strong> Southwest Coast, Calvia<br>
<strong>Best For:</strong> Luxury seekers, comfortable beach days<br>
<strong>Facilities:</strong> Premium beach club, sun loungers, restaurants</p>

<p>Experience beach luxury at its finest with premium facilities and stunning coastal views. The pristine sandy beach and crystal-clear waters make it perfect for a sophisticated beach day.</p>

<p><strong>🏖️ Activity Connection:</strong> Book our <a href="/activities/ocean-calvia-beach-experience">Ocean Calvia Beach Experience</a> for premium sun loungers, parasol service, and beach club access.</p>

<h3>3. Port Adriano - Marina Luxury</h3>
<p>This Philippe Starck-designed marina combines beautiful beaches with world-class luxury amenities. Perfect for those seeking an upscale coastal experience.</p>

<p><strong>⛵ Activity Connection:</strong> Experience ultimate luxury with our <a href="/activities/luxury-yacht-charter-experience">Luxury Yacht Charter Experience</a> departing from Port Adriano's exclusive marina.</p>

<h2>🏄‍♂️ Beach Activities & Water Sports</h2>

<h3>High-Energy Water Adventures</h3>
<ul>
<li><strong>Jet Ski Thrills:</strong> <a href="/activities/bladerunner-jet-ski-adventure">Bladerunner Jet Ski Adventure</a> - €120</li>
<li><strong>Diving Expeditions:</strong> <a href="/activities/blue-hole-diving-excursion">Blue Hole Diving Excursion</a> - €85</li>
<li><strong>Boat Parties:</strong> <a href="/activities/heatwave-boat-party">Heatwave Boat Party Experience</a> - €69</li>
<li><strong>Catamaran Cruises:</strong> <a href="/activities/barca-samba-catamaran-cruise">Barca Samba Catamaran Cruise</a> - €75</li>
</ul>

<h2>📅 Seasonal Beach Guide</h2>
<p><strong>🌸 Spring (March-May):</strong> Perfect for peaceful beaches and mild weather<br>
<strong>☀️ Summer (June-August):</strong> Peak beach season with vibrant atmosphere<br>
<strong>🍂 Autumn (September-November):</strong> Ideal conditions with warm sea<br>
<strong>❄️ Winter (December-February):</strong> Coastal walks and peaceful atmosphere</p>

<h2>💰 Budget Planning</h2>
<ul>
<li><strong>Budget Water Sports (€25-50):</strong> <a href="/activities/snorkeling-adventure-crystal-waters">Snorkeling Adventure</a> - €25</li>
<li><strong>Mid-Range Experiences (€50-100):</strong> <a href="/activities/heatwave-boat-party">Boat Parties</a> - €69</li>
<li><strong>Premium Experiences (€100+):</strong> <a href="/activities/luxury-yacht-charter-experience">Luxury Yacht Charters</a> - €500+</li>
</ul>

<h2>🌟 Your Perfect Beach Day Awaits</h2>
<p>Mallorca's beaches offer something magical for every traveler. Whether you're seeking adrenaline-pumping water sports, peaceful family time, or luxurious beachside relaxation, the island's 200+ beaches provide endless possibilities.</p>

<p>Ready to dive into your Mallorca beach adventure? Browse our <a href="/activities?category=water_sports">water sports activities</a> and start planning your perfect Mediterranean escape today!</p>`,
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop",
      status: "published" as const,
      category: "guide" as const,
      authorId: "marina-rodriguez",
      excerpt: "Discover Mallorca's most stunning beaches, from pristine Cala Mondragó to luxurious Port Adriano. Complete guide with activities, facilities, and insider tips for the perfect beach day.",
      author: "Marina Rodriguez",
      authorImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332c902?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3",
      metaTitle: "Ultimate Guide to Mallorca's Best Beaches | Hidden Coves & Crystal Waters",
      metaDescription: "Discover Mallorca's most stunning beaches, from pristine Cala Mondragó to luxurious Port Adriano. Complete guide with activities, facilities, and insider tips.",
      isFeatured: true,
      publishedAt: new Date("2025-01-25T10:00:00Z"),
      viewCount: 234
    },
    tags: ["beaches", "water sports", "swimming", "snorkeling", "family fun", "mallorca"]
  },
  {
    blog: {
      title: "Mallorca Nightlife Guide: BCM Planet Dance, Boat Parties & After-Dark Adventures",
      slug: "mallorca-nightlife-guide-bcm-planet-dance-boat-parties",
      summary: "Ultimate guide to Mallorca's legendary nightlife scene including BCM Planet Dance, boat parties, and the best clubs and bars across the island.",
      content: `<h2>🎉 When the Sun Sets, Mallorca Comes Alive</h2>
<p>Mallorca transforms after dark into one of Europe's ultimate party destinations. From the legendary BCM Planet Dance superclub to floating boat parties under the stars, the island offers world-class nightlife experiences that attract party-goers from around the globe.</p>

<h2>🏆 Legendary Club Experiences</h2>

<h3>BCM Planet Dance - The Icon of Mallorca Nightlife</h3>
<p><strong>Location:</strong> Magaluf Strip<br>
<strong>Capacity:</strong> 2,000+ party-goers<br>
<strong>Best For:</strong> Ultimate clubbing experience, international DJs</p>

<p>BCM Planet Dance isn't just a club – it's a nightlife institution that has defined Mallorca's party scene for decades. This massive superclub features state-of-the-art sound systems, spectacular light shows, and multiple dance floors hosting world-renowned DJs.</p>

<p><strong>🎟️ Experience BCM:</strong> Book your <a href="/activities/bcm-planet-dance-nightclub">BCM Planet Dance - Ultimate Nightclub Experience</a> for guaranteed entry, skip-the-line access, and the full superclub experience.</p>

<h2>🚢 Boat Parties - Nightlife on the Mediterranean</h2>

<h3>Heatwave Boat Party - The Ultimate Floating Club</h3>
<p>Take your nightlife to the next level with Mallorca's famous boat parties. Dance to incredible DJs while cruising the stunning Mediterranean coastline, enjoy welcome drinks, and party with an international crowd as the sun sets over the island.</p>

<p><strong>🎉 Join the Party:</strong> Book the <a href="/activities/heatwave-boat-party">Heatwave Boat Party Experience</a> for the ultimate floating nightclub adventure.</p>

<h2>🍸 Bar Hopping & Local Nightlife</h2>

<h3>Authentic Local Experience</h3>
<p>Discover Palma's authentic nightlife culture with our evening tapas and bar tour. Experience the local tradition of "ir de tapas" while sampling traditional drinks and meeting locals.</p>

<p><strong>🍷 Cultural Nightlife:</strong> Join our <a href="/activities/tapas-local-vibes-palma-night">Tapas & Local Vibes - Discover Palma by Night</a> for an authentic evening of local bars, traditional tapas, and cultural insights.</p>

<h2>💰 Nightlife Budget Guide</h2>
<ul>
<li><strong>Budget Night Out (€30-50):</strong> Local bars and tapas crawling</li>
<li><strong>Mid-Range Experience (€50-100):</strong> <a href="/activities/tapas-local-vibes-palma-night">Tapas & Local Vibes Tour</a> - €70</li>
<li><strong>Premium Night (€100+):</strong> <a href="/activities/bcm-planet-dance-nightclub">BCM Planet Dance</a> + <a href="/activities/heatwave-boat-party">Boat Party</a></li>
</ul>

<h2>🎊 Your Mallorca Night Awaits</h2>
<p>Mallorca's nightlife scene offers endless possibilities for unforgettable nights. Whether you're seeking the legendary energy of BCM Planet Dance, the unique experience of Mediterranean boat parties, or authentic local bar culture, the island delivers world-class entertainment under the stars.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      status: "published" as const,
      category: "guide" as const,
      authorId: "carlos-mendez",
      excerpt: "Ultimate guide to Mallorca's legendary nightlife scene including BCM Planet Dance, boat parties, and the best clubs and bars across the island.",
      author: "Carlos Mendez",
      authorImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3",
      metaTitle: "Mallorca Nightlife Guide | BCM Planet Dance & Boat Parties",
      metaDescription: "Ultimate guide to Mallorca's legendary nightlife scene including BCM Planet Dance, boat parties, and the best clubs and bars across the island.",
      isFeatured: true,
      publishedAt: new Date("2025-01-24T18:00:00Z"),
      viewCount: 187
    },
    tags: ["nightlife", "BCM", "boat parties", "clubs", "bars", "entertainment", "magaluf"]
  },
  {
    blog: {
      title: "Palma's Cultural Heritage: From Cathedral Splendor to Local Traditions",
      slug: "palma-cultural-heritage-cathedral-splendor-local-traditions", 
      summary: "Explore Palma's rich cultural heritage from the stunning Cathedral to hidden local traditions. Complete guide with tours, activities, and insider experiences.",
      content: `<h2>🏰 A Journey Through Mallorca's Cultural Heart</h2>
<p>Palma de Mallorca is a treasure trove of cultural heritage, where Gothic cathedrals stand alongside Arab baths, and centuries-old traditions continue in modern neighborhoods. Our comprehensive guide reveals both iconic landmarks and hidden cultural gems that make Palma a fascinating destination for culture enthusiasts.</p>

<h2>⛪ Iconic Cultural Landmarks</h2>

<h3>La Seu Cathedral - Gothic Masterpiece</h3>
<p><strong>Highlights:</strong> Stunning rose window, Gaudí renovations, harbor views<br>
<strong>Best Time:</strong> Early morning or late afternoon for photography<br>
<strong>Duration:</strong> 1-2 hours for full exploration</p>

<p>The magnificent Gothic cathedral dominates Palma's skyline and represents the city's spiritual and architectural heart. Built over 350 years, La Seu showcases incredible craftsmanship and offers breathtaking views over the Mediterranean.</p>

<h2>🎨 Museums & Cultural Centers</h2>

<h3>Palma Aquarium - Marine Cultural Experience</h3>
<p>Beyond entertainment, Palma Aquarium offers deep insights into Mediterranean marine culture and conservation efforts that have shaped island life for centuries.</p>

<p><strong>🐠 Cultural Connection:</strong> Explore <a href="/activities/palma-aquarium-marine-discovery">Palma Aquarium Marine Discovery</a> to understand how marine life influences Mallorcan culture and traditions.</p>

<h2>🚶‍♂️ Cultural Walking Experiences</h2>

<h3>Historic Palma Discovery</h3>
<p>Explore Palma's winding streets with expert guides who reveal hidden histories, architectural secrets, and cultural traditions that tourists typically miss.</p>

<p><strong>🏛️ Cultural Immersion:</strong> Join our <a href="/activities/palma-segway-city-tour">Palma Segway City Discovery Tour</a> for an engaging journey through historic landmarks with cultural insights and stories.</p>

<h2>🍷 Culinary Cultural Traditions</h2>

<h3>Traditional Mallorcan Cuisine</h3>
<ul>
<li><strong>Pa amb oli:</strong> Traditional bread with tomato and olive oil</li>
<li><strong>Sobrassada:</strong> Spiced pork sausage, island specialty</li>
<li><strong>Ensaimada:</strong> Sweet spiral pastry, breakfast tradition</li>
<li><strong>Tumbet:</strong> Layered vegetable dish, summer staple</li>
</ul>

<p><strong>🍽️ Cultural Food Experience:</strong> Discover authentic flavors with <a href="/activities/tapas-local-vibes-palma-night">Tapas & Local Vibes - Discover Palma by Night</a>, featuring traditional tavernas and cultural insights.</p>

<h2>💰 Cultural Experience Budget</h2>
<ul>
<li><strong>Budget Cultural Experiences (€25-50):</strong> <a href="/activities/palma-aquarium-marine-discovery">Palma Aquarium</a> - €23, <a href="/activities/electric-scooter-palma-tour">Electric Scooter Tour</a> - €30</li>
<li><strong>Premium Cultural Experiences (€50-100+):</strong> <a href="/activities/palma-segway-city-tour">Segway City Tour</a> - €40, <a href="/activities/tapas-local-vibes-palma-night">Tapas Night Tour</a> - €70</li>
</ul>

<h2>🌟 Living Culture in Modern Paradise</h2>
<p>Palma's cultural heritage isn't confined to museums and monuments – it lives and breathes in every neighborhood street, traditional market, and family taverna. Whether you're exploring Gothic masterpieces or sharing tapas with locals, you're participating in a cultural conversation that spans centuries.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=1200&auto=format&fit=crop",
      status: "published" as const,
      category: "guide" as const,
      authorId: "isabel-fernandez",
      excerpt: "Explore Palma's rich cultural heritage from the stunning Cathedral to hidden local traditions. Complete guide with tours, activities, and insider experiences.",
      author: "Isabel Fernandez",
      authorImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3",
      metaTitle: "Palma's Cultural Heritage Guide | Cathedral to Local Traditions",
      metaDescription: "Explore Palma's rich cultural heritage from the stunning Cathedral to hidden local traditions. Complete guide with tours, activities, and insider experiences.",
      isFeatured: false,
      publishedAt: new Date("2025-01-23T14:00:00Z"),
      viewCount: 156
    },
    tags: ["culture", "history", "palma", "cathedral", "museums", "heritage", "local experiences"]
  },
  {
    blog: {
      title: "Serra de Tramuntana Adventures: UNESCO Mountains & Thrilling Experiences",
      slug: "serra-tramuntana-adventures-unesco-mountains-thrilling-experiences",
      summary: "Explore Serra de Tramuntana's UNESCO World Heritage adventures from horseback riding to quad biking. Complete guide to Mallorca's mountain thrills.",
      content: `<h2>🌄 Adventure Awaits in UNESCO Paradise</h2>
<p>The Serra de Tramuntana mountains offer some of Europe's most spectacular adventure experiences, combining UNESCO World Heritage landscapes with adrenaline-pumping activities. From gentle horseback rides through olive groves to thrilling quad bike adventures across rugged terrain, these ancient mountains provide unforgettable experiences for every adventure seeker.</p>

<h2>🐎 Horseback Adventures in Natural Paradise</h2>

<h3>Naturacavall Horseback Riding - Connect with Nature</h3>
<p><strong>Duration:</strong> 2 hours of scenic exploration<br>
<strong>Best For:</strong> All skill levels, nature lovers, authentic experiences<br>
<strong>Highlights:</strong> Olive groves, panoramic views, traditional landscapes</p>

<p>Experience Mallorca's natural beauty the traditional way – on horseback through scenic countryside that has remained unchanged for centuries. Our gentle horses and expert guides ensure safe adventures while revealing hidden trails and breathtaking viewpoints.</p>

<p><strong>🐴 Authentic Adventure:</strong> Join our <a href="/activities/naturacavall-horseback-riding">Naturacavall Horseback Riding Adventure</a> for guided exploration through scenic countryside and traditional Mallorcan landscapes.</p>

<h2>🏍️ High-Energy Mountain Adventures</h2>

<h3>Quad Biking Through Wild Terrain</h3>
<p><strong>Duration:</strong> 2.5 hours of adrenaline action<br>
<strong>Best For:</strong> Thrill seekers, adventure enthusiasts<br>
<strong>Features:</strong> Mountain trails, stream crossings, scenic viewpoints</p>

<p>Get your heart racing with powerful quad bikes navigating dirt trails, rocky terrain, and traditional mountain villages. This off-road adventure reveals Mallorca's wild side while providing spectacular mountain views and photo opportunities.</p>

<p><strong>🏍️ Mountain Thrills:</strong> Experience the <a href="/activities/quad-biking-mountain-adventure">Quad Biking Mountain Adventure</a> through rugged Tramuntana trails and traditional villages.</p>

<h2>🚲 Eco-Friendly Mountain Exploration</h2>

<h3>Electric Scooter Scenic Routes</h3>
<p>For those seeking adventure with environmental consciousness, electric scooters provide an excellent way to explore mountain roads and coastal routes while minimizing environmental impact.</p>

<p><strong>⚡ Sustainable Adventure:</strong> Our <a href="/activities/electric-scooter-palma-tour">Electric Scooter Palma City Tour</a> includes routes toward the mountain foothills with stunning panoramic views.</p>

<h2>🥾 Hiking & Trekking Adventures</h2>

<h3>UNESCO Trail Network</h3>
<ul>
<li><strong>GR-221 (Stone Route):</strong> 140km total, multiple day sections</li>
<li><strong>Puig de Massanella:</strong> 1,364m (second highest peak)</li>
<li><strong>Barranc de Biniaraix:</strong> Stone steps, terraced landscapes</li>
</ul>

<h2>💰 Adventure Budget Planning</h2>
<ul>
<li><strong>Budget Adventures (€25-50):</strong> <a href="/activities/electric-scooter-palma-tour">Electric Scooter Tour</a> - €30</li>
<li><strong>Mid-Range Experiences (€50-100):</strong> <a href="/activities/naturacavall-horseback-riding">Horseback Riding</a> - €45</li>
<li><strong>Premium Adventures (€100+):</strong> <a href="/activities/quad-biking-mountain-adventure">Quad Biking</a> - €75</li>
</ul>

<h2>🌟 Your Mountain Adventure Awaits</h2>
<p>The Serra de Tramuntana offers an incredible diversity of adventures, from peaceful horseback exploration to thrilling quad bike expeditions. This UNESCO World Heritage landscape provides the perfect backdrop for unforgettable experiences that combine natural beauty, cultural heritage, and adrenaline-pumping action.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop",
      status: "published" as const,
      category: "guide" as const,
      authorId: "miguel-torres",
      excerpt: "Explore Serra de Tramuntana's UNESCO World Heritage adventures from horseback riding to quad biking. Complete guide to Mallorca's mountain thrills.",
      author: "Miguel Torres",
      authorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3",
      metaTitle: "Serra de Tramuntana Adventures | UNESCO Mountains & Thrilling Experiences",
      metaDescription: "Explore Serra de Tramuntana's UNESCO World Heritage adventures from horseback riding to quad biking. Complete guide to Mallorca's mountain thrills.",
      isFeatured: false,
      publishedAt: new Date("2025-01-22T16:00:00Z"),
      viewCount: 98
    },
    tags: ["adventure", "mountains", "hiking", "quad biking", "horseback riding", "nature", "tramuntana"]
  }
];

export async function seedBlogContentAction(): Promise<ActionState<void>> {
  try {
    console.log("Starting blog content seeding...");

    // First, create all tags
    const allTags = [...new Set(mallorcanBlogContent.flatMap(item => item.tags))];
    const createdTags: { [key: string]: string } = {};

    for (const tagName of allTags) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
      
      try {
        const [existingTag] = await db
          .select()
          .from(blogTagsTable)
          .where(eq(blogTagsTable.slug, tagSlug))
          .limit(1);

        if (existingTag) {
          createdTags[tagName] = existingTag.id;
        } else {
          const [newTag] = await db.insert(blogTagsTable).values({
            name: tagName,
            slug: tagSlug
          }).returning();
          createdTags[tagName] = newTag.id;
        }
      } catch (error) {
        console.error(`Error creating tag ${tagName}:`, error);
      }
    }

    // Then create all blog posts
    for (const { blog, tags } of mallorcanBlogContent) {
      try {
        // Check if blog already exists
        const [existingBlog] = await db
          .select()
          .from(blogsTable)
          .where(eq(blogsTable.slug, blog.slug))
          .limit(1);

        let blogId: string;

        if (existingBlog) {
          blogId = existingBlog.id;
          console.log(`Blog "${blog.title}" already exists, skipping...`);
        } else {
          const [newBlog] = await db.insert(blogsTable).values(blog).returning();
          blogId = newBlog.id;
          console.log(`Created blog: ${blog.title}`);
        }

        // Add tags to blog
        for (const tagName of tags) {
          const tagId = createdTags[tagName];
          if (tagId) {
            try {
              await db.insert(blogToTagTable).values({
                blogId,
                tagId
              });
                    } catch (error) {
          // Ignore duplicate tag relations
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes('duplicate')) {
            console.error(`Error adding tag ${tagName} to blog:`, error);
          }
        }
          }
        }

      } catch (error) {
        console.error(`Error creating blog "${blog.title}":`, error);
      }
    }

    return {
      isSuccess: true,
      message: "Blog content seeded successfully with 4 tourism guides",
      data: undefined
    };

  } catch (error) {
    console.error("Error seeding blog content:", error);
    return { isSuccess: false, message: "Failed to seed blog content" };
  }
} 