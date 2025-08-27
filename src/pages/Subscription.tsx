import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight, Home, Dashboard, CreditCard } from 'lucide-react';


const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [subscriptionStatus, setSubscriptionStatus] = useState<'success' | 'cancelled' | 'loading'>('loading');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);


  // Get status from URL params
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (success === 'true') {
      setSubscriptionStatus('success');
      toast({
        title: "Welcome to Pro! 🎉",
        description: "Your subscription has been activated successfully.",
        variant: "default"
      });
    } else if (canceled === 'true') {
      setSubscriptionStatus('cancelled');
      toast({
        title: "Checkout Cancelled",
        description: "Your checkout was cancelled. You can try again anytime.",
        variant: "default"
      });
    } else {
      setSubscriptionStatus('loading');
    }
  }, [success, canceled, toast]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (subscriptionStatus === 'loading') {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (subscriptionStatus === 'success') {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Pro! 🎉
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your subscription has been activated successfully
            </p>
          </div>

          {/* Subscription Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Billing Cycle:</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next Billing:</span>
                  <span className="font-medium">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Here are some things you can do with your new Pro account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Explore Advanced Features</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try out unlimited transactions and advanced reports
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Get AI Financial Coaching</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive personalized financial advice and insights
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Set Up Your Budget</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create unlimited categories and budget goals
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <Dashboard className="w-4 h-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (subscriptionStatus === 'cancelled') {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Cancelled Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Checkout Cancelled
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No worries! You can upgrade to Pro anytime
            </p>
          </div>

          {/* Why Upgrade */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Why Upgrade to Pro?</CardTitle>
              <CardDescription>
                Unlock the full potential of CentraBudget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Unlimited Transactions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track as many expenses and income sources as you need
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">AI Financial Coach</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get personalized financial advice and insights
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Advanced Reports</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Detailed analytics and spending patterns
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/checkoutpro')} className="flex items-center gap-2">
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/checkoutpro')} className="flex items-center gap-2">
              View Plans
            </Button>
          </div>
        </div>
        

      </DashboardLayout>
    );
  }

  return null;
};

export default Subscription;
