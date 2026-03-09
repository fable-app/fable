# Fable SDK Demo

Interactive demonstration app showcasing all features of the Fable white-label SDK.

## Features

- ✅ Basic SDK integration
- ✅ Custom theming
- ✅ Analytics tracking  
- ✅ Lifecycle callbacks
- ✅ Event logging
- ✅ Real-time configuration

## Quick Start

```bash
npm install
npm start
```

## Usage Example

```typescript
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{ colors: { primary: '#8B9D83' } }}
      onStoryComplete={(id, progress) => console.log('Done!')}
      analyticsProvider={{
        trackEvent: (event, props) => analytics.track(event, props)
      }}
    />
  );
}
```

## Documentation

- [Installation Guide](../../packages/sdk/README.md)
- [API Reference](../../packages/sdk/docs/API_REFERENCE.md)
- [Theming Guide](../../packages/sdk/docs/THEMING_GUIDE.md)

Built with ❤️ for German learners worldwide
