import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserPlanLimits {
  categories: number;
  budgets: number;
  transactions: number;
  aiInsights: number;
}

export interface UserPlan {
  isFreePlan: boolean;
  limits: UserPlanLimits;
  isLoading: boolean;
  error: string | null;
}

export const useUserPlan = (): UserPlan => {
  const { user } = useAuth();
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [limits, setLimits] = useState<UserPlanLimits>({
    categories: 10,
    budgets: 10,
    transactions: 10,
    aiInsights: 5
  });
  const [isLoading, setIsLoading] = useState(false); // Start as false since we have default limits
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    // For now, we'll assume all users are on the free plan
    // In a real implementation, you'd check the user's subscription status
    // from your billing system (Stripe, etc.)
    
    setIsFreePlan(true);
    setLimits({
      categories: 10,
      budgets: 10,
      transactions: 10,
      aiInsights: 5
    });

    // TODO: Implement actual subscription check
    // const { data: subscription } = await supabase
    //   .from('subscriptions')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .single();

    // if (subscription && subscription.status === 'active' && subscription.plan === 'pro') {
    //   setIsFreePlan(false);
    //   setLimits({
    //     categories: -1, // unlimited
    //     budgets: -1,    // unlimited
    //     transactions: -1, // unlimited
    //     aiInsights: -1   // unlimited
    //   });
    // }
  }, [user]);

  return {
    isFreePlan,
    limits,
    isLoading,
    error
  };
};
