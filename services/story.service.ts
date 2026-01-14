/**
 * Story Service
 * Handles loading and managing story data
 */

import type { Story, StoryMetadata } from '@/types';

// Import manifest
import manifestData from '@/data/manifest.json';

// Type-cast manifest to ensure proper types
const manifest = manifestData as { version: string; lastUpdated: string; stories: StoryMetadata[] };

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
    // Dynamically import the story
    // In production, stories would be in data/stories/
    const story = await import(`@/data/stories/${storyId}.json`);

    // Cache the story
    storyCache.set(storyId, story.default);

    return story.default;
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
