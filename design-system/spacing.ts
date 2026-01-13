/**
 * Fable Design System - Spacing
 * Japanese Minimalist Aesthetic
 * Base unit: 4px
 */

export const spacing = {
  xs: 4,       // 0.25rem - Tiny gaps, icon spacing
  sm: 8,       // 0.5rem - Compact spacing, tight elements
  md: 12,      // 0.75rem - Default spacing between related elements
  base: 16,    // 1rem - Standard spacing, component padding
  lg: 24,      // 1.5rem - Generous spacing, section separation
  xl: 32,      // 2rem - Large spacing, major sections
  '2xl': 48,   // 3rem - Extra large spacing, page margins
  '3xl': 64,   // 4rem - Maximum spacing, hero sections
} as const;

// Component-specific spacing guidelines
export const componentSpacing = {
  // Screen padding
  screen: {
    horizontal: spacing.lg,    // 24px on phones
    verticalTop: spacing.base, // 16px at top
    verticalBottom: spacing.lg, // 24px at bottom
  },

  // Card/Surface padding
  card: {
    padding: spacing.base,     // 16px minimum internal padding
    gap: spacing.md,           // 12px between cards in tight lists
    gapComfortable: spacing.base, // 16px for comfortable spacing
    borderRadius: spacing.md,  // 12px - soft but not overly rounded
  },

  // Text spacing
  text: {
    paragraph: spacing.base,   // 16px between paragraphs
    sentencePair: spacing.sm,  // 8px between German and English
    section: spacing.xl,       // 32px between major sections
    inlineGap: spacing.sm,     // 8px between inline elements
  },

  // List spacing
  list: {
    itemHeight: 64,            // Minimum list item height (touch target)
    itemPaddingVertical: spacing.base,   // 16px vertical
    itemPaddingHorizontal: 20, // 20px horizontal (base + xs)
    dividerInset: 20,          // 20px inset from left for dividers
  },

  // Touch targets
  touchTarget: {
    minimum: 44,               // iOS minimum (44px x 44px)
    preferred: 48,             // Material Design preferred (48px x 48px)
    comfortable: 56,           // Comfortable for reading lists
  },
} as const;

// Helper function to calculate spacing
export const getSpacing = (multiplier: number): number => {
  return spacing.xs * multiplier;
};

// Margin and padding helper types
export type SpacingToken = keyof typeof spacing;
export type ComponentSpacingToken = keyof typeof componentSpacing;
