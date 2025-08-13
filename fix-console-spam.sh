#!/bin/bash

echo "🔧 Fixing Console Spam Issue..."
echo ""

echo "🔄 Stopping development server..."
pkill -f "vite"

echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite

echo "📝 Console.log statements removed from:"
echo "   - src/App.tsx"
echo "   - src/integrations/supabase/client.ts"
echo ""

echo "🚀 Starting development server..."
npm run dev

echo ""
echo "✅ Console spam should now be fixed!"
echo "📊 Check your browser console - the line numbers should stop incrementing rapidly"
