/**
 * Story Service
 * Handles loading and managing story data
 */

// Import manifest
import manifestData from "@/data/manifest.json";

// Static imports for all stories (required for Metro bundler)
import aliceImWunderlandCh1 from "@/data/stories/alice-im-wunderland-ch1.json";
import aliceImWunderlandCh10 from "@/data/stories/alice-im-wunderland-ch10.json";
import aliceImWunderlandCh11 from "@/data/stories/alice-im-wunderland-ch11.json";
import aliceImWunderlandCh12 from "@/data/stories/alice-im-wunderland-ch12.json";
import aliceImWunderlandCh2 from "@/data/stories/alice-im-wunderland-ch2.json";
import aliceImWunderlandCh3 from "@/data/stories/alice-im-wunderland-ch3.json";
import aliceImWunderland from "@/data/stories/alice-im-wunderland.json";
import bookKleineGeschichtenCh1 from "@/data/stories/book-kleine-geschichten-ch1.json";
import bookKleineGeschichten from '@/data/stories/book-kleine-geschichten.json';
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

// Multi-chapter book imports
import bookKleineGeschichtenCh2 from "@/data/stories/book-kleine-geschichten-ch2.json";
import aliceImWunderlandCh4 from "@/data/stories/alice-im-wunderland-ch4.json";
import aliceImWunderlandCh5 from "@/data/stories/alice-im-wunderland-ch5.json";
import aliceImWunderlandCh6 from "@/data/stories/alice-im-wunderland-ch6.json";
import aliceImWunderlandCh7 from "@/data/stories/alice-im-wunderland-ch7.json";
import aliceImWunderlandCh8 from "@/data/stories/alice-im-wunderland-ch8.json";
import aliceImWunderlandCh9 from "@/data/stories/alice-im-wunderland-ch9.json";
import type { Story, StoryMetadata } from "@/types";

// Type-cast manifest to ensure proper types
const manifest = manifestData as {
  version: string;
  lastUpdated: string;
  stories: StoryMetadata[];
};

// Story map for efficient lookup
const storyMap: Record<string, Story> = {
  "story-01": story01 as Story,
  "story-02": story02 as Story,
  "story-03": story03 as Story,
  "story-04": story04 as Story,
  "story-05": story05 as Story,
  "story-06": story06 as Story,
  "story-07": story07 as Story,
  "story-08": story08 as Story,
  "story-09": story09 as Story,
  "story-10": story10 as Story,
  // Multi-chapter book (metadata only - no sentences)
  "book-kleine-geschichten": bookKleineGeschichten as any,
  // Individual chapters (with sentences)
  "book-kleine-geschichten-ch1": bookKleineGeschichtenCh1 as Story,
  "book-kleine-geschichten-ch2": bookKleineGeschichtenCh2 as Story,
  // Alice in Wonderland (metadata only)
  "alice-im-wunderland": aliceImWunderland as any,
  // Alice chapters
  "alice-im-wunderland-ch1": aliceImWunderlandCh1 as Story,
  "alice-im-wunderland-ch2": aliceImWunderlandCh2 as Story,
  "alice-im-wunderland-ch3": aliceImWunderlandCh3 as Story,
  "alice-im-wunderland-ch4": aliceImWunderlandCh4 as Story,
  "alice-im-wunderland-ch5": aliceImWunderlandCh5 as Story,
  "alice-im-wunderland-ch6": aliceImWunderlandCh6 as Story,
  "alice-im-wunderland-ch7": aliceImWunderlandCh7 as Story,
  "alice-im-wunderland-ch8": aliceImWunderlandCh8 as Story,
  "alice-im-wunderland-ch9": aliceImWunderlandCh9 as Story,
  "alice-im-wunderland-ch10": aliceImWunderlandCh10 as Story,
  "alice-im-wunderland-ch11": aliceImWunderlandCh11 as Story,
  "alice-im-wunderland-ch12": aliceImWunderlandCh12 as Story,
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
      story.author.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Clear story cache
 */
export function clearStoryCache(): void {
  storyCache.clear();
}
