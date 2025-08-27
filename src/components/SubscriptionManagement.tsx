import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePaddle } from '@/contexts/PaddleContext';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';

interface SubscriptionData {
  id: string;
  status: 'active' | 'cancelled' | 'paused' | 'past_due';
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paddleCustomerId?: string;
}

const SubscriptionManagement: React.FC = () => {
  const { user } = useAuth();
  const { getSubscriptionStatus, cancelSubscription } = usePaddle();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscriptionStatus();
    }
  }, [user]);

  const loadSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Failed to load subscription status:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setIsCancelling(true);
      await cancelSubscription();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the current billing period.",
        variant: "default"
      });

      // Reload subscription status
      await loadSubscriptionStatus();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'past_due':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Paused</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Past Due</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading subscription...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-600 mb-4">
              You don't have an active subscription. Upgrade to Pro to unlock all features.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(subscription.status)}
              {getStatusBadge(subscription.status)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Plan</span>
            <span className="font-semibold text-gray-900">{subscription.plan}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Current Period</span>
            <span className="text-sm text-gray-900">
              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>

          {subscription.paddleCustomerId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Customer ID</span>
              <span className="text-sm text-gray-900 font-mono">
                {subscription.paddleCustomerId.slice(-8)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Next Billing Date</span>
            <span className="text-sm text-gray-900">
              {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Auto-Renewal</span>
            <span className="text-sm text-gray-900">
              {subscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
            </span>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Manage Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
            >
              {isCancelling ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Cancel Subscription
            </Button>
          )}

          {subscription.status === 'cancelled' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Your subscription has been cancelled. You'll continue to have access until the end of your billing period.
                </span>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Need help? Contact our support team for assistance with your subscription.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
