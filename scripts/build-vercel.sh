#!/bin/bash
set -e

# Get script directory and move to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "Building Expo app..."
cd apps/mobile
npm run build:web

echo "Reorganizing for multi-path deployment..."
cd dist

# Create temporary directory
mkdir -p _temp
# Move everything to temp
mv * _temp/ 2>/dev/null || true
# Create app directory
mkdir -p app
# Move from temp to app
mv _temp/* app/
# Clean up
rmdir _temp

echo "Fixing asset paths for /app base URL..."
# Fix all HTML files to use /app prefix for assets
# Use perl for cross-platform compatibility (works on both macOS and Linux)
find app -name "*.html" -type f -exec perl -pi -e 's|href="/(?!app/)|href="/app/|g' {} \;
find app -name "*.html" -type f -exec perl -pi -e 's|src="/(?!app/)|src="/app/|g' {} \;

echo "Copying landing page to root..."
cp ../../../public/index.html ./

echo "Build complete!"
echo "  - Landing page: /"
echo "  - App: /app"
