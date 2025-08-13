import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'transactions' | 'categories' | 'budgets' | 'aiInsights';
  currentCount: number;
  maxCount: number;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({
  isOpen,
  onClose,
  limitType,
  currentCount,
  maxCount
}) => {
  const navigate = useNavigate();

  const getLimitMessage = () => {
    switch (limitType) {
      case 'transactions':
        return `You've reached your limit of ${maxCount} transactions on the Free plan.`;
      case 'categories':
        return `You've reached your limit of ${maxCount} categories on the Free plan.`;
      case 'budgets':
        return `You've reached your limit of ${maxCount} budget on the Free plan.`;
      case 'aiInsights':
        return `You've reached your limit of ${maxCount} AI insights this month on the Free plan.`;
      default:
        return `You've reached a limit on the Free plan.`;
    }
  };

  const getFeatureTitle = () => {
    switch (limitType) {
      case 'transactions':
        return 'Unlimited Transactions';
      case 'categories':
        return 'Unlimited Categories';
      case 'budgets':
        return 'Unlimited Budgets';
      case 'aiInsights':
        return 'Unlimited AI Insights';
      default:
        return 'Unlimited Access';
    }
  };

  const handleUpgrade = () => {
    navigate('/checkout?plan=pro');
    onClose();
  };

  const handleViewPricing = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Limit Message */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {getFeatureTitle()}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {getLimitMessage()}
            </p>
          </div>

          {/* Pro Features */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Pro Plan Includes:
            </h4>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>• Unlimited {limitType === 'transactions' ? 'transactions' : limitType === 'categories' ? 'categories' : limitType === 'budgets' ? 'budgets' : 'AI insights'}</li>
              <li>• Advanced analytics & reports</li>
              <li>• Team collaboration</li>
              <li>• Priority support</li>
              <li>• API access</li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              $12<span className="text-sm font-normal text-slate-600 dark:text-slate-400">/month</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              or $115.20/year (save 20%)
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleViewPricing}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View All Plans
            </Button>
          </div>

          {/* Free Plan Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can continue using the Free plan with current limits, 
              or upgrade anytime to unlock unlimited access.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePopup;
