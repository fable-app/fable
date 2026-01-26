/**
 * Type definitions for reading progress tracking
 */

export interface Progress {
  storyId: string;
  lastSentenceIndex: number;
  percentage: number;
  lastReadAt: string; // ISO 8601 date string
  completedAt?: string; // ISO 8601 date string when 100% complete
}

export interface ProgressUpdate {
  storyId: string;
  sentenceIndex: number;
  totalSentences: number;
}

export interface ProgressStats {
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  totalWordsRead: number;
  averageProgress: number;
}
