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
        if (typeof initializePaddle !== 'function') {
          console.error('❌ Paddle SDK functions not available:', {
            initializePaddle: typeof initializePaddle
          });
          throw new Error('Paddle SDK is not properly loaded');
        }
        console.log('✅ Paddle SDK functions available');

        // Validate configuration
        console.log('🔍 Validating Paddle configuration...');
        if (!validatePaddleConfig()) {
          throw new Error('Paddle configuration is invalid');
        }
        console.log('✅ Paddle configuration validated');

        // Initialize Paddle using the v2 API with token instead of clientId
        const token = PADDLE_CONFIG.clientId; // Your client ID is the token
        if (!token) {
          throw new Error('Paddle token is required');
        }
        
        console.log('🔑 Initializing Paddle with token:', '***' + token.slice(-4));
        console.log(' Paddle environment:', PADDLE_CONFIG.environment);
        
        // Initialize Paddle with v2 API
        const paddleInstance = await initializePaddle({
          environment: PADDLE_CONFIG.environment as 'sandbox' | 'production',
          token: token, // Use token instead of clientId
        });
        
        if (!paddleInstance) {
          throw new Error('Failed to initialize Paddle');
        }
        
        console.log('✅ Paddle initialized successfully:', paddleInstance);
        
        // Verify the instance has the required methods
        if (!paddleInstance.Checkout || typeof paddleInstance.Checkout.open !== 'function') {
          console.error('❌ Paddle instance structure:', paddleInstance);
          throw new Error('Paddle instance is missing required Checkout methods');
        }

        setPaddle(paddleInstance);
        setIsInitialized(true);
        
        console.log(' Paddle initialized successfully!', paddleInstance);
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

      // Prepare checkout data for v2 API
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
      
      console.log('Opening Paddle checkout with data:', checkoutData);
      console.log('Paddle instance available:', !!paddle);
      console.log('Paddle.Checkout available:', !!paddle?.Checkout);
      console.log('Paddle.Checkout.open available:', typeof paddle?.Checkout?.open);
      
      if (!paddle?.Checkout?.open) {
        throw new Error('Paddle checkout is not available');
      }
      
      try {
        // Use v2 API checkout method - no need for additional settings
        paddle.Checkout.open(checkoutData);
        console.log('Paddle checkout opened successfully');
      } catch (checkoutError) {
        console.error('Failed to open Paddle checkout:', checkoutError);
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
