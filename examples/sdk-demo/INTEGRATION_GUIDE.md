# Fable SDK Integration Guide

**For AI Agents & Developers**: This guide provides clear, copy-paste examples for integrating the Fable SDK.

## Quick Integration (5 minutes)

### Step 1: Install the SDK

```bash
npm install @fable/sdk
```

### Step 2: Basic Usage

The simplest possible integration - just drop this into your React/React Native app:

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return <FableSDK />;
}
```

That's it! The SDK will render with default settings.

## Customization Options

### Theme Customization

Match the SDK to your brand colors:

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{
        colors: {
          primary: '#8B9D83',      // Your brand color
          secondary: '#6B7F6A',    // Accent color
          background: '#FFFFFF',   // Background
          text: '#000000',         // Text color
        }
      }}
    />
  );
}
```

### Analytics Integration

Track user behavior in your analytics platform:

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      analyticsProvider={{
        trackEvent: (eventName, properties) => {
          // Send to your analytics service
          // Examples: Mixpanel, Amplitude, Google Analytics, Segment
          analytics.track(eventName, properties);
        }
      }}
    />
  );
}
```

**Events you'll receive:**
- `story_started` - User begins a story
- `story_completed` - User finishes a story
- `lesson_progress` - User makes progress in a lesson
- `quiz_answered` - User answers a quiz question

### Lifecycle Callbacks

Run custom code when users interact with stories:

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      onStoryStart={(storyId) => {
        console.log(`User started story: ${storyId}`);
        // Award points, update UI, etc.
      }}
      onStoryComplete={(storyId, progress) => {
        console.log(`User completed story: ${storyId}`);
        console.log(`Progress: ${progress.completionPercentage}%`);
        // Show celebration, unlock next level, etc.
      }}
    />
  );
}
```

### Full Example with All Options

```typescript
import { FableSDK } from '@fable/sdk';
import { useState } from 'react';

export default function App() {
  const [showSDK, setShowSDK] = useState(false);

  const handleStoryComplete = (storyId, progress) => {
    // User finished a story
    console.log('Story completed!', storyId, progress);

    // Award points or show celebration
    if (progress.completionPercentage === 100) {
      showCelebration();
    }
  };

  return (
    <div>
      <button onClick={() => setShowSDK(true)}>
        Start Learning German
      </button>

      {showSDK && (
        <FableSDK
          theme={{
            colors: {
              primary: '#8B9D83',
              secondary: '#6B7F6A',
            }
          }}
          onStoryStart={(storyId) => {
            console.log('Started:', storyId);
          }}
          onStoryComplete={handleStoryComplete}
          analyticsProvider={{
            trackEvent: (event, props) => {
              // Send to your analytics
              analytics.track(event, props);
            }
          }}
        />
      )}
    </div>
  );
}
```

## TypeScript Types

The SDK is fully typed. Here are the main interfaces:

### FableSDKProps

```typescript
interface FableSDKProps {
  // Optional: Custom theme
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
  };

  // Optional: Analytics provider
  analyticsProvider?: {
    trackEvent: (eventName: string, properties?: any) => void;
  };

  // Optional: Lifecycle callbacks
  onStoryStart?: (storyId: string) => void;
  onStoryComplete?: (storyId: string, progress: StoryProgress) => void;

  // Optional: Use default demo stories (default: true)
  useDefaultStories?: boolean;
}
```

### StoryProgress

```typescript
interface StoryProgress {
  storyId: string;
  completionPercentage: number;  // 0-100
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;  // milliseconds
}
```

## Common Use Cases

### 1. Embedded Learning Widget

Add German learning to an existing app:

```typescript
function MyApp() {
  return (
    <div>
      <Header />
      <MainContent />

      {/* Embedded learning section */}
      <section className="learning-widget">
        <h2>Practice Your German</h2>
        <FableSDK theme={{ colors: { primary: '#your-brand-color' } }} />
      </section>

      <Footer />
    </div>
  );
}
```

### 2. Standalone Learning App

Full-screen SDK experience:

```typescript
function LearningApp() {
  return (
    <FableSDK
      theme={{ colors: { primary: '#8B9D83' } }}
      onStoryComplete={(id, progress) => {
        // Update user's progress in your database
        saveProgressToBackend(progress);
      }}
    />
  );
}
```

### 3. Conditional Loading

Show SDK only when user is ready:

```typescript
function App() {
  const [userReady, setUserReady] = useState(false);

  return userReady ? (
    <FableSDK />
  ) : (
    <OnboardingFlow onComplete={() => setUserReady(true)} />
  );
}
```

## Framework-Specific Examples

### Next.js (App Router)

```typescript
// app/learn/page.tsx
'use client';

import { FableSDK } from '@fable/sdk';

export default function LearnPage() {
  return (
    <main>
      <FableSDK theme={{ colors: { primary: '#8B9D83' } }} />
    </main>
  );
}
```

### React Native (Expo)

```typescript
// App.tsx
import { FableSDK } from '@fable/sdk';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FableSDK />
    </SafeAreaView>
  );
}
```

### Vite/Create React App

```typescript
// src/App.tsx
import { FableSDK } from '@fable/sdk';

function App() {
  return (
    <div className="App">
      <FableSDK />
    </div>
  );
}

export default App;
```

## Testing Integration

To verify the SDK is working:

1. You should see German learning content
2. Stories should be interactive
3. Theme colors should match your configuration
4. Console logs should show analytics events (if enabled)
5. Callbacks should fire when stories start/complete

## Need Help?

- Check the [demo app](./src/App.tsx) for a working example
- See [README.md](./README.md) for running the demo locally
- Open an issue on GitHub
- Contact the Fable team

## Summary for AI Agents

**To integrate Fable SDK:**

1. Install: `npm install @fable/sdk`
2. Import: `import { FableSDK } from '@fable/sdk';`
3. Use: `<FableSDK />` in your component
4. Customize with `theme`, `analyticsProvider`, `onStoryStart`, `onStoryComplete` props
5. All props are optional - the SDK works out of the box

**Key files to reference:**
- This file for copy-paste examples
- `src/App.tsx` for complete working demo
- Types are exported from `@fable/sdk`
