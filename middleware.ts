/*
<ai_context>
Modern Clerk middleware for protecting routes and handling authentication.
Uses the latest Clerk v6 middleware approach.
</ai_context>
*/

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/todo(.*)',
  '/admin(.*)',
  '/profile(.*)',
  '/test-db(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  try {
    // Explicitly skip MCP routes, debug routes, and .well-known paths
    const pathname = req.nextUrl.pathname
    if (pathname.startsWith('/api/mcp') || 
        pathname.startsWith('/api/sse') ||
        pathname.startsWith('/api/transport') ||
        pathname.includes('[transport]') ||
        pathname.startsWith('/api/debug-env') ||
        pathname.startsWith('/.well-known/')) {
      return NextResponse.next()
    }
    
    // Check if this is a protected route
    if (isProtectedRoute(req)) {
      // TEMPORARY: Allow admin access in development without authentication
      if (req.nextUrl.pathname.startsWith('/admin') && process.env.NODE_ENV === 'development') {
        return NextResponse.next()
      }
      
      // Get the auth object with await (correct v6 syntax)
      const { userId } = await auth()
      
      // If no user is signed in, redirect to sign in
      if (!userId) {
        const signInUrl = new URL('/login', req.url)
        signInUrl.searchParams.set('redirectUrl', req.url)
        return NextResponse.redirect(signInUrl)
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/mcp (MCP endpoints)
     * - api/[transport] (MCP transport endpoints)  
     * - api/debug-env (Debug endpoints)
     * - .well-known (OAuth metadata)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/mcp|api/\\[transport\\]|api/debug-env|\\.well-known|_next/static|_next/image|favicon\\.ico).*)',
  ],
} 