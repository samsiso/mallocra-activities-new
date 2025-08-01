/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
Safe version that works without Clerk environment variables.
</ai_context>
*/

export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import PreferredFooter from "@/components/preferred-footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default async function PricingPage() {
  let userId: string | null = null

  // Check if Clerk is available
  const isClerkAvailable = !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  )

  if (isClerkAvailable) {
    try {
      // Dynamic import to avoid build errors when Clerk isn't configured
      const { auth } = await import("@clerk/nextjs/server")
      const authResult = await auth()
      userId = authResult.userId
    } catch (error) {
      console.warn("Clerk auth failed, continuing without user ID:", error)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          title="Monthly Plan"
          price="$10"
          description="Billed monthly"
          buttonText="Subscribe Monthly"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
          }
          userId={userId}
        />
        <PricingCard
          title="Yearly Plan"
          price="$100"
          description="Billed annually"
          buttonText="Subscribe Yearly"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"}
          userId={userId}
        />
      </div>

      <PreferredFooter />
    </div>
  )
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  buttonText: string
  buttonLink: string
  userId: string | null
}

function PricingCard({
  title,
  price,
  description,
  buttonText,
  buttonLink,
  userId
}: PricingCardProps) {
  const finalButtonLink = userId
    ? `${buttonLink}?client_reference_id=${userId}`
    : buttonLink

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow items-center justify-center">
        <p className="text-4xl font-bold">{price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a
            href={finalButtonLink}
            className={cn(
              "inline-flex items-center justify-center",
              finalButtonLink === "#" && "pointer-events-none opacity-50"
            )}
          >
            {buttonText}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
