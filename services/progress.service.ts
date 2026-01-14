/**
 * Progress Service
 * Handles reading progress tracking with SQLite
 */

import * as SQLite from 'expo-sqlite';
import type { Progress, ProgressUpdate } from '@/types';

// Open database
const db = SQLite.openDatabaseSync('fable.db');

/**
 * Initialize database and create progress table
 */
export function initializeDatabase(): void {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS progress (
        storyId TEXT PRIMARY KEY,
        lastSentenceIndex INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        lastReadAt TEXT NOT NULL,
        completedAt TEXT
      );
    `);
    console.log('[Progress Service] Database initialized');
  } catch (error) {
    console.error('[Progress Service] Failed to initialize database', error);
  }
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

    // Upsert progress
    db.runSync(
      `INSERT INTO progress (storyId, lastSentenceIndex, percentage, lastReadAt, completedAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(storyId) DO UPDATE SET
         lastSentenceIndex = excluded.lastSentenceIndex,
         percentage = excluded.percentage,
         lastReadAt = excluded.lastReadAt,
         completedAt = excluded.completedAt;`,
      [storyId, sentenceIndex, percentage, now, completedAt]
    );

    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to save progress', error);
    return false;
  }
}

/**
 * Get progress for a specific story
 */
export function getProgress(storyId: string): Progress | null {
  try {
    const result = db.getFirstSync<Progress>(
      'SELECT * FROM progress WHERE storyId = ?',
      [storyId]
    );

    return result || null;
  } catch (error) {
    console.error('[Progress Service] Failed to get progress', error);
    return null;
  }
}

/**
 * Get all progress records
 */
export function getAllProgress(): Record<string, Progress> {
  try {
    const results = db.getAllSync<Progress>('SELECT * FROM progress');

    // Convert array to record keyed by storyId
    const progressMap: Record<string, Progress> = {};
    results.forEach((progress) => {
      progressMap[progress.storyId] = progress;
    });

    return progressMap;
  } catch (error) {
    console.error('[Progress Service] Failed to get all progress', error);
    return {};
  }
}

/**
 * Delete progress for a story
 */
export function deleteProgress(storyId: string): boolean {
  try {
    db.runSync('DELETE FROM progress WHERE storyId = ?', [storyId]);
    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to delete progress', error);
    return false;
  }
}

/**
 * Clear all progress
 */
export function clearAllProgress(): boolean {
  try {
    db.runSync('DELETE FROM progress');
    return true;
  } catch (error) {
    console.error('[Progress Service] Failed to clear all progress', error);
    return false;
  }
}

// Initialize database on module load
initializeDatabase();
