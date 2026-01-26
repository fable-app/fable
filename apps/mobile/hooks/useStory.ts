/**
 * useStory Hook
 * React hook for loading and managing story data
 */

import { useState, useEffect } from "react";

import { loadStory } from "@fable/core";
import type { Story } from "@fable/core";

interface UseStoryResult {
  story: Story | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load a story by ID
 * @param storyId - The ID of the story to load
 * @returns Story data, loading state, and error
 */
export function useStory(storyId: string | undefined): UseStoryResult {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!storyId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedStory = await loadStory(storyId);

        if (cancelled) return;

        if (loadedStory) {
          setStory(loadedStory);
        } else {
          setError(new Error(`Story not found: ${storyId}`));
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err : new Error("Failed to load story"),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStory();

    // Cleanup function to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [storyId]);

  return { story, loading, error };
}
