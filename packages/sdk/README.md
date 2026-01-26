# @fable/sdk

White-label German learning SDK for React Native applications. Integrate Fable's bilingual storytelling experience into your app.

## Features

- 📚 **Bilingual Stories** - German-English parallel text with sentence-by-sentence reading
- 🔊 **Audio Narration** - Native German text-to-speech with adjustable speed
- 📊 **Progress Tracking** - Automatic progress saving and resume functionality
- 📖 **Multi-Chapter Books** - Support for both single stories and multi-chapter books
- 🎨 **Customizable Theme** - White-label ready with custom colors and branding
- 📱 **React Navigation** - Fully integrated navigation stack
- 💾 **Platform-Agnostic Storage** - Works on iOS, Android, and web

## Installation

```bash
npm install @fable/sdk
```

### Peer Dependencies

The SDK requires the following peer dependencies:

```bash
npm install react react-native @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npm install expo-speech
```

## Quick Start

### Basic Integration

```tsx
import React from 'react';
import { FableSDK } from '@fable/sdk';

export default function App() {
  return <FableSDK />;
}
```

### Custom Theme

```tsx
import React from 'react';
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{
        colors: {
          primary: '#8B9D83',
          accent: '#C9ADA7',
        },
        branding: {
          appName: 'MyApp Learn German',
          hideDefaultBranding: true,
        },
      }}
    />
  );
}
```

### With Analytics

```tsx
import React from 'react';
import { FableSDK } from '@fable/sdk';
import Analytics from '@segment/analytics-react-native';

export default function App() {
  const analyticsProvider = {
    trackEvent: (event: string, properties?: Record<string, any>) => {
      Analytics.track(event, properties);
    },
    trackScreenView: (screenName: string) => {
      Analytics.screen(screenName);
    },
  };

  return (
    <FableSDK
      analyticsProvider={analyticsProvider}
      onStoryStart={(storyId) => {
        console.log('Story started:', storyId);
      }}
      onStoryComplete={(storyId, progress) => {
        console.log('Story completed:', storyId, progress);
      }}
    />
  );
}
```

## API Reference

### FableSDK Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `FableTheme` | `undefined` | Custom theme configuration |
| `onStoryStart` | `(storyId: string) => void` | `undefined` | Callback when story starts |
| `onStoryComplete` | `(storyId: string, progress: Progress) => void` | `undefined` | Callback when story completes |
| `customStories` | `Story[]` | `undefined` | Custom stories to display |
| `useDefaultStories` | `boolean` | `true` | Whether to include default stories |
| `analyticsProvider` | `AnalyticsProvider` | `undefined` | Analytics integration |

### FableTheme

```typescript
interface FableTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    textSecondary?: string;
    divider?: string;
  };
  fonts?: {
    regular?: string;
    medium?: string;
    semibold?: string;
  };
  spacing?: {
    sm?: number;
    base?: number;
    lg?: number;
    xl?: number;
  };
  branding?: {
    appName?: string;
    hideDefaultBranding?: boolean;
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

## Advanced Usage

### Custom Stories

You can provide your own story content:

```tsx
import { FableSDK, Story } from '@fable/sdk';

const customStory: Story = {
  id: 'custom-story-1',
  titleGerman: 'Meine Geschichte',
  titleEnglish: 'My Story',
  author: 'Your Name',
  sentences: [
    {
      id: '1',
      german: 'Das ist ein Satz.',
      english: 'This is a sentence.',
    },
    // ... more sentences
  ],
};

export default function App() {
  return (
    <FableSDK
      customStories={[customStory]}
      useDefaultStories={false}
    />
  );
}
```

### Direct API Access

The SDK also exports core functions for advanced usage:

```tsx
import {
  loadStory,
  getAllStoryMetadata,
  getProgress,
  saveProgress,
} from '@fable/sdk';

// Load a story
const story = await loadStory('story-01');

// Get all story metadata
const allStories = getAllStoryMetadata();

// Get progress for a story
const progress = await getProgress('story-01');

// Save progress
await saveProgress({
  storyId: 'story-01',
  sentenceIndex: 10,
  totalSentences: 50,
});
```

## Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (with AsyncStorage fallback)

## Requirements

- React Native 0.70+
- React 18+
- React Navigation 6+

## License

MIT

## Support

For issues, questions, or contributions, please visit:
[https://github.com/fable-app/fable](https://github.com/fable-app/fable)
