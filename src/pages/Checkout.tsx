import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';



const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  // Get plan from URL params
  const planFromUrl = searchParams.get('plan');

  // Auto-redirect to Paddle checkout URL when plan is specified
  useEffect(() => {
    if (planFromUrl === 'pro' && !isAutoRedirecting) {
      setIsAutoRedirecting(true);
      // Redirect directly to Paddle checkout URL
      window.location.href = 'https://sandbox-pay.paddle.io/hsc_01k3pb3y9e9ppr0f4xdwfyfzvf_9mvkexe2sfg2jswd8ysr8wvh25d5e24c';
    }
  }, [planFromUrl, isAutoRedirecting]);



  if (!user) {
    navigate('/login');
    return null;
  }

  // Show loading/redirecting message
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Redirecting to Payment...
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            You're being redirected to our secure payment processor to complete your Pro upgrade.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you're not redirected automatically, please wait a moment or refresh the page.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );

        {/* Plan Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>
              Select the billing cycle that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Monthly</h3>
                    <p className="text-gray-600 dark:text-gray-400">Billed monthly</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatUSD(9.99)}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'yearly'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Yearly</h3>
                    <p className="text-gray-600 dark:text-gray-400">Billed annually</p>
                    <Badge variant="secondary" className="mt-1">
                      Save 20%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatUSD(99.99)}
                    </div>
                    <div className="text-sm text-gray-500">per year</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You'll Get</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Unlimited Transactions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track as many expenses and income sources as you need
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">AI Financial Coach</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get personalized financial advice and insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Advanced Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed analytics and spending patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Priority Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get help when you need it most
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <div className="text-center">
          <Button
            onClick={handleCheckout}
            disabled={!isInitialized || isProcessing || paddleLoading}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            {isProcessing ? (
              'Processing...'
            ) : paddleLoading ? (
              'Loading Payment System...'
            ) : (
              `Upgrade to Pro - ${selectedPlan === 'monthly' ? formatUSD(9.99) : formatUSD(99.99)}`
            )}
          </Button>
          
          {!isInitialized && (
            <p className="text-sm text-gray-500 mt-2">
              Payment system is initializing...
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            🔒 Your payment information is secure and encrypted
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by Paddle - PCI DSS Level 1 compliant
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
