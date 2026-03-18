/**
 * Fable Design System - Colors
 * Based on Ignite palette with warm, elegant aesthetic
 */

// Base palette matching screenshot
const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const;

export const colors = {
  background: {
    primary: palette.neutral200,      // Main app background
    secondary: palette.neutral200,    // Same as primary for consistency
    elevated: palette.neutral100,     // Pure white for cards
    accent: palette.accent100,        // Light accent for backgrounds
    overlay: palette.overlay50,
  },

  text: {
    primary: palette.neutral800,      // Main text color
    secondary: palette.neutral600,    // Secondary text (textDim)
    tertiary: palette.neutral500,     // Subtle gray (metadata, captions)
    accent: palette.primary500,       // Primary color for interactive text
  },

  interactive: {
    default: palette.primary500,      // Primary action color
    hover: palette.primary400,        // Lighter on hover
    pressed: palette.primary600,      // Darker when pressed
    disabled: palette.neutral300,     // Light gray for disabled
  },

  progress: {
    fill: palette.primary500,         // Primary color for progress
    track: palette.neutral300,        // Light track
    complete: palette.accent500,      // Accent for completed state
  },

  divider: palette.neutral300,        // Border/separator color
  borderSubtle: palette.neutral300,   // Same as divider
  shadow: palette.neutral800,         // Shadow color for elevation
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
