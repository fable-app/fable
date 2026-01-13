/**
 * Application Constants
 * Reads from environment variables via Expo's Constants.expoConfig
 */

import Constants from 'expo-constants';

// Get environment from Expo config or default to development
export const ENV = Constants.expoConfig?.extra?.environment || 'development';

export const IS_DEV = ENV === 'development';
export const IS_TEST = ENV === 'test';
export const IS_PROD = ENV === 'production';

// App version
export const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

// API Configuration (when needed)
// export const API_URL = IS_PROD
//   ? 'https://api.fable.app'
//   : 'https://api-test.fable.app';

// Feature flags
export const FEATURES = {
  // Enable/disable features based on environment
  ENABLE_ANALYTICS: IS_PROD,
  ENABLE_CRASH_REPORTING: IS_TEST || IS_PROD,
  ENABLE_DEBUG_LOGS: IS_DEV,
};

// App configuration
export const APP_CONFIG = {
  // Story settings
  MAX_STORIES: 10,
  DEFAULT_FONT_SIZE: 18,

  // Progress tracking
  AUTO_SAVE_INTERVAL: 5000, // ms

  // Performance
  VIRTUALIZE_THRESHOLD: 50, // Number of sentences before virtualization
};

// Log environment on app start (dev only)
if (__DEV__) {
  console.log('[Fable] Environment:', ENV);
  console.log('[Fable] Version:', APP_VERSION);
  console.log('[Fable] Features:', FEATURES);
}
