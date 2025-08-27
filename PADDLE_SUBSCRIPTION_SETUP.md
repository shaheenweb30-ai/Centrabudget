# Paddle Subscription Setup with Supabase User Role Management

## Overview

This guide shows you how to set up automatic user role updates when Paddle payments are successful. The system automatically:

- ✅ Promotes users to Pro (subscriber role) when payment succeeds
- ✅ Downgrades users to Free (user role) when subscription is cancelled
- ✅ Handles all Paddle webhook events automatically
- ✅ Maintains subscription status in Supabase
- ✅ Updates user permissions in real-time

## What You Need

1. **Paddle Account** with webhook access
2. **Supabase Project** with service role key
3. **Next.js API Route** for webhook handling
4. **Database Functions** for role management

## Setup Steps

### Step 1: Create Database Tables and Functions

Run these SQL scripts in your Supabase SQL editor:

1. **Create user_subscriptions table:**
   ```sql
   -- Run: create_user_subscriptions_table.sql
   ```

2. **Create subscription functions:**
   ```sql
   -- Run: create_subscription_functions.sql
   ```

3. **Fix missing user roles (if needed):**
   ```sql
   -- Run: fix_missing_user_roles.sql
   ```

### Step 2: Configure Paddle Webhook

1. **In your Paddle dashboard:**
   - Go to Developer Tools → Webhooks
   - Add webhook endpoint: `https://yourdomain.com/api/paddle-webhook`
   - Select these events:
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

2. **Copy the webhook secret** and add it to your environment variables

### Step 3: Environment Variables

Add these to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paddle
PADDLE_WEBHOOK_SECRET=your_webhook_secret
```

### Step 4: Update Your Paddle Checkout

When creating the checkout, include the user ID in custom data:

```typescript
// In your checkout component
const checkout = await paddle.Checkout.open({
  items: [{
    priceId: 'pro_monthly', // or your actual price ID
    quantity: 1
  }],
  customData: {
    userId: user.id, // This is crucial for webhook processing
    planId: 'pro',
    billingCycle: 'monthly'
  },
  successUrl: `${window.location.origin}/dashboard?success=true`,
  closeOnSuccess: true
});
```

### Step 5: Deploy the Webhook

Replace your existing `api/paddle-webhook.ts` with the enhanced version:

```typescript
// Use: enhanced_paddle_webhook.ts
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

```sql
-- Check if subscription functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%subscription%';

-- Check user roles
SELECT u.email, ur.role, us.status
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC;

-- Check webhook logs in Supabase
-- Look for function execution logs
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
