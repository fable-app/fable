# Quick Start - CI/CD Pipeline

Get the Fable app CI/CD pipeline up and running in 15 minutes.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] Admin access to GitHub repository
- [ ] Expo account created ([expo.dev](https://expo.dev))

## Step 1: Install EAS CLI (2 minutes)

```bash
npm install -g eas-cli
eas login
```

Enter your Expo credentials.

## Step 2: Initialize EAS Project (3 minutes)

```bash
cd /path/to/fable
eas init
```

This generates a project ID. Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "abc123-your-actual-project-id"
      }
    }
  }
}
```

## Step 3: Configure GitHub Secrets (5 minutes)

### Get Expo Token

1. Go to [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)
2. Click "Create Token"
3. Name: "GitHub Actions - Fable"
4. Copy the token

### Add to GitHub

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `EXPO_TOKEN`
4. Value: Paste the token
5. Click **Add secret**

## Step 4: Install Dependencies (2 minutes)

```bash
npm install
```

This installs ESLint, Jest, and other dev dependencies needed for CI.

## Step 5: Test Locally (3 minutes)

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm test
```

Fix any errors that appear.

## Step 6: Test CI/CD Pipeline

### Test PR Checks

1. Create a new branch:
   ```bash
   git checkout -b test-cicd
   ```

2. Make a small change (add a comment)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin test-cicd
   ```

4. Create a Pull Request on GitHub

5. Watch the PR checks run automatically

### Test Preview Build (Optional)

1. Merge the PR to `develop` branch
2. Go to Actions tab
3. Watch "Preview Build" workflow trigger
4. Check EAS dashboard for build progress

## What's Configured

### Workflows Created

- **.github/workflows/pr-checks.yml**
  - Runs on every PR
  - Validates code quality

- **.github/workflows/build-production.yml**
  - Runs on push to `main`
  - Builds production apps

- **.github/workflows/build-preview.yml**
  - Runs on push to `develop`/`staging`
  - Builds preview apps

### Configuration Files

- **eas.json** - Build profiles (development, preview, production)
- **.eslintrc.js** - Linting rules
- **jest.config.js** - Test configuration
- **jest.setup.js** - Test setup

### Scripts Added

- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Check TypeScript types
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Next Steps

### For Development

1. Create feature branches from `develop`
2. PRs automatically run checks
3. Merge to `develop` triggers preview builds

### For Production Release

1. Merge `develop` to `main`
2. Production build automatically triggered
3. Download builds from EAS dashboard
4. Submit to app stores

### Advanced Setup (Later)

For automated app store submissions:

1. Follow [SECRETS_SETUP.md](./SECRETS_SETUP.md)
2. Configure Google Play service account
3. Configure Apple App Store Connect API
4. Enable automated submission workflows

## Troubleshooting

### "Not authenticated with Expo"

- Verify `EXPO_TOKEN` is set correctly in GitHub Secrets
- Token should start with `ey...`
- Regenerate if needed

### "npm ERR!" during workflow

- Check that `package.json` has correct dependencies
- Try running `npm ci` locally
- Clear npm cache: `npm cache clean --force`

### Workflow doesn't trigger

- Check workflow YAML syntax
- Verify branch names match triggers
- Ensure Actions are enabled in repo settings

### Build fails on EAS

- Check EAS dashboard for detailed logs
- Verify `eas.json` and `app.json` are valid JSON
- Ensure all dependencies are in `package.json`

## Documentation

For detailed information, see:

- [EAS_SETUP.md](./EAS_SETUP.md) - Complete EAS setup
- [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) - Full CI/CD documentation
- [SECRETS_SETUP.md](./SECRETS_SETUP.md) - All secrets configuration
- [DEPLOYMENT_MANAGER.md](./DEPLOYMENT_MANAGER.md) - Deployment process

## Support

If you get stuck:

1. Check workflow logs in Actions tab
2. Review [Expo documentation](https://docs.expo.dev)
3. Ask in [Expo forums](https://forums.expo.dev)
4. File an issue in the repository

## Checklist

After completing this guide, you should have:

- [ ] EAS CLI installed and logged in
- [ ] EAS project initialized with project ID
- [ ] `EXPO_TOKEN` configured in GitHub Secrets
- [ ] Dependencies installed locally
- [ ] All npm scripts working (lint, typecheck, test)
- [ ] PR checks workflow tested
- [ ] First successful build on EAS

## What's Next?

**Phase 1 Complete!** You now have:
- Automated PR validation
- Automated builds on merge
- Production-ready CI/CD pipeline

**Phase 2 (Optional):**
- Set up automated app store submission
- Configure OTA (Over-The-Air) updates
- Add monitoring and crash reporting
- Implement staged rollouts

---

**Estimated Setup Time:** 15 minutes
**Last Updated:** 2026-01-21
**Maintained by:** Deployment Manager
