import React, { useState } from 'react';
import { Check, Star, Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      subtitle: 'Perfect for getting started',
      description: 'Everything you need to begin your financial journey. No credit card required.',
      price: 0,
      period: 'forever',
      buttonText: user ? 'Current Plan' : 'Get Started Free',
      buttonVariant: user ? 'outline' : 'default',
      disabled: user && isFreePlan,
      popular: false,
      features: [
        { text: `${limits.categories} categories per month`, included: true },
        { text: `${limits.budgets} budgets per month`, included: true },
        { text: `${limits.transactions} transactions per month`, included: true },
        { text: `${limits.aiInsights} AI insights per month`, included: true },
        { text: 'Basic recurring detection', included: true },
        { text: 'Monthly budget periods', included: true },
        { text: 'Community support', included: true },
        { text: 'Mobile app access', included: true }
      ],
      icon: <Star className="w-6 h-6" />
    },
    {
      name: 'Pro',
      subtitle: 'Best for growing users',
      description: 'Advanced features for users who need more power and flexibility.',
      price: billingCycle === 'yearly' ? 10 : 12,
      period: billingCycle === 'yearly' ? 'month, billed yearly' : 'month',
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      disabled: false,
      popular: true,
      features: [
        { text: 'Unlimited categories', included: true },
        { text: 'Unlimited budgets', included: true },
        { text: 'Unlimited transactions', included: true },
        { text: '50+ AI insights per month', included: true },
        { text: 'Advanced recurring detection', included: true },
        { text: 'Custom budget periods', included: true },
        { text: 'Receipt attachments', included: true },
        { text: 'Team collaboration (up to 5 users)', included: true },
        { text: 'API access', included: true },
        { text: 'Priority support (email + chat)', included: true }
      ],
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Enterprise',
      subtitle: 'For teams and organizations',
      description: 'Custom solutions with dedicated support and advanced team features.',
      price: 29,
      period: 'month',
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      disabled: false,
      popular: false,
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited team collaboration', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White-label options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom onboarding', included: true },
        { text: 'SLA guarantees', included: true },
        { text: 'Advanced security features', included: true }
      ],
      icon: <Users className="w-6 h-6" />
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@clearcents.com?subject=Enterprise%20Plan%20Inquiry';
    } else if (planName === 'Pro') {
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
          <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Save 17%
          </span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-lg text-slate-500 ml-1">/{plan.period}</span>
                </div>
                {billingCycle === 'yearly' && plan.name === 'Pro' && (
                  <p className="text-sm text-green-600 mt-1">Save $24/year</p>
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
