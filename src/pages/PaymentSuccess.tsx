import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Zap, Star, ArrowRight, Crown, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isActive: isSubscriptionActive, isLoading: isSubscriptionLoading, error: subscriptionError } = useRealtimeSubscription();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [webhookStatus, setWebhookStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/signup');
      return;
    }

    // Check if this is a legitimate success redirect
    const subscriptionId = searchParams.get('subscription_id');
    const checkoutId = searchParams.get('checkout_id');
    
    if (!subscriptionId && !checkoutId) {
      console.warn('No subscription or checkout ID found in URL params');
      // Still show success if user is already Pro
      if (isSubscriptionActive) {
        setShowSuccess(true);
        return;
      }
    }

    // Start processing timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      setProcessingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Simulate webhook processing stages
    const webhookTimer = setTimeout(() => {
      setWebhookStatus('processing');
    }, 3000); // Start processing after 3 seconds

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearTimeout(webhookTimer);
    };
  }, [user, navigate, searchParams, isSubscriptionActive]);

  // Show success when subscription becomes active
  useEffect(() => {
    if (isSubscriptionActive && !showSuccess) {
      setShowSuccess(true);
      setWebhookStatus('completed');
      
      // Show success toast
      toast({
        title: "🎉 Pro Account Activated!",
        description: "Welcome to CentraBudget Pro! You now have access to all premium features.",
        duration: 5000,
      });
      
      // Auto-redirect to dashboard after 5 seconds with countdown
      let countdown = 5;
      const countdownTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(countdownTimer);
          navigate('/dashboard');
        }
      }, 1000);
      
      return () => clearInterval(countdownTimer);
    }
  }, [isSubscriptionActive, showSuccess, navigate, toast]);

  // Show loading state
  if (isSubscriptionLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Setting up your Pro account...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if there's a subscription error
  if (subscriptionError) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4">
          <Card className="max-w-2xl mx-auto mt-20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Error Checking Status
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                There was an error checking your subscription status.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Error Details:</strong>
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  {subscriptionError}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // If user is still on free plan, show processing message
  if (!isSubscriptionActive && !showSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Processing
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your payment is being processed. This may take a few minutes.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 text-left">
                  <li>• Paddle processes your payment</li>
                  <li>• Your account is upgraded to Pro</li>
                  <li>• You receive access to all premium features</li>
                  <li>• You'll be redirected to the dashboard</li>
                </ul>
              </div>

              {/* Real-time status indicator */}
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {webhookStatus === 'waiting' ? 'Waiting for payment confirmation...' :
                     webhookStatus === 'processing' ? 'Processing payment...' :
                     'Payment processed!'}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      webhookStatus === 'waiting' ? 'bg-green-400 w-1/3' :
                      webhookStatus === 'processing' ? 'bg-green-500 w-2/3' :
                      'bg-green-600 w-full'
                    }`}
                  ></div>
                </div>
                
                <p className="text-xs text-green-700 dark:text-green-300 text-center">
                  Time elapsed: {processingTime}s
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 text-center mt-1">
                  {webhookStatus === 'waiting' ? 'Waiting for Paddle webhook...' :
                   webhookStatus === 'processing' ? 'This usually takes 10-30 seconds' :
                   'Your account is being upgraded!'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // User is now on Pro plan - show success
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-4">
              Welcome to Pro! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your payment was successful and your account has been upgraded to Pro. 
              You now have access to all premium features!
            </p>
            
            {/* Processing time info */}
            {processingTime > 0 && (
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Activated in {processingTime} seconds
              </div>
            )}
          </div>

          {/* Pro Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                    Unlimited Access
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Unlimited categories & budgets
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Unlimited transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    50+ AI insights per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Advanced analytics & reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-purple-900 dark:text-purple-100">
                    Premium Features
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Custom integrations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Explore Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover all the new Pro features available to you
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Up Your Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure categories, budgets, and preferences
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Start Managing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Begin tracking your finances with unlimited access
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button
              onClick={() => navigate('/subscription')}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              View Subscription
            </Button>
          </div>

          {/* Auto-redirect countdown */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              <ArrowRight className="w-4 h-4 mr-2 animate-pulse" />
              Auto-redirecting to dashboard in 5 seconds...
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-12 text-center">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 text-base">
              <CheckCircle className="w-4 h-4 mr-2" />
              Pro Account Active
            </Badge>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Thank you for choosing CentraBudget Pro! 🚀
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
