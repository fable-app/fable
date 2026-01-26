# CI/CD Setup Checklist

Use this checklist to set up and verify the CI/CD pipeline for Fable.

## Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git configured (`git --version`)
- [ ] Admin access to GitHub repository
- [ ] Expo account created at [expo.dev](https://expo.dev)

## Phase 1: Installation (5 minutes)

- [ ] **Install EAS CLI globally**
  ```bash
  npm install -g eas-cli
  ```

- [ ] **Verify EAS installation**
  ```bash
  eas --version
  ```

- [ ] **Login to Expo**
  ```bash
  eas login
  ```

- [ ] **Install project dependencies**
  ```bash
  cd /Users/Anbu/Desktop/repo/fable
  npm install
  ```

## Phase 2: EAS Configuration (5 minutes)

- [ ] **Initialize EAS project**
  ```bash
  eas init
  ```

- [ ] **Copy the generated project ID**
  - EAS will display: `Created project with ID: abc123...`

- [ ] **Update app.json with project ID**
  - Open `/Users/Anbu/Desktop/repo/fable/app.json`
  - Replace `YOUR_EAS_PROJECT_ID` with actual ID
  - Example:
    ```json
    "extra": {
      "eas": {
        "projectId": "abc123def456"
      }
    }
    ```

- [ ] **Commit the change**
  ```bash
  git add app.json
  git commit -m "Add EAS project ID"
  ```

## Phase 3: GitHub Secrets (5 minutes)

- [ ] **Generate Expo token**
  - Visit: https://expo.dev/accounts/[username]/settings/access-tokens
  - Click "Create Token"
  - Name: "GitHub Actions - Fable"
  - Copy the token (starts with `ey...`)

- [ ] **Add token to GitHub Secrets**
  - Go to repository on GitHub
  - Click: Settings > Secrets and variables > Actions
  - Click: "New repository secret"
  - Name: `EXPO_TOKEN`
  - Value: Paste token
  - Click: "Add secret"

## Phase 4: Local Testing (5 minutes)

- [ ] **Run linter**
  ```bash
  npm run lint
  ```
  - Fix any errors that appear

- [ ] **Run type checker**
  ```bash
  npm run typecheck
  ```
  - Fix any errors that appear

- [ ] **Run tests**
  ```bash
  npm run test
  ```
  - Should pass (with no tests initially)

- [ ] **Verify EAS authentication**
  ```bash
  eas whoami
  ```
  - Should display your username

## Phase 5: CI/CD Testing (10 minutes)

- [ ] **Create test branch**
  ```bash
  git checkout -b test-cicd-pipeline
  ```

- [ ] **Make a small test change**
  - Add a comment to any file
  - Or update README.md

- [ ] **Commit and push**
  ```bash
  git add .
  git commit -m "Test: Verify CI/CD pipeline"
  git push origin test-cicd-pipeline
  ```

- [ ] **Create Pull Request on GitHub**
  - Go to repository on GitHub
  - Click "Pull requests" > "New pull request"
  - Select `test-cicd-pipeline` branch
  - Click "Create pull request"

- [ ] **Verify PR checks run**
  - Wait for checks to start (1-2 minutes)
  - All checks should pass:
    - ✓ lint
    - ✓ typecheck
    - ✓ test
    - ✓ validate-config

- [ ] **Merge or close test PR**
  - Can merge to test build workflow
  - Or close if just testing checks

## Phase 6: First Build (Optional, 15-20 minutes)

- [ ] **Trigger preview build manually**
  - Go to Actions tab
  - Select "Preview Build" workflow
  - Click "Run workflow"
  - Select branch: `main`
  - Select platform: `android`
  - Click "Run workflow"

- [ ] **Monitor build progress**
  - Watch workflow run in Actions tab
  - Or check EAS dashboard at expo.dev

- [ ] **Verify build completes successfully**
  - Check for green checkmark in Actions
  - Download APK from EAS dashboard (if needed)

## Phase 7: Optional Enhancements

- [ ] **Configure branch protection**
  - Settings > Branches > Add rule
  - Branch name: `main`
  - ☑ Require status checks to pass
  - Select: lint, typecheck, test, validate-config
  - Click "Create"

- [ ] **Set up Google Play credentials** (for Android submission)
  - See: SECRETS_SETUP.md
  - Skip if not deploying yet

- [ ] **Set up Apple credentials** (for iOS submission)
  - See: SECRETS_SETUP.md
  - Skip if not deploying yet

- [ ] **Update eas.json with Apple IDs**
  - Add real values for:
    - appleId
    - ascAppId
    - appleTeamId
  - Skip if not deploying yet

## Verification

After completing the checklist:

- [ ] ✓ EAS CLI installed and authenticated
- [ ] ✓ Project has EAS project ID
- [ ] ✓ GitHub Secret `EXPO_TOKEN` configured
- [ ] ✓ All npm scripts work locally
- [ ] ✓ PR checks workflow tested and passing
- [ ] ✓ Documentation reviewed

## Troubleshooting

### EAS Login Issues
```bash
# If login fails, try:
eas logout
eas login
```

### NPM Install Issues
```bash
# If npm install fails, try:
rm -rf node_modules package-lock.json
npm install
```

### GitHub Actions Not Triggering
- Verify workflow files in `.github/workflows/`
- Check Actions are enabled: Settings > Actions > General
- Ensure YAML files are valid

### Build Fails on EAS
- Check EAS dashboard for detailed logs
- Verify `eas.json` is valid JSON
- Ensure all dependencies in `package.json`

## Next Steps

After setup is complete:

1. **Read the documentation:**
   - Start with: QUICK_START_CICD.md
   - Detailed guide: CI_CD_GUIDE.md
   - Secrets setup: SECRETS_SETUP.md

2. **Test the workflow:**
   - Create feature branch
   - Make changes
   - Submit PR
   - Verify checks pass
   - Merge to trigger builds

3. **Plan Phase 2:**
   - Review DEPLOYMENT_MANAGER.md
   - Plan automated submissions
   - Set up monitoring

## Support

If you get stuck:
- Check PHASE1_IMPLEMENTATION_SUMMARY.md
- Review CI_CD_GUIDE.md troubleshooting section
- Check Expo forums: https://forums.expo.dev
- File issue in repository

---

**Checklist Version:** 1.0
**Last Updated:** 2026-01-21
**Estimated Time:** 30 minutes total
