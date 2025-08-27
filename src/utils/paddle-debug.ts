// Paddle Debug Utilities
// This file helps debug Paddle checkout and webhook issues

export interface PaddleCheckoutData {
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
  customer?: {
    email: string;
  };
  custom_data?: {
    userId: string;
    planId: string;
    billingCycle: string;
    source: string;
  };
  success_url?: string;
  cancel_url?: string;
  mode?: string;
}

export interface PaddleWebhookData {
  event_type: string;
  data: {
    subscription_id?: string;
    customer_id?: string;
    items?: Array<any>;
    status?: string;
    custom_data?: {
      userId?: string;
      planId?: string;
      billingCycle?: string;
      source?: string;
    };
    [key: string]: any;
  };
}

export const logPaddleCheckout = (checkoutData: PaddleCheckoutData, user: any) => {
  console.log('🔍 Paddle Checkout Debug Info:');
  console.log('📋 Checkout Data:', JSON.stringify(checkoutData, null, 2));
  console.log('👤 User Info:', {
    id: user?.id,
    email: user?.email,
    email_confirmed_at: user?.email_confirmed_at
  });
  console.log('🔑 Custom Data:', checkoutData.custom_data);
  console.log('📦 Items:', checkoutData.items);
  console.log('🌐 URLs:', {
    success: checkoutData.success_url,
    cancel: checkoutData.cancel_url
  });
};

export const logPaddleWebhook = (webhookData: PaddleWebhookData) => {
  console.log('🔍 Paddle Webhook Debug Info:');
  console.log('📡 Event Type:', webhookData.event_type);
  console.log('📋 Webhook Data:', JSON.stringify(webhookData, null, 2));
  console.log('🔑 Custom Data:', webhookData.data.custom_data);
  console.log('👤 User ID from Custom Data:', webhookData.data.custom_data?.userId);
  console.log('📦 Items:', webhookData.data.items);
  console.log('📊 Status:', webhookData.data.status);
};

export const validatePaddleCheckoutData = (checkoutData: PaddleCheckoutData): string[] => {
  const errors: string[] = [];
  
  if (!checkoutData.items || checkoutData.items.length === 0) {
    errors.push('No items in checkout data');
  }
  
  if (!checkoutData.custom_data?.userId) {
    errors.push('Missing userId in custom_data');
  }
  
  if (!checkoutData.custom_data?.planId) {
    errors.push('Missing planId in custom_data');
  }
  
  if (!checkoutData.custom_data?.billingCycle) {
    errors.push('Missing billingCycle in custom_data');
  }
  
  if (!checkoutData.success_url) {
    errors.push('Missing success_url');
  }
  
  if (!checkoutData.cancel_url) {
    errors.push('Missing cancel_url');
  }
  
  return errors;
};

export const validatePaddleWebhookData = (webhookData: PaddleWebhookData): string[] => {
  const errors: string[] = [];
  
  if (!webhookData.event_type) {
    errors.push('Missing event_type');
  }
  
  if (!webhookData.data) {
    errors.push('Missing webhook data');
  }
  
  if (!webhookData.data.custom_data?.userId) {
    errors.push('Missing userId in webhook custom_data');
  }
  
  return errors;
};

// Function to simulate webhook data for testing
export const createTestWebhookData = (
  eventType: string,
  userId: string,
  planId: string = 'pro',
  billingCycle: string = 'monthly'
): PaddleWebhookData => {
  return {
    event_type: eventType,
    data: {
      subscription_id: 'test_sub_' + Date.now(),
      customer_id: 'test_cust_' + Date.now(),
      items: [
        {
          price_id: 'test_price_' + Date.now(),
          quantity: 1
        }
      ],
      status: 'active',
      custom_data: {
        userId,
        planId,
        billingCycle,
        source: 'centrabudget-web'
      }
    }
  };
};

// Function to check if we're in a test environment
export const isTestEnvironment = (): boolean => {
  return import.meta.env.DEV || 
         import.meta.env.VITE_PADDLE_ENV === 'sandbox' ||
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Function to log environment info
export const logPaddleEnvironment = () => {
  console.log('🔧 Paddle Environment Debug:');
  console.log('🌍 Environment:', import.meta.env.VITE_PADDLE_ENV);
  console.log('🔑 Client Token Set:', !!import.meta.env.VITE_PADDLE_CLIENT_TOKEN);
  console.log('🔑 API Key Set:', !!import.meta.env.VITE_PADDLE_API_KEY);
  console.log('🔑 Webhook Secret Set:', !!import.meta.env.VITE_PADDLE_WEBHOOK_SECRET);
  console.log('📦 Pro Monthly ID:', import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID);
  console.log('📦 Pro Yearly ID:', import.meta.env.VITE_PADDLE_PRO_YEARLY_ID);
  console.log('🧪 Is Test Environment:', isTestEnvironment());
  console.log('🌐 Hostname:', window.location.hostname);
  console.log('🔗 Origin:', window.location.origin);
};
