/*
<ai_context>
This server page returns a simple "About Page" component as a (marketing) route.
</ai_context>
*/

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PreferredFooter from "@/components/preferred-footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  MapPin,
  Users,
  Shield,
  Award,
  Heart,
  Leaf,
  Star,
  Clock,
  CheckCircle,
  Camera,
  Globe,
  Phone
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-rose-400">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-400 via-rose-300 to-orange-900 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit border-none bg-orange-600 px-4 py-2 text-white">
                Local Mallorca Experts Since 2018
              </Badge>

              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Your Gateway to
                <span className="text-orange-400"> Authentic Mallorca</span>
              </h1>

              <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
                We're not just another booking platform. We're passionate locals
                who live and breathe Mallorca, curating extraordinary
                experiences that showcase the real magic of our island paradise.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/activities">
                  <Button
                    size="lg"
                    className="border-none bg-orange-600 px-8 py-4 text-lg font-medium text-white hover:bg-orange-700"
                  >
                    Explore Our Activities
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-gray-900"
                  >
                    Get Personal Recommendations
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative h-96 overflow-hidden rounded-xl lg:h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1516491266871-56c62e8e2e4f?q=80&w=800&auto=format&fit=crop"
                  alt="Beautiful Mallorca coastline"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3">
                    <Users className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      50,000+
                    </div>
                    <div className="text-sm text-gray-600">Happy Travelers</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 -top-6 rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Star className="size-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      4.9/5
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-rose-400 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Our Story: Born from Island Love
              </h2>

              <div className="space-y-6 text-gray-300">
                <p className="text-lg">
                  Founded in 2018 by Maria Gonzalez and James Mitchell, Mallorca
                  Activities was born from a simple idea: share the hidden gems
                  and authentic experiences that make Mallorca truly special.
                </p>

                <p>
                  As long-time island residents—Maria born in Palma and James
                  who moved here 15 years ago—we were frustrated seeing visitors
                  miss out on the real Mallorca. Too many tourists were
                  experiencing generic, overcrowded activities instead of the
                  magical experiences we knew existed.
                </p>

                <p>
                  Today, we work exclusively with local operators who share our
                  values: authenticity, sustainability, and genuine passion for
                  showcasing Mallorca's natural beauty and rich culture.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-orange-400">
                    200+
                  </div>
                  <div className="text-sm text-gray-400">
                    Curated Activities
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-orange-400">
                    15+
                  </div>
                  <div className="text-sm text-gray-400">Local Partners</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 overflow-hidden rounded-xl lg:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop"
                  alt="Mallorca old town streets"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="bg-rose-300 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Why We're Different
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              We don't just sell activities—we craft authentic Mallorcan
              experiences with uncompromising standards.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Local Expertise */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-orange-600 p-3">
                  <MapPin className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">
                  100% Local Expertise
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Every activity is personally tested by our local team. We know
                  every beach, every trail, every hidden spot.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quality Standards */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-blue-600 p-3">
                  <Shield className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">
                  Rigorous Safety Standards
                </CardTitle>
                <CardDescription className="text-gray-400">
                  All partners are licensed, insured, and regularly audited.
                  Your safety is our top priority.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Sustainability */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-green-600 p-3">
                  <Leaf className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">
                  Sustainable Tourism
                </CardTitle>
                <CardDescription className="text-gray-400">
                  We partner only with eco-conscious operators who respect
                  Mallorca's natural environment.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Personal Service */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-purple-600 p-3">
                  <Heart className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">Personal Touch</CardTitle>
                <CardDescription className="text-gray-400">
                  Real humans, real recommendations. Call us for personalized
                  advice from locals who care.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Instant Confirmation */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-yellow-600 p-3">
                  <Clock className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">
                  Instant Confirmation
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Book with confidence. Instant confirmations, real-time
                  availability, no waiting around.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Best Price Promise */}
            <Card className="border-yellow-300 bg-rose-500 shadow-xl shadow-rose-600/50">
              <CardHeader>
                <div className="mb-4 w-fit rounded-full bg-red-600 p-3">
                  <Award className="size-6 text-white" />
                </div>
                <CardTitle className="text-white">Best Price Promise</CardTitle>
                <CardDescription className="text-gray-400">
                  Find it cheaper elsewhere? We'll match it. Quality experiences
                  at fair prices, guaranteed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Promises Section */}
      <section className="bg-rose-400 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
                Our Promises to You
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="mt-1 size-6 text-green-500" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Authentic Experiences Only
                    </h3>
                    <p className="text-gray-400">
                      No tourist traps. Every activity showcases the real
                      Mallorca that locals love.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="mt-1 size-6 text-green-500" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      24/7 Support
                    </h3>
                    <p className="text-gray-400">
                      Questions? Problems? Our local team is always here to
                      help, even on weekends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="mt-1 size-6 text-green-500" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      100% Satisfaction Guarantee
                    </h3>
                    <p className="text-gray-400">
                      If you're not completely happy, we'll make it right or
                      provide a full refund.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="mt-1 size-6 text-green-500" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Sustainable Practices
                    </h3>
                    <p className="text-gray-400">
                      All our partners follow strict environmental guidelines to
                      preserve Mallorca's beauty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 overflow-hidden rounded-xl lg:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop"
                  alt="Crystal clear Mallorca waters"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="bg-rose-300 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Awards & Recognition
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Our commitment to excellence has been recognized by industry
              leaders and travelers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-yellow-100">
                <Award className="size-10 text-yellow-600" />
              </div>
              <h3 className="mb-2 font-bold text-white">TripAdvisor</h3>
              <p className="text-sm text-gray-400">Travelers' Choice 2023</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-blue-100">
                <Globe className="size-10 text-blue-600" />
              </div>
              <h3 className="mb-2 font-bold text-white">Booking.com</h3>
              <p className="text-sm text-gray-400">Guest Review Award</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-100">
                <Leaf className="size-10 text-green-600" />
              </div>
              <h3 className="mb-2 font-bold text-white">Green Tourism</h3>
              <p className="text-sm text-gray-400">
                Sustainability Certificate
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-orange-100">
                <Camera className="size-10 text-orange-600" />
              </div>
              <h3 className="mb-2 font-bold text-white">GetYourGuide</h3>
              <p className="text-sm text-gray-400">Partner Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonial */}
      <section className="bg-rose-400 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-8 fill-orange-500 text-orange-500"
              />
            ))}
          </div>

          <blockquote className="mb-8 text-2xl italic text-white md:text-3xl">
            "This isn't just a booking platform—it's like having a local friend
            who knows all the best spots. Maria personally called us with
            recommendations, and every single activity exceeded our
            expectations. This is how travel should be!"
          </blockquote>

          <div className="mx-auto flex items-center justify-center gap-4">
            <div className="size-16 overflow-hidden rounded-full bg-gray-600">
              <Image
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop"
                alt="Sarah Chen"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Sarah Chen</div>
              <div className="text-gray-400">Singapore • Family of 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Discover the Real Mallorca?
          </h2>
          <p className="mb-8 text-xl text-orange-100">
            Let our local experts help you create unforgettable memories. Get
            personalized recommendations or browse our curated collection of
            authentic experiences.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button
                size="lg"
                className="border-none bg-white px-8 py-4 text-lg font-medium text-orange-600 hover:bg-gray-100"
              >
                <Phone className="mr-2 size-5" />
                Get Personal Recommendations
              </Button>
            </Link>

            <Link href="/activities">
              <Button
                size="lg"
                variant="outline"
                className="border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-orange-600"
              >
                Browse All Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PreferredFooter />
    </div>
  )
}
