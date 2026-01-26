# Fable SDK Integration Guide

Complete guide for integrating the Fable SDK into your React Native application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Advanced Configuration](#advanced-configuration)
5. [Testing Integration](#testing-integration)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before integrating the Fable SDK, ensure your project meets these requirements:

- **React Native**: 0.70 or higher
- **React**: 18.0 or higher
- **Platform**: iOS 13+, Android API 21+
- **Navigation**: React Navigation 6.x (required)

## Installation

### Step 1: Install the SDK

```bash
npm install @fable/sdk
```

### Step 2: Install Peer Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-safe-area-context react-native-screens
npm install expo-speech
```

### Step 3: Configure React Native Gesture Handler

Add this to the **top** of your `index.js`:

```javascript
import 'react-native-gesture-handler';
```

### Step 4: Configure React Native Reanimated

Add to `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

### Step 5: iOS Setup

```bash
cd ios && pod install && cd ..
```

## Basic Setup

### Minimal Integration

```tsx
import React from 'react';
import { FableSDK } from '@fable/sdk';

export default function App() {
  return <FableSDK />;
}
```

That's it! Your app now has full German learning functionality.

## Advanced Configuration

### Custom Theme

```tsx
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{
        colors: {
          primary: '#8B9D83',    // Sage green
          accent: '#C9ADA7',      // Dusty rose
          background: '#FAFAFA',
          text: '#2C2C2C',
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

### Analytics Integration

#### With Segment

```tsx
import Analytics from '@segment/analytics-react-native';
import { FableSDK } from '@fable/sdk';

const analyticsProvider = {
  trackEvent: (event: string, properties?: Record<string, any>) => {
    Analytics.track(event, properties);
  },
  trackScreenView: (screenName: string) => {
    Analytics.screen(screenName);
  },
};

export default function App() {
  return <FableSDK analyticsProvider={analyticsProvider} />;
}
```

#### With Firebase

```tsx
import analytics from '@react-native-firebase/analytics';
import { FableSDK } from '@fable/sdk';

const analyticsProvider = {
  trackEvent: (event: string, properties?: Record<string, any>) => {
    analytics().logEvent(event, properties);
  },
  trackScreenView: (screenName: string) => {
    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  },
};

export default function App() {
  return <FableSDK analyticsProvider={analyticsProvider} />;
}
```

### Event Callbacks

```tsx
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      onStoryStart={(storyId) => {
        console.log('Story started:', storyId);
        // Update your backend, trigger notifications, etc.
      }}
      onStoryComplete={(storyId, progress) => {
        console.log('Story completed:', storyId, progress);
        // Award points, unlock achievements, etc.
      }}
    />
  );
}
```

### Deep Linking

```tsx
import { useRef } from 'react';
import { FableSDK } from '@fable/sdk';
import { useNavigationContainerRef } from '@react-navigation/native';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <FableSDK
      navigationContainerRef={navigationRef}
      // Your deep linking config
    />
  );
}
```

## Testing Integration

### Manual Testing Checklist

- [ ] Story list loads correctly
- [ ] Can tap on a story to open reader
- [ ] Audio narration works
- [ ] Progress is saved and restored
- [ ] Multi-chapter books work
- [ ] Custom theme is applied
- [ ] Analytics events fire
- [ ] Deep links work

### Automated Testing

```tsx
import { render } from '@testing-library/react-native';
import { FableSDK } from '@fable/sdk';

describe('FableSDK', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<FableSDK />);
    expect(getByText(/Fable/i)).toBeTruthy();
  });

  it('applies custom theme', () => {
    const theme = {
      colors: { primary: '#FF0000' },
    };
    const { container } = render(<FableSDK theme={theme} />);
    // Assert theme is applied
  });
});
```

## Troubleshooting

### Common Issues

#### "Invariant Violation: requireNativeComponent: RNGestureHandlerButton was not found"

**Solution**: Ensure `react-native-gesture-handler` is imported at the top of `index.js`

```javascript
import 'react-native-gesture-handler';
```

#### "Unable to resolve module @react-navigation/stack"

**Solution**: Install peer dependencies:

```bash
npm install @react-navigation/native @react-navigation/stack
```

#### Audio Not Playing on iOS

**Solution**: Ensure you have the required permissions in `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Required for text-to-speech</string>
```

#### Progress Not Saving

**Solution**: The SDK uses AsyncStorage. Ensure it's properly linked:

```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting docs](./TROUBLESHOOTING.md)
2. Search existing [GitHub issues](https://github.com/fable-app/fable/issues)
3. Create a new issue with:
   - SDK version
   - React Native version
   - Platform (iOS/Android)
   - Error message
   - Minimal reproduction code

## Next Steps

- Read the [API Reference](./API_REFERENCE.md)
- Learn about [Theming](./THEMING_GUIDE.md)
- Explore [Custom Stories](./CUSTOM_STORIES.md)
- Set up [Analytics](./ANALYTICS.md)
