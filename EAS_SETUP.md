# EAS Setup Guide - Fable App

This guide will help you set up Expo Application Services (EAS) for local development and configure the necessary credentials for building and deploying the Fable language learning app.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An Expo account (create one at [expo.dev](https://expo.dev))
- Git installed and configured
- Access to the Fable GitHub repository

## Step 1: Install EAS CLI

Install the EAS CLI globally on your machine:

```bash
npm install -g eas-cli
```

Verify the installation:

```bash
eas --version
```

## Step 2: Login to Expo

Authenticate with your Expo account:

```bash
eas login
```

Enter your Expo credentials when prompted. If you don't have an account, you can create one with:

```bash
eas register
```

## Step 3: Initialize EAS Project

From the project root directory, initialize EAS:

```bash
cd /path/to/fable
eas init
```

This command will:
- Create a new project in your Expo account
- Generate a unique project ID
- Update your `app.json` with the project ID

**Important:** After running `eas init`, you'll need to update the placeholder in `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id-here"
      }
    }
  }
}
```

Replace `YOUR_EAS_PROJECT_ID` with the actual project ID from the initialization.

## Step 4: Configure Build Credentials

### Android Credentials

EAS can automatically manage Android credentials, or you can provide your own.

#### Option A: Automatic Credential Management (Recommended)

EAS will automatically generate and manage your Android keystore:

```bash
eas build --platform android --profile development
```

Follow the prompts to let EAS generate credentials.

#### Option B: Manual Credential Setup

If you have an existing keystore:

1. Place your keystore file in a secure location (NOT in the repo)
2. Configure credentials:

```bash
eas credentials
```

Select "Android" > "Set up credentials" > "Use existing keystore"

### iOS Credentials

iOS requires an Apple Developer account ($99/year).

#### Setup iOS Credentials

```bash
eas build --platform ios --profile development
```

EAS will guide you through:
1. Logging into your Apple Developer account
2. Generating Distribution Certificate
3. Creating Provisioning Profiles
4. Configuring Push Notification keys (if needed)

**Note:** You'll need to provide your Apple ID and Team ID. Update `eas.json` with these values:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

## Step 5: Test Your First Build

### Development Build

Build a development version to test the configuration:

```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

This will:
- Queue a build on EAS servers
- Install dependencies
- Compile the native app
- Provide a download link when complete

### Check Build Status

Monitor your build progress:

```bash
eas build:list
```

Or visit the EAS dashboard: [expo.dev/accounts/[username]/projects/fable/builds](https://expo.dev)

## Step 6: Environment Variables

The project uses environment-specific configurations. Each build profile has its own environment:

- `development`: `EXPO_PUBLIC_ENV=development`
- `preview`: `EXPO_PUBLIC_ENV=preview`
- `test`: `EXPO_PUBLIC_ENV=test`
- `production`: `EXPO_PUBLIC_ENV=production`

If you need additional secrets (API keys, etc.):

1. Create a `.env` file (NOT committed to git):

```bash
EXPO_PUBLIC_API_KEY=your-api-key
EXPO_PUBLIC_API_URL=https://api.example.com
```

2. Add to `.gitignore`:

```
.env
.env.*
!.env.example
```

3. For CI/CD builds, add secrets to GitHub Actions (see CI_CD_GUIDE.md)

## Step 7: Configure App Store Metadata (Production Only)

### Google Play Store

1. Create an app in Google Play Console
2. Generate a Service Account JSON key
3. Place it at `./secrets/play-store-credentials.json` (NOT in git)
4. Add `secrets/` to `.gitignore`

### Apple App Store Connect

1. Create an app in App Store Connect
2. Note your App ID and Team ID
3. Update `eas.json` with these values

## Build Profiles Overview

The project includes several build profiles configured in `eas.json`:

### `development`
- For local development and testing
- Includes development client
- Internal distribution only
- Debug configuration

### `preview`
- For internal testing and QA
- Release configuration
- Generates APK (Android) for easy distribution
- No app store submission

### `test`
- Similar to preview
- For automated testing
- Separate channel from preview

### `production`
- For app store releases
- Auto-increments build numbers
- Generates App Bundle (Android) and IPA (iOS)
- Optimized and minified

## Common Commands

```bash
# Build for specific profile and platform
eas build --platform android --profile production
eas build --platform ios --profile preview
eas build --platform all --profile production

# List recent builds
eas build:list

# View build details
eas build:view [build-id]

# Cancel a running build
eas build:cancel

# Check project configuration
eas config

# View/manage credentials
eas credentials

# Submit to app stores (after production build)
eas submit --platform android --latest
eas submit --platform ios --latest
```

## Troubleshooting

### Build Fails - Dependency Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Credential Issues (iOS)

```bash
# Reset iOS credentials
eas credentials
# Select iOS > Remove all credentials > Start fresh
```

### Build Timeout

Some builds may take longer. Check:
- EAS dashboard for detailed logs
- Your Expo account's build concurrency limits
- Network issues during dependency installation

### Android Build Fails

Common issues:
- Gradle version conflicts (check `android/build.gradle`)
- Memory issues (EAS provides sufficient memory)
- Missing dependencies (verify `package.json`)

### iOS Build Fails

Common issues:
- Invalid provisioning profiles
- Expired certificates
- CocoaPods issues
- Xcode version compatibility

## Security Best Practices

1. **Never commit credentials:**
   - Add `secrets/` to `.gitignore`
   - Never commit `.env` files with real values
   - Use `.env.example` for documentation only

2. **Rotate credentials regularly:**
   - Update service account keys quarterly
   - Refresh iOS certificates before expiration
   - Update Expo tokens periodically

3. **Use separate credentials for each environment:**
   - Development credentials for testing
   - Production credentials for releases
   - Never use production credentials in development

4. **Secure your Expo account:**
   - Enable two-factor authentication
   - Use a strong, unique password
   - Limit team member access appropriately

## Next Steps

- Review [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) for automated builds
- Configure GitHub Actions secrets (see CI_CD_GUIDE.md)
- Set up monitoring and crash reporting
- Test the complete build and deployment workflow

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo Application Services](https://expo.dev/eas)
- [EAS Build Pricing](https://expo.dev/pricing)

## Support

If you encounter issues:
1. Check the [Expo forums](https://forums.expo.dev/)
2. Review [EAS troubleshooting guide](https://docs.expo.dev/build/troubleshooting/)
3. Contact the development team
4. File an issue in the GitHub repository

---

**Last Updated:** 2026-01-21
**Version:** 1.0
**Maintained by:** Deployment Manager
