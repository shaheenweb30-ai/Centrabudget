import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePaddle } from '@/contexts/PaddleContext';
import { useToast } from '@/hooks/use-toast';

export const useUpgrade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFreePlan } = useUserPlan();
  const { openCheckout, isInitialized } = usePaddle();
  const { toast } = useToast();
  
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  const handleUpgrade = useCallback(async (billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    // If user is not logged in, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    // If user is already on Pro plan, redirect to dashboard
    if (!isFreePlan) {
      navigate('/dashboard');
      return;
    }

    // If Paddle is not initialized, redirect to pricing page
    if (!isInitialized) {
      console.warn('Paddle not initialized, redirecting to pricing page');
      navigate('/pricing');
      return;
    }

    // Open Paddle checkout for Pro plan
    try {
      console.log('🔍 Attempting to open checkout with billing cycle:', billingCycle);
      await openCheckout('pro', billingCycle);
    } catch (error) {
      console.error('Failed to open checkout:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to open checkout. Please try again.",
        variant: "destructive"
      });
      // Fallback to pricing page if checkout fails
      navigate('/pricing');
    }
  }, [user, isFreePlan, isInitialized, openCheckout, navigate, toast]);

  const handleUpgradeWithFallback = useCallback((billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    // If user is not logged in, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    // If user is already on Pro plan, redirect to dashboard
    if (!isFreePlan) {
      navigate('/dashboard');
      return;
    }

    // If Paddle is not initialized, redirect to pricing page
    if (!isInitialized) {
      navigate('/pricing');
      return;
    }

    // Open Paddle checkout for Pro plan
    openCheckout('pro', billingCycle).catch((error) => {
      console.error('Failed to open checkout:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to open checkout. Please try again.",
        variant: "destructive"
      });
      // Fallback to pricing page if checkout fails
      navigate('/pricing');
    });
  }, [user, isFreePlan, isInitialized, openCheckout, navigate, toast]);

  const showUpgradePopup = useCallback(() => {
    // If user is not logged in, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    // If user is already on Pro plan, redirect to dashboard
    if (!isFreePlan) {
      navigate('/dashboard');
      return;
    }

    // Show the plan selection popup
    setShowPlanPopup(true);
  }, [user, isFreePlan, navigate]);

  const hideUpgradePopup = useCallback(() => {
    setShowPlanPopup(false);
  }, []);

  const handlePlanSelection = useCallback(async (billingCycle: 'monthly' | 'yearly') => {
    hideUpgradePopup();
    await handleUpgrade(billingCycle);
  }, [hideUpgradePopup, handleUpgrade]);

  return {
    handleUpgrade,
    handleUpgradeWithFallback,
    showUpgradePopup,
    hideUpgradePopup,
    handlePlanSelection,
    showPlanPopup,
    canUpgrade: user && isFreePlan,
    isInitialized
  };
};
