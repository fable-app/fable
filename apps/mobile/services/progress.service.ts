/**
 * Progress Service
 * Handles reading progress tracking
 * Uses SQLite on native, AsyncStorage on web
 */

import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Progress, ProgressUpdate } from "@/types";

const PROGRESS_KEY = "@fable:progress";
const isWeb = Platform.OS === "web";

// SQLite instance (only on native)
let db: any = null;

/**
 * Initialize database and create progress table
 */
export function initializeDatabase(): void {
  if (isWeb) {
    console.log("[Progress Service] Using AsyncStorage for web");
    return;
  }

  try {
    // Dynamic import of SQLite only on native
    const SQLite = require("expo-sqlite");
    db = SQLite.openDatabaseSync("fable.db");

    db.execSync(`
      CREATE TABLE IF NOT EXISTS progress (
        storyId TEXT PRIMARY KEY,
        lastSentenceIndex INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        lastReadAt TEXT NOT NULL,
        completedAt TEXT
      );
    `);
    console.log("[Progress Service] SQLite database initialized");
  } catch (error) {
    console.error("[Progress Service] Failed to initialize database", error);
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

    const progress: Progress = {
      storyId,
      lastSentenceIndex: sentenceIndex,
      percentage,
      lastReadAt: now,
      completedAt: completedAt || undefined,
    };

    if (isWeb) {
      // Web: Use AsyncStorage
      const allProgress = await getAllProgress();
      allProgress[storyId] = progress;
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    } else {
      // Native: Use SQLite
      db.runSync(
        `INSERT INTO progress (storyId, lastSentenceIndex, percentage, lastReadAt, completedAt)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(storyId) DO UPDATE SET
           lastSentenceIndex = excluded.lastSentenceIndex,
           percentage = excluded.percentage,
           lastReadAt = excluded.lastReadAt,
           completedAt = excluded.completedAt;`,
        [storyId, sentenceIndex, percentage, now, completedAt],
      );
    }

    console.log("[Progress Service] Progress saved successfully");
    return true;
  } catch (error) {
    console.error("[Progress Service] Failed to save progress", error);
    return false;
  }
}

/**
 * Get progress for a specific story
 */
export function getProgress(storyId: string): Progress | null {
  try {
    if (isWeb) {
      // Web: Synchronous read not possible, return null
      // Use getAllProgress in hooks instead
      return null;
    }

    const result = db.getFirstSync("SELECT * FROM progress WHERE storyId = ?", [
      storyId,
    ]) as Progress | null;

    return result || null;
  } catch (error) {
    console.error("[Progress Service] Failed to get progress", error);
    return null;
  }
}

/**
 * Get all progress records
 */
export async function getAllProgress(): Promise<Record<string, Progress>> {
  try {
    if (isWeb) {
      // Web: Use AsyncStorage
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      const result = data ? JSON.parse(data) : {};
      return result;
    }

    // Native: Use SQLite
    const results = db.getAllSync("SELECT * FROM progress") as Progress[];

    // Convert array to record keyed by storyId
    const progressMap: Record<string, Progress> = {};
    results.forEach((progress: Progress) => {
      progressMap[progress.storyId] = progress;
    });

    return progressMap;
  } catch (error) {
    console.error("[Progress Service] Failed to get all progress", error);
    return {};
  }
}

/**
 * Delete progress for a story
 */
export async function deleteProgress(storyId: string): Promise<boolean> {
  try {
    if (isWeb) {
      const allProgress = await getAllProgress();
      delete allProgress[storyId];
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    } else {
      db.runSync("DELETE FROM progress WHERE storyId = ?", [storyId]);
    }
    return true;
  } catch (error) {
    console.error("[Progress Service] Failed to delete progress", error);
    return false;
  }
}

/**
 * Clear all progress
 */
export async function clearAllProgress(): Promise<boolean> {
  try {
    if (isWeb) {
      await AsyncStorage.removeItem(PROGRESS_KEY);
    } else {
      db.runSync("DELETE FROM progress");
    }
    return true;
  } catch (error) {
    console.error("[Progress Service] Failed to clear all progress", error);
    return false;
  }
}

// Initialize database on module load
initializeDatabase();
