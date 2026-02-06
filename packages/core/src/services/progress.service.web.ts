/**
 * Progress Service (Web)
 * Handles reading progress tracking on web using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Progress, ProgressUpdate } from '../types';

const PROGRESS_KEY = '@fable:progress';

/**
 * Initialize database (no-op on web)
 */
export function initializeDatabase(): void {
  console.log('[Progress Service] Using AsyncStorage for web');
}

/**
 * Save or update reading progress
 */
export async function saveProgress(update: ProgressUpdate): Promise<boolean> {
  try {
    const { storyId, sentenceIndex, totalSentences } = update;

    // Calculate percentage
    const percentage = Math.round((sentenceIndex / totalSentences) * 100);
    const now = new Date().toISOString();
    const completedAt = percentage === 100 ? now : null;

    const progress: Progress = {
      storyId,
      lastSentenceIndex: sentenceIndex,
      percentage,
      lastReadAt: now,
      completedAt: completedAt || undefined,
    };

    const allProgress = await getAllProgress();
    allProgress[storyId] = progress;
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));

    console.log('[Progress Service] Progress saved successfully');
    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to save progress', error);
    return false;
  }
}

/**
 * Get progress for a specific story
 */
export async function getProgress(storyId: string): Promise<Progress | null> {
  try {
    const allProgress = await getAllProgress();
    return allProgress[storyId] || null;
  } catch (error) {
    console.error('[Progress Service] Failed to get progress', error);
    return null;
  }
}

/**
 * Get all progress records
 */
export async function getAllProgress(): Promise<Record<string, Progress>> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('[Progress Service] Failed to get all progress', error);
    return {};
  }
}

/**
 * Delete progress for a story
 */
export async function deleteProgress(storyId: string): Promise<boolean> {
  try {
    const allProgress = await getAllProgress();
    delete allProgress[storyId];
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to delete progress', error);
    return false;
  }
}

/**
 * Clear all progress
 */
export async function clearAllProgress(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to clear all progress', error);
    return false;
  }
}

// Initialize on module load
initializeDatabase();
