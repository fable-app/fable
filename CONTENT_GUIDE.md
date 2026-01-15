# PDF Content Processing Guide

## Complete Workflow: From PDF to Fable App

This guide explains the complete pipeline for adding German content from PDF sources to your Fable app.

---

## Overview

The content pipeline has 3 steps:

```
PDF File → [extract-pdf] → Raw JSON → [process-story] → Story JSON → App
```

1. **PDF Extraction** (`extract-pdf`): Extract German text from PDF, optionally translate with DeepL
2. **Story Processing** (`process-story`): Segment into sentences, pair with translations, create final format
3. **App Integration**: Import into app and rebuild

---

## Step 1: Download German PDF

### Free Sources

**Beginner/Intermediate (A1-B1):**
- [Deutsche Welle - Langsam gesprochene Nachrichten](https://www.dw.com/de/deutsch-lernen/nachrichten/s-8030)
- [nachrichtenleicht.de](https://www.nachrichtenleicht.de/) - Simple German news
- Children's books from [Project Gutenberg](https://www.gutenberg.org/browse/languages/de)

**Advanced (B2-C2):**
- [Project Gutenberg - German Literature](https://www.gutenberg.org/browse/languages/de)
  - Franz Kafka, Hermann Hesse, Thomas Mann, etc.
- [Deutsches Textarchiv](http://www.deutschestextarchiv.de/) - Historical German texts
- [Märchenatlas](https://maerchenatlas.de/) - German fairy tales

### Download Process

1. Find a German story/book in PDF format
2. Save to `downloads/` directory
3. Note the author, title, and estimated difficulty level

---

## Step 2: Create Configuration File

Create a JSON config file in `configs/` directory:

### Single Story Config

For short stories (< 2,000 words):

```json
{
  "id": "story-rotkappchen",
  "titleGerman": "Rotkäppchen",
  "titleEnglish": "Little Red Riding Hood",
  "author": "Brothers Grimm",
  "difficulty": "A2",
  "isMultiChapter": false,
  "translate": true,
  "deeplApiKey": "your-api-key-here"
}
```

### Multi-Chapter Book Config (by Page Range)

For longer books split by page numbers:

```json
{
  "id": "book-kafka-verwandlung",
  "titleGerman": "Die Verwandlung",
  "titleEnglish": "The Metamorphosis",
  "author": "Franz Kafka",
  "difficulty": "C1",
  "isMultiChapter": true,
  "translate": true,
  "deeplApiKey": "your-api-key-here",
  "chapters": [
    {
      "titleGerman": "Teil I",
      "titleEnglish": "Part I",
      "startPage": 1,
      "endPage": 15
    },
    {
      "titleGerman": "Teil II",
      "titleEnglish": "Part II",
      "startPage": 16,
      "endPage": 30
    },
    {
      "titleGerman": "Teil III",
      "titleEnglish": "Part III",
      "startPage": 31,
      "endPage": 45
    }
  ]
}
```

### Multi-Chapter Book Config (by Pattern Matching)

If PDF doesn't have clear page breaks, use text patterns:

```json
{
  "id": "book-german-tales",
  "titleGerman": "Deutsche Märchen",
  "titleEnglish": "German Fairy Tales",
  "author": "Various",
  "difficulty": "B1",
  "isMultiChapter": true,
  "translate": true,
  "deeplApiKey": "your-api-key-here",
  "chapters": [
    {
      "titleGerman": "Der Froschkönig",
      "titleEnglish": "The Frog Prince",
      "startPattern": "Der Froschkönig",
      "endPattern": "Rapunzel"
    },
    {
      "titleGerman": "Rapunzel",
      "titleEnglish": "Rapunzel",
      "startPattern": "Rapunzel",
      "endPattern": "Hänsel und Gretel"
    },
    {
      "titleGerman": "Hänsel und Gretel",
      "titleEnglish": "Hansel and Gretel",
      "startPattern": "Hänsel und Gretel"
    }
  ]
}
```

### DeepL API Key (Optional)

To enable automatic translation:
1. Sign up at [https://www.deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Get your API key (500,000 characters/month free)
3. Add to config: `"deeplApiKey": "your-key-here"`

If you skip this, you'll need to add translations manually.

---

## Step 3: Extract PDF

Run the extraction script:

```bash
npm run extract-pdf downloads/your-book.pdf configs/your-config.json data/raw/your-book.json
```

### What This Does:

1. **Extracts text** from PDF
2. **Cleans text** (removes page numbers, headers, excessive whitespace)
3. **Splits chapters** (if multi-chapter)
4. **Translates** (if DeepL API key provided)
5. **Outputs** raw JSON file in `data/raw/`

### Example Output (Single Story):

```json
{
  "id": "story-rotkappchen",
  "titleGerman": "Rotkäppchen",
  "titleEnglish": "Little Red Riding Hood",
  "author": "Brothers Grimm",
  "difficulty": "A2",
  "germanText": "Es war einmal ein kleines süßes Mädchen...",
  "translations": [
    "Once upon a time there was a sweet little girl...",
    "..."
  ]
}
```

### Example Output (Multi-Chapter):

```json
{
  "id": "book-kafka-verwandlung",
  "titleGerman": "Die Verwandlung",
  "titleEnglish": "The Metamorphosis",
  "author": "Franz Kafka",
  "difficulty": "C1",
  "chapters": [
    {
      "titleGerman": "Teil I",
      "titleEnglish": "Part I",
      "germanText": "Als Gregor Samsa eines Morgens...",
      "translations": ["When Gregor Samsa woke up one morning...", "..."]
    },
    {
      "titleGerman": "Teil II",
      "titleEnglish": "Part II",
      "germanText": "...",
      "translations": ["...", "..."]
    }
  ]
}
```

---

## Step 4: Review and Edit Translations (Optional)

If you didn't use DeepL or want to improve translations:

1. Open `data/raw/your-book.json`
2. Review the `translations` array
3. Edit any translations for better learning quality
4. Ensure translation count matches German sentence count

---

## Step 5: Process Story

Convert raw JSON to final story format:

```bash
npm run process-story data/raw/your-book.json data/stories/
```

### What This Does:

1. **Segments** German text into individual sentences
2. **Pairs** each German sentence with English translation
3. **Calculates** word count, sentence count, difficulty
4. **Generates** final story JSON files
5. **Updates** `data/manifest.json` automatically

### Output Files:

**Single Story:**
```
data/stories/story-rotkappchen.json
```

**Multi-Chapter Book:**
```
data/stories/book-kafka-verwandlung.json       # Book metadata
data/stories/book-kafka-verwandlung-ch1.json   # Chapter 1 content
data/stories/book-kafka-verwandlung-ch2.json   # Chapter 2 content
data/stories/book-kafka-verwandlung-ch3.json   # Chapter 3 content
```

---

## Step 6: Integrate Into App

### 6.1 Add Static Imports

Edit `services/story.service.ts`:

```typescript
// Add imports at top
import storyRotkappchen from '@/data/stories/story-rotkappchen.json';

// Or for multi-chapter:
import bookKafka from '@/data/stories/book-kafka-verwandlung.json';
import bookKafkaCh1 from '@/data/stories/book-kafka-verwandlung-ch1.json';
import bookKafkaCh2 from '@/data/stories/book-kafka-verwandlung-ch2.json';
import bookKafkaCh3 from '@/data/stories/book-kafka-verwandlung-ch3.json';

// Add to storyMap
const storyMap: Record<string, Story> = {
  // ... existing stories
  'story-rotkappchen': storyRotkappchen as Story,

  // Or for multi-chapter:
  'book-kafka-verwandlung': bookKafka as any,
  'book-kafka-verwandlung-ch1': bookKafkaCh1 as Story,
  'book-kafka-verwandlung-ch2': bookKafkaCh2 as Story,
  'book-kafka-verwandlung-ch3': bookKafkaCh3 as Story,
};
```

### 6.2 Rebuild and Test

```bash
npm start
```

Your new content will appear in the story list!

---

## Complete Example: Adding Kafka's "Die Verwandlung"

### 1. Download PDF
```bash
# Download from Project Gutenberg
curl -o downloads/kafka-verwandlung.pdf \
  "https://www.gutenberg.org/files/5200/5200-pdf.pdf"
```

### 2. Create Config
```bash
cat > configs/kafka-config.json << 'EOF'
{
  "id": "book-kafka-verwandlung",
  "titleGerman": "Die Verwandlung",
  "titleEnglish": "The Metamorphosis",
  "author": "Franz Kafka",
  "difficulty": "C1",
  "isMultiChapter": true,
  "translate": true,
  "deeplApiKey": "YOUR_API_KEY",
  "chapters": [
    {
      "titleGerman": "Teil I",
      "titleEnglish": "Part I",
      "startPage": 3,
      "endPage": 20
    },
    {
      "titleGerman": "Teil II",
      "titleEnglish": "Part II",
      "startPage": 21,
      "endPage": 35
    },
    {
      "titleGerman": "Teil III",
      "titleEnglish": "Part III",
      "startPage": 36,
      "endPage": 50
    }
  ]
}
EOF
```

### 3. Extract PDF
```bash
npm run extract-pdf \
  downloads/kafka-verwandlung.pdf \
  configs/kafka-config.json \
  data/raw/book-kafka-verwandlung.json
```

### 4. Process Story
```bash
npm run process-story \
  data/raw/book-kafka-verwandlung.json \
  data/stories/
```

### 5. Add Imports

Edit `services/story.service.ts` and add the imports as shown in Step 6.1

### 6. Done!

Start the app and find "Die Verwandlung" in your library.

---

## Troubleshooting

### PDF Extraction Issues

**Problem**: Text extraction is garbled or incorrect

**Solutions**:
- PDF might be image-based (scanned). Use OCR tools first
- Try different PDF version from another source
- Manually copy text if short enough

**Problem**: Chapter split not working

**Solutions**:
- Check page numbers in actual PDF (may differ from printed page numbers)
- Use pattern matching instead of page ranges
- Use broader patterns (e.g., "Teil" instead of "Teil I")

### Translation Issues

**Problem**: DeepL API quota exceeded

**Solutions**:
- Process chapters one at a time
- Use free tier's 500k character limit wisely
- Add translations manually if needed

**Problem**: Translations are poor quality

**Solutions**:
- Review and edit `data/raw/*.json` before processing
- Consider manual translation for important content
- Use DeepL as starting point, refine manually

### Story Processing Issues

**Problem**: Sentence segmentation is wrong

**Solutions**:
- Check for German abbreviations not in `abbreviations` array
- Edit `scripts/process-story.ts` to add more abbreviations
- Manually adjust sentence boundaries in raw JSON

**Problem**: Translation count mismatch

**Solutions**:
- Ensure translations array matches German sentence count
- Check for missing or extra translations
- Adjust in raw JSON before processing

---

## Best Practices

### Content Selection

1. **Start small**: Begin with 1-2 chapter books (500-1500 words each)
2. **Test extraction**: Try a small PDF first to verify the pipeline works
3. **Check quality**: Review extracted text before translating
4. **Progressive difficulty**: Add content across all CEFR levels

### Translation Quality

1. **Review DeepL output**: AI isn't perfect, especially for literature
2. **Literary vs. literal**: Choose translation style for learners
3. **Consistency**: Keep character names, terms consistent across chapters
4. **Context**: Ensure translations preserve learning context

### Performance

1. **Chapter length**: Keep chapters under 2,000 words for mobile
2. **Total content**: Aim for 20-30 stories/books maximum
3. **Bundle size**: Each story adds to app bundle
4. **User experience**: Shorter chapters = better mobile experience

---

## Next Steps

- Add 5-10 stories from Project Gutenberg
- Create themed collections (Grimm tales, Kafka stories, etc.)
- Consider adding vocabulary notes for difficult words
- Implement audio narration for longer texts

---

## Reference

### Useful Resources

- [Project Gutenberg German](https://www.gutenberg.org/browse/languages/de)
- [DeepL API Documentation](https://www.deepl.com/docs-api)
- [German CEFR Levels](https://www.goethe.de/en/spr/kup/prf.html)

### File Locations

```
fable/
├── configs/              # PDF extraction configs
├── downloads/            # Downloaded PDFs
├── data/
│   ├── raw/             # Extracted raw JSON (with translations)
│   └── stories/         # Final story JSON files
└── scripts/
    ├── extract-pdf.ts   # PDF → Raw JSON
    └── process-story.ts # Raw JSON → Story JSON
```
