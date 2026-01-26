/**
 * Fable Design System - Typography
 * Japanese Minimalist Aesthetic
 */

export const typography = {
  fonts: {
    ui: 'Inter',             // Clean sans-serif for UI elements
    reading: 'Literata',     // Serif font optimized for long-form reading
  },

  sizes: {
    displayLarge: 32,        // 2rem - Book titles on detail screens
    display: 28,             // 1.75rem - Book titles in collection
    headingLarge: 24,        // 1.5rem - Section headings
    heading: 20,             // 1.25rem - Component headings
    bodyLarge: 18,           // 1.125rem - German sentences
    body: 16,                // 1rem - English translations, UI text
    bodySmall: 14,           // 0.875rem - Captions, metadata
    label: 12,               // 0.75rem - Tiny labels, progress %
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
  },

  lineHeights: {
    tight: 1.2,              // For display text
    normal: 1.3,             // For headings
    relaxed: 1.5,            // For standard body text
    loose: 1.6,              // For reading content (generous breathing room)
  },

  letterSpacing: {
    tighter: -0.02,          // em - For large text
    tight: -0.01,            // em - For headings
    normal: 0,               // em - Default for reading
    wide: 0.01,              // em - For small text
    wider: 0.02,             // em - For tiny labels
  },
} as const;

// Predefined text styles for common use cases
export const textStyles = {
  // Display styles
  displayLarge: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.displayLarge,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.displayLarge * typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },

  display: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.display * typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },

  // Heading styles
  headingLarge: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.headingLarge * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.tight,
  },

  heading: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.heading * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.tight,
  },

  // Reading content styles
  german: {
    fontFamily: typography.fonts.reading,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.loose,
    letterSpacing: typography.letterSpacing.normal,
  },

  english: {
    fontFamily: typography.fonts.reading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  // UI text styles
  bodyLarge: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  body: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  bodySmall: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.bodySmall * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wide,
  },

  label: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.label * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wider,
  },

  // Button styles
  button: {
    fontFamily: typography.fonts.ui,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.body * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
} as const;

// Typography types for TypeScript
export type FontFamily = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes;
export type FontWeight = keyof typeof typography.weights;
export type LineHeight = keyof typeof typography.lineHeights;
export type LetterSpacing = keyof typeof typography.letterSpacing;
export type TextStyle = keyof typeof textStyles;
