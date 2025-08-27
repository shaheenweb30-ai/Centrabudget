import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePricing } from '@/contexts/PricingContext';
import { usePackageDescriptions } from '@/contexts/PackageDescriptionsContext';
import { useUpgrade } from '@/hooks/useUpgrade';

interface UpgradeToProPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeToProPopup: React.FC<UpgradeToProPopupProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { plans } = usePricing();
  const { descriptions, getDescriptionByPlanId } = usePackageDescriptions();
  const { handleUpgrade } = useUpgrade();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgradeClick = (planId: string) => {
    if (planId === 'pro') {
      handleUpgrade(selectedPlan);
      onClose();
    } else {
      // Navigate to checkout with the selected plan
      navigate(`/checkout?plan=${planId}&billing=${selectedPlan}`);
      onClose();
    }
  };

  const handleViewAllPlans = () => {
    navigate('/pricing');
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            Choose Your Plan
          </DialogTitle>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Start free, upgrade when you need more. Everyone starts with our free plan and can upgrade to Pro when they need advanced features.
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'yearly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Yearly
                {selectedPlan === 'yearly' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Save up to 20%
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const packageDescription = getDescriptionByPlanId(plan.id);
              const yearlySavings = getYearlySavings(plan.monthlyPrice, plan.yearlyPrice);
              const currentPrice = selectedPlan === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-200 hover:shadow-lg ${
                    plan.popular 
                      ? 'ring-2 ring-amber-500 shadow-lg scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {plan.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Pricing */}
                    <div className="text-center">
                      {currentPrice === 0 ? (
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                          Free
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                            {formatPrice(currentPrice)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {selectedPlan === 'monthly' ? 'per month' : 'per year'}
                          </div>
                          {yearlySavings && selectedPlan === 'yearly' && (
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                              Save {yearlySavings}% with yearly billing
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {packageDescription && packageDescription.is_enabled && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        {packageDescription.description}
                      </p>
                    )}

                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 6 && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
                          +{plan.features.length - 6} more features
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleUpgradeClick(plan.id)}
                      disabled={plan.id === 'free'}
                      className={`w-full ${
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
                          {plan.id === 'pro' && <Crown className="w-4 h-4 mr-2" />}
                          {plan.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                What happens when you upgrade?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When you upgrade to Pro, you immediately get access to all advanced features including unlimited categories, 
                budgets, advanced AI insights, team collaboration, and priority support.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleViewAllPlans}
              className="w-full max-w-xs"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View All Plans & Features
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProPopup;
