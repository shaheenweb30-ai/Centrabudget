import { useState, useEffect, useCallback } from 'react';
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
  currentPlan: string;
  displayPlan: string;
  role: string;
  refreshPlan: () => Promise<void>;
  clearCache: () => void;
  clearCacheForUser: (userId: string) => void;
}

export const useUserPlan = (): UserPlan => {
  const { user } = useAuth();
  const [isFreePlan, setIsFreePlan] = useState<boolean | null>(null); // null = unknown/loading
  const [currentPlan, setCurrentPlan] = useState<string | null>(null); // null = unknown/loading
  const [role, setRole] = useState<string | null>(null); // null = unknown/loading
  const [limits, setLimits] = useState<UserPlanLimits | null>(null); // null = unknown/loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPlan = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setIsFreePlan(false);
      setCurrentPlan(null);
      setRole(null);
      setLimits(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if we have cached plan data for this user
      const cacheKey = `user_plan_${user.id}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const now = Date.now();
          // Cache is valid for 5 minutes
          if (now - parsed.timestamp < 5 * 60 * 1000) {
            setCurrentPlan(parsed.currentPlan);
            setIsFreePlan(parsed.isFreePlan);
            setRole(parsed.role);
            setLimits(parsed.limits);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // Invalid cache, continue with fresh fetch
        }
      }

      // Fetch all user roles from user_roles table
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roleError) {
        console.error('Error fetching user roles:', roleError);
        setError('Failed to fetch user plan');
        return;
      }

      // Determine the highest priority role and plan
      const roles = userRoles?.map(r => r.role) || [];
      const hasAdminRole = roles.includes('admin');
      const hasSubscriberRole = roles.includes('subscriber');
      
      // Set the primary role (admin takes precedence for display)
      const primaryRole = hasAdminRole ? 'admin' : hasSubscriberRole ? 'subscriber' : 'user';
      setRole(primaryRole);

      let planData: {
        currentPlan: string;
        isFreePlan: boolean;
        limits: UserPlanLimits;
        displayPlan: string; // For UI display purposes
      };

      // Determine plan and limits based on roles
      if (hasAdminRole && hasSubscriberRole) {
        // Admin + Pro user - unlimited access, show as "Admin Pro"
        planData = {
          currentPlan: 'admin_pro',
          isFreePlan: false,
          displayPlan: 'Admin Pro',
          limits: {
            categories: -1, // unlimited
            budgets: -1,    // unlimited
            transactions: -1, // unlimited
            aiInsights: -1   // unlimited
          }
        };
      } else if (hasAdminRole) {
        // Admin user only - unlimited access
        planData = {
          currentPlan: 'admin',
          isFreePlan: false,
          displayPlan: 'Admin',
          limits: {
            categories: -1, // unlimited
            budgets: -1,    // unlimited
            transactions: -1, // unlimited
            aiInsights: -1   // unlimited
          }
        };
      } else if (hasSubscriberRole) {
        // Pro user - unlimited access
        planData = {
          currentPlan: 'pro',
          isFreePlan: false,
          displayPlan: 'Pro',
          limits: {
            categories: -1, // unlimited
            budgets: -1,    // unlimited
            transactions: -1, // unlimited
            aiInsights: -1   // unlimited
          }
        };
      } else {
        // Free user - limited access
        planData = {
          currentPlan: 'free',
          isFreePlan: true,
          displayPlan: 'Free',
          limits: {
            categories: 10,
            budgets: 10,
            transactions: 10,
            aiInsights: 5
          }
        };
      }

      // Update state
      setCurrentPlan(planData.currentPlan);
      setIsFreePlan(planData.isFreePlan);
      setLimits(planData.limits);

      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify({
        ...planData,
        timestamp: Date.now()
      }));

      console.log('User plan updated:', {
        userId: user.id,
        roles: roles,
        primaryRole: primaryRole,
        currentPlan: planData.currentPlan,
        displayPlan: planData.displayPlan,
        isFreePlan: planData.isFreePlan
      });

    } catch (error) {
      console.error('Error fetching user plan:', error);
      setError('Failed to fetch user plan');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshPlan = useCallback(async () => {
    await fetchUserPlan();
  }, [fetchUserPlan]);

  const clearCache = useCallback(() => {
    if (user) {
      const cacheKey = `user_plan_${user.id}`;
      sessionStorage.removeItem(cacheKey);
    }
  }, [user]);

  // Function to clear cache for a specific user (useful for admin operations)
  const clearCacheForUser = useCallback((userId: string) => {
    const cacheKey = `user_plan_${userId}`;
    sessionStorage.removeItem(cacheKey);
  }, []);

  useEffect(() => {
    fetchUserPlan();
  }, [fetchUserPlan]);

  // Return safe values - if still loading, return null/loading states
  return {
    isFreePlan: isFreePlan ?? false, // Default to false if still loading
    limits: limits ?? {
      categories: 10,
      budgets: 10,
      transactions: 10,
      aiInsights: 5
    },
    isLoading,
    error,
    currentPlan: currentPlan ?? 'free', // Default to free if still loading
    displayPlan: currentPlan === 'admin_pro' ? 'Admin Pro' : 
                 currentPlan === 'admin' ? 'Admin' : 
                 currentPlan === 'pro' ? 'Pro' : 'Free',
    role: role ?? 'user', // Default to user if still loading
    refreshPlan,
    clearCache,
    clearCacheForUser
  };
};
