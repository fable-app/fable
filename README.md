# Fable

**Learn German through beautiful bilingual stories**

A dual-distribution language learning platform with Japanese minimalist aesthetics.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020)](https://expo.dev/)

---

## 🌟 Features

- 📚 **Bilingual Stories** - German-English parallel text, sentence by sentence
- 🔊 **Audio Narration** - Native German text-to-speech with adjustable speed
- 📊 **Progress Tracking** - Automatic bookmarking and resume functionality
- 📖 **Multi-Chapter Books** - Support for both short stories and full books
- 🎨 **Beautiful Design** - Japanese minimalist aesthetics for comfortable reading
- 🌐 **Cross-Platform** - iOS, Android, and Web support

---

## 📦 Distribution

Fable is available in two ways:

### For End Users

**Standalone Mobile App** - Download from app stores (coming soon)

- [iOS App Store](#) (coming soon)
- [Google Play](#) (coming soon)

### For Developers

**White-Label SDK** - Integrate Fable into your React Native app

```bash
npm install @fable/sdk
```

See [SDK Documentation](./packages/sdk/README.md) for integration guide.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/fable-app/fable.git
cd fable

# Install dependencies
npm install
```

### Run the Standalone App

```bash
# Start the development server
npm run mobile

# Or run on specific platforms
npm run mobile:ios      # iOS Simulator
npm run mobile:android  # Android Emulator
npm run mobile:web      # Web browser
```

### Use the SDK

See the [SDK Integration Guide](./packages/sdk/docs/INTEGRATION_GUIDE.md).

---

## 🏗️ Monorepo Structure

```
fable/
├── apps/
│   └── mobile/              # Standalone Expo app for app stores
│
├── packages/
│   ├── core/                # Shared business logic and data
│   ├── design-system/       # UI tokens and components
│   └── sdk/                 # White-label SDK for B2B partners
│
└── package.json             # Workspace root
```

### Packages

| Package | Purpose | Published |
|---------|---------|-----------|
| `@fable/mobile` | Standalone app for app stores | No (internal) |
| `@fable/core` | Business logic and data layer | No (internal) |
| `@fable/design-system` | Design tokens and UI components | No (internal) |
| `@fable/sdk` | White-label SDK for integration | Yes (npm) |

---

## 📖 Documentation

### For Users
- **[User Guide](#)** - How to use the Fable app

### For Developers
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[SDK Integration Guide](./packages/sdk/docs/INTEGRATION_GUIDE.md)** - Integrate the SDK
- **[SDK API Reference](./packages/sdk/docs/API_REFERENCE.md)** - Complete API docs
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute

### For DevOps
- **[DEPLOYMENT_MANAGER.md](./DEPLOYMENT_MANAGER.md)** - CI/CD and deployment
- **[DEPLOYMENT_STANDARDS.md](./DEPLOYMENT_STANDARDS.md)** - Release standards
- **[DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md)** - Operational playbooks

---

## 🎨 Design System

Fable embodies Japanese minimalist aesthetics - inspired by the soft, inviting feeling of premium Japanese stationery.

**Key Principles:**
- Warm neutral backgrounds (off-white, light sage)
- Generous breathing room and whitespace
- Soft, muted color palette (sage green, dusty rose)
- Subtle micro-interactions
- Focus on reading comfort

**Color Palette:**
- Primary: Sage Green `#8B9D83`
- Accent: Dusty Rose `#C9ADA7`
- Background: Washi Paper `#FAFAFA`
- Text: Charcoal `#2C2C2C`

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete specifications.

---

## 🛠️ Tech Stack

### Frontend
- **React Native** 0.81.5
- **React** 19.1.0
- **TypeScript** 5.7.3 (strict mode)
- **Expo** SDK 54 (mobile app)
- **React Navigation** 6.x (SDK)

### Storage
- **expo-sqlite** - iOS/Android local storage
- **AsyncStorage** - Web fallback

### UI/UX
- **Expo Router** - File-based routing (mobile app)
- **React Native Reanimated** - Smooth animations
- **Expo Speech** - Text-to-speech narration

### Development
- **npm workspaces** - Monorepo management
- **EAS Build** - App store builds
- **GitHub Actions** - CI/CD pipeline

---

## 🤖 Development Workflow

### Monorepo Commands

```bash
# Install all dependencies
npm install

# Run standalone mobile app
npm run mobile

# Run on specific platforms
npm run mobile:ios
npm run mobile:android
npm run mobile:web

# Lint and type-check
npm run mobile:lint
npm run mobile:typecheck

# Run tests
npm run mobile:test

# Clean all node_modules
npm run clean
```

### SDK Development

```bash
# Build SDK package
cd packages/sdk
npm run build

# Test SDK
npm run test
```

### App Store Builds

```bash
# Production iOS build
cd apps/mobile
eas build --platform ios --profile production

# Production Android build
eas build --platform android --profile production
```

---

## 📱 Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Story Reading | ✅ | ✅ | ✅ |
| Audio Narration | ✅ | ✅ | ⚠️ Limited |
| Progress Tracking | ✅ | ✅ | ✅ |
| Multi-Chapter Books | ✅ | ✅ | ✅ |
| Offline Support | ✅ | ✅ | ✅ |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/core && npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 🚢 Deployment

### Standalone App

Managed through EAS (Expo Application Services):

```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

### SDK Package

Published to npm:

```bash
cd packages/sdk
npm run build
npm publish
```

See [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md) for detailed deployment procedures.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and linting
6. Submit a pull request

---

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [React Native](https://reactnative.dev/)
- Developed with [Claude Code](https://claude.com/claude-code)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/fable-app/fable/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fable-app/fable/discussions)
- **Email**: support@fable-app.com (coming soon)

---

**Built with ❤️ and Claude Code**
