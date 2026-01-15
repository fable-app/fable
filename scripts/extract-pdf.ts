/**
 * PDF Extraction Script
 * Extracts German text from PDF files and prepares it for the story processor
 * Optionally translates using DeepL API
 */

import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import * as deepl from 'deepl-node';

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
    const data = await pdf(dataBuffer);
    return data.text;
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
  const data = await pdf(dataBuffer, {
    max: endPage,
    pagerender: async (pageData: any) => {
      const pageNum = pageData.pageNumber;
      if (pageNum >= startPage && pageNum <= endPage) {
        const textContent = await pageData.getTextContent();
        const strings = textContent.items.map((item: any) => item.str);
        return strings.join(' ');
      }
      return '';
    }
  });

  return data.text;
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

    // Translate in batches of 50 to avoid rate limits
    const batchSize = 50;
    const translations: string[] = [];

    for (let i = 0; i < sentences.length; i += batchSize) {
      const batch = sentences.slice(i, i + batchSize);
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sentences.length / batchSize)}...`);

      const results = await Promise.all(
        batch.map(sentence =>
          translator.translateText(sentence.trim(), 'de', 'en-US')
        )
      );

      translations.push(...results.map(r => r.text));

      // Small delay between batches
      if (i + batchSize < sentences.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      if (config.translate && config.deeplApiKey) {
        translations = await translateWithDeepL(cleanedText, config.deeplApiKey);
      } else {
        console.log('\n⚠️  Skipping translation (no API key provided)');
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
        if (config.translate && config.deeplApiKey) {
          translations = await translateWithDeepL(chapterText, config.deeplApiKey);
        }

        extractedChapters.push({
          titleGerman: chapterConfig.titleGerman,
          titleEnglish: chapterConfig.titleEnglish,
          germanText: chapterText,
          translations,
        });

        console.log('');
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
    deeplApiKey: 'your-deepl-api-key' // Optional
  }, null, 2));
  process.exit(1);
}
