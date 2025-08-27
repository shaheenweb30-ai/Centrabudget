// Paddle Configuration for CentraBudget v2 API
export const PADDLE_CONFIG = {
  // Environment: 'sandbox' for testing, 'production' for production
  environment: import.meta.env.VITE_PADDLE_ENV || 'sandbox',
  
  // Paddle client token (public key)
  clientToken: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || '',
  
  // Paddle API key (server-side)
  apiKey: import.meta.env.VITE_PADDLE_API_KEY || '',
  
  // Webhook secret for verification
  webhookSecret: import.meta.env.VITE_PADDLE_WEBHOOK_SECRET || '',
  
  // Product IDs - you'll need to replace these with your actual Paddle product IDs
  // Note: Paddle v2 uses price IDs (ppri_*) for checkout, not product IDs (pri_*)
  products: {
    pro: {
      monthly: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID || 'pro_monthly_placeholder',
      yearly: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID || 'pro_yearly_placeholder'
    }
  },
  
  // Success and cancel URLs
  successUrl: typeof window !== 'undefined' ? `${window.location.origin}/payment-success` : '',
  cancelUrl: typeof window !== 'undefined' ? `${window.location.origin}/pricing?canceled=true` : '',
  // Default checkout URL
  checkoutUrl: typeof window !== 'undefined' ? `${window.location.origin}/pricing` : ''
};

// Debug logging for configuration
console.log('🔧 Paddle Config Loading...');
console.log('Paddle Config:', {
  environment: PADDLE_CONFIG.environment,
  clientToken: PADDLE_CONFIG.clientToken ? '***' + PADDLE_CONFIG.clientToken.slice(-4) : 'NOT_SET',
  apiKey: PADDLE_CONFIG.apiKey ? '***' + PADDLE_CONFIG.apiKey.slice(-4) : 'NOT_SET',
  webhookSecret: PADDLE_CONFIG.webhookSecret ? 'SET' : 'NOT_SET',
  products: PADDLE_CONFIG.products
});

// Additional debugging for environment variables
console.log('🔍 Raw Environment Variables:', {
  VITE_PADDLE_ENV: import.meta.env.VITE_PADDLE_ENV,
  VITE_PADDLE_CLIENT_TOKEN: import.meta.env.VITE_PADDLE_CLIENT_TOKEN ? 'SET' : 'NOT_SET',
  VITE_PADDLE_API_KEY: import.meta.env.VITE_PADDLE_API_KEY ? 'SET' : 'NOT_SET',
  VITE_PADDLE_WEBHOOK_SECRET: import.meta.env.VITE_PADDLE_WEBHOOK_SECRET ? 'SET' : 'NOT_SET',
  VITE_PADDLE_PRO_MONTHLY_ID: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID,
  VITE_PADDLE_PRO_YEARLY_ID: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID
});

// Check if environment variables are loaded
console.log('🔍 Environment Variables Check:', {
  VITE_PADDLE_ENV: import.meta.env.VITE_PADDLE_ENV,
  VITE_PADDLE_CLIENT_TOKEN: import.meta.env.VITE_PADDLE_CLIENT_TOKEN ? 'SET' : 'NOT_SET',
  VITE_PADDLE_API_KEY: import.meta.env.VITE_PADDLE_API_KEY ? 'SET' : 'NOT_SET',
  VITE_PADDLE_WEBHOOK_SECRET: import.meta.env.VITE_PADDLE_WEBHOOK_SECRET ? 'SET' : 'NOT_SET',
  VITE_PADDLE_PRO_MONTHLY_ID: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID ? 'SET' : 'NOT_SET',
  VITE_PADDLE_PRO_YEARLY_ID: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID ? 'SET' : 'NOT_SET'
});

// Validate Paddle configuration
export const validatePaddleConfig = () => {
  // For testing, only require the essential variables
  const required = [
    'VITE_PADDLE_ENV',
    'VITE_PADDLE_CLIENT_TOKEN'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing Paddle environment variables:', missing);
    return false;
  }
  
  // Check if product IDs are set (warn but don't fail)
  const productIds = [
    'VITE_PADDLE_PRO_MONTHLY_ID',
    'VITE_PADDLE_PRO_YEARLY_ID'
  ];
  
  const missingProductIds = productIds.filter(key => !import.meta.env[key]);
  if (missingProductIds.length > 0) {
    console.warn('⚠️ Missing product IDs (checkout will use placeholders):', missingProductIds);
  }
  
  return true;
};

console.log('✅ Paddle config loaded successfully!');
