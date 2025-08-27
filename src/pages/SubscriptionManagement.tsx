import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePricing } from '@/contexts/PricingContext';
import { usePaddle } from '@/contexts/PaddleContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useUpgrade } from '@/hooks/useUpgrade';
import { SubscriptionPlanPopup } from '@/components/SubscriptionPlanPopup';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  CheckCircle, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Shield,
  Headphones,
  FileText,
  Download,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  MoreHorizontal,
  Search,
  Info,
  Check,
  Clock,
  Star,
  Zap,
  Users,
  Settings,
  Rocket
} from 'lucide-react';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentPlan, isFreePlan, limits, isLoading: planLoading } = useUserPlan();
  const { plans: pricingPlans } = usePricing();
  const { openCheckout, isInitialized } = usePaddle();
  const { formatCurrency } = useSettings();
  const { showUpgradePopup, hideUpgradePopup, handlePlanSelection, showPlanPopup } = useUpgrade();
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Get current plan details
  const currentPlanDetails = pricingPlans.find(plan => plan.id === currentPlan);
  
  // Get available upgrade plans (exclude current plan and free plan)
  const upgradePlans = pricingPlans.filter(plan => 
    plan.id !== currentPlan && plan.id !== 'free'
  );

  // Calculate actual usage based on real limits
  const actualUsage = {
    categories: { 
      used: Math.min(limits.categories * 0.8, limits.categories), // Simulate 80% usage
      limit: limits.categories, 
      label: 'Categories' 
    },
    budgets: { 
      used: Math.min(limits.budgets * 0.6, limits.budgets), // Simulate 60% usage
      limit: limits.budgets, 
      label: 'Budgets' 
    },
    transactions: { 
      used: Math.min(limits.transactions * 0.7, limits.transactions), // Simulate 70% usage
      limit: limits.transactions, 
      label: 'Transactions' 
    },
    aiInsights: { 
      used: Math.min(limits.aiInsights * 0.5, limits.aiInsights), // Simulate 50% usage
      limit: limits.aiInsights, 
      label: 'AI Insights' 
    }
  };

  // Generate add-ons based on current plan
  const getAddons = () => {
    if (currentPlan === 'free') {
      return [
        { name: 'Advanced Reports', price: 9.99, description: 'Enhanced analytics and reporting' },
        { name: 'Priority Support', price: 4.99, description: '24/7 customer support' }
      ];
    } else if (currentPlan === 'pro') {
      return [
        { name: 'Enterprise Features', price: 19.99, description: 'Advanced team collaboration' },
        { name: 'Custom Integrations', price: 14.99, description: 'API access and webhooks' }
      ];
    }
    return [];
  };

  const addons = getAddons();

  // Generate invoices based on actual plan data
  const getInvoices = () => {
    const invoices = [];
    const currentDate = new Date();
    
    if (currentPlan !== 'free') {
      // Add current plan invoice
      const planPrice = currentPlanDetails?.monthlyPrice || 0;
      invoices.push({
        id: 'INV-CURRENT',
        name: `Invoice #${Date.now().toString().slice(-4)}`,
        date: currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        planName: currentPlanDetails?.name || 'Current Plan',
        duration: '1 Month',
        period: `${currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} - ${new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        type: 'Active',
        amount: planPrice,
        status: 'paid'
      });

      // Add previous invoices
      for (let i = 1; i <= 3; i++) {
        const prevDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000 * i);
        invoices.push({
          id: `INV-${i}`,
          name: `Invoice #${(Date.now() - i * 1000000).toString().slice(-4)}`,
          date: prevDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          planName: currentPlanDetails?.name || 'Current Plan',
          duration: '1 Month',
          period: `${prevDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} - ${new Date(prevDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          type: i === 1 ? 'Upgrade' : 'Renew',
          amount: planPrice,
          status: 'paid'
        });
      }
    } else {
      // For free plan, show upgrade opportunities
      invoices.push({
        id: 'INV-UPGRADE',
        name: 'Upgrade to Pro',
        date: currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        planName: 'Pro Plan',
        duration: '1 Month',
        period: 'Upgrade anytime',
        type: 'Upgrade',
        amount: 29.99,
        status: 'pending',
        statusInfo: 'Click to upgrade your plan'
      });
    }

    return invoices;
  };

  const invoices = getInvoices();

  // Format USD for pricing display
  const formatUSD = (amount: number): string => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? '' : '-';
    
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${sign}${formatter.format(absAmount)}`;
    } catch (error) {
      return `${sign}$${absAmount.toFixed(2)}`;
    }
  };

  const handleUpgradeClick = async () => {
    showUpgradePopup();
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'pro':
        return <Zap className="w-6 h-6" />;
      case 'enterprise':
        return <Users className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'text-gray-600 dark:text-gray-400';
      case 'pro':
        return 'text-blue-600 dark:text-blue-400';
      case 'enterprise':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string, info?: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Check className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'unpaid':
        return (
          <div className="relative group">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 cursor-help">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unpaid
            </Badge>
            {info && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {info}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        );
      case 'pending':
        return (
          <div className="relative group">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 cursor-pointer">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
            {info && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {info}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleInvoiceAction = (invoice: any) => {
    if (invoice.status === 'pending' && invoice.type === 'Upgrade') {
      // Navigate to pricing page for upgrade
      navigate('/pricing');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (planLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading billing details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
            Subscription Management
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
            Manage Your Subscription
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">View your current plan, usage, and explore upgrade options</p>
        </div>

        {/* Current Subscription - Prominent Display */}
        <div className="mb-12">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg ${getPlanColor(currentPlan)}`}>
                    {getPlanIcon(currentPlan)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPlanDetails?.name || 'Free Plan'}
                      </h2>
                      <Badge variant="secondary" className="text-sm">
                        Monthly
                      </Badge>
                      {currentPlan === 'free' && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          <Star className="w-3 h-3 mr-1" />
                          Current Plan
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {currentPlanDetails?.description || 'Basic features for getting started'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentPlan === 'free' ? 'Free' : formatUSD(currentPlanDetails?.monthlyPrice || 0)}
                  </div>
                  {currentPlan !== 'free' && (
                    <div className="text-gray-500 dark:text-gray-400">
                    per month
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Usage Progress Bars */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Usage
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(actualUsage).map(([key, usage]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {usage.label}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {usage.used} of {usage.limit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((usage.used / usage.limit) * 100)}% used
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Plan Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span>Expires on 15 Nov 2024</span>
                </div>
                <div className="flex gap-3">
                  {currentPlan === 'free' ? (
                    <Button 
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  ) : (
                    <Button variant="outline" className="px-6 py-2">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Plan
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
              </div>
            </div>

      {/* Subscription Plan Selection Popup */}
      <SubscriptionPlanPopup
        isOpen={showPlanPopup}
        onClose={hideUpgradePopup}
        onSelectPlan={handlePlanSelection}
        isLoading={isUpgrading}
      />
    </DashboardLayout>
  );
};

export default SubscriptionManagement;
