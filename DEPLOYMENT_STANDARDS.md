# Deployment Standards
**Fable Language Learning App**

---

## Purpose

This document establishes the release and deployment standards for the Fable project. All team members must follow these standards to ensure consistent, reliable, and safe deployments to production.

**Last Updated**: 2026-01-25
**Version**: 1.0
**Owner**: Deployment Manager Agent
**Review Cycle**: Quarterly

---

## Table of Contents

1. [Versioning Standards](#versioning-standards)
2. [Branch Strategy](#branch-strategy)
3. [Release Process](#release-process)
4. [Quality Gates](#quality-gates)
5. [Deployment Windows](#deployment-windows)
6. [Environment Standards](#environment-standards)
7. [Rollback Procedures](#rollback-procedures)
8. [Hotfix Process](#hotfix-process)
9. [Communication Standards](#communication-standards)
10. [Compliance & Security](#compliance--security)

---

## Versioning Standards

### Semantic Versioning (SemVer)

**Format**: `MAJOR.MINOR.PATCH` (e.g., `2.1.3`)

#### Version Component Rules

**MAJOR** version (X.0.0)
- Breaking changes that require user action
- Major feature releases that change core functionality
- Complete redesigns or architecture changes
- Minimum interval: 6 months
- Requires: Product team approval + extended testing

**MINOR** version (X.Y.0)
- New features added in a backwards-compatible manner
- Significant enhancements to existing features
- New story content additions
- Minimum interval: 2 weeks
- Requires: QA sign-off + preview build testing

**PATCH** version (X.Y.Z)
- Bug fixes that are backwards-compatible
- Performance improvements
- UI/UX refinements
- Security patches
- Minimum interval: None (can be daily for critical fixes)
- Requires: Automated tests passing

### Version Bumping Procedure

**Command**:
```bash
# Determine the version type
npm version [major|minor|patch]

# This will:
# 1. Update package.json version
# 2. Update package-lock.json version
# 3. Create a git commit with the version
# 4. Create a git tag (v1.0.0)
```

**Manual Update** (if needed):
1. Update `version` in `package.json`
2. Update `version` in `app.json` under `expo.version`
3. Update `versionCode` (Android) in `app.json` - must increment
4. Update `buildNumber` (iOS) in `app.json` - must increment

**Example**:
```json
{
  "expo": {
    "version": "1.2.3",
    "android": {
      "versionCode": 10
    },
    "ios": {
      "buildNumber": "1.2.3.10"
    }
  }
}
```

### Build Numbers

**Android `versionCode`**:
- Integer that must always increment
- Never reuse a version code
- Recommended format: `XXYYZZ` where XX=major, YY=minor, ZZ=patch
- Example: Version 1.2.3 → versionCode 10203

**iOS `buildNumber`**:
- String that must increment for each submission
- Can use format: `MAJOR.MINOR.PATCH.BUILD`
- Example: `1.2.3.5` (5th build of version 1.2.3)

**EAS Auto-Increment**:
- Production profile has `autoIncrement: true` enabled
- EAS automatically increments build numbers
- Only affects store submissions, not development builds

---

## Branch Strategy

### Branch Types

#### Protected Branches

**`main`** (Production)
- Contains production-ready code only
- All code must pass PR checks
- Triggers production builds automatically
- Direct commits: ❌ NOT ALLOWED
- Requires: Pull request + code review + all checks passing

**`develop`** (Integration)
- Integration branch for feature development
- Triggers preview builds automatically
- Contains next release features
- Direct commits: ⚠️ DISCOURAGED (use PRs)
- Requires: Pull request + automated checks passing

#### Working Branches

**`feature/*`** (Feature Development)
- New features and enhancements
- Naming: `feature/short-description` (e.g., `feature/reading-progress-tracker`)
- Base branch: `develop`
- Merge to: `develop` via pull request
- Lifespan: Delete after merge

**`fix/*`** (Bug Fixes)
- Non-critical bug fixes
- Naming: `fix/short-description` (e.g., `fix/audio-playback-android`)
- Base branch: `develop`
- Merge to: `develop` via pull request
- Lifespan: Delete after merge

**`hotfix/*`** (Production Hotfixes)
- Critical production bugs requiring immediate fix
- Naming: `hotfix/v1.2.4-description` (e.g., `hotfix/v1.2.4-login-crash`)
- Base branch: `main`
- Merge to: `main` AND `develop`
- Version bump: PATCH
- Lifespan: Delete after merge

**`release/*`** (Release Preparation)
- Optional: Use for release preparation and testing
- Naming: `release/v1.2.0`
- Base branch: `develop`
- Merge to: `main` AND `develop`
- Lifespan: Delete after merge

### Branch Protection Rules

**Recommended Settings for `main` branch:**
```yaml
Required status checks:
  - lint
  - typecheck
  - test
  - validate-config

Require pull request reviews: 1 approval minimum
Require conversation resolution: true
Require linear history: true
Include administrators: false
Allow force pushes: false
Allow deletions: false
```

**Configure at**: GitHub Repository → Settings → Branches → Add rule

---

## Release Process

### Release Types

#### 1. Regular Release (Minor/Major)

**Timeline**: Bi-weekly (every 2 weeks)

**Process**:
1. **Code Freeze** (Friday)
   - No new features merged to `develop`
   - Only bug fixes allowed

2. **Preview Build** (Friday)
   - Triggered automatically on `develop`
   - Distributed to QA team for testing
   - Testing window: 2-3 days

3. **Version Bump** (Monday/Tuesday)
   ```bash
   git checkout develop
   npm version minor  # or major
   git push origin develop --tags
   ```

4. **Create Pull Request** (Monday/Tuesday)
   - From `develop` to `main`
   - Title: "Release v1.2.0"
   - Include release notes in description
   - Request review from tech lead

5. **Merge to Main** (Tuesday/Wednesday)
   - After approval and all checks passing
   - Production build triggers automatically
   - Monitor build in EAS dashboard

6. **Test Production Build** (Wednesday)
   - Download from EAS
   - Internal testing on physical devices
   - Verify all features working

7. **Submit to Stores** (Wednesday/Thursday)
   - Phase 1: Manual submission
   - Phase 2: Automated submission to internal track
   - Android: Google Play Console → Internal testing
   - iOS: App Store Connect → TestFlight

8. **Production Release** (Thursday/Friday)
   - Promote to production in app stores
   - Monitor crash reports and analytics
   - Announce release to team and users

#### 2. Patch Release (Bug Fix)

**Timeline**: As needed (can be same day for critical bugs)

**Process**:
1. **Create Fix Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b fix/description
   ```

2. **Implement Fix**
   - Write fix + test
   - Commit with descriptive message
   - Push to remote

3. **Create Pull Request**
   - To `develop` branch
   - Wait for automated checks
   - Request review

4. **Merge and Version Bump**
   ```bash
   git checkout develop
   git pull origin develop
   npm version patch
   git push origin develop --tags
   ```

5. **Follow Regular Release Steps 4-8**

#### 3. Hotfix Release (Critical Production Bug)

**Timeline**: Immediate (within 4-24 hours)

**Process**: See [Hotfix Process](#hotfix-process) section below

### Release Checklist

**Pre-Release** (Before creating production build)
- [ ] All automated tests passing
- [ ] Code review completed and approved
- [ ] Preview build tested by QA
- [ ] No critical bugs reported
- [ ] Version number incremented
- [ ] Release notes drafted
- [ ] CHANGELOG.md updated
- [ ] App store assets prepared (screenshots, descriptions)
- [ ] Translation updates included (if applicable)
- [ ] Database migrations tested (if applicable)

**Release** (During production build)
- [ ] Production build triggered (via tag or main merge)
- [ ] Android build completed successfully
- [ ] iOS build completed successfully
- [ ] Build artifacts downloaded and archived
- [ ] Internal testing completed on both platforms
- [ ] No regressions identified

**Post-Release** (After store submission)
- [ ] Submitted to Google Play (internal/beta track)
- [ ] Submitted to TestFlight (iOS beta)
- [ ] Release notes published
- [ ] GitHub release created with tag
- [ ] Team notified of release
- [ ] Monitoring dashboards checked
- [ ] Crash reports reviewed (24-48 hours)
- [ ] User feedback monitored
- [ ] Analytics verified working

---

## Quality Gates

### Pull Request Quality Gates

**All PRs must pass these automated checks:**

1. **ESLint** (`npm run lint`)
   - Zero warnings policy
   - Must pass with no errors
   - Checks code style and quality

2. **TypeScript** (`npm run typecheck`)
   - Must compile without errors
   - Checks type safety
   - Validates imports and exports

3. **Jest Tests** (`npm run test`)
   - All tests must pass
   - No skipped tests in PR
   - Code coverage should not decrease

4. **Config Validation**
   - `app.json` must be valid JSON
   - `eas.json` must be valid JSON
   - Build profiles must be properly configured

**PR Review Requirements:**
- At least 1 approval from code owner
- All conversations resolved
- No requested changes pending
- Descriptive PR title and description

### Production Deployment Quality Gates

**Additional requirements for deploying to production:**

1. **Preview Build Testing**
   - Must have successful preview build
   - QA testing completed
   - Sign-off from QA lead or tech lead

2. **Version Requirements**
   - Version number properly incremented
   - Build numbers incremented
   - Release tag created

3. **Documentation**
   - Release notes written
   - Breaking changes documented
   - Migration guide (if needed)

4. **Security**
   - No known security vulnerabilities
   - Dependencies up to date
   - Secrets properly configured

5. **Performance**
   - No significant performance regressions
   - App size within acceptable limits (<50MB)
   - Startup time acceptable (<3 seconds)

### Quality Metrics

**Target Metrics:**
- **Build Success Rate**: ≥99%
- **Test Coverage**: ≥70% (target: 80%)
- **Crash-Free Rate**: ≥99.5%
- **Build Time**: <20 minutes
- **PR Cycle Time**: <24 hours

---

## Deployment Windows

### Allowed Deployment Times

**Regular Releases**:
- **Preferred**: Tuesday-Thursday, 9 AM - 3 PM local time
- **Avoid**: Fridays, weekends, holidays
- **Rationale**: Ensures team availability for monitoring and hotfixes

**Hotfixes**:
- **Allowed**: Anytime, 24/7
- **Communication**: Required before deploying off-hours

### Deployment Freeze Periods

**No deployments during:**
- Major holidays (Christmas, New Year, etc.)
- Company-wide events or offsites
- Known high-traffic periods (if applicable)
- Maintenance windows (planned downtime)

**Freeze Calendar**: Maintained by Deployment Manager

---

## Environment Standards

### Environment Definitions

#### Development
- **Purpose**: Local development and testing
- **Build Profile**: `development`
- **Distribution**: Internal only
- **Updates**: Immediate, no approval needed
- **Data**: Development database with test data
- **Environment Variable**: `EXPO_PUBLIC_ENV=development`

#### Preview/Staging
- **Purpose**: QA testing and stakeholder previews
- **Build Profile**: `preview`
- **Distribution**: Internal testers via EAS
- **Updates**: On push to `develop` branch
- **Data**: Staging database (sanitized production data)
- **Environment Variable**: `EXPO_PUBLIC_ENV=preview`

#### Production
- **Purpose**: End users via app stores
- **Build Profile**: `production`
- **Distribution**: Google Play Store, Apple App Store
- **Updates**: Controlled releases only
- **Data**: Production database
- **Environment Variable**: `EXPO_PUBLIC_ENV=production`

### Environment Configuration

**Environment Variables** (in `eas.json`):
```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_ENV": "preview",
        "EXPO_PUBLIC_API_URL": "https://staging-api.fable.app"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://api.fable.app"
      }
    }
  }
}
```

**Reading Environment Variables** (in code):
```typescript
const ENV = process.env.EXPO_PUBLIC_ENV;
const isProduction = ENV === 'production';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

---

## Rollback Procedures

### When to Rollback

**Immediate rollback if:**
- App crashes on launch for significant % of users
- Data loss or corruption occurring
- Security vulnerability actively exploited
- Critical feature completely broken
- Crash rate exceeds 5%

**Consider rollback if:**
- Major feature not working as expected
- Performance significantly degraded
- User complaints exceeding normal levels
- Analytics showing abnormal behavior

### Rollback Methods

#### Method 1: OTA Update Rollback (Fastest - Phase 2)
**When**: JavaScript-only changes, no native code changes
**Time**: 5-15 minutes

```bash
# Roll back to previous OTA update
eas update --branch production --message "Rollback to previous version"

# Or republish previous known-good update
eas update --branch production --republish --group [PREVIOUS_GROUP_ID]
```

#### Method 2: Previous Version Promotion (Fast)
**When**: Native changes included, previous version still in store
**Time**: 1-2 hours (depending on store review)

**Android (Google Play Console)**:
1. Go to Release Management → App releases
2. Find previous production release
3. Click "Promote to Production"
4. Confirm and publish

**iOS (App Store Connect)**:
1. Previous version must still be approved
2. If yes: Re-release previous version
3. If no: Must submit new build (slower)

#### Method 3: Emergency Build (Slower)
**When**: Previous version not available or too old
**Time**: 4-24 hours

```bash
# Revert commits
git revert [BAD_COMMIT_SHA]

# Or create hotfix branch from last good tag
git checkout -b hotfix/rollback v1.2.0

# Bump version
npm version patch

# Trigger production build
git push origin hotfix/rollback
```

### Rollback Communication

**Internal**:
1. Post in team chat immediately: "🚨 ROLLING BACK: [version] due to [reason]"
2. Update status page (if applicable)
3. Document incident details
4. Schedule post-mortem

**External**:
1. Update app store description (if needed)
2. Respond to user reviews mentioning issues
3. In-app notification (if severe impact)

---

## Hotfix Process

### Hotfix Criteria

**Use hotfix process when:**
- Production app has critical bug
- Security vulnerability discovered
- Data loss/corruption occurring
- App crashes preventing core functionality
- Compliance or legal issue

**Do NOT use hotfix for:**
- Minor UI issues
- Feature requests
- Non-critical bugs
- Performance optimizations (unless severe)

### Hotfix Workflow

**1. Assess Severity** (5 minutes)
- **Critical**: Affects >50% of users, app unusable
- **High**: Affects >10% of users, major feature broken
- **Medium**: Affects <10% of users, workaround available

**2. Create Hotfix Branch** (5 minutes)
```bash
# Branch from main (production)
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/v1.2.4-description

# Example: hotfix/v1.2.4-login-crash
```

**3. Implement Fix** (1-4 hours)
- Write minimum code to fix issue
- Add test to verify fix
- Test locally on both platforms
- Do NOT include unrelated changes

**4. Version Bump** (2 minutes)
```bash
# Bump patch version
npm version patch

# This creates: v1.2.4 (if current is v1.2.3)
```

**5. Create Pull Request** (5 minutes)
- To: `main` branch
- Title: `Hotfix v1.2.4: Description`
- Label: `hotfix`, `priority:critical`
- Description: Clearly explain bug and fix
- Request urgent review

**6. Review & Merge** (15-30 minutes)
- Expedited review process
- At least 1 approval required (can be concurrent with building)
- Merge to `main`

**7. Production Build** (10-25 minutes)
- Triggered automatically on merge to main
- Monitor build progress in EAS
- Download and test build immediately

**8. Submit to Stores** (2-24 hours)
- Android: Can submit immediately to production
- iOS: May require App Store review (1-24 hours)
- Request expedited review if critical

**9. Backport to Develop** (5 minutes)
```bash
# Merge hotfix to develop to keep branches in sync
git checkout develop
git merge hotfix/v1.2.4-description

# Or cherry-pick if conflicts
git cherry-pick [COMMIT_SHA]

git push origin develop
```

**10. Monitor & Verify** (24-48 hours)
- Watch crash reports
- Monitor user reviews
- Check analytics for improvement
- Confirm issue resolved

### Hotfix Timeline Targets

- **Critical**: Fixed and deployed within 4 hours
- **High**: Fixed and deployed within 24 hours
- **Medium**: Fixed and deployed within 48 hours

---

## Communication Standards

### Release Announcements

**Internal Team Notifications**:
- Post in team chat when production build starts
- Share build links when preview builds complete
- Announce when release is submitted to stores
- Report when release goes live to users

**Release Notes Format**:
```markdown
# Fable v1.2.0 Release Notes

**Release Date**: 2026-01-25
**Platforms**: iOS, Android

## ✨ New Features
- Added progress tracking for stories
- New reading mode with adjustable font sizes

## 🐛 Bug Fixes
- Fixed audio playback on Android
- Corrected translation alignment issues

## 🎨 Improvements
- Improved app startup time by 20%
- Enhanced UI transitions

## 📝 Notes
- Users may need to re-download stories (one-time)
```

**User-Facing Release Notes** (App Store):
- Keep concise (500 characters max recommended)
- Focus on user-visible changes
- Use friendly, non-technical language
- Highlight most impactful features first

### Incident Communication

**During Incident**:
```
🚨 INCIDENT: Production build failure
Status: Investigating
Impact: New builds blocked, users unaffected
ETA: 30 minutes
Owner: @deployment-manager
```

**Resolution**:
```
✅ RESOLVED: Production build failure
Root Cause: Missing environment variable
Fix: Added EXPO_TOKEN to GitHub secrets
Duration: 45 minutes
Next Steps: Post-mortem scheduled
```

---

## Compliance & Security

### Security Requirements

**Before Every Release**:
- [ ] No secrets in code (use environment variables)
- [ ] Dependencies scanned for vulnerabilities (`npm audit`)
- [ ] No high/critical vulnerabilities present
- [ ] Secrets properly configured in GitHub/EAS
- [ ] HTTPS enforced for all API calls

**Quarterly Security Tasks**:
- [ ] Rotate EXPO_TOKEN
- [ ] Review GitHub secrets access
- [ ] Update dependencies to latest secure versions
- [ ] Review and update security policies
- [ ] Audit team member access

### Compliance Checklist

**App Store Compliance**:
- [ ] Privacy policy URL configured
- [ ] Required permissions documented
- [ ] Terms of service available
- [ ] Age rating appropriate
- [ ] Export compliance answered

**Data Protection**:
- [ ] User data encrypted at rest
- [ ] Secure communication (HTTPS/TLS)
- [ ] Privacy policy compliant with GDPR/CCPA
- [ ] User consent for tracking (if applicable)
- [ ] Data retention policy implemented

---

## Appendix

### Useful Commands Reference

```bash
# Version management
npm version patch               # Bump patch version
npm version minor               # Bump minor version
npm version major               # Bump major version

# Build commands
eas build --profile preview --platform android
eas build --profile production --platform all

# Submit commands
eas submit --platform android --latest
eas submit --platform ios --latest

# Status checks
eas build:list --limit 10
eas build:view [BUILD_ID]
gh run list --workflow=build-production.yml

# Testing
npm run lint
npm run typecheck
npm run test
```

### Document Revision History

| Version | Date       | Changes                          | Author              |
|---------|------------|----------------------------------|---------------------|
| 1.0     | 2026-01-25 | Initial standards document       | Deployment Manager  |

---

**Questions or suggestions?** Contact the Deployment Manager via `/deployment-manager` command.

**Maintained by**: Deployment Manager Agent
**Review Required**: Quarterly or after major incidents
**Approval Authority**: Tech Lead + Product Owner
