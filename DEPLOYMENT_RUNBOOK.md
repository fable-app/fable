# Deployment Runbook
**Fable Language Learning App - Operational Playbooks**

---

## Purpose

This runbook provides step-by-step playbooks for common deployment scenarios and troubleshooting guides for the Fable project. Use this as your operational guide for day-to-day DevOps tasks.

**Last Updated**: 2026-01-25
**Version**: 1.0
**Owner**: Deployment Manager Agent

---

## Table of Contents

### Playbooks
1. [Regular Release Deployment](#playbook-1-regular-release-deployment)
2. [Hotfix Deployment](#playbook-2-hotfix-deployment)
3. [Preview Build for QA](#playbook-3-preview-build-for-qa)
4. [First-Time Setup](#playbook-4-first-time-setup)
5. [OTA Update Deployment](#playbook-5-ota-update-deployment-phase-2)
6. [Emergency Rollback](#playbook-6-emergency-rollback)

### Troubleshooting
7. [Build Failures](#troubleshooting-build-failures)
8. [CI/CD Pipeline Issues](#troubleshooting-cicd-pipeline-issues)
9. [Store Submission Errors](#troubleshooting-store-submission-errors)
10. [Authentication Issues](#troubleshooting-authentication-issues)

---

## Playbook 1: Regular Release Deployment

**Use Case**: Deploying a new minor or major version to production
**Duration**: ~2-3 hours (spread over 3-4 days)
**Frequency**: Bi-weekly

### Prerequisites
- [ ] All features merged to `develop` branch
- [ ] All tests passing on `develop`
- [ ] Preview build tested by QA
- [ ] Release notes drafted
- [ ] No critical bugs reported

### Steps

#### Day 1: Code Freeze & Preview Build (Friday)

**1. Announce Code Freeze**
```
Post in team chat:
"🎯 Code freeze for v1.2.0 release. No new features to develop. Bug fixes only."
```

**2. Verify Develop Branch Status**
```bash
# Check latest commit
git checkout develop
git pull origin develop
git log -n 5 --oneline

# Verify CI status
gh run list --branch develop --limit 5
```

**3. Preview Build Testing**
```bash
# Preview build should already be available from last push to develop
# Check build status
eas build:list --limit 5 --status finished --profile preview

# Download build for testing
# Android: Get shareable link from EAS
# iOS: Install via TestFlight or download IPA
```

**4. QA Testing**
- Distribute preview build to QA team
- Test on multiple devices (iOS and Android)
- Verify all new features working
- Check for regressions in existing features

#### Day 2-3: Version Bump & PR Creation (Monday)

**1. Pull Latest Develop**
```bash
git checkout develop
git pull origin develop
```

**2. Bump Version**
```bash
# For minor release (new features)
npm version minor

# For major release (breaking changes)
npm version major

# This creates a version commit and tag locally
```

**3. Push Version Tag**
```bash
# Push the version commit and tag
git push origin develop
git push origin --tags
```

**4. Create Release PR**
```bash
# Create PR from develop to main
gh pr create \
  --base main \
  --head develop \
  --title "Release v1.2.0" \
  --body "$(cat << EOF
# Release v1.2.0

## ✨ New Features
- Feature 1 description
- Feature 2 description

## 🐛 Bug Fixes
- Bug fix 1
- Bug fix 2

## 🎨 Improvements
- Improvement 1
- Improvement 2

## Testing
- [x] Preview build tested on Android
- [x] Preview build tested on iOS
- [x] All automated tests passing
- [x] QA sign-off received

## Checklist
- [x] Version bumped to 1.2.0
- [x] CHANGELOG.md updated
- [x] Release notes ready
- [ ] Code review approved
- [ ] Ready to merge
EOF
)"
```

**5. Request Review**
```bash
# Request review from tech lead
gh pr edit --add-reviewer @tech-lead-username
```

#### Day 3: Merge & Build (Tuesday)

**1. Wait for Approval**
- Ensure all PR checks passed
- Get approval from reviewer
- Resolve any conversations

**2. Merge to Main**
```bash
# Merge the PR (or click "Merge" button on GitHub)
gh pr merge --squash  # or --merge or --rebase depending on your strategy
```

**3. Monitor Production Build**
```bash
# Watch GitHub Actions workflow
gh run watch

# Or check in GitHub UI
open "https://github.com/[org]/[repo]/actions"

# Monitor EAS build
eas build:list --limit 5
```

**4. Verify Build Success**
```bash
# Check both platforms completed
eas build:view [ANDROID_BUILD_ID]
eas build:view [IOS_BUILD_ID]

# Expected status: finished
# Expected result: Build successful
```

#### Day 4: Download & Test (Wednesday)

**1. Download Production Builds**
```bash
# Get download URLs
eas build:list --limit 5 --profile production

# Download using provided URLs or:
# Android: Download from EAS dashboard
# iOS: Download from EAS dashboard or TestFlight
```

**2. Internal Testing**
- Install on physical devices (not simulators)
- Test on Android (latest 2-3 OS versions)
- Test on iOS (latest 2-3 OS versions)
- Verify critical paths work
- Check app doesn't crash on launch

**3. Final Go/No-Go Decision**
```
✅ GO if:
- No crashes detected
- Core features working
- No data loss
- Performance acceptable

🛑 NO-GO if:
- Crashes on launch
- Critical features broken
- Data corruption
- Major performance issues
```

#### Day 5: Store Submission (Thursday)

**Phase 1: Manual Submission**

**Android (Google Play Console)**:
1. Go to https://play.google.com/console
2. Select Fable app
3. Release → Testing → Internal testing
4. Create new release
5. Upload AAB from EAS download
6. Add release notes
7. Save and review
8. Promote to internal testing track

**iOS (App Store Connect)**:
1. Go to https://appstoreconnect.apple.com
2. Select Fable app
3. TestFlight → iOS builds
4. Upload IPA from EAS (or wait for automatic processing)
5. Add "What to Test" notes
6. Save
7. Add external testers (or keep internal for now)

**Phase 2: Automated Submission** (Future):
```bash
# When credentials configured
eas submit --platform android --profile production
eas submit --platform ios --profile production
```

**4. Monitor Submission**
- Android: Usually approved within 1-2 hours
- iOS: TestFlight available immediately, App Store review 1-2 days

#### Post-Release: Monitoring (Ongoing)

**1. Monitor for Issues**
```bash
# Check GitHub issues
gh issue list --label "bug" --label "production"

# Check app store reviews (manual)
# Android: Play Console → Reviews
# iOS: App Store Connect → Ratings and Reviews
```

**2. Track Metrics** (When monitoring tools configured)
- Crash rate (target: <1%)
- App load time
- User retention
- Feature adoption

**3. Create GitHub Release**
```bash
# Create release on GitHub
gh release create v1.2.0 \
  --title "Fable v1.2.0" \
  --notes "Release notes here"
```

**4. Announce Release**
```
Post in team chat:
"🚀 Fable v1.2.0 released!
- Android: Submitted to Play Store internal track
- iOS: Available in TestFlight
- Production rollout: [Date]"
```

### Success Criteria
- [x] Both platforms built successfully
- [x] No critical bugs in production build
- [x] Submitted to stores
- [x] Team notified
- [x] GitHub release created

---

## Playbook 2: Hotfix Deployment

**Use Case**: Critical production bug requiring immediate fix
**Duration**: 4-24 hours
**Frequency**: As needed (hopefully rare)

### Prerequisites
- [ ] Critical bug confirmed in production
- [ ] Root cause identified
- [ ] Fix validated locally

### Steps

#### Phase 1: Assessment (15 minutes)

**1. Verify the Issue**
```bash
# Check current production version
gh api repos/:owner/:repo/releases/latest

# Review error reports (Sentry when configured)
# Check user reports in app stores
```

**2. Assess Severity**
- **Critical**: >50% users affected, app unusable → Fix immediately
- **High**: >10% users affected, major feature broken → Fix within 24h
- **Medium**: <10% users affected, workaround available → Schedule for next release

**3. Communicate**
```
Post in team chat:
"🚨 HOTFIX REQUIRED
Version: v1.2.0
Issue: App crashes on login
Severity: Critical
Status: Investigating
ETA: 4 hours
Owner: @your-name"
```

#### Phase 2: Create Hotfix Branch (10 minutes)

**1. Branch from Main**
```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Check current version
git describe --tags --abbrev=0  # e.g., v1.2.0

# Create hotfix branch
git checkout -b hotfix/v1.2.1-login-crash
```

**2. Verify Starting Point**
```bash
# Confirm you're on the correct commit
git log -n 1
```

#### Phase 3: Implement Fix (1-4 hours)

**1. Write the Fix**
```typescript
// Example: Fix login crash
// File: services/auth.ts

// Before (causes crash):
const user = response.data.user;
const name = user.profile.name; // Crash if profile is null

// After (handles null):
const user = response.data.user;
const name = user?.profile?.name ?? 'Anonymous';
```

**2. Add Test**
```typescript
// File: services/__tests__/auth.test.ts

it('handles missing profile gracefully', () => {
  const user = { profile: null };
  const name = getUserName(user);
  expect(name).toBe('Anonymous');
  expect(() => getUserName(user)).not.toThrow();
});
```

**3. Test Locally**
```bash
# Run tests
npm run test -- auth.test.ts

# Type check
npm run typecheck

# Lint
npm run lint

# Run app and verify fix
npm start
# Test on both iOS and Android
```

#### Phase 4: Version Bump & PR (15 minutes)

**1. Bump Patch Version**
```bash
# This increments 1.2.0 -> 1.2.1
npm version patch

# Verify version updated
git log -n 1
git describe --tags
```

**2. Push Branch & Tag**
```bash
git push origin hotfix/v1.2.1-login-crash
git push origin --tags
```

**3. Create Urgent PR**
```bash
gh pr create \
  --base main \
  --head hotfix/v1.2.1-login-crash \
  --title "🚨 Hotfix v1.2.1: Fix login crash" \
  --label "hotfix" \
  --label "priority:critical" \
  --body "$(cat << EOF
# Hotfix v1.2.1: Fix login crash

## 🐛 Issue
Users experiencing crash when logging in if profile is null.

## 🔧 Fix
Added null check for user.profile in auth service.

## ✅ Testing
- [x] Added test for null profile case
- [x] Tested on Android emulator
- [x] Tested on iOS simulator
- [x] All automated tests pass

## 📊 Impact
- Severity: Critical
- Affected users: ~50%
- Platforms: Both iOS and Android

## ⏱️ Timeline
- Issue detected: 10:00 AM
- Fix implemented: 12:00 PM
- PR created: 12:15 PM
- Target deployment: 2:00 PM
EOF
)"
```

**4. Request Urgent Review**
```bash
gh pr edit --add-reviewer @tech-lead
```

#### Phase 5: Review & Merge (15-30 minutes)

**1. Expedited Review**
- Can be done concurrently with building
- Focus on the fix, not minor style issues
- Approve if fix is correct and tested

**2. Merge to Main**
```bash
# After approval
gh pr merge --squash

# Or merge via GitHub UI
```

**3. Monitor Production Build**
```bash
# Build automatically triggers on merge to main
gh run watch

# Monitor in EAS
eas build:list --limit 5 --profile production
```

#### Phase 6: Submit & Deploy (2-24 hours)

**1. Download & Test Build**
```bash
# Download production builds
eas build:list --profile production --limit 1

# Quick smoke test
# - Install on device
# - Verify fix works
# - Ensure no new issues introduced
```

**2. Submit to Stores**

**Android**:
```bash
# Via Google Play Console
# 1. Create new release
# 2. Upload AAB
# 3. Target production track (not internal for hotfix)
# 4. Release notes: "Bug fix: Resolved login crash issue"
# 5. Publish → Usually live in 1-2 hours
```

**iOS**:
```bash
# Via App Store Connect
# 1. Upload IPA to App Store (not just TestFlight)
# 2. Create new version (1.2.1)
# 3. Release notes: "Bug fix: Resolved login crash issue"
# 4. Submit for review
# 5. Request Expedited Review:
#    - Explain critical nature
#    - Mention users affected
#    - Usually reviewed in 2-24 hours
```

**3. Request Expedited iOS Review**
- In App Store Connect, check "Expedited Review"
- Provide justification: "Critical crash affecting majority of users"
- Apple typically reviews in 1-4 hours for genuine emergencies

#### Phase 7: Backport & Monitor (30 minutes + ongoing)

**1. Backport to Develop**
```bash
# Keep develop in sync
git checkout develop
git pull origin develop

# Merge hotfix
git merge hotfix/v1.2.1-login-crash

# Resolve conflicts if any
git push origin develop
```

**2. Clean Up**
```bash
# Delete hotfix branch (local and remote)
git branch -d hotfix/v1.2.1-login-crash
git push origin --delete hotfix/v1.2.1-login-crash
```

**3. Monitor Deployment**
- Watch crash rate (should decrease)
- Monitor user reviews
- Check for new issues
- Verify fix is effective

**4. Communicate Success**
```
Post in team chat:
"✅ HOTFIX DEPLOYED: v1.2.1
- Issue: Login crash fixed
- Android: Live in Play Store
- iOS: Submitted for expedited review (ETA: 4 hours)
- Crash rate: Monitoring
- Duration: 4 hours from detection to submission"
```

#### Phase 8: Post-Mortem (1-2 days later)

**1. Schedule Post-Mortem**
- What went wrong?
- Why wasn't it caught in testing?
- How can we prevent this?
- What went well in the response?

**2. Document Learnings**
- Update tests
- Improve CI/CD checks
- Enhance monitoring
- Update runbooks

### Success Criteria
- [x] Critical bug fixed
- [x] Hotfix deployed within SLA (4-24 hours)
- [x] No new issues introduced
- [x] Crash rate decreased
- [x] Post-mortem completed

---

## Playbook 3: Preview Build for QA

**Use Case**: Creating a preview build for QA testing
**Duration**: 20-30 minutes
**Frequency**: As needed

### Automatic Preview Build (Preferred)

**Triggered by**: Push to `develop` or `staging` branch

**Steps**:
1. Merge feature PR to `develop`
2. GitHub Actions automatically triggers build
3. Wait 10-20 minutes for build completion
4. Share build link with QA

```bash
# Check build status
gh run list --workflow=build-preview.yml --limit 5

# Get build URL
eas build:list --profile preview --limit 5

# Share with QA team
echo "Preview build ready: [EAS_BUILD_URL]"
```

### Manual Preview Build

**Use When**: Need build from specific branch

```bash
# 1. Checkout branch
git checkout feature/new-reading-mode

# 2. Trigger manual preview build
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Or both platforms
eas build --profile preview --platform all

# 3. Wait for build
eas build:list --limit 5

# 4. Share build URL
# Android: Share APK download link
# iOS: Add testers to TestFlight or share IPA
```

### Distributing to QA

**Android**:
```bash
# Get shareable link from EAS
eas build:view [BUILD_ID]

# Copy the download URL
# Share in team chat:
"📦 Preview Build Ready (Android)
Download: [URL]
Branch: feature/new-reading-mode
Changes: Added adjustable font sizes"
```

**iOS**:
```bash
# Option 1: TestFlight (recommended)
# Add QA emails in App Store Connect > TestFlight > Internal Testing

# Option 2: Direct IPA download
# Download from EAS
# Share via file hosting or AirDrop
```

### QA Testing Checklist

Share this checklist with QA:
- [ ] App installs successfully
- [ ] App launches without crashing
- [ ] New features work as expected
- [ ] Existing features still work (regression check)
- [ ] Tested on multiple devices
- [ ] Tested on different OS versions
- [ ] Performance is acceptable
- [ ] No obvious UI issues
- [ ] Signed off for production

---

## Playbook 4: First-Time Setup

**Use Case**: Setting up CI/CD for the first time or on a new machine
**Duration**: 15-30 minutes
**Frequency**: One-time (or per new team member)

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] GitHub account with repository access
- [ ] Expo account created (https://expo.dev)

### Steps

**1. Clone Repository**
```bash
git clone https://github.com/[org]/fable.git
cd fable
```

**2. Install Dependencies**
```bash
npm install
```

**3. Install EAS CLI**
```bash
npm install -g eas-cli

# Verify installation
eas --version
```

**4. Login to Expo**
```bash
eas login

# Enter your Expo credentials
# Email: your@email.com
# Password: ********
```

**5. Initialize EAS (First time only)**
```bash
# This creates/updates app.json with project ID
eas init

# Follow prompts
# - Use existing project or create new
# - Select your Expo account/organization
```

**6. Update app.json**
```json
// File: app.json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"  // Added by eas init
      }
    }
  }
}
```

**7. Configure GitHub Secret (Admin only)**
```bash
# 1. Generate Expo token
# Go to: https://expo.dev/settings/access-tokens
# Create token with name: "Fable CI/CD"
# Copy the token

# 2. Add to GitHub
# Go to: GitHub repo → Settings → Secrets and variables → Actions
# Click "New repository secret"
# Name: EXPO_TOKEN
# Value: [paste token]
# Click "Add secret"
```

**8. Test Locally**
```bash
# Run linter
npm run lint

# Type check
npm run typecheck

# Run tests
npm run test

# Start development server
npm start
```

**9. Test CI/CD**
```bash
# Create test branch
git checkout -b test/ci-setup

# Make small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: CI/CD setup"

# Push and create PR
git push origin test/ci-setup
gh pr create --base develop --title "Test: CI/CD Setup"

# Watch PR checks
gh pr checks

# Expected: All checks should pass
# - lint ✅
# - typecheck ✅
# - test ✅
# - validate-config ✅
```

**10. Verify Setup**
```bash
# Check EAS project
eas project:info

# Expected output:
# Project: fable
# ID: your-project-id
# Owner: your-org
```

### Troubleshooting Setup

**Error: "Not authenticated"**
```bash
# Re-login
eas logout
eas login
```

**Error: "Project ID not found"**
```bash
# Run init again
eas init
# Update app.json with generated ID
```

**Error: "GitHub Actions failing"**
```bash
# Verify EXPO_TOKEN secret exists
gh secret list

# If missing, add it (see Step 7)
```

### Success Criteria
- [x] Dependencies installed
- [x] EAS CLI working
- [x] Logged into Expo
- [x] Project initialized
- [x] GitHub secret configured
- [x] Local tests passing
- [x] PR checks passing

---

## Playbook 5: OTA Update Deployment (Phase 2)

**Use Case**: Pushing over-the-air updates without app store submission
**Status**: Not yet configured (Phase 2 planned)
**Duration**: 10-15 minutes once configured

### When to Use OTA Updates

**✅ Good for OTA:**
- JavaScript/TypeScript code changes
- React component updates
- Styling changes
- Content updates
- Bug fixes in JS code

**❌ Requires full release:**
- Native code changes
- New native dependencies
- SDK version upgrades
- App icon/splash screen changes
- Permissions changes

### Setup (Phase 2)

```bash
# 1. Install expo-updates
npx expo install expo-updates

# 2. Configure in app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}

# 3. Rebuild apps with update support
eas build --profile production --platform all
```

### Publishing OTA Update

```bash
# 1. Make changes (JS/React only)
# Edit files...

# 2. Test locally
npm start
# Verify changes work

# 3. Commit changes
git add .
git commit -m "fix: Login button alignment"

# 4. Publish update
eas update --branch production --message "Fix: Login button alignment"

# 5. Verify update
eas update:list --branch production

# Update will be downloaded by users next time they open the app
# or when they refresh (if in app)
```

### Rollback OTA Update

```bash
# Option 1: Republish previous update
eas update --branch production --republish --group [PREVIOUS_GROUP_ID]

# Option 2: Publish revert commit
git revert [BAD_COMMIT]
git push
eas update --branch production --message "Rollback: Revert previous update"
```

### Update Channels

```yaml
Channels:
  production:
    - Live users
    - Automatic updates
    - Requires approval

  staging:
    - Internal testing
    - QA team
    - Automatic updates

  development:
    - Developers only
    - Rapid iteration
    - No approval needed
```

---

## Playbook 6: Emergency Rollback

**Use Case**: Immediate rollback due to critical production issue
**Duration**: 15 minutes - 4 hours (depending on method)
**Frequency**: Hopefully never, but be prepared

### Decision Tree

```
Is the issue in JS code only?
├─ YES → Use OTA Rollback (15 min) - Phase 2 only
└─ NO → Use App Store Rollback (1-4 hours)

Can previous version be promoted?
├─ YES → Promote Previous Version (1-2 hours)
└─ NO → Emergency Build (4-24 hours)
```

### Method 1: OTA Rollback (Fastest - Phase 2 only)

**When**: Issue is in JavaScript code, not native code
**Time**: 15 minutes

```bash
# 1. Identify previous good update
eas update:list --branch production --limit 10

# 2. Republish previous update
eas update --branch production --republish --group [GOOD_GROUP_ID]

# 3. Verify rollback
eas update:list --branch production --limit 1

# 4. Monitor
# Users will get previous version on next app open/refresh
# No app store submission needed
```

### Method 2: Promote Previous Version

**When**: Issue includes native code, previous version still in store
**Time**: 1-2 hours for Android, may vary for iOS

**Android (Google Play Console)**:
```
1. Go to https://play.google.com/console
2. Select Fable app
3. Go to Release → Production
4. Find previous version (e.g., v1.2.0)
5. Click "Promote to Production"
6. Add release notes: "Rollback to previous stable version"
7. Review and publish
8. Usually live in 1-2 hours
```

**iOS (App Store Connect)**:
```
iOS doesn't support rollback to previous versions.
If current version has issues:
1. Remove current version from sale (temporarily)
2. Submit new emergency build (see Method 3)
```

### Method 3: Emergency Build

**When**: Previous version not available or too old
**Time**: 4-24 hours

```bash
# 1. Identify last known good commit
git log --oneline --all --graph -20

# Find the last good version tag
git tag --list 'v*' --sort=-version:refname | head -5

# 2. Create emergency hotfix branch
git checkout -b hotfix/rollback-v1.2.0 v1.2.0

# 3. Bump version
npm version patch  # Creates v1.2.1

# 4. Push and trigger build
git push origin hotfix/rollback-v1.2.0
git push origin --tags

# 5. Create PR to main
gh pr create --base main --head hotfix/rollback-v1.2.0 \
  --title "🚨 Emergency Rollback to v1.2.0" \
  --body "Rolling back to last known good version due to critical issue in v1.2.1"

# 6. Merge and deploy
# Follow Hotfix Playbook steps
```

### Communication During Rollback

**Immediate Notification**:
```
Post in team chat:
"🚨 EMERGENCY ROLLBACK IN PROGRESS
Current version: v1.2.1
Rolling back to: v1.2.0
Reason: [Brief description]
ETA: [Time]
Status: [In Progress/Complete]
Owner: @your-name"
```

**Status Updates** (Every 30 minutes):
```
"🔄 Rollback Status Update:
- Build: [Complete/In Progress]
- Android: [Submitted/Pending]
- iOS: [Submitted/Pending]
- ETA: [Updated time]"
```

**Completion**:
```
"✅ ROLLBACK COMPLETE
- Version restored: v1.2.0
- Android: Live in Play Store
- iOS: [Status]
- Issue: Resolved
- Next steps: Post-mortem scheduled for [date/time]"
```

### Post-Rollback Actions

**1. Investigate Root Cause** (Immediate)
```bash
# Review the bad version
git checkout v1.2.1
git log v1.2.0..v1.2.1
git diff v1.2.0..v1.2.1

# Identify what went wrong
```

**2. Document Incident** (Within 24 hours)
```markdown
# Incident Report: v1.2.1 Rollback

## Timeline
- 10:00 AM: Issue detected
- 10:15 AM: Rollback initiated
- 11:30 AM: Android rolled back
- 2:00 PM: iOS rolled back

## Root Cause
[What went wrong]

## Impact
- Users affected: ~X%
- Duration: X hours
- Platforms: Android/iOS/Both

## Actions Taken
1. Rolled back to v1.2.0
2. Investigated root cause
3. Fixed issue
4. Added test to prevent recurrence

## Prevention
- Add test for [scenario]
- Improve [process]
- Update checklist
```

**3. Schedule Post-Mortem** (Within 2-3 days)
- Invite: Engineering team, QA, Product
- Agenda: What happened, why, how to prevent
- Output: Action items to prevent recurrence

---

## Troubleshooting: Build Failures

### Symptom: GitHub Actions workflow fails

**Check**: Workflow logs
```bash
# View recent workflow runs
gh run list --workflow=build-production.yml --limit 5

# View specific run
gh run view [RUN_ID]

# Download logs
gh run download [RUN_ID]
```

**Common Causes & Fixes**:

#### 1. Missing EXPO_TOKEN

**Error**:
```
Error: Not authenticated with Expo
```

**Fix**:
```bash
# Verify secret exists
gh secret list

# If missing, add it
# Go to: GitHub → Settings → Secrets → Actions → New secret
# Name: EXPO_TOKEN
# Value: [token from https://expo.dev/settings/access-tokens]
```

#### 2. npm install fails

**Error**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Fix**:
```bash
# Delete package-lock.json and node_modules
rm package-lock.json
rm -rf node_modules

# Reinstall
npm install

# Commit updated package-lock.json
git add package-lock.json
git commit -m "fix: Update package-lock.json"
git push
```

#### 3. TypeScript compilation fails

**Error**:
```
error TS2307: Cannot find module '@components/Button'
```

**Fix**:
```bash
# Check tsconfig.json paths are correct
# Verify file exists at expected location

# Fix import or file location
npm run typecheck  # Test locally
```

#### 4. EAS build fails

**Error**:
```
Build failed with error: [Various errors]
```

**Fix**:
```bash
# View detailed logs in EAS
eas build:view [BUILD_ID]

# Common issues:
# - Missing credentials: Run `eas credentials`
# - Invalid eas.json: Validate JSON syntax
# - Platform-specific issues: Check platform logs
```

### Symptom: Build succeeds but app crashes

**Check**: Device logs and EAS build logs

**Common Causes & Fixes**:

#### 1. Missing native dependencies

**Error**:
```
Invariant Violation: Native module cannot be null
```

**Fix**:
```bash
# Ensure all native dependencies are in package.json
# Rebuild with cleared cache
eas build --clear-cache --profile production --platform [ios/android]
```

#### 2. Environment variable missing

**Error**:
```
API_URL is undefined
```

**Fix**:
```json
// File: eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.fable.app"
      }
    }
  }
}
```

---

## Troubleshooting: CI/CD Pipeline Issues

### Symptom: PR checks never run

**Check**: Workflow file and branch name

**Common Causes**:

#### 1. Workflow file has syntax error

**Fix**:
```bash
# Validate YAML
cat .github/workflows/pr-checks.yml | yamllint -

# Or use online validator
# https://www.yamllint.com/
```

#### 2. Branch name doesn't match trigger

**Fix**:
```yaml
# File: .github/workflows/pr-checks.yml
on:
  pull_request:
    branches: [main, develop]  # Ensure your PR targets these branches
```

#### 3. GitHub Actions disabled

**Fix**:
```
Go to: GitHub → Settings → Actions → General
Ensure "Allow all actions" is selected
```

### Symptom: Workflow takes too long

**Check**: Build times and caching

**Optimization**:

```yaml
# Add caching to workflow
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

## Troubleshooting: Store Submission Errors

### Android: Google Play Console

#### Error: "Upload failed: Invalid signature"

**Cause**: Using wrong keystore for signing

**Fix**:
```bash
# Generate new upload key (first time only)
eas credentials

# Select: Android → Production → Build Credentials → Upload Keystore
# Follow prompts to generate
```

#### Error: "Version code must be greater than..."

**Cause**: Version code not incremented or already used

**Fix**:
```json
// File: app.json
{
  "expo": {
    "android": {
      "versionCode": 11  // Increment this number
    }
  }
}

// Or use autoIncrement in eas.json (already configured)
```

### iOS: App Store Connect

#### Error: "Missing compliance"

**Cause**: Export compliance not answered

**Fix**:
```json
// File: app.json
{
  "expo": {
    "ios": {
      "config": {
        "usesNonExemptEncryption": false
      }
    }
  }
}
```

#### Error: "Invalid provisioning profile"

**Cause**: Provisioning profile expired or misconfigured

**Fix**:
```bash
# Regenerate credentials
eas credentials

# Select: iOS → Production → Provisioning Profile
# Choose: Generate new profile
```

---

## Troubleshooting: Authentication Issues

### Error: "Not authenticated with Expo"

**Fix**:
```bash
# Re-login
eas logout
eas login

# Verify
eas whoami
```

### Error: "GitHub token invalid"

**Fix**:
```bash
# For GitHub CLI
gh auth logout
gh auth login

# For GitHub Actions, regenerate EXPO_TOKEN
# https://expo.dev/settings/access-tokens
```

---

## Quick Reference Commands

### Status Checks
```bash
# Git status
git status
git log --oneline -10

# Workflow runs
gh run list --limit 10

# Build status
eas build:list --limit 10

# Current version
cat package.json | grep version
```

### Build Commands
```bash
# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# With cleared cache
eas build --clear-cache --profile production --platform all

# Local build (for testing)
eas build --profile preview --platform android --local
```

### Deployment Commands
```bash
# Submit to stores
eas submit --platform android --latest
eas submit --platform ios --latest

# OTA update (Phase 2)
eas update --branch production --message "Description"
```

### Version Commands
```bash
# Bump version
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Push tags
git push origin --tags
```

### Diagnostic Commands
```bash
# View build details
eas build:view [BUILD_ID]

# View build logs
eas build:view [BUILD_ID] --logs

# Check EAS project
eas project:info

# Check credentials
eas credentials
```

---

## Escalation Contacts

### Internal Team
- **Tech Lead**: For architectural decisions
- **Product Owner**: For release approval
- **QA Lead**: For testing sign-off
- **Deployment Manager**: For CI/CD issues (invoke via `/deployment-manager`)

### External Support
- **Expo Support**: https://expo.dev/support
- **GitHub Support**: https://support.github.com
- **Google Play Support**: https://support.google.com/googleplay/android-developer
- **Apple Developer Support**: https://developer.apple.com/support/

---

## Document Maintenance

**Last Updated**: 2026-01-25
**Version**: 1.0
**Next Review**: 2026-04-25 (Quarterly)

**Feedback**: If you encounter a scenario not covered here, please:
1. Document the issue and solution
2. Update this runbook
3. Notify the team via `/deployment-manager`

---

**Questions?** Invoke the Deployment Manager agent: `/deployment-manager`
