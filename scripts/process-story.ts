/**
 * Story Processing Script
 * Processes raw German text into bilingual story JSON format
 * Supports both single stories and multi-chapter books
 */

import * as fs from 'fs';
import * as path from 'path';

interface ProcessedSentence {
  id: number;
  german: string;
  english: string;
}

interface ProcessedStory {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author: string;
  wordCount: number;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  sentences: ProcessedSentence[];
}

/**
 * Segment text into sentences
 * Handles German-specific abbreviations and edge cases
 */
export function segmentSentences(text: string): string[] {
  // Clean the text
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // German sentence endings: . ! ?
  // But not abbreviations like: Dr. Hr. Fr. z.B. usw. etc.
  const abbreviations = ['Dr', 'Hr', 'Fr', 'z.B', 'usw', 'etc', 'd.h', 'bzw', 'ca'];

  // Replace abbreviations temporarily
  let preprocessed = cleaned;
  abbreviations.forEach((abbr, index) => {
    const regex = new RegExp(`${abbr}\\.`, 'g');
    preprocessed = preprocessed.replace(regex, `__ABBR${index}__`);
  });

  // Split on sentence boundaries
  const sentences = preprocessed
    .split(/([.!?])\s+/)
    .reduce((acc: string[], curr, index, array) => {
      if (index % 2 === 0) {
        const sentence = curr + (array[index + 1] || '');
        if (sentence.trim()) {
          acc.push(sentence.trim());
        }
      }
      return acc;
    }, []);

  // Restore abbreviations
  return sentences.map((sentence) => {
    let restored = sentence;
    abbreviations.forEach((abbr, index) => {
      restored = restored.replace(new RegExp(`__ABBR${index}__`, 'g'), `${abbr}.`);
    });
    return restored;
  });
}

/**
 * Count words in German text
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Estimate difficulty level based on word count and complexity
 * This is a simple heuristic - real difficulty should be manually reviewed
 */
export function estimateDifficulty(wordCount: number, avgWordLength: number): string {
  if (wordCount < 300 && avgWordLength < 6) return 'A1';
  if (wordCount < 600 && avgWordLength < 7) return 'A2';
  if (wordCount < 1000 && avgWordLength < 8) return 'B1';
  if (wordCount < 1500 && avgWordLength < 9) return 'B2';
  if (wordCount < 2500) return 'C1';
  return 'C2';
}

/**
 * Process a raw story file into our JSON format
 * Expects a JSON input with german text and translations array
 */
export function processStory(inputPath: string, outputDir: string): void {
  try {
    // Read input file
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const input = JSON.parse(rawData);

    // Validate input structure
    if (!input.id || !input.titleGerman || !input.titleEnglish || !input.author || !input.germanText || !input.translations) {
      throw new Error('Invalid input format. Required fields: id, titleGerman, titleEnglish, author, germanText, translations');
    }

    // Segment German text
    const germanSentences = segmentSentences(input.germanText);
    const translations = input.translations as string[];

    // Ensure translation count matches
    if (germanSentences.length !== translations.length) {
      console.warn(`Warning: German sentences (${germanSentences.length}) != translations (${translations.length})`);
    }

    // Build sentences array
    const sentences: ProcessedSentence[] = germanSentences.map((german, index) => ({
      id: index + 1,
      german,
      english: translations[index] || '[Translation missing]',
    }));

    // Calculate metrics
    const fullText = germanSentences.join(' ');
    const wordCount = countWords(fullText);
    const avgWordLength = fullText.replace(/\s/g, '').length / wordCount;

    // Build story object
    const story: ProcessedStory = {
      id: input.id,
      titleGerman: input.titleGerman,
      titleEnglish: input.titleEnglish,
      author: input.author,
      wordCount,
      difficulty: input.difficulty || estimateDifficulty(wordCount, avgWordLength),
      sentences,
    };

    // Write output file
    const outputPath = path.join(outputDir, `${input.id}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(story, null, 2), 'utf-8');

    console.log(`✓ Processed ${input.id}: ${story.sentences.length} sentences, ${wordCount} words, ${story.difficulty} level`);
    console.log(`  Output: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Failed to process story:`, error);
    throw error;
  }
}

/**
 * Update manifest.json with new story
 */
export function updateManifest(story: ProcessedStory, manifestPath: string): void {
  try {
    // Read existing manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Check if story already exists
    const existingIndex = manifest.stories.findIndex((s: any) => s.id === story.id);

    const metadata = {
      id: story.id,
      titleGerman: story.titleGerman,
      titleEnglish: story.titleEnglish,
      author: story.author,
      wordCount: story.wordCount,
      difficulty: story.difficulty,
    };

    if (existingIndex >= 0) {
      // Update existing
      manifest.stories[existingIndex] = metadata;
      console.log(`  Updated manifest entry for ${story.id}`);
    } else {
      // Add new
      manifest.stories.push(metadata);
      console.log(`  Added manifest entry for ${story.id}`);
    }

    // Update timestamp
    manifest.lastUpdated = new Date().toISOString();

    // Write manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (error) {
    console.error(`✗ Failed to update manifest:`, error);
    throw error;
  }
}

/**
 * Process a multi-chapter book
 * Expects input JSON with chapters array, each containing germanText and translations
 */
export function processBook(inputPath: string, outputDir: string): void {
  try {
    // Read input file
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const input = JSON.parse(rawData);

    // Validate input structure
    if (!input.id || !input.titleGerman || !input.titleEnglish || !input.author || !input.chapters || !Array.isArray(input.chapters)) {
      throw new Error('Invalid book format. Required fields: id, titleGerman, titleEnglish, author, chapters (array)');
    }

    console.log(`Processing book: ${input.titleGerman}`);
    console.log(`Chapters: ${input.chapters.length}`);

    const chapterMetadata: any[] = [];
    let totalWordCount = 0;
    let totalSentenceCount = 0;

    // Process each chapter
    input.chapters.forEach((chapter: any, index: number) => {
      const chapterNumber = index + 1;
      console.log(`\n  Processing Chapter ${chapterNumber}...`);

      if (!chapter.titleGerman || !chapter.titleEnglish || !chapter.germanText || !chapter.translations) {
        throw new Error(`Chapter ${chapterNumber} missing required fields: titleGerman, titleEnglish, germanText, translations`);
      }

      // Segment German text
      const germanSentences = segmentSentences(chapter.germanText);
      const translations = chapter.translations as string[];

      // Ensure translation count matches
      if (germanSentences.length !== translations.length) {
        console.warn(`  Warning: Chapter ${chapterNumber} - German sentences (${germanSentences.length}) != translations (${translations.length})`);
      }

      // Build sentences array
      const sentences = germanSentences.map((german, sentenceIndex) => ({
        id: sentenceIndex + 1,
        german,
        english: translations[sentenceIndex] || '[Translation missing]',
      }));

      // Calculate metrics
      const fullText = germanSentences.join(' ');
      const wordCount = countWords(fullText);
      const avgWordLength = fullText.replace(/\s/g, '').length / wordCount;

      // Build chapter object
      const chapterId = `${input.id}-ch${chapterNumber}`;
      const chapterStory = {
        id: chapterId,
        titleGerman: chapter.titleGerman,
        titleEnglish: chapter.titleEnglish,
        author: input.author,
        wordCount,
        difficulty: input.difficulty || estimateDifficulty(wordCount, avgWordLength),
        sentences,
        bookId: input.id,
        chapterNumber,
      };

      // Write chapter file
      const chapterPath = path.join(outputDir, `${chapterId}.json`);
      fs.writeFileSync(chapterPath, JSON.stringify(chapterStory, null, 2), 'utf-8');

      console.log(`  ✓ Chapter ${chapterNumber}: ${sentences.length} sentences, ${wordCount} words`);

      // Add to metadata
      chapterMetadata.push({
        id: chapterId,
        chapterNumber,
        titleGerman: chapter.titleGerman,
        titleEnglish: chapter.titleEnglish,
        wordCount,
        sentenceCount: sentences.length,
      });

      totalWordCount += wordCount;
      totalSentenceCount += sentences.length;
    });

    // Create book metadata file
    const bookMetadata = {
      id: input.id,
      titleGerman: input.titleGerman,
      titleEnglish: input.titleEnglish,
      author: input.author,
      wordCount: totalWordCount,
      difficulty: input.difficulty || estimateDifficulty(totalWordCount / input.chapters.length, 7),
      sentenceCount: totalSentenceCount,
      isMultiChapter: true,
      chapterCount: input.chapters.length,
      chapters: chapterMetadata,
    };

    const bookPath = path.join(outputDir, `${input.id}.json`);
    fs.writeFileSync(bookPath, JSON.stringify(bookMetadata, null, 2), 'utf-8');

    console.log(`\n✓ Processed book: ${input.chapters.length} chapters, ${totalWordCount} words, ${input.difficulty || 'auto'} level`);
    console.log(`  Book metadata: ${bookPath}`);
  } catch (error) {
    console.error(`✗ Failed to process book:`, error);
    throw error;
  }
}

/**
 * Update manifest with multi-chapter book
 */
export function updateManifestWithBook(bookPath: string, manifestPath: string): void {
  try {
    // Read book metadata
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf-8'));

    // Read existing manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Check if book already exists
    const existingIndex = manifest.stories.findIndex((s: any) => s.id === bookData.id);

    if (existingIndex >= 0) {
      // Update existing
      manifest.stories[existingIndex] = bookData;
      console.log(`  Updated manifest entry for ${bookData.id}`);
    } else {
      // Add new
      manifest.stories.push(bookData);
      console.log(`  Added manifest entry for ${bookData.id}`);
    }

    // Update timestamp
    manifest.lastUpdated = new Date().toISOString();

    // Write manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (error) {
    console.error(`✗ Failed to update manifest:`, error);
    throw error;
  }
}

// CLI usage - only execute when this script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length >= 2) {
    const [inputPath, outputDir, mode] = args;

    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file not found: ${inputPath}`);
      process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Detect if it's a book or single story
    const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const isBook = inputData.chapters && Array.isArray(inputData.chapters) || mode === '--book';

    if (isBook) {
      console.log('Processing multi-chapter book...\n');
      processBook(inputPath, outputDir);

      // Update manifest
      const manifestPath = path.join(outputDir, '../manifest.json');
      if (fs.existsSync(manifestPath)) {
        const bookPath = path.join(outputDir, `${inputData.id}.json`);
        updateManifestWithBook(bookPath, manifestPath);
      }
    } else {
      console.log('Processing single story...');
      processStory(inputPath, outputDir);

      // Update manifest
      const manifestPath = path.join(outputDir, '../manifest.json');
      if (fs.existsSync(manifestPath)) {
        const outputPath = path.join(outputDir, `${inputData.id}.json`);
        const story = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        updateManifest(story, manifestPath);
      }
    }

    console.log('\n✓ Done!');
  } else {
    console.log('Usage: npm run process-story <input-json> <output-dir> [--book]');
    console.log('');
    console.log('Examples:');
    console.log('  Single story:');
    console.log('    npm run process-story raw/story-11.json data/stories/');
    console.log('');
    console.log('  Multi-chapter book:');
    console.log('    npm run process-story raw/book-metamorphosis.json data/stories/ --book');
    process.exit(1);
  }
}
