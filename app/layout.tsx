/*
<ai_context>
The root server layout for the app.
Fixed version with proper Clerk integration.
</ai_context>
*/

// Polyfills temporarily disabled to fix deployment
// import "@/lib/build-polyfills"
// import "@/lib/polyfills"

import { Toaster } from "@/components/ui/toaster"
import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import WhatsAppButton from "@/components/ui/whatsapp-button"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WE ARE EXCURSIONS",
  description: "Discover amazing activities in Mallorca."
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If no Clerk key is found, render without ClerkProvider
  if (!clerkPublishableKey) {
    return (
      <html lang="en" suppressHydrationWarning className="dark">
        <body
          className={cn(
            "mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogPageview />

            {children}

            <TailwindIndicator />

            <WhatsAppButton />

            <Toaster />
          </Providers>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning className="dark">
        <body
          className={cn(
            "mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogPageview />

            {children}

            <TailwindIndicator />

            <WhatsAppButton />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
