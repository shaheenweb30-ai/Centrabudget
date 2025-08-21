import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  isCustomPricing?: boolean;
  customPricingText?: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  disabled?: boolean;
}

interface PricingContextType {
  plans: PricingPlan[];
  isLoading: boolean;
  error: string | null;
  updatePricing: (planId: string, monthlyPrice: number, yearlyPrice: number) => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default plans structure
  const defaultPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      subtitle: 'Perfect for getting started',
      description: 'Everything you need to begin your financial journey. No credit card required.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '10 categories per month',
        '10 budgets per month',
        '10 transactions per month',
        '5 AI insights per month',
        'Basic recurring detection',
        'Monthly budget periods',
        'Community support',
        'Mobile app access',
        'Basic reports',
        'Export to CSV'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'default'
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Best for growing users',
      description: 'Advanced features for users who need more power and flexibility.',
      monthlyPrice: 12.00,
      yearlyPrice: 115.20, // 20% discount: (12 * 12) * 0.8 = 144 * 0.8 = 115.20
      features: [
        'Unlimited categories',
        'Unlimited budgets',
        'Unlimited transactions',
        '50+ AI insights per month',
        'Advanced recurring detection',
        'Custom budget periods',
        'Receipt attachments',
        'Team collaboration (up to 5 users)',
        'API access',
        'Priority support (email + chat)',
        'Advanced analytics',
        'Custom categories',
        'Budget templates',
        'Financial goals tracking',
        'Investment tracking'
      ],
      popular: true,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default'
    }
  ];

  const fetchPricingConfig = async () => {
    try {
      // Since pricing_config table doesn't exist, just use default plans
      setPlans(defaultPlans);
    } catch (err) {
      console.error('Error in pricing setup:', err);
      setPlans(defaultPlans);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePricing = async (planId: string, monthlyPrice: number, yearlyPrice: number) => {
    if (!user) throw new Error('User not authenticated');

    // Check if user has admin role from metadata
    const userRole = user.user_metadata?.role;
    
    if (userRole !== 'admin') {
      throw new Error('User does not have admin privileges. Current role: ' + userRole);
    }

    // Since pricing_config table doesn't exist, just update local state
    const updatedPlans = plans.map(plan => 
      plan.id === planId 
        ? { ...plan, monthlyPrice, yearlyPrice }
        : plan
    );
    
    setPlans(updatedPlans);
  };

  useEffect(() => {
    fetchPricingConfig();
  }, []);

  const value: PricingContextType = {
    plans,
    isLoading,
    error,
    updatePricing
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};
