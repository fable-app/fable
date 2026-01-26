# Google Play Store Deployment Setup

This guide walks you through setting up automated deployments to the Google Play Store via GitHub Actions.

## Prerequisites

- ✅ Google Play Developer account ($25 one-time fee)
- ✅ App created in Google Play Console
- ✅ EAS CLI configured with Android credentials
- ✅ EXPO_TOKEN configured in GitHub Secrets

## Step 1: Create Google Play Service Account

### 1.1: Access Google Play Console API Settings

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create it if not done yet)
3. Navigate to **Setup** → **API access** (in left sidebar)

### 1.2: Create Service Account

1. Click **Create new service account**
2. You'll be redirected to Google Cloud Console
3. In Google Cloud Console:
   - Click **+ Create Service Account**
   - **Service account name:** `fable-github-actions`
   - **Service account ID:** `fable-github-actions` (auto-filled)
   - **Description:** `Service account for automated Play Store deployments`
   - Click **Create and Continue**

### 1.3: Grant Permissions (Skip for Now)

- Skip the optional steps
- Click **Done**

### 1.4: Create Service Account Key

1. In the service accounts list, click on the newly created account
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create**
6. A JSON file will download automatically - **Keep this file secure!**

### 1.5: Grant Access in Play Console

1. Return to Google Play Console → **Setup** → **API access**
2. You should see your new service account listed
3. Click **Grant access** next to the service account
4. Under **Account permissions**, select:
   - ☑️ **View app information and download bulk reports (read-only)**
   - ☑️ **Create and edit draft releases**
   - ☑️ **Release to production, exclude devices, and use Play App Signing**
   - ☑️ **Release apps to testing tracks**
5. Under **Release tab** → Select your app
6. Click **Invite user**

**Note:** It may take a few minutes for permissions to propagate.

---

## Step 2: Configure GitHub Secrets

### 2.1: Add Google Service Account Key

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Create secret:
   - **Name:** `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value:** Paste the **entire contents** of the JSON file you downloaded
   - Click **Add secret**

### 2.2: Verify EXPO_TOKEN Exists

Make sure you already have the `EXPO_TOKEN` secret configured:
- Check in **Settings** → **Secrets and variables** → **Actions**
- If missing, create it with your Expo access token

---

## Step 3: Configure EAS Submit

### 3.1: Update eas.json

The `eas.json` file should already have the submit configuration:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./secrets/play-store-credentials.json",
        "track": "internal"
      }
    }
  }
}
```

**Track options:**
- `internal` - Internal testing (fastest approval, up to 100 testers)
- `alpha` - Closed testing
- `beta` - Open testing
- `production` - Production release (requires manual review)

### 3.2: Test Submission Locally (Optional)

Before using GitHub Actions, you can test submission locally:

```bash
cd apps/mobile

# Create secrets directory
mkdir -p secrets

# Copy your service account key
cp ~/Downloads/your-service-account-key.json secrets/play-store-credentials.json

# Submit latest build
npx eas submit --platform android --latest

# Clean up
rm -rf secrets/
```

---

## Step 4: Trigger Deployment

### Option A: Manual Deployment via GitHub UI

1. Go to **Actions** tab in your repository
2. Select **Production Build** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

### Option B: Automatic Deployment on Push

The workflow automatically triggers on:
- Push to `main` branch
- Version tags (e.g., `v1.0.0`)

```bash
# Tag a release
git tag v1.0.1
git push origin v1.0.1

# Or push to main
git push origin main
```

---

## Step 5: Monitor Deployment

### GitHub Actions

1. Go to **Actions** tab
2. Click on the running workflow
3. Monitor the jobs:
   - **Build Android Production** - Builds the .aab file
   - **Submit to Google Play Store** - Submits to Play Store
   - **Notify Deployment Status** - Final status

### Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to **Release** → **Production** (or your selected track)
4. You should see your submission listed

---

## Troubleshooting

### Error: "The caller does not have permission"

**Solution:** Wait 5-10 minutes after granting access. Permissions take time to propagate.

### Error: "Package not found"

**Solution:** You need to manually upload the first version to Play Console before automated submissions work.

1. Download the `.aab` file from your first EAS build
2. Manually upload it via Play Console
3. After the first version is published, automated submissions will work

### Error: "Track not found"

**Solution:** Change the `track` in `eas.json` to a valid track. Internal testing is recommended for first submissions.

### Submission Stuck or Times Out

**Solution:**
- Check EAS build status: `npx eas build:list`
- Check submission status: `npx eas submit:list`
- Review logs in GitHub Actions

---

## Security Best Practices

✅ **Never commit the service account JSON file to git**
✅ **Use GitHub Secrets for sensitive credentials**
✅ **Clean up credentials after use (workflow does this automatically)**
✅ **Restrict service account permissions to minimum required**
✅ **Rotate service account keys periodically (annually)**

---

## Production Checklist

Before deploying to production track:

- [ ] App tested thoroughly on internal/alpha/beta tracks
- [ ] All Google Play Console requirements met:
  - [ ] Privacy policy URL
  - [ ] App content rating
  - [ ] Target audience set
  - [ ] Data safety form completed
- [ ] Store listing complete:
  - [ ] Screenshots (at least 2)
  - [ ] Feature graphic
  - [ ] App description
  - [ ] App icon
- [ ] Version code incremented
- [ ] Release notes written

---

## Manual Deployment (Without GitHub Actions)

If you prefer manual deployment:

```bash
cd apps/mobile

# Build for production
npx eas build --platform android --profile production

# Wait for build to complete, then submit
npx eas submit --platform android --latest
```

---

## Next Steps

After successful submission:

1. **Internal Testing** - Share with internal testers via email
2. **Closed Testing** - Expand to closed alpha/beta testers
3. **Production** - Submit for production review (3-7 days)

For more details, see the [DEPLOYMENT_RUNBOOK.md](../../DEPLOYMENT_RUNBOOK.md).

---

Last Updated: 2026-01-26
