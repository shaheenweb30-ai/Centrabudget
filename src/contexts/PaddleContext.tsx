import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPaddleInstance, initializePaddle, type Paddle } from '@paddle/paddle-js';
import { PADDLE_CONFIG, validatePaddleConfig } from '@/lib/paddle-config';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PaddleContextType {
  paddle: Paddle | null;
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
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Check if Paddle SDK is available
        if (typeof initializePaddle !== 'function' || typeof getPaddleInstance !== 'function') {
          console.error('❌ Paddle SDK functions not available:', {
            initializePaddle: typeof initializePaddle,
            getPaddleInstance: typeof getPaddleInstance
          });
          throw new Error('Paddle SDK is not properly loaded');
        }
        console.log('✅ Paddle SDK functions available');

        // Validate configuration
        console.log('🔍 Validating Paddle configuration...');
        if (!validatePaddleConfig()) {
          throw new Error('Paddle configuration is incomplete. Please check your environment variables.');
        }
        console.log('✅ Paddle configuration validated');

        // Initialize Paddle using the new API
        const clientId = PADDLE_CONFIG.clientId;
        if (!clientId) {
          throw new Error('Paddle Client ID is required');
        }
        
        console.log('🔑 Initializing Paddle with client ID:', '***' + clientId.slice(-4));
        console.log('🌍 Paddle environment:', PADDLE_CONFIG.environment);
        console.log('📦 Paddle products:', PADDLE_CONFIG.products);
        
        await initializePaddle({
          environment: PADDLE_CONFIG.environment as 'sandbox' | 'production',
          clientId: clientId,
        });
        console.log('✅ Paddle.initialize() completed');

        // Get the Paddle instance - explicitly use v1 API
        const paddleInstance = getPaddleInstance('v1');
        console.log('🔍 Paddle v1 instance retrieved:', paddleInstance);
        
        if (!paddleInstance) {
          throw new Error('Failed to get Paddle instance');
        }
        
        // Verify the instance has the required methods
        if (!paddleInstance.Checkout || typeof paddleInstance.Checkout.open !== 'function') {
          console.error('❌ Paddle instance structure:', paddleInstance);
          throw new Error('Paddle instance is missing required Checkout methods');
        }

        setPaddle(paddleInstance);
        setIsInitialized(true);
        
        console.log('🎉 Paddle initialized successfully!', paddleInstance);
        console.log('🛒 Paddle.Checkout methods:', Object.keys(paddleInstance.Checkout || {}));
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
    if (!paddle || !isInitialized) {
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
      const productId = PADDLE_CONFIG.products[planId as keyof typeof PADDLE_CONFIG.products]?.[billingCycle];
      
      if (!productId) {
        throw new Error(`Product ID not found for ${planId} ${billingCycle}. Please check your Paddle product configuration.`);
      }

      // Prepare checkout data
      const checkoutData = {
        items: [
          {
            priceId: productId,
            quantity: 1
          }
        ],
        customer: {
          email: user.email
        },
        customData: {
          userId: user.id,
          planId,
          billingCycle,
          source: 'centrabudget-web'
        }
      };

      // Open Paddle checkout using the correct API with settings
      console.log('Opening Paddle checkout with data:', checkoutData);
      console.log('Paddle instance available:', !!paddle);
      console.log('Paddle.Checkout available:', !!paddle?.Checkout);
      console.log('Paddle.Checkout.open available:', typeof paddle?.Checkout?.open);
      
      if (!paddle?.Checkout?.open) {
        throw new Error('Paddle checkout is not available');
      }
      
      // Prepare checkout settings with success/cancel URLs
      const checkoutSettings = {
        displayMode: 'overlay',
        successUrl: window.location.origin + '/subscription?success=true',
        cancelUrl: window.location.origin + '/pricing?canceled=true'
      };
      
      console.log('Checkout settings:', checkoutSettings);
      
      try {
        paddle.Checkout.open(checkoutData, checkoutSettings);
        console.log('Paddle checkout opened successfully with settings');
      } catch (checkoutError) {
        console.error('Failed to open Paddle checkout:', checkoutError);
        throw new Error('Failed to open checkout: ' + (checkoutError instanceof Error ? checkoutError.message : 'Unknown error'));
      }
      
      // Note: Paddle.Checkout.open() is synchronous, so we don't await it
      
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
    paddle,
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
