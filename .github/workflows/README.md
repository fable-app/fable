# GitHub Actions Workflows

This directory contains CI/CD workflows for the Fable language learning app.

## Workflows

### pr-checks.yml
**Purpose:** Validates code quality on every pull request

**Triggers:**
- Pull requests to `main` or `develop` branches

**Jobs:**
- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests (Jest)
- Configuration validation

### build-production.yml
**Purpose:** Builds production-ready apps for app store release

**Triggers:**
- Push to `main` branch
- Git tags matching `v*` pattern
- Manual trigger

**Jobs:**
- Build Android App Bundle (.aab)
- Build iOS IPA
- Upload build artifacts

### build-preview.yml
**Purpose:** Builds preview versions for internal testing

**Triggers:**
- Push to `develop` or `staging` branches
- Manual trigger with platform selection

**Jobs:**
- Build Android APK or iOS IPA
- Comment on PR with build status

## Required Secrets

Configure these in: **Repository Settings > Secrets and variables > Actions**

| Secret Name | Required For | Description |
|------------|--------------|-------------|
| `EXPO_TOKEN` | All builds | Expo authentication token from expo.dev |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Android submission | Google Play service account JSON key |
| `APPLE_APP_STORE_CONNECT_KEY` | iOS submission | App Store Connect API key (.p8 file) |

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
- New dependencies are added
- Build process changes
- New deployment targets are added

---

Last Updated: 2026-01-21
