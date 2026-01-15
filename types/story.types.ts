/**
 * Type definitions for Story data structures
 */

export interface Sentence {
  id: number;
  german: string;
  english: string;
}

export interface Story {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author: string;
  wordCount: number;
  difficulty: DifficultyLevel;
  sentences: Sentence[];
  // For multi-chapter books
  bookId?: string;
  chapterNumber?: number;
}

export interface ChapterMetadata {
  id: string;
  chapterNumber: number;
  titleGerman: string;
  titleEnglish: string;
  wordCount: number;
  sentenceCount: number;
}

export interface StoryMetadata {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author: string;
  wordCount: number;
  difficulty: DifficultyLevel;
  sentenceCount: number;
  // For multi-chapter books
  isMultiChapter?: boolean;
  chapterCount?: number;
  chapters?: ChapterMetadata[];
}

export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const DifficultyLabels: Record<DifficultyLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};
