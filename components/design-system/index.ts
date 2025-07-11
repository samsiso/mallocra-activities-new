/**
 * Design System Exports
 * Central export point for all design system components and tokens
 * Inlined to avoid module resolution issues in production builds
 */

// Inline design tokens to avoid import resolution issues
export const designTokens = {
  // Brand Colors
  colors: {
    brand: {
      pink: "#fb067d",
      "pink-dark": "#d9055e",
      "pink-light": "#ff3399",
      yellow: "#fff546",
      "yellow-dark": "#e6dc00",
      "yellow-light": "#ffff66"
    },
    // Glass Morphism Tokens
    glass: {
      white: {
        5: "rgba(255, 255, 255, 0.05)",
        10: "rgba(255, 255, 255, 0.10)",
        15: "rgba(255, 255, 255, 0.15)",
        20: "rgba(255, 255, 255, 0.20)",
        30: "rgba(255, 255, 255, 0.30)"
      },
      black: {
        5: "rgba(0, 0, 0, 0.05)",
        10: "rgba(0, 0, 0, 0.10)",
        20: "rgba(0, 0, 0, 0.20)",
        40: "rgba(0, 0, 0, 0.40)"
      },
      pink: {
        10: "rgba(251, 6, 125, 0.10)",
        15: "rgba(251, 6, 125, 0.15)",
        20: "rgba(251, 6, 125, 0.20)"
      }
    },
    // Semantic Colors
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6"
    },
    // Accessibility Contrast
    contrast: {
      primary: "#000000",
      secondary: "#374151",
      tertiary: "#6b7280",
      disabled: "#9ca3af",
      inverse: "#ffffff"
    }
  },

  // Typography Scale (Mobile-First)
  typography: {
    fontSize: {
      xs: "clamp(0.75rem, 2vw, 0.875rem)",
      sm: "clamp(0.875rem, 2.5vw, 1rem)",
      base: "clamp(1rem, 3vw, 1.125rem)",
      lg: "clamp(1.125rem, 3.5vw, 1.25rem)",
      xl: "clamp(1.25rem, 4vw, 1.5rem)",
      "2xl": "clamp(1.5rem, 5vw, 1.875rem)",
      "3xl": "clamp(1.875rem, 6vw, 2.25rem)",
      "4xl": "clamp(2.25rem, 7vw, 3rem)",
      "5xl": "clamp(3rem, 8vw, 3.75rem)"
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    }
  },

  // Spacing Scale
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem"
  },

  // Border Radius
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    base: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    full: "9999px"
  },

  // Shadows (with brand colors)
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "pink-glow": "0 0 20px rgba(251, 6, 125, 0.3)",
    "yellow-glow": "0 0 20px rgba(255, 245, 70, 0.4)"
  },

  // Transitions
  transitions: {
    duration: {
      fast: "150ms",
      base: "300ms",
      slow: "500ms",
      slower: "700ms"
    },
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    }
  },

  // Breakpoints
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },

  // Z-index Scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    tooltip: 70
  },

  // Animation Keyframes
  keyframes: {
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" }
    },
    glow: {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.5 }
    },
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" }
    },
    pulse: {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.5 }
    }
  }
} as const

// Default export
export default designTokens

// Type exports
export type DesignTokens = typeof designTokens
export type ColorToken = keyof typeof designTokens.colors
export type SpacingToken = keyof typeof designTokens.spacing
export type FontSizeToken = keyof typeof designTokens.typography.fontSize
