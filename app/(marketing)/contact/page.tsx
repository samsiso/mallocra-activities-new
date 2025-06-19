/*
<ai_context>
This server page returns a comprehensive Contact Page component as a (marketing) route.
Features beautiful gradients, contact form, and professional layouts consistent with the platform design.
</ai_context>
*/

import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PreferredFooter from "@/components/preferred-footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Globe,
  Users,
  Heart,
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function ContactPage() {
  return (
    <div className="min-h-screen bg-rose-400">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-400 via-rose-300 to-orange-900 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-6 border-none bg-orange-600 px-4 py-2 text-white">
              Get in Touch
            </Badge>

            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Let's Plan Your
              <span className="text-orange-400">
                {" "}
                Perfect Mallorca Adventure
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-300 lg:text-2xl">
              Our local experts are here to help you discover the best of
              Mallorca. Whether you need recommendations, have questions, or
              want to customize your experience, we're just a message away.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-rose-400 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        First Name
                      </label>
                      <Input
                        placeholder="Your first name"
                        className="border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Last Name
                      </label>
                      <Input
                        placeholder="Your last name"
                        className="border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Phone Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+34 123 456 789"
                      className="border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      How can we help you?
                    </label>
                    <Textarea
                      placeholder="Tell us about your ideal Mallorca experience, any questions you have, or how we can assist you..."
                      rows={5}
                      className="border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full border-none bg-orange-600 text-white hover:bg-orange-700"
                  >
                    <Send className="mr-2 size-4" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-300">
                  We're here to make your Mallorca experience unforgettable.
                  Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                {/* Office Location */}
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-full bg-orange-600 p-3">
                      <MapPin className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Visit Our Office
                      </h3>
                      <p className="text-gray-300">
                        Carrer de la Pau, 15
                        <br />
                        07001 Palma, Mallorca
                        <br />
                        Balearic Islands, Spain
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-full bg-orange-600 p-3">
                      <Phone className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">Call Us</h3>
                      <p className="text-gray-300">
                        +34 971 123 456
                        <br />
                        <span className="text-sm">
                          Monday - Sunday: 8:00 AM - 8:00 PM
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-full bg-orange-600 p-3">
                      <Mail className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Email Us
                      </h3>
                      <p className="text-gray-300">
                        hello@mallorcaactivities.com
                        <br />
                        <span className="text-sm">
                          We respond within 24 hours
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-full bg-orange-600 p-3">
                      <Clock className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Business Hours
                      </h3>
                      <div className="space-y-1 text-gray-300">
                        <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm text-orange-300">
                          Emergency support available 24/7
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-2xl font-bold text-orange-400">
                      24h
                    </div>
                    <div className="text-sm text-gray-300">Hour Response</div>
                  </CardContent>
                </Card>
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-2xl font-bold text-orange-400">
                      4.9★
                    </div>
                    <div className="text-sm text-gray-300">Customer Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-rose-400 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-12 text-lg text-gray-300">
            Quick answers to common questions about our services and Mallorca
            activities.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-white/20 bg-white/10 text-left backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  How do I book an activity?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Simply browse our activities, select your preferred date and
                  time, and complete the secure checkout process. You'll receive
                  instant confirmation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 text-left backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  What's your cancellation policy?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Free cancellation up to 24 hours before your activity. Some
                  activities may have different policies which will be clearly
                  stated.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 text-left backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Do you offer group discounts?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes! We offer special rates for groups of 8 or more. Contact
                  us directly for personalized group packages and pricing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 text-left backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Are activities suitable for children?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Many of our activities are family-friendly! Check the activity
                  details for age requirements and child-specific information.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <p className="mb-6 text-lg text-gray-300">
              Still have questions? We're here to help!
            </p>
            <Link href="/activities">
              <Button
                size="lg"
                className="border-none bg-orange-600 px-8 py-4 text-lg font-medium text-white hover:bg-orange-700"
              >
                <MessageSquare className="mr-2 size-5" />
                Start Planning Your Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PreferredFooter />
    </div>
  )
}
