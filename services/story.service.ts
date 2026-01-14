/**
 * Story Service
 * Handles loading and managing story data
 */

import type { Story, StoryMetadata } from '@/types';

// Import manifest
import manifestData from '@/data/manifest.json';

// Static imports for all stories (required for Metro bundler)
import story01 from '@/data/stories/story-01.json';
import story02 from '@/data/stories/story-02.json';
import story03 from '@/data/stories/story-03.json';
import story04 from '@/data/stories/story-04.json';
import story05 from '@/data/stories/story-05.json';
import story06 from '@/data/stories/story-06.json';
import story07 from '@/data/stories/story-07.json';
import story08 from '@/data/stories/story-08.json';
import story09 from '@/data/stories/story-09.json';
import story10 from '@/data/stories/story-10.json';

// Type-cast manifest to ensure proper types
const manifest = manifestData as { version: string; lastUpdated: string; stories: StoryMetadata[] };

// Story map for efficient lookup
const storyMap: Record<string, Story> = {
  'story-01': story01 as Story,
  'story-02': story02 as Story,
  'story-03': story03 as Story,
  'story-04': story04 as Story,
  'story-05': story05 as Story,
  'story-06': story06 as Story,
  'story-07': story07 as Story,
  'story-08': story08 as Story,
  'story-09': story09 as Story,
  'story-10': story10 as Story,
};

// Cache for loaded stories
const storyCache = new Map<string, Story>();

/**
 * Get all story metadata
 */
export function getAllStoryMetadata(): StoryMetadata[] {
  return manifest.stories;
}

/**
 * Get story metadata by ID
 */
export function getStoryMetadata(storyId: string): StoryMetadata | undefined {
  return manifest.stories.find((story) => story.id === storyId);
}

/**
 * Load a story by ID
 * Returns from cache if already loaded
 */
export async function loadStory(storyId: string): Promise<Story | null> {
  // Check cache first
  if (storyCache.has(storyId)) {
    return storyCache.get(storyId)!;
  }

  try {
    // Get story from static imports
    const story = storyMap[storyId];

    if (!story) {
      console.error(`Story not found: ${storyId}`);
      return null;
    }

    // Cache the story
    storyCache.set(storyId, story);

    return story;
  } catch (error) {
    console.error(`Failed to load story: ${storyId}`, error);
    return null;
  }
}

/**
 * Get stories by difficulty level
 */
export function getStoriesByDifficulty(difficulty: string): StoryMetadata[] {
  return manifest.stories.filter((story) => story.difficulty === difficulty);
}

/**
 * Search stories by title or author
 */
export function searchStories(query: string): StoryMetadata[] {
  const lowerQuery = query.toLowerCase();
  return manifest.stories.filter(
    (story) =>
      story.titleGerman.toLowerCase().includes(lowerQuery) ||
      story.titleEnglish.toLowerCase().includes(lowerQuery) ||
      story.author.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Clear story cache
 */
export function clearStoryCache(): void {
  storyCache.clear();
}
