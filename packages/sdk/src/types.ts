/**
 * SDK Type Definitions
 * Public API types for the Fable SDK
 */

import type { Story, Progress } from '@fable/core';

export interface FableSDKProps {
  /**
   * Custom theme configuration
   */
  theme?: FableTheme;

  /**
   * Callback fired when a story is completed
   */
  onStoryComplete?: (storyId: string, progress: Progress) => void;

  /**
   * Callback fired when a story is started
   */
  onStoryStart?: (storyId: string) => void;

  /**
   * Custom stories to display instead of default ones
   */
  customStories?: Story[];

  /**
   * Whether to use default stories (true by default)
   */
  useDefaultStories?: boolean;

  /**
   * Analytics provider for tracking events
   */
  analyticsProvider?: AnalyticsProvider;
}

export interface FableTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    textSecondary?: string;
    divider?: string;
  };
  fonts?: {
    regular?: string;
    medium?: string;
    semibold?: string;
  };
  spacing?: {
    sm?: number;
    base?: number;
    lg?: number;
    xl?: number;
  };
  branding?: {
    appName?: string;
    hideDefaultBranding?: boolean;
  };
}

export interface AnalyticsProvider {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackScreenView: (screenName: string) => void;
}

// Re-export core types
export type { Story, Progress };
