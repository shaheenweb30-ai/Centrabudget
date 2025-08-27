# 🚀 Complete Paddle Payment Integration Guide

This guide will walk you through completing the Paddle payment integration for CentraBudget.

## ✅ What's Already Implemented

- **Paddle.js v2 Script Loading** - Loaded from CDN in `index.html`
- **Paddle Context** - Complete React context with initialization and checkout
- **Configuration System** - Environment-based configuration with validation
- **Pricing Page** - Beautiful pricing page with plan selection
- **Checkout Page** - Complete checkout flow with Paddle integration
- **Webhook Handler** - Backend logic for subscription management
- **Subscription Management** - Component for users to manage subscriptions
- **Payment Result Handler** - Success/cancel page handling
- **CSP Headers** - Content Security Policy allows Paddle domains

## 🔧 Steps to Complete Integration

### 1. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Paddle Configuration
VITE_PADDLE_ENVIRONMENT=sandbox
VITE_PADDLE_CLIENT_ID=your_paddle_client_id_here
VITE_PADDLE_PRO_MONTHLY_ID=your_pro_monthly_product_id_here
VITE_PADDLE_PRO_YEARLY_ID=your_pro_yearly_product_id_here
VITE_PADDLE_WEBHOOK_ENDPOINT=https://your-domain.com/api/paddle-webhook
```

### 2. Get Your Paddle Credentials

1. **Sign up for Paddle** at [paddle.com](https://paddle.com)
2. **Create Products** in your Paddle dashboard:
   - Monthly Pro subscription
   - Yearly Pro subscription
3. **Get your Client ID** from Developer Tools > Authentication
4. **Copy Product IDs** from your product details

### 3. Set Up Webhook Endpoint

You need a backend endpoint to handle Paddle webhooks. The webhook handler is already created in `src/lib/paddle-webhook-handler.ts`.

**Example API route (Next.js):**

```typescript
// pages/api/paddle-webhook.ts
import { handlePaddleWebhook } from '@/lib/paddle-webhook-handler';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const result = await handlePaddleWebhook(req.body, supabase);
    
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Example API route (Express):**

```typescript
// routes/paddle-webhook.js
const express = require('express');
const { handlePaddleWebhook } = require('../lib/paddle-webhook-handler');

const router = express.Router();

router.post('/paddle-webhook', async (req, res) => {
  try {
    const result = await handlePaddleWebhook(req.body, supabaseClient);
    
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

### 4. Configure Paddle Webhooks

In your Paddle dashboard:

1. Go to **Developer Tools** > **Webhooks**
2. Add your webhook endpoint: `https://your-domain.com/api/paddle-webhook`
3. Select these events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.paused`
   - `subscription.resumed`
   - `transaction.completed`
   - `transaction.refunded`

### 5. Test the Integration

1. **Set environment to sandbox** (`VITE_PADDLE_ENVIRONMENT=sandbox`)
2. **Use test product IDs** from Paddle sandbox
3. **Test the checkout flow**:
   - Go to `/pricing`
   - Click "Upgrade to Pro"
   - Complete checkout with test card
   - Verify webhook receives events
   - Check subscription status updates

### 6. Database Schema Requirements

Ensure your database has these tables:

```sql
-- User plans table
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  subscription_id TEXT,
  paddle_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (optional)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  paddle_transaction_id TEXT UNIQUE,
  amount DECIMAL(10,2),
  currency TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🧪 Testing

### Test Cards (Sandbox)

- **Visa**: 4000 0000 0000 0002
- **Mastercard**: 5555 5555 5555 4444
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test Scenarios

1. **Successful Payment**
   - Complete checkout with valid card
   - Verify webhook receives `subscription.created`
   - Check user plan status updates

2. **Failed Payment**
   - Use declined card (4000 0000 0000 0002)
   - Verify error handling

3. **Subscription Cancellation**
   - Cancel subscription via Paddle dashboard
   - Verify webhook receives `subscription.cancelled`
   - Check user plan status updates

## 🚀 Production Deployment

1. **Update environment variables**:
   - Set `VITE_PADDLE_ENVIRONMENT=production`
   - Use production product IDs
   - Update webhook endpoint to production URL

2. **Implement webhook signature verification**:
   ```typescript
   // Update verifyWebhookSignature function
   export const verifyWebhookSignature = (
     body: string,
     signature: string,
     webhookSecret: string
   ): boolean => {
     const crypto = require('crypto');
     const expectedSignature = crypto
       .createHmac('sha256', webhookSecret)
       .update(body)
       .digest('hex');
     
     return crypto.timingSafeEqual(
       Buffer.from(signature),
       Buffer.from(expectedSignature)
     );
   };
   ```

3. **Set up monitoring** for webhook failures
4. **Test thoroughly** in production environment

## 🔒 Security Considerations

1. **Webhook Signature Verification** - Always verify webhook signatures
2. **HTTPS Only** - Use HTTPS for all webhook endpoints
3. **Rate Limiting** - Implement rate limiting on webhook endpoints
4. **Input Validation** - Validate all webhook data before processing
5. **Error Handling** - Log errors but don't expose sensitive information

## 📱 Mobile Considerations

The Paddle checkout is mobile-responsive by default. Paddle handles:
- Mobile-optimized checkout forms
- Touch-friendly interfaces
- Responsive design for all screen sizes

## 🎯 Next Steps

1. **Complete environment setup** with your Paddle credentials
2. **Set up webhook endpoint** on your backend
3. **Test thoroughly** in sandbox mode
4. **Deploy to production** when ready
5. **Monitor webhooks** and user subscriptions
6. **Implement additional features** like:
   - Subscription upgrades/downgrades
   - Prorated billing
   - Custom pricing tiers
   - Affiliate system

## 🆘 Troubleshooting

### Common Issues

1. **Paddle not initializing**:
   - Check CSP headers in `index.html`
   - Verify Paddle script is loading
   - Check browser console for errors

2. **Webhook not receiving events**:
   - Verify webhook URL is accessible
   - Check webhook configuration in Paddle dashboard
   - Test webhook endpoint manually

3. **Checkout not opening**:
   - Verify Paddle is initialized
   - Check product IDs are correct
   - Ensure user is authenticated

### Debug Mode

Enable debug logging by checking browser console for Paddle-related messages. The context includes extensive logging for troubleshooting.

## 📞 Support

- **Paddle Documentation**: [docs.paddle.com](https://docs.paddle.com)
- **Paddle Support**: Available in your dashboard
- **Community**: Check Paddle community forums

---

**🎉 Congratulations!** You now have a complete Paddle payment integration for CentraBudget. The system handles subscriptions, webhooks, and user management automatically.
