import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PADDLE_CONFIG, validatePaddleConfig } from '@/lib/paddle-config';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Declare Paddle types globally since we're loading from CDN
declare global {
  interface Window {
    Paddle: {
      Environment: {
        set: (environment: 'sandbox' | 'production') => void;
      };
      Initialize: (config: { token: string }) => void;
      Checkout: {
        open: (checkoutData: any) => void;
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
          throw new Error('Paddle.js failed to load from CDN');
        }
        console.log('✅ Paddle.js loaded from CDN');

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
        const token = PADDLE_CONFIG.clientId;
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
      const productId = PADDLE_CONFIG.products[planId as keyof typeof PADDLE_CONFIG.products]?.[billingCycle];
      
      if (!productId) {
        throw new Error(`Product ID not found for ${planId} ${billingCycle}. Please check your Paddle product configuration.`);
      }

      // Prepare checkout data following Paddle.js v2 documentation
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
        },
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?canceled=true`
      };
      
      console.log('Opening Paddle checkout with data:', checkoutData);
      console.log('Paddle.Checkout available:', !!window.Paddle?.Checkout);
      console.log('Paddle.Checkout.open available:', typeof window.Paddle?.Checkout?.open);
      
      if (!window.Paddle?.Checkout?.open) {
        throw new Error('Paddle checkout is not available');
      }
      
      try {
        // Use the official Paddle.Checkout.open() method
        window.Paddle.Checkout.open(checkoutData);
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
