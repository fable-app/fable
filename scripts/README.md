# Content Processing Scripts

Scripts for processing German stories into Fable's bilingual JSON format.

## Scripts

### process-story.ts

Processes raw German text with translations into story JSON format.

**Input format** (JSON):
```json
{
  "id": "story-04",
  "titleGerman": "Der Wald",
  "titleEnglish": "The Forest",
  "author": "Author Name",
  "difficulty": "B1",
  "germanText": "Es war einmal ein großer Wald. Die Bäume waren alt und stark...",
  "translations": [
    "Once upon a time there was a large forest.",
    "The trees were old and strong..."
  ]
}
```

**Usage**:
```bash
npm run process-story raw/story-04.json data/stories/
```

**Features**:
- Automatic sentence segmentation (handles German abbreviations)
- Word count calculation
- Difficulty estimation (if not provided)
- Manifest.json auto-update

### validate-story.ts

Validates story JSON files for correctness and quality.

**Usage**:
```bash
# Validate single file
npm run validate-story data/stories/story-01.json

# Validate all stories in directory
npm run validate-story data/stories/
```

**Checks**:
- Required fields present
- Valid difficulty level
- Sentence ID sequence
- Translation completeness
- Word count accuracy
- Sentence length warnings

## Workflow

### Adding a New Story

1. **Prepare raw input JSON** with German text and translations
2. **Process** the story:
   ```bash
   npm run process-story raw/new-story.json data/stories/
   ```
3. **Validate** the output:
   ```bash
   npm run validate-story data/stories/new-story.json
   ```
4. **Review** the story in the app

### Getting Translations

For MVP, translations can be obtained through:

1. **Manual translation** (most accurate for learning)
2. **DeepL API** (recommended for German→English)
3. **Google Translate API** (alternative)

**Note**: Translation integration is not included in this PR. For now, translations should be prepared manually or via external tools and added to the input JSON.

## Future Enhancements

- DeepL API integration for automatic translation
- Project Gutenberg text scraper
- Batch processing scripts
- Translation quality checks
- Difficulty level ML classifier
