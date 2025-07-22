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
    // Skip middleware for MCP routes and OAuth metadata
    if (req.nextUrl.pathname.startsWith('/api/mcp') || 
        req.nextUrl.pathname.startsWith('/api/sse') ||
        req.nextUrl.pathname.startsWith('/api/transport') ||
        req.nextUrl.pathname.startsWith('/.well-known/')) {
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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes except MCP and well-known
    '/(api|trpc)(?!/mcp|/\\[transport\\]|/.well-known)(.*)',
    // Run for specific protected routes
    '/(todo|admin|profile|test-db)(.*)',
  ],
} 