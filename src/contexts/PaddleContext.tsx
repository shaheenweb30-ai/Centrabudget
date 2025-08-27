import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PADDLE_CONFIG, validatePaddleConfig } from '@/lib/paddle-config';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  logPaddleCheckout, 
  validatePaddleCheckoutData, 
  logPaddleEnvironment,
  type PaddleCheckoutData 
} from '@/utils/paddle-debug';

// Declare Paddle v2 types globally since we're loading from CDN
declare global {
  interface Window {
    Paddle: {
      Environment: {
        set: (environment: 'sandbox' | 'production') => void;
      };
      Initialize: (config: { token: string }) => void;
      Checkout: {
        open: (checkoutData: any) => Promise<any>;
      };
    };
  }
}

interface PaddleContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  openCheckout: (planId: string, billingCycle: 'monthly' | 'yearly') => Promise<void>;
  getSubscriptionStatus: () => Promise<any>;
  cancelSubscription: () => Promise<void>;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
};

export const PaddleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simple render counter
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  
  console.log(`🔄 PaddleProvider render #${renderCount.current}`);

  console.log('🔄 PaddleProvider mounted');
  console.log('🔧 Testing Paddle config import:', {
    PADDLE_CONFIG: !!PADDLE_CONFIG,
    validatePaddleConfig: typeof validatePaddleConfig,
    configValues: PADDLE_CONFIG
  });

  // Initialize Paddle
  useEffect(() => {
    const initPaddle = async () => {
      try {
        console.log('🚀 Starting Paddle initialization...');
        setIsLoading(true);
        setError(null);

        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          throw new Error('Paddle can only be initialized in a browser environment');
        }
        console.log('✅ Browser environment check passed');

        // Wait for Paddle.js to load from CDN
        let attempts = 0;
        const maxAttempts = 50; // Wait up to 5 seconds
        
        while (!window.Paddle && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Paddle) {
          console.warn('⚠️ Paddle.js failed to load from primary CDN, trying fallback...');
          // Try to load from fallback CDN
          const script = document.createElement('script');
          script.src = 'https://sandbox-cdn.paddle.com/paddle/v2/paddle.js';
          script.async = true;
          document.head.appendChild(script);
          
          // Wait for fallback to load
          let fallbackAttempts = 0;
          while (!window.Paddle && fallbackAttempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            fallbackAttempts++;
          }
          
          if (!window.Paddle) {
            throw new Error('Paddle.js failed to load from both CDNs');
          }
          console.log('✅ Paddle.js loaded from fallback CDN');
        } else {
          console.log('✅ Paddle.js loaded from primary CDN');
        }

        // Validate configuration
        console.log('🔍 Validating Paddle configuration...');
        if (!validatePaddleConfig()) {
          throw new Error('Paddle configuration is invalid');
        }
        console.log('✅ Paddle configuration validated');

        // Set environment first
        const environment = PADDLE_CONFIG.environment as 'sandbox' | 'production';
        window.Paddle.Environment.set(environment);
        console.log('🌍 Paddle environment set to:', environment);

        // Initialize Paddle with token
        const token = PADDLE_CONFIG.clientToken;
        if (!token) {
          throw new Error('Paddle token is required');
        }
        
        console.log('🔑 Initializing Paddle with token:', '***' + token.slice(-4));
        
        // Initialize Paddle using the official v2 API
        window.Paddle.Initialize({ 
          token: token
        });
        
        console.log('✅ Paddle.Initialize() completed');
        
        // Small delay to ensure initialization is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the Checkout methods are available
        if (!window.Paddle.Checkout || typeof window.Paddle.Checkout.open !== 'function') {
          console.error('❌ Paddle.Checkout methods not available:', window.Paddle);
          console.error('🔍 Available Paddle methods:', Object.keys(window.Paddle));
          throw new Error('Paddle Checkout is not properly initialized');
        }

        setIsInitialized(true);
        console.log('🎉 Paddle initialized successfully!');
        console.log('🛒 Paddle.Checkout methods available');
        
      } catch (err) {
        console.error('💥 Failed to initialize Paddle:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Paddle');
      } finally {
        setIsLoading(false);
      }
    };

    console.log('🔄 PaddleContext useEffect triggered');
    initPaddle();
  }, []);

  // Open checkout for a specific plan
  const openCheckout = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Payment system is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with your purchase.",
        variant: "destructive"
      });
      return;
    }

    if (!user.email) {
      toast({
        title: "Email Required",
        description: "User email is required for checkout.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🔍 Looking up product ID for:', { planId, billingCycle });
      console.log('📦 Available products:', PADDLE_CONFIG.products);
      console.log('🔍 Raw environment variables:', {
        VITE_PADDLE_PRO_MONTHLY_ID: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID,
        VITE_PADDLE_PRO_YEARLY_ID: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID
      });
      
      const productId = PADDLE_CONFIG.products[planId as keyof typeof PADDLE_CONFIG.products]?.[billingCycle];
      
      console.log('🎯 Found product ID:', productId);
      console.log('🔍 Product ID type:', typeof productId);
      console.log('🔍 Product ID length:', productId?.length);
      
      if (!productId) {
        throw new Error(`Product ID not found for ${planId} ${billingCycle}. Please check your Paddle product configuration.`);
      }

      // Validate product ID format - check for placeholder values
      if (productId === 'pro_monthly_placeholder' || productId === 'pro_yearly_placeholder' || productId.includes('placeholder')) {
        throw new Error(`Invalid product ID: ${productId}. Please set proper Paddle product IDs in environment variables.`);
      }

      // Additional validation for Paddle product ID format
      if (!productId.startsWith('pri_') && !productId.startsWith('ppri_')) {
        console.warn('⚠️ Product ID format may be invalid. Expected format: pri_* or ppri_*');
      }

      // Log the product ID format for debugging
      console.log('🔍 Product ID analysis:', {
        id: productId,
        startsWithPpri: productId.startsWith('ppri_'),
        startsWithPri: productId.startsWith('pri_'),
        length: productId.length,
        format: productId.startsWith('ppri_') ? 'Price ID (correct for checkout)' : 
                productId.startsWith('pri_') ? 'Product ID (may need conversion)' : 'Unknown format'
      });

      // Prepare checkout data following Paddle.js v2 documentation
      // For Paddle v2, we need to use the correct format
      const checkoutData: PaddleCheckoutData = {
        items: [
          {
            price_id: productId,
            quantity: 1
          }
        ],
        customer: {
          email: user.email
        },
        custom_data: {
          userId: user.id,
          planId,
          billingCycle,
          source: 'centrabudget-web'
        },
        success_url: PADDLE_CONFIG.successUrl,
        cancel_url: PADDLE_CONFIG.cancelUrl,
        mode: 'subscription'
      };

      // Validate checkout data
      const validationErrors = validatePaddleCheckoutData(checkoutData);
      if (validationErrors.length > 0) {
        console.error('❌ Checkout data validation failed:', validationErrors);
        throw new Error('Invalid checkout data: ' + validationErrors.join(', '));
      }

      // Log checkout data for debugging
      logPaddleCheckout(checkoutData, user);
      logPaddleEnvironment();

      // Alternative checkout format - try without mode first
      const simpleCheckoutData = {
        items: [
          {
            price_id: productId,
            quantity: 1
          }
        ],
        customer: {
          email: user.email
        },
        success_url: PADDLE_CONFIG.successUrl,
        cancel_url: PADDLE_CONFIG.cancelUrl
      };

      // Minimal checkout format - just the essentials
      const minimalCheckoutData = {
        items: [
          {
            price_id: productId,
            quantity: 1
          }
        ],
        success_url: PADDLE_CONFIG.successUrl,
        cancel_url: PADDLE_CONFIG.cancelUrl
      };

      // Log the exact data being sent for debugging
      console.log('🔍 Final checkout data:', JSON.stringify(checkoutData, null, 2));
      console.log('🔍 Product ID being used:', productId);
      console.log('🔍 Billing cycle:', billingCycle);
      
      console.log('Opening Paddle checkout with data:', checkoutData);
      console.log('Paddle.Checkout available:', !!window.Paddle?.Checkout);
      console.log('Paddle.Checkout.open available:', typeof window.Paddle?.Checkout?.open);
      
      if (!window.Paddle?.Checkout?.open) {
        throw new Error('Paddle checkout is not available');
      }
      
      try {
        // Use the official Paddle.Checkout.open() method
        console.log('🔍 Attempting to open Paddle checkout...');
        console.log('📋 Checkout data being sent:', JSON.stringify(checkoutData, null, 2));
        console.log('🔍 Paddle.Checkout object:', window.Paddle.Checkout);
        console.log('🔍 Paddle.Checkout.open method:', typeof window.Paddle.Checkout.open);
        
        // Paddle v2 returns a Promise, so we need to await it
        // Try multiple checkout formats to find one that works
        let result;
        try {
          console.log('🔍 Trying minimal checkout format...');
          result = await window.Paddle.Checkout.open(minimalCheckoutData);
          console.log('✅ Paddle checkout opened successfully with minimal format', result);
        } catch (minimalError) {
          console.log('⚠️ Minimal format failed, trying simple format...', minimalError);
          try {
            result = await window.Paddle.Checkout.open(simpleCheckoutData);
            console.log('✅ Paddle checkout opened successfully with simple format', result);
          } catch (simpleError) {
            console.log('⚠️ Simple format failed, trying full format...', simpleError);
            result = await window.Paddle.Checkout.open(checkoutData);
            console.log('✅ Paddle checkout opened successfully with full format', result);
          }
        }
      } catch (checkoutError) {
        console.error('❌ Failed to open Paddle checkout:', checkoutError);
        console.error('🔍 Checkout error details:', {
          name: checkoutError instanceof Error ? checkoutError.name : 'Unknown',
          message: checkoutError instanceof Error ? checkoutError.message : 'Unknown error',
          stack: checkoutError instanceof Error ? checkoutError.stack : 'No stack trace'
        });
        throw new Error('Failed to open checkout: ' + (checkoutError instanceof Error ? checkoutError.message : 'Unknown error'));
      }
      
    } catch (err) {
      console.error('Failed to open checkout:', err);
      toast({
        title: "Checkout Error",
        description: err instanceof Error ? err.message : "Failed to open checkout. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get subscription status (placeholder for now)
  const getSubscriptionStatus = async () => {
    // This would typically call your backend API to get subscription status
    // For now, return a placeholder
    return {
      status: 'active',
      plan: 'pro',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  };

  // Cancel subscription (placeholder for now)
  const cancelSubscription = async () => {
    // This would typically call your backend API to cancel subscription
    // For now, just show a toast
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled successfully.",
      variant: "default"
    });
  };

  const value: PaddleContextType = {
    isInitialized,
    isLoading,
    error,
    openCheckout,
    getSubscriptionStatus,
    cancelSubscription
  };

  return (
    <PaddleContext.Provider value={value}>
      {children}
    </PaddleContext.Provider>
  );
};
