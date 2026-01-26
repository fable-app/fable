/**
 * @fable/sdk
 * White-label German learning SDK for React Native apps
 */

// Main component
export { FableSDK } from './FableSDK';

// Types
export type {
  FableSDKProps,
  FableTheme,
  AnalyticsProvider,
  Story,
  Progress,
} from './types';

// Re-export useful core functions for advanced usage
export {
  loadStory,
  getAllStoryMetadata,
  getStoryMetadata,
  getProgress,
  saveProgress,
  getAllProgress,
  deleteProgress,
  clearAllProgress,
  initializeDatabase,
} from '@fable/core';

export type {
  StoryMetadata,
  ChapterMetadata,
  Sentence,
  ProgressUpdate,
} from '@fable/core';
