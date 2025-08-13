#!/bin/bash

echo "🔄 Stopping development server..."
pkill -f "vite"

echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting development server with new CSP configuration..."
npm run dev

echo "✅ Development server restarted with updated CSP settings!"
echo "📝 If you still see CSP errors, check the console for specific details."
