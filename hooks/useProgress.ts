/**
 * useProgress Hook
 * React hook for managing reading progress
 */

import { useState, useEffect, useCallback } from 'react';
import { getProgress, saveProgress, getAllProgress } from '@/services/progress.service';
import type { Progress, ProgressUpdate } from '@/types';

/**
 * Hook to get progress for a specific story
 */
export function useStoryProgress(storyId: string | undefined) {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (!storyId) return;

    const loadedProgress = getProgress(storyId);
    setProgress(loadedProgress);
  }, [storyId]);

  const updateProgress = useCallback(
    async (update: ProgressUpdate) => {
      const success = await saveProgress(update);
      if (success && storyId) {
        // Reload progress after save
        const updatedProgress = getProgress(storyId);
        setProgress(updatedProgress);
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

  const loadProgress = useCallback(() => {
    const allProgress = getAllProgress();
    setProgressMap(allProgress);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return { progressMap, refreshProgress: loadProgress };
}
