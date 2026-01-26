/**
 * Theme Configuration
 * Utilities for creating and merging custom themes
 */

import { colors as defaultColors } from '@fable/design-system';
import type { FableTheme } from '../types';

/**
 * Create a complete theme by merging custom theme with defaults
 */
export function createTheme(customTheme?: Partial<FableTheme>): FableTheme {
  if (!customTheme) {
    return getDefaultTheme();
  }

  const defaultTheme = getDefaultTheme();

  return {
    colors: {
      ...defaultTheme.colors,
      ...customTheme.colors,
    },
    fonts: {
      ...defaultTheme.fonts,
      ...customTheme.fonts,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...customTheme.spacing,
    },
    branding: {
      ...defaultTheme.branding,
      ...customTheme.branding,
    },
  };
}

/**
 * Get the default Fable theme
 */
export function getDefaultTheme(): FableTheme {
  return {
    colors: {
      primary: defaultColors.interactive.default,
      secondary: defaultColors.background.secondary,
      accent: defaultColors.text.accent,
      background: defaultColors.background.primary,
      text: defaultColors.text.primary,
      textSecondary: defaultColors.text.secondary,
      divider: defaultColors.divider,
    },
    fonts: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
    },
    spacing: {
      sm: 8,
      base: 16,
      lg: 24,
      xl: 32,
    },
    branding: {
      appName: 'Fable',
      hideDefaultBranding: false,
    },
  };
}

/**
 * Validate theme configuration
 */
export function validateTheme(theme: FableTheme): boolean {
  // Basic validation - ensure required properties exist
  if (!theme.colors || !theme.fonts || !theme.spacing) {
    console.warn('[Fable SDK] Invalid theme: missing required properties');
    return false;
  }

  return true;
}
