# Fable SDK Demo

Interactive demonstration app showcasing all features of the Fable white-label SDK for German learning.

**📚 [→ Integration Guide](./INTEGRATION_GUIDE.md) - Copy-paste examples for quick integration**

**Use this demo to:**
- Test the SDK integration locally
- See all available features in action
- Reference implementation patterns for your integration
- Experiment with theming and configuration options

## Features Demonstrated

- ✅ Basic SDK integration
- ✅ Custom theming with live preview
- ✅ Analytics event tracking
- ✅ Lifecycle callbacks (onStoryStart, onStoryComplete)
- ✅ Real-time event logging
- ✅ Interactive configuration controls

## Running Locally

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/fable-app/fable.git
   cd fable
   ```

2. **Install dependencies** (from repository root)
   ```bash
   npm install
   ```

3. **Start the SDK demo**
   ```bash
   cd examples/sdk-demo
   npm run web
   ```

4. **Open in browser**
   - The demo will open automatically at `http://localhost:8081`
   - Or press `w` in the terminal to open manually

### Available Scripts

```bash
npm run web       # Run in browser (recommended for SDK testing)
npm run ios       # Run on iOS simulator
npm run android   # Run on Android emulator
npm start         # Start Expo dev server (shows QR code for mobile)
```

## SDK Integration Example

Here's the minimal code to integrate the Fable SDK into your app:

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{ colors: { primary: '#8B9D83' } }}
      onStoryComplete={(id, progress) => console.log('Story completed!', id)}
      analyticsProvider={{
        trackEvent: (event, props) => {
          // Send to your analytics service
          console.log('Analytics:', event, props);
        }
      }}
    />
  );
}
```

## Demo App Structure

```
examples/sdk-demo/
├── src/
│   └── App.tsx           # Interactive demo with all SDK features
├── index.js              # App entry point
├── package.json          # Dependencies
├── metro.config.js       # Metro bundler config for monorepo
└── README.md            # This file
```

## Key Features to Explore

### 1. Theme Customization
Toggle between default and custom themes to see how the SDK adapts to your brand colors.

### 2. Analytics Integration
Watch the event log to see all analytics events fired by the SDK (story views, completions, interactions).

### 3. Lifecycle Callbacks
See real-time notifications when stories start and complete, including progress data.

### 4. Interactive Controls
Use the control panel to:
- Launch SDK on demand
- Toggle custom themes
- Enable/disable analytics
- Clear event logs

## Integrating into Your App

1. **Install the SDK** (from your app's root)
   ```bash
   npm install @fable/sdk
   ```

2. **Import and use the SDK component**
   ```typescript
   import { FableSDK } from '@fable/sdk';
   ```

3. **Wrap or embed in your app**
   - See `src/App.tsx` for a complete example
   - Customize theme to match your brand
   - Connect your analytics service
   - Add lifecycle callbacks for custom behavior

## Documentation

- [SDK API Reference](../../packages/sdk/README.md)
- [Theming Guide](../../packages/sdk/docs/THEMING_GUIDE.md)
- [Integration Guide](../../packages/sdk/docs/INTEGRATION.md)

## Troubleshooting

**Metro bundler errors?**
- Make sure you run `npm install` from the repository root first
- Delete `node_modules` and reinstall if needed

**SDK not loading?**
- Check that workspace dependencies are installed (`@fable/sdk` should resolve automatically)
- Verify you're running from the monorepo root

**Need help?**
- Open an issue on GitHub
- Contact the Fable team

---

Built with ❤️ for German learners worldwide
