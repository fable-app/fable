# SDK Architecture Execution Plan (Option A: Incremental PR Strategy)

## Overview

This document outlines the execution plan for transforming Fable into a dual-distribution product:
1. **Standalone Mobile App** - Published to iOS App Store and Google Play Store
2. **White-Label SDK** - npm package for B2B partners to integrate into their React Native apps

**Strategy**: Incremental 3-PR approach for safe, reviewable changes with minimal risk.

**Total Estimated Time**: 13-16 hours across 3 PRs

---

## Architecture Goals

### What We're Building

```
fable/
├── packages/
│   ├── core/              # Shared business logic, state, storage
│   ├── sdk/               # White-label SDK for B2B partners
│   └── design-system/     # Shared UI components and tokens
└── apps/
    └── mobile/            # Standalone Expo app for app stores
```

### Key Requirements

1. **Standalone app** continues to work exactly as before
2. **SDK package** can be integrated into bare React Native apps
3. **No breaking changes** to existing functionality
4. **Expo Router** stays in standalone app
5. **React Navigation** used in SDK (bare RN compatibility)
6. **Platform-agnostic** storage (SQLite native, AsyncStorage web)
7. **White-label ready** (customizable theme, no Fable branding in SDK)

---

## PR #1: Foundation - Monorepo + Core Package

**Branch**: `refactor/monorepo-sdk-architecture`
**Estimated Time**: 4-5 hours
**Complexity**: Medium
**Risk Level**: Low (mostly file moves)

### Goals

1. Set up monorepo structure with npm workspaces
2. Move existing app to `apps/mobile`
3. Extract shared core to `packages/core`
4. Update all imports
5. Verify standalone app works identically

### Step-by-Step Execution

#### Phase 1.1: Set Up Monorepo Workspace Structure (30 min)

1. **Create root package.json with workspaces**
   ```json
   {
     "name": "fable-workspace",
     "version": "1.0.0",
     "private": true,
     "workspaces": [
       "apps/*",
       "packages/*"
     ],
     "scripts": {
       "mobile": "cd apps/mobile && npm start",
       "mobile:ios": "cd apps/mobile && npm run ios",
       "mobile:android": "cd apps/mobile && npm run android",
       "mobile:web": "cd apps/mobile && npm run web"
     }
   }
   ```

2. **Create workspace directories**
   ```bash
   mkdir -p apps/mobile
   mkdir -p packages/core
   mkdir -p packages/design-system
   mkdir -p packages/sdk
   ```

3. **Move existing app to apps/mobile**
   ```bash
   mv app apps/mobile/
   mv components apps/mobile/
   mv hooks apps/mobile/
   mv services apps/mobile/
   mv data apps/mobile/
   mv types apps/mobile/
   mv package.json apps/mobile/
   mv tsconfig.json apps/mobile/
   mv app.json apps/mobile/
   ```

4. **Update apps/mobile/package.json**
   - Change name to `@fable/mobile`
   - Keep all existing dependencies
   - Keep Expo-specific config

#### Phase 1.2: Extract Shared Core to packages/core (1.5 hours)

1. **Create packages/core/package.json**
   ```json
   {
     "name": "@fable/core",
     "version": "1.0.0",
     "main": "src/index.ts",
     "types": "src/index.ts",
     "dependencies": {
       "react": "19.1.0",
       "react-native": "0.81.5",
       "@react-native-async-storage/async-storage": "^2.2.0",
       "expo-sqlite": "~16.0.10",
       "zustand": "^5.0.10"
     }
   }
   ```

2. **Move core business logic**
   ```bash
   # From apps/mobile to packages/core/src
   - types/              # All TypeScript types
   - services/           # Storage, story loading, progress tracking
   - data/               # Stories, manifest
   ```

3. **Create packages/core/src/index.ts** (barrel export)
   ```typescript
   // Types
   export * from './types';

   // Services
   export * from './services/story.service';
   export * from './services/progress.service';

   // Data
   export { default as manifest } from './data/manifest.json';
   ```

4. **Keep platform-aware storage**
   - `progress.service.ts` already has `Platform.OS` detection
   - No changes needed for SQLite/AsyncStorage logic

#### Phase 1.3: Extract Design System to packages/design-system (1 hour)

1. **Create packages/design-system/package.json**
   ```json
   {
     "name": "@fable/design-system",
     "version": "1.0.0",
     "main": "src/index.ts",
     "types": "src/index.ts",
     "dependencies": {
       "react": "19.1.0",
       "react-native": "0.81.5"
     }
   }
   ```

2. **Move design tokens and components**
   ```bash
   # Create packages/design-system/src/
   - tokens/             # colors, typography, spacing
   - components/         # Reusable UI components
   ```

3. **Create packages/design-system/src/index.ts**
   ```typescript
   // Tokens
   export { colors } from './tokens/colors';
   export { typography } from './tokens/typography';
   export { spacing } from './tokens/spacing';

   // Components (if any shared ones exist)
   // export { Button } from './components/Button';
   ```

#### Phase 1.4: Update Imports in apps/mobile (1.5 hours)

1. **Update all import paths**
   ```typescript
   // Before:
   import { Story } from '@/types';
   import { loadStory } from '@/services/story.service';
   import { colors } from '@/design-system';

   // After:
   import { Story, loadStory } from '@fable/core';
   import { colors } from '@fable/design-system';
   ```

2. **Update tsconfig.json paths**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@fable/core": ["../../packages/core/src"],
         "@fable/design-system": ["../../packages/design-system/src"]
       }
     }
   }
   ```

3. **Update apps/mobile dependencies**
   ```json
   {
     "dependencies": {
       "@fable/core": "*",
       "@fable/design-system": "*"
     }
   }
   ```

#### Phase 1.5: Testing & Verification (30 min)

1. **Install workspace dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Start dev server**
   ```bash
   npm run mobile
   ```

3. **Test all features**
   - ✅ Story list loads
   - ✅ Story reader opens
   - ✅ Progress tracking works
   - ✅ Resume from last position works
   - ✅ Audio narration works
   - ✅ All 10 stories accessible

4. **Test on all platforms**
   - iOS Simulator
   - Android Emulator
   - Web browser

### PR #1 Success Criteria

- [ ] Monorepo structure set up with workspaces
- [ ] Standalone app moved to `apps/mobile`
- [ ] Core logic extracted to `packages/core`
- [ ] Design system extracted to `packages/design-system`
- [ ] All imports updated and working
- [ ] App functions identically to before refactor
- [ ] All existing tests pass (if any)
- [ ] No console errors or warnings

### PR #1 Commit Message

```
refactor: migrate to monorepo structure with workspace packages

- Set up npm workspaces for monorepo architecture
- Move standalone app to apps/mobile
- Extract shared core logic to packages/core
- Extract design system to packages/design-system
- Update all import paths for workspace packages
- Verify all functionality works identically

This prepares the codebase for SDK distribution while maintaining
the standalone mobile app for app store distribution.

BREAKING CHANGE: Project structure changed to monorepo.
Run `npm install` from root directory.
```

### Rollback Plan

If PR #1 has issues:
1. Revert merge commit
2. Standalone app on `main` branch still works
3. Zero impact on production/users

---

## PR #2: SDK Package Creation

**Branch**: `feature/sdk-package`
**Estimated Time**: 5-6 hours
**Complexity**: High
**Risk Level**: Low (new package, doesn't affect standalone app)

### Goals

1. Create `packages/sdk` with React Navigation routing
2. Implement SDK public API
3. Add TypeScript type definitions
4. Publish to npm (private or public)
5. Create integration example app

### Step-by-Step Execution

#### Phase 2.1: Create SDK Package Structure (1 hour)

1. **Create packages/sdk/package.json**
   ```json
   {
     "name": "@fable/sdk",
     "version": "1.0.0",
     "description": "White-label German learning SDK for React Native apps",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "files": [
       "dist",
       "README.md"
     ],
     "scripts": {
       "build": "tsc",
       "prepublishOnly": "npm run build"
     },
     "peerDependencies": {
       "react": ">=18.0.0",
       "react-native": ">=0.70.0",
       "@react-navigation/native": "^6.0.0",
       "@react-navigation/stack": "^6.0.0"
     },
     "dependencies": {
       "@fable/core": "*",
       "@fable/design-system": "*",
       "react-native-gesture-handler": "~2.28.0",
       "react-native-reanimated": "~4.1.1",
       "react-native-safe-area-context": "~5.6.0",
       "react-native-screens": "~4.16.0",
       "expo-speech": "~13.0.0"
     },
     "publishConfig": {
       "access": "public"
     }
   }
   ```

2. **Create SDK directory structure**
   ```
   packages/sdk/
   ├── src/
   │   ├── index.ts                 # Public API
   │   ├── FableSDK.tsx              # Main SDK component
   │   ├── navigation/
   │   │   ├── Navigator.tsx        # React Navigation stack
   │   │   └── types.ts             # Navigation types
   │   ├── screens/
   │   │   ├── StoryListScreen.tsx  # List of stories
   │   │   └── ReaderScreen.tsx     # Story reader
   │   └── config/
   │       └── theme.ts             # Theming API
   ├── tsconfig.json
   └── README.md
   ```

#### Phase 2.2: Implement React Navigation Screens (2 hours)

1. **Create packages/sdk/src/screens/StoryListScreen.tsx**
   ```typescript
   import { useNavigation } from '@react-navigation/native';
   import { loadAllStories } from '@fable/core';
   import { colors, typography, spacing } from '@fable/design-system';

   export function StoryListScreen() {
     const navigation = useNavigation();
     // Port logic from apps/mobile/app/index.tsx
     // Use React Navigation instead of Expo Router
   }
   ```

2. **Create packages/sdk/src/screens/ReaderScreen.tsx**
   ```typescript
   import { useRoute } from '@react-navigation/native';
   import { loadStory } from '@fable/core';

   export function ReaderScreen() {
     const route = useRoute();
     const { storyId } = route.params;
     // Port logic from apps/mobile/components/BilingualReader.tsx
   }
   ```

3. **Create packages/sdk/src/navigation/Navigator.tsx**
   ```typescript
   import { createStackNavigator } from '@react-navigation/stack';
   import { StoryListScreen } from '../screens/StoryListScreen';
   import { ReaderScreen } from '../screens/ReaderScreen';

   const Stack = createStackNavigator();

   export function FableNavigator() {
     return (
       <Stack.Navigator>
         <Stack.Screen name="StoryList" component={StoryListScreen} />
         <Stack.Screen name="Reader" component={ReaderScreen} />
       </Stack.Navigator>
     );
   }
   ```

#### Phase 2.3: Create SDK Public API (1.5 hours)

1. **Create packages/sdk/src/FableSDK.tsx**
   ```typescript
   import React, { useEffect } from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import { initializeDatabase } from '@fable/core';
   import { FableNavigator } from './navigation/Navigator';
   import type { FableSDKProps, FableTheme } from './types';

   export function FableSDK({
     theme,
     onStoryComplete,
     customStories
   }: FableSDKProps) {
     useEffect(() => {
       initializeDatabase();
     }, []);

     return (
       <NavigationContainer>
         <FableNavigator />
       </NavigationContainer>
     );
   }
   ```

2. **Create packages/sdk/src/index.ts** (Public API)
   ```typescript
   // Main component
   export { FableSDK } from './FableSDK';

   // Types
   export type {
     FableSDKProps,
     FableTheme,
     Story,
     Progress
   } from './types';

   // Re-export useful core functions
   export {
     loadStory,
     loadAllStories,
     getProgress,
     updateProgress
   } from '@fable/core';
   ```

3. **Create packages/sdk/src/types.ts**
   ```typescript
   import type { Story, Progress } from '@fable/core';

   export interface FableSDKProps {
     theme?: FableTheme;
     onStoryComplete?: (storyId: string) => void;
     customStories?: Story[];
   }

   export interface FableTheme {
     colors?: {
       primary?: string;
       secondary?: string;
       background?: string;
       text?: string;
     };
     fonts?: {
       regular?: string;
       medium?: string;
       semibold?: string;
     };
   }

   export type { Story, Progress };
   ```

#### Phase 2.4: Build & Test SDK (1 hour)

1. **Configure TypeScript**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "declaration": true,
       "outDir": "./dist",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "jsx": "react-native"
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

2. **Build the package**
   ```bash
   cd packages/sdk
   npm run build
   ```

3. **Verify build output**
   ```
   packages/sdk/dist/
   ├── index.js
   ├── index.d.ts
   ├── FableSDK.js
   ├── FableSDK.d.ts
   └── ...
   ```

#### Phase 2.5: Create Integration Example (30 min)

1. **Create examples/bare-react-native/App.tsx**
   ```typescript
   import React from 'react';
   import { FableSDK } from '@fable/sdk';

   export default function App() {
     return (
       <FableSDK
         theme={{
           colors: {
             primary: '#8B9D83',
           }
         }}
         onStoryComplete={(storyId) => {
           console.log('Story completed:', storyId);
         }}
       />
     );
   }
   ```

2. **Create examples/bare-react-native/README.md**
   ```markdown
   # Fable SDK Integration Example

   ## Installation

   npm install @fable/sdk

   ## Usage

   See App.tsx for basic integration example.
   ```

#### Phase 2.6: Write SDK Documentation (30 min)

1. **Create packages/sdk/README.md**
   - Installation instructions
   - Basic usage example
   - API reference
   - Theming guide
   - Integration checklist

### PR #2 Success Criteria

- [ ] SDK package created with React Navigation
- [ ] All screens ported from Expo Router to React Navigation
- [ ] Public API defined with TypeScript types
- [ ] SDK builds successfully (`npm run build`)
- [ ] Integration example works
- [ ] README with usage instructions
- [ ] Standalone app still works (no regressions)

### PR #2 Commit Message

```
feat: create white-label SDK package for B2B integration

- Create @fable/sdk package with React Navigation
- Port StoryList and Reader screens from Expo Router
- Define public API with theme customization
- Add TypeScript type definitions
- Create bare React Native integration example
- Document SDK installation and usage

Partners can now integrate Fable as a white-label feature
in their React Native apps via npm package.
```

### Rollback Plan

If PR #2 has issues:
1. Revert merge commit
2. SDK is a new package - no impact on standalone app
3. Don't publish to npm until thoroughly tested

---

## PR #3: Polish & Production Ready

**Branch**: `feature/sdk-polish`
**Estimated Time**: 4-5 hours
**Complexity**: Medium
**Risk Level**: Low

### Goals

1. Add white-label customization features
2. Implement custom story loading
3. Add analytics hooks
4. Create comprehensive documentation
5. Set up CI/CD for npm publishing
6. Prepare app store distribution

### Step-by-Step Execution

#### Phase 3.1: White-Label Customization (2 hours)

1. **Extend theme API in packages/sdk/src/config/theme.ts**
   ```typescript
   export interface FableTheme {
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
       logo?: ImageSource;
       hideDefaultBranding?: boolean;
     };
   }

   export function createTheme(customTheme?: Partial<FableTheme>): FableTheme {
     // Merge with defaults
   }
   ```

2. **Add custom story loading**
   ```typescript
   export interface FableSDKProps {
     theme?: FableTheme;
     customStories?: Story[];
     useDefaultStories?: boolean;
     onStoryComplete?: (storyId: string, progress: Progress) => void;
     onStoryStart?: (storyId: string) => void;
     analyticsProvider?: AnalyticsProvider;
   }
   ```

3. **Implement analytics hooks**
   ```typescript
   export interface AnalyticsProvider {
     trackEvent: (event: string, properties?: Record<string, any>) => void;
     trackScreenView: (screenName: string) => void;
   }

   // In screens, call:
   analyticsProvider?.trackEvent('story_opened', { storyId });
   analyticsProvider?.trackEvent('audio_played', { storyId, sentenceIndex });
   ```

#### Phase 3.2: Documentation (1.5 hours)

1. **Create comprehensive SDK docs**
   - `packages/sdk/docs/INTEGRATION_GUIDE.md`
   - `packages/sdk/docs/API_REFERENCE.md`
   - `packages/sdk/docs/THEMING_GUIDE.md`
   - `packages/sdk/docs/CUSTOM_STORIES.md`
   - `packages/sdk/docs/ANALYTICS.md`

2. **Create root-level ARCHITECTURE.md**
   ```markdown
   # Fable Architecture

   ## Overview
   Fable is a dual-distribution German learning platform.

   ## Packages
   - `@fable/core` - Business logic, storage, data
   - `@fable/design-system` - UI tokens and components
   - `@fable/sdk` - White-label SDK for partners

   ## Apps
   - `apps/mobile` - Standalone Expo app for app stores

   ## Distribution Paths
   1. **App Stores**: iOS App Store + Google Play (via apps/mobile)
   2. **npm**: @fable/sdk package for B2B integration
   ```

3. **Update root README.md**
   ```markdown
   # Fable

   German learning through bilingual storytelling.

   ## For End Users
   Download the standalone app:
   - [iOS App Store](#) (coming soon)
   - [Google Play](#) (coming soon)

   ## For Developers
   Integrate Fable into your React Native app:

   npm install @fable/sdk

   See [SDK Documentation](packages/sdk/README.md)
   ```

#### Phase 3.3: Distribution Setup (1 hour)

1. **Set up npm publishing**
   ```json
   // packages/sdk/package.json
   {
     "publishConfig": {
       "access": "public",
       "registry": "https://registry.npmjs.org/"
     }
   }
   ```

2. **Create .npmignore for SDK**
   ```
   src/
   tsconfig.json
   *.test.ts
   *.test.tsx
   ```

3. **Publish SDK to npm**
   ```bash
   cd packages/sdk
   npm login
   npm publish
   ```

4. **Prepare app store builds**
   ```bash
   cd apps/mobile
   eas build --platform ios --profile production
   eas build --platform android --profile production
   ```

#### Phase 3.4: Testing & Quality Assurance (30 min)

1. **SDK integration test**
   - Create fresh bare React Native app
   - Install `@fable/sdk` from npm
   - Verify all features work

2. **Standalone app test**
   - Test on real iOS device
   - Test on real Android device
   - Verify all features work

3. **Performance testing**
   - Check bundle size: `npm run analyze`
   - Verify no memory leaks
   - Test with 100+ stories

### PR #3 Success Criteria

- [ ] White-label customization API complete
- [ ] Custom story loading works
- [ ] Analytics hooks implemented
- [ ] Comprehensive documentation written
- [ ] SDK published to npm
- [ ] Standalone app builds for app stores
- [ ] All integration tests pass
- [ ] Performance benchmarks met

### PR #3 Commit Message

```
feat: add white-label customization and production distribution

- Add comprehensive theme customization API
- Implement custom story loading for SDK
- Add analytics hooks for partner integration
- Create complete SDK documentation
- Set up npm publishing for @fable/sdk
- Prepare standalone app for app store submission
- Add integration examples and guides

Fable is now production-ready for dual distribution:
standalone app stores and white-label SDK.
```

### Rollback Plan

If PR #3 has issues:
1. Revert merge commit
2. Unpublish from npm if necessary: `npm unpublish @fable/sdk@1.0.0`
3. Standalone app unaffected

---

## Testing Strategy

### Unit Tests

```typescript
// packages/core/__tests__/progress.service.test.ts
describe('Progress Service', () => {
  it('should save and load progress', async () => {
    // Test AsyncStorage and SQLite
  });
});

// packages/sdk/__tests__/FableSDK.test.tsx
describe('FableSDK', () => {
  it('should render with custom theme', () => {
    // Test theme application
  });
});
```

### Integration Tests

```typescript
// apps/mobile/__tests__/integration/story-reading.test.ts
describe('Story Reading Flow', () => {
  it('should complete full reading flow with progress', async () => {
    // Test end-to-end flow
  });
});
```

### Manual Testing Checklist

After each PR:

- [ ] Story list loads correctly
- [ ] Story reader opens and displays content
- [ ] Progress tracking saves and restores
- [ ] Resume from last position works
- [ ] Audio narration plays correctly
- [ ] Sentence highlighting works during audio
- [ ] All 10 stories accessible
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Works on Web (standalone app only)

---

## Risk Mitigation

### Identified Risks

1. **Import path confusion**
   - Mitigation: Use TypeScript path mapping, test thoroughly

2. **Expo dependencies in SDK**
   - Mitigation: Keep Expo-specific deps in peerDependencies, document requirements

3. **SQLite on web**
   - Mitigation: Already using Platform.OS detection with AsyncStorage fallback

4. **React Navigation vs Expo Router differences**
   - Mitigation: Test navigation patterns extensively in SDK

5. **Bundle size**
   - Mitigation: Use tree-shaking, lazy loading for stories

### Rollback Procedures

Each PR can be independently reverted:
```bash
git revert <merge-commit-sha>
git push origin main
```

The standalone app on `main` branch always remains functional.

---

## Success Metrics

### Technical Metrics

- [ ] All tests pass (unit + integration)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Bundle size < 5MB for SDK
- [ ] App store builds succeed

### Business Metrics

- [ ] SDK can be installed via npm
- [ ] Partner can integrate in < 30 minutes
- [ ] Standalone app submitted to app stores
- [ ] Documentation complete and clear

---

## Timeline

| Week | PR | Tasks | Hours |
|------|------|-------|-------|
| Week 1 | PR #1 | Monorepo setup + core extraction | 4-5h |
| Week 2 | PR #2 | SDK package creation | 5-6h |
| Week 3 | PR #3 | Polish + distribution | 4-5h |

**Total**: 13-16 hours over 3 weeks (assuming part-time work)

---

## Post-Launch Tasks

After all 3 PRs are merged:

1. **Marketing**
   - Publish blog post about dual distribution
   - Share SDK on React Native communities
   - Create demo video

2. **Partner Outreach**
   - Contact friend's app team for integration
   - Create onboarding call template
   - Set up support channels

3. **App Store Submission**
   - Create app store listings
   - Take screenshots
   - Write descriptions
   - Submit for review

4. **Monitoring**
   - Set up analytics for standalone app
   - Track SDK npm downloads
   - Monitor error reporting (Sentry/Bugsnag)

---

## Questions & Support

If issues arise during execution:

1. **Check documentation**: All packages have READMEs
2. **Review this plan**: Step-by-step instructions above
3. **Test incrementally**: Don't move to next phase until current works
4. **Ask for help**: Document blockers and questions

---

## Appendix: Key File Locations

### After PR #1
```
fable/
├── apps/mobile/            # Standalone app
├── packages/core/          # Business logic
├── packages/design-system/ # UI tokens
└── package.json            # Workspace root
```

### After PR #2
```
fable/
├── packages/sdk/           # White-label SDK
│   ├── src/
│   │   ├── index.ts        # Public API
│   │   └── FableSDK.tsx
│   └── dist/               # Built package
└── examples/               # Integration examples
```

### After PR #3
```
fable/
├── docs/                   # Architecture docs
├── packages/sdk/docs/      # SDK documentation
└── ARCHITECTURE.md         # System overview
```

---

**Last Updated**: 2026-01-14
**Status**: Ready for execution
**Next Action**: Merge pending PRs to main, then start PR #1
