# Paddle Environment Variables Setup

## 📝 Create `.env.local` file

Create a `.env.local` file in your project root with the following variables:

```bash
# Paddle Configuration
VITE_PADDLE_ENV=sandbox
VITE_PADDLE_CLIENT_TOKEN=your_client_token_here
VITE_PADDLE_API_KEY=your_api_key_here
VITE_PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
VITE_PADDLE_PRO_MONTHLY_ID=your_pro_monthly_product_id
VITE_PADDLE_PRO_YEARLY_ID=your_pro_yearly_product_id
```

## 🔑 How to Get Your Paddle Credentials

### 1. **VITE_PADDLE_ENV**
- Set to `sandbox` for testing
- Set to `production` for production

### 2. **VITE_PADDLE_CLIENT_TOKEN**
- Go to Paddle Dashboard → Developer Tools → Authentication
- Copy the "Client Side Token" (starts with `test_` for sandbox, `live_` for production)

### 3. **VITE_PADDLE_API_KEY**
- Go to Paddle Dashboard → Developer Tools → Authentication
- Copy the "API Key" (starts with `test_` for sandbox, `live_` for production)

### 4. **VITE_PADDLE_WEBHOOK_SECRET**
- Go to Paddle Dashboard → Developer Tools → Webhooks
- Create a new webhook endpoint
- Copy the "Endpoint Secret Key"

### 5. **VITE_PADDLE_PRO_MONTHLY_ID**
- Go to Paddle Dashboard → Catalog → Products
- Find your Pro Monthly product
- Copy the Product ID

### 6. **VITE_PADDLE_PRO_YEARLY_ID**
- Go to Paddle Dashboard → Catalog → Products
- Find your Pro Yearly product
- Copy the Product ID

## 🚀 Next Steps

1. **Create Products in Paddle Dashboard**
   - Create a "Pro Monthly" product
   - Create a "Pro Yearly" product
   - Note down the Product IDs

2. **Set Environment Variables**
   - Create `.env.local` file with all the variables above
   - Replace placeholder values with your actual Paddle credentials

3. **Test the Integration**
   - Run `npm run dev`
   - Go to `/pricing` page
   - Try upgrading to Pro plan

## ⚠️ Important Notes

- **Never commit `.env.local` to version control**
- **Use sandbox environment for testing**
- **Switch to live environment only when ready for production**
- **Test webhook endpoints thoroughly before going live**

## 🔧 Troubleshooting

If you encounter issues:

1. Check browser console for Paddle initialization logs
2. Verify all environment variables are set correctly
3. Ensure Paddle.js is loading from CDN
4. Check CSP headers allow Paddle domains
5. Verify product IDs match your Paddle dashboard
