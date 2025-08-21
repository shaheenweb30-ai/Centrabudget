import React, { useState } from 'react';
import { Check, Star, Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePricing } from '@/contexts/PricingContext';
import { useSettings } from '@/contexts/SettingsContext';

interface PricingCardsProps {
  showComparison?: boolean;
  showFAQ?: boolean;
  showCTA?: boolean;
  className?: string;
}

export const PricingCards: React.FC<PricingCardsProps> = ({
  showComparison = false,
  showFAQ = false,
  showCTA = false,
  className = ''
}) => {
  const { user } = useAuth();
  const { isFreePlan, limits } = useUserPlan();
  const { plans: pricingPlans } = usePricing();
  const { formatCurrency } = useSettings();
  
  // Force USD formatting for pricing cards
  const formatUSD = (amount: number): string => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? '' : '-';
    
    try {
      // Force USD formatting regardless of user preferences
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `${sign}${formatter.format(absAmount)}`;
    } catch (error) {
      // Fallback to simple USD formatting
      return `${sign}$${absAmount.toFixed(2)}`;
    }
  };
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Transform pricing plans to match the expected format
  const plans = pricingPlans.map(plan => {
    const monthlyPrice = plan.monthlyPrice || 0;
    const yearlyPrice = plan.yearlyPrice || 0;
    const yearlySavings = billingCycle === 'yearly' && plan.id !== 'free' ? 
      (monthlyPrice * 12) - yearlyPrice : 0;
    const savingsPercentage = billingCycle === 'yearly' && plan.id !== 'free' ? 
      Math.round((yearlySavings / (monthlyPrice * 12)) * 100) : 0;

    return {
      name: plan.name,
      subtitle: plan.subtitle,
      description: plan.description,
      price: plan.isCustomPricing ? null : (billingCycle === 'yearly' ? yearlyPrice : monthlyPrice),
      period: plan.isCustomPricing ? plan.customPricingText || 'Contact Us' : (billingCycle === 'yearly' ? 'year' : 'month'),
      buttonText: plan.id === 'free' ? (user ? 'Current Plan' : 'Get Started Free') : plan.buttonText,
      buttonVariant: plan.id === 'free' ? (user ? 'outline' : 'default') : plan.buttonVariant,
      disabled: plan.id === 'free' ? (user && isFreePlan) : false,
      popular: plan.popular || false,
      yearlySavings: yearlySavings,
      savingsPercentage: savingsPercentage,
      features: plan.id === 'free' ? [
        { text: `${limits.categories} categories per month`, included: true },
        { text: `${limits.budgets} budgets per month`, included: true },
        { text: `${limits.transactions} transactions per month`, included: true },
        { text: `${limits.aiInsights} AI insights per month`, included: true },
        { text: 'Basic recurring detection', included: true },
        { text: 'Monthly budget periods', included: true },
        { text: 'Community support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Export to CSV', included: true }
      ] : plan.features.map(feature => ({ text: feature, included: true })),
      icon: plan.id === 'free' ? <Star className="w-6 h-6" /> : 
            plan.id === 'pro' ? <Zap className="w-6 h-6" /> : 
            <Users className="w-6 h-6" />
    };
  });

  const handleUpgrade = (planName: string) => {
    if (planName === 'Pro') {
      // TODO: Implement Stripe checkout
      console.log('Upgrade to Pro');
    }
  };

  return (
    <div className={className}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
          Yearly
          {(() => {
            const proPlan = pricingPlans.find(p => p.id === 'pro');
            if (proPlan && proPlan.monthlyPrice && proPlan.yearlyPrice) {
              const savings = Math.round(((proPlan.monthlyPrice * 12 - proPlan.yearlyPrice) / (proPlan.monthlyPrice * 12) * 100));
              return (
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save {savings}%
                </span>
              );
            }
            return null;
          })()}
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
              plan.popular 
                ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                : 'shadow-lg'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
            )}
            
            <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  plan.name === 'Free' ? 'bg-green-100 text-green-600' :
                  plan.name === 'Pro' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
              <CardDescription className="text-slate-600">{plan.subtitle}</CardDescription>
              <p className="text-slate-600 mt-2">{plan.description}</p>
              
              <div className="mt-6">
                <div className="flex items-baseline justify-center">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold text-slate-900">{formatUSD(plan.price)}</span>
                      <span className="text-lg text-slate-500 ml-1">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-slate-900">{plan.period}</span>
                  )}
                </div>
                
                {/* Show savings for yearly Pro plan */}
                {billingCycle === 'yearly' && plan.name === 'Pro' && plan.price !== null && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <span className="mr-1">🎉</span>
                      Save {plan.savingsPercentage}% ({formatUSD(plan.yearlySavings)}/year)
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      vs. {formatUSD((pricingPlans.find(p => p.id === 'pro')?.monthlyPrice! * 12))} billed monthly
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={() => handleUpgrade(plan.name)}
                variant={plan.buttonVariant as any}
                size="lg"
                className="w-full"
                disabled={plan.disabled}
              >
                {plan.buttonText}
                {!plan.disabled && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
              
              {plan.name === 'Free' && user && (
                <p className="text-sm text-green-600 text-center">
                  ✓ Your current plan
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
