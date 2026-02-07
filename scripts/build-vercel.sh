#!/bin/bash
set -e

# Get script directory and move to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "Building Expo app..."
cd apps/mobile
npm run build:web

echo "Adding landing page at /l/..."
cd dist
mkdir -p l
cp ../../../public/index.html l/

echo "Build complete!"
echo "  - App: / (root)"
echo "  - Landing page: /l/"
