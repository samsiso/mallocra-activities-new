"use client"

/**
 * Client Design Variant System - Context Provider
 *
 * Revolutionary client feedback system that allows real-time design variant switching
 * Eliminates traditional back-and-forth revision process with instant visual feedback
 *
 * Features:
 * - Real-time component variant switching
 * - URL sharing of specific variant combinations
 * - Smooth animations between variants
 * - Client-friendly interface for design selection
 * - Professional presentation without multiple deployments
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

// Define all available variant options for each component
interface VariantConfig {
  // Header styling variants
  header: "glass" | "solid" | "gradient"

  // Hero section variants
  hero: "video" | "image" | "interactive"

  // Background styling variants
  background: "dark" | "gradient" | "animated"

  // Overall color scheme variants
  colorScheme: "pink-red" | "blue-purple" | "green-yellow"

  // Typography variants
  typography: "bold" | "elegant" | "modern"

  // Button style variants
  buttons: "rounded" | "sharp" | "pill"
}

// Default variant configuration (current production design)
const defaultVariants: VariantConfig = {
  header: "glass", // Current glass morphism header
  hero: "video", // Current video background hero
  background: "dark", // Current dark gradient background
  colorScheme: "pink-red", // Current pink-red brand colors
  typography: "bold", // Current bold typography
  buttons: "rounded" // Current rounded buttons
}

// Context interface for variant management
interface VariantContextType {
  variants: VariantConfig
  setVariant: (component: keyof VariantConfig, variant: string) => void
  resetVariants: () => void
  getShareableUrl: () => string
  isVariantSelectorOpen: boolean
  setVariantSelectorOpen: (open: boolean) => void
  isDevMode: boolean
  setDevMode: (enabled: boolean) => void
}

// Create the context
const VariantContext = createContext<VariantContextType | undefined>(undefined)

interface VariantProviderProps {
  children: ReactNode
}

export function VariantProvider({ children }: VariantProviderProps) {
  const [variants, setVariants] = useState<VariantConfig>(defaultVariants)
  const [isVariantSelectorOpen, setVariantSelectorOpen] = useState(false)
  const [isDevMode, setDevMode] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Load variants from URL parameters on component mount
  useEffect(() => {
    const variantParam = searchParams.get("variants")
    const devModeParam = searchParams.get("dev")

    // Enable dev mode if dev parameter is present
    if (devModeParam === "true") {
      setDevMode(true)
    }

    // Load variant configuration from URL
    if (variantParam) {
      try {
        const urlVariants = JSON.parse(atob(variantParam))
        setVariants({ ...defaultVariants, ...urlVariants })
      } catch (error) {
        console.warn("Invalid variant URL parameter:", error)
        setVariants(defaultVariants)
      }
    }
  }, [searchParams])

  // Update a specific component variant
  const setVariant = (component: keyof VariantConfig, variant: string) => {
    setVariants(prev => ({
      ...prev,
      [component]: variant as any
    }))

    // Optional: Auto-update URL with new variant combination
    if (isDevMode) {
      updateUrlWithVariants({ ...variants, [component]: variant as any })
    }
  }

  // Reset all variants to default values
  const resetVariants = () => {
    setVariants(defaultVariants)
    if (isDevMode) {
      updateUrlWithVariants(defaultVariants)
    }
  }

  // Update URL with current variant configuration for sharing
  const updateUrlWithVariants = (variantConfig: VariantConfig) => {
    const variantString = btoa(JSON.stringify(variantConfig))
    const url = new URL(window.location.href)
    url.searchParams.set("variants", variantString)
    if (isDevMode) {
      url.searchParams.set("dev", "true")
    }

    // Update URL without page reload
    window.history.replaceState({}, "", url.toString())
  }

  // Generate shareable URL with current variant configuration
  const getShareableUrl = () => {
    const variantString = btoa(JSON.stringify(variants))
    const url = new URL(window.location.origin + pathname)
    url.searchParams.set("variants", variantString)
    if (isDevMode) {
      url.searchParams.set("dev", "true")
    }
    return url.toString()
  }

  const contextValue: VariantContextType = {
    variants,
    setVariant,
    resetVariants,
    getShareableUrl,
    isVariantSelectorOpen,
    setVariantSelectorOpen,
    isDevMode,
    setDevMode
  }

  return (
    <VariantContext.Provider value={contextValue}>
      {children}
    </VariantContext.Provider>
  )
}

// Custom hook to use variant context
export const useVariants = () => {
  const context = useContext(VariantContext)
  if (!context) {
    throw new Error("useVariants must be used within a VariantProvider")
  }
  return context
}

// Utility hook for individual component variants
export const useComponentVariant = (component: keyof VariantConfig) => {
  const { variants, setVariant } = useVariants()

  return {
    current: variants[component],
    set: (variant: string) => setVariant(component, variant),
    is: (variant: string) => variants[component] === variant
  }
}

// Type exports for use in components
export type { VariantConfig, VariantContextType }
export { defaultVariants }
