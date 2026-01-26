# Fable Architecture

Complete architecture documentation for the Fable language learning platform.

## Overview

Fable is a dual-distribution German learning platform that provides bilingual storytelling through:

1. **Standalone Mobile App** - iOS App Store and Google Play Store
2. **White-Label SDK** - npm package for B2B partner integration

## Monorepo Structure

```
fable/
├── apps/
│   └── mobile/              # Standalone Expo app for app stores
│       ├── app/             # Expo Router screens
│       ├── components/      # App-specific UI components
│       ├── hooks/           # App-specific React hooks
│       ├── data/            # Story data (JSON)
│       ├── services/        # App services
│       └── types/           # App types
│
├── packages/
│   ├── core/                # Shared business logic, state, storage
│   │   ├── src/
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   ├── services/    # Story loading, progress tracking
│   │   │   └── data/        # Story content (JSON files)
│   │   └── package.json
│   │
│   ├── design-system/       # Shared UI tokens and components
│   │   ├── src/
│   │   │   ├── colors.ts    # Color palette
│   │   │   ├── typography.ts # Font styles
│   │   │   ├── spacing.ts   # Layout spacing
│   │   │   └── animations.ts # Animation configs
│   │   └── package.json
│   │
│   └── sdk/                 # White-label SDK for B2B partners
│       ├── src/
│       │   ├── screens/     # React Navigation screens
│       │   ├── components/  # Reusable UI components
│       │   ├── navigation/  # React Navigation config
│       │   ├── hooks/       # SDK hooks
│       │   ├── context/     # React context providers
│       │   ├── config/      # Theme configuration
│       │   ├── utils/       # Utility functions
│       │   └── FableSDK.tsx # Main SDK component
│       ├── docs/            # SDK documentation
│       ├── README.md        # SDK usage guide
│       └── package.json
│
└── package.json             # Workspace root
```

## Package Architecture

### @fable/core

**Purpose**: Platform-agnostic business logic and data layer

**Responsibilities**:
- Story loading and management
- Progress tracking (SQLite on native, AsyncStorage on web)
- Type definitions for domain models
- Data storage service abstraction

**Key Files**:
- `services/story.service.ts` - Load stories, get metadata
- `services/progress.service.ts` - Save/load reading progress
- `services/storage.service.ts` - Platform-agnostic storage
- `types/story.types.ts` - Story, Sentence, StoryMetadata types
- `types/progress.types.ts` - Progress, ProgressUpdate types

**Dependencies**:
- `react-native` (Platform.OS for platform detection)
- `@react-native-async-storage/async-storage` (web fallback)
- `expo-sqlite` (native storage)

### @fable/design-system

**Purpose**: Consistent UI tokens and shared components

**Responsibilities**:
- Color palette (sage green, dusty rose, neutral grays)
- Typography system (Inter, Literata fonts)
- Spacing scale (8px base grid)
- Animation configurations

**Key Files**:
- `colors.ts` - Semantic color tokens
- `typography.ts` - Font families, sizes, line heights
- `spacing.ts` - Consistent spacing values
- `animations.ts` - Animation durations and configs

**Design Principles**:
- Japanese minimalism
- High contrast for readability
- Smooth micro-interactions
- Accessible color ratios (WCAG AA)

### @fable/sdk

**Purpose**: White-label SDK for partner integration

**Responsibilities**:
- React Navigation routing (replaces Expo Router)
- Screen components (StoryList, Reader, ChapterList)
- Theme customization API
- Analytics integration hooks
- Custom story loading
- Public API surface

**Key Files**:
- `FableSDK.tsx` - Main entry point
- `navigation/Navigator.tsx` - React Navigation stack
- `screens/ReaderScreen.tsx` - Bilingual reader
- `context/SDKContext.tsx` - Theme and config provider
- `config/theme.ts` - Theme utilities

**Peer Dependencies** (required by integrators):
- `@react-navigation/native`
- `@react-navigation/stack`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `react-native-screens`
- `expo-speech`

### apps/mobile

**Purpose**: Standalone app for app store distribution

**Responsibilities**:
- Expo Router navigation
- App-specific UI and flows
- App store builds (EAS)
- Platform-specific configurations

**Technology Stack**:
- Expo SDK 54
- Expo Router for file-based routing
- EAS Build for app store builds
- TypeScript strict mode

## Data Flow

### Story Loading

```
User opens app
  ↓
StoryListScreen loads
  ↓
getAllStoryMetadata() from @fable/core
  ↓
Displays story cards with progress
  ↓
User taps story
  ↓
loadStory(id) from @fable/core
  ↓
ReaderScreen displays bilingual content
```

### Progress Tracking

```
User scrolls in Reader
  ↓
handleScroll() detects current sentence
  ↓
Debounced (500ms) call to saveProgress()
  ↓
progress.service.ts determines platform
  ↓
SQLite (iOS/Android) or AsyncStorage (web)
  ↓
Progress saved with percentage calculation
```

### Audio Narration

```
User presses play button
  ↓
Build audio queue (remaining sentences)
  ↓
playNextSentence() recursive function
  ↓
expo-speech reads German text
  ↓
Highlight current sentence
  ↓
Auto-scroll to sentence
  ↓
500ms pause between sentences
  ↓
Continue until queue empty or paused
```

## Distribution Paths

### Path 1: App Stores (apps/mobile)

**Build Process**:
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

**Target Audience**: End users downloading from app stores

**Revenue Model**: Free app, potential in-app purchases

### Path 2: npm Package (@fable/sdk)

**Build Process**:
```bash
cd packages/sdk
npm run build        # Compiles TypeScript to dist/
npm publish          # Publishes to npm registry
```

**Target Audience**: B2B partners integrating into their apps

**Revenue Model**: SDK licensing, white-label fees

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| **Core Functionality** |
| Story Reading | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ (SQLite) | ✅ (SQLite) | ✅ (AsyncStorage) |
| Multi-chapter Books | ✅ | ✅ | ✅ |
| **Audio** |
| Text-to-Speech | ✅ (AVSpeechSynthesizer) | ✅ (TextToSpeech) | ⚠️ (Browser API, limited) |
| Speed Control | ✅ | ✅ | ✅ |
| Sentence Highlighting | ✅ | ✅ | ✅ |
| **SDK** |
| React Navigation | ✅ | ✅ | ✅ |
| Custom Themes | ✅ | ✅ | ✅ |
| Analytics Integration | ✅ | ✅ | ✅ |

## Technology Stack

### Frontend
- **React Native** 0.81.5
- **React** 19.1.0
- **TypeScript** 5.7.3 (strict mode)
- **Expo** SDK 54
- **React Navigation** 6.x (SDK only)
- **Expo Router** (mobile app only)

### Storage
- **expo-sqlite** (~16.0.10) - iOS/Android local storage
- **@react-native-async-storage/async-storage** (^2.2.0) - Web fallback

### UI/UX
- **react-native-reanimated** (~4.1.1) - Animations
- **react-native-gesture-handler** (~2.28.0) - Touch gestures
- **expo-speech** (~13.0.0) - Text-to-speech

### Development
- **npm workspaces** - Monorepo management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD

## Design System

### Color Palette

```typescript
{
  // Neutrals
  background: {
    primary: '#FAFAFA',      // Off-white
    secondary: '#F5F5F5',    // Light gray
    elevated: '#FFFFFF',     // White
    accent: '#E8EDE6',       // Light sage
  },

  // Text
  text: {
    primary: '#2C2C2C',      // Charcoal
    secondary: '#666666',    // Medium gray
    tertiary: '#999999',     // Light gray
    accent: '#8B9D83',       // Sage green
  },

  // Interactive
  interactive: {
    default: '#8B9D83',      // Sage green
    hover: '#7A8C72',        // Darker sage
    pressed: '#697A61',      // Even darker sage
  },

  // Progress
  progress: {
    track: '#E5E5E5',        // Light gray
    fill: '#C9ADA7',         // Dusty rose
    complete: '#8B9D83',     // Sage green
  },

  // Semantic
  divider: '#E0E0E0',
  shadow: '#000000',
}
```

### Typography

```typescript
{
  families: {
    ui: 'Inter',             // UI text
    reading: 'Literata',     // Story content
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

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.7,
  },
}
```

## Security Considerations

### Story Data
- Story content is bundled with app (no network requests)
- Progress data stored locally (not synced to cloud)
- No personal information collected

### SDK Integration
- No telemetry by default (opt-in via analyticsProvider)
- Theme validation to prevent injection
- Type-safe APIs to prevent runtime errors

## Performance Optimizations

### Story Loading
- Lazy loading: Stories loaded on-demand
- JSON parsing cached in memory
- Progress loaded asynchronously

### UI Rendering
- Staggered entrance animations (first 6 items only)
- Virtualized lists for long story lists (future)
- Debounced scroll tracking (200ms throttle)
- Debounced progress saves (500ms)

### Audio
- Speech queue management (avoid overlapping)
- Cleanup on unmount
- Error recovery for speech failures

## Future Architecture Plans

### Phase 4: Cloud Sync (Optional)
- Firebase/Supabase backend
- User authentication
- Cross-device progress sync
- Story recommendations

### Phase 5: Content Management
- CMS for story management
- Story submission portal
- Community-contributed content
- Translation quality control

### Phase 6: Advanced Features
- Vocabulary tracking
- Spaced repetition system
- Grammar exercises
- Social features (clubs, challenges)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow and coding standards.

## License

MIT - See [LICENSE](./LICENSE) for details.
