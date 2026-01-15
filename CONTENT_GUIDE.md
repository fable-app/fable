# Content Addition Guide

## Adding Longer German Stories to Fable

This guide explains how to add longer, more substantial German stories to your Fable app.

## Recommended Story Lengths

For effective language learning, consider these lengths by CEFR level:

| Level | Word Count | Sentences | Reading Time |
|-------|------------|-----------|--------------|
| A1    | 150-300    | 15-25     | 3-5 min      |
| A2    | 300-600    | 25-50     | 5-10 min     |
| B1    | 600-1,200  | 50-100    | 10-20 min    |
| B2    | 1,200-2,500| 100-200   | 20-40 min    |
| C1    | 2,500-5,000| 200-400   | 40-80 min    |
| C2    | 5,000+     | 400+      | 80+ min      |

## Step-by-Step Process

### 1. Prepare Your Source Material

**Option A: Public Domain German Literature**
- [Project Gutenberg - German](https://www.gutenberg.org/browse/languages/de)
- [Deutsches Textarchiv](http://www.deutschestextarchiv.de/)
- Classic authors: Grimm, Kafka, Hesse, Mann

### 2. Prepare the Raw Story File

Create a JSON file in `data/raw/` with this format:

```json
{
  "id": "story-11",
  "titleGerman": "Der Große Wald",
  "titleEnglish": "The Great Forest",
  "author": "Brothers Grimm",
  "difficulty": "B1",
  "germanText": "Es war einmal ein großer Wald. In diesem Wald lebten viele Tiere. Die Tiere waren alle sehr glücklich...",
  "translations": [
    "Once upon a time there was a great forest.",
    "In this forest lived many animals.",
    "The animals were all very happy..."
  ]
}
```

**Critical**: The `germanText` should be one continuous block. The `translations` array must have **exactly one English translation for each German sentence**.

### 3. Segment & Translate

**For German Text Segmentation:**

The processing script automatically handles:
- Sentence boundaries (. ! ?)
- German abbreviations (Dr., z.B., usw., etc.)
- Proper capitalization preservation

**For Translations:**

You have three options:

1. **Manual Translation** (Recommended for quality)
   - Most accurate for language learning
   - Preserves nuance and teaching intent
   - Time-intensive

2. **DeepL API** (Best automatic option)
   ```bash
   # Install DeepL SDK
   npm install deepl-node

   # Get API key from https://www.deepl.com/pro-api
   # Add to .env: DEEPL_API_KEY=your_key_here
   ```

3. **Google Translate API** (Alternative)
   - Less accurate for German nuances
   - More affordable than DeepL

### 4. Process the Story

Run the processing script:

```bash
npm run process-story data/raw/story-11.json data/stories/
```

This will:
- ✓ Segment German text into sentences
- ✓ Pair with English translations
- ✓ Calculate word count
- ✓ Estimate difficulty (if not provided)
- ✓ Generate `story-11.json` in `data/stories/`
- ✓ Auto-update `manifest.json`

### 5. Validate the Story

```bash
npm run validate-story data/stories/story-11.json
```

Check for:
- ✓ All required fields present
- ✓ Sentence/translation count match
- ✓ No missing translations
- ✓ Reasonable word counts
- ✓ Sentence length warnings

### 6. Test in the App

```bash
npm start
```

1. Open the app
2. Find your new story in the collection
3. Read through to verify:
   - Text flows naturally
   - Translations are accurate
   - No formatting issues
   - Progress tracking works

## Tips for Longer Content

### Sentence Segmentation

For stories with complex punctuation:

**Good:**
```
"Komm!", rief sie. Er kam sofort.
```

**Segments to:**
1. "Komm!", rief sie.
2. Er kam sofort.

**Problematic:**
```
Dr. Müller sagte: "Das ist..."
```

May need manual review after processing.

### Translation Quality

For longer stories (1000+ words):

1. **Batch translate in chunks** (100 sentences at a time)
2. **Review for consistency** (character names, terminology)
3. **Maintain style** (formal vs. informal "you")
4. **Check idioms** (don't translate literally)

### Performance Considerations

The app loads all stories at startup. For very long content:

**Current approach (static imports):**
- Fast on native
- All stories bundled
- ~10-20 stories max recommended

**For 50+ stories:**
- Consider lazy loading
- Database-backed story storage
- On-demand translation fetching

## Advanced: Bulk Processing

For adding multiple stories at once:

```bash
# Create a batch script
for file in data/raw/*.json; do
  npm run process-story "$file" data/stories/
done

# Validate all
npm run validate-story data/stories/
```

## Example: Adding a Long B2 Story

```bash
# 1. Download Kafka's "Die Verwandlung" excerpt
# 2. Split into manageable chapter (~1500 words)
# 3. Translate with DeepL
# 4. Create raw file
cat > data/raw/story-11.json << 'EOF'
{
  "id": "story-11",
  "titleGerman": "Die Verwandlung - Kapitel 1",
  "titleEnglish": "The Metamorphosis - Chapter 1",
  "author": "Franz Kafka",
  "difficulty": "B2",
  "germanText": "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte...",
  "translations": [...]
}
EOF

# 5. Process
npm run process-story data/raw/story-11.json data/stories/

# 6. Validate
npm run validate-story data/stories/story-11.json

# 7. Test
npm start
```

## Content Sources

### Beginner (A1-A2)
- Fairy tales (Märchen)
- Children's books
- Simple news articles ([nachrichtenleicht.de](https://www.nachrichtenleicht.de/))

### Intermediate (B1-B2)
- Young adult literature
- Short stories
- News articles ([Deutsche Welle - Langsam gesprochene Nachrichten](https://www.dw.com/de/deutsch-lernen/nachrichten/s-8030))

### Advanced (C1-C2)
- Classic literature
- Contemporary novels
- Academic texts

## Troubleshooting

**"Translation count mismatch"**
- Check for missed sentence boundaries
- Look for dialog with multiple sentences
- Manually adjust segmentation

**"Word count mismatch"**
- Normal if within 10% variance
- Caused by different tokenization
- Update manifest manually if needed

**"Story too short/long for difficulty"**
- Difficulty is estimated
- Manually set correct level in raw file
- Consider splitting long stories into chapters

## Best Practices

1. **Maintain quality over quantity**
   - Better to have 10 great stories than 100 mediocre ones

2. **Progressive difficulty**
   - Ensure smooth learning curve between levels
   - Test with real learners if possible

3. **Cultural relevance**
   - Choose engaging, culturally rich content
   - Modern stories often more relatable than classics

4. **Regular validation**
   - Re-validate after any changes
   - Keep backup of raw files

## Next Steps

- Add 10-20 longer stories (500-1500 words each)
- Create themed collections (by author, topic, difficulty)
- Consider adding audio narration (TTS or human voice)
- Implement vocabulary highlighting for difficult words

---

**Need help?** Check the scripts' built-in help:
```bash
npm run process-story
npm run validate-story
```
