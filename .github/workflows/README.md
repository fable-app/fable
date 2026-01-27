# GitHub Actions Workflows

This directory contains CI/CD workflows for the Fable language learning app monorepo.

## Monorepo Structure

The project uses npm workspaces with the following structure:
- `apps/mobile/` - React Native mobile app
- `packages/core/` - Core business logic and types
- `packages/design-system/` - Shared UI components
- `packages/sdk/` - White-label SDK for third-party apps

## Workflows

### pr-checks.yml
**Purpose:** Validates code quality on every pull request across all packages

**Triggers:**
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint** - Matrix strategy testing mobile, core, design-system, and sdk packages
- **Type Check** - TypeScript validation for all packages
- **Build SDK** - Verifies SDK builds correctly with proper output
- **Test** - Runs test suites for all packages
- **Validate Config** - Validates JSON configuration files at new paths
- **Workspace Check** - Verifies npm workspace linking and checks for duplicate dependencies
- **Security Audit** - Runs npm audit for vulnerability scanning
- **All Checks Passed** - Final summary job requiring all checks to succeed

### build-production.yml
**Purpose:** Builds production-ready apps and deploys to app stores

**Triggers:**
- Push to `main` branch
- Git tags matching `v*` pattern
- Manual trigger

**Jobs:**
- **Build Android Production** - Builds Android App Bundle (.aab) from `apps/mobile/`
- **Submit to Google Play Store** - Automatically submits Android build to Play Store
- **Build iOS Production** - Builds iOS IPA from `apps/mobile/`
- **Notify Deployment Status** - Final status report for all deployments

**Setup Required:**
- `EXPO_TOKEN` secret (for EAS builds)
- `GOOGLE_SERVICE_ACCOUNT_KEY` secret (for Play Store submission)

See [PLAY_STORE_SETUP.md](PLAY_STORE_SETUP.md) for detailed setup instructions.

### build-preview.yml
**Purpose:** Builds preview versions for internal testing

**Triggers:**
- Push to `develop` or `staging` branches
- Manual trigger with platform selection

**Jobs:**
- Build Android APK or iOS IPA from `apps/mobile/`
- Upload build artifacts
- Comment on PR with build status

### sdk-publish.yml
**Purpose:** Publishes the @fable/sdk package to npm registry

**Triggers:**
- Push to tags matching `sdk-v*` pattern
- Manual trigger with version bump selection (patch/minor/major)

**Jobs:**
- **Validate** - Type check, build, and verify SDK package
- **Publish** - Bump version, build, publish to npm, create GitHub release
- **Notify** - Report publish status

**Usage:**
```bash
# Manual publish with version bump
gh workflow run sdk-publish.yml -f version_type=patch

# Dry run (validate only, no publish)
gh workflow run sdk-publish.yml -f version_type=patch -f dry_run=true

# Tag-based publish
git tag sdk-v1.0.1
git push origin sdk-v1.0.1
```

## Required Secrets

Configure these in: **Repository Settings > Secrets and variables > Actions**

| Secret Name | Required For | Description |
|------------|--------------|-------------|
| `EXPO_TOKEN` | All builds | Expo authentication token from expo.dev |
| `NPM_TOKEN` | SDK publishing | npm authentication token for publishing @fable/sdk |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Android submission | Google Play service account JSON key |
| `APPLE_APP_STORE_CONNECT_KEY` | iOS submission | App Store Connect API key (.p8 file) |

### Generating NPM_TOKEN

1. Log in to npmjs.com
2. Go to Account Settings > Access Tokens
3. Click "Generate New Token" > "Automation"
4. Copy the token and add to GitHub Secrets as `NPM_TOKEN`

## Usage

### Running Workflows Manually

**Via GitHub UI:**
1. Go to Actions tab
2. Select workflow from left sidebar
3. Click "Run workflow" button
4. Select branch and options
5. Click "Run workflow"

**Via GitHub CLI:**
```bash
# Production build
gh workflow run build-production.yml

# Preview build for Android only
gh workflow run build-preview.yml -f platform=android

# Publish SDK with patch version bump
gh workflow run sdk-publish.yml -f version_type=patch

# SDK dry run (validate only)
gh workflow run sdk-publish.yml -f version_type=patch -f dry_run=true
```

### Monitoring Builds

**GitHub Actions:**
- Actions tab shows real-time logs
- Green checkmark = success
- Red X = failure
- Click on workflow run for details

**EAS Dashboard:**
- Visit expo.dev
- Navigate to project > Builds
- View detailed logs and download artifacts

## Troubleshooting

### Workflow Not Triggering

1. Check that the workflow file is valid YAML
2. Verify branch names match trigger patterns
3. Ensure GitHub Actions are enabled in repo settings

### Build Fails

1. Check workflow logs in Actions tab
2. Verify all required secrets are configured
3. Check EAS dashboard for detailed build logs
4. Review recent changes that might break builds

### Authentication Errors

1. Verify `EXPO_TOKEN` is valid
2. Regenerate token if expired: expo.dev/settings/access-tokens
3. Update secret in GitHub repository settings

## Documentation

For detailed setup and usage instructions, see:
- [EAS_SETUP.md](../../EAS_SETUP.md) - Local EAS configuration
- [CI_CD_GUIDE.md](../../CI_CD_GUIDE.md) - Complete CI/CD documentation
- [DEPLOYMENT_MANAGER.md](../../DEPLOYMENT_MANAGER.md) - Deployment process

## Maintenance

These workflows should be reviewed and updated when:
- Expo SDK is upgraded
- New packages are added to the monorepo
- Dependencies are added or updated
- Build process changes
- New deployment targets are added
- SDK public API changes

## Monorepo Notes

- All workflows install workspace dependencies from the root with `npm install --legacy-peer-deps`
- Mobile app workflows use `working-directory: apps/mobile` for EAS commands
- SDK workflows use `working-directory: packages/sdk` for build and publish
- PR checks use matrix strategy to test all packages in parallel
- Workspace integrity is verified to ensure proper package linking

---

Last Updated: 2026-01-26
