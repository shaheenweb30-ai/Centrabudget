# 🚀 Paddle Webhook Deployment Guide

## Overview

This guide explains how to deploy the Paddle webhook handler to ensure your payment system works correctly. The webhook is responsible for:

1. **Receiving payment confirmations** from Paddle
2. **Extracting user ID** from custom_data
3. **Updating user subscriptions** in your database
4. **Activating Pro accounts** automatically

## 🔧 Current Implementation Status

### ✅ What's Already Working:
- **Frontend Checkout**: Paddle checkout with user ID in custom_data
- **Webhook Handler**: Complete webhook processing logic
- **Database Functions**: Subscription activation functions
- **Real-Time Updates**: Frontend automatically detects subscription changes

### ⚠️ What Needs Deployment:
- **Webhook Endpoint**: The webhook handler needs to be deployed as a serverless function

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Create a new Vercel project** or add to existing project
2. **Create the webhook file** at `api/paddle-webhook.ts`:

```typescript
// api/paddle-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Paddle webhook secret for verification
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature
    const signature = req.headers['paddle-signature'] as string;
    if (!signature || !PADDLE_WEBHOOK_SECRET) {
      console.error('Missing webhook signature or secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Received Paddle webhook:', event.event_type, event.data);

    // Handle different webhook events
    switch (event.event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      
      case 'subscription.paused':
        await handleSubscriptionPaused(event.data);
        break;
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(event.data);
        break;
      
      case 'subscription.payment_succeeded':
        await handlePaymentSucceeded(event.data);
        break;
      
      case 'subscription.payment_failed':
        await handlePaymentFailed(event.data);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event_type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const { subscription_id, customer_id, items, status, next_billed_at } = data;
    
    // Enhanced logging for debugging
    console.log('🔍 Processing subscription.created webhook:', {
      subscription_id,
      customer_id,
      status,
      custom_data: data.custom_data,
      items: items?.length || 0
    });
    
    // Extract user ID from custom data
    const customData = data.custom_data || {};
    const userId = customData.userId;
    
    console.log('🔍 Extracted user data:', {
      userId,
      planId: customData.planId,
      billingCycle: customData.billingCycle,
      source: customData.source
    });
    
    if (!userId) {
      console.error('❌ No userId in custom data for subscription:', subscription_id);
      console.error('❌ Full custom_data:', customData);
      console.error('❌ Full webhook data:', JSON.stringify(data, null, 2));
      return;
    }

    // Determine plan and billing cycle from items
    const item = items[0];
    const planId = item.price_id.includes('monthly') ? 'pro' : 'pro'; // Adjust based on your price IDs
    const billingCycle = item.price_id.includes('monthly') ? 'monthly' : 'yearly';

    // Activate user subscription
    const { data: result, error } = await supabase.rpc('activate_user_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_billing_cycle: billingCycle,
      p_paddle_subscription_id: subscription_id,
      p_paddle_customer_id: customer_id
    });

    if (error) {
      console.error('Failed to activate subscription:', error);
    } else {
      console.log('Subscription activated successfully:', result);
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// ... other webhook handlers (copy from src/pages/api/paddle-webhook.ts)
```

3. **Set environment variables** in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PADDLE_WEBHOOK_SECRET`

4. **Deploy to Vercel**

### Option 2: Netlify Functions

1. **Create a Netlify project**
2. **Create the function** at `netlify/functions/paddle-webhook.ts`
3. **Set environment variables** in Netlify dashboard
4. **Deploy to Netlify**

### Option 3: AWS Lambda

1. **Create Lambda function**
2. **Upload the webhook code**
3. **Set environment variables**
4. **Configure API Gateway**

## 🔑 Required Environment Variables

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Paddle
PADDLE_WEBHOOK_SECRET=your-webhook-secret
```

## 🌐 Webhook URL Configuration

Once deployed, your webhook URL will be:
- **Vercel**: `https://your-domain.vercel.app/api/paddle-webhook`
- **Netlify**: `https://your-domain.netlify.app/.netlify/functions/paddle-webhook`
- **AWS**: `https://your-api-gateway-url.amazonaws.com/paddle-webhook`

## 📱 Configure Paddle Dashboard

1. **Go to Paddle Dashboard** → Webhooks
2. **Add new webhook** with your deployed URL
3. **Select events** to listen for:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.payment_succeeded`
   - `subscription.payment_failed`

## 🧪 Testing the Webhook

### Test with Paddle Sandbox

1. **Use Paddle sandbox environment**
2. **Make test purchase** with sandbox card
3. **Check webhook logs** in your deployment platform
4. **Verify database updates** in Supabase

### Test Webhook Locally

1. **Use ngrok** to expose local server
2. **Set webhook URL** to ngrok URL temporarily
3. **Make test purchase**
4. **Check local logs**

## 🔍 Debugging Common Issues

### Issue: Webhook not receiving data
- **Check webhook URL** in Paddle dashboard
- **Verify webhook is active** and not paused
- **Check deployment logs** for errors

### Issue: User ID not found in custom_data
- **Verify checkout data** includes custom_data
- **Check Paddle checkout logs** in browser console
- **Ensure user is authenticated** before checkout

### Issue: Database update fails
- **Check Supabase service role key** permissions
- **Verify database functions** exist and are callable
- **Check RLS policies** on user_roles table

## 📊 Monitoring & Logs

### Enable Logging
- **Vercel**: Check function logs in dashboard
- **Netlify**: Check function logs in dashboard
- **AWS**: Check CloudWatch logs

### Key Metrics to Monitor
- **Webhook success rate** (should be 100%)
- **Payment processing time** (should be < 30 seconds)
- **Database update success rate** (should be 100%)
- **Error rates** (should be 0%)

## 🚀 Production Checklist

- [ ] **Webhook deployed** and accessible
- [ ] **Environment variables** configured
- [ ] **Paddle dashboard** webhook URL updated
- [ ] **Database functions** created in Supabase
- [ ] **RLS policies** configured correctly
- [ ] **Service role key** has proper permissions
- [ ] **Webhook secret** configured and secure
- [ ] **Test purchase** completed successfully
- [ ] **User subscription** activated automatically
- **Real-time updates** working on frontend

## 🆘 Troubleshooting

### Webhook Returns 500 Error
1. Check environment variables
2. Verify Supabase connection
3. Check database function permissions
4. Review deployment logs

### User Not Getting Pro Access
1. Verify webhook received data
2. Check custom_data contains userId
3. Verify database function execution
4. Check user_roles table updates

### Frontend Not Updating
1. Verify real-time subscriptions enabled
2. Check useRealtimeSubscription hook
3. Verify Supabase real-time channels
4. Check browser console for errors

## 📞 Support

If you encounter issues:
1. **Check deployment logs** first
2. **Verify environment variables**
3. **Test with Paddle sandbox**
4. **Check Supabase dashboard** for errors
5. **Review this guide** for common solutions

---

## 🎯 Next Steps

1. **Deploy webhook handler** using one of the options above
2. **Configure Paddle dashboard** with webhook URL
3. **Test with sandbox environment**
4. **Verify end-to-end flow** works correctly
5. **Monitor production** for any issues

Your payment system will be fully functional once the webhook is deployed! 🚀
