#!/usr/bin/env bash
# Script to test the documentation website locally

set -e

echo "🔨 Building documentation website..."
bash scripts/build-website.sh

echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Website files are in: website/"
echo ""
echo "🌐 Starting local server at http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd website
python3 -m http.server 8000
