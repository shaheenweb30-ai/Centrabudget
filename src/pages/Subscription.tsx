import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  CheckCircle, 
  XCircle, 
  Package, 
  Zap, 
  BarChart3,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useAuth } from "@/contexts/AuthContext";
import { usePricing } from "@/contexts/PricingContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const { user } = useAuth();
  const { isFreePlan, limits, isLoading } = useUserPlan();
  const { plans } = usePricing();
  const { formatCurrency } = useSettings();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  
  // Get Pro plan pricing
  const proPlan = plans.find(p => p.id === 'pro');
  const monthlyPrice = proPlan?.monthlyPrice || 12.00;
  const yearlyPrice = proPlan?.yearlyPrice || 120.00;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  // Mock data for current usage - in a real app, this would come from the database
  const currentUsage = {
    categories: 3,
    budgets: 2,
    transactions: 7,
    aiInsights: 1
  };

  const handleUpgrade = () => {
    setUpgrading(true);
    // Navigate to checkout page
    navigate('/checkout?plan=pro');
    setUpgrading(false);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Loading Subscription</h3>
              <p className="text-slate-600 dark:text-slate-400">Please wait while we load your subscription details...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Subscription & Billing
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage your plan and view your current usage
            </p>
          </div>

          {/* Current Plan Card */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      Current Plan
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      {isFreePlan ? 'Free Plan' : 'Pro Plan'}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={isFreePlan ? "secondary" : "default"}
                  className={`text-sm px-3 py-1 ${
                    isFreePlan 
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  }`}
                >
                  {isFreePlan ? 'Free' : 'Pro'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700 dark:text-slate-300">Plan Features</h4>
                  <div className="space-y-2">
                    {isFreePlan ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Basic transaction tracking
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Limited categories and budgets
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Basic reporting
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Unlimited transactions
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Unlimited categories & budgets
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Advanced AI insights
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Priority support
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700 dark:text-slate-300">Plan Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Status:</span>
                      <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-700 dark:text-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Next billing:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {isFreePlan ? 'N/A' : 'Monthly'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Current Usage
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Track your current usage against plan limits
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Categories</span>
                    </div>
                    <span className={`text-sm font-semibold ${getUsageTextColor(getUsagePercentage(currentUsage.categories, limits.categories))}`}>
                      {currentUsage.categories}/{limits.categories === -1 ? '∞' : limits.categories}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(currentUsage.categories, limits.categories)} 
                    className="h-2"
                  />
                  <div className={`w-3 h-3 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.categories, limits.categories))} mx-auto`} />
                </div>

                {/* Budgets Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Budgets</span>
                    </div>
                    <span className={`text-sm font-semibold ${getUsageTextColor(getUsagePercentage(currentUsage.budgets, limits.budgets))}`}>
                      {currentUsage.budgets}/{limits.budgets === -1 ? '∞' : limits.budgets}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(currentUsage.budgets, limits.budgets)} 
                    className="h-2"
                  />
                  <div className={`w-3 h-3 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.budgets, limits.budgets))} mx-auto`} />
                </div>

                {/* Transactions Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Transactions</span>
                    </div>
                    <span className={`text-sm font-semibold ${getUsageTextColor(getUsagePercentage(currentUsage.transactions, limits.transactions))}`}>
                      {currentUsage.transactions}/{limits.transactions === -1 ? '∞' : limits.transactions}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(currentUsage.transactions, limits.transactions)} 
                    className="h-2"
                  />
                  <div className={`w-3 h-3 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.transactions, limits.transactions))} mx-auto`} />
                </div>

                {/* AI Insights Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Insights</span>
                    </div>
                    <span className={`text-sm font-semibold ${getUsageTextColor(getUsagePercentage(currentUsage.aiInsights, limits.aiInsights))}`}>
                      {currentUsage.aiInsights}/{limits.aiInsights === -1 ? '∞' : limits.aiInsights}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(currentUsage.aiInsights, limits.aiInsights)} 
                    className="h-2"
                  />
                  <div className={`w-3 h-3 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.aiInsights, limits.aiInsights))} mx-auto`} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          {isFreePlan && (
            <Card className="rounded-xl border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm shadow-lg border border-amber-200/50 dark:border-amber-700/50">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Ready to Upgrade to Pro?
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Unlock unlimited features and take your financial management to the next level
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        Pro Benefits
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• Unlimited transactions</li>
                        <li>• Unlimited categories & budgets</li>
                        <li>• Advanced AI insights</li>
                        <li>• Priority support</li>
                        <li>• Export & backup features</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        What You Get
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• Remove all usage limits</li>
                        <li>• Access to premium features</li>
                        <li>• Better data insights</li>
                        <li>• Enhanced security</li>
                        <li>• Regular updates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        Upgrade to Pro: {formatCurrency(monthlyPrice)}/month or {formatCurrency(yearlyPrice)}/year (one-time payment)
                      </div>
                      {yearlySavings > 0 && (
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                          Save {formatCurrency(yearlySavings)} annually with yearly billing
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleUpgrade}
                      disabled={upgrading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {upgrading ? (
                        'Processing...'
                      ) : (
                        <>
                          Upgrade to Pro
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                      30-day money-back guarantee • Cancel anytime
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Plan Details */}
          {!isFreePlan && (
            <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg border border-green-200/50 dark:border-green-700/50">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    You're Already on Pro!
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Enjoy unlimited access to all features and premium support
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                                  <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Thank you for being a Pro subscriber. You have access to all premium features.
                    </p>
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Current Pricing: {formatCurrency(monthlyPrice)}/month or {formatCurrency(yearlyPrice)}/year (one-time payment)
                      </div>
                      {yearlySavings > 0 && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Save {formatCurrency(yearlySavings)} annually with yearly billing
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/settings?tab=billing')}
                      className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                    >
                      Manage Billing
                    </Button>
                  </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
