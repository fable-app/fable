/**
 * Story Provider
 * Manages custom and default stories for the SDK
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { getAllStoryMetadata } from '@fable/core';
import type { Story, StoryMetadata } from '@fable/core';

interface StoryProviderValue {
  customStories?: Story[];
  useDefaultStories: boolean;
  getAllStories: () => StoryMetadata[];
}

const StoryContext = createContext<StoryProviderValue | null>(null);

interface StoryProviderProps {
  customStories?: Story[];
  useDefaultStories?: boolean;
  children: ReactNode;
}

export function StoryProvider({
  customStories,
  useDefaultStories = true,
  children,
}: StoryProviderProps) {
  const getAllStories = (): StoryMetadata[] => {
    const defaultStories = useDefaultStories ? getAllStoryMetadata() : [];

    if (!customStories || customStories.length === 0) {
      return defaultStories;
    }

    // Convert custom stories to metadata format
    const customMetadata: StoryMetadata[] = customStories.map((story) => ({
      id: story.id,
      titleGerman: story.titleGerman,
      titleEnglish: story.titleEnglish,
      author: story.author || 'Unknown',
      wordCount: story.sentences?.length || 0,
      difficulty: story.difficulty || 'beginner',
      isMultiChapter: false,
    }));

    // Combine custom and default stories
    return [...customMetadata, ...defaultStories];
  };

  const value: StoryProviderValue = {
    customStories,
    useDefaultStories,
    getAllStories,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

/**
 * Hook to access story provider
 */
export function useStoryProvider() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStoryProvider must be used within StoryProvider');
  }
  return context;
}
