#!/bin/bash
set -e

# Get script directory and move to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "Installing workspace dependencies..."
npm install

echo "Building Expo app..."
cd apps/mobile
npm run build:web

echo "Building SDK Demo..."
cd ../../examples/sdk-demo
npm run build:web

echo "Organizing build outputs..."
cd ../../apps/mobile/dist

# Add landing page at /l/
mkdir -p l
cp ../../../public/index.html l/

# Add SDK demo at /sdk-demo/
# expo export outputs to dist/ directory
mkdir -p sdk-demo
if [ -d "../../../examples/sdk-demo/dist" ]; then
  cp -r ../../../examples/sdk-demo/dist/* sdk-demo/
else
  echo "Warning: SDK demo build not found at expected location"
  echo "Checking for alternative locations..."
  ls -la ../../../examples/sdk-demo/ || true
fi

echo "Build complete!"
echo "  - App: / (root)"
echo "  - Landing page: /l/"
echo "  - SDK Demo: /sdk-demo/"
