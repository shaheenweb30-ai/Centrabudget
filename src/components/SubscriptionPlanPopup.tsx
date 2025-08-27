import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, X } from 'lucide-react';

interface SubscriptionPlanPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (billingCycle: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
}

export const SubscriptionPlanPopup: React.FC<SubscriptionPlanPopupProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  isLoading = false
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: 12.00,
      period: 'month',
      savings: null,
      popular: false
    },
    yearly: {
      price: 115.20,
      period: 'year',
      savings: 20,
      popular: true
    }
  };

  const features = [
    'Unlimited categories',
    'Unlimited budgets', 
    'Unlimited transactions',
    '50+ AI insights per month',
    'Advanced recurring detection',
    'Priority customer support',
    'Advanced analytics & reports',
    'Custom categories & tags',
    'Export to multiple formats',
    'Team collaboration features'
  ];

  const handlePlanSelect = (billingCycle: 'monthly' | 'yearly') => {
    setSelectedPlan(billingCycle);
  };

  const handleConfirm = () => {
    onSelectPlan(selectedPlan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Choose Your Pro Plan
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select the billing cycle that works best for you
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Monthly Plan */}
          <div 
            className={`relative rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              selectedPlan === 'monthly' 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handlePlanSelect('monthly')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Flexible monthly billing</p>
                  </div>
                </div>
                {selectedPlan === 'monthly' && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plans.monthly.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    /{plans.monthly.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Cancel anytime
                </p>
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div 
            className={`relative rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              selectedPlan === 'yearly' 
                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handlePlanSelect('yearly')}
          >
            {plans.yearly.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Yearly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best value</p>
                  </div>
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plans.yearly.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    /{plans.yearly.period}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Save {plans.yearly.savings}%
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    vs monthly
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Billed annually
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            What's included in Pro:
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro - ${plans[selectedPlan].price.toFixed(2)}/{plans[selectedPlan].period}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
