import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

export interface PricingConfig {
  id: string;
  plan_id: string;
  monthly_price: number;
  yearly_price: number;
  updated_at: string;
  updated_by: string;
}

interface PricingContextType {
  plans: PricingPlan[];
  pricingConfig: PricingConfig[];
  isLoading: boolean;
  error: string | null;
  updatePricing: (planId: string, monthlyPrice: number, yearlyPrice: number) => Promise<void>;
  refreshPricing: () => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

interface PricingProviderProps {
  children: ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig[]>([]);
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
      yearlyPrice: 120.00,
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
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'For teams and organizations',
      description: 'Custom solutions with dedicated support and advanced team features.',
      monthlyPrice: null,
      yearlyPrice: null,
      isCustomPricing: true,
      customPricingText: 'Contact Us',
      features: [
        'Everything in Pro',
        'Unlimited team collaboration',
        'Advanced team analytics',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Custom reporting',
        'White-label options',
        'Advanced security features',
        'Compliance reporting'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline'
    }
  ];

  const fetchPricingConfig = async () => {
    try {
      console.log('Fetching pricing config...');
      const { data, error } = await supabase
        .from('pricing_config')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching pricing config:', error);
        // If table doesn't exist, use default plans
        console.log('Using default plans due to database error');
        setPlans(defaultPlans);
        return;
      }
      
      console.log('Pricing config data:', data);

      if (data && data.length > 0) {
        setPricingConfig(data);
        // Update plans with custom pricing
        const updatedPlans = defaultPlans.map(plan => {
          const config = data.find(c => c.plan_id === plan.id);
          if (config) {
            return {
              ...plan,
              monthlyPrice: config.monthly_price,
              yearlyPrice: config.yearly_price
            };
          }
          return plan;
        });
        setPlans(updatedPlans);
      } else {
        setPlans(defaultPlans);
      }
    } catch (err) {
      console.error('Error fetching pricing config:', err);
      console.log('Using default plans due to error');
      setPlans(defaultPlans);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePricing = async (planId: string, monthlyPrice: number, yearlyPrice: number) => {
    if (!user) throw new Error('User not authenticated');

    // Check if user has admin role from metadata
    const userRole = user.user_metadata?.role;
    console.log('User role:', userRole);
    console.log('User metadata:', user.user_metadata);
    
    if (userRole !== 'admin') {
      console.error('User does not have admin role. Current role:', userRole);
      throw new Error('User does not have admin privileges. Current role: ' + userRole);
    }

    try {
      console.log('Updating pricing for plan:', planId, 'monthly:', monthlyPrice, 'yearly:', yearlyPrice);
      console.log('User ID:', user.id);
      
      const { error } = await supabase
        .from('pricing_config')
        .upsert({
          plan_id: planId,
          monthly_price: monthlyPrice,
          yearly_price: yearlyPrice,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        }, {
          onConflict: 'plan_id'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update local state
      await refreshPricing();
    } catch (err) {
      console.error('Error updating pricing:', err);
      throw err;
    }
  };

  const refreshPricing = async () => {
    await fetchPricingConfig();
  };

  useEffect(() => {
    fetchPricingConfig();
  }, []);

  const value: PricingContextType = {
    plans,
    pricingConfig,
    isLoading,
    error,
    updatePricing,
    refreshPricing
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};
