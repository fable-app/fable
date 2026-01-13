/**
 * Fable Design System - Colors
 * Japanese Minimalist Aesthetic
 */

export const colors = {
  background: {
    primary: '#FAFAF8',      // Washi Paper - main app background
    secondary: '#F5F5F2',    // Slightly deeper warm white
    elevated: '#FFFFFF',     // Pure white for cards
    accent: '#E8EDE7',       // Very light sage for backgrounds
    overlay: 'rgba(250, 250, 248, 0.95)',
  },

  text: {
    primary: '#2C2C2C',      // Sumi Ink - soft black (German sentences, headings)
    secondary: '#6B6B6B',    // Warm gray (English translations)
    tertiary: '#9B9B98',     // Subtle gray (metadata, captions)
    accent: '#8B9D83',       // Muted sage green (interactive elements)
  },

  interactive: {
    default: '#8B9D83',      // Muted sage green
    hover: '#A8B9A0',        // Lighter sage
    pressed: '#7A8C73',      // Darker sage
    disabled: '#C8C8C6',     // Light gray
  },

  progress: {
    fill: '#C9ADA7',         // Dusty rose - progress fill
    track: '#E8E0DE',        // Light dusty rose - progress track
    complete: '#8B9D83',     // Sage green - completed state
  },

  divider: '#E8E8E6',        // Barely-there gray
  borderSubtle: '#EFEFED',   // Softer than divider
  shadow: 'rgba(44, 44, 44, 0.04)', // Subtle depth
} as const;

// Semantic color tokens for specific use cases
export const semanticColors = {
  // Background tokens
  bgPrimary: colors.background.primary,
  bgSecondary: colors.background.secondary,
  bgElevated: colors.background.elevated,
  bgAccent: colors.background.accent,
  bgOverlay: colors.background.overlay,

  // Text tokens
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textTertiary: colors.text.tertiary,
  textAccent: colors.text.accent,

  // Interactive tokens
  interactiveDefault: colors.interactive.default,
  interactiveHover: colors.interactive.hover,
  interactivePressed: colors.interactive.pressed,
  interactiveDisabled: colors.interactive.disabled,

  // Status tokens
  progressFill: colors.progress.fill,
  progressTrack: colors.progress.track,
  success: colors.progress.complete,
  info: colors.text.tertiary,
} as const;

// Color types for TypeScript
export type ColorToken = keyof typeof colors;
export type SemanticColorToken = keyof typeof semanticColors;
