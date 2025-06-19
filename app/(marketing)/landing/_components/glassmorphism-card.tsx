"use client"

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
      className={`rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg ${className}`}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)"
      }}
    >
      {children}
    </div>
  )
}
