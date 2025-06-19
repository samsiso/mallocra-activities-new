"use client"

/*
<ai_context>
Enhanced Landing Page Sections with 2024 Design Trends
Features scroll-triggered animations, glassmorphism, and modern visual effects.
Implements interactive storytelling and progressive content disclosure.
</ai_context>
*/

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Activity, Clock, MapPin, Award } from "lucide-react"
import Link from "next/link"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

function AnimatedSection({
  children,
  className,
  delay = 0
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function GlassmorphismCard({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-xl backdrop-blur-xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export function EnhancedPressRecognition() {
  const pressLogos = [
    "TripAdvisor Excellence",
    "Lonely Planet Recommended",
    "Travel + Leisure Top Pick",
    "Conde Nast Traveler Award"
  ]

  return (
    <AnimatedSection className="bg-gradient-to-r from-rose-100 via-white to-orange-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-8 text-sm font-medium text-gray-600">
            Recognized by Leading Travel Publications
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {pressLogos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 text-gray-700"
              >
                <Award className="size-5 text-yellow-500" />
                <span className="font-medium">{logo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

export function EnhancedDestinationShowcase() {
  const destinations = [
    {
      title: "Crystal Clear Waters",
      description:
        "Pristine beaches with turquoise waters perfect for swimming and water sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
      activities: 24
    },
    {
      title: "Rich History",
      description:
        "Explore ancient landmarks, Gothic cathedrals, and charming historic districts",
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=800&auto=format&fit=crop",
      activities: 18
    },
    {
      title: "Mountain Adventures",
      description:
        "Hiking trails with breathtaking views and outdoor adventures in the Tramuntana",
      image:
        "https://images.unsplash.com/photo-1464822759844-d150baec4168?q=80&w=800&auto=format&fit=crop",
      activities: 12
    }
  ]

  return (
    <AnimatedSection className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white">
            Explore Mallorca
          </Badge>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Discover Your Perfect Adventure
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            From pristine beaches to historic landmarks, Mallorca offers endless
            possibilities for unforgettable experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <GlassmorphismCard className="overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={destination.image}
                    alt={destination.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="mb-2 bg-yellow-500 text-black">
                      {destination.activities} Activities
                    </Badge>
                    <h3 className="text-xl font-bold">{destination.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="leading-relaxed text-gray-600">
                    {destination.description}
                  </p>
                  <motion.div
                    className="mt-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
                    >
                      Explore Activities
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export function EnhancedFeaturedActivities() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const featuredActivities = [
    {
      id: 1,
      title: "Catamaran Sunset Cruise",
      category: "Water Sports",
      location: "Palma Bay",
      duration: "3 hours",
      price: 85,
      rating: 4.9,
      reviewCount: 324,
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Serra de Tramuntana Hiking",
      category: "Adventure",
      location: "Tramuntana Mountains",
      duration: "6 hours",
      price: 65,
      rating: 4.8,
      reviewCount: 189,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Palma Old Town Walking Tour",
      category: "Cultural",
      location: "Palma de Mallorca",
      duration: "2.5 hours",
      price: 35,
      rating: 4.7,
      reviewCount: 256,
      imageUrl:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?q=80&w=800&auto=format&fit=crop"
    }
  ]

  return (
    <section
      ref={ref}
      className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-4">
        <AnimatedSection className="mb-16 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-2 text-white">
            Most Popular
          </Badge>
          <motion.h2
            className="mb-4 text-4xl font-bold text-gray-900"
            style={{ y }}
          >
            Featured Activities
          </motion.h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Hand-picked experiences that showcase the very best of what Mallorca
            has to offer
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              whileHover={{
                y: -15,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <GlassmorphismCard className="h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="size-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-white/90 text-gray-900">
                      {activity.category}
                    </Badge>
                  </div>
                  <div className="absolute right-4 top-4">
                    <motion.div
                      className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-white">
                        {activity.rating}
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {activity.title}
                  </h3>
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {activity.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {activity.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        €{activity.price}
                      </span>
                      <span className="text-gray-600"> per person</span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={`/book/${activity.id}/select`}>
                        <Button className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600">
                          Book Now
                        </Button>
                      </Link>
                    </motion.div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span>({activity.reviewCount} reviews)</span>
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.8} className="mt-12 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-4 text-lg text-white hover:from-orange-600 hover:to-yellow-600"
            >
              <Activity className="mr-2 size-5" />
              View All Activities
            </Button>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export function EnhancedTestimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      text: "Absolutely incredible experience! The catamaran sunset cruise was magical, and our guide Marco was fantastic. We'll definitely be booking again next year!",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=150&auto=format&fit=crop",
      activity: "Catamaran Sunset Cruise"
    },
    {
      name: "Michael Weber",
      location: "Berlin, Germany",
      rating: 5,
      text: "The hiking tour in Tramuntana was breathtaking. Perfect organization, beautiful routes, and amazing views. Highly recommend We Are Excursions!",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      activity: "Serra de Tramuntana Hiking"
    },
    {
      name: "Emma Thompson",
      location: "Manchester, UK",
      rating: 5,
      text: "Professional service from start to finish. The cultural tour gave us insights into Mallorca we never would have discovered on our own. Outstanding!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      activity: "Palma Cultural Tour"
    }
  ]

  return (
    <AnimatedSection className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white">
            Customer Stories
          </Badge>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            What Our Guests Say
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Real experiences from travelers who have discovered the magic of
            Mallorca with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <GlassmorphismCard className="h-full p-8">
                <div className="mb-6 flex items-center gap-4">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="size-16 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                    <div className="mt-1 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className="mb-4 leading-relaxed text-gray-700">
                  "{testimonial.text}"
                </blockquote>

                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-xs text-blue-700"
                >
                  {testimonial.activity}
                </Badge>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export function EnhancedStatsBar() {
  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: Users },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "100+", label: "Unique Activities", icon: Activity },
    { number: "24/7", label: "Customer Support", icon: Award }
  ]

  return (
    <AnimatedSection className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="text-center text-white"
            >
              <motion.div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="size-8" />
              </motion.div>
              <motion.div
                className="mb-2 text-3xl font-bold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="font-medium text-white/90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
