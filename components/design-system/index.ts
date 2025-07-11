/**
 * Design System Exports
 * Central export point for all design system components and tokens
 */

// Use absolute import to avoid module resolution issues
import { designTokens } from "@/components/design-system/tokens"
export { designTokens }
export type {
  DesignTokens,
  ColorToken,
  SpacingToken,
  FontSizeToken
} from "@/components/design-system/tokens"
export default designTokens
