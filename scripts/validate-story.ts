/**
 * Story Validation Script
 * Validates story JSON files for correctness and quality
 */

import * as fs from 'fs';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    sentenceCount: number;
    wordCount: number;
    avgSentenceLength: number;
    missingTranslations: number;
  };
}

/**
 * Validate a story JSON file
 */
export function validateStory(filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Read and parse file
    const content = fs.readFileSync(filePath, 'utf-8');
    const story = JSON.parse(content);

    // Required fields
    const requiredFields = ['id', 'titleGerman', 'titleEnglish', 'author', 'wordCount', 'difficulty', 'sentences'];
    requiredFields.forEach((field) => {
      if (!story[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate difficulty level
    const validDifficulties = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (story.difficulty && !validDifficulties.includes(story.difficulty)) {
      errors.push(`Invalid difficulty level: ${story.difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
    }

    // Validate sentences
    if (!Array.isArray(story.sentences)) {
      errors.push('sentences must be an array');
    } else {
      let missingTranslations = 0;
      let totalWords = 0;

      story.sentences.forEach((sentence: any, index: number) => {
        // Check sentence structure
        if (!sentence.id) {
          errors.push(`Sentence ${index} missing id`);
        }
        if (sentence.id !== index + 1) {
          warnings.push(`Sentence id mismatch: expected ${index + 1}, got ${sentence.id}`);
        }
        if (!sentence.german) {
          errors.push(`Sentence ${sentence.id} missing german text`);
        }
        if (!sentence.english) {
          errors.push(`Sentence ${sentence.id} missing english text`);
        }

        // Check for placeholder translations
        if (sentence.english && sentence.english.includes('[Translation missing]')) {
          missingTranslations++;
          warnings.push(`Sentence ${sentence.id} has missing translation placeholder`);
        }

        // Count words
        if (sentence.german) {
          totalWords += sentence.german.split(/\s+/).length;
        }

        // Check for suspiciously short/long sentences
        if (sentence.german && sentence.german.length < 10) {
          warnings.push(`Sentence ${sentence.id} is very short (${sentence.german.length} chars)`);
        }
        if (sentence.german && sentence.german.length > 500) {
          warnings.push(`Sentence ${sentence.id} is very long (${sentence.german.length} chars)`);
        }
      });

      // Calculate stats
      const sentenceCount = story.sentences.length;
      const avgSentenceLength = sentenceCount > 0 ? totalWords / sentenceCount : 0;

      // Validate word count matches
      if (story.wordCount && Math.abs(story.wordCount - totalWords) > 10) {
        warnings.push(`Word count mismatch: declared ${story.wordCount}, calculated ${totalWords}`);
      }

      // Return validation result
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        stats: {
          sentenceCount,
          wordCount: totalWords,
          avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
          missingTranslations,
        },
      };
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        sentenceCount: 0,
        wordCount: 0,
        avgSentenceLength: 0,
        missingTranslations: 0,
      },
    };
  } catch (error) {
    errors.push(`Failed to parse JSON: ${error}`);
    return {
      valid: false,
      errors,
      warnings,
      stats: {
        sentenceCount: 0,
        wordCount: 0,
        avgSentenceLength: 0,
        missingTranslations: 0,
      },
    };
  }
}

/**
 * Validate all stories in a directory
 */
export function validateAllStories(dirPath: string): void {
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json') && f !== 'manifest.json');

  console.log(`Validating ${files.length} story files...\n`);

  let totalValid = 0;
  let totalInvalid = 0;

  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;
    const result = validateStory(filePath);

    if (result.valid) {
      console.log(`✓ ${file}`);
      totalValid++;
    } else {
      console.log(`✗ ${file}`);
      totalInvalid++;
    }

    // Show stats
    console.log(`  Sentences: ${result.stats.sentenceCount}, Words: ${result.stats.wordCount}, Avg: ${result.stats.avgSentenceLength} words/sentence`);

    // Show errors
    if (result.errors.length > 0) {
      result.errors.forEach((error) => {
        console.log(`  ERROR: ${error}`);
      });
    }

    // Show warnings
    if (result.warnings.length > 0) {
      result.warnings.forEach((warning) => {
        console.log(`  WARN: ${warning}`);
      });
    }

    console.log('');
  });

  console.log(`\nValidation complete: ${totalValid} valid, ${totalInvalid} invalid`);

  if (totalInvalid > 0) {
    process.exit(1);
  }
}

// CLI usage
const args = process.argv.slice(2);

if (args.length > 0) {
  const target = args[0];

  if (!fs.existsSync(target)) {
    console.error(`Error: Path not found: ${target}`);
    process.exit(1);
  }

  const stats = fs.statSync(target);

  if (stats.isDirectory()) {
    validateAllStories(target);
  } else {
    const result = validateStory(target);

    console.log(`Validating: ${target}\n`);

    if (result.valid) {
      console.log('✓ Valid');
    } else {
      console.log('✗ Invalid');
    }

    console.log(`\nStats:`);
    console.log(`  Sentences: ${result.stats.sentenceCount}`);
    console.log(`  Words: ${result.stats.wordCount}`);
    console.log(`  Avg sentence length: ${result.stats.avgSentenceLength} words`);
    console.log(`  Missing translations: ${result.stats.missingTranslations}`);

    if (result.errors.length > 0) {
      console.log(`\nErrors:`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log(`\nWarnings:`);
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }

    if (!result.valid) {
      process.exit(1);
    }
  }
} else {
  console.log('Usage: npm run validate <story-file-or-directory>');
  console.log('');
  console.log('Examples:');
  console.log('  npm run validate data/stories/story-01.json');
  console.log('  npm run validate data/stories/');
  process.exit(1);
}
