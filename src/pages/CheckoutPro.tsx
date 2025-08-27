import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePricing } from '@/contexts/PricingContext';
import { usePackageDescriptions } from '@/contexts/PackageDescriptionsContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, ArrowRight, Check, Star, X } from 'lucide-react';

const CheckoutPro = () => {
  const navigate = useNavigate();
  const { plans } = usePricing();
  const { descriptions, getDescriptionByPlanId } = usePackageDescriptions();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = (planId: string) => {
    // Navigate to checkout with the selected plan
    navigate(`/checkout?plan=${planId}&billing=${selectedPlan}`);
  };

  const handleViewAllPlans = () => {
    navigate('/pricing');
  };

  const formatPrice = (price: number | null): string => {
    if (price === null) return 'Custom';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getYearlySavings = (monthlyPrice: number | null, yearlyPrice: number | null): number | null => {
    if (monthlyPrice === null || yearlyPrice === null) return null;
    const yearlyTotal = monthlyPrice * 12;
    const savings = yearlyTotal - yearlyPrice;
    return Math.round((savings / yearlyTotal) * 100);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Choose Your Pro Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Everyone starts with our free plan and can upgrade to Pro when they need advanced features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-3 rounded-md text-base font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-3 rounded-md text-base font-medium transition-colors ${
                selectedPlan === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Yearly
              {selectedPlan === 'yearly' && (
                <Badge variant="secondary" className="ml-2 text-sm">
                  Save up to 20%
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => {
            const packageDescription = getDescriptionByPlanId(plan.id);
            const yearlySavings = getYearlySavings(plan.monthlyPrice, plan.yearlyPrice);
            const currentPrice = selectedPlan === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-200 hover:shadow-xl ${
                  plan.popular 
                    ? 'ring-2 ring-amber-500 shadow-xl scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                      <Star className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                    {plan.subtitle}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center">
                    {currentPrice === 0 ? (
                      <div className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                        Free
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                          {formatPrice(currentPrice)}
                        </div>
                        <div className="text-lg text-slate-600 dark:text-slate-400">
                          {selectedPlan === 'monthly' ? 'per month' : 'per year'}
                        </div>
                        {yearlySavings && selectedPlan === 'yearly' && (
                          <div className="text-lg text-green-600 dark:text-green-400 font-medium">
                            Save {yearlySavings}% with yearly billing
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {packageDescription && packageDescription.is_enabled && (
                    <p className="text-base text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                      {packageDescription.description}
                    </p>
                  )}

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg text-center">
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.slice(0, 8).map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 8 && (
                        <li className="text-center text-slate-500 dark:text-slate-400">
                          +{plan.features.length - 8} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.id === 'free'}
                    className={`w-full py-4 text-lg font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                        : plan.id === 'free'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                    }`}
                  >
                    {plan.id === 'free' ? (
                      'Current Plan'
                    ) : (
                      <>
                        {plan.id === 'pro' && <Crown className="w-5 h-5 mr-2" />}
                        {plan.buttonText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              What happens when you upgrade?
            </h4>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              When you upgrade to Pro, you immediately get access to all advanced features including unlimited categories, 
              budgets, advanced AI insights, team collaboration, and priority support.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={handleViewAllPlans}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View All Plans & Features
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPro;
