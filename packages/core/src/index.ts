/**
 * @fable/core - Shared business logic and data
 * Core package for Fable language learning platform
 */

// Types
export * from './types';
export * from './types/story.types';
export * from './types/progress.types';

// Services
export {
  loadStory,
  getAllStoryMetadata,
  getStoryMetadata
} from './services/story.service';

export {
  getProgress,
  saveProgress,
  getAllProgress,
  deleteProgress,
  clearAllProgress,
  initializeDatabase
} from './services/progress.service';

// Data
export { default as manifest } from './data/manifest.json';
