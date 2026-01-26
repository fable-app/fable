# Secrets Setup Guide - Fable App

This guide walks you through setting up all required secrets and credentials for the Fable app CI/CD pipeline.

## Overview

The CI/CD pipeline requires several secrets to authenticate with Expo and app stores. This guide covers:

1. GitHub repository secrets
2. Expo authentication
3. Android credentials (Google Play)
4. iOS credentials (Apple App Store)

## Prerequisites

Before setting up secrets, ensure you have:

- Admin access to the GitHub repository
- An Expo account (free or paid)
- Google Play Console access (for Android)
- Apple Developer account (for iOS, $99/year)

## GitHub Secrets Configuration

All secrets are configured in: **Repository Settings > Secrets and variables > Actions**

### Step-by-Step:

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret** button
5. Enter secret name and value
6. Click **Add secret**

## Required Secrets

### 1. EXPO_TOKEN (Required)

**Purpose:** Authenticates GitHub Actions with Expo for building apps

**Priority:** HIGH - Required for all builds

**How to generate:**

```bash
# Method 1: Via EAS CLI
eas login
eas build:configure

# Method 2: Via Expo website
# Visit: https://expo.dev/accounts/[your-username]/settings/access-tokens
```

**Steps:**

1. Log in to [expo.dev](https://expo.dev)
2. Navigate to **Account Settings** > **Access Tokens**
3. Click **Create Token**
4. Set token name: `GitHub Actions - Fable`
5. (Optional) Set expiration date
6. Click **Create**
7. **IMPORTANT:** Copy token immediately (shown only once)
8. Add to GitHub Secrets as `EXPO_TOKEN`

**Value format:**
```
ey... (long alphanumeric string)
```

**Security note:** This token has full access to your Expo account. Never commit it to code or share publicly.

### 2. GOOGLE_SERVICE_ACCOUNT_KEY (Optional)

**Purpose:** Allows automated submission of Android builds to Google Play Store

**Priority:** MEDIUM - Only needed for automated Play Store submission

**When needed:** Phase 2 (automated deployments)

**How to generate:**

1. Go to [Google Play Console](https://play.google.com/console)
2. Navigate to **Setup** > **API access**
3. If no service account exists, click **Create new service account**
4. Follow link to Google Cloud Console
5. Click **Create Service Account**
6. Name: `fable-github-actions`
7. Grant role: **Service Account User**
8. Click **Create and continue**
9. Click **Done**
10. Back in Play Console, grant access to the service account
11. Click **Grant access**
12. Under **Permissions**, select:
    - **View app information and download bulk reports**
    - **Create and edit draft releases**
13. Click **Invite user**
14. Return to Google Cloud Console
15. Click on the service account
16. Go to **Keys** tab
17. Click **Add Key** > **Create new key**
18. Select **JSON**
19. Click **Create**
20. JSON file downloads automatically

**Add to GitHub:**

1. Open downloaded JSON file
2. Copy entire contents
3. Add to GitHub Secrets as `GOOGLE_SERVICE_ACCOUNT_KEY`

**Value format:**
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...",
  "client_id": "...",
  ...
}
```

**Security note:** Store the JSON file securely. Never commit it to the repository.

### 3. APPLE_APP_STORE_CONNECT_KEY (Optional)

**Purpose:** Allows automated submission of iOS builds to App Store

**Priority:** MEDIUM - Only needed for automated App Store submission

**When needed:** Phase 2 (automated deployments)

**How to generate:**

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access**
3. Click **Keys** tab (under "Integrations")
4. Click **+** (Generate API Key)
5. Name: `GitHub Actions - Fable`
6. Access: **App Manager** or **Admin**
7. Click **Generate**
8. Download the API key (.p8 file) - **shown only once!**
9. Note the:
   - **Key ID** (e.g., `ABC123DEFG`)
   - **Issuer ID** (UUID at top of page)

**Add to GitHub:**

1. Open downloaded .p8 file in text editor
2. Copy entire contents (including BEGIN/END lines)
3. Add to GitHub Secrets as `APPLE_APP_STORE_CONNECT_KEY`
4. Also add as secrets:
   - `APPLE_KEY_ID`: The Key ID value
   - `APPLE_ISSUER_ID`: The Issuer ID value

**Value format:**
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----
```

**Update eas.json:**

After generating, update `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123DEFG"
      }
    }
  }
}
```

Find these values:
- **appleId**: Your Apple ID email
- **ascAppId**: App ID from App Store Connect > App Information
- **appleTeamId**: Team ID from developer.apple.com > Membership

## Local Secrets (Not in GitHub)

Some secrets are only needed locally, not in CI/CD:

### Create secrets/ directory

```bash
cd /path/to/fable
mkdir secrets
```

### Add to .gitignore

Already configured in `.gitignore`:
```
secrets/
*.json.secret
play-store-credentials.json
```

### Store Play Store credentials locally

If you downloaded the Google service account JSON:

```bash
mv ~/Downloads/play-store-*.json secrets/play-store-credentials.json
```

### Store Apple certificates locally

EAS manages iOS certificates in the cloud, but if you have local certificates:

```bash
# Store in secrets directory
mv ~/Downloads/*.p8 secrets/
mv ~/Downloads/*.p12 secrets/
```

## Verification

### Test EXPO_TOKEN

Create a test workflow run:

```bash
# Via GitHub CLI
gh workflow run build-preview.yml -f platform=android
```

Check Actions tab for success/failure.

### Test locally with EAS

```bash
# Login with token
EXPO_TOKEN=your-token-here eas whoami
```

Should output your Expo username.

## Security Checklist

- [ ] All secrets added to GitHub repository secrets
- [ ] No secrets committed to git
- [ ] `secrets/` directory in `.gitignore`
- [ ] Downloaded credential files stored securely
- [ ] Service account has minimal required permissions
- [ ] Tokens set to expire (if supported)
- [ ] Two-factor authentication enabled on Expo account
- [ ] Two-factor authentication enabled on Apple ID
- [ ] Two-factor authentication enabled on Google account

## Secret Rotation

Rotate secrets periodically for security:

### Quarterly (every 3 months):
- Regenerate `EXPO_TOKEN`
- Rotate Google service account keys
- Verify Apple API key hasn't expired

### Annually:
- Review and remove unused tokens
- Audit access permissions
- Update credentials after team changes

### Immediately if:
- Token is leaked/exposed
- Team member with access leaves
- Security breach suspected

## Troubleshooting

### "Not authenticated with Expo" error

**Cause:** Missing or invalid `EXPO_TOKEN`

**Solution:**
1. Verify secret name is exactly `EXPO_TOKEN` (case-sensitive)
2. Regenerate token: [expo.dev/settings/access-tokens](https://expo.dev)
3. Update GitHub Secret
4. Re-run workflow

### "Failed to authenticate with Google Play" error

**Cause:** Invalid service account JSON

**Solution:**
1. Verify entire JSON was copied (including braces)
2. Check service account has correct permissions
3. Ensure app exists in Play Console
4. Verify service account is linked to the app

### "Failed to authenticate with App Store Connect" error

**Cause:** Invalid Apple API key or missing IDs

**Solution:**
1. Verify .p8 file contents were copied correctly
2. Check `APPLE_KEY_ID` and `APPLE_ISSUER_ID` are set
3. Ensure API key has correct permissions (App Manager or Admin)
4. Verify API key hasn't been revoked

## Next Steps

After configuring secrets:

1. Test with a preview build: `gh workflow run build-preview.yml`
2. Monitor build in Actions tab
3. Check EAS dashboard for build success
4. Proceed with production builds once verified

## Resources

- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [EAS Build Credentials](https://docs.expo.dev/app-signing/app-credentials/)
- [Google Play Service Accounts](https://developers.google.com/android-publisher/getting_started#using_a_service_account)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)

## Support

For issues with secrets configuration:

1. Verify secrets are correctly named (case-sensitive)
2. Check workflow logs for specific error messages
3. Review EAS build logs in Expo dashboard
4. Consult [EAS_SETUP.md](./EAS_SETUP.md) and [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)

---

**Last Updated:** 2026-01-21
**Version:** 1.0
**Maintained by:** Deployment Manager
