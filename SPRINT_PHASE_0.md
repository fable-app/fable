# Sprint Phase 0: Project Foundation
**Fable - German Learning App**

---

## Sprint Overview

Phase 0 establishes the technical foundation for Fable. This phase focuses on project initialization, tooling setup, and creating the core infrastructure needed for development.

### Sprint Goals

1. ✅ Initialize Expo project with TypeScript
2. ✅ Configure Android and Web PWA targets
3. ✅ Establish project structure and conventions
4. ✅ Implement design system foundations
5. ✅ Build content processing pipeline
6. ✅ Prepare initial story content

---

## Task Breakdown

### 1. Project Initialization

**Task: Initialize Expo Project**
- Create new Expo project with TypeScript template
- Use Expo SDK 52 (or latest stable)
- Configure for Android primary, Web secondary
- Verify Expo Go compatibility

**Task: Project Structure Setup**
```
fable/
├── app/                  # Expo Router pages
│   ├── index.tsx        # StoryCollection (home)
│   ├── reader/
│   │   └── [storyId].tsx # BilingualReader
│   └── _layout.tsx      # Root layout
├── components/           # Reusable UI components
│   ├── StoryCard.tsx
│   ├── SentenceCard.tsx
│   └── ProgressBar.tsx
├── design-system/        # Design tokens & styled components
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── animations.ts
├── data/                 # Story JSON files
│   ├── stories/
│   └── manifest.json
├── services/             # Business logic
│   ├── storage.service.ts
│   ├── progress.service.ts
│   └── story.service.ts
├── hooks/                # Custom React hooks
│   ├── useProgress.ts
│   └── useStories.ts
├── types/                # TypeScript definitions
│   ├── story.types.ts
│   └── progress.types.ts
├── utils/                # Utility functions
│   └── format.ts
└── scripts/              # Content processing
    ├── process-story.ts
    ├── translate.ts
    └── segment.ts
```

**Task: Git Setup**
- Initialize git repository (already done)
- Create `.gitignore` for Expo
- Set up branch protection for main

---

### 2. Development Environment

**Task: Install Core Dependencies**
```
Core Framework:
- expo (SDK 52+)
- expo-router
- react-native
- typescript

State Management:
- zustand

Storage:
- expo-sqlite
- @react-native-async-storage/async-storage

UI & Animation:
- react-native-reanimated
- react-native-gesture-handler
- expo-font
- @expo-google-fonts/inter
- @expo-google-fonts/literata

Development:
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- prettier
- eslint
```

**Task: Configure TypeScript**
- Enable strict mode
- Configure path aliases (@components, @services, etc.)
- Set up types for all dependencies
- Create base tsconfig.json

**Task: Configure ESLint & Prettier**
- Install ESLint with TypeScript support
- Configure Prettier with project style
- Set up pre-commit hooks (optional)
- Add lint scripts to package.json

**Task: Configure Android**
- Set app name: "Fable"
- Configure package: com.fable.app
- Set minimum SDK: 23 (Android 6.0)
- Configure app icon placeholder

**Task: Configure Web PWA**
- Set up web manifest
- Configure PWA settings
- Set app metadata
- Test hot reload

---

### 3. Design System Implementation

**Task: Create Design Tokens**

**colors.ts:**
```typescript
export const colors = {
  background: {
    primary: '#FAFAF8',
    secondary: '#F5F5F2',
    elevated: '#FFFFFF',
    accent: '#E8EDE7',
  },
  text: {
    primary: '#2C2C2C',
    secondary: '#6B6B6B',
    tertiary: '#9B9B98',
    accent: '#8B9D83',
  },
  interactive: {
    default: '#8B9D83',
    hover: '#A8B9A0',
    pressed: '#7A8C73',
  },
  progress: {
    fill: '#C9ADA7',
    track: '#E8E0DE',
    complete: '#8B9D83',
  },
  divider: '#E8E8E6',
  shadow: 'rgba(44, 44, 44, 0.04)',
};
```

**typography.ts:**
```typescript
export const typography = {
  fonts: {
    ui: 'Inter',
    reading: 'Literata',
  },
  sizes: {
    displayLarge: 32,
    display: 28,
    headingLarge: 24,
    heading: 20,
    bodyLarge: 18,
    body: 16,
    bodySmall: 14,
    label: 12,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.5,
    loose: 1.6,
  },
};
```

**spacing.ts:**
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
```

**animations.ts:**
```typescript
export const animations = {
  duration: {
    instant: 0,
    fast: 150,
    standard: 250,
    leisurely: 350,
    slow: 500,
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
  },
};
```

**Task: Load Fonts**
- Install Inter and Literata fonts
- Create font loading utility
- Handle loading states
- Test font rendering

---

### 4. Content Processing Pipeline

**Task: Define Data Structure**

**story.types.ts:**
```typescript
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
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  sentences: Sentence[];
}

export interface StoryMetadata {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author: string;
  wordCount: number;
  difficulty: string;
}

export interface Progress {
  storyId: string;
  lastSentenceIndex: number;
  percentage: number;
  lastReadAt: string;
}
```

**Task: Build Story Processing Script**

Create `scripts/process-story.ts`:
- Download text from Project Gutenberg
- Clean formatting (remove headers, page numbers)
- Segment into sentences using NLP
- Generate story ID and metadata
- Validate output format

**Task: Build Translation Pipeline**

Create `scripts/translate.ts`:
- Set up translation API (DeepL or Google)
- Process sentences in batches
- Handle API rate limiting
- Cache translations
- Validate translation quality

**Task: Create Story Manifest Generator**

Create `scripts/generate-manifest.ts`:
- Scan all story files
- Generate manifest.json with metadata
- Sort by difficulty
- Validate all stories

---

### 5. Initial Story Content

**Task: Source 10 German Stories**

Find suitable stories from Project Gutenberg:
- 3-4 Beginner (A1-A2): Simple vocabulary, short sentences
- 3-4 Intermediate (B1-B2): Moderate complexity
- 2-3 Advanced (C1-C2): Literary German

**Target word count:** ~1000 words each

**Suggested authors:**
- Beginner: Grimm Brothers (simple fairy tales)
- Intermediate: Heinrich Heine (short poems/prose)
- Advanced: Hermann Hesse, Franz Kafka (short excerpts)

**Task: Process Stories**
- Download each story
- Run through processing pipeline
- Translate all sentences
- Generate JSON files
- Validate completeness

**Task: Create Story Manifest**
- Generate manifest.json
- Include all metadata
- Verify story order
- Test loading in app

---

### 6. Core Services

**Task: Implement Storage Service**

Create `services/storage.service.ts`:
- Set up AsyncStorage wrapper
- Implement get/set/remove methods
- Add error handling
- Type-safe interface

**Task: Implement Progress Service**

Create `services/progress.service.ts`:
- Set up SQLite database
- Create progress table schema
- Implement save/load progress
- Calculate percentages
- Handle resume position

**Task: Implement Story Service**

Create `services/story.service.ts`:
- Load story manifest
- Get story by ID
- Get all stories
- Filter by difficulty
- Cache loaded stories

---

### 7. Basic UI Implementation

**Task: Create Root Layout**

Create `app/_layout.tsx`:
- Set up Expo Router
- Load fonts
- Initialize services
- Handle app state

**Task: Create Home Screen**

Create `app/index.tsx`:
- Display "Hello Fable" placeholder
- List all available stories (text only)
- Test navigation
- Verify data loading

**Task: Create Reader Screen**

Create `app/reader/[storyId].tsx`:
- Load story by ID
- Display first sentence (plain text)
- Test scrolling
- Verify back navigation

---

### 8. Testing & Validation

**Task: Web Testing**
- Run on web (`npx expo start --web`)
- Test hot reload
- Verify routing works
- Check console for errors

**Task: Android Simulator Testing**
- Launch Android simulator
- Open in Expo Go
- Test navigation
- Verify fonts load
- Check performance

**Task: Create Test Story**
- Create one complete test story
- Include 5-10 sentence pairs
- Test full data flow
- Verify JSON structure

---

## Dependencies Between Tasks

**Critical Path:**
```
1. Project Init → 2. Environment Setup → 3. Design Tokens → 7. Basic UI
                ↓
            4. Data Structure → 5. Story Content → 6. Services → 7. Basic UI
```

**Parallel Work Possible:**
- Design System (3) can be done independently
- Content Processing (4-5) can be done independently
- Services (6) depends on Data Structure (4) but not on content

**Recommended Sequence:**
1. Initialize project and install dependencies (1-2)
2. Create design tokens (3)
3. Build data structures and processing pipeline (4)
4. Implement services (6)
5. Process initial stories (5)
6. Build basic UI (7)
7. Test everything (8)

---

## Success Criteria

### Phase 0 is complete when:

✅ **Project Setup**
- [ ] Expo project runs on web without errors
- [ ] Expo Go can open the app on Android
- [ ] TypeScript compilation succeeds with no errors
- [ ] ESLint passes with no warnings

✅ **Design System**
- [ ] All design tokens are defined and exported
- [ ] Fonts (Inter, Literata) load successfully
- [ ] Colors match design system spec
- [ ] TypeScript types for all tokens

✅ **Content Pipeline**
- [ ] Story processing script works end-to-end
- [ ] At least 1 test story fully processed
- [ ] Translation pipeline functional
- [ ] Manifest generation works

✅ **Services**
- [ ] Progress tracking saves and loads correctly
- [ ] Story service loads from manifest
- [ ] SQLite database initializes properly
- [ ] All services have TypeScript types

✅ **Basic UI**
- [ ] Home screen displays story list
- [ ] Reader screen displays a story
- [ ] Navigation works between screens
- [ ] No crashes or console errors

✅ **Testing**
- [ ] Runs smoothly on web browser
- [ ] Opens successfully in Expo Go (Android)
- [ ] Hot reload works
- [ ] No performance issues with test content

---

## Handoff to Phase 1

### Deliverables for Phase 1:
1. ✅ Working Expo project with all dependencies
2. ✅ Complete design system implementation
3. ✅ Functional content processing pipeline
4. ✅ At least 3-5 fully processed stories
5. ✅ All services implemented and tested
6. ✅ Basic navigation between screens

### Known Gaps to Address in Phase 1:
- Full BilingualReader component design
- StoryCollection component design
- Progress visualization UI
- Smooth animations and transitions
- Complete 10-story library

### Phase 1 Focus:
- Implement production-quality BilingualReader
- Implement StoryCollection with progress indicators
- Add smooth animations per design system
- Complete all 10 stories
- Polish UX to match Japanese minimalist aesthetic

---

## Notes & Considerations

**Android-First Strategy:**
- Test primarily on Android simulator
- Use Expo Go for rapid iteration
- Web serves as quick testing platform
- iOS compatibility maintained but not primary focus

**Content Strategy:**
- Start with 3-5 stories for Phase 0
- Complete remaining 5-7 stories during Phase 1
- Establish workflow for adding more stories later
- Document content addition process

**Performance Considerations:**
- Profile with React DevTools
- Ensure smooth scrolling (60fps target)
- Optimize SQLite queries
- Test with longest story (~1500 words)

**Risk Mitigation:**
- Translation API: Have backup provider ready
- Story processing: Manual review of first few
- Font loading: Handle loading states gracefully
- SQLite: Test on actual device early

---

**Sprint Duration:** Flexible, quality over speed
**Review Checkpoint:** After success criteria met
**Next Sprint:** Phase 1 - Core Reading Experience

---

**Last Updated:** 2026-01-13
**Version:** 1.0
