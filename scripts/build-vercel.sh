#!/bin/bash
set -e

# Get script directory and move to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "Building Expo app..."
cd apps/mobile
npm run build:web

echo "Building SDK Demo..."
cd ../../examples/sdk-demo
npm install
npm run build:web

echo "Organizing build outputs..."
cd ../../apps/mobile/dist

# Add landing page at /l/
mkdir -p l
cp ../../../public/index.html l/

# Add SDK demo at /sdk-demo/
mkdir -p sdk-demo
if [ -d "../../../examples/sdk-demo/dist" ]; then
  cp -r ../../../examples/sdk-demo/dist/* sdk-demo/
else
  echo "Warning: SDK demo build not found at expected location"
fi

echo "Build complete!"
echo "  - App: / (root)"
echo "  - Landing page: /l/"
echo "  - SDK Demo: /sdk-demo/"
