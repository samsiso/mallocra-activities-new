/*
<ai_context>
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
Ultra-defensive implementation that works even without any environment variables configured.
</ai_context>
*/

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes (only /todo for now)
const PROTECTED_ROUTES = ["/todo", "/admin"]

// Ultra-defensive middleware that works in ANY environment
export default function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Check if this is a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    )

    // If not a protected route, always allow
    if (!isProtectedRoute) {
      return NextResponse.next()
    }

    // For protected routes, check if we have Clerk configured
    const hasClerkKeys = Boolean(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      process.env.CLERK_SECRET_KEY
    )

    // If Clerk is not configured, redirect to home with a message
    if (!hasClerkKeys) {
      console.warn("Protected route accessed but Clerk not configured - redirecting to home")
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('auth_required', 'true')
      return NextResponse.redirect(homeUrl)
    }

    // Only try to use Clerk if we have the environment variables
    try {
      // Dynamic import of Clerk to avoid build issues
      const clerkMiddleware = require("@clerk/nextjs/server").clerkMiddleware
      const createRouteMatcher = require("@clerk/nextjs/server").createRouteMatcher
      
      const isProtected = createRouteMatcher(PROTECTED_ROUTES)
      
      return clerkMiddleware(async (auth: any, req: NextRequest) => {
        try {
          const { userId, redirectToSignIn } = await auth()
          
          if (!userId && isProtected(req)) {
            return redirectToSignIn({ returnBackUrl: "/login" })
          }
          
          return NextResponse.next()
        } catch (authError) {
          console.warn("Auth error in Clerk middleware:", authError)
          // If auth fails, redirect to home
          return NextResponse.redirect(new URL('/', req.url))
        }
      })(request)
      
    } catch (clerkError) {
      console.warn("Clerk middleware error:", clerkError)
      // If Clerk fails completely, redirect protected routes to home
      if (isProtectedRoute) {
        const homeUrl = new URL('/', request.url)
        homeUrl.searchParams.set('auth_error', 'true')
        return NextResponse.redirect(homeUrl)
      }
      return NextResponse.next()
    }

  } catch (error) {
    // Ultimate fallback - log error and continue
    console.error("Middleware completely failed:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
