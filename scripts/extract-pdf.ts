/**
 * PDF Extraction Script
 * Extracts German text from PDF files and prepares it for the story processor
 * Optionally translates using Claude API (recommended) or DeepL API
 */

import * as fs from 'fs';
import * as path from 'path';
import * as deepl from 'deepl-node';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Import pdf-parse - it exports an object with PDFParse as a named export
const { PDFParse } = require('pdf-parse');

interface ChapterConfig {
  titleGerman: string;
  titleEnglish: string;
  startPage?: number;
  endPage?: number;
  startPattern?: string; // Regex pattern to match chapter start
  endPattern?: string; // Regex pattern to match chapter end
}

interface BookConfig {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isMultiChapter: boolean;
  chapters?: ChapterConfig[];
  // Translation options
  translate?: boolean;
  translationProvider?: 'deepl' | 'openai' | 'claude'; // Default: deepl
  openaiApiKey?: string;
  claudeApiKey?: string;
  deeplApiKey?: string;
}

interface ExtractedChapter {
  titleGerman: string;
  titleEnglish: string;
  germanText: string;
  translations?: string[];
}

/**
 * Extract text from PDF
 */
async function extractPdfText(pdfPath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } catch (error) {
    console.error('Failed to extract PDF text:', error);
    throw error;
  }
}

/**
 * Clean extracted text
 * Removes headers, footers, page numbers, and excessive whitespace
 */
function cleanText(text: string): string {
  let cleaned = text
    // Remove page numbers (common patterns)
    .replace(/^\s*\d+\s*$/gm, '')
    .replace(/^Seite \d+$/gm, '')
    // Remove multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive spaces
    .replace(/ {2,}/g, ' ')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    // Remove soft hyphens
    .replace(/\u00AD/g, '')
    .trim();

  return cleaned;
}

/**
 * Extract chapter by page range
 */
async function extractChapterByPages(
  pdfPath: string,
  startPage: number,
  endPage: number
): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });

  // Use first/last parameters to extract a range
  const result = await parser.getText({
    first: startPage,
    last: endPage
  });

  await parser.destroy();
  return result.text;
}

/**
 * Extract chapter by pattern matching
 */
function extractChapterByPattern(
  fullText: string,
  startPattern: string,
  endPattern?: string
): string {
  const startRegex = new RegExp(startPattern, 'i');
  const startMatch = fullText.search(startRegex);

  if (startMatch === -1) {
    throw new Error(`Chapter start pattern not found: ${startPattern}`);
  }

  let chapterText = fullText.substring(startMatch);

  if (endPattern) {
    const endRegex = new RegExp(endPattern, 'i');
    const endMatch = chapterText.search(endRegex);
    if (endMatch !== -1) {
      chapterText = chapterText.substring(0, endMatch);
    }
  }

  return chapterText;
}

/**
 * Translate text using DeepL API
 */
async function translateWithDeepL(
  text: string,
  apiKey: string
): Promise<string[]> {
  try {
    const translator = new deepl.Translator(apiKey);

    // Split into sentences for better translation quality
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    console.log(`  Translating ${sentences.length} sentences with DeepL...`);

    // Translate in batches of 10 (good for Pro tier)
    const batchSize = 10;
    const translations: string[] = [];

    for (let i = 0; i < sentences.length; i += batchSize) {
      const batch = sentences.slice(i, i + batchSize);
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sentences.length / batchSize)}...`);

      // Translate batch in parallel
      const results = await Promise.all(
        batch.map(sentence =>
          translator.translateText(sentence.trim(), 'de', 'en-US')
        )
      );

      translations.push(...results.map(r => r.text));

      // Small delay between batches (500ms for Pro tier)
      if (i + batchSize < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`  ✓ Translated ${translations.length} sentences`);
    return translations;
  } catch (error) {
    console.error('DeepL translation failed:', error);
    throw error;
  }
}

/**
 * Translate text using Claude API
 * More accurate and context-aware than DeepL, especially for literature
 */
async function translateWithClaude(
  text: string,
  apiKey: string
): Promise<string[]> {
  try {
    const anthropic = new Anthropic({ apiKey });

    // Split into sentences for better translation quality
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    console.log(`  Translating ${sentences.length} sentences with Claude...`);

    // Translate in batches of 20 for optimal quality/speed
    const batchSize = 20;
    const translations: string[] = [];

    for (let i = 0; i < sentences.length; i += batchSize) {
      const batch = sentences.slice(i, i + batchSize);
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sentences.length / batchSize)}...`);

      // Create prompt for batch translation
      const prompt = `You are an expert German-to-English translator for language learning content.

Translate the following German sentences to English. Requirements:
- Maintain accuracy while being clear for English-speaking learners
- Preserve the meaning and context of the original
- Keep translations natural and readable
- Return ONLY the translations, one per line, in the same order

German sentences:
${batch.map((s, idx) => `${idx + 1}. ${s.trim()}`).join('\n')}

Provide the English translations:`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Extract translations from response
      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      const batchTranslations = responseText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);

      if (batchTranslations.length !== batch.length) {
        console.warn(`  Warning: Expected ${batch.length} translations, got ${batchTranslations.length}`);
      }

      translations.push(...batchTranslations);

      // Small delay between batches to be respectful of API
      if (i + batchSize < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`  ✓ Translated ${translations.length} sentences`);
    return translations;
  } catch (error) {
    console.error('Claude translation failed:', error);
    throw error;
  }
}

/**
 * Translate text using OpenAI API
 * Good alternative with GPT-4 for accurate translations
 */
async function translateWithOpenAI(
  text: string,
  apiKey: string
): Promise<string[]> {
  try {
    const openai = new OpenAI({ apiKey });

    // Split into sentences for better translation quality
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    console.log(`  Translating ${sentences.length} sentences with OpenAI...`);

    // Translate in batches of 20 for optimal quality/speed
    const batchSize = 20;
    const translations: string[] = [];

    for (let i = 0; i < sentences.length; i += batchSize) {
      const batch = sentences.slice(i, i + batchSize);
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sentences.length / batchSize)}...`);

      // Create prompt for batch translation
      const prompt = `You are an expert German-to-English translator for language learning content.

Translate the following German sentences to English. Requirements:
- Maintain accuracy while being clear for English-speaking learners
- Preserve the meaning and context of the original
- Keep translations natural and readable
- Return ONLY the translations, one per line, in the same order

German sentences:
${batch.map((s, idx) => `${idx + 1}. ${s.trim()}`).join('\n')}

Provide the English translations:`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3,
      });

      // Extract translations from response
      const responseText = completion.choices[0]?.message?.content || '';

      const batchTranslations = responseText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);

      if (batchTranslations.length !== batch.length) {
        console.warn(`  Warning: Expected ${batch.length} translations, got ${batchTranslations.length}`);
      }

      translations.push(...batchTranslations);

      // Small delay between batches to be respectful of API
      if (i + batchSize < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`  ✓ Translated ${translations.length} sentences`);
    return translations;
  } catch (error) {
    console.error('OpenAI translation failed:', error);
    throw error;
  }
}

/**
 * Extract and process PDF into raw JSON format
 */
async function processPdf(
  pdfPath: string,
  configPath: string,
  outputPath: string
): Promise<void> {
  try {
    console.log('Loading configuration...');
    const config: BookConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    console.log(`Extracting PDF: ${path.basename(pdfPath)}`);
    console.log(`Book: ${config.titleGerman}`);

    if (!config.isMultiChapter) {
      // Single story extraction
      console.log('\nExtracting as single story...');
      const fullText = await extractPdfText(pdfPath);
      const cleanedText = cleanText(fullText);

      let translations: string[] | undefined;
      if (config.translate) {
        const provider = config.translationProvider || 'deepl'; // Default to DeepL

        if (provider === 'openai' && config.openaiApiKey) {
          translations = await translateWithOpenAI(cleanedText, config.openaiApiKey);
        } else if (provider === 'claude' && config.claudeApiKey) {
          translations = await translateWithClaude(cleanedText, config.claudeApiKey);
        } else if (provider === 'deepl' && config.deeplApiKey) {
          translations = await translateWithDeepL(cleanedText, config.deeplApiKey);
        } else {
          console.log(`\n⚠️  Skipping translation (no ${provider} API key provided)`);
          console.log('You will need to add translations manually to the output file');
        }
      } else {
        console.log('\n⚠️  Translation disabled');
        console.log('You will need to add translations manually to the output file');
      }

      const output = {
        id: config.id,
        titleGerman: config.titleGerman,
        titleEnglish: config.titleEnglish,
        author: config.author,
        difficulty: config.difficulty,
        germanText: cleanedText,
        translations: translations || [],
      };

      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`\n✓ Created: ${outputPath}`);
      console.log(`  Word count: ~${cleanedText.split(/\s+/).length} words`);

      if (!translations || translations.length === 0) {
        console.log('\n⚠️  Next steps:');
        console.log('1. Add English translations to the "translations" array');
        console.log('2. Run: npx tsx scripts/process-story.ts ' + outputPath + ' data/stories/');
      }
    } else {
      // Multi-chapter book extraction
      if (!config.chapters || config.chapters.length === 0) {
        throw new Error('Multi-chapter book requires chapters configuration');
      }

      console.log(`\nExtracting ${config.chapters.length} chapters...\n`);

      const fullText = await extractPdfText(pdfPath);
      const cleanedFullText = cleanText(fullText);

      const extractedChapters: ExtractedChapter[] = [];

      for (let i = 0; i < config.chapters.length; i++) {
        const chapterConfig = config.chapters[i];
        const chapterNum = i + 1;

        console.log(`Chapter ${chapterNum}: ${chapterConfig.titleGerman}`);

        let chapterText: string;

        if (chapterConfig.startPage && chapterConfig.endPage) {
          // Extract by page range
          chapterText = await extractChapterByPages(
            pdfPath,
            chapterConfig.startPage,
            chapterConfig.endPage
          );
        } else if (chapterConfig.startPattern) {
          // Extract by pattern matching
          chapterText = extractChapterByPattern(
            cleanedFullText,
            chapterConfig.startPattern,
            chapterConfig.endPattern
          );
        } else {
          throw new Error(`Chapter ${chapterNum} missing extraction method (provide startPage/endPage or startPattern)`);
        }

        chapterText = cleanText(chapterText);
        console.log(`  Extracted: ~${chapterText.split(/\s+/).length} words`);

        let translations: string[] | undefined;
        if (config.translate) {
          const provider = config.translationProvider || 'deepl'; // Default to DeepL

          if (provider === 'openai' && config.openaiApiKey) {
            translations = await translateWithOpenAI(chapterText, config.openaiApiKey);
          } else if (provider === 'claude' && config.claudeApiKey) {
            translations = await translateWithClaude(chapterText, config.claudeApiKey);
          } else if (provider === 'deepl' && config.deeplApiKey) {
            translations = await translateWithDeepL(chapterText, config.deeplApiKey);
          }
        }

        extractedChapters.push({
          titleGerman: chapterConfig.titleGerman,
          titleEnglish: chapterConfig.titleEnglish,
          germanText: chapterText,
          translations,
        });

        console.log('');

        // Small delay between chapters
        if (i + 1 < config.chapters.length) {
          console.log('  Waiting 1 second before next chapter...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const output = {
        id: config.id,
        titleGerman: config.titleGerman,
        titleEnglish: config.titleEnglish,
        author: config.author,
        difficulty: config.difficulty,
        chapters: extractedChapters,
      };

      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`✓ Created: ${outputPath}`);
      console.log(`  Total chapters: ${extractedChapters.length}`);

      if (!config.translate || !config.deeplApiKey) {
        console.log('\n⚠️  Next steps:');
        console.log('1. Add English translations to each chapter\'s "translations" array');
        console.log('2. Run: npx tsx scripts/process-story.ts ' + outputPath + ' data/stories/');
      }
    }

    console.log('\n✓ PDF extraction complete!');
  } catch (error) {
    console.error('Failed to process PDF:', error);
    throw error;
  }
}

// CLI usage
const args = process.argv.slice(2);

if (args.length >= 3) {
  const [pdfPath, configPath, outputPath] = args;

  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: PDF file not found: ${pdfPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found: ${configPath}`);
    process.exit(1);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  processPdf(pdfPath, configPath, outputPath)
    .then(() => {
      console.log('\n✓ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Failed:', error.message);
      process.exit(1);
    });
} else {
  console.log('PDF to Raw JSON Extractor');
  console.log('');
  console.log('Usage: npx tsx scripts/extract-pdf.ts <pdf-file> <config-json> <output-json>');
  console.log('');
  console.log('Arguments:');
  console.log('  pdf-file     - Path to the German PDF file');
  console.log('  config-json  - Path to book configuration JSON');
  console.log('  output-json  - Path for output raw JSON file');
  console.log('');
  console.log('Example:');
  console.log('  npx tsx scripts/extract-pdf.ts \\');
  console.log('    downloads/kafka.pdf \\');
  console.log('    configs/kafka-config.json \\');
  console.log('    data/raw/book-kafka.json');
  console.log('');
  console.log('Config JSON format:');
  console.log(JSON.stringify({
    id: 'book-example',
    titleGerman: 'Der Titel',
    titleEnglish: 'The Title',
    author: 'Author Name',
    difficulty: 'B2',
    isMultiChapter: false,
    translate: true,
    translationProvider: 'deepl', // 'openai', 'claude', or 'deepl'
    openaiApiKey: 'your-openai-api-key' // Get from platform.openai.com
  }, null, 2));
  process.exit(1);
}
