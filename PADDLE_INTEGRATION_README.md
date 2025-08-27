# Paddle Payment Integration for CentraBudget

This document explains how to integrate Paddle payments into your CentraBudget application.

## Overview

Paddle is a payment processor that handles subscriptions, recurring billing, and payment processing. This integration provides:

- Secure checkout for Pro subscriptions
- Support for monthly and yearly billing cycles
- Webhook handling for subscription lifecycle events
- Automatic plan upgrades and downgrades

## Setup Instructions

### 1. Install Dependencies

The Paddle SDK has already been installed:

```bash
npm install @paddle/paddle-js
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```bash
# Paddle Configuration
VITE_PADDLE_ENVIRONMENT=sandbox
VITE_PADDLE_CLIENT_ID=your_paddle_client_id_here
VITE_PADDLE_PRO_MONTHLY_ID=your_pro_monthly_product_id_here
VITE_PADDLE_PRO_YEARLY_ID=your_pro_yearly_product_id_here
VITE_PADDLE_WEBHOOK_ENDPOINT=https://your-domain.com/api/paddle-webhook
```

### 3. Get Paddle Credentials

1. **Sign up for Paddle**: Go to [paddle.com](https://paddle.com) and create an account
2. **Get Client ID**: 
   - Go to Developer Tools > Authentication
   - Copy your public key (Client ID)
3. **Create Products**:
   - Create a monthly subscription product for Pro
   - Create a yearly subscription product for Pro
   - Copy the Product IDs for each

### 4. Test the Integration

1. Start your development server
2. Navigate to the pricing page
3. Click "Upgrade to Pro" on any plan
4. Paddle checkout should open (in sandbox mode)

## How It Works

### Frontend Flow

1. **User clicks upgrade**: User selects a plan and clicks upgrade
2. **Paddle initialization**: Paddle SDK initializes with your credentials
3. **Checkout opens**: Paddle checkout modal opens with plan details
4. **Payment processing**: User enters payment information
5. **Success/redirect**: Paddle redirects to success/cancel URLs

### Backend Webhooks

Paddle sends webhooks to your backend for:
- Subscription creation
- Payment success/failure
- Subscription updates
- Subscription cancellation

## Files Added/Modified

### New Files
- `src/lib/paddle-config.ts` - Paddle configuration and validation
- `src/contexts/PaddleContext.tsx` - React context for Paddle functionality
- `src/lib/paddle-webhook.ts` - Webhook handling utilities
- `PADDLE_ENV_TEMPLATE.md` - Environment variables template

### Modified Files
- `src/App.tsx` - Added PaddleProvider to the app
- `src/pages/Checkout.tsx` - Integrated Paddle checkout
- `src/components/PricingCards.tsx` - Added Paddle upgrade functionality
- `src/pages/Pricing.tsx` - Integrated Paddle checkout

## Usage Examples

### Opening Checkout

```typescript
import { usePaddle } from '@/contexts/PaddleContext';

const { openCheckout, isInitialized } = usePaddle();

const handleUpgrade = async () => {
  if (isInitialized) {
    await openCheckout('pro', 'monthly');
  }
};
```

### Checking Paddle Status

```typescript
const { isInitialized, isLoading, error } = usePaddle();

if (isLoading) {
  return <div>Initializing payment system...</div>;
}

if (error) {
  return <div>Payment system error: {error}</div>;
}
```

## Security Considerations

### Webhook Verification

Always verify webhook signatures before processing:

```typescript
import { verifyWebhookSignature } from '@/lib/paddle-webhook';

// In your backend API
const isValid = verifyWebhookSignature(payload, signature, publicKey);
if (!isValid) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

### Environment Variables

- Never commit `.env.local` to version control
- Use different credentials for sandbox and production
- Rotate credentials regularly

## Testing

### Sandbox Mode

1. Set `VITE_PADDLE_ENVIRONMENT=sandbox`
2. Use Paddle's test card numbers
3. Test various scenarios (success, failure, cancellation)

### Test Cards

Paddle provides test card numbers in their documentation for testing different scenarios.

## Production Deployment

### 1. Update Environment Variables

```bash
VITE_PADDLE_ENVIRONMENT=production
VITE_PADDLE_CLIENT_ID=your_live_client_id
VITE_PADDLE_PRO_MONTHLY_ID=your_live_monthly_product_id
VITE_PADDLE_PRO_YEARLY_ID=your_live_yearly_product_id
```

### 2. Implement Webhook Endpoint

Create a secure HTTPS endpoint to handle Paddle webhooks:

```typescript
// Example: /api/paddle-webhook
app.post('/api/paddle-webhook', async (req, res) => {
  const webhookHandler = new PaddleWebhookHandler();
  await webhookHandler.handleWebhook(req.body);
  res.status(200).json({ success: true });
});
```

### 3. Monitor Webhooks

- Log all webhook events
- Set up alerts for failures
- Monitor subscription status changes

## Troubleshooting

### Common Issues

1. **Paddle not initializing**:
   - Check environment variables
   - Verify client ID is correct
   - Check browser console for errors

2. **Checkout not opening**:
   - Ensure Paddle is initialized
   - Check product IDs are correct
   - Verify user is authenticated

3. **Webhooks not working**:
   - Check webhook endpoint is accessible
   - Verify webhook signature verification
   - Check server logs for errors

### Debug Mode

Enable debug logging by adding to your environment:

```bash
VITE_PADDLE_DEBUG=true
```

## Support

- **Paddle Documentation**: [docs.paddle.com](https://docs.paddle.com)
- **Paddle Support**: [paddle.com/support](https://paddle.com/support)
- **Integration Issues**: Check the browser console and server logs

## Next Steps

1. **Implement webhook endpoint** on your backend
2. **Add subscription management** to user settings
3. **Implement usage tracking** for plan limits
4. **Add analytics** for conversion tracking
5. **Set up email notifications** for subscription events
