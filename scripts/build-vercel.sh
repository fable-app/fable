#!/bin/bash
set -e

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

echo "Copying landing page to root..."
cp ../../../docs/index.html ./

echo "Build complete!"
echo "  - Landing page: /"
echo "  - App: /app"
