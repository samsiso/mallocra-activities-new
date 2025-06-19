"use client"

/*
<ai_context>
Glassmorphism Card Component
Reusable card component with glassmorphism effect used across activities pages.
Provides consistent styling with backdrop blur and semi-transparent backgrounds.
</ai_context>
*/

interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassmorphismCard({
  children,
  className = ""
}: GlassmorphismCardProps) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
