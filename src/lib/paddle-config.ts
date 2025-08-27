// Paddle configuration for CentraBudget
export const PADDLE_CONFIG = {
  // Environment: 'sandbox' for testing, 'production' for live
  environment: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'production',
  
  // Paddle client ID (public key)
  clientId: import.meta.env.VITE_PADDLE_CLIENT_ID || '',
  
  // Product IDs for different plans
  products: {
    pro: {
      monthly: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID || '',
      yearly: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID || ''
    }
  },
  
  // Webhook endpoint for handling subscription events
  webhookEndpoint: import.meta.env.VITE_PADDLE_WEBHOOK_ENDPOINT || '',
  
  // Success and cancel URLs
  successUrl: `${window.location.origin}/subscription?success=true`,
  cancelUrl: `${window.location.origin}/pricing?canceled=true`
};

// Debug logging for configuration
console.log('Paddle Config:', {
  environment: PADDLE_CONFIG.environment,
  clientId: PADDLE_CONFIG.clientId ? '***' + PADDLE_CONFIG.clientId.slice(-4) : 'NOT_SET',
  products: PADDLE_CONFIG.products,
  webhookEndpoint: PADDLE_CONFIG.webhookEndpoint || 'NOT_SET'
});

// Paddle checkout options
export const PADDLE_CHECKOUT_OPTIONS = {
  theme: 'light',
  locale: 'en',
  successUrl: PADDLE_CONFIG.successUrl,
  cancelUrl: PADDLE_CONFIG.cancelUrl,
  customData: {
    // Add any custom data you want to pass to Paddle
    source: 'centrabudget-web'
  }
};

// Validate Paddle configuration
export const validatePaddleConfig = () => {
  const required = [
    'VITE_PADDLE_ENVIRONMENT',
    'VITE_PADDLE_CLIENT_ID',
    'VITE_PADDLE_PRO_MONTHLY_ID',
    'VITE_PADDLE_PRO_YEARLY_ID'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing Paddle environment variables:', missing);
    return false;
  }
  
  return true;
};
