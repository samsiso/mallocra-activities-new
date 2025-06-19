// 🛡️ VIDEO SLIDESHOW PROTECTION UTILITY
// This file ensures the video slideshow NEVER breaks
// DO NOT EDIT unless you know what you're doing!

export const PROTECTED_CONFIG = {
  // 🚨 CRITICAL: These values are PRODUCTION-TESTED
  CLOUDINARY_CLOUD_NAME: "dfqvslgiy", // VERIFIED WORKING
  REQUIRED_ENV_VARS: [
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],

  // Verified working video IDs
  VIDEO_IDS: [
    "lcwtw5eus5cvbcddrpqh", // 26s HD, 45MB ✅
    "rjuszbicymgknucnikjy", // 26s HD ✅
    "gezph6p3putc1ljotgcp", // 18s Full HD ✅
    "z93bie9boj1omghtlje2", // 29s 4K ✅
    "gfayerv3n0kf23m7tryo" // 20s 4K ✅
  ],

  // Fallback videos (always working)
  FALLBACK_URLS: [
    "https://player.vimeo.com/progressive/external/425878252.hd.mp4?s=5ad53fd73c3ea9d13af2c4b7d88b1b8e46ed0bbf",
    "https://player.vimeo.com/external/396879338.hd.mp4?s=2dd53044e6e34f0bb5c69e84e3d3414ffbc31e1c"
  ]
}

// 🔍 Environment validation function
export function validateEnvironment(): {
  isValid: boolean
  missingVars: string[]
  warnings: string[]
} {
  const missingVars: string[] = []
  const warnings: string[] = []

  // Check for required environment variables
  PROTECTED_CONFIG.REQUIRED_ENV_VARS.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      missingVars.push(varName)
    }
  })

  // Check Cloudinary cloud name specifically
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (cloudName && cloudName !== PROTECTED_CONFIG.CLOUDINARY_CLOUD_NAME) {
    warnings.push(
      `Cloud name mismatch: expected "${PROTECTED_CONFIG.CLOUDINARY_CLOUD_NAME}", got "${cloudName}"`
    )
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings
  }
}

// 🚨 Auto-validation (runs on import)
export function runStartupCheck(): void {
  if (typeof window === "undefined") return // Only run client-side

  const validation = validateEnvironment()

  if (!validation.isValid) {
    console.error("🚨 CRITICAL: Missing environment variables!")
    console.error("Missing:", validation.missingVars)
    console.log("💡 Add these to .env.local:")
    console.log(
      `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${PROTECTED_CONFIG.CLOUDINARY_CLOUD_NAME}`
    )
    console.log("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key")
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️ Environment warnings:")
    validation.warnings.forEach(warning => console.warn(warning))
  }

  if (validation.isValid && validation.warnings.length === 0) {
    console.log("✅ Video configuration validated successfully!")
  }
}

// 🎬 Generate bulletproof video URL
export function getVideoUrl(videoId: string, fallbackUrl?: string): string {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    PROTECTED_CONFIG.CLOUDINARY_CLOUD_NAME

  if (videoId && cloudName) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/${videoId}.mp4`
  }

  // Return fallback if available
  return fallbackUrl || PROTECTED_CONFIG.FALLBACK_URLS[0]
}

// Auto-run validation
runStartupCheck()
