#!/bin/bash

# Paddle Webhook Setup Script for Supabase Edge Functions
# This script helps you set up the Paddle webhook to fix the 404 error

echo "🚀 Setting up Paddle Webhook for Supabase Edge Functions"
echo "========================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
else
    echo "✅ Supabase CLI found: $(supabase --version)"
fi

# Check if we're in the right directory
if [ ! -d "supabase/functions/paddle-webhook" ]; then
    echo "❌ paddle-webhook function not found in supabase/functions/"
    echo "Please make sure you're in the project root directory"
    exit 1
fi

echo ""
echo "📋 Next steps to complete the setup:"
echo "====================================="

echo ""
echo "1️⃣  Login to Supabase:"
echo "   supabase login"

echo ""
echo "2️⃣  Link your project (using your project ID):"
echo "   supabase link --project-ref rjjflvdxomgyxqgdsewk"

echo ""
echo "3️⃣  Deploy the Edge Function:"
echo "   supabase functions deploy paddle-webhook"

echo ""
echo "4️⃣  Set environment variables (replace with your actual values):"
echo "   supabase secrets set PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret"
echo "   supabase secrets set SUPABASE_URL=https://rjjflvdxomgyxqgdsewk.supabase.co"
echo "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"

echo ""
echo "5️⃣  Your webhook URL will be:"
echo "   https://rjjflvdxomgyxqgdsewk.supabase.co/functions/v1/paddle-webhook"

echo ""
echo "6️⃣  Update Paddle webhook URL in your Paddle dashboard to the URL above"

echo ""
echo "7️⃣  Test the webhook:"
echo "   supabase functions logs paddle-webhook --follow"

echo ""
echo "🔧 Troubleshooting commands:"
echo "============================"
echo "Check function status: supabase functions list"
echo "View logs: supabase functions logs paddle-webhook --follow"
echo "Test function: curl -X POST https://rjjflvdxomgyxqgdsewk.supabase.co/functions/v1/paddle-webhook"
echo "List secrets: supabase secrets list"

echo ""
echo "📚 For detailed instructions, see: DEPLOY_WEBHOOK_GUIDE.md"
echo ""
echo "🎯 This will fix your 404 error and enable automatic user role updates!"
