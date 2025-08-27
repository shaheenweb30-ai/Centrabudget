import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  isActive: boolean;
  planId: string | null;
  status: string | null;
  billingCycle: string | null;
  currentPeriodEnd: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useRealtimeSubscription = (): SubscriptionStatus => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    planId: null,
    status: null,
    billingCycle: null,
    currentPeriodEnd: null,
    isLoading: true,
    error: null
  });

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setSubscription(prev => ({ ...prev, isLoading: true, error: null }));

      // Check user_roles table for subscriber role
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roleError) {
        console.error('Error fetching user roles:', roleError);
        setSubscription(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to fetch subscription status' 
        }));
        return;
      }

      const hasSubscriberRole = userRoles?.some(r => r.role === 'subscriber') || false;

      if (hasSubscriberRole) {
        // User has subscriber role - they are Pro
        setSubscription({
          isActive: true,
          planId: 'pro',
          status: 'active',
          billingCycle: null, // We don't have this info yet
          currentPeriodEnd: null, // We don't have this info yet
          isLoading: false,
          error: null
        });
      } else {
        // User doesn't have subscriber role
        setSubscription({
          isActive: false,
          planId: null,
          status: null,
          billingCycle: null,
          currentPeriodEnd: null,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscription(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to fetch subscription status' 
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    console.log('🔍 useRealtimeSubscription: Setting up real-time monitoring for user:', user.id);

    // Initial fetch
    fetchSubscriptionStatus();

    // Set up real-time subscription to user_roles table
    const userRolesChannel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Refetch subscription status when user roles change
          console.log('🔍 User roles changed, refetching subscription status...', payload);
          fetchSubscriptionStatus();
        }
      )
      .subscribe((status) => {
        console.log('🔍 User roles channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ User roles real-time channel connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ User roles real-time channel error');
        }
      });

    // Note: user_subscriptions table doesn't exist yet, so we only monitor user_roles
    // The webhook will update user_roles when a subscription is created
    console.log('ℹ️ user_subscriptions table not available, monitoring user_roles only');

    // Cleanup
    return () => {
      supabase.removeChannel(userRolesChannel);
    };
  }, [user, fetchSubscriptionStatus]);

  return subscription;
};
