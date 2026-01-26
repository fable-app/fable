# Fable SDK API Reference

Complete API documentation for the Fable SDK.

## Components

### FableSDK

Main component that provides the complete Fable learning experience.

```tsx
import { FableSDK } from '@fable/sdk';

<FableSDK
  theme={customTheme}
  analyticsProvider={analyticsProvider}
  onStoryStart={handleStoryStart}
  onStoryComplete={handleStoryComplete}
  customStories={myStories}
  useDefaultStories={true}
  navigationContainerRef={navRef}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `Partial<FableTheme>` | `undefined` | Custom theme configuration |
| `analyticsProvider` | `AnalyticsProvider` | `undefined` | Analytics integration |
| `onStoryStart` | `(storyId: string) => void` | `undefined` | Called when story starts |
| `onStoryComplete` | `(storyId, progress) => void` | `undefined` | Called when story completes |
| `customStories` | `Story[]` | `undefined` | Custom story content |
| `useDefaultStories` | `boolean` | `true` | Include default stories |
| `navigationContainerRef` | `any` | `undefined` | Navigation container ref |

## Types

### FableTheme

```typescript
interface FableTheme {
  colors?: {
    primary?: string;          // Primary brand color
    secondary?: string;        // Secondary background color
    accent?: string;           // Accent/highlight color
    background?: string;       // Main background color
    text?: string;             // Primary text color
    textSecondary?: string;    // Secondary text color
    divider?: string;          // Divider/border color
  };
  fonts?: {
    regular?: string;          // Regular font family
    medium?: string;           // Medium weight font
    semibold?: string;         // Semibold font
  };
  spacing?: {
    sm?: number;               // Small spacing (8px)
    base?: number;             // Base spacing (16px)
    lg?: number;               // Large spacing (24px)
    xl?: number;               // Extra large spacing (32px)
  };
  branding?: {
    appName?: string;          // Custom app name
    hideDefaultBranding?: boolean;  // Hide "Fable" branding
  };
}
```

### AnalyticsProvider

```typescript
interface AnalyticsProvider {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackScreenView: (screenName: string) => void;
}
```

### Story

```typescript
interface Story {
  id: string;
  titleGerman: string;
  titleEnglish: string;
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  sentences: Sentence[];
  bookId?: string;
}
```

### Sentence

```typescript
interface Sentence {
  id: string;
  german: string;
  english: string;
}
```

### Progress

```typescript
interface Progress {
  storyId: string;
  percentage: number;              // 0-100
  lastSentenceIndex: number;
  totalSentences: number;
  lastAccessedAt: string;          // ISO date string
}
```

## Hooks

### useSDKContext

Access SDK configuration and state.

```tsx
import { useSDKContext } from '@fable/sdk';

function MyComponent() {
  const { theme, analyticsProvider, onStoryStart } = useSDKContext();
  // ...
}
```

### useAnalytics

Access analytics provider.

```tsx
import { useAnalytics } from '@fable/sdk';

function MyComponent() {
  const analytics = useAnalytics();

  const handleAction = () => {
    analytics?.trackEvent('custom_action', { data: 'value' });
  };
}
```

### useTheme

Access current theme.

```tsx
import { useTheme } from '@fable/sdk';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* content */}
    </View>
  );
}
```

## Core Functions

These functions are re-exported from `@fable/core` for advanced usage.

### loadStory

Load a story by ID.

```tsx
import { loadStory } from '@fable/sdk';

const story = await loadStory('story-01');
```

### getAllStoryMetadata

Get metadata for all available stories.

```tsx
import { getAllStoryMetadata } from '@fable/sdk';

const stories = getAllStoryMetadata();
```

### getProgress

Get reading progress for a story.

```tsx
import { getProgress } from '@fable/sdk';

const progress = await getProgress('story-01');
```

### saveProgress

Save reading progress.

```tsx
import { saveProgress } from '@fable/sdk';

await saveProgress({
  storyId: 'story-01',
  sentenceIndex: 10,
  totalSentences: 50,
});
```

### getAllProgress

Get all progress data.

```tsx
import { getAllProgress } from '@fable/sdk';

const allProgress = await getAllProgress();
// { 'story-01': { percentage: 20, ... }, ... }
```

## Events

The SDK fires these analytics events automatically (if `analyticsProvider` is configured):

### Lifecycle Events

- `sdk_initialized` - SDK has initialized
  - `hasCustomTheme`: boolean
  - `hasCustomStories`: boolean
  - `useDefaultStories`: boolean

### Navigation Events

- `screen_viewed` - Screen was viewed
  - `screenName`: string

### Story Events

- `story_started` - User started reading a story
  - `storyId`: string
  - `timestamp`: string

- `story_completed` - User completed a story
  - `storyId`: string
  - `percentage`: number
  - `timestamp`: string

### Audio Events

- `audio_play` - Audio playback started
  - `storyId`: string
  - `sentenceIndex`: number

- `audio_pause` - Audio playback paused
  - `storyId`: string
  - `sentenceIndex`: number

- `audio_next` - Skipped to next sentence
  - `storyId`: string
  - `sentenceIndex`: number

- `audio_previous` - Skipped to previous sentence
  - `storyId`: string
  - `sentenceIndex`: number

### Settings Events

- `reading_speed_changed` - Reading speed adjusted
  - `speed`: number (0.5 - 1.5)

- `language_order_changed` - Language order toggled
  - `germanFirst`: boolean

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Story Reading | ✅ | ✅ | ✅ |
| Audio Narration | ✅ | ✅ | ⚠️ Limited |
| Progress Tracking | ✅ | ✅ | ✅ |
| Custom Themes | ✅ | ✅ | ✅ |
| Deep Linking | ✅ | ✅ | ✅ |

## Version Compatibility

| SDK Version | React Native | React | React Navigation |
|-------------|--------------|-------|------------------|
| 1.x | 0.70+ | 18.0+ | 6.x |

## Migration Guide

See [MIGRATION.md](./MIGRATION.md) for upgrade instructions between major versions.
