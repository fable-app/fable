/**
 * useProgress Hook
 * React hook for managing reading progress
 */

import { useState, useEffect, useCallback } from 'react';
import { getProgress, saveProgress, getAllProgress } from '@fable/core';
import type { Progress, ProgressUpdate } from '@fable/core';

/**
 * Hook to get progress for a specific story
 */
export function useStoryProgress(storyId: string | undefined) {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (!storyId) return;

    const loadProgress = async () => {
      const allProgress = await getAllProgress();
      setProgress(allProgress[storyId] || null);
    };

    loadProgress();
  }, [storyId]);

  const updateProgress = useCallback(
    async (update: ProgressUpdate) => {
      const success = await saveProgress(update);
      if (success && storyId) {
        const allProgress = await getAllProgress();
        setProgress(allProgress[storyId] || null);
      }
      return success;
    },
    [storyId]
  );

  return { progress, updateProgress };
}

/**
 * Hook to get all progress
 */
export function useAllProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});

  const refreshProgress = useCallback(async () => {
    const allProgress = await getAllProgress();
    setProgressMap({ ...allProgress });
  }, []);

  useEffect(() => {
    refreshProgress();
  }, []);

  return { progressMap, refreshProgress };
}

/**
 * Calculate overall progress for a multi-chapter book
 */
export function calculateBookProgress(
  bookId: string,
  chapterIds: string[],
  progressMap: Record<string, Progress>
): number {
  if (chapterIds.length === 0) return 0;

  const totalProgress = chapterIds.reduce((sum, chapterId) => {
    const chapterProgress = progressMap[chapterId]?.percentage || 0;
    return sum + chapterProgress;
  }, 0);

  return Math.round(totalProgress / chapterIds.length);
}
