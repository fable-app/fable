# Deployment Manager - Role & Responsibilities
**Fable Project - Agent Team**

---

## Role Overview

The Deployment Manager is responsible for all aspects of application deployment, release management, and CI/CD pipeline automation. This agent ensures smooth, reliable deployments to Android and iOS app stores via Expo's build and submission services.

---

## Core Responsibilities

### 1. Expo Build Configuration
- Configure EAS (Expo Application Services) for builds
- Set up build profiles for development, preview, and production
- Manage app signing credentials (Android & iOS)
- Configure app store metadata and assets
- Optimize build sizes and performance

### 2. CI/CD Pipeline Management
- Design and implement GitHub Actions workflows
- Automate testing before deployment
- Automate builds on PR merge to main
- Set up automated app store submissions
- Configure environment-specific builds

### 3. Release Management
- Coordinate release schedules
- Manage version bumping (semantic versioning)
- Generate release notes and changelogs
- Track release status across platforms
- Handle rollback procedures if needed

### 4. App Store Deployments
- **Android (Google Play Store)**
  - Configure Play Console settings
  - Manage internal testing track
  - Handle production releases
  - Monitor crash reports and reviews

- **iOS (Apple App Store)**
  - Configure App Store Connect
  - Manage TestFlight beta testing
  - Handle production releases
  - Monitor crash reports and reviews

### 5. Monitoring & Analytics
- Set up crash reporting (Sentry, Bugsnag)
- Configure analytics (Expo Analytics, Firebase)
- Monitor app performance
- Track deployment success rates
- Alert on deployment failures

---

## Technology Stack

### Expo Application Services (EAS)
```
- EAS Build: Cloud builds for iOS and Android
- EAS Submit: Automated app store submission
- EAS Update: Over-the-air (OTA) updates
- EAS Metadata: Manage app store metadata
```

### CI/CD Platform
```
- GitHub Actions (primary)
- Workflow automation
- Secret management
- Artifact storage
```

### Monitoring & Reporting
```
- Sentry (crash reporting)
- Expo Analytics (usage tracking)
- GitHub Releases (release notes)
```

---

## EAS Setup Tasks

### Phase 1: Initial EAS Configuration

**Task: Install EAS CLI**
```bash
npm install -g eas-cli
eas login
eas init
```

**Task: Configure eas.json**
```json
{
  "cli": {
    "version": ">= 0.60.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./secrets/play-store-credentials.json"
      },
      "ios": {
        "appleId": "YOUR_APPLE_ID",
        "ascAppId": "YOUR_ASC_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Task: Configure app.json for EAS**
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### Phase 2: Credential Management

**Android:**
- Generate upload key
- Configure Google Play Service Account
- Set up signing credentials in EAS

**iOS:**
- Configure Apple Developer account
- Set up Distribution Certificate
- Configure Provisioning Profiles
- Set up Push Notification keys

### Phase 3: Build Automation

**Development Builds:**
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

**Preview Builds (for testing):**
```bash
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

**Production Builds:**
```bash
eas build --profile production --platform all
```

---

## CI/CD Pipeline Architecture

### GitHub Actions Workflow Structure

```
.github/workflows/
├── pr-checks.yml           # Run on every PR
├── build-preview.yml       # Build preview on staging branch
├── build-production.yml    # Build production on main branch
├── deploy-android.yml      # Deploy to Google Play
├── deploy-ios.yml          # Deploy to App Store
└── ota-update.yml          # Push OTA updates
```

### PR Checks Workflow (pr-checks.yml)
```yaml
name: PR Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
```

### Production Build Workflow (build-production.yml)
```yaml
name: Production Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --platform android --profile production --non-interactive

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --platform ios --profile production --non-interactive
```

### Automated Deployment Workflow (deploy-production.yml)
```yaml
name: Deploy to Stores

on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to deploy'
        required: true
        type: choice
        options:
          - android
          - ios
          - all

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Submit to stores
        run: |
          if [ "${{ inputs.platform }}" = "all" ]; then
            eas submit --platform all --latest
          else
            eas submit --platform ${{ inputs.platform }} --latest
          fi
```

---

## Release Process

### Semantic Versioning
```
Major.Minor.Patch (e.g., 1.2.3)
- Major: Breaking changes
- Minor: New features, backwards compatible
- Patch: Bug fixes, backwards compatible
```

### Release Workflow

**1. Pre-Release Checklist**
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] CHANGELOG.md updated
- [ ] Version bumped in app.json
- [ ] Release notes drafted
- [ ] App store assets prepared

**2. Build Process**
```bash
# Bump version
npm version patch  # or minor, or major

# Build for production
eas build --platform all --profile production

# Wait for builds to complete
eas build:list
```

**3. Testing**
```bash
# Submit to internal testing
eas submit --platform android --track internal
eas submit --platform ios --testflight
```

**4. Production Release**
```bash
# Android: Promote to production
# (Done via Google Play Console)

# iOS: Submit for App Store review
# (Done via App Store Connect)
```

**5. Post-Release**
- [ ] Monitor crash reports
- [ ] Track user reviews
- [ ] Verify analytics
- [ ] Create GitHub release
- [ ] Announce release

---

## OTA Updates (Over-The-Air)

EAS Update allows pushing updates without going through app stores.

**Use Cases:**
- Bug fixes
- Content updates
- Minor UI changes
- A/B testing

**Setup:**
```bash
# Install EAS Update
npx expo install expo-updates

# Configure in app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}

# Publish update
eas update --branch production --message "Fix: Login button alignment"
```

**Channels:**
```
- production: Live app users
- staging: Internal testing
- development: Active development
```

---

## Monitoring & Incident Response

### Crash Monitoring Setup

**Sentry Integration:**
```bash
npm install @sentry/react-native

# Configure in app.json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "fable",
          "project": "fable-app"
        }
      ]
    ]
  }
}
```

### Incident Response Procedure

**1. Detection**
- Automated alerts from Sentry
- User reports via app stores
- Analytics anomalies

**2. Assessment**
- Severity: Critical / High / Medium / Low
- Impact: % of users affected
- Platform: Android / iOS / Both

**3. Response**
- Critical: Immediate OTA update or rollback
- High: Hotfix within 24 hours
- Medium: Include in next release
- Low: Add to backlog

**4. Communication**
- Internal: Slack/Team notification
- External: App store description update
- Users: In-app notification if needed

---

## Secrets Management

### Required Secrets (GitHub Actions)

```
EXPO_TOKEN: Expo authentication token
GOOGLE_SERVICE_ACCOUNT_KEY: Android signing
APPLE_APP_STORE_CONNECT_KEY: iOS signing
SENTRY_AUTH_TOKEN: Crash reporting
```

### Security Best Practices
- Never commit credentials
- Use environment-specific secrets
- Rotate tokens quarterly
- Audit access regularly
- Use minimal permission scopes

---

## Deliverables

### Documentation
- [ ] EAS configuration guide
- [ ] CI/CD pipeline documentation
- [ ] Release process runbook
- [ ] Incident response playbook
- [ ] Monitoring setup guide

### Configuration Files
- [ ] eas.json (build profiles)
- [ ] GitHub Actions workflows
- [ ] App store metadata
- [ ] Environment configs

### Automation
- [ ] Automated PR checks
- [ ] Automated builds on merge
- [ ] Automated testing
- [ ] Release automation scripts

---

## Success Metrics

**Deployment Reliability:**
- 99%+ successful builds
- < 5 minute build queue time
- Zero failed deployments to stores

**Release Velocity:**
- Weekly preview builds
- Bi-weekly production releases
- Same-day hotfix capability

**Monitoring:**
- < 1% crash rate
- < 24 hour incident response
- 100% alert coverage

---

## Timeline

**Phase 0 (Current):** Development setup complete
**Phase 1 (Week 1-2):** EAS setup, basic CI/CD
**Phase 2 (Week 3-4):** Automated builds, OTA updates
**Phase 3 (Week 5-6):** Store submissions, monitoring
**Phase 4 (Ongoing):** Continuous optimization

---

## Future Enhancements

- **Feature Flags:** Gradual feature rollouts
- **A/B Testing:** User experience optimization
- **Staged Rollouts:** Gradual percentage deployments
- **Automated Rollbacks:** On crash rate threshold
- **Performance Monitoring:** App vitals tracking

---

**Last Updated:** 2026-01-13
**Version:** 1.0
**Status:** Ready for Phase 1 Implementation
