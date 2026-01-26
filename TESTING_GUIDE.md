# Fable Testing Guide

Comprehensive testing steps for the monorepo migration and SDK implementation.

## Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [Test 1: Workspace Installation](#test-1-workspace-installation)
3. [Test 2: TypeScript Compilation](#test-2-typescript-compilation)
4. [Test 3: Standalone Mobile App](#test-3-standalone-mobile-app)
5. [Test 4: SDK Build](#test-4-sdk-build)
6. [Test 5: SDK Integration Test](#test-5-sdk-integration-test)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Testing Setup

### Clean Start

```bash
# Navigate to project root
cd /Users/Anbu/Desktop/repo/fable

# Clean all node_modules
npm run clean

# Verify clean state
ls -la | grep node_modules  # Should return nothing
```

---

## Test 1: Workspace Installation

**Purpose**: Verify npm workspaces are set up correctly

### Steps:

```bash
# Install all dependencies from root
npm install

# Verify workspace packages are linked
npm ls @fable/core
npm ls @fable/design-system
npm ls @fable/sdk

# Check package directories exist
ls -la packages/core/node_modules
ls -la packages/design-system/node_modules
ls -la packages/sdk/node_modules
ls -la apps/mobile/node_modules
```

### Expected Results:

- ✅ All packages install without errors
- ✅ Workspace packages show as linked (not from registry)
- ✅ Each package has its own node_modules with dependencies
- ✅ No peer dependency warnings

### If Failed:

```bash
# Clear npm cache
npm cache clean --force

# Remove all node_modules
npm run clean

# Reinstall
npm install
```

---

## Test 2: TypeScript Compilation

**Purpose**: Verify all TypeScript code compiles without errors

### Test 2.1: Core Package

```bash
cd packages/core
npx tsc --noEmit
```

**Expected**: No TypeScript errors

### Test 2.2: Design System Package

```bash
cd packages/design-system
npx tsc --noEmit
```

**Expected**: No TypeScript errors

### Test 2.3: SDK Package

```bash
cd packages/sdk
npx tsc --noEmit
```

**Expected**:
- No errors (peer dependencies warnings are OK)
- Or only missing `@react-navigation/*` errors (expected with peer deps)

### Test 2.4: Mobile App

```bash
cd apps/mobile
npm run typecheck
```

**Expected**: No TypeScript errors

### If Failed:

Check error messages for:
- Import path issues (should use `@fable/core`, `@fable/design-system`)
- Missing exports from core/design-system
- Type mismatches

---

## Test 3: Standalone Mobile App

**Purpose**: Verify the standalone app works after monorepo migration

### Test 3.1: Start Development Server

```bash
# From root
npm run mobile

# Or from apps/mobile
cd apps/mobile
npm start
```

**Expected**:
- ✅ Metro bundler starts without errors
- ✅ QR code appears for Expo Go
- ✅ No TypeScript errors in terminal

### Test 3.2: Test on Web

```bash
# Press 'w' in Metro bundler, or:
npm run mobile:web
```

**Manual Testing Checklist**:

#### Story List Screen
- [ ] Story list loads and displays all stories
- [ ] Story cards show titles (German & English)
- [ ] Progress bars display correctly
- [ ] Multi-chapter badge appears on books
- [ ] Entrance animations work smoothly
- [ ] Can scroll through story list

#### Story Reader
- [ ] Clicking a story opens the reader
- [ ] Bilingual text displays correctly
- [ ] German text is larger/bolder
- [ ] English text is secondary style
- [ ] Can scroll through sentences
- [ ] Back button returns to list

#### Audio Narration
- [ ] Play button appears
- [ ] Clicking play starts audio
- [ ] Current sentence highlights during playback
- [ ] Auto-scrolls to current sentence
- [ ] Can pause audio
- [ ] Next/Previous buttons work (when playing)
- [ ] Audio stops on unmount

#### Settings
- [ ] Settings icon opens panel
- [ ] Can adjust reading speed (0.5 - 1.5x)
- [ ] Can toggle German first/English first
- [ ] Settings panel closes

#### Progress Tracking
- [ ] Scrolling saves progress (check after ~5 seconds)
- [ ] Refresh app - should resume at last position
- [ ] Progress bar updates on story list
- [ ] 100% completion shows checkmark

#### Multi-Chapter Books
- [ ] Clicking Alice in Wonderland shows chapter list
- [ ] Chapter list displays all chapters
- [ ] Each chapter shows progress
- [ ] Clicking chapter opens reader
- [ ] Previous/Next chapter navigation works

### Test 3.3: Test on iOS Simulator (if available)

```bash
npm run mobile:ios
```

**Additional iOS Tests**:
- [ ] Audio works (German TTS)
- [ ] Progress saves to SQLite
- [ ] No console errors

### Test 3.4: Test on Android Emulator (if available)

```bash
npm run mobile:android
```

**Additional Android Tests**:
- [ ] Audio works (German TTS)
- [ ] Progress saves to SQLite
- [ ] No console errors

---

## Test 4: SDK Build

**Purpose**: Verify SDK builds correctly for distribution

### Test 4.1: Build SDK

```bash
cd packages/sdk
npm run build
```

**Expected**:
- ✅ TypeScript compiles successfully
- ✅ `dist/` folder created
- ✅ Contains `.js` and `.d.ts` files

### Test 4.2: Verify Build Output

```bash
ls -la dist/

# Should see:
# - index.js
# - index.d.ts
# - FableSDK.js
# - FableSDK.d.ts
# - screens/*.js
# - screens/*.d.ts
# - components/*.js
# - etc.
```

**Check key files**:

```bash
# Verify main exports
cat dist/index.js | head -20

# Verify type definitions
cat dist/index.d.ts | head -20
```

### Test 4.3: Test Clean Build

```bash
npm run clean
npm run build
```

**Expected**: Builds successfully from scratch

---

## Test 5: SDK Integration Test

**Purpose**: Test SDK as if integrating into a partner app

### Option A: Create Test App with Expo

```bash
# From fable root directory
cd ..
npx create-expo-app fable-sdk-test --template blank-typescript
cd fable-sdk-test
```

### Install Dependencies

```bash
# Install peer dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-safe-area-context react-native-screens
npm install expo-speech

# Link to local SDK (instead of npm install)
npm install ../fable/packages/sdk
```

### Create Test Implementation

Create `App.tsx`:

```typescript
import React from 'react';
import { FableSDK } from '@fable/sdk';

export default function App() {
  return (
    <FableSDK
      theme={{
        colors: {
          primary: '#FF6B6B',
          accent: '#4ECDC4',
        },
        branding: {
          appName: 'Test App',
          hideDefaultBranding: true,
        },
      }}
      onStoryStart={(storyId) => {
        console.log('Story started:', storyId);
      }}
      onStoryComplete={(storyId, progress) => {
        console.log('Story completed:', storyId, progress);
      }}
      analyticsProvider={{
        trackEvent: (event, properties) => {
          console.log('Event:', event, properties);
        },
        trackScreenView: (screen) => {
          console.log('Screen view:', screen);
        },
      }}
    />
  );
}
```

### Run Test App

```bash
npx expo start
```

### Test SDK Features

- [ ] App starts without errors
- [ ] Custom theme is applied (red/teal colors)
- [ ] Story list shows stories
- [ ] Can read stories
- [ ] Audio works
- [ ] Analytics logs appear in console
- [ ] Callbacks fire correctly

### Option B: Test in Existing React Native App

If you have an existing RN app:

```bash
cd /path/to/your/app
npm install /Users/Anbu/Desktop/repo/fable/packages/sdk
```

Then add `<FableSDK />` to your app.

---

## Test 6: Verify Exports

**Purpose**: Ensure all public APIs are exported correctly

```bash
cd packages/sdk
node -e "console.log(require('./dist/index.js'))"
```

**Expected exports**:
- `FableSDK`
- `loadStory`
- `getAllStoryMetadata`
- `getProgress`
- `saveProgress`
- etc.

---

## Test 7: Package Publishing Dry Run

**Purpose**: Test npm publishing without actually publishing

```bash
cd packages/sdk

# Dry run (won't actually publish)
npm publish --dry-run
```

**Check output**:
- [ ] Package size is reasonable (<5MB)
- [ ] Only includes `dist/` and `README.md`
- [ ] Doesn't include `src/`, `node_modules/`, etc.
- [ ] No warnings about missing fields

---

## Test 8: Integration Tests (Automated)

### Create Test File

Create `packages/sdk/__tests__/FableSDK.test.tsx`:

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { FableSDK } from '../src/FableSDK';

describe('FableSDK', () => {
  it('renders without crashing', () => {
    const { container } = render(<FableSDK />);
    expect(container).toBeTruthy();
  });

  it('accepts theme prop', () => {
    const theme = {
      colors: { primary: '#FF0000' },
    };
    const { container } = render(<FableSDK theme={theme} />);
    expect(container).toBeTruthy();
  });

  it('accepts analytics provider', () => {
    const analytics = {
      trackEvent: jest.fn(),
      trackScreenView: jest.fn(),
    };
    const { container } = render(<FableSDK analyticsProvider={analytics} />);
    expect(container).toBeTruthy();
  });
});
```

### Run Tests

```bash
npm test
```

---

## Troubleshooting

### Issue: "Cannot find module '@fable/core'"

**Solution**:
```bash
# From root
npm install
# Verify workspace linking
npm ls @fable/core
```

### Issue: TypeScript errors about missing types

**Solution**:
```bash
# Install peer dependencies in SDK
cd packages/sdk
npm install --save-dev @react-navigation/native @react-navigation/stack
```

### Issue: Metro bundler can't resolve workspace packages

**Solution**:
```bash
# Clear Metro cache
npx expo start --clear
```

### Issue: Audio doesn't work on web

**Expected behavior**: Web has limited TTS support. This is documented.

### Issue: Progress not saving

**Check**:
```bash
# Ensure AsyncStorage is installed
npm ls @react-native-async-storage/async-storage
```

---

## Success Criteria

All tests must pass before:
- ✅ Publishing SDK to npm
- ✅ Submitting app to app stores
- ✅ Merging PR to main branch

### Checklist

**TypeScript**:
- [ ] All packages compile without errors
- [ ] Type definitions are generated

**Standalone App**:
- [ ] App runs on web
- [ ] Story list works
- [ ] Reader works
- [ ] Audio works
- [ ] Progress tracking works
- [ ] Multi-chapter books work

**SDK**:
- [ ] Builds successfully
- [ ] Exports all public APIs
- [ ] Integration test works
- [ ] Theme customization works
- [ ] Analytics integration works

**Documentation**:
- [ ] README is clear
- [ ] API docs are complete
- [ ] Integration guide is accurate

---

## Next Steps After Testing

1. **Fix any issues** found during testing
2. **Update documentation** based on findings
3. **Create PR** to merge `feat/sdk` → `main`
4. **Publish SDK** to npm (after PR approval)
5. **Submit app** to app stores (when ready)
