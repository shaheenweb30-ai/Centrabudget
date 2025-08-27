# Fix the 404 Error: Deploy Paddle Webhook to Supabase Edge Functions

## The Problem

You're getting a **404 NOT_FOUND** error because:
- Your project is a **Vite/React app**, not Next.js
- The `api/paddle-webhook.ts` file won't work in Vite projects
- Paddle is trying to reach a webhook endpoint that doesn't exist

## The Solution

Use **Supabase Edge Functions** to handle Paddle webhooks. This is the best approach for Vite/React projects.

## Your Project Details

- **Project ID**: `rjjflvdxomgyxqgdsewk`
- **Supabase URL**: `https://rjjflvdxomgyxqgdsewk.supabase.co`
- **Webhook URL**: `https://rjjflvdxomgyxqgdsewk.supabase.co/functions/v1/paddle-webhook`

## Step-by-Step Fix

### Step 1: Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Or use npx
npx supabase --version
```

### Step 2: Login to Supabase

```bash
# Login to your Supabase account
supabase login

# Link your project (using your project ID)
supabase link --project-ref rjjflvdxomgyxqgdsewk
```

### Step 3: Deploy the Edge Function

```bash
# Deploy the paddle-webhook function
supabase functions deploy paddle-webhook

# Or deploy all functions
supabase functions deploy
```

### Step 4: Set Environment Variables

```bash
# Set the required environment variables
supabase secrets set PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret
supabase secrets set SUPABASE_URL=https://rjjflvdxomgyxqgdsewk.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**To get these values:**

1. **PADDLE_WEBHOOK_SECRET**: From your Paddle dashboard → Developer Tools → Webhooks
2. **SUPABASE_URL**: Already set above (`https://rjjflvdxomgyxqgdsewk.supabase.co`)
3. **SUPABASE_SERVICE_ROLE_KEY**: From your Supabase dashboard → Settings → API

### Step 5: Your Webhook URL

After deployment, your webhook URL will be:
```
https://rjjflvdxomgyxqgdsewk.supabase.co/functions/v1/paddle-webhook
```

### Step 6: Update Paddle Webhook URL

1. Go to your **Paddle Dashboard**
2. Navigate to **Developer Tools** → **Webhooks**
3. Update the webhook endpoint to: `https://rjjflvdxomgyxqgdsewk.supabase.co/functions/v1/paddle-webhook`
4. Make sure these events are selected:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.paused`
   - `subscription.resumed`
   - `subscription.payment_succeeded`
   - `subscription.payment_failed`
   - `subscription.payment_refunded`
   - `subscription.activated`
   - `subscription.trialing`

### Step 7: Test the Webhook

1. **Make a test payment** with a free account
2. **Check the Edge Function logs:**
   ```bash
   supabase functions logs paddle-webhook --follow
   ```
3. **Verify the webhook is received** and processed

## Alternative: Quick Test with ngrok (Local Development)

If you want to test locally first:

```bash
# Install ngrok
npm install -g ngrok

# Start your Vite dev server
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL in Paddle webhook temporarily
# Example: https://abc123.ngrok.io/api/paddle-webhook
```

## How It Works

### 1. User Makes Payment
- User completes Paddle checkout
- Paddle sends `subscription.created` webhook
- Webhook extracts `userId` from custom data
- Calls `activate_user_subscription()` function

### 2. Database Function Executes
```sql
-- Function automatically:
-- 1. Creates subscription record
-- 2. Updates user role to 'subscriber' (Pro)
-- 3. Removes any existing trials
-- 4. Sets billing period dates
```

### 3. User Gets Pro Access
- Role changed from 'user' to 'subscriber'
- Access to unlimited features
- Subscription status tracked in database

### 4. Ongoing Management
- Payment failures → status updated to 'past_due'
- Cancellations → role downgraded to 'user' (Free)
- Reactivations → role restored to 'subscriber'

## Webhook Events Handled

| Event | Action | User Role Change |
|-------|--------|------------------|
| `subscription.created` | Activate subscription | `user` → `subscriber` |
| `subscription.activated` | Ensure active status | Maintain `subscriber` |
| `subscription.cancelled` | Cancel subscription | `subscriber` → `user` (at period end) |
| `subscription.payment_succeeded` | Update billing period | Maintain `subscriber` |
| `subscription.payment_failed` | Mark as past due | Maintain `subscriber` |
| `subscription.paused` | Pause subscription | Maintain `subscriber` |
| `subscription.resumed` | Resume subscription | Maintain `subscriber` |

## Testing the Setup

### 1. Test Webhook Locally
```bash
# Use ngrok to test locally
ngrok http 3000

# Update Paddle webhook URL to your ngrok URL
# Test with Paddle's webhook testing tool
```

### 2. Test Database Functions
```sql
-- Test subscription activation
SELECT activate_user_subscription(
  'user-uuid-here',
  'pro',
  'monthly',
  'test_sub_123',
  'test_customer_456'
);

-- Check user role
SELECT u.email, ur.role 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
WHERE u.id = 'user-uuid-here';
```

### 3. Monitor Logs
Check your webhook logs for:
- ✅ Webhook signature verification
- ✅ Event processing
- ✅ Database function calls
- ✅ Role updates

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails:**
   - Check `PADDLE_WEBHOOK_SECRET` environment variable
   - Verify webhook secret in Paddle dashboard

2. **User role not updated:**
   - Check if `userId` is included in checkout custom data
   - Verify database functions exist and are callable
   - Check RLS policies on `user_roles` table

3. **Subscription not created:**
   - Verify `user_subscriptions` table exists
   - Check RLS policies allow service role access
   - Verify function permissions

### Debug Commands

```bash
# Check if subscription functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%subscription%';

# Check user roles
SELECT u.email, ur.role, us.status
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC;

# Check webhook logs in Supabase
# Look for function execution logs
```

## Security Considerations

1. **Webhook Verification:** Always verify Paddle webhook signatures
2. **Service Role:** Use service role key only in webhook handler
3. **RLS Policies:** Ensure proper access control on subscription tables
4. **Input Validation:** Validate all webhook data before processing

## Next Steps

1. **Deploy the webhook** to your production environment
2. **Test with real payments** using Paddle's sandbox
3. **Monitor webhook delivery** in Paddle dashboard
4. **Set up alerts** for webhook failures
5. **Add subscription management UI** for users

## Support

If you encounter issues:
1. Check webhook logs in your API route
2. Verify database function execution
3. Test with Paddle's webhook testing tool
4. Check Supabase function logs

The system is designed to be robust and handle edge cases automatically. Once set up, it will manage user subscriptions seamlessly!
