/*
<ai_context>
GlassmorphismCard component extracted from landing page.
Provides a glassmorphism effect with backdrop blur and translucent background.
Reusable for various UI elements that need elegant glass effect.
</ai_context>
*/

"use client"

interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassmorphismCard({
  children,
  className = ""
}: GlassmorphismCardProps) {
  return (
    <div
      className={`rounded-lg border border-white/20 bg-white/10 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}
