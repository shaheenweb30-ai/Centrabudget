#!/bin/bash

echo "🔧 Fixing Infinite Loops in Reports, Categories, and Transactions Pages..."
echo ""

echo "🔄 Stopping development server..."
pkill -f "vite"

echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite

echo "📝 Infinite loop fixes applied:"
echo "   ✅ TransactionContext - Fixed useEffect dependency loop"
echo "   ✅ SettingsContext - Removed location.pathname dependency"
echo "   ✅ App.tsx - Removed console.log spam"
echo "   ✅ Supabase client - Cleaned up logging"
echo ""

echo "🚀 Starting development server..."
npm run dev

echo ""
echo "✅ Infinite loops should now be fixed!"
echo "📊 Check your Reports, Categories, and Transactions pages"
echo "🔍 The console should no longer show rapidly incrementing line numbers"
echo "⚡ Pages should load without infinite re-renders"
