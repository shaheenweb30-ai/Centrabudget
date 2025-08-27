# Paddle Environment Variables Template

Copy these variables to your `.env.local` file and fill in your actual Paddle values:

```bash
# Paddle Configuration
# Copy this file to .env.local and fill in your actual values

# Paddle Environment (sandbox for testing, production for live)
VITE_PADDLE_ENVIRONMENT=sandbox

# Paddle Client ID (public key from your Paddle dashboard)
VITE_PADDLE_CLIENT_ID=your_paddle_client_id_here

# Paddle Product IDs
VITE_PADDLE_PRO_MONTHLY_ID=your_pro_monthly_product_id_here
VITE_PADDLE_PRO_YEARLY_ID=your_pro_yearly_product_id_here

# Webhook endpoint for handling subscription events
VITE_PADDLE_WEBHOOK_ENDPOINT=https://your-domain.com/api/paddle-webhook
```

## How to Get These Values:

1. **VITE_PADDLE_ENVIRONMENT**: 
   - Use `sandbox` for testing
   - Use `production` for live payments

2. **VITE_PADDLE_CLIENT_ID**: 
   - Found in your Paddle dashboard under "Developer Tools" > "Authentication"
   - This is your public key

3. **VITE_PADDLE_PRO_MONTHLY_ID**: 
   - Create a monthly subscription product in Paddle
   - Copy the Product ID from the product details

4. **VITE_PADDLE_PRO_YEARLY_ID**: 
   - Create a yearly subscription product in Paddle
   - Copy the Product ID from the product details

5. **VITE_PADDLE_WEBHOOK_ENDPOINT**: 
   - Your backend API endpoint that will handle Paddle webhooks
   - This should be a secure HTTPS endpoint
