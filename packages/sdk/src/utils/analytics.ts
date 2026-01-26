/**
 * Analytics Utilities
 * Helper functions for tracking events and screen views
 */

import type { AnalyticsProvider } from '../types';

/**
 * Track a story start event
 */
export function trackStoryStart(
  analyticsProvider: AnalyticsProvider | undefined,
  storyId: string,
  onStoryStart?: (storyId: string) => void
) {
  // Call user callback
  if (onStoryStart) {
    onStoryStart(storyId);
  }

  // Track analytics
  if (analyticsProvider) {
    analyticsProvider.trackEvent('story_started', {
      storyId,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track a story complete event
 */
export function trackStoryComplete(
  analyticsProvider: AnalyticsProvider | undefined,
  storyId: string,
  progress: any,
  onStoryComplete?: (storyId: string, progress: any) => void
) {
  // Call user callback
  if (onStoryComplete) {
    onStoryComplete(storyId, progress);
  }

  // Track analytics
  if (analyticsProvider) {
    analyticsProvider.trackEvent('story_completed', {
      storyId,
      percentage: progress?.percentage,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track screen view
 */
export function trackScreenView(
  analyticsProvider: AnalyticsProvider | undefined,
  screenName: string,
  params?: Record<string, any>
) {
  if (analyticsProvider) {
    analyticsProvider.trackScreenView(screenName);

    if (params) {
      analyticsProvider.trackEvent('screen_viewed', {
        screenName,
        ...params,
      });
    }
  }
}

/**
 * Track audio playback event
 */
export function trackAudioEvent(
  analyticsProvider: AnalyticsProvider | undefined,
  action: 'play' | 'pause' | 'next' | 'previous',
  storyId: string,
  sentenceIndex: number
) {
  if (analyticsProvider) {
    analyticsProvider.trackEvent(`audio_${action}`, {
      storyId,
      sentenceIndex,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track reading speed change
 */
export function trackReadingSpeedChange(
  analyticsProvider: AnalyticsProvider | undefined,
  speed: number
) {
  if (analyticsProvider) {
    analyticsProvider.trackEvent('reading_speed_changed', {
      speed,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track language order change
 */
export function trackLanguageOrderChange(
  analyticsProvider: AnalyticsProvider | undefined,
  germanFirst: boolean
) {
  if (analyticsProvider) {
    analyticsProvider.trackEvent('language_order_changed', {
      germanFirst,
      timestamp: new Date().toISOString(),
    });
  }
}
